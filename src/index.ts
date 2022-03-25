import express from 'express';
import mainRouter from './routes/routes';
import Connect from './database/Connect';
import Tables from './database/Tables';
import cors from "cors"
import { addHours, format } from 'date-fns';
import bodyParser from 'body-parser';
import Routines from './models/Routines/Routines';

Connect.query('SELECT * FROM credenciais_tray', async(erro) => {
    if(erro){
        console.log(erro)
    } else {
        const tables = new Tables

        tables.init()
        const time = format(new Date(), 'yyyy-MM-dd HH:MM:SS')
        const date = addHours(new Date(), -3)
        
        const app = express()
        const port = 3001

        app.use(bodyParser.json())
        app.use(cors())
        app.use(mainRouter)

        app.listen(port, () => console.log(`${time} - Servidor rodando na porta ${port}`))

        Routines.startRoutine()
    }
})