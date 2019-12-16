'use strict';

const multer = require('multer');
const {fileSize} = require('../config');

class Upload {
    constructor({ filename, destination, newName }) {
        this.filename = filename;
        this.destination = destination;
        this.newName = newName;
    }


    save( req, res ) {
        
        let self = this;

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, self.destination);
            },
            filename: (req, file, cb) => {
                let prts = file.originalname.split('.');
                cb(null, self.newName + '.' + prts[1]);
            }
        });

        const uploader = multer(
            { 
                storage: storage, 
                limits: {
                    fileSize
                },
                fileFilter: (req, file, cb) => {
                    if (file.mimetype !== 'image/png') {
                        return cb(new Error('Invalid file type.'), false);
                    }
                    cb(null, true);
                }    
        }).single(self.filename);

        return new Promise((resolve, reject) => {
            uploader(req, res, err => {
                if(err) {
                    resolve({error: 'Upload failed'});
                } else {
                    resolve({
                        done: true
                    });
                } 
            });
        });
    }
}

module.exports = Upload;