const contactModel = require('../Models/contact.schema')

class contact{

async getInteractions(req,res){

    let startIndex = (req.query.pageNumber - 1) * req.query.itemsPerPage;
    let endIndex = req.query.pageNumber * req.query.itemsPerPage;
    console.log('req.query.type',req.query.type);
    if(req.query.type === 'booking-contact'){
        contactModel.find({type : 'booking-contact'})
        .sort({_id:-1})
        .then((data)=>{
            console.log('d',data);
            res.status(200).json({
                bookingQuery:data.slice(startIndex, endIndex),
                totalPages: Math.ceil(data.length / req.query.itemsPerPage),
            })
        }).catch((err)=>{
            res.status(500).json({
                message:'Failed To Load Booking Queries',
                Error:err
            })
        })

    }
    else if(req.query.type === 'contact'){
        contactModel.find({type : 'contact'})
        .sort({_id:-1})
        .then((data)=>{
            res.status(200).json({
                feedback:data.slice(startIndex, endIndex),
                totalPages: Math.ceil(data.length / req.query.itemsPerPage),
            })
        }).catch((err)=>{
            res.status(500).json({
                message:'Failed To Load Feedbacks',
                Error:err
            })
        })
    }
}
}

module.exports = new contact