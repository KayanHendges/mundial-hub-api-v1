import axios from "axios"
import { addHours, differenceInMinutes, format, parseISO, startOfYesterday } from "date-fns"
import Connect from "../../database/Connect"
import { prismaClient } from "../../database/prismaClient";
import Requests from "../Tray/Requests"

interface ICredentialsTray {
    credential_id: number;
    consumer_key: string;
    consumer_secret: string;
    code: string;
    tray_adm_user: string;
    store: string;
    api_address: string;
    store_host: string;
    access_token: string;
    refresh_token: string;
    date_expiration_access_token: string;
    date_expiration_refresh_token: string;
    date_activated: string;
}

interface Store {
    id: number
    trayId: number
    name: string
    link: string
    apiAddress: string
    oAuth2Code: string
    accessToken: string | null
    refreshToken: string | null
    expirationAccessToken: Date | null
    expirationRefreshToken: Date | null
    tokenActivated: Date | null
    modified: Date | null
}

class OAuth2Tray {

    async tokenRoutine(){

        const stores = await getStores()
        await expiredTokens(stores)
        .then(response => {
            const date = addHours(new Date(), -3)
            console.log("verificações de tokens feitos", date)
        }) 

        setTimeout(() => {
            this.tokenRoutine()
        }, 1000 * 60 * 30) //30 minutos

        async function getStores(): Promise<Store[]>{
            return new Promise(async(resolve, reject) => {
                
                const stores = await prismaClient.store.findMany()

                resolve(stores)
            })
        }

        async function expiredTokens(stores: Store[]): Promise<void>{
            return new Promise((resolve, reject) => {

                const date = addHours(new Date(), -3)

                stores.map(store => {
                    if(!store.expirationAccessToken){
                        return
                    }
                    const differenceTime = differenceInMinutes(store.expirationAccessToken, date)
                    if(differenceTime < 31){
                        refreshToken(store)
                    }
                    console.log("loja", store.name, differenceTime, "minutos restantes")
                })
                resolve()
            })
        }

        async function refreshToken(store: Store): Promise<string>{
            return new Promise((resolve, reject) => {
                const query = `${store.apiAddress}/auth?refresh_token=${store.refreshToken}`
                Requests.saveRequest(query)
                
                axios.get(query)
                .then(async(response) => {
                    const tokenData = response.data

                    const sql = `UPDATE credenciais_tray SET access_token='${tokenData.access_token}', refresh_token='${tokenData.refresh_token}', date_expiration_access_token='${response.data.date_expiration_access_token}',
                    date_expiration_refresh_token='${response.data.date_expiration_refresh_token}', date_activated='${response.data.date_activated}' WHERE store=${tokenData.store_id}`

                    console.log(tokenData.date_activated, parseISO(tokenData.date_activated))

                    const update = await prismaClient.store.update({
                        where: { trayId: store.trayId },
                        data: {
                            accessToken: tokenData.access_token,
                            refreshToken: tokenData.refresh_token,
                            expirationAccessToken: parseISO(tokenData.date_expiration_access_token),
                            expirationRefreshToken: parseISO(tokenData.date_expiration_refresh_token),
                            tokenActivated: parseISO(tokenData.date_activated)
                        }
                    })   
                    
                    console.log(update)

                    resolve('sucesso')
                })
                .catch(erro => console.log(erro.response.data, store.refreshToken))
            })
        }

    }

    async getToken(storeId: any): Promise<any>{
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM credenciais_tray WHERE store=${storeId}`

            Connect.query(sql, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                } else {
                    resolve(resultado[0].access_token)
                }
            })
        })
    }

    async getStoreCredentials(storeId: number): Promise<ICredentialsTray>{
        return new Promise(async(resolve, reject) => {
            
            const store = await prismaClient.store.findFirst({
                where: { trayId: storeId }
            })

            if(!store){
                throw new Error(`Any store found with ${storeId} id`)
            }

            resolve({
                credential_id: store.id,
                consumer_key: "",
                consumer_secret: "",
                code: store.oAuth2Code,
                tray_adm_user: store.name,
                store: store.trayId.toString(),
                api_address: store.apiAddress,
                store_host: store.link,
                access_token: store.accessToken as string,
                refresh_token: store.refreshToken as string,
                date_expiration_access_token: format(store.expirationAccessToken as Date, 'yyyy-MM-ddThh:mm:ss:SSS'),
                date_expiration_refresh_token: format(store.expirationRefreshToken as Date, 'yyyy-MM-ddThh:mm:ss:SSS'),
                date_activated: format(store.tokenActivated as Date, 'yyyy-MM-ddThh:mm:ss:SSS'),
            })
        })
    }

}

export default new OAuth2Tray