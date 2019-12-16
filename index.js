'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const validator = require('validator');
const User = require('./models/User');
const Upload = require('./classes/Upload');
const UPLOAD_PATH = path.dirname(process.mainModule.filename) + '/uploads'; 
const {dbUrl, dbName} = require('./config');
const {db} = require('./utils');


app.disable('x-powered-by');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/avatar/:data', async (req, res) => {
    const { data } = req.params;
    try {
        const client = await db(dbUrl);
        const database = client.db(dbName);
        const users = database.collection('users');
        const existingUser = await users.findOne({hash: data});
        if(existingUser) {
            const avatar = data + '.png';
            res.set('Content-Type', 'image/png');
            fs.createReadStream(UPLOAD_PATH + `/${avatar}`).pipe(res);
        } else {
            res.sendStatus(404); 
        }
    } catch(err) {
        res.sendStatus(404);
    }
});

app.post('/api/upload/:data', async (req, res) => {
    const { data } = req.params;
    const buff = Buffer.from(data, 'base64');
    const email = buff.toString('ascii');

    if(!validator.isEmail(email)) {
        res.send({ done: false, error: 'Invalid email.'});
        return;
    }

    try {
        const user = new User(email);
        const upload = new Upload({ filename: 'avatar', destination: UPLOAD_PATH, newName: user.getData.hash });

        const uploaded = await upload.save(req, res);
        if(uploaded.done) {
            await user.save();
            res.send({ done: true, url: `/avatar/${user.getData.hash}` });
        } else {
            res.send({ done: false, error: 'Invalid file.' });
        }    

        
    } catch(err) {
        res.send({ done: false, error: 'Upload error.' });
    }
});


app.listen(port);