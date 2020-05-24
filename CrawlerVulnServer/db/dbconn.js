var mongoose=require('mongoose');
var url="mongodb://localhost:27017/web"

async function dbconn() {
    const conn=mongoose.createConnection(url,{useNewUrlParser:true,useUnifiedTopology:true});
    conn.on('err',(err)=>{
        console.log('err:'+err);
    });
    return conn;
}
module.exports=dbconn