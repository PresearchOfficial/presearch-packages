/**
 * @param {string} imgUrl
 * @return {string}
 */
const imageFromCache = (imgUrl) => {
  if (process.env.REGISTRATION_CODE !== undefined) {
    return require('../../utils/img-cache')(imgUrl);
  } else {
    /**
     * @param {string} imgUrl
     */
    return imgUrl;
  }
}

module.exports = imageFromCache;
