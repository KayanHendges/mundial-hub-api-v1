import { Response } from "express";
import Connect from "../../database/Connect";


class Page {

    async getById(id: number, res: Response){

        const category = await getCategory(id)

        res.status(200).json({
            code: 200,
            category: {
                hub_category_id: category.hub_category_id,
                tray_category_id: category.tray_category_id,
                tray_scpneus_category_id: category.tray_scpneus_category_id,
                category_name: category.category_name,
                category_description: category.category_description,
                category_slug: category.category_slug,
                category_title: category.category_title,
                category_small_desc: category.category_small_description,
                has_acceptance_term: category.has_acceptance_term,
                acceptance_term: category.acceptance_term,
                category_meta_key: category.category_meta_key,
                category_meta_desc: category.category_meta_desc
            }
        })

        async function getCategory(id: number): Promise<any>{
            return new Promise(resolve => {

                const sql = `SELECT hub_category_id, tray_category_id, tray_scpneus_category_id, category_name, category_description, category_slug, category_title, category_small_description, has_acceptance_term, acceptance_term, category_meta_key, category_meta_desc
                FROM categorias WHERE hub_category_id=${id}`

                Connect.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 200,
                            message: `Erro ao conectar no banco de dados`
                        })
                    } else {
                        if (resultado.length > 0) {
                            resolve(resultado[0])
                        } else {
                            res.status(400).json({
                                code: 400,
                                message: `Não foi encontrado nenhuma categoria com o hub_category_id ${id}`
                            })
                        }
                    }
                })
            })
        }

    }

}

export default Page