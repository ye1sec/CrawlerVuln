var express=require('express');
var router=express();
var dbcrawler=require('../db/dbcrawler');
var urltree=require('../module/common/urltree');
//返回漏洞类型对应的模板
router.get("/crawler/:siteshash",async(req,res)=> {
    let result = await dbcrawler.getCrawlerBySiteshas(req.params.siteshash);
    res.send(result);
});
router.get("/crawler/:siteshash/file",async(req,res)=>{
    let crawlerdata=await dbcrawler.getCrawlerBySiteshas(req.params.siteshash);
    let crawlerArray=urltree.urlToArray(crawlerdata);
    let result=urltree.translateDataToTree(crawlerArray);
    res.send(result);

});

module.exports=router;