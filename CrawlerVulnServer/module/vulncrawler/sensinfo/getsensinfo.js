const fs=require('fs');
const request = require('request');
const urllib=require('url');
var completed_requests=0;
var completed_count=0;
var dictpath='./dict/common/dir.txt';
var url="https://movie.douban.com";
var result=[];
async function bruteFilePath(baselink,dictpath) {

    var dictdatas=fs.readFileSync(dictpath).toString().split("\r\n");
   // console.log(dictdatas);


    for(let v of dictdatas){
        link=urllib.resolve(baselink,v);
        await isFilePath(link);

    }

}


async function isFilePath(link) {

    var options = {
        url:  encodeURI(link),
        followRedirect: false,
        timeout:5000,
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Charset': 'UTF-8;',
            'User-Agent':'Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9.2.8) Firefox/3.6.8',
        }
    };

    await request(options, function (error, response, body) {
        global.completed_requests++;
        let size="";
        let pathname=urllib.parse(link).pathname;
        if(error){
            return ;
        }
        if(response.statusCode===200){
            let headers=response.headers;
            size=headers['content-length']+"B";
        }else if (response.statusCode ===301 || response.statusCode === 302) {
            let headers=response.headers;
            let location = headers.location;
            size=headers['content-length']+"B";
            pathname=pathname+"=>"+location;
        } else if(response.statusCode===403){
            let headers=response.headers;
            size=headers['content-length']+"B";

        }else{
            return ;
        }
        console.log(response.statusCode+"  "+ size+ "  "+pathname);
        let  data={statuscode:response.statusCode,size:size,pathname:pathname};
    });
}

//bruteFilePath(url,dictpath);


exports.bruteFilePath=bruteFilePath;
exports.isFilePath=isFilePath;
