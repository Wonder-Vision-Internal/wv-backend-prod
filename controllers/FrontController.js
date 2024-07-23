
require('dotenv').config();
// console.log(process.env.BASE_URL);

const crypto = require('crypto');
const axios = require('axios');
const bcrypt = require('bcryptjs')
const connect = require('../includes/db.conn');
const Banner = require('../Models/banner.schema');
const Post = require('../Models/posts.schema');
const Founders = require('../Models/founder.schema');
const stories = require('../Models/stories.schema');
const Inclusions = require('../Models/inclusions.schema');
const ExpertForm = require('../Models/experForm.schema');
const Meta = require('../Models/meta.schema');
const Contact = require('../Models/contact.schema');
const Users = require('../Models/user.schema');
const Bookings = require('../Models/bookings.schema');
const homePackageDetailsModel = require("../Models/home_package_details.schema");
const nodemailer = require('nodemailer');
const testimonialModel = require("../Models/testimonial.schema");
const bestThingsModel = require("../Models/bestThings.schema");
const bestPlacesModel = require("../Models/bestPlaces.schema");
const packageYoutubeSchema = require("../Models/packageYoutube.schema");
const homeClientSchema = require("../Models/homeClient.schema");







const Helpers = require('../includes/Helpers');
const { log } = require('console');
const { default: mongoose } = require('mongoose');
var ObjectID = require('mongoose').Types.ObjectId;

const Login = async (req, res) => {
    console.log('body', req.body);
}


const getPostDetails = async (postId) => {
    let postDetails = await Post.findOne({ _id: new ObjectID(postId) });

    return postDetails;
}

const getPostDetailsBySlug = async (req, res) => {
    let slug = req.params.slug;
    let postDetails = await Post.findOne({ slug: slug });

    res.status(200).send({ postDetails: postDetails });
}

const getPriceDetails = async(req,res) => {
    console.log('s',req.params.slug);
    let isPostExist = await Post.findOne({slug:req.params.slug})
    if(isPostExist._id){
        let isDetailsExist = await homePackageDetailsModel.findOne({post_id:isPostExist._id})
        res.status(200).send({ priceDetails: isDetailsExist.price_details, date:isDetailsExist.starts_from, price: isPostExist.price, name: isPostExist.title,post_id: isPostExist._id })
    }
}

const getFilteredPosts = async (type, is_featured = 0) => {
    console.log(is_featured)
    let postDetails = await Post.aggregate(
        [
            {
                $match: {
                    $and: [{ post_type: type }, { is_featured: is_featured }, { is_featured: is_featured }]
                }
            },
            {
                $sort: { "priority": 1 }
            },
            { $limit: 5 }
        ]
    );
    return postDetails;
}
const getAllPosts = async (type) => {
    let postDetails = await Post.aggregate(
        [
            {
                $match: {
                    $and: [{ post_type: type }, { status: "1" }]
                }
            }
        ]
    );
    return postDetails;
}


//main api functions
const home = async (req, res) => {
    let homeContent = await getPostDetails("6558eafab6224ccf289042aa");
    console.log(homeContent)
    let packagetour = await getFilteredPosts("packages", true);
    let latestBlogs = await getFilteredPosts("blog", true);
    let resorts = await Post.aggregate(
        [
            {
                $match: {
                    $and: [
                        { "post_type": "home_stay" },
                        { "status": '1' },
                        { "priority": { $gt: 0 } },
                        { "priority": { $exists: true } }
                    ]
                }
            },
            {
                $lookup:{
                    from:'expertforms',
                    localField:'_id',
                    foreignField: 'post_id',
                    as:'resortDetails'
                }
            },
            {
                $sort: { "priority": 1 }
            }

            // {
            //     $limit: 6
            // }
        ]
    );

    let festivalTour = await Post.aggregate(
        [
            {
                $match: {
                    $and: [
                        { "post_type": "packages" },
                        { "is_festival": true },
                    ]
                }
            },
            {
                $limit: 4
            }
        ]
    );

    let packageImages = await Post.aggregate(
        [
            {
                $match: {
                    $or: [
                        { "title": "incredible_india" },
                        { "title": "wild_africa" },
                        { "title": "beautiful_asia" },
                        { "title": "adventure_himalayas" },
                        { "title": "colorful_festival" },
                    ]
                }
            }
        ]
    );
console.log('resorts',resorts);
    res.status(200).send({ 'homeContent': homeContent, "packagetour": packagetour, "resorts": resorts, "festivalTour": festivalTour, 'latestBlogs': latestBlogs, 'packageImages': packageImages });
}

const about = async (req, res) => {
    let description = await getPostDetails("65007031d4bf1167df2df932");
    let vision = await getPostDetails("6500995ad4bf1167df2df93f");
    let mission = await getPostDetails("6500999bd4bf1167df2df940");
    let allFounders = await Founders.find({});

    res.status(200).send({ description: description, allFounders: allFounders, vision: vision, mission: mission });
}

const homePackages = async (req, res) => {
    let type = req.params.type;
    let allHomeStay = await Post.find({ post_type: type, status: "1" });

    if (type == "home_stay") {
        res.status(200).send({ allHomeStay: allHomeStay });
    } else {
        res.status(200).send({ allPackages: allHomeStay });
    }
}

const testimonial = async (req, res) => {
    let testimonial = await Post.find({ post_type: "testimonial" });
    let allStory = await stories.find({ post_type: "company_testimonial" }).sort({ _id: -1 });

    res.status(200).send({ testimonial: testimonial, allStory: allStory });
}

const homeStayDetails = async (req, res) => {
    let slug = req.params.slug;
    let postDetails = await Post.aggregate(
        [
            {
                $match: {
                    $and: [{ "slug": slug }]
                }
            },
            {
                $lookup: {
                    from: "Rooms",
                    localField: '_id',
                    foreignField: "post_id",
                    pipeline: [
                        {
                            $match: {
                                is_deleted: false
                            }
                        }
                    ],
                    as: "room_details"
                }
            },
            {
                $lookup: {
                    from: "home_package_gallery",
                    localField: '_id',
                    foreignField: "post_id",
                    as: "gallery_details"
                }
            },

            {
                $lookup: {
                    from: "Banner",
                    localField: '_id',
                    foreignField: "post_id",
                    as: "banner_details"
                }
            },
            {
                $lookup: {
                    from: "gaq",
                    localField: '_id',
                    foreignField: "post_id",
                    as: "gaq_details"
                }
            },
            {
                $lookup: {
                    from: "stories",
                    localField: '_id',
                    foreignField: "post_id",
                    as: "stories"
                }
            },

        ]
    );

    let contactFormBanner = await Post.findOne({ post_id: new ObjectID(postDetails[0]._id), post_type: 'contact_form' });
    if (contactFormBanner) {
        postDetails[0].contactFormBanner = contactFormBanner.featured_img;
    } else {
        postDetails[0].contactFormBanner = 'img/home-stay-bg.png';
    }

    res.status(200).send({ postDetails: postDetails[0] });
}

const packageDetails = async (req, res) => {
    let slug = req.params.slug;
    let postDetails = await Post.aggregate(
        [
            {
                $match: {
                    $and: [{ "slug": slug }]
                }
            },
            {
                $lookup: {
                    from: "home_package_details",
                    localField: '_id',
                    foreignField: "post_id",
                    as: "other_details"
                }
            },
            {
                $lookup: {
                    from: "home_package_gallery",
                    localField: '_id',
                    foreignField: "post_id",
                    as: "gallery_details"
                }
            },
            {
                $lookup: {
                    from: "gaq",
                    localField: '_id',
                    foreignField: "post_id",
                    as: "gaq_details"
                }
            },
            {
                $lookup: {
                    from: "stories",
                    localField: '_id',
                    foreignField: "post_id",
                    as: "stories"
                }
            },
            {
                $lookup: {
                    from: "Inclusions",
                    localField: '_id',
                    foreignField: "post_id",
                    as: "inclusion"
                }
            }
        ]
    );

    //console.log({postDetails})
        
    let contactFormBanner = await Post.findOne({ post_id: new ObjectID(postDetails[0]._id), post_type: 'contact_form'  });
    if (contactFormBanner) {
        postDetails[0].contactFormBanner = contactFormBanner.featured_img;
    } else {
        postDetails[0].contactFormBanner = 'img/home-stay-bg.png';
    }

    res.status(200).send({ postDetails: postDetails[0] });
}

const otherHomeStay = async (req, res) => {
    let type = req.params.type;
    let allHomeStay = await Post.find({ post_type: type }).limit(3);

    if (type == "home_stay") {
        res.status(200).send({ alldatas: allHomeStay });
    } else {
        res.status(200).send({ alldatas: allHomeStay });
    }
}

const getAlldates = async (req, res) => {
    const uniqueDates = await Post.aggregate([
        {
            $match: {
                $and: [{ "post_type": "blog" }]
            }
        },
        {
            $group: {
                _id: '$created_at',
            },
        }
    ]);

    const formattedDates = uniqueDates.map((doc) => Helpers.dateConvert(doc._id));

    res.status(200).send(formattedDates);
}

const packageShow = async (req, res) => {
    let category = req.params.category;
    let packages = await Post.find({ package_category: category, status: "1" });

    res.status(200).send({ allPackages: packages });
}

const getBanners = async (req, res) => {
    let id = req.params.id;
    let type = req.params.type;

    if (type == "post") {
        banners = await Post.aggregate(
            [
                {
                    $match: {
                        $and: [{ "slug": id }]
                    }
                },
                {
                    $lookup: {
                        from: "Banner",
                        localField: '_id',
                        foreignField: "post_id",
                        as: "banners"
                    }
                }
            ]
        );


    } else {
        banners = await Banner.find({ page_name: id });
    }


    res.status(200).send({ banners: banners });
}

const getFounders = async (req, res) => {
    founders = await Founders.find({});

    res.status(200).send({ founders: founders });
}


const getExpertFormContent = async (req, res) => {
    let id = req.params.id;
    expertContent = await ExpertForm.findOne({ post_id: new ObjectID(id) });
    console.log({ expertContent })

    res.status(200).send({ expertContent: expertContent });
}

const getExportFormBanners = async (req, res) => {
    let formVideo = await getPostDetails("654a167ab8e9558407e0c5f8");
    let splashBanner = await getPostDetails("654a1233b8e9558407e0c5f7");

    res.status(200).send({ formVideo: formVideo, splashBanner: splashBanner });
}
const awardsAccreditation = async (req, res) => {
    let awardsAccreditation = await Post.findOne({ _id: new ObjectID('654df638e8a09dae472e65e4'), post_type: 'awards', status: '1' });
    let banners = await Banner.find({ post_id: new ObjectID('654df638e8a09dae472e65e4') });

    // awardsAccreditation.banners = banners;
    // console.log({awardsAccreditation})

    res.status(200).send({ awardsAccreditation: awardsAccreditation, banners: banners });
}

const getMetaInfo = async (req, res) => {
    let getMetaInfo = await Meta.findOne();
    //console.log(getMetaInfo)

    res.status(200).send({ getMetaInfo: JSON.parse(getMetaInfo.meta) });
}

const sendQuery = async (req, res) => {
    
const timeCalculate = async() => {
    const now = new Date();
    now.setHours(now.getHours() + 5);
    now.setMinutes(now.getMinutes() + 30);
    return now;
  }
    const newQuery = {
        name: req.query.name,
        mail: req.query.mail,
        phone: req.query.phone,
        bookingId: req.query.bookingId,
        smiley: req.query.smiley,
        message: req.query.message,
        type: req.query.type,
        person: req.query.person,
        date: req.query.date,
        location: req.query.location,
        created_at:await timeCalculate()
    };

    console.log({ newQuery });
    const result = await Contact.create(newQuery);

    console.log({result});
    res.status(200).send({msg: "Your query has been successfully sent to us." });
}
const newPayment = async (req, res) => {
    try {
        // console.log('query details',JSON.parse(req.query.travellers));
        const merchantTransactionId = req.query.transactionId;
        const data = {
            merchantId: process.env.M_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: req.query.MUID,
            name: req.query.travellers,
            amount: req.query.amount * 100,
            redirectUrl: `${process.env.BASE_URL}front/payment/status/${merchantTransactionId}`,            
            redirectMode: 'POST',
            mobileNumber: req.query.number,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + process.env.SALT_KEY;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        //const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
        const URL = process.env.PP_HOST + "pay"
        const options = {
            method: 'POST',
            url: URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        axios.request(options).then(function (response) {
            const merchantTransactionId = String(response.data.data.merchantTransactionId)
            // console.log({
            //     "post_id": req.query.pid,
            //     "travellers": JSON.parse(req.query.travellers),
            //     "name":req.query.name,
            //     "mail": req.query.mail,
            //     "phone": req.query.number,
            //     "address": req.query.address,
            //     "date":req.query.date,
            //     "gst_no" : req.query.gst_no,
            //     "sharing" : req.query.sharing,
            //     "bookingId": Math.floor(new Date().getTime() / 1000),
            //     "MUID": req.query.MUID,
            //     "person": req.query.person,
            //     "amount": req.query.amount,
            //     "due_amount": req.query.due,
            //     "isCancelled": false,
            //     "status": "p",
            //     "transactionId": merchantTransactionId,
            // });
            Bookings({
                "post_id": req.query.pid,
                "travellers": JSON.parse(req.query.travellers),
                "name":req.query.name.trim(),
                "mail": req.query.mail.trim(),
                "phone": req.query.number.trim(),
                "address": req.query.address,
                "date":req.query.date.trim(),
                "gst_no":req.query.gst_no.trim(),
                "sharing" : req.query.sharing,
                "bookingId": Math.floor(new Date().getTime() / 1000),
                "MUID": req.query.MUID,
                "person": req.query.person,
                "amount": req.query.amount.trim(),
                "due_amount": req.query.due.trim(),
                "isCancelled": false,
                "status": "p",
                "transactionId": merchantTransactionId,
                "booked_by":'user'
            }).save();


            // let transporter = nodemailer.createTransport({
            //     service: 'Gmail',
            //     auth: {
            //         user: 'webdevarisu3@gmail.com',
            //         pass: 'dmimetwazbrbgvmk'
            //     }
            // });
            
            // // Setup email data
            // let mailOptions = {
            //     from: 'webdevarisu3@gmail.com', // sender address
            //     to: `${req.query.mail}`, // list of receivers
            //     subject: 'Hello from Node.js', // Subject line
            //     text: 'Hello world!', // plain text body
            //     html: '<b>Hello world!</b>' // html body
            // };
            
            // // Send mail with defined transport object
            // transporter.sendMail(mailOptions, (error, info) => {
            //     if (error) {
            //         return console.log(error);
            //     }
            //     console.log('Message sent: %s', info.messageId);
            // });

            res.status(200).send({ url: response.data.data.instrumentResponse.redirectInfo.url });
        })
            .catch(function (error) {
                console.log('Error');
                console.error(error);
            });

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        })
    }
}


const checkStatus = async (req, res) => {
    
    const merchantTransactionId = res.req.body.transactionId
    const merchantId = res.req.body.merchantId

    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;


    const options = {
        method: 'GET',
        url: `${process.env.PP_HOST}status/${merchantId}/${merchantTransactionId}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': `${merchantId}`
        }
    };

    // CHECK PAYMENT STATUS
    axios.request(options).then(async (response) => {
        console.log("redirect", response.data)
        if (response.data.success === true) {
            Bookings.updateOne(
                {transactionId: response.data.data.merchantTransactionId},
                {"status": "c"}
            ).then(result => {
                console.log({result}); // Output the result of the update operation
              })
              .catch(error => {
                console.error(error); // Output any errors that occur
              });
            const url = `${process.env.FRONT_URL}payment-success`            
            return res.redirect(url)
        } else {
            Bookings.updateOne(
                {transactionId: response.data.data.merchantTransactionId},
                {"status": "e", "isCancelled": false}
            ).then(result => {
                console.log({result}); // Output the result of the update operation
              })
              .catch(error => {
                console.error(error); // Output any errors that occur
              });


            const url = `${process.env.FRONT_URL}payment-failed`
            return res.redirect(url)
        }
    })
        .catch((error) => {
            console.error(error);
        });
};

const updateUserProfile = async(req,res)=>{
    Users.findOneAndUpdate({mail:req.body.mail},{password:bcrypt.hashSync(req.body.password,10)})
    .then(()=>{
        res.status(200).json({message:'Profile Updated Successfully'})
    }).catch((err)=>{
        res.status(500).json({message:'Failed To Update Profile',Error:err})
    })
}

const getMyBookings = async(req,res)=>{

    // Bookings.find({mail:req.params.mail})
    Bookings.aggregate([
        {
            $match:{
                mail:req.params.mail
            }
        },
        {
            $lookup:{
                from:'Post',
                localField:'post_id',
                foreignField:'_id',
                pipeline:[
                    {
                        $project:{
                            title:1
                        }
                    }
                ],
                as:'myBookings'
            } 
        }
    ])
    .then((data)=>{
        res.status(200).json({bookingData:data})
    }).catch((err)=>{
        console.log('err',err);
        res.status(500).json({message:'Failed To Load Booking Details',Error:err})
    })
}

const getCrouselTestimonial = async(req,res)=>{

    try {

        const data = await testimonialModel.find({}).lean();

        res.status(200).json({data})
    }catch(err) {
        res.status(500).json({})
    }

}

const bestThingsToDo = async (req, res) => {

    try {
        const data = await bestThingsModel.find({ slug: req.params.slug }).lean();

        res.status(200).json({ data })
    }catch(err) {
        res.status(500).json({})
    }

}

const bestPlaces = async (req, res) => {
    try {
        const data = await bestPlacesModel.find({ slug: req.params.slug }).lean();
    
        res.status(200).json({ data })
    }catch(err) {
        res.status(500).json({})
    }

}

const getpackageTourGuidanceYoutubeUrl = async (req, res) => {

    try {
        const type = "TOUR GUIDANCE"
        const data = await packageYoutubeSchema.find({ slug: req.params.slug, type}).lean();
        res.status(200).json({ data })
    }catch(err) {
        res.status(500).json({})
    }

}

const getHomeClientYoutubeUrl = async (req, res) => {

    try {
        const data = await homeClientSchema.find({ slug: req.params.slug}).lean();
        res.status(200).json({ data })
    }catch(err) {
        res.status(500).json({})
    }

}



const getpackageOurHappyClientYoutubeUrl = async (req, res) => {

    try {
        const type = "OUR HAPPY CLIENTS"
        const data = await packageYoutubeSchema.find({ slug: req.params.slug, type }).lean();
        res.status(200).json({ data })
    }catch(err) {
        res.status(500).json({})
    }

}

module.exports = {
    Login,
    home,
    about,
    homePackages,
    testimonial,
    homeStayDetails,
    packageDetails,
    otherHomeStay,
    getAlldates,
    getPostDetailsBySlug,
    getPriceDetails,
    packageShow,
    getBanners,
    getFounders,
    getExportFormBanners,
    awardsAccreditation,
    getExpertFormContent,
    getMetaInfo,
    sendQuery,
    newPayment,
    checkStatus,
    getMyBookings,
    updateUserProfile,
    getCrouselTestimonial,
    bestThingsToDo,
    bestPlaces,
    getpackageTourGuidanceYoutubeUrl,
    getpackageOurHappyClientYoutubeUrl,
    getHomeClientYoutubeUrl
};