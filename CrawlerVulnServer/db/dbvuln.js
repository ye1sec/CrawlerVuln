const dbconn=require("./dbconn");
const mongoose=require("mongoose");
const vulnSchema=mongoose.Schema({
    siteshash:{type:String},
    url:{type:String},
    payload:{type: String},
    request:{type:String},
    resheaders:{type:String},
    response:{type:String},
    vulnname:{type: String},
    time:{type:String}
});
//添加一条漏洞数据
async function addVuln(json) {
    const conn= await dbconn();
    const vuln=await conn.model('Vuln',vulnSchema);
    var data= new vuln(json);
    await data.save(function (err) {
        if(err) console.log(err);
        conn.close();
        console.log("添加成功");
    });

}
//删除某个站点的漏洞数据
async function delVulns(siteshash){
    const conn= await dbconn();
    const vuln=await conn.model('Vuln',vulnSchema);
    vuln.deleteMany({siteshash:siteshash},function (err) {
        if(err) console.log(err);
        conn.close();
        console.log("删除成功");

    });

}
//删除多个站点的漏洞数据
async function delManyVluns(siteshashs) {
    var shs=siteshashs.toString().split(',');
    shs.forEach(v=>{
        delVulns(v);
    });

}
//得到某个站点的漏洞数据
async function getVulns(siteshash){
    const conn= await dbconn();
    const vuln=await conn.model('Vuln',vulnSchema);
    const vulns=await vuln.find({siteshash:siteshash},function (err) {
        if(err) console.log(err);
        conn.close();

    }).sort([['_id', -1]]);
    return vulns;

}
//得到所有站点的漏洞数据
async function getManyVulns(){
    const conn= await dbconn();
    const vuln=await conn.model('Vuln',vulnSchema);
    const vulns=await vuln.find(function (err) {
        if(err) console.log(err);
        conn.close();

    }).sort([['_id', -1]]);
    return vulns;

}
async function delVulnById(id){
    const conn= await dbconn();
    const vuln=await conn.model('Vuln',vulnSchema);
    await vuln.findOneAndDelete({_id:id},function (err) {
        conn.close();
        if(err) console.log(err);


    })

}
//得到某一条漏洞信息
async function  getVulnById(id){
    const conn= await dbconn();
    const vuln=await conn.model('Vuln',vulnSchema);
    var result= await vuln.findById(id ,function (err) {
        if(err) console.log(err);
        conn.close();
    });
    return result;

}
//得到某个站点各个漏洞类别的数量
async function getVulnNumBySiteshash(siteshash){
    const conn= await dbconn();
    const vuln=await conn.model('Vuln',vulnSchema);
    var result= await vuln.aggregate([
        {
            $match:
                {
                    siteshash: siteshash
                }
        },
        {
            $group:
                {
                    _id: "$vulnname",//{}内的是分组条件
                    value: { $sum: 1 }//类似于.count 但这是是管道函数　　所以还需要加上$sum关键词
                },
        }, {
            $sort: {value: -1}
        }

        ],function (err) {
        if(err) console.log(err);
        conn.close();

    });
    return result;

}
async function getVulnNums(){
    const conn= await dbconn();
    const vuln=await conn.model('Vuln',vulnSchema);
    var result= await vuln.aggregate([
        {
            $group:
                {
                    _id: "$vulnname",//{}内的是分组条件
                    value: { $sum: 1 }//类似于.count 但这是是管道函数　　所以还需要加上$sum关键词
                },
        }, {
            $sort: {value: -1}
        }

    ],function (err) {
        if(err) console.log(err);
        conn.close();

    });
 //   console.log(result);
    return result;

}
//得到所有的漏洞数量
async function getVulnSum(){
    const conn= await dbconn();
    const vuln=await conn.model('Vuln',vulnSchema);

    var result= await vuln.estimatedDocumentCount(function (err) {
        if(err) console.log(err);
        conn.close();

    });

    //console.log(result);
    return result;

}

exports.addVuln=addVuln;
exports.delVulns=delVulns;
exports.delManyVluns=delManyVluns;
exports.getVulns=getVulns;
exports.getManyVulns=getManyVulns;
exports.delVulnById=delVulnById;
exports.getVulnById=getVulnById;
exports.getVulnNumBySiteshash=getVulnNumBySiteshash;
exports.getVulnNums= getVulnNums;
exports.getVulnSum=getVulnSum;
