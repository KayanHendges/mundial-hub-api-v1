import mysql from 'mysql'

const Connect = mysql.createPool({
    host: '162.240.24.27',
    port: 3306,
    user: 'mundialhub',
    password: 'Vps264080/Vps', 
    database: 'mundialh_mundial_hub'
})

export default Connect