import express from 'express';
import User from '../models/users';
import authenticate from "../middleware/auth";

const router = express.Router();

router.post('/users', async (req, res) => {
    const {email, password} = req.body.data;
    const user = new User({
        email,
        password
    });

    try {
        const userBody = await user.save();
        const token = await userBody.generateAuthToken();

        const response = {
            id: userBody._id,
            email: userBody.email,
            token
        };

        res.header('x-auth', token).send({data: response});
    } catch (err) {
        res.status(400).send({status: err})
    }

});

router.post('/login', async (req, res) => {
    const {email, password} = req.body.data;

    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        const response = {
            token
        };
        res.header('x-auth', token).send({data: response});
    } catch (err) {
        res.status(400).send({status: err});
    }
});

router.delete('/logout', authenticate, async (req, res) => {
    const user = req.user;
    const token = req.token;

    try {
        await user.removeToken(token);
        res.status(200).send({status: 'success'});
    } catch (e) {
        res.status(400).send({status: e});
    }

});

router.post('/change_email', authenticate, async (req, res) => {
    const _id = req.user._id;
    const {email} = req.body.data;

    try {
        const user = await User.findById(_id);
        user.email = email;
        await user.save();

        const response = {
            id: user._id,
            email: user.email
        };

        res.status(200).send({data: response});
    } catch (err) {
        res.status(422).send({status: err});
    }
});

export default router;