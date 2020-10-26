const express = require('express');
const app = express();

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const port = 3000;

app.get('/', (req, res) => {
    console.log("HELLO");
})

app.listen(port, () => {
    console.log("server running on " + port);
})