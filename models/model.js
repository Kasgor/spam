const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    surname: {
        required: true,
        type: String
    },
    patronymic: {
        required: true,
        type: String
    },

    email: {
        required: true,
        type: String
    },

})



module.exports = mongoose.model('User', userSchema)