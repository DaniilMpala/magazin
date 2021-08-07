import { loginAdmin, loadnewItem, loadData,updateName,deleteTovar,NextallAcc, buyAcc, acceptbuyAcc,PayCheck } from './functional.js'
import exp from 'express'
import cookie from 'cookie'
import path from 'path'
import helmet from 'helmet'
import rateLimit from "express-rate-limit"
import ax from 'axios'


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
        imgSrc: ["*", "http://www.w3.org/", "data:"],
        fontSrc: ["*", "data:"],
    }
}));


const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30
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
var payJson = {}
app_express.post('/pushpay', async (req, res, next) => {
    console.log('/pushpay')
    console.log(req.body)
    if (!~['168.119.157.136', '168.119.60.227', '138.201.88.124'].indexOf(req.headers['cf-connecting-ip'])) next()

    switch (req.body.us_url) {
        case 'ezcush':
            payJson[req.body.intid] = "https://" + req.body.us_url + "." + req.body.us_domen + "/Pay"
            ax.post('https://ezcush.ru/pushfk', { id: req.body.MERCHANT_ORDER_ID, summa: req.body.AMOUNT, sign: req.body.SIGN })
            break;
        case 'shopacc':
            payJson[req.body.intid] = `https://shop-acc.ru/PayCheck`
            acceptbuyAcc(req.body.MERCHANT_ORDER_ID, req.body.us_email)
            break;
    }

    next()
})

app_express.post('/pay', async (req, res) => {
    console.log('/pay', req.body, payJson)
    if (payJson[req.body.intid]) res.redirect(payJson[req.body.intid])
})
app_express.post('/loadData', async (req, res) => {
    res.json(await loadData())
})
app_express.post('/PayCheck', async (req, res) => {
    res.json(await PayCheck(req.body))
})
app_express.post('/NextallAcc', async (req, res) => {
    if (req.headers.cookie)  res.json(await NextallAcc(cookie.parse(req.headers.cookie)['token'], req.body.next))
})

app_express.post('/updateName', async (req, res) => {
    if (req.headers.cookie)  res.json(await updateName(cookie.parse(req.headers.cookie)['token'], req.body))
})
app_express.post('/deleteTovar', async (req, res) => {
    if (req.headers.cookie)  res.json(await deleteTovar(cookie.parse(req.headers.cookie)['token'], req.body))
})

app_express.post('/buyAcc', async (req, res) => {
    res.json(await buyAcc(req.body))
})
app_express.post('/loadnewItem', async (req, res) => {
    if (req.headers.cookie) res.json(await loadnewItem(cookie.parse(req.headers.cookie)['token'], req.body))
    else return "Вы обходите систему, ай ай ай :)"
})

app_express.post('/loginAdmin', async (req, res) => {
    var responce = await loginAdmin(req.body.login, req.body.password, req.headers.cookie ? cookie.parse(req.headers.cookie)['token'] : "")
    if (responce.succes) {
        res.cookie('token', responce.responceCode, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
        delete responce['responceCode']
        res.json(responce)
    } else {
        res.json(false)
    }
})
console.log('loisten', 1332)
// app_express.post('/getRefferalCode', async (req, res) => {
//     if (req.headers.cookie) res.json(await getRefferalCode(cookie.parse(req.headers.cookie)['X-CSRF-Token']))
// })



