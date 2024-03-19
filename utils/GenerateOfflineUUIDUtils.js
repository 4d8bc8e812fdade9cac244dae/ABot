module.exports = (playerUsername) => {
    return require('./UUIDv3Utils')(`OfflinePlayer:${playerUsername}`)
}