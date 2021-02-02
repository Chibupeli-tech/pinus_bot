require('dotenv').config();

/**
 * @typedef Configuration
 * @prop {strign} DB_URL Database connection url
 * @prop {strign} DB_NAME Database name
 * @prop {strign} DB_USER Database username
 * @prop {strign} DB_PASS Database password
 * @prop {strign} BOT_TOKEN Discord token
 * @prop {strign} HEROKU_APP_ID Heroku application id
 * @prop {strign} HEROKU_DYNO_ID Heroku dyno id
 * @prop {strign} HEROKU_SLUG_COMMIT Slug commit hash
 * @prop {strign} HEROKU_RELEASE_CREATED_AT Deploy date
 * 
 */
/**
 * @type {Configuration}
 */
const config = {
  ...process.env,
}
module.exports = config;