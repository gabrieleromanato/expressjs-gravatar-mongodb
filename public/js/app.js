'use strict';

class Upload {
    constructor() {
        this.form = document.querySelector('#upload-avatar');
        this.email = document.querySelector('#email');
        this.avatar = document.querySelector('#avatar');

        this.send();
    }

    send() {
        this.form.addEventListener('submit', async e => {
            e.preventDefault();
            this.clearForm();

            const errors = this.validateForm();

            if(errors.length > 0) {
                for(let err of errors) {
                    this.handleResponse(err, this.form);
                }
            } else {

                const formData = new FormData();
                formData.append('avatar', this.avatar.files[0]);

                const url = '/api/upload/' + btoa(this.email.value);
                const request = await fetch(url, { method: 'POST', body: formData } );
                const response = await request.json();

                this.handleResponse(response, this.form);

            }
        });
    }

    handleResponse(resp, target) {
        const element = document.createElement('div');
        if(resp.url) {
            element.className = 'alert alert-success mt-4';
            element.innerHTML = `<a href="${resp.url}">View avatar</a>`;
        } else {
            element.className = 'alert alert-danger mt-4';
            element.innerHTML = resp.error; 
        }
        target.appendChild(element);
    }

    clearForm() {
        const alerts = this.form.querySelectorAll('.alert');
        if(alerts.length > 0) {
            alerts.forEach(el => {
                this.form.removeChild(el);
            });
        }
    }

    validateForm() {
        const errors = [];
        const file = this.avatar.files[0];
        if(!validator.isEmail(this.email.value)) {
            errors.push( { error: 'Invalid email.' } );
        }
        if(file) {
            if(file.type !== 'image/png') {
                errors.push( { error: 'PNG files only.' } ); 
            }
            if(file.size === 0 || file.size > 100000) {
                errors.push( { error: 'Maximum file size is 100 Kb.' } ); 
            }
        } else {
            errors.push( { error: 'You must select a file.' } );
        }
        return errors;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const upload = new Upload();
});