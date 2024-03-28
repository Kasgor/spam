const express = require('express');

const router = express.Router()

module.exports = router;

const User = require('./models/model');

//Отримання повного списку
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//Додавання
router.post('/users', async (req, res) => {
    const { name, surname, patronymic, email } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(400).send({ message: 'A user with this email already exists.' });
    }

    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        patronymic: req.body.patronymic,
        email: req.body.email
    });
    try {
        const newUser = await user.save();
        res.status(200).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})



// Видалення
router.delete('/users/:email', async (req, res) => {
    try {
        const id = req.params.email;
        const data = await User.deleteOne({ email: req.params.email });
        res.send(`User with ${data.name} has been deleted..`)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/users/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});
router.put('/users/:email', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { email: req.params.email },
            req.body,
            { new: true }
        );
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});
