module.exports = {
    dbUrl: process.env.OPENSHIFT_MONGODB_DB_URL||'mongodb://localhost:27017/',
    url:'0.0.0.0',
    modifyUrl:'/resolveComplaint',
    resolvePassword:'karakoram@1',
    port: process.env.IITD_SERVICE_PORT_WEB || 3000
}