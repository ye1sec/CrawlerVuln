const dbconn=require("./dbconn");
const crypto=require('crypto');
const mongoose=require("mongoose");
const hash=require('../module/hash');
const crawlerSchema=mongoose.Schema({
    siteshash:{type:String},
    url:{type:String}
});


//添加一条爬取的数据
async function addCrawler(json) {
    const conn= await dbconn();
    const Crawler=await conn.model('Crawler',crawlerSchema);
    var data= new Crawler(json);
    await data.save(function (err) {
        if(err) console.log(err);
        conn.close();
        console.log("一条爬虫数据添加成功");
    });

}
//添加多条爬取的数据
async function addCrawlers(array) {
    const conn= await dbconn();
    const Crawler=await conn.model('Crawler',crawlerSchema);
    await Crawler.insertMany(array,function (err) {
        if(err) console.log(err);
        conn.close();
        console.log("多条爬虫数据添加成功");
    });

}
//添加多条爬取的数据
async function addCrawlersByUrls(siteshash,urls) {
    var array=[];
     urls.forEach(v=>{
     let tmp={siteshash:siteshash,url:v};
     array.push(tmp);
    });
   await addCrawlers(array);

}


//删除一个站点的爬虫数据
async  function delCrawlers(siteshash){
    const conn=await dbconn();
    const Crawler=await conn.model('Crawler',crawlerSchema);
    await Crawler.deleteMany({siteshash:siteshash},function (err) {
        if(err) console.log(err);
        conn.close();
        console.log("一个站点爬虫数据删除成功");
    });
}

//删除多个站点的爬虫数据
async function delManyCrawlers(siteshash) {
    var shs=siteshash.toString().split(',');
    shs.forEach(v=>{
        delCrawlers(v);
    });

}
async function getCrawlerBySiteshash(siteshash){
    const conn= await dbconn();
    const Crawler=await conn.model('Crawler',crawlerSchema);
    let result=Crawler.find({siteshash:siteshash},function (err) {
        conn.close();
        if(err) console.log(err);

    });
    return result;
}
exports.addCrawler=addCrawler;
exports.addCrawlers=addCrawlers;
exports.delCrawlers=delCrawlers;
exports.delManyCrawlers=delManyCrawlers;
exports.addCrawlersByUrls=addCrawlersByUrls;
exports.getCrawlerBySiteshas= getCrawlerBySiteshash;