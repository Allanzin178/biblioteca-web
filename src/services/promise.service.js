import db from "../database/dbConnect.js"

const promiseSql = ((query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, result) => {
            if(err) return reject(err)
            resolve(result)
        })
    })
})

export default promiseSql