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
if(process.env.MONGODB_USER) {
    console.log("I am here.")
    dbUrl = 'mongodb://'+process.env.MONGODB_USER+':'+process.env.MONGODB_PASSWORD+'@'+process.env.MONGODB_SERVICE_HOST+':'+process.env.MONGODB_SERVICE_PORT+'/'+process.env.MONGODB_DATABASE;
}

console.log('Config dbUrl:'+config.dbUrl);
console.log('Connecting to '+dbUrl);
mongoose.connect(dbUrl)
    .then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
process.exit();
});
app.listen(config.port,function(){
    console.log("Server is listening "+config.host+':'+config.port);
});

var routes = require('./routes/complaintRoutes');
routes(app);