const mongoose = require("mongoose");
const postModel = require("../Models/posts.schema");
const roomsModel = require("../Models/rooms.schema");
const expertFormModel = require("../Models/experForm.schema");
const homePackageDetailsModel = require('../Models/home_package_details.schema')

class HomeStay {
  async getAllHomeStay(req, res) {
    try {
      const allHomeStay = await postModel.find({
        post_type: "home_stay",
        is_deleted: false,
      });

      res.status(200).json({
        details: allHomeStay,
      });
    } catch (err) {
      res.status(400).json({ Error: err });
    }
  }

  async getHomeStayBySlug(req, res) {
    try {
      await postModel
        .findOne({ slug: req.params.slug })
        .then((data) => {
          res.status(200).json({
            homeStayDetails: data,
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: "Unable To Fetch Data",
            Error: err,
          });
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async addHomeStay(req, res) {
    try {
      const createSlug = (title) => {
        let arr = title.split("");
        // console.log('before conversion',arr)

        arr = arr.map((data) => {
          if (data == " ") {
            return data.replace(" ", "-");
          } else if (data == ",") {
            return data.replace(",", "-");
          }
          return data.toLowerCase();
        });
        console.log("after conversion", arr.join(""));
        return arr.join("");
      };

      const homeObj = {
        ...req.body,
        post_type: "home_stay",
        featured_img: "img/" + req.body.featured_img,
        main_img: "img/" + req.body.main_img,
        slug: createSlug(req.body.title),
        meta: {
          title: req.body.meta_title.trim(),
          description: req.body.meta_desc.trim(),
          keywords: req.body.meta_keywords.trim(),
        },
        status: 0,
      };
      postModel(homeObj)
        .save()
        .then((data) => {
          if (data._id) {
            res.status(200).json({
              message: "Home Stay Created Successfully",
              status: 1,
            });
          } else {
            res.status(500).json({
              message: "Unable To Create Home Stay",
              status: 0,
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            Error: err,
          });
        });
    } catch (err) {
      res.status(400).json({ Error: err });
    }
  }

  async updateHomeStay(req, res) {
    try {
      let isPostExist = await postModel.findOne({ _id: req.body.postId });
      console.log('ispostexist', isPostExist);
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
      function mainimg() {
        if (req.body.main_img !== "undefined") {
          console.log("from if");
          let new_img = "img/" + req.body.main_img;
          return new_img;
        } else if (req.body.main_img === "undefined") {
          console.log("from else");
          let new_img = isPostExist.main_img;
          return new_img;
        }
      }

      postModel
        .findOneAndUpdate(
          {
            _id: req.body.postId,
          },
          {
            ...req.body,
            featured_img: featureimg(),
            main_img: mainimg(),
            meta: {
              title: req.body.meta_title.trim(),
              description: req.body.meta_desc.trim(),
              keywords: req.body.meta_keywords.trim(),
            },
          }
        )
        .then(() => {
          res.status(200).json({
            message: "Home Stay Updated Successfully",
            status: 1,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Failed to Update Home Stay",
            Error: err,
          });
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async deleteHomeStay(req, res) {
    try {
      postModel
        .findOneAndUpdate(
          {
            slug: req.params.slug,
          },
          {
            is_deleted: true,
          }
        )
        .then(() => {
          console.log("Home Stay Deleted");
          res.status(200).json({
            message: "Home Stay Deleted Successfully",
            status: 1,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Failed To Delete Home Stay",
            Error: err,
          });
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async hideUnhideHomeStay(req, res) {
    try {
      let isPostExist = await postModel.findOne({ slug: req.params.slug });
      if (isPostExist.status === "1") {
        await postModel
          .findOneAndUpdate(
            {
              slug: req.params.slug,
            },
            {
              status: "0",
            }
          )
          .then(() => {
            res.status(200).json({
              message: "Home Stay Hidden Successfully",
              status: 1,
            });
          })
          .catch(() => {
            res.status(500).json({
              message: "Failed To Hide Home Stay",
            });
          });
      } else if (isPostExist.status === "0") {
        postModel
          .findOneAndUpdate(
            {
              slug: req.params.slug,
            },
            {
              status: "1",
            }
          )
          .then(() => {
            res.status(200).json({
              message: "Home Stay Unhidden Successfully",
              status: 2,
            });
          })
          .catch(() => {
            res.status(500).json({
              message: "Failed To Unhide Home Stay",
            });
          });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async filterRooms(req, res) {
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
              from: "Rooms",
              localField: "_id",
              foreignField: "post_id",
              as: "roomsData",
            },
          },
        ])
        .then((data) => {
          res.status(200).json({
            details: data,
          });
        })
        .catch((err) => {
          res.status(500).json({
            Error: err,
          });
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async addRooms(req, res) {
    try {
      let isPostExist = await postModel.findOne({ slug: req.params.slug });

      const roomObj = {
        ...req.body,
        post_id: new mongoose.Types.ObjectId(isPostExist._id),
        img: "img/" + req.body.img,
      };
      roomsModel(roomObj)
        .save()
        .then((data) => {
          if (data._id) {
            res.status(200).json({
              message: "Room Created Successfully",
              status: 1,
            });
          } else {
            res.status(500).json({
              message: "Failed To Create Room",
              status: 0,
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            Error: err,
          });
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async deleteRoom(req, res) {
    try {
      roomsModel
        .findOneAndUpdate(
          {
            _id: req.params.roomid,
          },
          {
            is_deleted: true,
          }
        )
        .then(() => {
          res.status(200).json({
            message: "Room Deleted Successfully",
            status: 1,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Failed To Delete Room",
            status: 0,
          });
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async hideUnhideRoom(req, res) {

    try {

      let isPostExist = await roomsModel.findOne({ _id: req.body.roomid });


      if (isPostExist.is_deleted === false) {
        console.log('if');
        roomsModel
          .findOneAndUpdate(
            {
              _id: req.body.roomid,
            },
            {
              is_deleted: true,
            }
          )
          .then(() => {
            console.log("hello");
            res.status(200).json({
              message: "Room Hidden Successfully",
              status: 1,
            });
          })
          .catch((err) => {
            console.log('err', err);
            res.status(500).json({
              message: "Failed To Hide Room",
            });
          });
      } else if (isPostExist.is_deleted === true) {
        console.log('else if');
        roomsModel
          .findOneAndUpdate(
            {
              _id: req.body.roomid,
            },
            {
              is_deleted: false,
            }
          )
          .then(() => {
            console.log("hello");
            res.status(200).json({
              message: "Room Unhidden Successfully",
              status: 2,
            });
          })
          .catch((err) => {
            console.log('err', err);
            res.status(500).json({
              message: "Failed To Unhide Room",
            });
          });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }


  }

  async getRoomById(req, res) {
    try {
      roomsModel
        .aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(req.params.roomid),
            },
          },
          {
            $lookup: {
              from: "Post",
              localField: "post_id",
              foreignField: "_id",
              as: "postDetails",
            },
          },
        ])
        .then((data) => {
          res.status(200).json({
            roomDetails: data,
          });
        })
        .catch((err) => {
          res.status(500).json({
            Error: err,
          });
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async updateRoom(req, res) {
    try {
      let isRoomExist = await roomsModel.findOne({ _id: req.params.roomid });
      function room_img() {
        if (req.body.img !== "undefined") {
          console.log("from if");
          let new_img = "img/" + req.body.img;
          return new_img;
        } else if (req.body.img === "undefined") {
          console.log("from else");
          let new_img = isRoomExist.img;
          return new_img;
        }
      }
      roomsModel
        .findOneAndUpdate(
          {
            _id: req.params.roomid,
          },
          {
            ...req.body,
            img: room_img(),
          }
        )
        .then(() => {
          res.status(200).json({
            message: "Room Updated Successfully",
            status: 1,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Failed to Update Room",
            Error: err,
          });
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async getBottomBanner(req, res) {
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
              from: "Post",
              localField: "_id",
              foreignField: "post_id",
              as: "bottomBanner",
            },
          },
        ])
        .then((data) => {
          res.status(200).json({
            bottomData: data,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Failed To Filter Bottom Banner",
          });
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async addBottomBanner(req, res) {
    try {
      let isPostExist = await postModel.findOne({ slug: req.params.slug });

      const banObj = {
        post_type: "contact_form",
        status: 1,
        post_id: new mongoose.Types.ObjectId(isPostExist._id),
        featured_img: "img/" + req.body.img,
      };
      postModel(banObj)
        .save()
        .then((data) => {
          if (data._id) {
            res.status(200).json({
              message: "Bottom Banner Created Successfully",
              status: 1,
            });
          } else {
            res.status(500).json({
              message: "Failed To Create Bottom Banner",
              status: 0,
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            Error: err,
            message: "Error in Creating Bottom Banner",
          });
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async updateBottomBanner(req, res) {
    try {
      let isPostExist = await postModel.findOne({ _id: req.params.bannerId });
      if (isPostExist) {
        postModel
          .findOneAndUpdate(
            { _id: req.params.bannerId },
            {
              featured_img: "img/" + req.body.img,
            }
          )
          .then(() => {
            res.status(200).json({
              message: "Bottom Banner Updated Successfully",
              status: 1,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: "Failed To Update Bottom Banner",
            });
          });
      } else {
        res.status(500).json({
          message: "Unable To Find Bottom Banner",
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async deleteBottomBanner(req, res) {
    try {
      postModel
        .findOneAndDelete({ _id: req.params.bannerId })
        .then(() => {
          res.status(200).json({
            message: "Bottom Banner Deleted Successfully",
            status: 1,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Failed To Delete Bottom Banner",
          });
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async HomeStayLogoRatingList(req, res) {
    try {
      let isPostExist = await postModel.findOne({ slug: req.params.slug });
      expertFormModel
        .findOne({ post_id: isPostExist._id })
        .then((data) => {
          console.log(data);
          res.status(200).json({
            expertFormData: data,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Failed To Load Logo Rating Information",
            Error: err,
          });
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async addHomePakcageLogoRating(req, res) {
    try {
      let obj;
      let isPostExist = await postModel.findOne({ slug: req.body.slug });
      let isExpertformExist = await expertFormModel.findOne({
        post_id: isPostExist._id,
      });

      if (isExpertformExist) {
        console.log("from if");

        let logoArr = JSON.parse(isExpertformExist.paragraph);
        logoArr.push({
          img: "img/" + req.body.img,
          text: req.body.text,
        });
        obj = {
          post_id: new mongoose.Types.ObjectId(isPostExist._id),
          score: req.body.score ? req.body.score : isExpertformExist.score,
          text: req.body.bottomText
            ? req.body.bottomText
            : isExpertformExist.bottomText,
          paragraph: JSON.stringify(logoArr),
        };
        expertFormModel
          .findOneAndUpdate({ post_id: isPostExist._id }, obj)
          .then((data) => {
            if (data._id) {
              res.status(200).json({
                message: "Document Created Successfully",
                status: 1,
              });
            } else {
              res.status(500).json({
                message: "Document Not Created",
                status: 0,
              });
            }
          })
          .catch((err) => {
            res.status(500).json({
              message: "Failed To Create Document",
              status: -1,
            });
          });
      } else {
        let logoArr = [];
        logoArr.push({
          img: "img/" + req.body.img,
          text: req.body.text,
        });
        obj = {
          post_id: new mongoose.Types.ObjectId(isPostExist._id),
          score: req.body.score,
          text: req.body.bottomText,
          paragraph: JSON.stringify(logoArr),
        };
        console.log("obj", obj);
        expertFormModel(obj)
          .save()
          .then((data) => {
            if (data._id) {
              res.status(200).json({
                message: "Document Created Successfully",
                status: 1,
              });
            } else {
              res.status(500).json({
                message: "Document Not Created",
                status: 0,
              });
            }
          })
          .catch((err) => {
            res.status(500).json({
              message: "Failed To Create Document",
              status: -1,
            });
          });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async updateLogoRating(req, res) {
    try {
      if (req.body.type === "text") {
        expertFormModel
          .findOneAndUpdate(
            { _id: req.body.logoratingId },
            {
              score: req.body.score,
              text: req.body.bottomText,
            }
          )
          .then(() => {
            res.status(200).json({
              message: "Document Updated Successfully",
              status: 1,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: "Failed To Update Document",
              Error: err,
            });
          });
      } else if (req.body.type === "logo") {
        let isLogoRatingExist = await expertFormModel.findOne({
          _id: req.body.logoratingId,
        });
        let paragraphArr = JSON.parse(isLogoRatingExist.paragraph);
        function logo_img() {
          if (req.body.img !== "undefined") {
            console.log("from if");
            let new_img = "img/" + req.body.img;
            return new_img;
          } else if (req.body.img === "undefined") {
            console.log("from else");
            let new_img = paragraphArr[req.body.index].img;
            return new_img;
          }
        }
        const obj = {
          text: req.body.text,
          img: logo_img(),
        };

        paragraphArr.splice(req.body.index, 1, obj);
        expertFormModel
          .findOneAndUpdate(
            { _id: req.body.logoratingId },
            {
              paragraph: JSON.stringify(paragraphArr),
            }
          )
          .then(() => {
            res.status(200).json({
              message: "Document Updated Successfully",
              status: 1,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: "Failed To Update Document",
              Error: err,
            });
          });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async deleteLogoRating(req, res) {
    try {
      let isLogoRatingExist = await expertFormModel.findOne({
        _id: new mongoose.Types.ObjectId(req.params.id),
      });
      let paragraph = JSON.parse(isLogoRatingExist.paragraph);
      paragraph.splice(req.params.index, 1);
      expertFormModel
        .findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(req.params.id) },
          {
            paragraph: JSON.stringify(paragraph),
          }
        )
        .then(() => {
          res.status(200).json({
            message: "Document Deleted Successfully",
            status: 1,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Failed To Delete Document",
            Error: err,
          });
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async otherHomeStay(req, res) {

    try {

      let isPostExist = await postModel.findOne({ slug: req.params.slug })

      if (isPostExist) {
        let isDetailsExist = await homePackageDetailsModel.findOne({ post_id: isPostExist._id })
        if (isDetailsExist !== null && isDetailsExist.other_hs !== null) {
          let other = isDetailsExist.other_hs
          if (other.length > 0) {
            let promises = await other.map(async (x) => {
              let details = await postModel.aggregate([
                {
                  $match: {
                    _id: x.post_id
                  }
                },
                {
                  $project: {
                    _id: 1,
                    title: 1,
                    main_img: 1,
                    slug: 1,
                    post_type: 1
                  }
                }
              ])
              return details
            })

            let newArr = await Promise.all(promises)

            let newArr1 = newArr.length > 0 && newArr.map((x) => {
              return x[0]
            })
            let obj = {
              arr: newArr1,
              title: isPostExist.title
            }
            res.status(200).json({ other: obj })
          }
          else {
            console.log('hi');
            res.status(200).json({ other: [] })
          }

        }
        else {
          res.status(200).json({ other: [] })
        }
      } else {
        res.status(200).json({ other: [] })
      }

    } catch (err) {
      res.status(200).json({ other: [] })
    }
  }

  async addOtherHomeStay(req, res) {
    try {
      let isMainPostExist = await postModel.findOne({ slug: req.body.main_slug })
      let isOtherPostExist = await postModel.findOne({ slug: req.body.other_slug })
      let isDetailsExist = await homePackageDetailsModel.findOne({ post_id: isMainPostExist._id })
      if (isDetailsExist) {
        let arr = isDetailsExist.other_hs
        arr.push({ post_id: new mongoose.Types.ObjectId(isOtherPostExist._id) })
        homePackageDetailsModel.findOneAndUpdate({ post_id: new mongoose.Types.ObjectId(isMainPostExist._id) },
          { other_hs: arr })
          .then(() => {
            res.status(200).json({ status: 1, message: 'Other Homestay Added Successfully' })
          }).catch((err) => {
            res.status(500).json({ message: 'Failed To Add Other Homestay', Error: err })
          })
      }
      else {
        let arr = [{ post_id: new mongoose.Types.ObjectId(isOtherPostExist._id) }]
        let obj = {
          post_id: new mongoose.Types.ObjectId(isMainPostExist._id),
          other_hs: arr
        }
        homePackageDetailsModel(obj).save()
          .then(() => {
            res.status(200).json({ status: 1, message: 'Other Homestay Added Successfully' })
          }).catch((err) => {
            res.status(500).json({ message: 'Failed To Add Other Homestay', Error: err })
          })
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async deleteOtherHomeStay(req, res) {
    try {
      let isPostExist = await postModel.findOne({ slug: req.params.slug })
      let isDetailsExist = await homePackageDetailsModel.findOne({ post_id: isPostExist._id })
      let arr = isDetailsExist.other_hs
      arr.splice(req.params.index, 1)

      homePackageDetailsModel.findOneAndUpdate({ post_id: isPostExist._id },
        { other_hs: arr })
        .then(() => {
          res.status(200).json({ status: 1, message: 'Other Homestay Deleted Successfully' })
        }).catch((err) => {
          console.log('err', err);
          res.status(500).json({ message: 'Failed To Delete Other Homestay', Error: err })
        })

    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async otherPackage(req, res) {

    try {

      let isPostExist = await postModel.findOne({ slug: req.params.slug })

      if (isPostExist) {
        let isDetailsExist = await homePackageDetailsModel.findOne({ post_id: isPostExist._id })
        if (isDetailsExist !== null && isDetailsExist.other_pac !== null) {
          let other = isDetailsExist.other_pac
          if (other.length > 0) {
            let promises = await other.map(async (x) => {
              let details = await postModel.aggregate([
                {
                  $match: {
                    _id: x.post_id
                  }
                },
                {
                  $project: {
                    _id: 1,
                    title: 1,
                    featured_img: 1,
                    slug: 1,
                    post_type: 1
                  }
                }
              ])
              return details
            })
            let newArr = await Promise.all(promises)

            let newArr1 = newArr.length > 0 && newArr.map((x) => {
              return x[0]
            })
            let obj = {
              arr: newArr1,
              title: isPostExist.title
            }
            console.log('new', obj);
            res.status(200).json({ other: obj })
          }
          else {
            res.status(200).json({ other: [] })
          }
        }
        else {
          res.status(200).json({ other: [] })
        }
      } else {
        res.status(200).json({ other: [] })
      }


    } catch (er) {
      res.status(200).json({ other: [] })
    }

  }

  async addOtherPackage(req, res) {
    try {
      let isMainPostExist = await postModel.findOne({ slug: req.body.main_slug })
      let isOtherPostExist = await postModel.findOne({ slug: req.body.other_slug })
      let isDetailsExist = await homePackageDetailsModel.findOne({ post_id: isMainPostExist._id })
      if (isDetailsExist) {
        let arr = isDetailsExist.other_pac
        arr.push({ post_id: new mongoose.Types.ObjectId(isOtherPostExist._id) })
        homePackageDetailsModel.findOneAndUpdate({ post_id: new mongoose.Types.ObjectId(isMainPostExist._id) },
          { other_pac: arr })
          .then(() => {
            res.status(200).json({ status: 1, message: 'Other Package Added Successfully' })
          }).catch((err) => {
            res.status(500).json({ message: 'Failed To Add Other Package', Error: err })
          })
      }
      else {
        let arr = [{ post_id: new mongoose.Types.ObjectId(isOtherPostExist._id) }]
        let obj = {
          post_id: new mongoose.Types.ObjectId(isMainPostExist._id),
          other_pac: arr
        }
        homePackageDetailsModel(obj).save()
          .then(() => {
            res.status(200).json({ status: 1, message: 'Other Package Added Successfully' })
          }).catch((err) => {
            res.status(500).json({ message: 'Failed To Add Other Package', Error: err })
          })
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async deleteOtherPackage(req, res) {
    try {
      let isPostExist = await postModel.findOne({ slug: req.params.slug })
      let isDetailsExist = await homePackageDetailsModel.findOne({ post_id: isPostExist._id })
      let arr = isDetailsExist.other_pac
      arr.splice(req.params.index, 1)

      homePackageDetailsModel.findOneAndUpdate({ post_id: isPostExist._id },
        { other_pac: arr })
        .then(() => {
          res.status(200).json({ status: 1, message: 'Other Package Deleted Successfully' })
        }).catch((err) => {
          console.log('err', err);
          res.status(500).json({ message: 'Failed To Delete Other Package', Error: err })
        })
    } catch (error) {
      res.status(500).send({ message: error.message });
    }


  }


}

module.exports = new HomeStay();

