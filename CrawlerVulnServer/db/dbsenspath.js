const dbconn=require('./dbconn');
const mongoose=require('mongoose');
const senspathSchema=mongoose.Schema({
    statuscode:{type:Number},
    size:{type:String},
    url:{type:String},
    pathname:{type:String}
});
//得到所有敏感目录的数据
async function getSensPaths(){
    let conn=await dbconn();
    let sensPath=await conn.model('SensPath',senspathSchema);
    let result=await sensPath.find(function (err) {
        if(err) console.log(err);
        conn.close();

    }).sort([['statuscode', 1]]);
    return result;

}
//添加一条敏感目录数据
async function addSensPath(json){
    let conn=await dbconn();
    let sensPath=await conn.model('SensPath',senspathSchema);
    var data=new sensPath(json);
    await data.save(function (err) {
        if(err) console.log(err);
        conn.close();
        console.log("添加成功");

    })

}
//删除所有敏感目录的数据
async function delSensPaths() {
    let conn=await dbconn();
    let sensPath=await conn.model('SensPath',senspathSchema);
    await sensPath.remove().then(function (err){
        if(err)console.log(err);
        conn.close();
        console.log("删除成功");
    });

}
exports.getSensPaths=getSensPaths;
exports.addSensPath=addSensPath;
exports.delSensPaths=delSensPaths;