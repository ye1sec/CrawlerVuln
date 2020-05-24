const express=require('express');
const logger = require('morgan');
const path = require('path');
const targetroute=require('./route/targetroute');
const vulnroute=require('./route/vulnroute');
const modelroute=require('./route/modelroute');
const crawlerroute=require('./route/crawlerroute');
const userroute=require('./route/userroute');
const app = express();
app.set('secret','a1s5df3w');
app.use(logger("dev"));
app.use(require('cors')());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(targetroute);
app.use(vulnroute);
app.use(modelroute);
app.use(crawlerroute);
app.use(userroute);

app.use(express.static(path.join(__dirname, 'public')));
//捕获所有异常
app.use( async(err, req, res, next) => {
    //console.error(err.stack);
    if(err) res.status(err.statusCode || 500).send({
        message:err.message
    });
});

console.log("http://127.0.0.1:3000");
app.listen(3000);