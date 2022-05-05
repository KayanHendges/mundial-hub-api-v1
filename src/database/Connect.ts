import mysql from 'mysql'

const Connect = mysql.createPool({
    host: '3.136.243.230',
    port: 3306,
    user: 'prisma',
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