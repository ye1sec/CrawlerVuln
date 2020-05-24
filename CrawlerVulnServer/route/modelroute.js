var express=require('express');
var router=express();
var dbmodel=require('../db/dbmodel');
//返回漏洞类型对应的模板
router.get("/model/:vulnname",async(req,res)=>{
    let result=await dbmodel.getModelByVulnname(req.params.vulnname);
    res.send(result);

});
module.exports=router;