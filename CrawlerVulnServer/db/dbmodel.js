const dbconn=require('./dbconn');
const mongoose=require('mongoose');
const modelSchema=mongoose.Schema({
    vulnname:{type:String},
    level:{type:String},
    description:{type:String},
    impact:{type:String},
    solution:{type:String}

});
//得到所有敏感目录的数据
async function getModelByVulnname(vulnname){
    let conn=await dbconn();
    let model=await conn.model('Model',modelSchema);
    let result=await model.find({vulnname,vulnname},function (err) {
        if(err) console.log(err);
        conn.close();

    });
    return result;

}
//添加一条敏感目录数据
async function addModel(json){
    let conn=await dbconn();
    let model=await conn.model('Model',modelSchema);
    var data=new model(json);
    await data.save(function (err) {
        if(err) console.log(err);
        conn.close();
        console.log("添加成功");

    })

}
//用&&&作为分隔符
let sqlModel={
    vulnname:"Cross Site Scripting",
    level:"high&&&open",
    description: "XSS (Cross-Site Script, 跨站脚本)是由于 web 应用程序对用户的输入过滤不足而产生的一种漏洞。攻击者可以利用网站漏洞把恶意的脚本代码注入到网页之中，当其他用户浏览这些带有恶意代码的网页时就会执行其中的恶意代码，对受害者产生各种攻击。",
    impact:"1.网站弹框（刷流量）&&&2.网站挂马&&&3.会话劫持&&&4.钓鱼攻击&&&5.蠕虫攻击&&&6.账号被盗&&&7.Cookie被盗取&&&8.结合CSRF进行针对性攻击",
    solution:"1.输入点检查：对用户输入的数据进行合法性检查，使用filter过滤敏感字符或对进行编码转义，针对特定类型数据进行格式检查。针对输入点的检查最好放在服务器端实现。&&&2.输出点检查：对变量输出到HTML页面中时，对输出内容进行编码转义，输出在HTML中时，对其进行HTMLEncode，如果输出在Javascript脚本中时，对其进行JavascriptEncode。对使用JavascriptEncode的变量都放在引号中并转义危险字符，data部分就无法逃逸出引号外成为code的一部分。还可以使用更加严格的方法，对所有数字字母之外的字符都使用十六进制编码。此外，要注意在浏览器中，HTML的解析会优先于Javascript的解析，编码的方式也需要考虑清楚，针对不同的输出点，防御XSS的方法可能会不同。&&&3.设置HTTPOnly对Cookie劫持做限制。"
};
let xssModel={
    vulnname:"SQL Injection",
    level:"high&&&open",
    description:"SQL注入是攻击者通过把SQL命令插入到Web表单递交或输入域名或页面请求的查询字符串，最终达到欺骗服务器执行恶意的SQL命令。",
    impact:"1.数据库信息泄漏：数据库中存放的用户的隐私信息的泄露。&&&2.网页篡改：通过操作数据库对特定网页进行篡改。&&&3.网站被挂马，传播恶意软件：修改数据库一些字段的值，嵌入网马链接，进行挂马攻击。&&&4.数据库被恶意操作：数据库服务器被攻击，数据库的系统管理员帐户被窜改。",
    solution:"1.对客户端提交的数据进行校验，校验可以考虑数据类型，字符长度或者正则表达式等方式。&&&2.对客户端提交的特殊字符进行转义。&&&3.采用预编译绑定变量的SQL语句而不是直接拼接SQL语句。&&&4.避免在生产环境中，直接输出错误信息。&&&5.严格执行数据库账号权限管理。&&&6.对用户敏感信息特别是密码做严格加密处理。"
}
//addModel(sqlModel);
//addModel(xssModel);
exports.getModelByVulnname=getModelByVulnname;
exports.addModel=addModel;