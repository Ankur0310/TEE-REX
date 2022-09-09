const { application } = require('express');
const express = require('express');
const { register } = require('./models/tshirt');
const User = require('./models/users');



app.get('/register', (req, res) => {
    res.render('users/register');
})

