module.exports = {
    production: false,

    jwt: {
        SECRET: 'lkahLkhALSKlkASHDlkashdLKASHEaskldalkHALSKDHasLKDHalSK'
    },

    bill: {
        member: {
            'student': 0,
            'regular': 50,
            'regular lifetime': 50,
            'corporate': 200,
            'corporate lifetime': 1000
        }
    },

    api: {
        billplz: {
            key: '9764b205-5a59-4822-bf19-0d7deb38ba0e',
            collection_id: 'wr80_bhs',
            post: {
                createBill: 'https://www.billplz-sandbox.com/api/v3/bills'
            },
            get: {
                
            },
            
            
        }
    }
};