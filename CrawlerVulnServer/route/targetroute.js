var express=require('express');
var router=express();
var dbtarget=require('../db/dbtarget');
var random=require('string-random');
var scrawler=require('../module/scrawler/scrawlermain');
var dbcrawler=require('../db/dbcrawler');
var dbvuln=require('../db/dbvuln');
//添加站点数据
router.post('/targets/add',async(req,res) =>{
    let form=req.body;
    let siteshash=random(32);
    let target={
        sites:form.sites,
        desc:form.desc,
        time: new Date().toLocaleString(),
        siteshash: siteshash
    };
    await dbtarget.addTarget(target);//添加站点数据
    await scrawler(siteshash,form);
    res.send({
        status:true
    });

});

//得到站点数据
router.get('/targets',function (req,res,next) {
    try{
        dbtarget.getTargets().then(result=>{
            res.send(result);
        });
    }catch (e) {
        res.send(e.message);
    }
});
//删除站点一条数据
router.get('/targets/:siteshash/del',async(req,res)=>{
    let siteshash=req.params.siteshash;
    await dbtarget.delTarget(siteshash);//删除站点数据
    await dbcrawler.delCrawlers(siteshash);//删除站点相关的爬虫数据
    await dbvuln.delVulns(siteshash);

    res.send({
        status:true
    });

} );
//删除扫描目标多条数据
router.post('/targets/del',async(req,res)=>{
      let siteshash=req.body.siteshashs;
      await  dbtarget.delTargets(siteshash);
      await dbcrawler.delManyCrawlers(siteshash);
      await dbvuln.delManyVluns(siteshash);
      res.send({
          status:true
      });


});

router.get('/targets/sum',async(req,res)=>{
    let result=await  dbtarget.getTargetSum();
    res.send({
        count:result
    });


});
module.exports=router;