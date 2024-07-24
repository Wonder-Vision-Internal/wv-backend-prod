const postModel = require('../Models/posts.schema')
const metaModel = require('../Models/meta.schema')
const mongoose = require('mongoose')
class Home {

    async getIntroduction(req, res) {
        try {
            postModel.findOne({ _id: new mongoose.Types.ObjectId('6558eafab6224ccf289042aa') })
                .then((data) => {
                    res.status(200).json({
                        homeData: data
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Failed To Fetch Introduction',
                        Error: err
                    })
                })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }


    async updateIntroduction(req, res) {
        try {
            postModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.postId) },
                {
                    small_text: req.body.small_text,
                    video_link: req.body.video_link
                }).then(() => {
                    res.status(200).json({
                        message: 'Introduction Updated Successfully',
                        status: 1
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Failed To Update Introduction',
                        Error: err
                    })
                })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async getSpecialTour(req, res) {
        try {
            postModel.findOne({ title: 'splash_banner' })
                .then((data) => {
                    res.status(200).json({
                        specialData: data
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Failed To Fetch Special Tour Details'
                    })
                })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async updateSpecialTour(req, res) {
        try {
            let isPostExist = await postModel.findOne({ _id: new mongoose.Types.ObjectId(req.body.postId) })
            function featureimg() {
                if (req.body.img !== 'undefined') {
                    console.log('from if');
                    let new_img = 'img/' + req.body.img
                    return new_img
                }
                else if (req.body.img === 'undefined') {
                    console.log('from else');
                    let new_img = isPostExist.featured_img
                    return new_img
                }
            }

            postModel.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(req.body.postId) },
                {
                    link: req.body.link,
                    featured_img: featureimg()
                }).then(() => {
                    res.status(200).json({
                        message: 'Special Tour Updated Successfully',
                        status: 1
                    })
                }).catch((err) => {
                    res.status(200).json({
                        message: 'Failed To Update Special Tour Details',
                        Error: err
                    })
                })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async getAllMeta(req, res) {
        try {
            metaModel.findOne({ _id: '657806deaa86220f0452c959' })
                .then((data) => {
                    res.status(200).json({
                        metaInfo: data
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Failed To Load Meta Information',
                        Error: err
                    })
                })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async updateMeta(req, res) {
        try {
            let allMeta = await metaModel.findOne({ _id: '657806deaa86220f0452c959' })
            let meta = JSON.parse(allMeta.meta)
            for (let x in meta) {
                if (x === req.body.page_name) {
                    meta[x].title = req.body.meta_title
                    meta[x].description = req.body.meta_desc
                    meta[x].keywords = req.body.meta_keywords
                }
            }
            metaModel.findOneAndUpdate(
                {
                    _id: '657806deaa86220f0452c959'
                }, {
                meta: JSON.stringify(meta)
            })
                .then(() => {
                    res.status(200).json({
                        message: 'Meta Information Updated Successfully',
                        status: 1
                    })
                }).catch((err) => {
                    console.log('err', err);
                    res.status(500).json({
                        message: 'Failed To Update Meta Information',
                        Error: err
                    })
                })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

}

module.exports = new Home