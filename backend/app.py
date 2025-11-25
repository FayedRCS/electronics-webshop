from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os


app = Flask(__name__)
CORS(app)

# absolute path for frontend dir
frontend_folder = os.path.join(os.path.dirname(__file__), '..', 'frontend')

# API enpoint for å hente alle produkter
@app.route("/api/products")
def get_products():
    connection = sqlite3.connect("store.db")
    cursor = connection.cursor()
    #prep alle radene i products tabell
    cursor.execute("SELECT * FROM products")
    rows = cursor.fetchall() #legg i rows

    connection.close()

    products = [] # converterer liste med tuples til dict i python, for bedre JSON

    for row in rows:
        product = {
            "id": row[0],
            "name": row[1],
            "price": row[2],
            "stock": row[3],
            "img_url": row[4] if len(row) > 4 else None # NB!! Koden knuses hvis flere tabeller legges til i products db !!
        }
    
        products.append(product)

    return jsonify(products)
#API endpoint for ett produkt
@app.route("/api/products/<int:product_id>")
def get_product(product_id): #enestående produkt

    connection = sqlite3.connect("store.db")
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,)) # komma for tuple, slik at sqlite can lese og fylle placeholder
    row = cursor.fetchone()

    connection.close()

    if row == None: #hvis produkt id ikke er i URL, kast error
        return jsonify({"Error":"Produktet finnes ikke"}), 404 

    # Tuple til dict
    product = {
        "id": row[0],
        "name": row[1],
        "price": row[2],
        "stock": row[3],
        "img_url": row[4] if len(row) > 4 else None
    }

    return jsonify(product)

#serve frontend filer
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path == "":
        path = "index.html"

    if path.startswith("api/"):
        return jsonify({"error": "Not found"}), 404
    
    try:
        return send_from_directory(frontend_folder, path)
    except:
        return send_from_directory(frontend_folder, "index.html")

##@app.route("/<path:path>")
##def serve_static(path):
##    return send_from_directory("/frontend", path)

if __name__ == "__main__":
    app.run(debug=True)