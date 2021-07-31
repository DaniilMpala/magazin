import { loginAdmin} from './functional.js'
import exp from 'express'
import http from 'http'
import cookie from 'cookie'
import path from 'path'
import helmet from 'helmet'
import rateLimit from "express-rate-limit"



var redirictMain = "/" // "http://localhost:3000"
var vkLogin = "http://ezcush.ru" // "http://localhost:1332" http://185.244.173.185


var app_express = exp();

app_express.use(exp.json());
app_express.use(exp.urlencoded({ extended: true }));

app_express.use(helmet());
app_express.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["*"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        frameSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["*"],
        fontSrc: ["*"],
    }
}));


const apiLimiter = rateLimit({
    windowMs: 5 * 1000,
    max: 150
});

app_express.use(apiLimiter);
app_express.listen(1332);
app_express.use('/', exp.static('./build'));
app_express.get('*', async (req, res, next) => {
    if (~[''].indexOf(req.path)) next()
    else {
        res.sendFile(path.resolve('./build/index.html'), function (err) {
            if (err) {
                console.log(err)
            }
        })
    }
});

app_express.post('/loginAdmin', async (req, res) => {
    var res = await loginAdmin(req.body.login, req.body.password, req.headers.cookie ? cookie.parse(req.headers.cookie)['token'] : "")
    if(res.succes){
        res.cookie('token', res.responceCode, { maxAge: 1000, httpOnly: true });
        res.json(res.succes)
    }else{
        res.json(false)
    }
})



