var urllib=require('url');
var querystring=require('querystring');

//testurl="http://www.baidu.com/test.php?a=1&c=d7777";
function urlsplit(url) {
   let domain=url.split("?")[0];
   let query=url.split("?")[1];
   let param=querystring.parse(query,'&','=');
   urls=[];
   for(let key in param){
       new_url=domain+"?"+query.replace(param[key],param[key]+"vuln_payload");
       urls.push(new_url);
   }
   return urls;

}
//console.log(urlsplit(testurl));
module.exports=urlsplit;