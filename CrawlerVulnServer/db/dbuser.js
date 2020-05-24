const dbconn=require('./dbconn');
const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    username:{type:String},
    password:{type:String ,
        select:true,
        set(val){
           return require('bcrypt').hashSync(val,10);
        }}

});
//得到所有用户信息
async function getUsers(){
    let conn=await dbconn();
    let user=await conn.model('User',userSchema);
    let result=await user.find(function (err) {
        if(err) console.log(err);
        conn.close();

    })
    return result;

}
//添加用户
async function addUser(json) {
    let conn=await dbconn();
    let user=await  conn.model('User',userSchema);
    var data= new user(json);
    await data.save(function (err) {
        conn.close();
        if(err) console.log(err);
        console.log("添加成功");
    });

}
//通过id得到一个用户
async function getUserById(id){
    let conn=await dbconn();
    let user=await  conn.model('User',userSchema);
    let result=await user.findById(id,function (err) {
        conn.close();
        if(err) console.log(err);

    });
    return result;


}
//判断用户是否存在
async function isUser(username){
    let conn=await dbconn();
    let user=await  conn.model('User',userSchema);
    let result=await user.find({username:username},function (err) {
        conn.close();
        if(err) console.log(err);

    });
    return result;

}
//删除用户
async function delUserById(id) {
    let conn=await dbconn();
    let user=await  conn.model('User',userSchema);
    await user.findByIdAndDelete(id,function (err) {
        conn.close();
        if(err) console.log(err);
        console.log("删除成功");
    });
}
async function updateUserById(id,json){
    let conn=await dbconn();
    let user=await  conn.model('User',userSchema);
    console.log(json)
    await user.findByIdAndUpdate(id,{username:json.username,password:json.password},function (err) {
        conn.close();
        if(err) console.log(err);
        console.log("修改成功");
    });

}
//let test={username:'test',password:'test'}
//addUser(test);
exports.getUsers=getUsers;
exports.addUser=addUser;
exports.delUserById= delUserById;
exports.getUserById=getUserById;
exports.isUser=isUser;
exports.updateUserById=updateUserById;