/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
        useMongoClient: true,
        uri: process.env.MONGODB_URI || 'mongodb://Admin:Admin1234@ds161400.mlab.com:61400/heroku_20t778v4'
    },

    // Seed database on startup
    seedDB: true,
};
