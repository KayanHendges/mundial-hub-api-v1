import mysql from 'mysql'

const Connect = mysql.createPool({
    host: '162.240.24.27',
    port: 3306,
    user: 'mundialhub',
    password: 'Db264080/Db', 
    database: 'mundialh_mundial_hub'
})

export default Connect