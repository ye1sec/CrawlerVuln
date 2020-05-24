const fs=require('fs');
const request = require('request');
const urllib=require('url');
var completed_requests=0;
var dictpath='./dict/common/dir.txt';
var url="https://movie.douban.com";
async function bruteFilePath(baselink,dictpath) {
   var dictdatas=fs.readFileSync(dictpath).toString().split("\r\n");
  // console.log(dictdatas.toString().split())
    //var dictdatas=['/subject/30314127/','/test','/test','/index.html','/admin'];
    //console.log(dictdatas)
    (async ()=>{
        for(let v of dictdatas){
            link=urllib.resolve(baselink,v);
            //console.log(link);
            await isFilePath(link);

        }
    })();


}

async function isFilePath(link) {
   //completed_requests++;
    console.log(link);
    var options = {
        url:  encodeURI(link),
        followRedirect: false,
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Charset': 'UTF-8;',
            'User-Agent':'Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9.2.8) Firefox/3.6.8',
        }
    };

    await request(options, function (error, response, body) {
        if(error){
           console.log(error.message);
           return
        }
         let pathname=urllib.parse(link).pathname;
        if(response.statusCode===200){
            let headers=response.headers;
            let size=headers['content-length']+"B";
            console.log(response.statusCode+"  "+size+ "  "+pathname);
        }else if (response.statusCode ===301 || response.statusCode === 302) {
            let headers=response.headers;
            let location = headers.location;
            let size=headers['content-length']+"B";
            console.log(response.statusCode+"  "+ size+ "  "+pathname+"=>"+location);
        } else if(response.statusCode===403){
            //console.log(body);
            console.log(response.statusCode+"  "+  "  "+pathname);
        }else{
        }
    });
}
bruteFilePath(url,dictpath);
//isFilePath(url,"/admin")
