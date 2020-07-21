const mongoose = require('mongoose');
const Event = mongoose.model('Event');

module.exports = {
    getAll: async (req, res, next) => {
        const events = await Event.find({});

        return res.json({ events }).status(200);
    },

    get: async (req, res, next) => {
        const { query: { title, keywords, limit, page } } = req;
        const events = await Event.find({
            $and: [
                { title: { $regex: title, $options: 'i' } },
                { keywords: { $regex: keywords, $options: 'i' } }
            ]
        }).skip(parseInt(limit) * (parseInt(page) - 1)).limit(parseInt(limit));

        return res.json({ events }).status(200);
    },
    
    query: async (req, res, next) => {
        const { query: { cluster, keywords, sort, order, limit, page } } = req;

        const events = await Event.find({
            $and: [
                { cluster: { $regex: cluster, $options: 'i' } },
                {$or: [
                    { title: { $regex: keywords, $options: 'i' } },
                    { keywords: { $regex: keywords, $options: 'i' } },
                ]}
            ]
            
        })
            .sort({ [sort]: parseInt(order) })
            .skip(parseInt(limit) * (parseInt(page) - 1))
            .limit(parseInt(limit));

        return res.json({ events }).status(200);
    },

    getById: async (req, res, next) => {
        const { body: { id } } = req;

        const event = await Event.findById(id);

        return res.json({ event }).status(200);
    },

    getTotalEvents: async (req, res, next) => {
        const events = await Event.find({});

        return res.json({ total: events.length }).status(200);
    },

    publish: async (req, res, next) => {
        const { body: { 
            title,
            description,
            imgPath,
            cluster,
            keywords,
            organizer,
            startDate,
            endDate,
            datePublish
        } } = req;
    
        const event = new Event({
            title,
            description,
            imgPath: `/content/events/${req.files['img'][0].filename}`,
            cluster,
            keywords,
            organizer,
            contentPath: `/content/events/${req.files['content'][0].filename}`,
            startDate,
            endDate,
            views: 0,
            datePublish,
            dateEdit: 0,
            visible: true
        });

        await event.save();

        return res.json({ event }).status(200);
    },

    statIncrement: async (req, res, next) => {
        const { body: { id, key, amount } } = req;

        const event = await Event.findById(id);

        if (!event) {
            return res.json({ message: 'event not found' }).status(410);
        }

        if (event[key]) {
            event[keys] += amount;
        }

        await event.save();

        return res.json({ event }).status(200);
    },

    hide: async (req, res, next) => {
        const { body: { id, flag } } = req;

        const event = await Event.findById(id);

        if (!event) {
            return res.json({ message: 'event not found' }).status(410);
        }

        event.visible = !flag;

        await event.save();

        res.json({ event }).status(200);
    },

    edit: async (req, res, next) => {
        const { query: {
            id,
            title,
            description,
            cluster,
            keywords,
            organizer,
            startDate,
            endDate,
            timestamp
        } } = req;
        const event = await Event.findById(id);

        if (!event) {
            return res.json({ message: 'event not found' }).status(410);
        }

        event.title = title;
        event.description = description;
        event.cluster = cluster;
        event.keywords = keywords;
        event.organizer = organizer;
        event.startDate = startDate;
        event.endDate = endDate;
        event.dateEdit = timestamp;

        event.contentPath = `/content/events/${req.files['content'][0].filename}`;
        event.imgPath = `/content/events/${req.files['img'][0].filename}`;

        await event.save();

        res.json({ event }).status(200);
    },

    delete: async (req, res, next) => {
        const target = await Event.findByIdAndDelete(req.query.id);
        res.json({ message: `event [${target.title}] is deleted` }).status(200);
    }
}