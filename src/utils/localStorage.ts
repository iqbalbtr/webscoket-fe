export function getLocalItem<T>(name: string, callback: (status: boolean, result?: T) => void){
    
    const get = window.localStorage.getItem(name);

    if(get === null) return callback(false);
    
    try {
        const parse: T = JSON.parse(get);
        return parse
    } catch (error) {
        return get;
    }
}