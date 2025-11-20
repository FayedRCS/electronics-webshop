import sqlite3

connection = sqlite3.connect("store.db")
cursor = connection.cursor()

cursor.execute("SELECT * FROM products")
rows = cursor.fetchall()

connection.close()

print(rows)