require('dotenv').config();

/**
 * @typedef Configuration
 * @prop {strign} DB_URL Database connection url
 * @prop {strign} DB_NAME Database name
 * @prop {strign} DB_USER Database username
 * @prop {strign} DB_PASS Database password
 * @prop {strign} BOT_TOKEN Discord token
 * 
 */
/**
 * @type {Configuration}
 */
const config = {
  ...process.env,
}
module.exports = config;