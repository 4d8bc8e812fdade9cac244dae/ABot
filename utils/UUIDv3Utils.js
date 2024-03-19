module.exports = (username) => {
    const hash = require('crypto').createHash('md5').update(Buffer.from(username, 'utf-8')).digest('hex')
    return (
        hash.substring(0, 8) +
        '-' +
        hash.substring(8, 12) +
        '-3' +
        hash.substring(13, 16) +
        '-' +
        ((parseInt(hash.charAt(16), 16) & 0x3) | 0x8).toString(16) +
        hash.substring(17, 20) +
        '-' +
        hash.substring(20, 32)
    )
}