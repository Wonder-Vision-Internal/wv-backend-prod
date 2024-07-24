const bestPlacesModel = require("../Models/bestPlaces.schema");
const mongoose = require('mongoose')


class BestPlaces {

    async addBestPlaces(req, res) {

        try {
            const postData = {};

            if (req.body.slug) {
                postData.slug = req.body.slug;
            }

            if (req.body.description) {
                postData.description = req.body.description;
            }

            if (req.body.title) {
                postData.title = req.body.title;
            }

            if (req.body.img) {
                postData.img = req.body.img;
            }

            await bestPlacesModel.create(postData);

            res.status(200).json({})

        } catch (err) {
            res.status(500).json({})
        }
    }

    async getBestPlaces(req, res) {

        try {
            const data = await bestPlacesModel.find({}).lean();

            res.status(200).json({ data })
        } catch (err) {
            res.status(500).json({})
        }

    }

    async updateBestPlaces(req, res) {

        try {
            const postData = {};

            if (req.body.slug) {
                postData.slug = req.body.slug;
            }

            if (req.body.description) {
                postData.description = req.body.description;
            }

            if (req.body.title) {
                postData.title = req.body.title;
            }

            if (req.body.img) {
                postData.img = req.body.img;
            }

            await bestPlacesModel.updateOne({ _id: new mongoose.Types.ObjectId(req.params.id) }, {
                $set: postData
            });

            res.status(200).json({})

        } catch (err) {
            res.status(500).json({})
        }

    }

    async deleteBestPlaces(req, res) {

        try {
            await bestPlacesModel.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) })

            res.status(200).json({})
        } catch (err) {
            res.status(500).json({})
        }

    }

}

module.exports = new BestPlaces