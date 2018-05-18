const express        = require('express');
const bodyParser     = require('body-parser');
const app            = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.get('/', function(req,res){
    res.json({"message": "Welcome to Complaint Management System."});
});

// Configuring the database
const config = require('./config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
var dbUrl = config.dbUrl+'test';
if(process.env.OPENSHIFT_MONGODB_DB_URL) {
    dbUrl = process.env.OPENSHIFT_MONGODB_DB_URL +
        process.env.OPENSHIFT_APP_NAME;
}
console.log(process.env);
console.log(process.env.process.env.OPENSHIFT_NODEJS_PORT);
console.log('Config dbUrl:'+config.dbUrl);
console.log('Connecting to '+dbUrl);
mongoose.connect(dbUrl)
    .then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
process.exit();
});

app.listen(config.port,config.url,function(){
    console.log("Server is listening "+config.url+':'+config.port);
});

var routes = require('./routes/complaintRoutes');
routes(app);