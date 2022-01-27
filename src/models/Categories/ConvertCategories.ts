import Connect from "../../database/Connect"


class ConvertCategories {

    async hubMainCategoryToTray(id: number, store: number): Promise<number>{
        return new Promise(async(resolve) => {

            if(store == 668385){
                const sql = `SELECT tray_category_id FROM categorias WHERE hub_category_id=${id}`

                Connect.query(sql, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        if(resultado.length > 0) {
                            resolve(Math.floor(resultado[0].tray_category_id))
                        } else {
                            resolve(1)
                        }
                    }
                })
            }
            if(store == 1049898){
                const sql = `SELECT tray_scpneus_category_id FROM categorias WHERE hub_category_id=${id}`

                Connect.query(sql, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        if(resultado.length > 0) {
                            resolve(Math.floor(resultado[0].tray_scpneus_category_id))
                        } else {
                            resolve(2163)
                        }
                    }
                })
            }

        })
    }

    async trayMainCategoryToHub(id: number, store: number): Promise<number>{
        return new Promise(async(resolve) => {
            
            const sql = sqlStore()
            
            function sqlStore(): any  {
                if(store == 668385){
                    return `SELECT hub_category_id FROM categorias WHERE tray_category_id=${id}`
                }
                if(store == 1049898){
                    return `SELECT hub_category_id FROM categorias WHERE tray_scpneus_category_id=${id}`
                }
            }

            Connect.query(sql, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                } else {
                    if(resultado.length > 0){
                        resolve(Math.floor(resultado[0].hub_category_id))
                    } else {
                        resolve(0)
                    }
                }
            })
        })
    }

    async trayRelatedCategoriesToHub(array: number[], store: number): Promise<number[]>{
        return new Promise(async(resolve) => {

            const sql = sqlStore()
            
            function sqlStore(): any{
                if(store == 668385){
                    return `SELECT hub_category_id FROM categorias WHERE tray_category_id IN (${array.toString()}) ORDER BY hub_category_id ASC`
                }
                if(store == 1049898){
                    return `SELECT hub_category_id FROM categorias WHERE tray_scpneus_category_id IN (${array.toString()}) ORDER BY hub_category_id ASC`
                }
            }
        
            Connect.query(sql, (erro, resultado: any[]) => {
                if(erro){
                    console.log(erro)
                } else {
                    if(resultado.length > 0){
                        const resultList: number[] = []
                        resultado.map(result => {
                            resultList.push(Math.floor(result.hub_category_id))
                        })
                        resolve(resultList)
                    } else [
                        resolve([])
                    ]
                }
            })
        })
    }

    async hubRelatedCategoriesToTray(array: number[], store: number): Promise<number[]>{
        return new Promise(async(resolve) => {

            if(store == 668385){
                const sql = `SELECT tray_category_id FROM categorias WHERE hub_category_id IN (${array.toString()}) ORDER BY tray_category_id ASC`

                Connect.query(sql, (erro, resultado: any[]) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        if(resultado.length > 0){
                            const resultList: number[] = []
                            resultado.map(result => {
                                resultList.push(Math.floor(result.tray_category_id))
                            })
                            resolve(resultList)
                        } else {
                            resolve([])
                        }
                    }
                })
            }
            if(store == 1049898){
                const sql = `SELECT tray_scpneus_category_id FROM categorias WHERE hub_category_id IN (${array.toString()}) ORDER BY tray_scpneus_category_id ASC`

                Connect.query(sql, (erro, resultado: any[]) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        if(resultado.length > 0){
                            const resultList: number[] = []
                            resultado.map(result => {
                                resultList.push(Math.floor(result.tray_scpneus_category_id))
                            })
                            resolve(resultList)
                        } else {
                            resolve([])

                        }
                    }
                })
            }
        })
    }

}

export default new ConvertCategories