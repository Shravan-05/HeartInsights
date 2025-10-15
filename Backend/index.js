const connectToMongo = require('./db');
connectToMongo();

const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bulk', require('./routes/BulkPrediction'));
app.use('/api/single', require('./routes/Singleprediction'));
app.use('/api/chat', require('./routes/chat'));

// Serve reports statically
app.use('/reports', express.static(path.join(__dirname, 'reports')));

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});
