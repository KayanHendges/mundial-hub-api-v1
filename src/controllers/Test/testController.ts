import { request, Request, response, Response } from "express";
import TrayRequestsQueue from '../../services/Tray/RequestsQueue'

export default {

    async trayRequests(req: Request, res: Response){
    
        var totalMs = 0

        const started = new Date().getTime()

        // const newRequest = TrayRequestsQueue.newRequest()
        // .then(response => {
        //     return true
        // })
        // .catch(err => {
        //     res.status(400).json(err)
        //     return false
        // })

        const requests = []

        for (let index = 0; index < 10; index++) {
            requests.push(index+1)
        }

        // await Promise.all(requests.map(async(request) => {
        //     const started = new Date().getTime()
        //     await TrayRequestsQueue.newRequest().then(() => {
        //         console.log(`requisição ${request} levou ${new Date().getTime() - started}ms`)
        //     })

        // }))
        
        for(const request in requests){
            const started = new Date().getTime()
            await TrayRequestsQueue.newRequest().then(() => {
                console.log(`requisição ${request} levou ${new Date().getTime() - started}ms`)
            })
            setTimeout(() => {
                totalMs = totalMs + (new Date().getTime() - started)
                console.log(totalMs)
                return
            }, 0)
        }

        console.log(`esse processo levou ${new Date().getTime() - started} ms`)
        res.send('ok')

    }

}