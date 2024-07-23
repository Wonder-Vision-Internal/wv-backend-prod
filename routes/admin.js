var express = require('express')
var router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './public/img')
    },
    filename: function (req, file, cb) {
        return cb(null, file.originalname)
    }
})


const maxSize = 25 * 1024 * 1024

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: maxSize
    }
})



// var jsonParser = require('body-parser').json()
var middleware = require('../middleware/Authentication').auth
var AdminController = require('../controllers/AdminController')
var founderController = require('../controllers/FounderController')
var PackageController = require('../controllers/PackageController')
var storyController = require('../controllers/StoryController')
var HomeStayController = require('../controllers/HomeStayController')
var BannerController = require('../controllers/BannerController')
var galleryController = require('../controllers/GalleryController')
var blogController = require('../controllers/BlogController')
var gaqController = require('../controllers/GaqController')
var awardController = require('../controllers/AwardController')
var testimonialController = require('../controllers/TestimonialController')
var aboutController = require('../controllers/AboutController')
var homeController = require('../controllers/HomeController')
var tailormadeController = require('../controllers/TailormadeController')
var contactController = require('../controllers/CustomerInteraction')
var userController = require('../controllers/UserController')
var staffController = require('../controllers/StaffController')
var permissionController = require('../controllers/PermissionController')
var bookingController = require('../controllers/BookingController')
const frontController = require('../controllers/FrontController')
const bestThingsController = require('../controllers/BestThingsToDo')
const bestPlacesController = require('../controllers/BestPlaces')
const packageYoutubeUrlController = require('../controllers/PackageYoutubeUrlController.js')
const homeClientController = require('../controllers/HomeClient.js')


function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            res.status(500).json({});
        });
    };
}


router.post('/login', upload.single(), asyncHandler(AdminController.login));


router.get('/getallpermissions', asyncHandler(AdminController.getallpermissions))
router.post('/updatepermissions', upload.single(), asyncHandler(AdminController.updatePermissions))

router.post('/getsidebarmodules', upload.single(), asyncHandler(AdminController.getSidebarModules))
router.get('/getpermissionsbyid/:emp_id', asyncHandler(staffController.getPermissionsById))

router.get('/getallstaffs', asyncHandler(staffController.getAllStaffs))
router.get('/searchbyempid/:emp_id', asyncHandler(staffController.searchByEmpId))
router.post('/addstaff', upload.single(), asyncHandler(staffController.addStaff))
router.post('/updatestaff', upload.single(), asyncHandler(staffController.updateStaff))

router.get('/getallmeta', asyncHandler(homeController.getAllMeta))
router.post('/updatemeta', upload.single(), asyncHandler(homeController.updateMeta))

router.get('/getallusers', asyncHandler(userController.getAllUsers))

router.get('/getinteractions', asyncHandler(contactController.getInteractions))

router.get('/getallbookings', asyncHandler(bookingController.getAllBookings))
router.get('/searchbookings', asyncHandler(bookingController.searchByBookings))
router.post('/addbooking', upload.single(), asyncHandler(bookingController.addBooking))
router.get('/loadsinglebooking/:id', asyncHandler(bookingController.loadSingleBooking))
router.post('/updatebooking', upload.single(), asyncHandler(bookingController.updateBooking))
router.post('/cancelbooking/:id', asyncHandler(bookingController.cancelBooking))


router.get('/getintroduction', asyncHandler(homeController.getIntroduction))
router.post('/updateintroduction', upload.single(), asyncHandler(homeController.updateIntroduction))
router.get('/special-tour-details', asyncHandler(homeController.getSpecialTour))
router.post('/updatespecialtour', upload.single('pic'), asyncHandler(homeController.updateSpecialTour))

router.get('/getvisionmission/:title', asyncHandler(aboutController.getVisionMission))
router.post('/updatevisionmission', upload.single('pic'), asyncHandler(aboutController.updateVisionMission))

router.get('/getfounderlist', asyncHandler(founderController.getFounderList))
router.post('/addfounder', upload.single('pic'), asyncHandler(founderController.addMember))
router.get('/getfounderbyid/:fid', asyncHandler(founderController.getFounderById))
router.post('/updatefounder/:fid', upload.single('pic'), asyncHandler(founderController.updateFounder))
router.get('/deletefounder/:fid', asyncHandler(founderController.deleteFounder))

router.get('/get-tailormade', asyncHandler(tailormadeController.getTailormade))
router.post('/addtailormade', upload.single('pic'), asyncHandler(tailormadeController.addTailormade))
router.post('/updatetailormade', upload.single('f_img'), asyncHandler(tailormadeController.updateTailormade))

router.get('/getallawards', asyncHandler(awardController.getAllAwards))
router.post('/addawards', upload.single('pic'), asyncHandler(awardController.addAward))
router.get('/deleteaward/:awardId', asyncHandler(awardController.deleteAward))
router.post('/updateaward', upload.single('pic'), asyncHandler(awardController.updateAward))

router.post('/addhomestay', upload.any(), asyncHandler(HomeStayController.addHomeStay))
router.get('/getallhomestay', asyncHandler(HomeStayController.getAllHomeStay))
router.get('/gethomestaybyslug/:slug', asyncHandler(HomeStayController.getHomeStayBySlug))
router.post('/updatehomestay', upload.any(), asyncHandler(HomeStayController.updateHomeStay))
router.post('/deletehomestay/:slug', asyncHandler(HomeStayController.deleteHomeStay))
router.post('/hideunhidehomestay/:slug', asyncHandler(HomeStayController.hideUnhideHomeStay))

router.get('/filterroombyslug/:slug', asyncHandler(HomeStayController.filterRooms))
router.post('/addroom/:slug', upload.single('roompic'), asyncHandler(HomeStayController.addRooms))
router.post('/deleteroom/:roomid', asyncHandler(HomeStayController.deleteRoom))
router.post('/hideunhideroom', upload.single(), asyncHandler(HomeStayController.hideUnhideRoom))//not checked
router.get('/getroombyid/:roomid', asyncHandler(HomeStayController.getRoomById))
router.post('/updateroom/:roomid', upload.single('roompic'), asyncHandler(HomeStayController.updateRoom))

router.get('/getbottombanner/:slug', asyncHandler(HomeStayController.getBottomBanner))
router.post('/addbottombanner/:slug', upload.single('bannerPic'), asyncHandler(HomeStayController.addBottomBanner))
router.post('/updatebottombanner/:bannerId', upload.single('bannerPic'), asyncHandler(HomeStayController.updateBottomBanner))
router.get('/deletebottombanner/:bannerId', asyncHandler(HomeStayController.deleteBottomBanner))

router.get('/homestaylogoratinglist/:slug', asyncHandler(HomeStayController.HomeStayLogoRatingList))
router.post('/addhomepackagelogorating', upload.single('pic'), asyncHandler(HomeStayController.addHomePakcageLogoRating))
router.post('/updatehomestaylogorating', upload.single('pic'), asyncHandler(HomeStayController.updateLogoRating))
router.post('/deletelogorating/:id/:index', asyncHandler(HomeStayController.deleteLogoRating))
router.get('/otherhomestays/:slug', asyncHandler(HomeStayController.otherHomeStay))
router.post('/addotherhomestay', upload.single(), asyncHandler(HomeStayController.addOtherHomeStay))
router.post('/deleteotherhomestay/:slug/:index', asyncHandler(HomeStayController.deleteOtherHomeStay))
router.get('/otherpackages/:slug', asyncHandler(HomeStayController.otherPackage))
router.post('/addotherpackage', upload.single(), asyncHandler(HomeStayController.addOtherPackage))
router.get('/deleteotherpackage/:slug/:index', asyncHandler(HomeStayController.deleteOtherPackage))

router.post('/markasotherhspackage', asyncHandler(PackageController.markAsOtherHSPackage));
router.get('/getcategoryimages', asyncHandler(PackageController.getCategoryImages));
router.post('/updatecategoryimage/:catImageId', upload.single('catPic'), asyncHandler(PackageController.updateCategoryImage));
router.post('/addpackage', upload.any(), asyncHandler(PackageController.addPackage));
router.post('/addpackagetab', upload.single(), asyncHandler(PackageController.addPackageTab));
router.post('/addpricedetails', upload.single(), asyncHandler(PackageController.addPriceDetails));
router.post('/deletepricedetails', upload.single(), asyncHandler(PackageController.deletePriceDetails));
router.post('/updatepackage', upload.any(), asyncHandler(PackageController.updatePackage));
router.get('/get-tab-names/:slug', asyncHandler(PackageController.fetchTabNames));
router.post('/updatepackagetab', upload.single(), asyncHandler(PackageController.updatePackageTab));
router.post('/deletepackagetab', upload.single(), asyncHandler(PackageController.deletePackageTab));
router.get('/getallpackages', asyncHandler(PackageController.getAllPackages));
router.get('/get-price-details/:slug', frontController.getPriceDetails);
router.get('/filterpackagebycategory/:package_category', asyncHandler(PackageController.filterPackages));
router.get('/getpackagebyslug/:slug', asyncHandler(PackageController.getPackageBySlug));
router.post('/hideunhidepackage/:slug', asyncHandler(PackageController.hideUnhidePackage));
router.post('/deletepackage/:slug', asyncHandler(PackageController.deletePackage));
router.get('/getpackagebottombanner/:slug', asyncHandler(PackageController.getPackageBottomBanner));
router.post('/addpackagebottombanner/:slug', upload.single('bannerPic'), asyncHandler(PackageController.addPackageBottomBanner));
router.post('/updatepackagebottombanner/:bannerId', upload.single('bannerPic'), asyncHandler(PackageController.updatePackageBottomBanner));
router.get('/deletepackagebottombanner/:bannerId', asyncHandler(PackageController.deletePackageBottomBanner));
router.get('/inclusionlist/:slug', asyncHandler(PackageController.inclusionList));
router.post('/addinclusion', upload.single('pic'), asyncHandler(PackageController.addInclusion));
router.get('/loadsingleinclusion/:inclusionId', asyncHandler(PackageController.loadSingleInclusion));
router.post('/updateinclusion', upload.single('pic'), asyncHandler(PackageController.updateInclusion));
router.get('/deleteinclusion/:inclusionId', asyncHandler(PackageController.deleteInclusion));
router.get('/getgaqbypackage/:slug', asyncHandler(gaqController.getGaqByPackage));
router.post('/addgaqtab', upload.single(), asyncHandler(gaqController.addGaqTab));
router.post('/addgaq', upload.single(), asyncHandler(gaqController.addGaq));
router.get('/loadsinglegaq/:gaqid/:tab_index/:title_index', asyncHandler(gaqController.loadSingleGaq));
router.post('/updategaq', upload.single(), asyncHandler(gaqController.updateGaq));
router.post('/deletepackagegaq/:gaqid/:tab_index/:title_index', asyncHandler(gaqController.deletePackageGaq));
router.get('/getgaqbyhomestay/:slug', asyncHandler(gaqController.getGaqByHomeStay));
router.post('/addhomestaygaq', upload.single(), asyncHandler(gaqController.addHomestayGaq));
router.get('/loadsinglehomestaygaq/:gaqid/:index', asyncHandler(gaqController.loadSingleHomeStayGaq));
router.post('/updatehomestaygaq', upload.single(), asyncHandler(gaqController.updateHomestayGaq));
router.post('/deletehomestaygaq/:gaqid/:title', asyncHandler(gaqController.deleteHomestayGaq));
router.get('/getbannerbypage/:page_name', asyncHandler(BannerController.getBannerByPage));
router.get('/gethomestaybanner', asyncHandler(BannerController.getHomeStayBanner));
router.get('/getblogsbanner', asyncHandler(BannerController.getBlogsBanner));
router.post('/addmainbanner', upload.single('pic'), asyncHandler(BannerController.addMainBanner));
router.post('/addsub-banner', upload.single('pic'), asyncHandler(BannerController.addSubBanner));
router.get('/loadsinglebanner/:bannerid', asyncHandler(BannerController.loadSingleBanner));
router.post('/updatebanner/:bannerid', upload.single('pic'), asyncHandler(BannerController.updateBanner));
router.get('/deletebanner/:bannerid', asyncHandler(BannerController.deleteBanner));
router.get('/filtergallerybyslug/:slug', asyncHandler(galleryController.getGalleryBySlug));
router.post('/addhomestaypackagegallery/:slug', upload.single('pic'), asyncHandler(galleryController.addHomeStayPackageGallery));
router.get('/loadsinglegallery/:galid', asyncHandler(galleryController.loadSingleGallery));
router.post('/updategallery/:galid', upload.single('pic'), asyncHandler(galleryController.updateGallery));
router.get('/deletegallerypicture/:galid', asyncHandler(galleryController.deleteGalleryPicture));
router.get('/filterstorybyslug/:slug', asyncHandler(storyController.filterStory));
router.post('/addstory', upload.single('pic'), asyncHandler(storyController.addStory));
router.get('/loadsinglestory/:storyid', asyncHandler(storyController.loadSingleStory));
router.post('/updatestory/:storyid', upload.single('pic'), asyncHandler(storyController.updateStory));
router.get('/deletestory/:storyid', asyncHandler(storyController.deleteStory));
router.get('/addpackagestories', asyncHandler(storyController.addPackageStory));
router.get('/gettestimonialstories', asyncHandler(storyController.getTestimonialStories));
router.get('/testimonial-list', asyncHandler(testimonialController.getTestimonials));
router.post('/addtestimonial', upload.single(), asyncHandler(testimonialController.addTestimonial));
router.post('/updatetestimonial', upload.single(), asyncHandler(testimonialController.updateTestimonial));
router.get('/deletetestimonial/:testimonialId', asyncHandler(testimonialController.deleteTestimonial));
router.post('/add-img', upload.single('file'), asyncHandler(testimonialController.addImg));
router.post('/add-testimonials-crousel', asyncHandler(testimonialController.addTestimonialsCrousel));
router.get('/get-testimonials-crousel', asyncHandler(testimonialController.getTestimonialsCrousel));
router.post('/update-testimonials-crousel/:id', asyncHandler(testimonialController.updateTestimonialsCrousel));
router.delete('/delete-testimonials-crousel/:id', asyncHandler(testimonialController.deleteTestimonialsCrousel));
router.post('/add-best-things-to-do', asyncHandler(bestThingsController.addBestThingsToDo));
router.get('/get-best-things-to-do', asyncHandler(bestThingsController.getBestThingsToDo));
router.post('/update-best-things-to-do/:id', asyncHandler(bestThingsController.updateBestThingsToDo));
router.delete('/delete-best-things-to-do/:id', asyncHandler(bestThingsController.deleteBestThingsToDo));
router.post('/add-best-places', asyncHandler(bestPlacesController.addBestPlaces));
router.get('/get-best-places', asyncHandler(bestPlacesController.getBestPlaces));
router.post('/update-best-places/:id', asyncHandler(bestPlacesController.updateBestPlaces));
router.delete('/delete-best-places/:id', asyncHandler(bestPlacesController.deleteBestPlaces));
router.post('/add-package-youtube-url', asyncHandler(packageYoutubeUrlController.addPackageYoutube));
router.get('/get-package-youtube-url', asyncHandler(packageYoutubeUrlController.getPackageYoutube));
router.post('/update-package-youtube-url/:id', asyncHandler(packageYoutubeUrlController.updatePackageYoutube));
router.delete('/delete-package-youtube-url/:id', asyncHandler(packageYoutubeUrlController.deletePackageYoutube));
router.get('/getallblogs', asyncHandler(blogController.getAllBlogs));
router.post('/addblog', upload.single('f_img'), asyncHandler(blogController.addBlog));
router.get('/loadsingleblog/:blogId', asyncHandler(blogController.loadSingleBlog));
router.post('/updateblog', upload.single('f_img'), asyncHandler(blogController.updateBlog));
router.get('/deleteblog/:blogId', asyncHandler(blogController.deleteBlog));
router.post('/add-home-client-youtube-url', asyncHandler(homeClientController.addHomeClientYoutubeUrl));
router.get('/get-home-client-youtube-url', asyncHandler(homeClientController.getHomeClientYoutubeUrl));
router.post('/update-home-client-youtube-url/:id', asyncHandler(homeClientController.updateHomeClientYoutubeUrl));
router.delete('/delete-home-client-youtube-url/:id', asyncHandler(homeClientController.deleteHomeClientYoutubeUrl));


const formdataParser = multer().fields([]);
router.use(formdataParser)
// router.use(middleware)


router.post('/verifytoken', asyncHandler(AdminController.verifyToken))

module.exports = router;
