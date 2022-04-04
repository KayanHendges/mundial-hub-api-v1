// uma função para criar um delay de forma mais compacta e limpa com uma Promise

export default function sleep(milliseconds: number): Promise<void>{
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, milliseconds)        
    })
}