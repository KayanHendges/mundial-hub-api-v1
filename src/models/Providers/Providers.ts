import Connect from "../../database/Connect"

interface IProvider {
    provider_id: number;
    provider_name: string;
}

interface IProviders {
    getAllProviders(): Promise<IProvider[]>
}

class Providers implements IProviders {
    
    async getAllProviders(){

        const providers = await getProviders()

        return providers
        
        async function getProviders(): Promise<IProvider[]>{
            return new Promise(resolve => {
                const sql = 'SELECT provider_id, provider_name FROM providers'

                Connect.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                    } else {
                        resolve(resultado)
                    }
                })
            })
        }
    }

}

export default Providers