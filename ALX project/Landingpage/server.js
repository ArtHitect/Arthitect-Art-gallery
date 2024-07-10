const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/artgallery', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define Mongoose schema and model
const artSchema = new mongoose.Schema({
    title: String,
    artist: String,
    imageUrl: String
});

const Art = mongoose.model('Art', artSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Set up file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Routes
app.get('/api/art', async (req, res) => {
    const art = await Art.find();
    res.json(art);
});

app.post('/api/art', upload.single('file'), async (req, res) => {
    const { title, artist } = req.body;
    const newArt = new Art({
        title,
        artist,
        imageUrl: '/uploads/' + req.file.filename
    });
    await newArt.save();
    res.json(newArt);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
