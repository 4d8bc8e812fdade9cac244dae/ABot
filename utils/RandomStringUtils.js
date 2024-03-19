module.exports = (length, characters) => {
    let characterList = characters === undefined ? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' : characters
    let result = ''
    const l = length ? length : 0
  
    for (let i = 0; i < l; i++) {
        const randomIndex = Math.floor(Math.random() * characterList.length)
        result += characterList[randomIndex]
    }
  
    return result
}