const express = require('express');
const app = express();

const indexRouter = require('./routes/index');

const port = 3000;


app.use('/', indexRouter);

app.listen(port, () => {
    console.log("server running on " + port);
})