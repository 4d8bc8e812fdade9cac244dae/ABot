module.exports = (code) => {
    switch (code) {
        case 'TOOMANYARGS':
            return 'Too many arguments'
        case 'TOOLITTLEARGS':
            return 'Too little arguments'
        case 'PARSEFAIL':
            return 'Parsing the command failed'
        default:
            return undefined
    }
}