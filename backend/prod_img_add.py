import sqlite3

connection = sqlite3.connect("store.db") # connect til samme db some app.py

cursor = connection.cursor()

#Lag ny kolonne i product tabell
cursor.execute("ALTER TABLE products ADD COLUMN image_url TEXT")

images = {
    'Resistor': 'https://res.cloudinary.com/rsc/image/upload/b_rgb:FFFFFF,c_pad,dpr_2.625,f_auto,h_214,q_auto,w_380/c_pad,h_214,w_380/F7078669-01?pgw=1',
    'Capacitor': 'https://res.cloudinary.com/rsc/image/upload/b_rgb:FFFFFF,c_pad,dpr_2.625,f_auto,h_214,q_auto,w_380/c_pad,h_214,w_380/F7111340-01?pgw=1',
    'Arduino Uno': 'https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg',
    'LED': 'https://paperquirks.in/cdn/shop/files/SMALLLEDBULB.jpg?v=1721458440',
    'LCD1602': 'https://www.waveshare.com/img/devkit/LCD/LCD1602-I2C-Module/LCD1602-I2C-Module-details-1.jpg',
    'OV6767': 'https://epartners.co.nz/cdn/shop/files/ov7670-camera-module-640x480-378726.jpg?v=1726482279',
    'Arduino Starter-kit': 'https://img.joomcdn.net/7bc411dbf1f5a1705a452814ff6a917e714d0f7d_original.jpeg',
    'ESP32': 'https://joy-it.net/files/files/Produkte/SBC-NodeMCU-ESP32-C/SBC-NodeMCU-ESP32-C_01.png'
}

for name, url in images.items(): #name = key, url = value
    cursor.execute("UPDATE products SET image_url = ? WHERE name = ?", (url, name))

connection.commit()
connection.close()


print("✅ Image URLs added successfully!")