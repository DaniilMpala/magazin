import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import ax from 'axios'
import cookie from 'cookie'

var db;
var _login = 'adminwer';
var pasword = "liqwedmafaz";
var responceCode = "n~[%Kgl4-x_4T<!)Ck;85$ft)2}NcVL%CppYnFMh{%H{]'XVvq]?^%Sf~zbVt5(j@'o,_T№KiD):qi,+B|jUDA№/eHC-LVcvR*4№]/$v.P+Ui@(%3aSCsttM_,Rma3IvB5>hzR7Jn/k35O(y+ThQ*>>&i_D#-Dm:X№s<v@7№$lBr)'13LwqS6F{RfZ}iG?#s.f8Pj>03~r>3e/vKal?CBo(Jc_-%}j*nz$[Cx>gKddNYFgxs9l$8w-#TdGXfSW29(V№k9[]LC~Lo4U[}=Nf#+OY354ZCJa1k)]Z#xoZ|_ZMY";

(async () => {
    db = await open({
        filename: 'database.db',
        driver: sqlite3.Database
    })
})()

var dataLoad = []

const updateColvo = async () => {
    var allCategory = await db.all(`SELECT * FROM category`)
    var allAcc = await db.all(`SELECT DISTINCT idCategory, titleAccount, price FROM accounts WHERE sold = 0`)

    allAcc = await Promise.all(allAcc.map(async (v, i) => {
        return {
            colVo: (await db.get(`SELECT COUNT(*) FROM accounts WHERE idCategory = ${v.idCategory} AND titleAccount = '${v.titleAccount}' AND price=${v.price} `))['COUNT(*)'],
            id: i,
            title: v.titleAccount,
            price: v.price,
            idCategory: v.idCategory
        }
    }))

    dataLoad = []
    allCategory.forEach(e => {
        let items = allAcc.filter(v => v.idCategory == e.id)
        if (items.length > 0)
            dataLoad.push({
                id: e.id,
                title: e.title,
                urlPhoto: e.urlPhoto,
                items: items
            })
    });

}

export const loadData = async () => {
    if (dataLoad.length == 0) await updateColvo()
    return dataLoad
}

export const PayCheck = async ({ email, orderid }) => {
    //перекидываетп осле уудачной оплаты
    
}
export const buyAcc = async ({ mail, count }) => {
    //реализовать с фрикассу оплату
}
export const acceptbuyAcc = async ({}) => {
    //пушем поулчаем опалут и ставим статус что оплачено
}

export const loginAdmin = async (login, pas, token) => {
    if (token == responceCode) return { succes: true, responceCode: responceCode, category: await db.all('SELECT * FROM category'), buylast: await db.all('SELECT * FROM buylast') }

    var login = login == _login && pas == pasword
    if (login) return { succes: true, responceCode: responceCode, category: await db.all('SELECT * FROM category'), buylast: await db.all('SELECT * FROM buylast') }
    else return { succes: false }
}
export const loadnewItem = async (token, { idCategory, nameCat, urlFoto, name, tovar, price }) => {
    if (token != responceCode) return "Вы обходите систему, ай ай ай :)"

    idCategory = idCategory.trim()
    name = name.trim()
    tovar = tovar.trim()
    price = price.trim()

    if (idCategory == -1) {
        nameCat = nameCat.trim()
        urlFoto = urlFoto.trim()
        if (!nameCat || !urlFoto || !name || !tovar || isNaN(price)) return "Не правильный формат"
    }
    else if (!name || !tovar || isNaN(price)) return "Не правильный формат"

    if (idCategory == -1 && urlFoto)
        idCategory = (await db.run(`INSERT INTO category (title,urlPhoto) VALUES ( '${nameCat}','${urlFoto}')`)).lastID

    tovar = tovar.split('\n').map(v => `(${idCategory},'${name}','${price}', '${v}')`)

    await db.run(`INSERT INTO accounts (idCategory,titleAccount,price,infoAccount) VALUES ${tovar}`)

    await updateColvo()
    return "Товар успешно добавлен"
}