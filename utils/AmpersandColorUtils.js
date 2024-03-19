module.exports = generate

function generate(input) {
    const prefix = '&'
    let text = JSON.stringify(`${prefix}r${input}`).substring(1, JSON.stringify(`${prefix}r${input}`).length + -1)
    const regex = new RegExp(`${prefix}([0-9a-fklmnor]|#[0-9a-fA-F]{6})(.*?)(?=${prefix}([0-9a-fklmnor]|#[0-9a-fA-F]{6})|$)`, 'g')

    let invalidColors = [
        'obfuscated',
        'bold',
        'strikethrough',
        'underlined',
        'italic',
        'reset'
    ]

    let includesInvalidColors = false

    let matches = []
    const textMatchAll = [...text.matchAll(regex)]

    let previousItem = []
    
    textMatchAll.forEach(match => {
        const color = match[1]
        let returnValue = {}

        returnValue.text = JSON.parse(`"${match[0]}"`)
        .replace(new RegExp(`${prefix}#[0-9a-fA-F]{6}`, 'g'), '')
        .replace(new RegExp(`${prefix}[0-9a-folkmnr]`, 'g'), '')

        if (previousItem.length !== 0) {
            previousItem.forEach(item => {
                if (invalidColors.findIndex(element => element === item) !== -1) {
                    if (item !== 'reset') returnValue[item] = true
                } else {
                    if (item.startsWith('#')) {
                        returnValue.color = item.toUpperCase()
                    } else {
                        returnValue.color = item
                    }
                }
            })
        }

        if (color.startsWith('#')) {
            returnValue.color = color.toUpperCase()
            if (returnValue.text === '') previousItem.push(returnValue.color)
        } else if (invalidColors.findIndex(item => item === convert(color)) !== -1) {
            if (convert(color) !== 'reset') returnValue[convert(color)] = true
            if (returnValue.text === '' && convert(color) !== 'reset') previousItem.push(invalidColors.find(element => element === convert(color)))
            includesInvalidColors = true
        } else {
            returnValue.color = convert(color)
            if (returnValue.text === '') previousItem.push(returnValue.color)
        }

        if (returnValue.text !== '') {
            matches.push(returnValue)
            previousItem = []
        }
    })

    if (includesInvalidColors === true) {
        let newMatches = []

        newMatches.push('')

        matches.forEach(match => newMatches.push(match))

        matches = newMatches
    }

    return matches.length === 1 ? matches[0] : matches
}

function convert(colorCode) {
    let currentColor = ''
    switch (colorCode) {
        case '0':
            currentColor = 'black'
            break
        case '1':
            currentColor = 'dark_blue'
            break
        case '2':
            currentColor = 'dark_green'
            break
        case '3':
            currentColor = 'dark_aqua'
            break
        case '4':
            currentColor = 'dark_red'
            break
        case '5':
            currentColor = 'dark_purple'
            break
        case '6':
            currentColor = 'gold'
            break
        case '7':
            currentColor = 'gray'
            break
        case '8':
            currentColor = 'dark_gray'
            break
        case '9':
            currentColor = 'blue'
            break
        case 'a':
            currentColor = 'green'
            break
        case 'b':
            currentColor = 'aqua'
            break
        case 'c':
            currentColor = 'red'
            break
        case 'd':
            currentColor = 'light_purple'
            break
        case 'e':
            currentColor = 'yellow'
            break
        case 'f':
            currentColor = 'white'
            break
        case 'k':
            currentColor = 'obfuscated'
            break
        case 'l':
            currentColor = 'bold'
            break
        case 'm':
            currentColor = 'strikethrough'
            break
        case 'n':
            currentColor = 'underlined'
            break
        case 'o':
            currentColor = 'italic'
            break
        case 'r':
            currentColor = 'reset'
            break
        default:
            currentColor = 'white'
            break
    }

    return currentColor
}