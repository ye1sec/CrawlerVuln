const dbconn=require("./dbconn");
const random=require("string-random");
const mongoose=require("mongoose");
const targetSchema=mongoose.Schema({
    sites:{type:String},
    desc:{type:String},
    time:{type: String},
    siteshash:{type:String}

});
//添加扫描目标一条站点数据
async function addTarget(json) {
    const conn= await dbconn();
    const Target=await conn.model('Target',targetSchema);
    var data= new Target(json);
    await data.save(function (err) {
        if(err) console.log(err);
        conn.close();
        console.log("添加成功");
    });

}
//删除扫描目标的一条数据
async function delTarget(siteshash){
    const conn= await dbconn();
    const Target=await conn.model('Target',targetSchema);
    Target.findOneAndDelete({siteshash:siteshash},function (err) {
        conn.close();
        if(err) console.log(err);
        console.log("删除成功");

    });

}
//删除扫描站点多条数据
async  function delTargets(siteshashs){
    var shs=siteshashs.toString().split(',');
    shs.forEach(v=>{
         delTarget(v);
    });


}

//得到扫描目标的所有数据
async function getTargets(){
    const conn= await dbconn();
    const Target=await conn.model('Target',targetSchema);
    var targets=await Target.find(function (err) {
        if(err) console.log(err);
        conn.close();

    }).sort([['_id', -1]]);
    return targets;

}
//得到所有的数据数量
async function getTargetSum() {
    const conn = await dbconn();
    const Target = await conn.model('Target', targetSchema);
    var result= await Target.estimatedDocumentCount(function (err) {
        if(err) console.log(err);
        conn.close();

    });
    //console.log(result);
    return result;
}

exports.delTarget=delTarget;
exports.addTarget=addTarget;
exports.getTargets=getTargets;
exports.delTargets=delTargets;
exports.getTargetSum=getTargetSum;