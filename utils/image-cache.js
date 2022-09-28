let imageFromCache;

if (process.env.REGISTRATION_CODE !== undefined) {
  imageFromCache = require('../../img-cache');
} else {
  /**
   * @param {string} imgUrl
   */
  imageFromCache = (imgUrl) => {
    return imgUrl;
  }
}

module.exports = imageFromCache;
