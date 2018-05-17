const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
    complaint_id:{      // complaint_id = object_id+complaint (server's job)
        type:String,
        required:true
    },
    object_id:{
        type:String,
        required:true
    },
    complaint:{
        type:String,
        required:true
    },
    count:{
        type:Number,
        default:0
    },
    last_time:Date,
    status:{
        type: String,
        default: 'pending'
    }
});
var Complaint = mongoose.model('Complaint',complaintSchema);
module.exports = Complaint;