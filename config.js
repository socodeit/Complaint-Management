module.exports = {
    dbUrl: process.env.OPENSHIFT_MONGODB_DB_URL||'mongodb://localhost:27017/',
    url:'http://iitd-nen200.1d35.starter-us-east-1.openshiftapps.com',
    modifyUrl:'/resolveComplaint',
    resolvePassword:'karakoram@1',
    port: process.env.IITD_SERVICE_PORT_WEB || 3000
}