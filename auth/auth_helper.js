const md5 = require('md5');

class AuthHelper {

    /**
     * Generate a long string which can change on a request-by-request basis
     * @returns {int} timestamp
     */
    static generateTimeStamp() {
        return Math.floor(Date.now() / 1000);
     }
    
    /**
     * Authenticate the url by appending the api key
     * @param {string} url
     * @return {String} authenticatedUrl
     */
    static getAuthenicatedUrl(url) {
        const ts = this.generateTimeStamp();
        const value = `${ts.toString()}${process.env.MARVEL_PRIVATE_KEY}${process.env.MARVEL_PUBLIC_KEY}`;
        const hashValue = md5(value);
        return `${url}?ts=${ts.toString()}&apikey=${process.env.MARVEL_PUBLIC_KEY}&hash=${hashValue}`;
    }
}



module.exports = AuthHelper;