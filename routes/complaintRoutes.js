'use strict';
var sha256 = require('sha256');
var config = require('../config');
var Excel = require('exceljs');
module.exports = function (app) {
    var Complaint = require('../models/complaint');

    // Add Complaint
    app.post('/addComplaint', function (req, res) {
        console.log(req.body.object_id + " " + req.body.complaint);
        var complaint_id = sha256(req.body.object_id + "_" + req.body.complaint);

        Complaint.findOne({complaint_id:complaint_id},function(err,complaint) {
            if(err) {
                console.log(err);
                res.json({error:true,message:err});
            }
            if(complaint==null){
                console.log("Complaint not found. Creating new Complaint.");
                complaint = new Complaint({
                    complaint_id:complaint_id,
                    object_id:req.body.object_id,
                    complaint: req.body.complaint
                });
            }
            complaint.last_time = Date.now();
            complaint.count = complaint.count+1;
            complaint.save(function (err,comp) {
                if(err) {
                    res.json({error:true,message:err});
                }
                res.json({error:false,message:comp});
            })
        });
    });

    //Retrieve Complaint
    app.get('/getComplaints',function(req,res){
        Complaint.find({},function (err,complaints) {
            if(err) {
                res.json({error:true,message:err});
            }
            var workbook = new Excel.Workbook();
            workbook.creator = 'Karakoram';
            workbook.lastModifiedBy = 'Karakoram';
            var sheet = workbook.addWorksheet('Complaints');

            var i=1;
            // sheet.getCell('A'+i).value = "Object Id";
            // sheet.getCell('B'+i).value = "Complaint";
            // sheet.getCell('C'+i).value = "Count";
            // sheet.getCell('D'+i).value = "Last Updated";
            // sheet.getCell('E'+i).value = "Status";
            // sheet.getCell('F'+i).value = "Link";
            sheet.columns = [
                { header: 'OBJECT ID', key: 'object_id', width: 30 },
                { header: 'COMPLAINT', key: 'complaint', width: 40},
                { header: 'COUNT', key: 'count', width: 10 },
                { header: 'LAST  UPDATED', key: 'last_updated', width: 18 },
                { header: 'STATUS', key: 'status', width: 10 },
                { header: 'LINK', key: 'link', width: 10 }
            ];
            i=i+1;
            for(var comp in complaints) {
                sheet.getCell('A'+i).value = complaints[i-2].object_id;
                sheet.getCell('B'+i).value = complaints[i-2].complaint;
                sheet.getCell('C'+i).value = complaints[i-2].count;
                sheet.getCell('D'+i).value = complaints[i-2].last_time;
                sheet.getCell('E'+i).value = complaints[i-2].status;
                sheet.getCell('F'+i).value = {text:'resolve',hyperlink:config.url+':'+config.port+'/update/'+complaints[i-2].complaint_id};
                sheet.getCell('F'+i).font = {
                    color:'ff00ff00',
                    underline:true
                };
                i=i+1;
            }
            res.attachment('complaints'+Date.now().toString()+'.xlsx');
            workbook.xlsx.write(res)
                .then(function(){
                    res.end();
                })
        })
    });

    //Update Status
    app.get('/update/:complaint_id',function(req,res){
       Complaint.findOne({complaint_id:req.params.complaint_id},function(err,complaint) {
           if(err) {
               res.json({error:true,message:err});
           }
           if(complaint==null) {
               res.json({error:true,message:"Complaint not found. (Either resolved or doesn't exist.)"})
           } else {
               res.render('../views/index', {
                   modifyUrl: config.url+':'+config.port+config.modifyUrl,
                   complaint_id: req.params.complaint_id,
                   object_id: complaint.object_id,
                   complaint: complaint.complaint,
                   status: complaint.status
               });
           }
       })
    });

    app.post('/resolveComplaint',function(req,res) {
       if(req.body.password!=config.resolvePassword) {
           res.json({error:true,message:"Password Incorrect."});
       } else {
           Complaint.findOneAndRemove({complaint_id: req.body.complaint_id}, function (err, complaint) {
               if (err) {
                   res.json({error: true, message: err});
               }
               if (complaint == null) {
                   res.json({error: true, message: "Complaint not found. (Either resolved or doesn't exist.)"})
               }
               res.json({error: false, message: "Complaint resolved."})
           });
       }
    });

};