export default function buildCategoryTree(resultado: any[]): any[]{ // prever erros caso não haja categorias
    let tree: any[] = []

    resultado.map(category => {
        if(category.tray_category_parent_id == 0){
            const children = ifChildren(category)
            category = {...category, children: children == null ? null : children.sort(compare)}
            tree.push(category)
        }
    })
    

    function parentList(id: any){
        let list: any[] = []

        function hasParent(id: number){
            resultado.map(category => {
                if(category.tray_category_id == id){
                    list.push(category.hub_category_id)
                    if(category.tray_category_parent_id != 0){
                        hasParent(category.tray_category_parent_id)
                    }
                }
            })
        }

        hasParent(id)

        return list.reverse()
    }

    function ifChildren(category: any): any[] | null{

        let childrens: any[] = []
        resultado.map(children => {
            if(children.tray_category_parent_id == category.tray_category_id) {
                childrens.push(
                    children = {
                        ...children,
                        parent_list_id: parentList(children.tray_category_parent_id),
                        children: ifChildren(children)
                        }
                    )
            }
        })

        if(childrens.length == 0){
            return null
        }  

        return childrens.sort(compare)
    }

    function compare(a: any, b: any): any{
        if(a.order_list > b.order_list){
            return 1
        }
        if(a.order_list < b.order_list){
            return -1
        }
        if(a.order_list == b.order_list){
            return 0
        }
    }
    return tree.sort(compare)
}