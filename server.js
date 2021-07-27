import { } from './functional.js'
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
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net/", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        frameSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "'unsafe-inline'", "data:", "https://cdn.jsdelivr.net", "https://cdn.freekassa.ru", "*.userapi.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com/", "data:"],
    }
}));


const apiLimiter = rateLimit({
    windowMs: 5 * 1000,
    max: 150
});

app_express.use(apiLimiter);
app_express.listen(1330);
app_express.use('/', exp.static('./build'));
// app_express.get('*', async (req, res, next) => {
//     if (~['/login', '/logOut'].indexOf(req.path)) next()
//     else {
//         res.sendFile(path.resolve('./build/index.html'), function (err) {
//             if (err) {
//                 console.log(err)
//             }
//         })
//     }
// });

// app_express.post('/getRefferalCode', async (req, res) => {
//     if (req.headers.cookie) res.json(await getRefferalCode(cookie.parse(req.headers.cookie)['X-CSRF-Token']))
// })



