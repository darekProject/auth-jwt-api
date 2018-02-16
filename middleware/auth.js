import User from '../models/user';

const authenticate = async (req, res, next) => {
    const token = req.header('x-auth');

    try {
        const user = await User.findByToken(token);

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).send({status: e});
    }

};

export default authenticate;