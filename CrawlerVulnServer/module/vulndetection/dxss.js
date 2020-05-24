var fs=require('fs');
var path=require('path');
var request=require('superagent');
var urlsplit=require('../common/urlsplit');
var dbxss=require('../../db/dbxss');
let testurl="http://127.0.0.1/btslab/vulnerability/xss/xss1.php?keyword=Search&Search=Search";
async function xsscheck(url) {
    //判断url是否有参数
    if(!url.includes("?")){
        return ;
    }
    await dbxss.delXSS();//删除XSS漏洞数据
    let payloadPath=path.resolve(__dirname,'../../public/payload/xss.txt');
    let urls=urlsplit(url);
    let xssPayload=fs.readFileSync(payloadPath).toString().split("\r\n");
    for(let i=0;i<urls.length;i++){
        for(let j=0;j<xssPayload.length;j++){
            let newUrl=urls[i].replace('vuln_payload',xssPayload[j]);
            await (async () => {
                try {
                    const res = await request.get(newUrl);
                    if(res.text.includes(xssPayload[j])){
                        let data={url:url,payload:xssPayload[j],request:newUrl,resheaders:JSON.stringify(res.headers) ,response:res.text};
                        //console.log(data);
                      await  dbxss.addXSS(data);//添加XSS漏洞数据
                    }

                } catch (err) {
                    console.error(err);
                }
            })();



        }

    }


}
//xsscheck(testurl);
module.exports=xsscheck;