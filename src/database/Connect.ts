import mysql from 'mysql'

const Connect = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Db264080Db', 
    database: 'mundialh_mundial_hub'
})

// const Connect = mysql.createPool({
//     host: '162.240.24.27',
//     port: 3306,
//     user: 'mundialh_prisma',
//     password: 'Db264080DbPrisma', 
//     database: 'mundialh_mundial_hub'
// })

export default Connect