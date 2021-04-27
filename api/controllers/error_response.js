
class ErrorResponse{
    constructor(error) {
        this.error = error;
    }

    sendErrorResponse(req, res) {
        if (this.error.message != null) {
            switch (true) {
            case this.error.message.includes('409'):
                res.status(409).send(this.error.message);
                break;
            case this.error.message.includes('401'):
                res.status(401).send(this.error.message);
                break;
            case this.error.message.includes('405'):
                res.status(405).send(this.error.message);
                break;
            case this.error.message.includes('403'):
                res.status(403).send(this.error.message);
                break;
            case this.error.message.includes('404'):
                res.status(404).send(this.error.message);
                break;
            default:
                res.status(500).send(this.error);
                break;
        }
        } else {
            res.status(404).send(this.error);
        }
        
    }


}

module.exports = ErrorResponse;