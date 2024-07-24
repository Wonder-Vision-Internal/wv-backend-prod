const mongoose = require("mongoose");
const postModel = require("../Models/posts.schema");
const homePackageDetailsModel = require("../Models/home_package_details.schema");
const inclusionModel = require("../Models/inclusions.schema");
const { findOneAndDelete } = require("../Models/user.schema");

// Function To Capitalise Each Word of The Package Category
const formatCategory = (input) => {
  try {
    let output = input.map((data) => {
      let arr = data.package_category.split("");
      for (let i = 0; i < arr.length; i++) {
        if (i == 0) {
          arr[i] = arr[i].toUpperCase();
        } else if (arr[i] == "_") {
          arr[i] = arr[i].replace("_", " ");
        } else if (arr[i - 1] == " ") {
          arr[i] = arr[i].toUpperCase();
        }
      }
      data.package_category = arr.join("");
      return data;
    });

    return output;
  } catch (error) {
    res.status(500).send([]);
  }

};

const markAsOtherHSPackage = async (req, res) => {
  try {
    let isPostExist = await postModel.findOne({ slug: Object.keys(req.body)[0] });

    if (isPostExist.is_other) {
      postModel
        .findOneAndUpdate(
          { slug: Object.keys(req.body)[0] },
          {
            is_other: false,
          }
        )
        .then(() => {
          res.status(200).json({
            message: "Removed From Other Homestay/Packages",
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Failed To Remove From Other Homestay/Packages",
          });
        });
    } else if (!isPostExist.is_other) {
      postModel
        .findOneAndUpdate(
          { slug: Object.keys(req.body)[0] },
          {
            is_other: true,
          }
        )
        .then(() => {
          res.status(200).json({
            message: "Added To Other Homestay/Packages",
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Failed To Add Other Homestay/Packages",
            Error: err,
          });
        });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

};

const getCategoryImages = async (req, res) => {
  try {
    const titles = [
      "incredible_india",
      "wild_africa",
      "beautiful_asia",
      "adventure_himalayas",
      "colorful_festival",
    ];
    postModel
      .find({ title: { $in: titles } })
      .then((data) => {
        console.log(data);
        res.status(200).json({
          CategoryData: data,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Failed To Load Category Images",
        });
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

};

const updateCategoryImage = async (req, res) => {
  try {
    let isPostExist = await postModel.findOne({ _id: req.params.catImageId });
    if (isPostExist) {
      postModel
        .findOneAndUpdate(
          { _id: req.params.catImageId },
          {
            featured_img: "img/" + req.body.img,
          }
        )
        .then(() => {
          res.status(200).json({
            message: "Category Image Updated Successfully",
            status: 1,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Failed To Update Category Image",
          });
        });
    } else {
      res.status(500).json({
        message: "Unable To Find Category Image",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

};

const getAllPackages = async (req, res) => {
  try {
    const packages = await postModel.aggregate([
      {
        $match: {
          post_type: "packages",
        },
      },
      {
        $lookup: {
          from: "home_package_details",
          localField: "_id",
          foreignField: "post_id",
          as: "packageDetails",
        },
      },
    ]);

    if (packages) {
      let output = formatCategory(packages);
      if (output) {
        res.status(200).json({ packages: output });
      } else {
        res.status(500).json({
          message: "Unable To Fetch Filtered Data",
        });
      }
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

};

const filterPackages = async (req, res) => {
  try {
    const packages = await postModel.aggregate([
      {
        $match: {
          package_category: req.params.package_category,
        },
      },
      {
        $lookup: {
          from: "home_package_details",
          localField: "_id",
          foreignField: "post_id",
          as: "packageDetails",
        },
      },
    ]);
    if (packages) {
      let output = formatCategory(packages);
      if (output) {
        res.status(200).json({ packages: output });
      } else {
        res.status(500).json({
          message: "Unable To Fetch Filtered Data",
        });
      }
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }


};

const getPackageBySlug = async (req, res) => {
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
            from: "home_package_details",
            localField: "_id",
            foreignField: "post_id",
            as: "package",
          },
        },
      ])
      .then((data) => {
        res.status(200).json({
          package: data,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Unable To Load Package",
        });
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

};

const addPackage = async (req, res) => {
  try {
    const createSlug = (title) => {
      let arr = title.split("");
      arr = arr.map((data) => {
        if (data == " ") {
          return data.replace(" ", "-");
        }
        return data.toLowerCase();
      });
      return arr.join("");
    };

    const postObj = {
      title: req.body.title,
      content: req.body.content,
      featured_img: "img/" + req.body.featured_img,
      main_img: req.body.main_img === 'undefined' ? '' : "img/" + req.body.main_img,
      post_type: "packages",
      slug: createSlug(req.body.title),
      package_category: req.body.package_category,
      meta: {
        title: req.body.meta_title.trim(),
        description: req.body.meta_desc.trim(),
        keywords: req.body.meta_keywords.trim(),
      }
    };

    let newPost = await postModel(postObj).save();

    if (newPost._id) {
      const detailsObj = {
        post_id: new mongoose.Types.ObjectId(newPost._id),
        days: req.body.days,
        nights: req.body.nights,
        price_details: [],
        emi_price: req.body.emi_price,
      };
      let packageDetails = await homePackageDetailsModel(detailsObj).save();
      if (packageDetails._id) {
        res.status(200).json({
          message: "Package Created Successfully",
          status: 1,
          slug: newPost.slug,
        });
      } else {
        res.status(500).json({
          message: "Error in Creating Package Details",
          status: -1,
        });
      }
    } else {
      res.status(500).json({
        message: "Error in Creating Package",
        status: -3,
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

};

const addPackageTab = async (req, res) => {
  try {
    let post = await postModel.findOne({ slug: req.body.slug });
    let isPostExist = await homePackageDetailsModel.findOne({
      post_id: new mongoose.Types.ObjectId(post._id),
    });

    tabInfo = {
      title: req.body.title,
      content: req.body.content,
    };

    if (isPostExist.other_details) {
      let tabArray = JSON.parse(isPostExist.other_details);
      tabArray.push(tabInfo);
      homePackageDetailsModel
        .findOneAndUpdate(
          { _id: isPostExist._id },
          {
            other_details: JSON.stringify(tabArray),
          }
        )
        .then(() => {
          res.status(200).json({
            message: "Package Tab Added Successfully",
            status: 1,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Error in Creating Package Tab",
          });
        });
    } else {
      let tabArray = [];
      tabArray.push(tabInfo);

      homePackageDetailsModel
        .findOneAndUpdate(
          { _id: isPostExist._id },
          {
            other_details: JSON.stringify(tabArray),
          }
        )
        .then(() => {
          res.status(200).json({
            message: "Package Tab Added Successfully",
            status: 1,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Error in Creating Package Tab",
          });
        });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

};

const addPriceDetails = async (req, res) => {
  try {
    let isPostExist = await postModel.findOne({ slug: req.body.slug })
    let isPackageDetailsExist = await homePackageDetailsModel.findOne({ post_id: isPostExist._id })
    let existingArr = isPackageDetailsExist.price_details
    let arr_obj =
    {
      description: req.body.description,
      price: req.body.price
    }
    existingArr.push(arr_obj)
    if (isPackageDetailsExist.price_details.length) {
      homePackageDetailsModel.findOneAndUpdate({ post_id: isPostExist._id },
        {
          price_details: existingArr
        }).then(() => {
          res.status(200).json({ message: 'Price Detail Added Successfully', status: 1 })
        }).catch((err) => {
          res.status(500).json({ message: 'Failed To Add Price Detail' })
        })
    }
    else {
      homePackageDetailsModel.findOneAndUpdate({ post_id: isPostExist._id },
        {
          price_details: existingArr
        }).then(() => {
          res.status(200).json({ message: 'Price Detail Added Successfully', status: 1 })
        }).catch((err) => {
          res.status(500).json({ message: 'Failed To Add Price Detail', Error: err })
        })
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

}

const deletePriceDetails = async (req, res) => {
  try {
    let isPostExist = await postModel.findOne({ slug: req.body.slug })
    let isDetailsExist = await homePackageDetailsModel.findOne({ post_id: isPostExist._id })
    isDetailsExist.price_details.splice(req.body.index, 1)
    homePackageDetailsModel.findOneAndUpdate({ post_id: isPostExist._id },
      {
        price_details: isDetailsExist.price_details
      }).then(() => {
        res.status(200).json({ message: 'Price Detail Deleted Successfully', status: 1 })
      }).catch((err) => {
        res.status(500).json({ message: 'Failed To Delete Price Detail', Error: err })
      })
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

}


const updatePackage = async (req, res) => {
  try {
    let isPostExist = await postModel.findOne({
      _id: new mongoose.Types.ObjectId(req.body.postId),
    });
    function featureimg() {
      if (req.body.featured_img !== "undefined") {

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

        let new_img = "img/" + req.body.main_img;
        return new_img;
      } else if (req.body.main_img === "undefined") {
        console.log("from else");
        let new_img = isPostExist.main_img;
        return new_img;
      }
    }
    await postModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.body.postId) },
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
    );
    let newArr
    if (req.body.price_details !== 'undefined') {
      let price_details = JSON.parse(req.body.price_details)
      newArr = await price_details.map((x) => {
        x.price = parseInt(x.price)
        return x
      })
    }

    homePackageDetailsModel
      .findOneAndUpdate(
        { post_id: new mongoose.Types.ObjectId(req.body.postId) },
        {
          days: req.body.days,
          nights: req.body.nights,
          starts_from: req.body.starts_from,
          price_details: newArr !== 'undefined' ? newArr : null,
          emi_price: req.body.emi_price,
        }
      )
      .then(() => {
        res.status(200).json({
          message: "Basic Package Details Updated Successfully",
          status: 1,
        });
      })
      .catch((err) => {
        res.status(200).json({
          message: "Failed To Update Basic Package Details",
          Error: err,
        });
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

};

const fetchTabNames = async (req, res) => {
  try {
    let isPostExist = await postModel.findOne({ slug: req.params.slug });
    let isDetailsExist = await homePackageDetailsModel.findOne({
      post_id: isPostExist._id,
    });

    if (isPostExist && isDetailsExist) {
      res.status(200).json({
        tabDetails: isDetailsExist,
      });
    } else {
      res.status(500).json({
        message: "Failed To Load Tab Details",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

};

const updatePackageTab = async (req, res) => {
  try {
    let isDetailsExist = await homePackageDetailsModel.findOne({
      _id: new mongoose.Types.ObjectId(req.body.detailsId),
    });
    if (isDetailsExist) {
      let detailsArr = JSON.parse(isDetailsExist.other_details);

      let objToBeUpdated = {
        title: req.body.title,
        content: req.body.content,
      };
      detailsArr.splice(req.body.index, 1, objToBeUpdated);

      homePackageDetailsModel
        .findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(req.body.detailsId) },
          {
            other_details: JSON.stringify(detailsArr),
          }
        )
        .then(() => {
          res.status(200).json({
            message: "Package Tab Details Updated Successfully",
            status: 1,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Failed To Update Package Tab Details",
          });
        });
    } else {
      res.status(500).json({
        message: "Unable To Find Package Tab Details",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

};

const deletePackageTab = async (req, res) => {
  try {
    let isPostExist = await postModel.findOne({ slug: req.body.slug });
    let isDetailsExist = await homePackageDetailsModel.findOne({
      post_id: isPostExist._id,
    });
    let tabArr = JSON.parse(isDetailsExist.other_details)
    tabArr.splice(req.body.index, 1)
    homePackageDetailsModel
      .findOneAndUpdate(
        { post_id: isPostExist._id },
        {
          other_details: JSON.stringify(tabArr),
        }
      )
      .then(() => {
        res.status(200).json({
          message: "Package Tab Deleted Successfully",
          status: 1,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Failed To Delete Package Tab ",
        });
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

}

const hideUnhidePackage = async (req, res) => {
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
            message: "Package Hidden Successfully",
            status: 1,
          });
        })
        .catch(() => {
          res.status(500).json({
            message: "Failed To Hide Package",
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
            message: "Package Unhidden Successfully",
            status: 2,
          });
        })
        .catch(() => {
          res.status(500).json({
            message: "Failed To Unhide Package",
          });
        });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

};

const deletePackage = async (req, res) => {
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
        console.log("Package Deleted");
        res.status(200).json({
          message: "Package Deleted Successfully",
          status: 1,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Failed To Delete Package",
          Error: err,
        });
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

};
const getPackageBottomBanner = async (req, res) => {
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

};

const addPackageBottomBanner = async (req, res) => {
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
  }catch (error) {
      res.status(500).send({ message: error.message });
  }

};

const updatePackageBottomBanner = async (req, res) => {
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
  }catch (error) {
      res.status(500).send({ message: error.message });
  }

};

const deletePackageBottomBanner = async (req, res) => {
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
  }catch (error) {
      res.status(500).send({ message: error.message });
  }

};

const inclusionList = async (req, res) => {
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
          from: "Inclusions",
          localField: "_id",
          foreignField: "post_id",
          as: "inclusionDetails",
        },
      },
      {
        $project: {
          content: 0,
          featured_img: 0,
          video_link: 0,
          post_type: 0,
          small_text: 0,
          price: 0,
          status: 0,
        },
      },
    ])
    .then((data) => {
      console.log(data);
      res.status(200).json({
        inclusionData: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed To Fetch Package Inclusions",
        Error: err,
      });
    });
  }catch (error) {
      res.status(500).send({ message: error.message });
  }

};

const addInclusion = async (req, res) => {
  try {
    let isPostExist = await postModel.findOne({ slug: req.body.slug });
    let inclusionObj = {
      post_id: new mongoose.Types.ObjectId(isPostExist._id),
      text: req.body.text,
      img: "img/" + req.body.img,
    };
    inclusionModel(inclusionObj)
      .save()
      .then((data) => {
        if (data._id) {
          res.status(200).json({
            message: "Inclusion Item Created Successfully",
            status: 1,
          });
        } else {
          res.status(500).json({
            message: "Inclusion Item Not Created",
            status: 0,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "Failed To Create Inclusion Item",
          status: -1,
          Error: err,
        });
      });
  }catch (error) {
      res.status(500).send({ message: error.message });
  }

};

const loadSingleInclusion = async (req, res) => {
  try {
    inclusionModel
    .findOne({ _id: req.params.inclusionId })
    .then((data) => {
      res.status(200).json({
        inclusionData: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed To Load Inclusion Item",
        Error: err,
      });
    });
  }catch (error) {
      res.status(500).send({ message: error.message });
  }

};

const updateInclusion = async (req, res) => {
  try {
    let isInclusionExist = await inclusionModel.findOne({
      _id: req.body.inclusionId,
    });
    inclusionModel
      .findOneAndUpdate(
        { _id: req.body.inclusionId },
        {
          text: req.body.text,
          img:
            req.body.img == "undefined"
              ? isInclusionExist.img
              : "img/" + req.body.img,
        }
      )
      .then(() => {
        res.status(200).json({
          message: "Inclusion Item Updated Successfully",
          status: 1,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Failed To Update Inclusion Item",
          Error: err,
        });
      });
  }catch (error) {
      res.status(500).send({ message: error.message });
  }

};

const deleteInclusion = async (req, res) => {
  try {
    inclusionModel
    .findOneAndDelete({ _id: req.params.inclusionId })
    .then(() => {
      res.status(200).json({
        message: "Inclusion Item Deleted Successfully",
        status: 1,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed To Delete Inclusion Item",
        Error: err,
      });
    });
  }catch (error) {
      res.status(500).send({ message: error.message });
  }

};

module.exports = {
  markAsOtherHSPackage,
  getCategoryImages,
  updateCategoryImage,
  getAllPackages,
  filterPackages,
  getPackageBySlug,
  addPackage,
  addPackageTab,
  addPriceDetails,
  deletePriceDetails,
  updatePackage,
  fetchTabNames,
  updatePackageTab,
  deletePackageTab,
  hideUnhidePackage,
  deletePackage,
  getPackageBottomBanner,
  addPackageBottomBanner,
  updatePackageBottomBanner,
  deletePackageBottomBanner,
  inclusionList,
  addInclusion,
  loadSingleInclusion,
  updateInclusion,
  deleteInclusion,
};
