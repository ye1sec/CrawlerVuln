const urllib=require('url');
const crypto=require('crypto');

function getUrlHash(url) {
    var urlBrief=getUrlBrief(url);
    return crypto.createHash('sha1').update(urlBrief).digest('hex');
}

function getUrlBrief(url){
    var urlparse=urllib.parse(url);
    var urlBrief=urlparse.host+urlparse.pathname;
    if(urlparse.query){
        let s=urlparse.query.split('&');
        s.forEach(v=>{
            urlBrief+="|"+v.split("=")[0];
        });
        console.log(s);

    }
    return urlBrief;

}
exports.getUrlHash=getUrlHash;