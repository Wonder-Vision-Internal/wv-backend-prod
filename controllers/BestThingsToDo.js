const bestThingsModel = require("../Models/bestThings.schema");
const mongoose = require('mongoose')


class BestThings {

    async addBestThingsToDo(req, res) {

        try {
            const postData = {};

            if (req.body.slug) {
                postData.slug = req.body.slug;
            }
    
            if (req.body.icon) {
                postData.icon = req.body.icon;
            }
    
            if (req.body.title) {
                postData.title = req.body.title;
            }
    
            await bestThingsModel.create(postData);
    
            res.status(200).json({})
        }catch(err) {
            res.status(500).json({})
        }

    }

    async getBestThingsToDo(req, res) {

        try {

            const data = await bestThingsModel.find({}).lean();

            res.status(200).json({ data })

        }catch(err) {
            res.status(500).json({})
        }

    }

    async updateBestThingsToDo(req, res) {

        try {
            const postData = {};

            if (req.body.slug) {
                postData.slug = req.body.slug;
            }
    
            if (req.body.icon) {
                postData.icon = req.body.icon;
            }
    
            if (req.body.title) {
                postData.title = req.body.title;
            }
    
            await bestThingsModel.updateOne({ _id: new mongoose.Types.ObjectId(req.params.id) }, {
                $set: postData
            });
    
            res.status(200).json({})
        }catch(err) {
            res.status(500).json({})
        }
    }

    async deleteBestThingsToDo(req, res) {

        try {

            await bestThingsModel.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) })

            res.status(200).json({})

        }catch(err) {
            res.status(500).json({})
        }

    }

}

module.exports = new BestThings