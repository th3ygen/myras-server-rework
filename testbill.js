const root = require('app-root-path');
const axios = require('axios');
const mongoose = require('mongoose');
const express = require('express');

const config = require('./config');

const axios_client = axios.create({
    auth: {
        username: '9764b205-5a59-4822-bf19-0d7deb38ba0e',  //This could be your email
    },
    headers: {
        "Content-Type": "application/json"
    }
});

async function createBill() {
    await require('./services/mongoose.service').init();
    
    require('./models/bill.model');
    const Bill = mongoose.model('Bill');

    let result;
    await axios_client.post(config.api.billplz.post.createBill, {
        collection_id: config.api.billplz.collection_id,
        description: `MyRAS membership - test rm200)`,
        email: 'aidil@syazwan.com',
        name: 'M. Aidil Syazwan',
        amount: config.bill.member['corporate'] * 100,
        mobile: '+601136521337',
        redirect_url: 'http://localhost:4200/user/purchase/invoices',
        callback_url: 'http://localhost:8989/payment/callback'
    })
    .then(bill => {
        bill = bill.data;
        
        const newBill = new Bill({
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

            issueDate: new Date(Date.now())
        });

        newBill.save();

        result = newBill;
    })
    .catch(err => {
        return new Error(err);
    });

    return result;
}

createBill().then(result => {
    console.log('New bill');
    console.log(result);
}).catch(err => {
    console.log('Error',err);
});