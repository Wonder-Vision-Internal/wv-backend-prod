const  postModel = require('../Models/posts.schema')

class About{

async getVisionMission(req,res){

if(req.params.title === 'Vision'){
    postModel.findOne({title:req.params.title})
    .then((data)=>{
        res.status(200).json({
            aboutData:data
        })
    }).catch((err)=>{
        res.status(500).json({
            message:'Failed To Fetch Vision/Mission',
            Error:err
        })
    })
}
else if(req.params.title === 'Mission'){
    postModel.findOne({title:req.params.title})
    .then((data)=>{
        res.status(200).json({
            aboutData:data
        })
    }).catch((err)=>{
        res.status(500).json({
            message:'Failed To Fetch Vision/Mission',
            Error:err
        })
    })
}
}

async updateVisionMission(req,res){
    let isAboutExist = await postModel.findOne({title:req.body.title})
    function about_img() {
        if (req.body.featured_img !== "undefined") {
          console.log("from if");
          let new_img = "img/" + req.body.featured_img;
          return new_img;
        } else if (req.body.featured_img === "undefined") {
          console.log("from else");
          let new_img = isAboutExist.featured_img;
          return new_img;
        }
      }
      console.log(isAboutExist);
      console.log('image',req.body);
    postModel.findOneAndUpdate({title:req.body.title},
        {
            small_text:req.body.small_text,
            featured_img:about_img()
        }).then(()=>{
            if(req.body.title === 'Vision')
            res.status(200).json({
                message:'Vision Updated Successfully',
                status:1
            })
            else if(req.body.title === 'Mission')
            res.status(200).json({
                message:'Mission Updated Successfully',
                status:1
            })
        }).catch((err)=>{
            if(req.body.title === 'Vision')
            res.status(500).json({
                message:'Failed To Update Vision'
            })
            else if(req.body.title === 'Mission')
            res.status(200).json({
                message:'Failed To Update Mission'
            })
        })
}

}

module.exports = new About