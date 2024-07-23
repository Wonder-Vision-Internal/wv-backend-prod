var express = require('express')
var router = express.Router()
var jsonParser = require('body-parser').json()
var FrontController = require('./../controllers/FrontController')
var HomeStayController = require('./../controllers/HomeStayController')
var middleware = require('../middleware/Authentication').auth
const { login, signUp, verifyToken } = require('../controllers/AdminController')
const multer = require('multer')
const formdataParser = multer().fields([])
const { RegistrationValidation, LoginValidation } = require('../middleware/validation')

router.use(formdataParser)



function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            res.status(500).json({});
        });
    };
}

//Routes
router.post('/login', asyncHandler(LoginValidation, login))
router.post('/sign-up', asyncHandler(RegistrationValidation, signUp))
router.get('/home', jsonParser, asyncHandler(FrontController.home));
router.get('/about', jsonParser, asyncHandler(FrontController.about));
router.get('/get-founders', jsonParser, asyncHandler(FrontController.getFounders));
router.get('/get-testimonial', jsonParser, asyncHandler(FrontController.testimonial));
router.get('/get-all/:type', jsonParser, asyncHandler(FrontController.homePackages)); // type= home_stay or packages
router.get('/get-home-stay-details/:slug', jsonParser, asyncHandler(FrontController.homeStayDetails));
router.get('/get-package-details/:slug', jsonParser, asyncHandler(FrontController.packageDetails));
// router.get('/other-home-stay/:type',jsonParser,FrontController.otherHomeStay));
router.get('/otherhomestays/:slug',  asyncHandler(HomeStayController.otherHomeStay))
router.get('/otherpackages/:slug',  asyncHandler(HomeStayController.otherPackage))
router.get('/get-post-details-by-slug/:slug', jsonParser, asyncHandler(FrontController.getPostDetailsBySlug));
router.get('/get-price-details/:slug', asyncHandler(FrontController.getPriceDetails))
router.get('/get-all-blog-dates', jsonParser, asyncHandler(FrontController.getAlldates));
router.get('/get-all-packages/:category', jsonParser, asyncHandler(FrontController.packageShow));
router.get('/get-all-banners/:type/:id', jsonParser, asyncHandler(FrontController.getBanners));
router.get('/get-export-form-banners', jsonParser, asyncHandler(FrontController.getExportFormBanners));
router.get('/awards-accreditation', jsonParser, asyncHandler(FrontController.awardsAccreditation));
router.get('/get-expertform-content/:id', jsonParser, asyncHandler(FrontController.getExpertFormContent));
router.get('/get-meta-info', jsonParser, asyncHandler(FrontController.getMetaInfo));
router.get('/send-query', jsonParser, asyncHandler(FrontController.sendQuery));
//phone pay
router.get('/payment', jsonParser, asyncHandler(FrontController.newPayment));
router.post('/payment/status/:txnId', jsonParser, asyncHandler(FrontController.checkStatus));

router.get('/get-testimonials-crousel', asyncHandler(FrontController.getCrouselTestimonial));

router.get('/best-things-to-do/:slug', asyncHandler(FrontController.bestThingsToDo));
router.get('/best-places/:slug', asyncHandler(FrontController.bestPlaces));
router.get('/package-youtube-url/tour-guidance/:slug', asyncHandler(FrontController.getpackageTourGuidanceYoutubeUrl));

router.get('/package-youtube-url/our-happy-client/:slug', asyncHandler(FrontController.getpackageOurHappyClientYoutubeUrl));

router.get('/get-home-client-youtube-url/:slug', asyncHandler(FrontController.getHomeClientYoutubeUrl));






// router.use(middleware)

router.post('/verifytoken', verifyToken)
router.post('/get-my-bookings/:mail', asyncHandler(FrontController.getMyBookings))
router.post('/update-user-profile', asyncHandler(FrontController.updateUserProfile))

module.exports = router;
