import sqlite3

connection = sqlite3.connect("store.db") # Koble til database fil -> lag hvis ikke eksister
cursor = connection.cursor() # verktøy for å utføre commands

cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
               id INTEGER PRIMARY KEY,
               name TEXT NOT NULL,
               price REAL NOT NULL,
               stock INTEGER NOT NULL
               )
""")

#Legg til produktene
products = [
    ("Resistor", 5.00, 1),
    ("Capacitor", 12.00, 1),
    ("Arduino Uno", 299.00, 1),
    ("LED", 2.00, 1),
    ("LCD1602", 99.00, 1),
    ("OV6767", 99.00, 1),
    ("Arduino Starter-kit", 499.00, 1),
    ("ESP32", 150.00, 1),
]

cursor.executemany("""
    INSERT INTO products (name, price, stock)
    VALUES (?, ?, ?)
""", products)

connection.commit()
connection.close()

print("database created -> products added")