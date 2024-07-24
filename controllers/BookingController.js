const mongoose = require("mongoose");
const postModel = require("../Models/posts.schema");
const bookingModel = require("../Models/bookings.schema");
const userModel = require("../Models/user.schema")
const bcrypt = require('bcryptjs')
class Booking {
  async getAllBookings(req, res) {
    try {
      let startIndex = (req.query.pageNumber - 1) * req.query.itemsPerPage;
      let endIndex = req.query.pageNumber * req.query.itemsPerPage;
      bookingModel
        .aggregate([
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $lookup: {
              from: "Post",
              localField: "post_id",
              foreignField: "_id",
              as: "post",
            },
          }
        ])
        .then((data) => {
          res.status(200).json({
            BookingData: data.slice(startIndex, endIndex),
            totalPages: Math.ceil(data.length / req.query.itemsPerPage),
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Failed To Fetch Booking Data",
            Error: err,
          });
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  }

  async searchByBookings(req, res) {

    try {
      let startIndex = (req.query.pageNumber - 1) * req.query.itemsPerPage;
      let endIndex = req.query.pageNumber * req.query.itemsPerPage;

      bookingModel
        .aggregate([
          {
            $match: {
              $or: [
                { bookingId: Number(req.query.bookingId.trim()) },
                {
                  $expr: {
                    $eq: [
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: "$created_at",
                        },
                      },
                      req.query.bookingDate,
                    ],
                  },
                },
                {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          { $year: "$created_at" },
                          parseInt(req.query.bookingyear),
                        ],
                      },
                      {
                        $eq: [
                          { $month: "$created_at" },
                          parseInt(req.query.bookingmonth),
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $lookup: {
              from: "Post",
              localField: "post_id",
              foreignField: "_id",
              as: "post",
            },
          },
          // {
          //   $lookup: {
          //     from: "Rooms",
          //     localField: "room_id",
          //     foreignField: "_id",
          //     as: "room",
          //   },
          // },
        ])
        .then((data) => {
          console.log('data', data);
          console.log("search result", data.slice(startIndex, endIndex));
          if (data) {
            res.status(200).json({
              searchResult: data.slice(startIndex, endIndex),
              totalPages: Math.ceil(data.length / req.query.itemsPerPage),
              status: 1,
            });
          } else {
            res.status(200).json({
              message: "Invalid Booking ID",
              status: 0,
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: "Unable To Fetch Booking Details",
            Error: err,
          });
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }


  }

  async addBooking(req, res) {
    try {
      let isPostExist = await postModel.findOne({ slug: req.body.slug });
      const timeCalculate = async () => {
        const now = new Date();
        now.setHours(now.getHours() + 5);
        now.setMinutes(now.getMinutes() + 30);
        return now;
      }
      const bookingObj = {
        ...req.body,
        bookingId: Math.floor(new Date().getTime() / 1000),
        travellers: JSON.parse(req.body.travellers),
        transactionId: req.body.payment_mode === 'online' ? req.body.transactionId : '',
        status: req.body.payment_status,
  
        post_id: isPostExist._id,
        created_at: await timeCalculate()
      };
      let allUsers = await userModel.find()
      allUsers.map((data) => {
        let hashEmp = req.body.emp_id
        if (data.emp_id && bcrypt.compareSync(data.emp_id, hashEmp)) {
          bookingObj.booked_by = data.emp_id
        }
      })
      let sub_admin = await userModel.findOne({ emp_id: bookingObj.booked_by })
  
      userModel.findOneAndUpdate({ emp_id: bookingObj.booked_by }, { points: sub_admin.points ? sub_admin.points + 1 : 1 })
        .then().catch()
  
      bookingModel(bookingObj)
        .save()
        .then((data) => {
          if (data._id) {
            res.status(200).json({
              message: "New Booking Has Been Created",
              status: 1,
              points: sub_admin.user_type === 'admin' || sub_admin.points === '' ? '' : sub_admin.points + 1,
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: "Booking Failed",
          });
        });
    }catch (error) {
        res.status(500).send({ message: error.message });
    }
  }

  async loadSingleBooking(req, res) {
    try {
      bookingModel.findOne({ _id: req.params.id });
      bookingModel
        .aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(req.params.id),
            },
          },
          {
            $lookup: {
              from: "Post",
              localField: "post_id",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    title: 1,
                  },
                },
              ],
              as: "bookingDetails",
            },
          },
        ])
        .then((data) => {
          res.status(200).json({
            BookingData: data,
          });
        })
        .catch((err) => {
          res.status(200).json({
            message: "Failed To Load Booking Details",
            Error: err,
          });
        });
    }catch (error) {
        res.status(500).send({ message: error.message });
    }

  }
  async updateBooking(req, res) {
    try {
      const date = () => {
        const now = new Date();
        now.setHours(now.getHours() + 5);
        now.setMinutes(now.getMinutes() + 30);
        return now;
      };
      bookingModel.findOneAndUpdate(
        { _id: req.body.id },
        {
          ...req.body,
          updated_at: date(),
        }
      ).then(() => {
        res.status(200).json({
          message: "Booking Has Been Updated", status: 1
        });
      })
        .catch((err) => {
          res.status(500).json({
            message: "Failed To Update Booking",
            Error: err,
          });
        });
    }catch (error) {
        res.status(500).send({ message: error.message });
    }

  }
  async cancelBooking(req, res) {
    try {
      bookingModel
      .findOneAndUpdate(
        { _id: req.params.id },
        {
          isCancelled: true,
        }
      )
      .then(() => {
        res.status(200).json({
          message: "Booking Has Been Cancelled", status: 1
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Failed To Cancel Booking",
          Error: err,
        });
      });
    }catch (error) {
        res.status(500).send({ message: error.message });
    }

  }
}

module.exports = new Booking();
