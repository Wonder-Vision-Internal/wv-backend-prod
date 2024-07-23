const packageYoutubeModel = require("../Models/packageYoutube.schema");
const mongoose = require('mongoose')


class PackageYoutubeUrlController {

    async addPackageYoutube(req, res) {

        try {
            const postData = {};

            if (req.body.slug) {
                postData.slug = req.body.slug;
            }
    
            if (req.body.url) {
                postData.url = req.body.url;
            }

            if (req.body.type) {
                postData.type = req.body.type.trim().toUpperCase();
            }
    
            await packageYoutubeModel.create(postData);
    
            res.status(200).json({})

        }catch(err) {
            res.status(500).json({})
        }

    }

    async getPackageYoutube(req, res) {
        try {

            const data = await packageYoutubeModel.find({}).lean();

            res.status(200).json({data})
        }catch(err) {
            res.status(500).json({})
        }


    }

    async updatePackageYoutube(req, res) {

        try {

            const postData = {};

            if (req.body.slug) {
                postData.slug = req.body.slug;
            }
    
            if (req.body.url) {
                postData.url = req.body.url;
            }

            if (req.body.type) {
                postData.type = req.body.type.trim().toUpperCase();
            }
    
            await packageYoutubeModel.updateOne({ _id: new mongoose.Types.ObjectId(req.params.id) }, {
                $set: postData
            });
    
            res.status(200).json({})

        }catch(err) {
            res.status(500).json({})
        }

    }

    async deletePackageYoutube(req, res) {

        try {

            await packageYoutubeModel.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) })

            res.status(200).json({})
        }catch(err) {
            res.status(500).json({})
        }

    }

}

module.exports = new PackageYoutubeUrlController