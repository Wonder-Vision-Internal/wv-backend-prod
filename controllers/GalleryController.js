const mongoose = require("mongoose");
const galleryModel = require("../Models/home_package_gallery.schema");
const postModel = require("../Models/posts.schema");

class galleryController {

  async getGalleryBySlug(req, res) {
    try {
      postModel
      .aggregate([
        {
          $match: {
            slug: req.params.slug,
          },
        },
        {
          $lookup: {
            from: "home_package_gallery",
            localField: "_id",
            foreignField: "post_id",
            as: "galleryDetails",
          },
        },
        {
          $project: {
            content: 0,
            featured_img: 0,
            video_link: 0,
            small_text: 0,
            post_type: 0,
            price: 0,
            status: 0,
            created_at: 0,
            is_featured: 0,
            is_festival: 0,
            is_resort: 0,
            main_img: 0,
            is_deleted: 0,
          },
        },
      ])
      .then((data) => {
        //console.log("gallery data", data);
        res.status(200).json({
          galleryInfo: data,
        });
      })
      .catch((err) => {
        //console.log("Error in fetching gallery", err);
        res.status(500).json({
          message: "Unable To Fetch Gallery",
        });
      });
    }catch (error) {
        res.status(500).send({ message: error.message });
    }

  }

  async addHomeStayPackageGallery(req, res) {
    try {
      let isPostExist = await postModel.findOne({ slug: req.params.slug });

      const galleryObj = {
        ...req.body,
        post_id: new mongoose.Types.ObjectId(isPostExist._id),
        img: "img/" + req.body.img,
      };
      galleryModel(galleryObj)
        .save()
        .then((data) => {
          if (data._id) {
            res.status(200).json({
              message: "Gallery Picture Created Successfully",
              status: 1,
            });
          } else {
            res.status(500).json({
              message: "Failed To Create Gallery Picture",
              status: 0,
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            Error: err,
          });
        });
    }catch (error) {
        res.status(500).send({ message: error.message });
    }

  }

  async loadSingleGallery(req, res) {
    try {
      let isGalleryExist = await galleryModel.findOne({ _id: req.params.galid });
      if (isGalleryExist) {
        //console.log("load single gallery", isGalleryExist);
        res.status(200).json({
          galleryDetails: isGalleryExist,
        });
      } else {
        res.status(500).json({
          message: "Unable To Fetch Gallery Information",
        });
      }
    }catch (error) {
        res.status(500).send({ message: error.message });
    }

  }

  async updateGallery(req, res) {
    try {
      let isGalleryExist = await galleryModel.findOne({ _id: req.params.galid });
      function gal_img() {
        if (req.body.img !== "undefined") {
          //console.log("from if");
          let new_img = "img/" + req.body.img;
          return new_img;
        } else if (req.body.img === "undefined") {
          //console.log("from else");
          let new_img = isGalleryExist.img;
          return new_img;
        }
      }
      galleryModel
        .findOneAndUpdate(
          { _id: req.params.galid },
          {
            ...req.body,
            img: gal_img(),
          }
        )
        .then(() => {
          res.status(200).json({
            message: "Gallery Image Updated Successfully",
            status: 1,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Failed to Update Gallery Image",
            Error: err,
          });
        });
    }catch (error) {
        res.status(500).send({ message: error.message });
    }

  }

  async deleteGalleryPicture(req, res) {
    try {
      galleryModel.findOneAndDelete(
        {
          _id: req.params.galid
        })
        .then(() => {
          //console.log('Deleted')
          res.status(200).json({
            message: 'Gallery Picture Deleted Successfully',
            status: 1
          })
        })
        .catch((err) => {
          //console.log('Error in Deleting The Gallery Picture',err)
          res.status(500).json({
            message: 'Failed to Delete The Gallery Picture'
          })
        })
    }catch (error) {
        res.status(500).send({ message: error.message });
    }

  }

}
module.exports = new galleryController();
