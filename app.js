const express = require('express');
const path = require('path');
const { FSDB } = require("file-system-db");
const db = new FSDB('./db/mark.json', false);
const util = require('./util');

const app = express();

const port = 8000;

app.use('/static', express.static(path.join(__dirname, './static')))
app.use(express.json());
app.get('/mark/list', (req, res) => {
    const { query } = req;
    const key = util.convertToDBKey(query.key)
    const list = db.get(key) || [];
    console.log('key=', key, 'list: ', list);
    res.json({
        list
    });
});
app.use('/mark/create', (req, res) => {
    const { body } = req;
    const key = util.convertToDBKey(body.key);
    if (!db.get(key)) {
        db.set(key, []);
    }
    db.push(key, { id: Date.now(), content: body.content });
    console.log(body);
    res.send('');
});

app.listen(port, () => {
    console.log(`server listening on port ${port}`)
})