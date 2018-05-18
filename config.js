module.exports = {
    dbUrl: process.env.OPENSHIFT_MONGODB_DB_URL||'mongodb://localhost:27017/',
    url:process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    modifyUrl:'/resolveComplaint',
    resolvePassword:'karakoram@1',
    port: process.env.OPENSHIFT_NODEJS_PORT || 3000
}