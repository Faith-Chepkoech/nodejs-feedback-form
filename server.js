const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Adjust if your frontend is running elsewhere
}));

// Middleware to parse JSON bodies
app.use(express.json());

app.use(express.static('public'));


// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Collymore150@',
    database: 'feedback_db'
});

// Connect to MySQL database
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

// Handle feedback submission
app.post('/submit-feedback', (req, res) => {
    const { name, feedback } = req.body;

    if (!name || !feedback) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const sql = 'INSERT INTO feedbacks (name, feedback) VALUES (?, ?)';
    db.query(sql, [name, feedback], (err, result) => {
        if (err) {
            console.error('Error inserting feedback:', err.message);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({ message: 'Feedback submitted successfully!' });
    });
});

// Handle the root URL ("/")
app.get('/', (req, res) => {
    res.send('Welcome to the Feedback API!'); // This is the response for the root URL
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
