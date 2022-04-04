import { format } from 'date-fns';
import fs from 'fs';

class TrayRequestsQueue {

    async newRequest(requestInterval?: number): Promise<void>{
        return new Promise(async(resolve, reject) => {

            const interval = requestInterval? requestInterval : 340

            await waitToResolveLoop()
            await setLastRequest(new Date().getTime())
            resolve()

            function setLastRequest(time: number): Promise<void>{
                return new Promise((resolve, reject) => {
                    fs.writeFile('./src/services/Tray/lastRequest', time.toString(), {encoding: 'utf8'}, (erro) => {
                        if(erro){
                            console.log(erro)
                            reject(erro)
                        } else {
                            resolve()
                        }
                    })
                })
            }

            function getLastRequest(): Promise<number>{
                return new Promise((resolve, reject) => {
                    fs.readFile('./src/services/Tray/lastRequest', {encoding: 'utf8'}, (erro, result) => {
                        if(erro){
                            console.log(erro)
                            reject(erro)
                        } else {
                            resolve(parseInt(result))
                        }
                    })
                })
            }
                  
            function waitToResolveLoop(): Promise<void>{
                return new Promise(async(resolve, reject) => {
                    
                    const savedTime = await getLastRequest()
                    const elapsedTime = new Date().getTime() - savedTime
                    const remainingMs = interval - elapsedTime

                    if(remainingMs > 0){
                        setTimeout(() => {
                            resolve(waitToResolveLoop())
                        }, remainingMs);
                    } else {
                        resolve()
                    }
                })
            } 

            return
        })

    }

    async finishRequest(): Promise<void>{
        return new Promise(async(resolve, reject) => {

            await setLastRequest(new Date().getTime())
            resolve()

            function setLastRequest(time: number): Promise<void>{
                return new Promise((resolve, reject) => {
                    fs.writeFile('./src/services/Tray/lastRequest', time.toString(), {encoding: 'utf8'}, (erro) => {
                        if(erro){
                            console.log(erro)
                            reject(erro)
                        } else {
                            resolve()
                        }
                    })
                })
            }

            return
        })

    }
}

export default new TrayRequestsQueue