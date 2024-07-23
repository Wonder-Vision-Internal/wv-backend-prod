const mongoose = require('mongoose')
const postModel = require('../Models/posts.schema')

class BlogController {

    async getAllBlogs(req, res) {

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
    }

async addBlog(req,res){
    console.log(req.body);
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
    const blogObj={
        ...req.body,
        slug: createSlug(req.body.title),
        post_type:'blog',
        featured_img:'img/'+req.body.featured_img
    }
    postModel(blogObj)
    .save()
    .then((data)=>{
        if(data._id){
            res.status(200).json({
                message:'Blog Created Successfully',
                status:1
            })
        }
    }).catch((err)=>{
        res.status(500).json({
            message:'Failed To Create Blog',
            Error:err
        })
    })
}

async loadSingleBlog(req,res){
    console.log('params',req.params);
    postModel.findOne({_id:req.params.blogId})
    .then((data)=>{
        res.status(200).json({
           blogData:data
        })
    }).catch((err)=>{
        res.status(500).json({
            message:'Failed To Load Blog',
            Error:err
        })
    })
}

async updateBlog(req,res){
    console.log('req body',req.body);
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
            _id:req.body.blogId
        },{
            ...req.body,
            featured_img:featureimg()
        })
        .then(()=>{
            res.status(200).json({
                message:'Blog Updated Successfully',
                status:1
            })
        }).catch((err)=>{
            res.status(500).json({
                message:'Failed To Update Blog'
            })
        })
}

async deleteBlog(req,res){
    console.log('params',req.params);
    postModel.findOneAndDelete({_id:req.params.blogId})
    .then(()=>{
        res.status(200).json({
            message:'Blog Deleted Successfully',
            status:1
        })
    }).catch((err)=>{
        res.status(500).json({
            message:'Failed To Delete Blog'
        })
    })
}

}

module.exports = new BlogController