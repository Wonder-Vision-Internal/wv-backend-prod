const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    
    name:String,
    emp_id:String,
    phone:Number,
    mail:String,
    password:String,
    address:String,
    user_type:String,
    created_by:String,
    modules:Array(Object),
    points:{
      type:Number,
      default:0
    },
    created_at: {
      type: Date,
      default: () => {
        const now = new Date();
        now.setHours(now.getHours() + 5);
        now.setMinutes(now.getMinutes() + 30);
        return now;
      }
    },
    updated_at:{
      type: Date
    },
    logout_at:{
      type: Date
    }
})

module.exports = mongoose.model('User',userSchema,'User')