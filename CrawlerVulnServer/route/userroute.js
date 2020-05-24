var express=require('express');
var router=express();
var dbuser=require('../db/dbuser');
var bcrypt=require('bcrypt');
var app=express();
var jwt=require('jsonwebtoken');
var assert=require('http-assert');
router.get('/user',async(req,res)=>{
    let result=await dbuser.getUsers();
    res.send(result);

});

var auth=async(req,res,next)=>{
    try{
        let token=req.headers.authorization;
        assert(token,422,"token 不存在")
        const {id}=jwt.verify(token,router.get('secret'));
        let user=await dbuser.getUserById(id);


    }catch (e) {
        res.status(422).send({
            message: 'error'
        })

    }
    await next();

}
router.get('/user/:id/view',auth,async(req,res)=>{
    let id=req.params.id;
    let result=await dbuser.getUserById(id);
    res.send(result);
});
router.post('/user/login',async(req,res)=>{
    var username=req.body.username;
    var password=req.body.password;
    let user=await dbuser.isUser(username);
    //console.log(router.get('secret'))
    if(user.length===0){
        res.status(422).send({
            message:"用户不存在"
        });
    }else{
        let valid=bcrypt.compareSync(password,user[0].password);
        if(!valid){
            res.status(422).send({
                message:"密码错误"
            });

        }else{
            const token= jwt.sign({id:user[0]._id,username:user[0].username},router.get('secret'));
            res.send({token})

        }


    }


});
//对用户的token进行验证
router.post('/user/verify',auth,function (req,res) {
    res.status(200).send({
    });
});

router.post('/user/:id/update',auth,async(req,res)=>{
    try{
        let data=req.body;
        assert(data.password,422,'密码不能为空');
        assert(data.username,422,'用户名不能为空');
        console.log(data);
        await dbuser.updateUserById(req.params.id,data);
        console.log(2);
        res.send({message:"success"});
    }catch (e) {
        res.status(422).send({
            message:e.message
        })

    }



});

module.exports=router;
