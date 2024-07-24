
const jwt = require('jsonwebtoken')
class AuthJwt {

    async auth(req, res, next) {
        try {
            const token = req.body.token || req.headers['authorization']
 

            if (token === 'null' || token == undefined || token === '') {
                console.log('Token not found');
                res.status(400).json({
                    message: 'Please Login',
                    status: -1
                })
            }
            else {
                console.log('inside token');
                jwt.verify(token, process.env.JWT_CODE, (err, data) => {
                    if (err) {
                        res.status(403).json({
                            message: 'You Have Been Logged Out',
                            status: 0
                        })
                    }
                    else {
                        console.log('inside else');
                        next()
                    }
    
                })
            }
        }catch (error) {
            res.status(500).send({ message: error.message });
        }


    }
}
module.exports = new AuthJwt()