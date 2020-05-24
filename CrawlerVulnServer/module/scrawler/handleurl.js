const urllib=require('url');


function similarUrl(url) {
   let urlparse=urllib.parse(url);
   //console.log(urlparse);
    let similarurl=urlparse.host;
    let pathname=urlparse.pathname;
    let query=urlparse.query;
    //处理目录文件
    if(pathname!=="/"){
        if(pathname.indexOf('.')!==-1){
            let path=pathname.split('.');
            path[0].split('/').forEach(v=>{
                similarurl+=stringReplace(v)+"/";
            });
            similarurl+=path[1]+"?";

        }else{
            pathname.split('/').forEach(v=>{
                similarurl+=stringReplace(v)+"?";
            });

        }

    }
    if(query!=null){
        //null or undefined
        query.split("&").forEach(v=>{
           let para= v.split("=");
           similarurl+=para[0]+"=";
           similarurl+=stringReplace(para[1])+"&";
        })
    }
    return similarurl;
    //console.log(similarurl);

   /// path=path.replace(/\d+/g,"int");

}
//对传入的字符串进行替换
//都是数据，怎替换为int;都是字母不替换，有字符串和字母替换成string.
function stringReplace(word){
    var digit=0,letter=0;
    for(let i=0;i<word.length;i++){
         asciinum=word.charCodeAt(i);
        if(48<=asciinum&&asciinum<=57){
            digit++;
        }
        if(65<=asciinum&&asciinum<=122){//其中的一些特殊字符就忽略了
            letter++;
        }
    }
    if(digit===0&&letter!==0){
        return word;
    }else if (digit!==0&&letter===0){
        return "int";
    }else if(digit!==0&&letter!==0){
        return "string";
    }
    return word;
}

const crypto=require('crypto');

function getUrlHash(url) {
    var urlBrief=similarUrl(url);
    return crypto.createHash('sha1').update(urlBrief).digest('hex');
}


///similarUrl("http://www.leiting.com:800/index/123a/index.php?a=&b=21");
//console.log(stringReplace("123456aa"));

exports.getUrlHash=getUrlHash;