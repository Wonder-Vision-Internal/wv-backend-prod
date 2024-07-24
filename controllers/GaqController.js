const postModel = require('../Models/posts.schema')
const gaqModel = require('../Models/gaq.schema')
const mongoose = require('mongoose')
var escape = require('escape-html');
class Gaq {

    async getGaqByPackage(req, res) {

        try {
            postModel.aggregate([
                {
                    $match: {
                        slug: req.params.slug
                    }
                },
                {
                    $lookup: {
                        from: 'gaq',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'gaqDetails'
                    }
                }
            ])
                .then((data) => {
                    res.status(200).json({
                        gaqData: data
                    })
                })
                .catch((err) => {
                    //console.log('Error in fetching gaqdata', err)
                    res.status(500).json({
                        Error: err,
                        message: 'Failed To Load GAQs'
                    })
                })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }


    }

    async addGaqTab(req, res) {
        try {
            let isGaqExist = await postModel.aggregate([
                {
                    $match: {
                        slug: req.body.slug
                    }
                },
                {
                    $lookup: {
                        from: 'gaq',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'gaq'
                    }
                }
            ])
            // //console.log('adf',isPackageExist,gaq);
            let isPostExist = await postModel.findOne({ slug: req.body.slug })
            let tabObj = {
                tab_name: req.body.tab_name
            }
            let tabArray = []
            if (!isGaqExist[0].gaq.length) {
                await tabArray.push(tabObj)
                let gaqObj = {
                    post_id: new mongoose.Types.ObjectId(isPostExist._id),
                    gaq_details: JSON.stringify(tabArray)
                }
                gaqModel(gaqObj).save()
                    .then(() => {
                        res.status(200).json({
                            message: 'GAQ Tab Created Successfully',
                            status: 1
                        })
                    }).catch((err) => {
                        res.status(500).json({
                            message: 'Failed To Create GAQ Tab',
                        })
                    })

                //console.log('before json', tabArray);
                //console.log('after conversion', JSON.stringify(tabArray));
            }
            else {
                tabArray = JSON.parse(isGaqExist[0].gaq[0].gaq_details)
                //console.log('tabArray', tabArray);
                await tabArray.push(tabObj)
                //console.log('after conversion', JSON.stringify(tabArray));
                //console.log(isGaqExist);
                gaqModel.findOneAndUpdate({
                    post_id: new mongoose.Types.ObjectId(isGaqExist[0]._id)
                },
                    {
                        gaq_details: JSON.stringify(tabArray)
                    }).then(() => {
                        res.status(200).json({
                            message: 'GAQ Tab Created Successfully',
                            status: 1
                        })

                    }).catch((err) => {
                        res.status(500).json({
                            message: 'Failed To Create GAQ Tab',
                        })
                    })
            }
        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async addGaq(req, res) {
        try {
            let isPostExist = await postModel.findOne({ slug: req.body.slug })

            //console.log('body', req.body);
            let isGaqExist = await postModel.aggregate([
                {
                    $match: {
                        slug: req.body.slug
                    }
                },
                {
                    $lookup: {
                        from: 'gaq',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'gaq'
                    }
                }, {
                    $project: {
                        title: 0,
                        content: 0,
                        featured_img: 0,
                        price: 0,
                        package_category: 0,
                        post_type: 0,
                        is_featured: 0,
                        is_festival: 0,
                        is_resort: 0,
                        is_deleted: 0,
                        slug: 0,
                        status: 0,
                        created_at: 0,
                        __v: 0,

                    }
                }
            ])

            let gaqArray = JSON.parse(isGaqExist[0].gaq[0].gaq_details)

            let newArr = await (gaqArray.map((x) => {
                let newObj = {
                    tab_name: req.body.tab_name,
                    tab_details: [{ title: req.body.title, desc: req.body.desc }]
                }
                if (x.tab_name === req.body.tab_name) {
                    if (x.tab_details == undefined) {

                        x = newObj
                    }
                    else {
                        x.tab_details.push({ title: req.body.title, desc: req.body.desc })
                    }

                }
                return x
            }))
            gaqModel.findOneAndUpdate({
                post_id: isPostExist._id
            },
                {
                    gaq_details: JSON.stringify(newArr)
                }).then(() => {
                    res.status(200).json({
                        message: 'GAQ Created Successfully',
                        status: 1
                    })

                }).catch((err) => {
                    res.status(500).json({
                        message: 'Failed To Create GAQ',
                    })
                })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }
    async loadSingleGaq(req, res) {
        try {
            let isGaqExist = await gaqModel.findOne({ _id: req.params.gaqid })

            let gaqArray = JSON.parse(isGaqExist.gaq_details)
            gaqArray.map((x, tab_index) => {
                if (tab_index == req.params.tab_index) {
                    //console.log('yes1');
                    x.tab_details.map((y, title_index) => {
                        if (title_index == (req.params.title_index)) {
                            res.status(200).json({
                                singleGaq: x
                            })
                        }
                    })
                } else {
                    //console.log('no');
                }
            })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async updateGaq(req, res) {
        try {
            let isGaqExist = await gaqModel.findOne({ _id: req.body.gaqid })
            let innerObj = {
                title: req.body.title,
                desc: req.body.desc
            }
            let ExistingInnerArr = JSON.parse(isGaqExist.gaq_details)[req.body.tab_index].tab_details
            ExistingInnerArr.splice(req.body.title_index, 1, innerObj)

            let OuterObj = {
                tab_name: req.body.tab_name,
                tab_details: ExistingInnerArr
            }

            let ExistingOuterArr = JSON.parse(isGaqExist.gaq_details)
            ExistingOuterArr.splice(req.body.tab_index, 1, OuterObj)

            gaqModel.findOneAndUpdate({ _id: req.body.gaqid },
                { gaq_details: JSON.stringify(ExistingOuterArr) })
                .then(() => {
                    //console.log('updated')
                    res.status(200).json({ message: 'GAQ Updated Successfully', status: 1 })
                }).catch((err) => {
                    //console.log('err', err);
                    res.status(500).json({ message: 'Failed To Update GAQ' })
                })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async deletePackageGaq(req, res) {
        try {
            let isGaqExist = await gaqModel.findOne({ _id: req.params.gaqid })

            let outerArray = JSON.parse(isGaqExist.gaq_details)
            let innerArray = JSON.parse(isGaqExist.gaq_details)[req.params.tab_index].tab_details

            let prevLength = innerArray.length
            innerArray.splice(req.params.title_index, 1)
            let newLength = innerArray.length

            outerArray[req.params.tab_index].tab_details = innerArray

            gaqModel.findOneAndUpdate(
                { _id: req.params.gaqid },
                {
                    gaq_details: JSON.stringify(outerArray)
                }).then(() => {
                    if (prevLength > newLength) {
                        res.status(200).json({
                            message: 'GAQ Deleted Successfully',
                            status: 1
                        })
                    }
                    else {
                        res.status(500).json({
                            message: 'Failed To Delete GAQ',
                            status: 0
                        })
                    }
                }).catch((err) => {
                    //console.log('err', err);
                    res.status(500).json({
                        message: 'GAQ Not Deleted',
                        status: -1
                    })
                })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async getGaqByHomeStay(req, res) {
        try {
            let isPostExist = await postModel.findOne({ slug: req.params.slug })
            gaqModel.findOne({ post_id: isPostExist._id })
                .then((data) => {
                    //console.log('hs gaq', data);
                    res.status(200).json({
                        HSgaq: data
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Unable To Fetch GAQs for Home Stay'
                    })
                })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async addHomestayGaq(req, res) {

        try {
            let isPostExist = await postModel.findOne({ slug: req.body.slug })

            let isGaqExist = await gaqModel.findOne({ post_id: isPostExist._id })

            if (isGaqExist == null) {
                let gaqArray = []
                const gaqObj = {
                    title: req.body.title,
                    desc: req.body.desc
                }
                gaqArray.push(gaqObj)
                //console.log('after conversion', JSON.stringify(gaqArray));
                const newObj = {
                    post_id: isPostExist._id,
                    gaq_details: JSON.stringify(gaqArray)
                }
                gaqModel(newObj).save()
                    .then((data) => {
                        if (data._id) {
                            res.status(200).json({
                                message: 'GAQ Creation Successful',
                                status: 1
                            })
                        }
                        else {
                            res.status(500).json({
                                message: 'Failed To Create GAQ'
                            })
                        }
                    }).catch((err) => {
                        //console.log('Error in creating gaq', err);
                        res.status(500).json({
                            message: 'Error in Creating GAQ'
                        })
                    })
            }
            else {
                let gaqArray = JSON.parse(isGaqExist.gaq_details)
                //console.log('before', gaqArray);
                const gaqObj = {
                    title: req.body.title,
                    desc: req.body.desc
                }
                gaqArray.push(gaqObj)
                //console.log('after conversion', JSON.stringify(gaqArray));
                gaqModel.findOneAndUpdate({ post_id: isPostExist._id }, {
                    gaq_details: JSON.stringify(gaqArray)
                }).then(() => {
                    res.status(200).json({
                        message: 'GAQ Creation Successful',
                        status: 1
                    })
                }).catch((err) => {
                    //console.log('Error in creating gaq', err);
                    res.status(500).json({
                        message: 'Error in Creating GAQ'
                    })
                })

            }
        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async loadSingleHomeStayGaq(req, res) {
        try {
            let isGaqExist = await gaqModel.findOne({ _id: req.params.gaqid })
            //console.log('params', req.params);
            let gaqArray = JSON.parse(isGaqExist.gaq_details)
            //console.log('gaq array', gaqArray);
            gaqArray.map((x, index) => {
                //console.log('inside x', req.params.title);
                //console.log('x theke', x.title);
                if (index == req.params.index) {
                    //console.log('yes');
                    res.status(200).json({
                        singleGaq: x
                    })
                }
                else {
                    //console.log('no');
                }
            })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async updateHomestayGaq(req, res) {
        try {
            let gaqObj = {
                title: req.body.title,
                desc: req.body.desc
            }

            let isGaqExist = await gaqModel.findOne({ _id: req.body.gaqid })

            let gaqArray = JSON.parse(isGaqExist.gaq_details)

            gaqArray.splice(req.body.index, 1, gaqObj)
            gaqModel.findOneAndUpdate({ _id: req.body.gaqid },
                { gaq_details: JSON.stringify(gaqArray) })
                .then(() => {
                    res.status(200).json(
                        {
                            message: 'FAQ Updated Successfully',
                            status: 1
                        })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Failed To Update FAQ'
                    })
                })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async deleteHomestayGaq(req, res) {
        try {
            let isGaqExist = await gaqModel.findOne({ _id: req.params.gaqid })

            let gaqArray = JSON.parse(isGaqExist.gaq_details)
            gaqArray.map((x, index) => {
                if (x.title.trim() === req.params.title) {
                    gaqArray.splice(index, 1)
                }
            })
            //console.log('after delete', gaqArray);
            gaqModel.findOneAndUpdate({ _id: req.params.gaqid },
                { gaq_details: JSON.stringify(gaqArray) })
                .then(() => {
                    res.status(200).json(
                        {
                            message: 'FAQ Deleted Successfully',
                            status: 1
                        })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Failed To Delete FAQ'
                    })
                })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

}

module.exports = new Gaq