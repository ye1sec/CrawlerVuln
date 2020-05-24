const fs=require('fs');
const request = require('request');
const urllib=require('url');
const async=require('async');
var dictpath='../../public/dict/common/dir.txt';
var url="https://movie.douban.com/";
var dbsenspath=require('../../db/dbsenspath');

async function bruteSensPath(baselink,dictpath) {

    let dictdatas=fs.readFileSync(dictpath).toString().split("\r\n");
    let urldicts=[];
    // console.log(dictdatas);
    dbsenspath.delSensPaths();//删除所有敏感信息的数据
    for(let v of dictdatas){
        link=urllib.resolve(baselink,v);
        urldicts.push(link);
    }
    //console.log(urldicts);
    await async.mapLimit(urldicts,20,function (urldict,callback) {
        isSensPath(baselink,urldict,callback);
    },function (err,result) {
        if(err) console.log(err);
    });

}


async function isSensPath(baselink,link,callback) {
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
        let size="";
        let pathname=urllib.parse(link).pathname;
        if(error){
            console.log(error);
        }else{
            let statusCode= response.statusCode;
            if(statusCode===200||statusCode ===301 ||statusCode === 302||statusCode===403){
                if(statusCode===200){
                    let headers=response.headers;
                    size=headers['content-length']+"B";
                }else if (statusCode ===301 ||statusCode === 302) {
                    let headers=response.headers;
                    let location = headers.location;
                    size=headers['content-length']+"B";
                    pathname=pathname+"=>"+location;
                } else if(statusCode===403){
                    let headers=response.headers;
                    size=headers['content-length']+"B";

                }
                console.log(response.statusCode+"  "+ size+ "  "+pathname);
                let  data={statuscode:statusCode,size:size,url:baselink,pathname:pathname};
                dbsenspath.addSensPath(data);//添加敏感信息的数据
                callback(null,data);
            }else {
                callback(null);
            }
        }

    });

}

//bruteSensPath(url,dictpath);
module.exports=bruteSensPath;

