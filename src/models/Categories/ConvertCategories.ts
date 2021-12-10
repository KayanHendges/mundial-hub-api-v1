import Connect from "../../database/Connect"


class ConvertCategories {

    async hubMainCategoryToTray(id: any, store: any): Promise<any>{
        return new Promise(async(resolve) => {

            if(parseInt(store) == 668385){
                const sql = `SELECT tray_category_id FROM categorias WHERE hub_category_id=${id}`

                Connect.query(sql, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        if(resultado.length > 0) {
                            resolve(resultado[0].tray_category_id)
                        } else {
                            resolve(1)
                        }
                    }
                })
            }
            if(parseInt(store) == 1049898){
                const sql = `SELECT tray_scpneus_category_id FROM categorias WHERE hub_category_id=${id}`

                Connect.query(sql, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        if(resultado.length > 0) {
                            resolve(resultado[0].tray_scpneus_category_id)
                        } else {
                            resolve(2163)
                        }
                    }
                })
            }

        })
    }

    async trayMainCategoryToHub(id: any, store: any): Promise<any>{
        return new Promise(async(resolve) => {
            
            const sql = sqlStore()
            
            function sqlStore(): any  {
                if(parseInt(store) == 668385){
                    return `SELECT hub_category_id FROM categorias WHERE tray_category_id=${id}`
                }
                if(parseInt(store) == 1049898){
                    return `SELECT hub_category_id FROM categorias WHERE tray_scpneus_category_id=${id}`
                }
            }

            Connect.query(sql, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                } else {
                    if(resultado.length > 0){
                        resolve(resultado[0].hub_category_id)
                    } else {
                        resolve(0)
                    }
                }
            })
        })
    }

    async trayRelatedCategoriesToHub(array: any[], store: any): Promise<any>{
        return new Promise(async(resolve) => {

            const sql = sqlStore()
            
            function sqlStore(): any{
                if(parseInt(store) == 668385){
                    return `SELECT hub_category_id FROM categorias WHERE tray_category_id IN (${array.toString()}) ORDER BY hub_category_id ASC`
                }
                if(parseInt(store) == 1049898){
                    return `SELECT hub_category_id FROM categorias WHERE tray_scpneus_category_id IN (${array.toString()}) ORDER BY hub_category_id ASC`
                }
            }
        
            Connect.query(sql, (erro, resultado: any[]) => {
                if(erro){
                    console.log(erro)
                } else {
                    const resultList: any = []
                    resultado.map(result => {
                        resultList.push(result.hub_category_id)
                    })
                    resolve(resultList)
                }
            })
        })
    }

    async hubRelatedCategoriesToTray(array: any[], store: any): Promise<any>{
        return new Promise(async(resolve) => {

            if(parseInt(store) == 668385){
                const sql = `SELECT tray_category_id FROM categorias WHERE hub_category_id IN (${array.toString()}) ORDER BY tray_category_id ASC`

                Connect.query(sql, (erro, resultado: any[]) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        const resultList: any[] = []
                        resultado.map(result => {
                            resultList.push(result.tray_category_id)
                        })
                        resolve(resultList)
                    }
                })
            }
            if(parseInt(store) == 1049898){
                const sql = `SELECT tray_scpneus_category_id FROM categorias WHERE hub_category_id IN (${array.toString()}) ORDER BY tray_scpneus_category_id ASC`

                Connect.query(sql, (erro, resultado: any[]) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        const resultList: any[] = []
                        resultado.map(result => {
                            resultList.push(result.tray_scpneus_category_id)
                        })
                        resolve(resultList)
                    }
                })
            }
        })
    }

}

export default new ConvertCategories