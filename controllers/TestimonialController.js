const { default: mongoose } = require('mongoose');
const postModel = require('../Models/posts.schema')
const testimonialModel = require("../Models/testimonial.schema");

class Testimonial {

    async getTestimonials(req, res) {
        try {
            postModel.find({ post_type: 'testimonial' })
            .then((data) => {
                res.status(200).json({
                    testimonialData: data
                })
            }).catch((err) => {
                res.status(500).json({
                    message: 'Unable To Fetch Testimonials',
                    Error: err
                })
            })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async addTestimonial(req, res) {
        try {

            const testObj = {
                post_type: 'testimonial',
                video_link: req.body.video_link
            }
            postModel(testObj).save()
                .then((data) => {
                    if (data._id) {
                        res.status(200).json({
                            message: 'Testimonial Created Successfully',
                            status: 1
                        })
                    }
                    else {
                        res.status(500).json({
                            message: 'Testimonial Not Created',
                            status: 0
    
                        })
                    }
                }).catch((err) => {
                    console.log('Error in creating testimonial', err);
                    res.status(500).json({
                        message: 'Failed To Create Testimonial',
                        status: -1,
                        Error: err
                    })
                })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async updateTestimonial(req, res) {
        try {
            postModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.postId) },
            {
                video_link: req.body.video_link
            })
            .then(() => {
                res.status(200).json({
                    message: 'Testimonial Updated Successfully',
                    status: 1
                })
            }).catch((err) => {
                res.status(500).json({
                    message: 'Failed To Update Testimonial',
                    Error: err
                })
            })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async deleteTestimonial(req, res) {
        try {
            postModel.findOneAndDelete({ _id: req.params.testimonialId })
            .then(() => {
                res.status(200).json({
                    message: 'Testimonial Video Deleted Successfully',
                    status: 1
                })
            }).catch((err) => {
                res.status(500).json({
                    message: 'Failed To Delete Testimonial Video'
                })
            })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }


    async addImg(req, res) {
        try {
            const { filename } = req.file;
            res.status(200).json({ filename: 'img/' + filename })
        } catch (err) {
            res.status(500).json({})
        }

    }

    async addTestimonialsCrousel(req, res) {

        try {
            const postData = {};

            if (req.body.userImg) {
                postData.userImg = req.body.userImg;
            }

            if (req.body.userName) {
                postData.userName = req.body.userName;
            }

            if (req.body.title) {
                postData.title = req.body.title;
            }

            if (req.body.screenImg) {
                postData.screenImg = req.body.screenImg;
            }

            await testimonialModel.create(postData);

            res.status(200).json({})

        } catch (err) {
            res.status(500).json({})
        }

    }

    async getTestimonialsCrousel(req, res) {
        try {
            const data = await testimonialModel.find({}).lean();

            res.status(200).json({ data })
        } catch (err) {
            res.status(500).json({})
        }

    }

    async updateTestimonialsCrousel(req, res) {

        try {
            const postData = {};

            if (req.body.userImg) {
                postData.userImg = req.body.userImg;
            }

            if (req.body.userName) {
                postData.userName = req.body.userName;
            }

            if (req.body.title) {
                postData.title = req.body.title;
            }

            if (req.body.screenImg) {
                postData.screenImg = req.body.screenImg;
            }

            await testimonialModel.updateOne({ _id: new mongoose.Types.ObjectId(req.params.id) }, {
                $set: postData
            });

            res.status(200).json({})
        } catch (err) {
            res.status(500).json({})
        }
    }

    async deleteTestimonialsCrousel(req, res) {

        try {

            await testimonialModel.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) })

            res.status(200).json({})

        } catch (err) {
            res.status(500).json({})
        }

    }

}

module.exports = new Testimonial
