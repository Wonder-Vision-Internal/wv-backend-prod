const homeClientModel = require("../Models/homeClient.schema");
const mongoose = require('mongoose')


class HomeClient {

    async addHomeClientYoutubeUrl(req, res) {

        try {
            const postData = {};

            if (req.body.slug) {
                postData.slug = req.body.slug;
            }
    
            if (req.body.url) {
                postData.url = req.body.url;
            }
        
            await homeClientModel.create(postData);
    
            res.status(200).json({})
        }catch(err) {
            res.status(500).json({})
        }

    }

    async getHomeClientYoutubeUrl(req, res) {

        try {

            const data = await homeClientModel.find({}).lean();

            res.status(200).json({ data })

        }catch(err) {
            res.status(500).json({})
        }

    }

    async updateHomeClientYoutubeUrl(req, res) {

        try {
            const postData = {};

            if (req.body.slug) {
                postData.slug = req.body.slug;
            }
    
            if (req.body.url) {
                postData.url = req.body.url;
            }
        
            await homeClientModel.updateOne({ _id: new mongoose.Types.ObjectId(req.params.id) }, {
                $set: postData
            });
    
            res.status(200).json({})
        }catch(err) {
            res.status(500).json({})
        }
    }

    async deleteHomeClientYoutubeUrl(req, res) {

        try {

            await homeClientModel.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) })

            res.status(200).json({})

        }catch(err) {
            res.status(500).json({})
        }

    }

}

module.exports = new HomeClient