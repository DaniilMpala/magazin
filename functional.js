import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import ax from 'axios'
import cookie from 'cookie'

var db;

(async () => {
    db = await open({
        filename: 'database.db',
        driver: sqlite3.Database
    })
})()

export const ioSet = () => {
    
}
