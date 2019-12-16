# expressjs-gravatar-mongodb
A Node.js and MongoDB implementation of the Gravatar service.

## Setup

1. Create a MongoDB database and adjust the connection settings in the `config.js` file.
2. Adjust the upload limit maximum size in the `config.js` file (in bytes).
3. Currently only PNG images are allowed. You can adjust this setting in the `classes/Upload.js` file. Adjust the frontend code accordingly in `public/js/app.js`file.
