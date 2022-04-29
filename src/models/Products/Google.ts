import convert from 'xml-js'

class Google {

    async xml(): Promise<string>{

        const json = {
            channel: {
                title: 'Santa Cruz Pneus',
                link: 'https://www.santacruzpneus.com.br',
                description: 'Integração Shopping Google',
                item: {
                    "g:id": '15171',
                    "title": 'PNEU 235/50R19 RANGETOUR SU027 HT 99V WANLI',
                    "link": 'https://www.santacruzpneus.com.br/pneus/pneu-23550r19-rangetour-su027-ht-99v-wanli?parceiro=7461',
                    "g:price": 'R$ 1.031,37',
                    "g:shipping_weight": '21 kg',
                    "description": 'Pneu 235/50r19 Rangetour Su027 Ht 99v Wanli wanli',
                    "g:brand": 'Wanli',
                    "g:google_product_category": {},
                    "g:image_link": 'https://images.tcdn.com.br/img/img_prod/1049898/pneu_235_50r19_rangetour_su027_ht_99v_wanli_15171_1_4b0407332d5fbbbc450fd0e297da1736.jpg',
                    "g:product_type": 'Pneus',
                    "g:availability": 'in stock',
                    "g:sale_price": 'R$ 928,23',
                    "g:sale_price_effective_date": '2021-12-20T00:00-03:00/2022-12-31T23:59-03:00',
                    "g:mpn": '6607',
                    "g:installment": {
                        "g:months": '12',
                        "g:amount": 'R$ 106,47'
                    },
                    "g:condition": 'new'
                }
            }
        }

        const xml = convert.js2xml(json, {
            compact: true,
        })

        console.log('xml', xml)

        return xml
    }

}

export default new Google