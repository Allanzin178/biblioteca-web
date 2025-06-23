import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'biblioteca'
})

db.connect((err) => {
    if (err) throw err
    console.log('Conectado ao banco!')
})


export default db