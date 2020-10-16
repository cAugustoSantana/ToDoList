const {versionSchema} = require ("../schemas/Version");
const mongoose = require('mongoose');
const { response } = require("express");

let version = mongoose.model("Version", versionSchema);
let firstVersion = new version({_id:1, version :1,taskCounter:1});

const crearDB = () =>{
    firstVersion.save()
}
async function getDabaseVersion(){
    let id;

    await version.findOne(function(err,databaseVersion){
        if(err) {
            console.log(err);
            response.sendStatus(500);
            return;
        }
        else{
            id = databaseVersion.version;
        }
    });

    return id;

}
    

function updateDatabaseVersion(){

    version.findOne(function(err,databaseVersionBeforeUpdate){
        if(err){
            console.log(err);
            response.sendStatus(500);
            return;
        }else {
            version.updateOne({_id: 1},{version: ++databaseVersionBeforeUpdate.version},function(err){
                if(err){
                    console.log(err+ "[Database couldn't updated]");
                    return;
                }else{
                    console.log("[Succesfully updated the database]");
                }
            });
        }
    });

    return version;
}  

function increasteTaskCounter(){
    version.findOne(function(err,databseBeforeUpdate){
        if(err){
            console.log(err);
            response.sendStatus(500);
            return;
        }else {
            version.updateOne({_id: 1}, {taskCounter: ++databaseBeforeUpdate.taskCounter},function(err){
                if(err) {
                    console.log(err + "[Task Counter couldn't be updated]");
                    return;
                }else{
                    console.log("[Succesfully updated the Task Counter]");
                }
            });
        }
    });
}

async function getTaskVersion(taskId, ItemModel){
    let version;

    await ItemModel.findOne({_id: taskId}, function(err,item){
        if(err){
            console.log(err);
            response.sendStatus(500);
            return
        }else{
            version = item.version;
        }
    });
}

async function assignTaskID(){
    let id;

    await version.findOne(function(err,databaseBeforeUpdate){
        if(err){
            console.log(err);
            response.sendStatus(500);
            return;
        }else{
            id =databseBeforeUpdate.taskCounter;
        }
    });
    return id;
}

function validateDatabaeHasBeenModified(versionInDatabase, request) {
    if(versionInDatabase == request.headers['if-none-match']) return false;
    else return true;
}

module.exports = {crearDB,getDabaseVersion,getTaskVersion,updateDatabaseVersion,validateDatabaeHasBeenModified,assignTaskID,increasteTaskCounter}