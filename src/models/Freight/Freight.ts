import axios from "axios"
import { addHours, getTime } from "date-fns"
import { Response } from "express"
import convert from "xml-js"
import Connect from "../../database/Connect"

class Freight {

    async freteTray(params: any, res: Response){

        const date = getTime(addHours(new Date(), -3))
        
        const token = '31CE8132RBF94R471FR8A76RFFDA00C713FB'

        const query = `https://services.frenet.com.br/Logistics/tray.asmx/GetShippingQuote?token=${token}&cep=${params.cep}&cep_destino=${params.cep_destino}&envio=${params.envio}&num_ped=${params.num_ped}&prods=${params.prods}&session_id=${params.session_id}`

        const prods = params.prods.split(';')
        const productTime = this.getProductTime(parseInt(prods[6]), parseInt(prods[4]))

        axios.get(query).then(response => {
            const newDate = getTime(addHours(new Date(), -3))
            console.log('tempo de resposta Frenet', newDate - date)
        
            const json: any = convert.xml2js(response.data, {
                textKey: "text", 
                compact: true
             })
            
            if(json.cotacao.resultado.length > 0){
                if(params.token == 'scpneus' || params.token == 'mundialpneumaticos'){
                    getResponseTray(params, json, res)
                }
            } else {
                res.send(response.data)
            }

        })
        .catch(erro => {
            console.log(erro)
        })

        async function getResponseTray(params: any, json: any, res: Response): Promise<any>{

            if(parseInt(params.cep_destino) >= 89250001 && parseInt(params.cep_destino) <= 89269999){
                responseJaraguaDoSul(json, res)
            } else {
                responseBrasil(params, json, res)
            }

            function responseJaraguaDoSul(json: any, res: Response): any{
                const resultados = [
                    {
                        codigo: { text: '441' },
                        transportadora: { text: 'Normal' },
                        servico: { text: '' },
                        transporte: {},
                        valor: { text: '0.00' },
                        peso: { text: '15' },
                        prazo_min: { text: '1' },
                        prazo_max: { text: '3' },
                        imagem_frete: {
                          text: ''
                        }
                    },
                    {
                        codigo: { text: '442' },
                        transportadora: { text: 'Retirar' },
                        servico: { text: 'Centro - Jaraguá do Sul' },
                        transporte: {},
                        valor: { text: '0.00' },
                        peso: { text: '15' },
                        prazo_min: { text: '1' },
                        prazo_max: { text: '3' },
                        imagem_frete: {
                          text: ''
                        }
                    },
                    {
                        codigo: { text: '443' },
                        transportadora: { text: 'Centro de Montagem' },
                        servico: { text: 'Top Car Auto Center' },
                        transporte: {},
                        valor: { text: '0.00' },
                        peso: { text: '15' },
                        prazo_min: { text: '1' },
                        prazo_max: { text: '3' },
                        imagem_frete: {
                          text: ''
                        }
                    }
                ]

                json.cotacao.resultado = resultados

                

                const xml = convert.json2xml(json, {
                    compact: true,
                    ignoreComment: true,
                    textKey: "text", 
                    spaces: 0
                })
                
                res.send(xml)
            }

            async function responseBrasil(params: any, json: any, res: Response): Promise<any>{

                const validatedShippingList = await validateShippingList(json.cotacao.resultado)
                const cheapDelivery = validatedShippingList[0]
                const expressDelivery = getExpressDelivery(validatedShippingList)

                expressDelivery.transportadora.text = 'Expressa'
                expressDelivery.servico.text = ''
                expressDelivery.imagem_frete.text = ''

                cheapDelivery.transportadora.text = 'Normal'
                cheapDelivery.servico.text = ''
                cheapDelivery.imagem_frete.text = ''
                
                if(params.token == "mundialpneumaticos"){
                    cheapDelivery.valor.text = deliveryPrice(params, parseFloat(cheapDelivery.valor.text))
                }

                if(
                    cheapDelivery.codigo.text == expressDelivery.codigo.text ||
                    cheapDelivery.prazo_max.text == expressDelivery.prazo_max.text
                    ){
                    json.cotacao.resultado = [cheapDelivery]
                } else {
                    json.cotacao.resultado = [cheapDelivery, expressDelivery]
                }

                const xml = convert.json2xml(json, {
                    compact: true,
                    ignoreComment: true,
                    textKey: "text", 
                    spaces: 0
                })

                const endDate = getTime(addHours(new Date(), -3))
                console.log('==== fim', endDate - date, '===============')
                res.send(xml)
            }

            async function validateShippingList(shippingList: any[]): Promise<any>{
                const list: any[] = []

                const postDay = 1
                const productionTime = await productTime

                shippingList.map(shipping => {
                    if(shipping.transportadora.text == "Rodonaves"){
                        shipping.prazo_min.text = (parseInt(shipping.prazo_min.text)+postDay+2).toString()
                        shipping.prazo_max.text = (parseInt(shipping.prazo_max.text)+productionTime).toString()
                    } else {
                        shipping.prazo_min.text = (parseInt(shipping.prazo_min.text)+postDay).toString()
                        shipping.prazo_max.text = (parseInt(shipping.prazo_max.text)+postDay+productionTime).toString()
                    }
                    list.push(shipping)
                })

                return list
            }

            function deliveryPrice(params: any, price: any): any{
                const freeShippingRange = [
                    {
                        minimumPrice: 1200,
                        states: [
                            {
                                name: "SC",
                                start: 88000000,
                                end: 89999999
                            }
                        ]
                    },
                    {
                        minimumPrice: 1800,
                        states: [
                            {
                                name: "PR",
                                start: 80000000,
                                end: 87999999
                            },
                            {
                                name: "SP",
                                start: 1000000, // 01000000
                                end: 19999999
                            },
                            {
                                name: "RS",
                                start: 90000000,
                                end: 99999999
                            },
                        ]
                    },
                    {
                        minimumPrice: 2400,
                        states: [
                            {
                                name: "RJ",
                                start: 20000000,
                                end: 28999999
                            },
                            {
                                name: "ES",
                                start: 29000000,
                                end: 29999999
                            },
                            {
                                name: "MG",
                                start: 30000000,
                                end: 39999999
                            },
                        ]
                    },
                    {
                        minimumPrice: 3100,
                        states: [
                            {
                                name: "DF1",
                                start: 70000000,
                                end: 72799999
                            },
                            {
                                name: "DF2",
                                start: 73000000,
                                end: 73699999
                            },
                            {
                                name: "GO1",
                                start: 72800000,
                                end: 72999999
                            },
                            {
                                name: "GO2",
                                start: 73700000,
                                end: 76799999
                            },
                            {
                                name: "MS",
                                start: 79000000,
                                end: 79999999
                            },
                        ]
                    },
                ]

                var priceOrder = params.prods.split(";")
                priceOrder = parseFloat(priceOrder[7]) * parseFloat(priceOrder[4])

                var shippingPrice = price
                var indexRule = -1

                freeShippingRange.map((rule, index) => {
                    if(priceOrder >= rule.minimumPrice){
                        indexRule = index
                    } 
                })

                if(indexRule > -1){
                    freeShippingRange.map((range, index) => {
                        if(index <= indexRule){
                            freeShippingRange[index].states.map(state => {
                                if(parseFloat(params.cep_destino) >= state.start && parseFloat(params.cep_destino) <= state.end){
                                    shippingPrice = 0
                                }
                            })
                        }
                    })
                    
                }

                return shippingPrice
            }

            function getExpressDelivery(deliveryList: any[]): any{
                
                const sortedList = deliveryList.sort(function (a, b) {
                    if (parseFloat(a.prazo_max.text) > parseFloat(b.prazo_max.text)) {
                      return 1;
                    }
                    if (parseFloat(a.prazo_max.text) < parseFloat(b.prazo_max.text)) {
                      return -1;
                    }
                    // a must be equal to b
                    return 0;
                });

                const fastShipping = sortedList[0]

                return fastShipping
            }
        }

    }

    async freteViaVarejo(params: any, res: Response){
        const cep = params.zipCode
        const skuId = params.skuId.split(",")
        const trayProductId = skuId[0]
        const amount = skuId[1]
        var getProduct = false

        const medidas = await getDimensions(trayProductId, amount).then(response => {
            if(response.success == false){
                return getProduct
            } else {
                getProduct = true
                return response
            }
        })

        if(getProduct){
            const query = `https://services.frenet.com.br/Logistics/tray.asmx/GetShippingQuote?token=31CE8132RBF94R471FR8A76RFFDA00C713FB&cep=89251580&cep_destino=${cep}&envio=${1}&num_ped=${1}&prods=${medidas}&session_id=pa0rgb13sa9mogb3mdegn6scb6`
    
            axios.get(query)
            .then(response => {
                console.log('======== fim ViaVarejo =================')
                res.json(xmlToJson(response.data, trayProductId))
                console.log(xmlToJson(response.data, trayProductId))
            })
            .catch(erro => console.log(erro))
        } else {
            res.json({code: 400})
        }


        async function getDimensions(id: any, amount: any): Promise<any>{
            return new Promise((resolve, reject) => {
                const sql = `SELECT p.length, p.width, p.height, p.weight, t.tray_price, t.tray_promotional_price FROM produtos p JOIN tray_produtos t ON p.hub_id=t.hub_id WHERE t.tray_product_id=${id} AND t.tray_store_id=668385`
    
                Connect.query(sql, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        if(resultado.length > 0){
                            resolve([
                                (resultado[0].length/100),
                                (resultado[0].width/100),
                                (resultado[0].height/100),
                                (
                                    resultado[0].length/100*
                                    resultado[0].width/100*
                                    resultado[0].height/100
                                ),
                                amount,
                                (resultado[0].weight/1000),
                                id,
                                hasPromotionalPrice(resultado[0])
                            ].join(';'))
                        } else {
                            resolve({success: false})
                        }
                    }
                })
            })

            function hasPromotionalPrice(resultado: any): any{
                if(resultado.tray_promotional_price > 0){
                    return resultado.tray_promotional_price * 1.17 // comissão VV
                } else {
                    return resultado.tray_price * 1.17 // comissão VV
                }
            }
        }

        function xmlToJson(xml: any, trayProductId: any): any{

            const xmlSplitted = xml.split("<resultado>")

            var transportadora = xmlSplitted[1].split("<transportadora>")
            transportadora = transportadora[1].split("</")
            var valor = transportadora[2].split("<valor>")
            valor = valor [1]
            var prazo = transportadora[5].split("prazo_max>")
            prazo = prazo[1]
            transportadora = transportadora[0]

            return {
                freightAdditionalInfo: transportadora,
                freights: [
                    {
                        skuIdOrigin: trayProductId.toString(),
                        quantity: 1,
                        freightAmount: parseFloat(valor),
                        freightType: "NORMAL",
                        deliveryTime: parseInt(prazo)
                    }
                ],
                sellerMpToken: "pgUQJbjxJ03o"
            }
        }
    }

    async getProductTime(trayId: number, quantity: number){
        
        const providerId = await getProvider(trayId, quantity)
        console.log(providerId, quantity)

        if(providerId == 1){ // local
            return 0
        }

        if(providerId == 2){ // Luper
            return 1
        }

        if(providerId == 3){ // Roddar
            return 4
        }

        if(providerId == 4){ // Duncan
            return 1
        }

        return 4

        async function getProvider(trayId: number, quantity: number): Promise<number>{
            return new Promise(resolve => {

                const sql = `SELECT pp.provider_id
                FROM tray_produtos tp JOIN providers_products pp ON tp.hub_id = pp.hub_id
                JOIN providers pv ON pp.provider_id = pv.provider_id
                WHERE pp.product_stock >= ${quantity} AND tp.tray_product_id = ${trayId}
                ORDER BY pp.provider_id ASC LIMIT 0,1`

                Connect.query(sql, (erro, resultado: any[]) => {
                    if (erro) {
                        console.log(erro)
                        resolve(0)
                    } else {
                        if(resultado.length > 0){
                            resolve(resultado[0].provider_id)
                        } else {
                            resolve(0)
                        }
                    }
                })

            })
        }
                
    }

}

export default new Freight