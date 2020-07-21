const root = require('app-root-path');
const axios = require('axios');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require(root + '/config');

const axios_client = axios.create({
    auth: {
        username: '9764b205-5a59-4822-bf19-0d7deb38ba0e',  //This could be your email
    },
    headers: {
        "Content-Type": "application/json"
    }
});

const { jwt: { SECRET } } = require(root + '/config.js');

const User = mongoose.model('User');
const Bill = mongoose.model('Bill');

async function authenticate(req, res, next) {
    const { body: { username, password } } = req;

    const user = await User.findOne({ username });

    if (!user) {
        return res.json({ message: 'incorrect username or password' }).status(401);
    }

    const pass = await bcrypt.compare(password, user.hash);

    if (!pass) {
        return res.json({ message: 'incorrect username or password' }).status(401);
    }

    const token = jwt.sign({
        userid: user._id,
        role: user.role
    }, config.jwt.SECRET);

    return res.status(200).json({
        user,
        token
    });
    /* return passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ err });
        }

        if (user) {
            const token = jwt.sign({
                userid: user._id,
                role: user.role
            }, config.jwt.SECRET);

            return res.status(200).json({
                user,
                token
            });
        }
        return res.status(401).json(info);
    })(req, res, next); */
}

async function register(req, res, next) {
     const user = new User(req.body.user);

    // password hashing
    user.hash = await bcrypt.hash(req.body.user.password, 7);

    // registering thru this endpoint
    // will always return user role
    user.role = 'user';
    
    // generate member id first
    let allNum, num, prev;

    const users = await User.find(
        { role: 'user' },
        ['member.id', 'member.num']).sort({ 'member.num': 1 });
    allNum = users.map(u => {
        return u.member.num;
    });
    
    allNum.forEach(n => {
        if(prev != undefined && n - prev > 1) {
            num = prev + 1;
            return;
        }
        prev = n;
    })
    
    if (!num) {
        num = allNum.length;
    }

    // generate member unique id
    const generateId = async (id) => {
        const char = ('00000').split('');
        const idChar = (id).toString().split('');

        const result = char;
        idChar.forEach((c, x) => {
            result[char.length - idChar.length + x] = c;
        });
        
        return 'MYRAS' + result.join('');
    };
    
    // create bill
    let plan = user.member.plan;
    if (user.member.lifetime && user.member.plan !== 'student') {
        plan += ' lifetime';
    }

    console.log({
        collection_id: config.api.billplz.collection_id,
        description: `MyRAS membership fee`,
        email: user.email,
        name: user.details.fullname,
        amount: config.bill.member[plan] * 100,
        redirect_url: 'http://localhost:4200/user/purchase/invoices',
        callback_url: 'http://localhost:8989/payment/callback'
    });

    const billplz = await axios_client.post(config.api.billplz.post.createBill, {
        collection_id: config.api.billplz.collection_id,
        description: `MyRAS membership fee`,
        email: user.email,
        name: user.details.fullname,
        amount: config.bill.member[plan] * 100,
        redirect_url: 'http://localhost:4200/user/purchase/invoices',
        callback_url: 'http://localhost:8989/payment/callback'
    }).catch(err => {
        console.log(err.message);
        return res.json({ message: err.message }).status(500);
    });
    
    const bill = billplz.data;

    if (!bill) {
        return res.json({ message: 'something went wrong' }).status(500);
    }

    const newBill = await new Bill({
        id: bill.id,
        collection_id: bill.collection_id,

        paid: bill.paid,
        state: bill.state,

        amount: bill.amount,
        paid_amount: bill.paid_amount,

        email: bill.email,
        name: bill.name,
        mobile: bill.mobile,

        url: bill.url,

        description: bill.description,

        issueDate: new Date(Date.now()),

        billerRef: user._id
    }).save();

    user.member.id = await generateId(num);
    user.member.status = 'Inactive';
    user.member.type = 'annual'
    user.member.num = num;
    user.bills = [newBill._id];

    await user.save();

    return res.json({ user }).status(200);
}

function edit(req, res, next) {
    const { body: { id, newDoc } } = req;
    return User.findByIdAndUpdate(id, newDoc, (err, result) => {
        if (err) {
            return res.json({ message: 'error updating user: ' + err }).status(400);
        }

        return res.json({ result }).status(200);
    });
}

function getAll(req, res, next) {
    return User.find({}, (err, result) => {
        if (err) {
            return res.json({ message: 'error getting users: ' + err }).status(500);
        }

        return res.json({ result }).status(200);
    });
}

function get(req, res, next) {
    const { params: { id } } = req;
    const headers = req.headers.authorization;
    
    const payload = jwt.verify(headers.split(' ')[1], SECRET);

    if (payload.role !== 'admin') {
        return res.json({ message: 'restricted access' }).status(401);
    }

    return User.findOne({ 'member.id': id }, (err, user) => {
        if (err) {
            return res.json({ message: 'error getting user: ' + err }).status(500);
        }

        return res.json({ user }).status(200);
    });
}

async function userGetUser(req, res, next) {
    const payload = jwt.verify(req.headers.authorization.split(' ')[1], SECRET);

    const user = await User.findById(payload.userid);

    if (!user) {
        return res.json({ message: 'user not found' }).status(402);
    }

    return res.json({ user }).status(200);
}

async function userGetBills(req, res, next) {
    const payload = jwt.verify(req.headers.authorization.split(' ')[1], SECRET);

    const user = await User.findById(payload.userid);

    if (!user) {
        return res.json({ message: 'user not found' }).status(402);
    }

    const bills = await Bill.find({ billerRef: user._id });

    const due = [];
    const paid = [];

    for (const bill of bills) {
        const { data } = await axios_client.get(`https://www.billplz-sandbox.com/api/v3/bills/${bill.id}`).catch(err => {
            console.log(err.message);
            return res.json({ message: err.message }).status(500);
        });
        if (!data) {
            return res.json({ message: 'something went wrong' }).status(500);
        }

        if (data.paid) {
            paid.push(data);
        } else {
            due.push(data);
        }
    }

    return res.json({ due, paid }).status(200);
}

async function updateUserInfo(req, res, next) {
    const payload = jwt.verify(req.headers.authorization.split(' ')[1], SECRET);
    const { body: { info } } = req;

    const user = await User.findById(payload.userid);

    if (!user) {
        return res.json({ message: 'user not found' }).status(402);
    }

    user.details.title = info.details.title;
    user.details.fullname = info.details.fullname;
    user.details.dob = info.details.dob;
    /* user.email = info.email; */
    user.details.phoneNum = info.details.phoneNum;

    await user.save();

    return res.json({ message: 'user info updated' }).status(200);
}

async function updateUserPW(req, res, next) {
    const payload = jwt.verify(req.headers.authorization.split(' ')[1], SECRET);
    const { body: { oldpw, newpw } } = req;

    const user = await User.findById(payload.userid);

    if (!user) {
        return res.json({ message: 'user not found' }).status(402);
    }

    // check old pw
    const valid = await bcrypt.compare(oldpw, user.hash);

    if (!valid) {
        return res.json({ message: 'wrong password' }).status(402);
    }

    user.hash = await bcrypt.hash(newpw, 7);
    await user.save();

    return res.json({ user }).status(200);
}

function remove(req, res, next) {
    const { body: { id } } = req;
    return User.findByIdAndDelete(id, (err, result) => {
        if (err) {
            return res.json({ message: 'error deleting users: ' + err }).status(500);
        }

        return res.json({ message: `user ${result.username} deleted` }).status(200);
    })
}

module.exports = {
    authenticate,
    register,
    get,
    userGetUser,
    userGetBills,
    updateUserInfo,
    updateUserPW
}