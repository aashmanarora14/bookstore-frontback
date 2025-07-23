const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Online Bookstore</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .book { border: 1px solid #ddd; padding: 20px; margin: 10px 0; }
                button { background: #007bff; color: white; padding: 10px 20px; border: none; cursor: pointer; }
            </style>
        </head>
        <body>
            <h1>📚 Online Bookstore</h1>
            <div id="books"></div>
            <script>
                fetch('/api/books')
                    .then(response => response.json())
                    .then(books => {
                        const booksDiv = document.getElementById('books');
                        books.forEach(book => {
                            booksDiv.innerHTML += \`
                                <div class="book">
                                    <h3>\${book.title}</h3>
                                    <p>Author: \${book.author}</p>
                                    <p>Price: $\${book.price}</p>
                                    <button onclick="buyBook(\${book.id})">Buy Now</button>
                                </div>
                            \`;
                        });
                    });
                function buyBook(id) {
                    alert('Book purchased! (Demo)');
                }
            </script>
        </body>
        </html>
    `);
});

app.get('/api/books', async (req, res) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/books`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

app.listen(PORT, () => {
    console.log(`Frontend running on port ${PORT}`);
});