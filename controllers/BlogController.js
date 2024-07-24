const mongoose = require('mongoose')
const postModel = require('../Models/posts.schema')

class BlogController {

    async getAllBlogs(req, res) {
        try {
            postModel.find({ post_type: 'blog' })
            .then((data) => {
                res.status(200).json({
                    allBlogs: data
                })
            }).catch((err) => {
                res.status(500).json({
                    message: 'Unable To fetch Blog Names'
                })
            })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async addBlog(req, res) {
        try {
            const createSlug = (title) => {
                let arr = title.split('')
                // console.log('before conversion',arr)
    
                arr = arr.map((data) => {
                    if (data == ' ') {
                        return data.replace(' ', '-')
                    }
                    else if (data == ',') {
                        return data.replace(',', '-')
                    }
                    return data.toLowerCase()
                })
                console.log('after conversion', arr.join(''))
                return arr.join('')
            }
            const blogObj = {
                ...req.body,
                slug: createSlug(req.body.title),
                post_type: 'blog',
                featured_img: 'img/' + req.body.featured_img
            }
            postModel(blogObj)
                .save()
                .then((data) => {
                    if (data._id) {
                        res.status(200).json({
                            message: 'Blog Created Successfully',
                            status: 1
                        })
                    }
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Failed To Create Blog',
                        Error: err
                    })
                })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async loadSingleBlog(req, res) {
        try {
            postModel.findOne({ _id: req.params.blogId })
            .then((data) => {
                res.status(200).json({
                    blogData: data
                })
            }).catch((err) => {
                res.status(500).json({
                    message: 'Failed To Load Blog',
                    Error: err
                })
            })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async updateBlog(req, res) {
        try {
            let isPostExist = await postModel.findOne({ _id: req.body.blogId });
            function featureimg() {
                if (req.body.featured_img !== "undefined") {
                    console.log("from if");
                    let new_img = "img/" + req.body.featured_img;
                    return new_img;
                } else if (req.body.featured_img === "undefined") {
                    console.log("from else");
                    let new_img = isPostExist.featured_img;
                    return new_img;
                }
            }
            postModel.findOneAndUpdate(
                {
                    _id: req.body.blogId
                }, {
                ...req.body,
                featured_img: featureimg()
            })
                .then(() => {
                    res.status(200).json({
                        message: 'Blog Updated Successfully',
                        status: 1
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Failed To Update Blog'
                    })
                })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async deleteBlog(req, res) {
        try {
            postModel.findOneAndDelete({ _id: req.params.blogId })
            .then(() => {
                res.status(200).json({
                    message: 'Blog Deleted Successfully',
                    status: 1
                })
            }).catch((err) => {
                res.status(500).json({
                    message: 'Failed To Delete Blog'
                })
            })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

}

module.exports = new BlogController