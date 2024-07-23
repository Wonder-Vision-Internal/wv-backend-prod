const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:   String,
    content: String,
    featured_img: String,
    main_img:String,
    video_link: String,
    small_text: String,
    priority:Number,
    price: String,
    package_category:String,
    post_type: {
        type: String,
        enum: ["small_post", "home_stay", "packages", "testimonial", "tour", "blog","contact_form"]
    },
    is_other: {
        type: Boolean,
        default: false
    },
    is_featured: {
        type: Boolean,
        default: 0
    },
    is_festival: {
        type: Boolean,
        default: 0
    },
    is_resort: {
        type: Boolean,
        default: 0
    },
    is_deleted:{
        type:Boolean,
        default:false
    },
    slug: String,
    link:String,
    status:  {
        type: String,
        enum: ['1', '0'],
        default:'1'
    },
    post_id:mongoose.Schema.Types.ObjectId,
    created_at: {
        type: Date,
        default: () => {
          const now = new Date();
          now.setHours(now.getHours() + 5);
          now.setMinutes(now.getMinutes() + 30);
          return now;
        }
      },
    meta:{
        title:String,
        description:String,
        keywords:String
    }
});

// Export the schema
module.exports = mongoose.model('Post', postSchema, 'Post');