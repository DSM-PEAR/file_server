const express = require('express');
const app = express();

const port = 3000;

app.get('/', (req, res) => {
    console.log("HELLO");
})

app.listen(port, () => {
    console.log("server running on " + port);
})