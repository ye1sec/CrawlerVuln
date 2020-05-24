const dbconn=require('./dbconn');
const mongoose=require('mongoose');
const SQLSchema=mongoose.Schema({
    url:{type:String},
    payload:{type:String},
    request:{type:String},
    resheaders:{type:String},
    response:{type:String}
});
//得到所有敏感目录的数据
async function getSQL(){
    let conn=await dbconn();
    let SQL=await conn.model('SQL',SQLSchema);
    let result=await SQL.find(function (err) {
        if(err) console.log(err);
        conn.close();

    });
    return result;

}
//添加一条敏感目录数据
async function addSQL(json){
    let conn=await dbconn();
    let SQL=await conn.model('SQL',SQLSchema);
    var data=new SQL(json);
    await data.save(function (err) {
        if(err) console.log(err);
        conn.close();
        console.log("添加成功");

    })

}
//删除所有敏感目录的数据
async function delSQL() {
    let conn=await dbconn();
    let SQL=await conn.model('SQL',SQLSchema);
    await SQL.remove().then(function (err){
        if(err)console.log(err);
        conn.close();
        console.log("删除成功");
    });

}

exports.getSQL=getSQL;
exports.addSQL=addSQL;
exports.delSQL=delSQL;