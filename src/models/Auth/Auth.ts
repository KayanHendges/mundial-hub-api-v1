import { addHours, differenceInSeconds } from "date-fns";
import { Response } from "express";
import Connect from "../../database/Connect";
import {sign} from "jsonwebtoken"
import { v4 } from "uuid";

interface IUser {
    name: string;
    refresh_token: string;
    expires_in: Date;
}

class Auth {

    async login(user: string, password: string, res: Response){
    
        console.log(user, password)

        const userResponse: any = await getUserDB(user, password)
        
        const refreshId = v4()
        const expiresIn = addHours(new Date(), 0)
        
        await saveRefreshTokenDB(userResponse.username, refreshId, expiresIn)

        const token = sign({}, "cf2dd495-ea1f-49cf-be17-52d23d900e71", {
            subject: "mundialpneumaticos",
            expiresIn: "14400s"
        })

        res.status(200).json({
            token: token,
            userResponse: {
                name: userResponse.name
            },
            refreshToken: {
                refreshId: refreshId,
                expiresIn: expiresIn
            }
        })        

        async function getUserDB(user: string, password: string): Promise<object>{
            return new Promise(resolve => {
                const sql = `SELECT name, username
                FROM users WHERE username like '${user}' AND password like '${password}'`

                Connect.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                    } else {
                        if(resultado.length > 0){
                            resolve(resultado[0])
                        } else {
                            res.status(401).json({
                                code: 401, 
                                message: 'Usuário e senha inválidos'
                            })
                        }
                    }
                })
            })
        }

        async function saveRefreshTokenDB(username: string, refreshId: string, expiresIn: any): Promise<void>{
            return new Promise(resolve => {
                const refreshToken = {
                    refresh_token: refreshId,
                    expires_in: addHours(expiresIn, 3),
                }

                const sql = `UPDATE users SET ? 
                WHERE username like '${username}'`

                Connect.query(sql, refreshToken, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                    } else {
                        resolve()
                    }
                })
            })
        }
        
    }

    async checkToken(name: string, res: Response){

        const user = await getUserDB(name)

        res.status(200).json({
            code: 200,
            userResponse: {
                name: user.name
            },
            refreshToken: {
                refreshId: user.refresh_token,
                expiresIn: user.expires_in
            }
        })

        async function getUserDB(name: string): Promise<IUser>{
            return new Promise(resolve => {
                const sql = `SELECT name, refresh_token, expires_in
                FROM users WHERE name like '${name}'`

                Connect.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                    } else {
                        if(resultado.length > 0){
                            resolve(resultado[0])
                        } else {
                            res.status(401).json({
                                code: 401, 
                                message: 'Usuário inválido'
                            })
                        }
                    }
                })
            })
        }
    }

    async refreshToken(name: string, refreshToken: string, res: Response){
        
        const refreshTokenDB = await getRefreshTokenDB(name, refreshToken)
        const expirationTime = differenceInSeconds(refreshTokenDB.expires_in, addHours(new Date(), -3))
        
        if (expirationTime > 0) {

            const token = sign({}, "cf2dd495-ea1f-49cf-be17-52d23d900e71", {
                subject: "mundialpneumaticos",
                expiresIn: "20s"
            })

            const refreshId = v4()
            const expiresIn = addHours(new Date(), 0)

            await saveRefreshTokenDB(refreshTokenDB.username, refreshId, expiresIn)

            res.status(200).json({
                code: 200,
                message: 'Token e refresh token atualizados',
                token: token,
                userResponse: {
                    name: refreshTokenDB.name
                },
                refreshToken: {
                    refreshId: refreshId,
                    expiresIn: expiresIn
                }
            })
        } else {
            res.status(401).json({
                code: 401,
                message: 'Refresh Token expirado'
            })
        }

        async function getRefreshTokenDB(name: string, refreshToken: string): Promise<any> {
            return new Promise(resolve => {
                const sql = `SELECT name, username, refresh_token, expires_in
                FROM users WHERE refresh_token like '${refreshToken}' AND name like '${name}'`

                Connect.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                    } else {
                        if(resultado.length > 0){
                            resultado[0].expires_in = addHours(resultado[0].expires_in, -3)
                            resolve(resultado[0])
                        } else {
                            res.status(401).json({
                                code: 401,
                                message: 'Refresh Token inválido'
                            })
                        }
                    }
                })
            })
        }

        async function saveRefreshTokenDB(username: string, refreshId:string, expiresIn: Date): Promise<void>{
            return new Promise(resolve => {
                const refreshToken = {
                    refresh_token: refreshId,
                    expires_in: addHours(expiresIn, 3),
                }

                const sql = `UPDATE users SET ? 
                WHERE username like '${username}'`

                Connect.query(sql, refreshToken, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                    } else {
                        resolve()
                    }
                })
            })
        }

    }
}

export default Auth