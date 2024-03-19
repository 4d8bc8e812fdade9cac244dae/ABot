module.exports = {
    name: 'reconnect',
    aliases: ['recon'],
    description: 'Reconnects the bot',
    usages: [
        {
            argument: null,
            executable: true,
            children: []
        }
    ],
    trust: 0,
    execute(context) {
        context.bot.end('Reconnect command')
    },
}