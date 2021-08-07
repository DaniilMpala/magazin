import { open } from "sqlite";
import sqlite3 from "sqlite3";
import ax from "axios";
import nodemailer from "nodemailer";
import md5 from "md5";

let transporter = nodemailer.createTransport({
    service: "Yahoo",
    auth: {
        user: "shopacc91@yahoo.com",
        pass: "ghyjchatsujekrph",
    },
});

var db;
var _login = "adminwer";
var pasword = "liqwedmafaz";
var responceCode =
    "n~[%Kgl4-x_4T<!)Ck;85$ft)2}NcVL%CppYnFMh{%H{]'XVvq]?^%Sf~zbVt5(j@'o,_T№KiD):qi,+B|jUDA№/eHC-LVcvR*4№]/$v.P+Ui@(%3aSCsttM_,Rma3IvB5>hzR7Jn/k35O(y+ThQ*>>&i_D#-Dm:X№s<v@7№$lBr)'13LwqS6F{RfZ}iG?#s.f8Pj>03~r>3e/vKal?CBo(Jc_-%}j*nz$[Cx>gKddNYFgxs9l$8w-#TdGXfSW29(V№k9[]LC~Lo4U[}=Nf#+OY354ZCJa1k)]Z#xoZ|_ZMY";

(async () => {
    db = await open({
        filename: "database.db",
        driver: sqlite3.Database,
    });
})();

var dataLoad = [];

const updateColvo = async () => {
    var allCategory = await db.all(`SELECT * FROM category`);
    var allAcc = await db.all(
        `SELECT DISTINCT idCategory, titleAccount, price, desc FROM accounts WHERE sold = 0`
    );

    allAcc = await Promise.all(
        allAcc.map(async (v, i) => {
            return {
                colVo: (
                    await db.get(
                        `SELECT COUNT(*) FROM accounts WHERE idCategory = ${v.idCategory} AND titleAccount = '${v.titleAccount}' AND price=${v.price} `
                    )
                )["COUNT(*)"],
                id: i,
                title: v.titleAccount,
                price: v.price,
                desc: v.desc,
                idCategory: v.idCategory,
            };
        })
    );

    dataLoad = [];
    allCategory.forEach((e) => {
        let items = allAcc.filter((v) => v.idCategory == e.id);

        if (items.length > 0)
            dataLoad.push({
                id: e.id,
                title: e.title,
                urlPhoto: e.urlPhoto,
                items: items,
            });
    });
};

export const loadData = async () => {
    if (dataLoad.length == 0) await updateColvo();
    return dataLoad;
};

export const PayCheck = async ({ email }) => {
    if (!(await validateEmail(email))) return { message: "Такой почты не существует" };

    var allbuy = await db.all(
        `SELECT infoAccount, dataBuy FROM accounts WHERE emailBuy = '${email}'`
    );

    if (allbuy.length == 0) {
        console.log(
            new Date(),
            "Кто то пытается отправить аккаунты на не существующею почту"
        );
        return { message: "Почта не найдена в нашей БД" };
    }

    let result = await transporter.sendMail({
        from: '"Магазин аккаунтов" <shopacc91@yahoo.com>',
        to: email,
        subject: "Запрос на покупки",
        text: "Вы делали запрос на получение всех своих покупок в нашем магазине, прикрплен файл со всеми покупками\n\nС уважением команда shop-acc.ru",
        attachments: [
            {
                filename: `Аккаунты.txt`,
                content: allbuy
                    .map((v) => `${v.infoAccount}:Дата покупки ${v.dataBuy}`)
                    .join("\n"),
            },
        ],
    });

    console.log(email, "Письмо отправлено", result);
    return { message: "Мы отправили вам письмо, проверьте папку СПАМ!" };
};
export const buyAcc = async ({ mail, count, acc }) => {
    if (!(await validateEmail(mail))) return { message: "Такой почты не существует" };

    var check = (
        await db.all(
            `SELECT id FROM accounts WHERE titleAccount = '${acc.title}' AND price = ${acc.price} AND idCategory = ${acc.idCategory}`
        )
    )?.length;

    if (!check) return { message: "Ошибка (1)" };
    if (check < count) return { message: "Ошибка (2)" };
    if (round(count * acc.price) < 10) return { message: "Минимальная покупка 10 руб." };

    var { lastID } = await db.run(`
        INSERT INTO buylast (title,idCategory, colVo, price,priceOne, email, status, date) 
        VALUES ('${acc.title}',${acc.idCategory}, ${count}, ${round(count * acc.price)},${
        acc.price
    }, '${mail}', 'Производится оплата', '${new Date()}')
    `);

    return {
        succes: true,
        url: `https://pay.freekassa.ru/?m=${2410}&oa=${round(
            count * acc.price
        )}&o=${lastID}&s=${md5(
            `${2410}:${round(count * acc.price)}:${"olE3KaN?8XN=yHf"}:RUB:${lastID}`
        )}&currency=RUB&us_url=shopacc&us_domen=ru&us_email=${md5(mail)}`,
    };
};
const round = (num) => Math.round(Number(num) * 100) / 100;
const validateEmail = async (email) => {
    const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
export const acceptbuyAcc = async (orderid, emailHash) => {
    var getOrder = await db.get(
        `SELECT email, status, title, priceOne,idCategory,colVo, id FROM buylast WHERE id = ${orderid}`
    );
    console.log(
        !getOrder,
        md5(getOrder.email) != emailHash,
        getOrder.status != "Производится оплата"
    );
    if (!getOrder) {
        console.log("Заказ не найден (1)");
        return;
    }
    if (md5(getOrder.email) != emailHash) {
        console.log("Заказ не найден (2)");
        return;
    }
    //if (getOrder.status != 'Производится оплата') {console.log("Заказ уже был оплачен"); return}

    await db.run(`UPDATE buylast SET status = 'Оплачен' WHERE id = ${orderid}`);

    var getOrders = await db.all(
        `SELECT infoAccount, id FROM accounts WHERE titleAccount = '${getOrder.title}' AND price = ${getOrder.priceOne} AND idCategory = ${getOrder.idCategory} LIMIT ${getOrder.colVo}`
    );
    await db.run(
        `UPDATE accounts SET sold = 1, emailBuy = '${
            getOrder.email
        }', dataBuy = '${new Date()}' WHERE id IN (${getOrders
            .map((v) => v.id)
            .join(", ")})`
    );

    console.log(getOrder.id, "База данных обновлена");

    let result = await transporter.sendMail({
        from: '"Магазин аккаунтов" <shopacc91@yahoo.com>',
        to: getOrder.email,
        subject: "Покупка товара",
        text: "Спасибо за покупку в нашем магазине\n\nС уважением команда shop-acc.ru",
        attachments: [
            {
                filename: `Аккаунты.txt`,
                content: getOrders.map((v) => v.infoAccount).join("\n"),
            },
        ],
    });

    await db.run(
        `UPDATE buylast SET status = 'Отправлено и оплачено' WHERE id = ${orderid}`
    );

    console.log(getOrder.id, "Письмо отправлено", result);

    //return { message: "Заказ обновлен и отправлен к вам на почту" }
    //пушем поулчаем опалут и ставим статус что оплачено
};
var lastLoadAllAcc = 0;

export const deleteTovar = async (token, { Name }) => {
    if (token != responceCode) return "Вы обходите систему, ай ай ай :)";

    await db.run(`DELETE FROM accounts WHERE titleAccount = '${Name}'`);

    return { message: "Удалено" };
};
export const updateName = async (token, { oldName, newName }) => {
    if (token != responceCode) return "Вы обходите систему, ай ай ай :)";

    await db.run(
        `UPDATE accounts SET titleAccount = '${newName}' WHERE titleAccount = '${oldName}'`
    );

    return { message: "Обновлено" };
};
export const NextallAcc = async (token, next) => {
    if (token != responceCode) return "Вы обходите систему, ай ай ай :)";

    console.log(
        `SELECT * FROM accounts WHERE sold = 0 LIMIT ${
            next
                ? lastLoadAllAcc + 100
                : lastLoadAllAcc - 100 >= 0
                ? lastLoadAllAcc - 100
                : 0
        }, 100`
    );
    var allAcc = await db.all(
        `SELECT * FROM accounts WHERE sold = 0 LIMIT ${
            next
                ? lastLoadAllAcc + 100
                : lastLoadAllAcc - 100 >= 0
                ? lastLoadAllAcc - 100
                : 0
        }, 100`
    );

    lastLoadAllAcc = next
        ? allAcc.length > 0
            ? lastLoadAllAcc + 100
            : lastLoadAllAcc
        : lastLoadAllAcc - 100 >= 0
        ? lastLoadAllAcc - 100
        : 0;
    console.log(lastLoadAllAcc);

    return allAcc;
};
export const loginAdmin = async (login, pas, token) => {
    var login = login == _login && pas == pasword;
    if (login || token == responceCode) {
        var allAcc = await db.all("SELECT * FROM accounts WHERE sold = 0 LIMIT 100");
        lastLoadAllAcc = 100;
        return {
            succes: true,
            responceCode: responceCode,
            category: await db.all("SELECT * FROM category"),
            buylast: await db.all(
                `SELECT * FROM buylast WHERE status != 'Производится оплата' LIMIT 100`
            ),
            allAcc: allAcc,
        };
    } else return { succes: false };
};
export const loadnewItem = async (
    token,
    { idCategory, nameCat, urlFoto, name, tovar, price, desc }
) => {
    if (token != responceCode) return "Вы обходите систему, ай ай ай :)";

    idCategory = idCategory.trim();
    name = name.trim();
    tovar = tovar.trim();
    price = price.trim();
    desc = desc.trim();

    if (idCategory == -1) {
        nameCat = nameCat.trim();
        urlFoto = urlFoto.trim();
        if (!nameCat || !urlFoto || !name || !tovar || isNaN(price))
            return "Не правильный формат";
    } else if (!name || !tovar || isNaN(price)) return "Не правильный формат";

    if (idCategory == -1 && urlFoto)
        idCategory = (
            await db.run(
                `INSERT INTO category (title,urlPhoto) VALUES ( '${nameCat}','${urlFoto}')`
            )
        ).lastID;

    tovar = tovar
        .split("\n")
        .map((v) => `(${idCategory},'${name}','${price}', '${v}', '${desc}')`);

    await db.run(
        `INSERT INTO accounts (idCategory,titleAccount,price,infoAccount, desc) VALUES ${tovar}`
    );

    await updateColvo();
    return "Товар успешно добавлен";
};
