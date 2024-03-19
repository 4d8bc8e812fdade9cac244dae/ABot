module.exports = (length) => {
    return generate(length)
}

function generate(length) {
    const l = length ? length : 0
    let result = ''

    try {
        for (let i = 0; i < l; i++) {
            const characterList = '1234567890ABCDEF'
            let chars = ''
    
            for (let i = 0; i < 4; i++) {
                const char = characterList[Math.floor(Math.random() * characterList.length)]
                chars += char
            }

            result += JSON.parse(`"\\u${chars}"`)
        }
    } catch (e) {
        console.error(e.stack)
        return generate(length)
    }
  
    return result
}