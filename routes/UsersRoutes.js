import express from 'express';
import User from '../models/users';

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
            email: userBody.email
        };

        res.header('x-auth', token).send({data: response});
    } catch (err) {
        res.status(400).send({status: err})
    }

});

export default router;