console.log("Welcome to weather API server");

// require('dotenv').config(); (CommonJS style)
import 'dotenv/config';

// const express = require('express'); (CommonJS style)
import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(process.env.EXPRESS_SERVER_PORT, () => {
    console.log(`Server running and listening on port ${process.env.EXPRESS_SERVER_PORT}`);
});