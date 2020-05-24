var express=require('express');
var router=express();
var dsenspath=require('../module/vulndetection/dsenspath');
var xsscheck=require('../module/vulndetection/dxss');
var sqlcheck=require('../module/vulndetection/dsql');
var dbsenspath=require('../db/dbsenspath');
var dbxss=require('../db/dbxss');
var dbsql=require('../db/dbsql');
var dbvuln=require('../db/dbvuln');
var app=express();

//敏感信息
router.post('/senspaths/scan',async(req,res)=>{
    let  basepath="F:/毕业设计/server/public/dict/common/";
    let numtotxt={"1":basepath+"jsp.txt","2":basepath+"php.txt","3":basepath+"asp.txt","4":basepath+"aspx.txt","5":basepath+"sen.txt","6":basepath+"dir.txt"};
    let form=req.body;
    await dsenspath(form.link,numtotxt[form.type]).then(()=>{
        res.send({
            status:true
        });
    });

});
router.get('/senspaths',function (req,res,next) {
    try{
        dbsenspath.getSensPaths().then(result=>{
            res.send(result);

        });
    }catch (e) {
        console.log(e);
    }

});
//xss
router.post('/xss/scan',async(req,res) =>{
    let form=req.body;
    await xsscheck(form.url);
    res.send({
        status:true
    });

});

router.get('/xss',function (req,res,next) {
    try{
        dbxss.getXSS().then(result=>{
            res.send(result);
        });
    }catch (e) {
        console.log(e);
    }
});
//sql
router.post('/sql/scan',async(req,res) =>{
    let form=req.body;
    await sqlcheck(form.url);
    res.send({
        status:true
    });

});

router.get('/sql',async(req,res)=>{

    let result=await  dbsql.getSQL();
    res.send(result);

});
//vuln
//得到所有站点的漏洞数据
router.get('/vuln', async(req,res)=> {
    let result=await dbvuln.getManyVulns();
    res.send(result);


});
//得到某个站点的漏洞数据
router.get('/vuln/:siteshash/sites',async (req,res) =>{
    let siteshash=req.params.siteshash;
    let result=await dbvuln.getVulns(siteshash);
    res.send(result);

});
//删除某一条漏洞信息
router.get('/vuln/:id/del',async (req,res) =>{
    try{
         await dbvuln.delVulnById(req.params.id);
            res.send({
                status:true
            });

    }catch (e) {
        console.log(e);

    }

});
//得到某条漏洞信息
router.get('/vuln/:id/view',async (req,res) =>{
       let result= await dbvuln.getVulnById(req.params.id);
       res.send(result);

});
//对某站点的漏洞类型进行聚合
router.get('/vuln/:siteshash/count',async(req,res)=>{
    let result=await  dbvuln.getVulnNumBySiteshash(req.params.siteshash);
    res.send(result);
});
router.get('/vuln/count',async(req,res)=>{
    let result=await  dbvuln.getVulnNums();
    res.send(result);
});
//得到某站点的漏洞url
router.get('/vuln/:siteshash/files',async(req,res)=>{
    let siteshash=req.params.siteshash;
    let result=await dbvuln.getVulns(siteshash);
    res.send(result);
});
router.get('/vuln/sum',async(req,res)=>{
    let result=await dbvuln.getVulnSum();
    console.log(result);
    res.send({
        count:result
    });
})

module.exports=router;