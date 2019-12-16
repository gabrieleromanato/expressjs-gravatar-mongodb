'use strict';

const request = require('request');
const fs = require('fs');

const postRequest = ({ url, body }) => {
    return new Promise((resolve, reject) => {
        const params = {
            url: url,
            method: 'POST',
            formData: body
        };
        request(params, ( error, response, body ) => {
            if(error) {
                reject(error);
            }
            resolve(JSON.parse(body));
        });
    });
};


describe('API Tests', () => {

    it('/api/upload should reject an invalid email address', async () => {
        const body = {
            avatar: fs.createReadStream(__dirname + '/valid-upload-file.png')
        };
        const email = 'john.doe@gmail';
        const param = Buffer.from(email).toString('base64');
        const response = await postRequest({ url: `http://localhost:3000/api/upload/${param}`, body } );
        expect(response.error).toEqual('Invalid email.');
    });

    it('/api/upload should upload a valid file', async () => {
        const body = {
            avatar: fs.createReadStream(__dirname + '/valid-upload-file.png')
        };
        const email = 'john.doe@gmail.com';
        const param = Buffer.from(email).toString('base64');
        const response = await postRequest({ url: `http://localhost:3000/api/upload/${param}`, body } );
        expect(response.done).toBe(true);
    });

    it('/api/upload should reject an invalid file', async () => {
        const body = {
            avatar: fs.createReadStream(__dirname + '/invalid-upload-file.txt')
        };
        const email = 'joe.doe@gmail.com';
        const param = Buffer.from(email).toString('base64');
        const response = await postRequest({ url: `http://localhost:3000/api/upload/${param}`, body } );
        expect(response.done).toBe(false);
    });

    it('/api/upload should reject an invalid file size', async () => {
        const body = {
            avatar: fs.createReadStream(__dirname + '/invalid-upload-file-size.jpg')
        };
        const email = 'janedoe@gmail.com';
        const param = Buffer.from(email).toString('base64');
        const response = await postRequest({ url: `http://localhost:3000/api/upload/${param}`, body } );
        expect(response.done).toBe(false);
    });
});