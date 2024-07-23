
const jwt = require('jsonwebtoken')
class AuthJwt {

    async auth(req, res, next) {
        console.log('middleware body',req.body);
        // const token = JSON.parse(Object.keys(req.body))
        const token = req.body.token || req.headers['authorization']
        
        console.log('token',token);
        //  console.log(' from body token',JSON.parse(Object.keys(req.body)))



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
    }
}
module.exports = new AuthJwt()