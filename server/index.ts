const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // vite runs on 3000
const server = app.listen(port, () => console.log('running on ' + port.toString()));
