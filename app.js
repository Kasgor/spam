const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/model');
const transporter = require("./mailer")

const app = express();
app.use(bodyParser.json());



app.use(express.static('public'));
mongoose.connect('mongodb://127.0.0.1:27017/spamm');
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const routes = require('./routes');
app.use('/api', routes);

app.post('/send-email', (req, res) => {
    const { to, subject, text, } = req.body;

    let mailOptions = {
        from: 'oleksandrkompaniiets31@gmail.com',
        to: to.join(','),
        subject: subject,
        text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));