import mysql from 'mysql'

const Connect = mysql.createPool({
    host: '',
    port: 3306,
    user: '',
    password: '', 
    database: ''
})

export default Connect