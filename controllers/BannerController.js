const mongoose = require('mongoose');
const bannerModel = require('../Models/banner.schema')
const postModel = require('../Models/posts.schema')

class Banner {

    async getBannerByPage(req, res) {
        try {
            //console.log('hello');
            //console.log(('page name', req.params.page_name));
            let isPostExist = await postModel.find({ package_category: req.params.page_name })
            //console.log(isPostExist.length);

            if (isPostExist.length !== 0 && (req.params.page_name === 'incredible_india' ||
                req.params.page_name === 'wild_africa' ||
                req.params.page_name === 'beautiful_asia' ||
                req.params.page_name === 'adventure_himalayas' ||
                req.params.page_name === 'colorful_festival')) {
                postModel.aggregate([
                    {
                        $match: {
                            package_category: req.params.page_name
                        }
                    },
                    {
                        $lookup: {
                            from: 'Banner',
                            localField: '_id',
                            foreignField: 'post_id',
                            as: 'packageBanner'
                        }
                    },
                    {
                        $lookup: {
                            from: 'Banner',
                            localField: 'package_category',
                            foreignField: 'page_name',
                            as: 'outsideBanner'
                        }
                    },
                    {
                        $project: {
                            content: 0,
                            featured_img: 0,
                            video_link: 0,
                            small_text: 0,
                            post_type: 0,
                            slug: 0,
                            price: 0,
                            status: 0,
                            created_at: 0,
                            is_featured: 0,
                            is_festival: 0,
                            is_resort: 0,
                            package_category: 0
                        }
                    }


                ])
                    .then((data) => {
                        //console.log('banner', data);
                        res.status(200).json({
                            bannerDetails: data
                        })
                    }).catch((err) => {
                        res.status(500).json({
                            Error: err
                        })
                    })
            }

            else {
                //console.log('page',req.params.page_name);
                bannerModel.find({ page_name: req.params.page_name })
                    .then((data) => {
                        //console.log('banner',data);
                        res.status(200).json({
                            bannerDetails: data
                        })
                    }).catch((err) => {
                        res.status(500).json({
                            Error: err
                        })
                    })
            }
        } catch (error) {
            res.status(500).send({ message: error.message });
        }


    }

    async getHomeStayBanner(req, res) {
        try {
            await postModel.aggregate([
                {
                    $match: {
                        post_type: 'home_stay'
                    }
                },
                {
                    $lookup: {
                        from: 'Banner',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'bannerDetails'
                    }
                },
                {
                    $project: {
                        content: 0,
                        featured_img: 0,
                        video_link: 0,
                        small_text: 0,
                        post_type: 0,
                        slug: 0,
                        price: 0,
                        status: 0,
                        created_at: 0,
                        is_featured: 0,
                        is_festival: 0,
                        is_resort: 0,
                        package_category: 0
                    }
                }
            ]).then((data) => {
                res.status(200).json({
                    bannerData: data
                })
            })
                .catch((err) => {
                    res.status(500).json({
                        message: 'Unable To Fetch Banner',
                        Error: err
                    })
                })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async getBlogsBanner(req, res) {
        try {
            await postModel.aggregate([
                {
                    $match: {
                        post_type: 'blog'
                    }
                },
                {
                    $lookup: {
                        from: 'Banner',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'bannerDetails'
                    }
                },
                {
                    $project: {
                        content: 0,
                        featured_img: 0,
                        video_link: 0,
                        small_text: 0,
                        post_type: 0,
                        slug: 0,
                        price: 0,
                        status: 0,
                        created_at: 0,
                        is_featured: 0,
                        is_festival: 0,
                        is_resort: 0,
                        package_category: 0
                    }
                }
            ]).then((data) => {
                res.status(200).json({
                    bannerData: data
                })
            })
                .catch((err) => {
                    res.status(500).json({
                        message: 'Unable To Fetch Banner',
                        Error: err
                    })
                })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }


    }

    async addMainBanner(req, res) {
        try {
            const bannerObj = {
                ...req.body,
                img: 'img/' + req.body.img
            }
            bannerModel(bannerObj)
                .save()
                .then((data) => {
                    if (data._id) {
                        res.status(200).json({
                            message: 'Banner Created Successfully',
                            status: 1
                        })
                    }
                    else {
                        res.status(500).json({
                            message: 'Failed To Create Banner',
                            status: 0
                        })
                    }
                })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }


    async addSubBanner(req, res) {
        try {
            let isPostExist = await postModel.findOne({ slug: req.body.slug })
            if (isPostExist) {
                const bannerObj = {
                    ...req.body,
                    post_id: new mongoose.Types.ObjectId(isPostExist._id),
                    img: 'img/' + req.body.img
                }
                bannerModel(bannerObj)
                    .save()
                    .then((data) => {
                        if (data._id) {
                            res.status(200).json({
                                message: 'Banner Created Successfully',
                                status: 1
                            })
                        }
                        else {
                            res.status(500).json({
                                message: 'Failed To Create Banner',
                                status: 0
                            })
                        }
                    })
            }

        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async loadSingleBanner(req, res) {
        try {
            let isBannerExist = await bannerModel.findOne({ _id: req.params.bannerid })
            if (isBannerExist) {
                res.status(200).json({
                    bannerData: isBannerExist
                })
            }
            else {
                res.status(500).json({
                    message: 'Unable To Fetch Banner Data'
                })
            }
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async updateBanner(req, res) {
        try {
            let isBannerExist = await bannerModel.findOne({ _id: req.params.bannerid })
            function ban_img() {
                if (req.body.img !== 'undefined') {
                    //console.log('from if');
                    let new_img = 'img/' + req.body.img
                    return new_img
                }
                else if (req.body.img === 'undefined') {
                    //console.log('from else');
                    let new_img = isBannerExist.img
                    return new_img
                }
            }
            bannerModel.findOneAndUpdate({
                _id: req.params.bannerid
            }, {
                ...req.body,
                img: ban_img()
            }).then(() => {
                res.status(200).json({
                    message: 'Banner Updated Successfully',
                    status: 1
                })
            }).catch((err) => {
                res.status(500).json({
                    message: 'Failed To Update Banner'
                })
            })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async deleteBanner(req, res) {
        try {
            bannerModel.findOneAndDelete({ _id: req.params.bannerid })
            .then(() => {
                res.status(200).json({
                    message: 'Banner Deleted Successfully',
                    status: 1
                })
            }).catch((err) => {
                res.status(200).json({
                    message: 'Failed To Delete Banner',
                    status: 0
                })
            })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

}


module.exports = new Banner