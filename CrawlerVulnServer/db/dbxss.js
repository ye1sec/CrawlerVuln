const dbconn=require('./dbconn');
const mongoose=require('mongoose');
const XSSSchema=mongoose.Schema({
    url:{type:String},
    payload:{type:String},
    request:{type:String},
    resheaders:{type:String},
    response:{type:String}
});
//得到所有敏感目录的数据
async function getXSS(){
    let conn=await dbconn();
    let XSS=await conn.model('XSS',XSSSchema);
    let result=await XSS.find(function (err) {
        if(err) console.log(err);
        conn.close();

    });
    return result;

}
//添加一条敏感目录数据
async function addXSS(json){
    let conn=await dbconn();
    let XSS=await conn.model('XSS',XSSSchema);
    var data=new XSS(json);
    await data.save(function (err) {
        if(err) console.log(err);
        conn.close();
        console.log("添加成功");

    })

}
//删除所有敏感目录的数据
async function delXSS() {
    let conn=await dbconn();
    let XSS=await conn.model('XSS',XSSSchema);
    await XSS.remove().then(function (err){
        if(err)console.log(err);
        conn.close();
        console.log("删除成功");
    });

}

exports.getXSS=getXSS;
exports.addXSS=addXSS;
exports.delXSS=delXSS;