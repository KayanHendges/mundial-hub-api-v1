import Connect from "./Connect"


interface ITables {
    init(request: Function): void;
}

class Tables implements ITables {
    init() {

        this.createProvider()
        this.createProviderProducts()
    }

    createProvider(){
        const sql = 'CREATE TABLE IF NOT EXISTS providers (provider_id INT NOT NULL AUTO_INCREMENT, provider_name VARCHAR(120), standart_costs FLOAT, cost_type VARCHAR(1), PRIMARY KEY (provider_id))'
        
        Connect.query(sql, (erro => {
            if(erro) {
                console.log(erro)
            } else {

            }
        }))
    }

    createProviderProducts(){
        const sql = 'CREATE TABLE IF NOT EXISTS providers_products (provider_product_id INT NOT NULL AUTO_INCREMENT, provider_id INT(9), product_reference INT(9), hub_id INT(9), product_name VARCHAR(200), product_brand VARCHAR(64), product_stock INT(9), product_price FLOAT(9), additional_costs VARCHAR(200), need_create INT(1), ignore_product INT(1), PRIMARY KEY(provider_product_id), FOREIGN KEY (provider_id) REFERENCES providers(provider_id))'
        
        Connect.query(sql, (erro => {
            if(erro) {
                console.log(erro)
            } else {

            }
        }))
    }

}

export default Tables