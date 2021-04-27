const errorResponse = require('../api/controllers/error_response');

class Authentication {

    static authenticatePubKey(req, res, next) {
        const publicApiKey = req.header('api_key');
        if (publicApiKey != process.env.MARVEL_PUBLIC_KEY) {
            const error = {
                message: 'Public key is invalid or not provided (409)',
            };
            const err = new errorResponse(error);
            err.sendErrorResponse(req, res);
        } else {
            next();
        }
    }
}

module.exports = Authentication;