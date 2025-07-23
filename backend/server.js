const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bookstore'
};

let db;

async function initDB() {
    db = await mysql.createConnection(dbConfig);
    await db.execute(`
        CREATE TABLE IF NOT EXISTS books (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL
        )
    `);
    const [rows] = await db.execute('SELECT COUNT(*) as count FROM books');
    if (rows[0].count === 0) {
        await db.execute(`
            INSERT INTO books (title, author, price) VALUES
            ('The Great Gatsby', 'F. Scott Fitzgerald', 12.99),
            ('To Kill a Mockingbird', 'Harper Lee', 14.99),
            ('1984', 'George Orwell', 13.99)
        `);
    }
}

app.get('/books', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM books');
    res.json(rows);
});

app.post('/books', async (req, res) => {
    const { title, author, price } = req.body;
    const [result] = await db.execute(
        'INSERT INTO books (title, author, price) VALUES (?, ?, ?)',
        [title, author, price]
    );
    res.json({ id: result.insertId, title, author, price });
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
    initDB();
});