"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Connect_1 = __importDefault(require("../../database/Connect"));
const buildCategoryTree_1 = __importDefault(require("../../services/Categories/buildCategoryTree"));
const OAuth2Tray_1 = __importDefault(require("../Auth/OAuth2Tray"));
const Requests_1 = __importDefault(require("../Tray/Requests"));
class Categories {
    async listAll(res) {
        const sql = 'SELECT * FROM categorias';
        Connect_1.default.query(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro);
            }
            else {
                res.status(200).json((0, buildCategoryTree_1.default)(resultado));
            }
        });
    }
    async createCategory(values, res) {
        const MundialCredentials = await OAuth2Tray_1.default.getStoreCredentials(668385);
        const ScPneusCredentials = await OAuth2Tray_1.default.getStoreCredentials(1049898);
        const category = validateCategory(values);
        const responseMundial = await postTray(category, MundialCredentials);
        const responseScPneus = await postTray(category, ScPneusCredentials);
        if (responseMundial.success && responseScPneus.success) {
            await saveDB(category, responseMundial.id, responseScPneus.id).then(response => {
                if (response.success) {
                    res.status(201).json({
                        code: 201,
                        message: `categoria cadastrada com sucesso`
                    });
                }
            });
        }
        function validateCategory(category) {
            return {
                category_name: category.category_name,
                category_small_description: category.category_small_desc,
                category_description: category.category_description,
                category_title: category.category_title,
                category_slug: category.category_slug,
                order_list: category.order_list,
                has_acceptance_term: category.has_acceptance_term,
                acceptance_term: category.acceptance_term,
                category_meta_key: category.category_meta_key,
                category_meta_desc: category.category_meta_desc,
            };
        }
        async function postTray(values, store) {
            return new Promise((resolve, reject) => {
                const trayCategory = JSON.stringify({
                    Category: {
                        name: values.category_name,
                        description: values.category_description,
                        slug: values.category_slug,
                        order: values.order_list,
                        title: values.category_title,
                        small_description: values.category_small_description,
                        has_acceptance_term: values.has_acceptance_term,
                        acceptance_term: values.has_acceptance_term,
                        metatag: {
                            keywords: values.category_meta_key,
                            description: values.category_meta_key
                        },
                        property: []
                    }
                });
                const query = `${store.api_address}/categories/?access_token=${store.access_token}`;
                Requests_1.default.saveRequest(query);
                const config = {
                    method: 'post',
                    url: query,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: trayCategory
                };
                (0, axios_1.default)(config)
                    .then(response => {
                    console.log(response.data);
                    if (response.data.code == 201) {
                        resolve({ success: true, message: 'sucesso ao criar na Tray', id: response.data.id });
                    }
                    else {
                        console.log(response.data);
                        res.status(400).json({
                            code: 400,
                            message: `erro ao cadastrar categoria na ${store.tray_adm_user}`
                        });
                    }
                })
                    .catch(erro => {
                    console.log(erro.response.data.causes);
                    res.status(400).json({
                        code: 400,
                        message: `erro ao cadastrar categoria na ${store.tray_adm_user}`
                    });
                });
            });
        }
        async function saveDB(category, mundialId, scpneusId) {
            return new Promise(resolve => {
                const categoryObj = Object.assign(Object.assign({}, category), { tray_category_parent_id: 0, tray_scpneus_category_parent_id: 0, tray_category_id: mundialId, tray_scpneus_category_id: scpneusId });
                const sql = `INSERT INTO categorias SET ?`;
                Connect_1.default.query(sql, categoryObj, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: `erro ao se conectar ao banco de dados`
                        });
                    }
                    else {
                        resolve({ success: true });
                    }
                });
            });
        }
    }
    async createSubcategory(values, hubId, res) {
        const MundialCredentials = await OAuth2Tray_1.default.getStoreCredentials(668385);
        const ScPneusCredentials = await OAuth2Tray_1.default.getStoreCredentials(1049898);
        const parents = await getTrayParentsId(hubId);
        const category = validateCategory(values, parents);
        const responseMundial = await postTray(category, MundialCredentials);
        const responseScPneus = await postTray(category, ScPneusCredentials);
        if (responseMundial.success && responseScPneus.success) {
            await saveDB(category, responseMundial.id, responseScPneus.id).then(response => {
                if (response.success) {
                    res.status(201).json({
                        code: 201,
                        message: `categoria cadastrada com sucesso`
                    });
                }
            });
        }
        function getTrayParentsId(hubId) {
            return new Promise(resolve => {
                const sql = `SELECT tray_category_id, tray_scpneus_category_id FROM categorias WHERE hub_category_id=${hubId}`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: `erro ao se conectar ao banco de dados`
                        });
                    }
                    else {
                        resolve(resultado[0]);
                    }
                });
            });
        }
        function validateCategory(category, parents) {
            return {
                tray_category_parent_id: parents.tray_category_id,
                tray_scpneus_category_parent_id: parents.tray_scpneus_category_id,
                category_name: category.category_name,
                category_small_description: category.category_small_desc,
                category_description: category.category_description,
                category_title: category.category_title,
                category_slug: category.category_slug,
                order_list: category.order_list,
                has_acceptance_term: category.has_acceptance_term,
                acceptance_term: category.acceptance_term,
                category_meta_key: category.category_meta_key,
                category_meta_desc: category.category_meta_desc,
            };
        }
        async function postTray(values, store) {
            return new Promise((resolve, reject) => {
                const parentId = store.store == 668385 ? values.tray_category_parent_id : values.tray_scpneus_category_parent_id;
                const trayCategory = JSON.stringify({
                    Category: {
                        parent_id: parentId,
                        name: values.category_name,
                        description: values.category_description,
                        slug: values.category_slug,
                        order: values.order_list,
                        title: values.category_title,
                        small_description: values.category_small_description,
                        has_acceptance_term: values.has_acceptance_term,
                        acceptance_term: values.has_acceptance_term,
                        metatag: {
                            keywords: values.category_meta_key,
                            description: values.category_meta_key
                        },
                        property: []
                    }
                });
                const query = `${store.api_address}/categories/?access_token=${store.access_token}`;
                Requests_1.default.saveRequest(query);
                const config = {
                    method: 'post',
                    url: query,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: trayCategory
                };
                (0, axios_1.default)(config)
                    .then(response => {
                    if (response.data.code == 201) {
                        resolve({ success: true, message: 'sucesso ao criar na Tray', id: response.data.id });
                    }
                    else {
                        console.log(response.data);
                        res.status(400).json({
                            code: 400,
                            message: `erro ao cadastrar categoria na ${store.tray_adm_user}`
                        });
                    }
                })
                    .catch(erro => {
                    console.log(erro.response.data.causes);
                    res.status(400).json({
                        code: 400,
                        message: `erro ao cadastrar categoria na ${store.tray_adm_user}`
                    });
                });
            });
        }
        async function saveDB(category, mundialId, scpneusId) {
            return new Promise(resolve => {
                const categoryObj = Object.assign(Object.assign({}, category), { tray_category_id: mundialId, tray_scpneus_category_id: scpneusId });
                const sql = `INSERT INTO categorias SET ?`;
                Connect_1.default.query(sql, categoryObj, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: `erro ao se conectar ao banco de dados`
                        });
                    }
                    else {
                        resolve({ success: true });
                    }
                });
            });
        }
    }
    async editCategory(values, res) {
        const MundialCredentials = await OAuth2Tray_1.default.getStoreCredentials(668385);
        const ScPneusCredentials = await OAuth2Tray_1.default.getStoreCredentials(1049898);
        const category = validateCategory(values);
        await postTray(category, MundialCredentials);
        await postTray(category, ScPneusCredentials);
        const saveProduct = await saveDB(category);
        if (saveProduct.success) {
            res.status(200).json({
                code: 200,
                message: `categoria ${category.hub_category_id} salvo com sucesso`
            });
        }
        function validateCategory(category) {
            return {
                hub_category_id: category.hub_category_id,
                tray_category_id: category.tray_category_id,
                tray_scpneus_category_id: category.tray_scpneus_category_id,
                category_name: category.category_name,
                category_description: category.category_description,
                category_slug: category.category_slug,
                category_title: category.category_title,
                category_small_description: category.category_small_desc,
                has_acceptance_term: category.has_acceptance_term,
                acceptance_term: category.acceptance_term,
                category_meta_key: category.category_meta_key,
                category_meta_desc: category.category_meta_desc,
            };
        }
        async function postTray(category, store) {
            return new Promise(resolve => {
                const trayCategory = JSON.stringify({
                    Category: {
                        name: category.category_name,
                        description: category.category_description,
                        slug: category.category_slug,
                        order: category.order_list,
                        title: category.category_title,
                        small_description: category.category_small_description,
                        has_acceptance_term: category.has_acceptance_term,
                        acceptance_term: category.has_acceptance_term,
                        metatag: {
                            keywords: category.category_meta_key,
                            description: category.category_meta_desc
                        },
                        property: []
                    }
                });
                const trayId = store.store == 668385 ? category.tray_category_id : category.tray_scpneus_category_id;
                const query = `${store.api_address}/categories/${trayId}?access_token=${store.access_token}`;
                Requests_1.default.saveRequest(query);
                const config = {
                    method: 'put',
                    url: query,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: trayCategory
                };
                (0, axios_1.default)(config)
                    .then(response => {
                    if (response.data.code == 200) {
                        resolve({ success: true, message: 'sucesso ao salvar na Tray' });
                    }
                    else {
                        console.log(response.data);
                        res.status(400).json({ code: 400, message: `erro ao salvar na Tray ${store.tray_adm_user}` });
                    }
                })
                    .catch(erro => {
                    console.log(erro.response.data);
                    res.status(400).json({ code: 400, message: `erro ao salvar na Tray ${store.tray_adm_user}` });
                });
            });
        }
        async function saveDB(category) {
            return new Promise(resolve => {
                const sql = `UPDATE categorias SET ? WHERE hub_category_id=${category.hub_category_id}`;
                Connect_1.default.query(sql, category, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: `erro ao se conectar ao banco de dados`
                        });
                    }
                    else {
                        resolve({
                            success: true
                        });
                    }
                });
            });
        }
    }
    async deleteCategory(id, res) {
        const MundialCredentials = await OAuth2Tray_1.default.getStoreCredentials(668385);
        const ScPneusCredentials = await OAuth2Tray_1.default.getStoreCredentials(1049898);
        const trayId = await getTrayId(id);
        const trayIds = [trayId];
        await getChildrens(trayId);
        trayIds.sort(function (a, b) {
            if (parseInt(a.tray_category_id) > parseInt(b.tray_category_id)) {
                return -1;
            }
            if (parseInt(a.tray_category_id) < parseInt(b.tray_category_id)) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });
        const deleteMundial = await deleteTrayIds(trayIds, MundialCredentials);
        const deleteScPneus = await deleteTrayIds(trayIds, ScPneusCredentials);
        if (deleteMundial.success && deleteScPneus.success) {
            await deleteDB(trayIds).then(response => {
                if (response.success) {
                    res.status(200).json({
                        code: 200,
                        message: 'categorias excluídas com sucesso'
                    });
                }
            });
        }
        async function getTrayId(hubId) {
            return new Promise((resolve, reject) => {
                const sql = `SELECT hub_category_id, tray_category_id, tray_scpneus_category_id FROM categorias WHERE hub_category_id=${hubId}`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: `erro ao se conectar ao banco de dados`
                        });
                    }
                    else {
                        if (resultado.length > 0) {
                            resolve(resultado[0]);
                        }
                    }
                });
            });
        }
        async function getChildrens(trayId) {
            return new Promise(async (resolve, reject) => {
                const childrens = await getChildren(trayId);
                if (childrens.length > 0) {
                    var indexLength = [];
                    for (var i = 0; i < childrens.length; i++) {
                        indexLength.push(i);
                    }
                    for (var index in indexLength) {
                        trayIds.push(childrens[index]);
                        await getChildrens(childrens[index]);
                    }
                    resolve();
                }
                else {
                    resolve();
                }
            });
        }
        async function getChildren(trayId) {
            return new Promise((resolve, reject) => {
                const sql = `SELECT hub_category_id, tray_category_id, tray_scpneus_category_id FROM categorias WHERE tray_category_parent_id=${trayId.tray_category_id}`;
                Connect_1.default.query(sql, (erro, resultados) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: `erro ao se conectar ao banco de dados`
                        });
                    }
                    else {
                        resolve(resultados);
                    }
                });
            });
        }
        async function deleteTrayIds(array, store) {
            return new Promise(async (resolve, reject) => {
                const indexLength = [];
                for (var i = 0; i < array.length; i++) {
                    indexLength.push(i);
                }
                for (var index in indexLength) {
                    await deleteTray(array[index], store)
                        .then(response => {
                        if (response.success) {
                            return;
                        }
                        else {
                            res.status(400).json({
                                code: 400,
                                message: `Erro ao deletar a categoria ${array[i].hub_category_id} da loja ${store.tray_adm_user}`
                            });
                        }
                    });
                }
                resolve({ success: true });
            });
        }
        async function deleteTray(id, store) {
            return new Promise((resolve, reject) => {
                const trayId = store.store == 668385 ? id.tray_category_id : id.tray_scpneus_category_id;
                const query = `${store.api_address}/categories/${trayId}?access_token=${store.access_token}`;
                Requests_1.default.saveRequest(query);
                axios_1.default.delete(query)
                    .then(response => {
                    if (response.data.code == 200) {
                        resolve({ success: true });
                    }
                    else {
                        console.log(response.data);
                        res.status(400).json({
                            code: 400,
                            message: `erro ao deletar o tray id ${trayId} da loja ${store.tray_adm_user}`
                        });
                    }
                })
                    .catch(erro => {
                    console.log(erro.response.data);
                    res.status(400).json({
                        code: 400,
                        message: `erro ao deletar o tray id ${trayId} da loja ${store.tray_adm_user}`
                    });
                });
            });
        }
        async function deleteDB(array) {
            return new Promise((resolve, reject) => {
                const hubIds = array.map(id => {
                    return id.hub_category_id;
                });
                const sql = `DELETE from categorias WHERE hub_category_id IN (${hubIds})`;
                console.log(hubIds);
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: `erro ao se conectar ao banco de dados ao deletar`
                        });
                    }
                    else {
                        resolve({ success: true });
                    }
                });
            });
        }
    }
    async ProductCategories(res) {
        const categoriesList = await getCategoriesList();
        const categoriesTree = await (0, buildCategoryTree_1.default)(categoriesList);
        res.status(200).json({
            code: 200,
            categoriesList: categoriesList,
            categoriesTree: categoriesTree
        });
        async function getCategoriesList() {
            return new Promise(resolve => {
                const sql = `SELECT hub_category_id, tray_category_id, tray_category_parent_id, category_name, order_list FROM categorias ORDER BY order_list ASC`;
                Connect_1.default.query(sql, (erro, resultados) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({ code: 400, message: 'erro ao conectar-se ao banco de dados' });
                    }
                    else {
                        resolve(resultados);
                    }
                });
            });
        }
    }
    async updateCategoryOrder() {
        return new Promise(async (resolve, reject) => {
            const MundialCredentials = await OAuth2Tray_1.default.getStoreCredentials(668385);
            const ScPneusCredentials = await OAuth2Tray_1.default.getStoreCredentials(1049898);
            const categories = await getCategories();
            const categoriesTree = (0, buildCategoryTree_1.default)(categories);
            const sortedCategories = this.sortCategories(categoriesTree, false);
            const flatList = [];
            getFlatCategoriesList(sortedCategories);
            const ordenedFlatList = orderFlatList(flatList);
            const categoriesToUpdate = getCategoriesToUpdate(ordenedFlatList, categories);
            console.log(categoriesToUpdate.length);
            console.log(categoriesToUpdate.length);
            await this.updateOrder(categoriesToUpdate, MundialCredentials, ScPneusCredentials);
            resolve({ success: true });
            async function getCategories() {
                return new Promise((resolve, reject) => {
                    const sql = 'SELECT * from categorias';
                    Connect_1.default.query(sql, (erro, resultado) => {
                        if (erro) {
                            console.log(erro);
                        }
                        else {
                            resolve(resultado);
                        }
                    });
                });
            }
            function getFlatCategoriesList(categories) {
                categories.map(category => {
                    flatList.push(Object.assign(Object.assign({}, category), { children: [] }));
                    if (category.children != null) {
                        getFlatCategoriesList(category.children);
                    }
                });
                return;
            }
            function orderFlatList(list) {
                list.map((category, index) => {
                    category.order_list = index + 1;
                });
                return list;
            }
            function getCategoriesToUpdate(ordenedFlatList, oldList) {
                const returnList = [];
                ordenedFlatList.map(category => {
                    oldList.map(oldCategory => {
                        if (category.hub_category_id == oldCategory.hub_category_id) {
                            if (category.order_list != oldCategory.order_list) {
                                returnList.push(category);
                            }
                        }
                    });
                });
                return returnList;
            }
        });
    }
    async updateOrder(categories, MundialCredentials, ScPneusCredentials) {
        return new Promise(async (resolve, reject) => {
            var indexLength = [];
            var categoriesLength = categories.length;
            for (var i = 0; i < categoriesLength; i++) {
                indexLength.push(i);
            }
            for (var index in indexLength) {
                const updateMundial = await this.updateOrderTray(categories[index], MundialCredentials);
                const updateScPneus = await this.updateOrderTrayScPneus(categories[index], ScPneusCredentials);
                if (updateMundial && updateScPneus) {
                    await this.updateOderDB(categories[index]);
                }
            }
            resolve();
        });
    }
    async updateOrderTray(category, store) {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                console.log('update', category.category_name, category.order_list);
                const query = `${store.api_address}/categories/${category.tray_category_id}?access_token=${store.access_token}`;
                Requests_1.default.saveRequest(query);
                console.log(query);
                await axios_1.default.put(query, {
                    order: category.order_list
                })
                    .then(response => {
                    if (response.data.code == 200) {
                        resolve(true);
                    }
                    else {
                        console.log(response.data);
                        resolve(false);
                    }
                })
                    .catch(erro => {
                    console.log(erro.response.data);
                    resolve(false);
                });
            }, 400);
        });
    }
    async updateOrderTrayScPneus(category, store) {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                console.log('update', category.category_name, category.order_list);
                const query = `${store.api_address}/categories/${category.tray_scpneus_category_id}?access_token=${store.access_token}`;
                Requests_1.default.saveRequest(query);
                console.log(query);
                await axios_1.default.put(query, {
                    order: category.order_list
                })
                    .then(response => {
                    if (response.data.code == 200) {
                        resolve(true);
                    }
                    else {
                        console.log(response.data);
                        resolve(false);
                    }
                })
                    .catch(erro => {
                    console.log(erro.response.data);
                    resolve(false);
                });
            }, 400);
        });
    }
    async updateOderDB(category) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE categorias SET order_list=${category.order_list} WHERE hub_category_id=${category.hub_category_id}`;
            Connect_1.default.query(sql, (erro, resultado) => {
                if (erro) {
                    console.log(erro);
                }
                else {
                    setTimeout(() => {
                        resolve();
                    }, 10);
                }
            });
        });
    }
    sortCategories(categories, sort) {
        var sorted = categories;
        if (sort) {
            sorted.sort(function (a, b) {
                if (a.category_name > b.category_name) {
                    return 1;
                }
                if (a.category_name < b.category_name) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
        }
        sorted.map((category, index) => {
            category.order_list = index + 1;
            if (category.children != null) {
                category.children = this.sortCategories(category.children, true);
            }
        });
        return sorted;
    }
    flatCategoriesList(categories) {
        const list = [];
        categories.map(category => {
            list.push(Object.assign(Object.assign({}, category), { children: [] }));
            if (category.children != null) {
                list.push(this.flatCategoriesList(category.children));
            }
        });
        return list;
    }
}
exports.default = new Categories;
