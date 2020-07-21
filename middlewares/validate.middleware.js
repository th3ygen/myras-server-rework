function userCredential(req, res, next) {
    const { body: { username, password }  } = req;
    
    if (!username) {
        return res.status(400).json({
            message: 'username is blank'
        });
    }

    if (!password) {
        return res.status(400).json({
            message: 'password is blank'
        });
    }

    next();
}

function register(req, res, next) {
    if (!req.body.user) {
        return res.status(400).json({
            'message': 'user credential not found'
        });
    }

    const { body: { user: { username, password, email } } } = req;

    if (!username) {
        return res.status(400).json({
            message: 'username is blank'
        });
    }

    if (!password) {
        return res.status(400).json({
            message: 'password is blank'
        });
    }

    if (!(password.length > 8)) {
        return res.status(400).json({
            message: 'password need atleast 8 characters long'
        });
    }

    if (!email) {
        return res.status(400).json({
            message: 'email is blank'
        });
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        return res.status(400).json({
            message: 'email is invalid'
        });
    }

    next();
}

module.exports = {
    userCredential,
    register
}