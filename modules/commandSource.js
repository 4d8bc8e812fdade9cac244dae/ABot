module.exports = (client, config) => {
    let bot = client._client
    let commands = config.commands
    let chatParsers = config.chatParsers

    chatParsers.forEach(chatParser => {
        chatParser(
            {
                bot: bot,
                commands: commands,
                client: client,
                prefixes: config.config.config.prefixes
            }
        )
    })
}