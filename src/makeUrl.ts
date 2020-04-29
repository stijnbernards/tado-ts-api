
interface Parameters {
    [key: string]:  string
}

export default function makeUrl(uri: string, params: Parameters) {
    return Object.keys(params).reduce((acc, key) => {
        return uri.replace(key, params[key])
    }, uri)
}
