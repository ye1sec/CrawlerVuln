var urlsplit=require('../common/urlsplit');
var request=require('superagent');
var dbvuln=require('../../db/dbvuln');

let testurl="http://localhost/btslab/vulnerability/ForumPosts.php?id=1";
//sql注入
async function sqlcheck(siteshash,url) {
    //判断url是否有参数
    if(url==undefined||!url.includes("?")){
        return ;
    }
    let dbmsError = {
        "MySQL": ["SQL syntax.*MySQL", "Warning.*mysql_.*", "valid MySQL result", "MySqlClient\."],
        "PostgreSQL":  ["PostgreSQL.*ERRO", "Warning.*\Wpg_.*", "valid PostgreSQL result", "Npgsql\."],
        "Microsoft SQL Serve": ["Driver.* SQL[\-\_\ ]*Serve", "OLE DB.* SQL Serve", "(\W|\A)SQL Server.*Drive", "Warning.*mssql_.*", "(\W|\A)SQL Server.*[0-9a-fA-F]{8}", "(?s)Exception.*\WSystem\.Data\.SqlClient\.", "(?s)Exception.*\WRoadhouse\.Cms\."],
        "Microsoft Access":  ["Microsoft Access Drive", "JET Database Engine", "Access Database Engine"],
        "Oracle":  ["\bORA-[0-9][0-9][0-9][0-9]", "Oracle erro", "Oracle.*Drive", "Warning.*\Woci_.*", "Warning.*\Wora_.*"],
        "IBM DB2": ["CLI Driver.*DB2", "DB2 SQL erro", "\bdb2_\w+\("],
        "SQLite":  ["SQLite/JDBCDrive", "SQLite.Exception", "System.Data.SQLite.SQLiteException", "Warning.*sqlite_.*", "Warning.*SQLite3::", "\[SQLITE_ERROR\]"],
        "Sybase":  ["(?i)Warning.*sybase.*", "Sybase message", "Sybase.*Server message.*"],
    };
    let urls=urlsplit(url);
    for(let i=0;i<urls.length;i++){
        let newUrl=urls[i].replace('vuln_payload',"%29%28%22%27");
        try {
            const res = await request.get(newUrl);
            for(let key in dbmsError){
                for(let val in  dbmsError[key]){
                    let reg=new RegExp(/val/,"img");
                    if(reg.test(res.text)){
                        let data={siteshash:siteshash,url:url,payload:decodeURI("%29%28%22%27"),request:newUrl,resheaders:JSON.stringify(res.headers) ,response:res.text,vulnname:"SQL Injection",time:new Date().toLocaleString()};
                        await dbvuln.addVuln(data);//添加sql信息
                        return;
                    }

                }
            }

        } catch (err) {
            console.error(err);
        }


    }

}
//sqlcheck(testurl);
module.exports=sqlcheck;
