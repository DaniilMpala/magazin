import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import ax from 'axios'
import cookie from 'cookie'

var db;
var _login = 'adminwer'
var pasword = "liqwedmafaz"
var responceCode = "n~[%Kgl4-x_4T<!)Ck;85$ft)2}NcVL%CppYnFMh{%H{]'XVvq]?^%Sf~zbVt5(j@'o,_T№KiD):qi,+B|jUDA№/eHC-LVcvR*4№]/$v.P+Ui@(%3aSCsttM_,Rma3IvB5>hzR7Jn/k35O(y+ThQ*>>&i_D#-Dm:X№s<v@7№$lBr)'13LwqS6F{RfZ}iG?#s.f8Pj>03~r>3e/vKal?CBo(Jc_-%}j*nz$[Cx>gKddNYFgxs9l$8w-#TdGXfSW29(V№k9[]LC~Lo4U[}=Nf#+OY354ZCJa1k)]Z#xoZ|_ZMY"

    (async () => {
        db = await open({
            filename: 'database.db',
            driver: sqlite3.Database
        })
    })()

export const loginAdmin = (login, pas, token) => {
    if(token == responceCode) return { succes: true, responceCode: responceCode }
    
    var login = login == _login && pas == pasword
    if (login) return { succes: login, responceCode: responceCode }
    else return { succes: login }
}
