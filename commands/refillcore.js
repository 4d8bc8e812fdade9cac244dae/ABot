module.exports = {
    name: 'rc',
    aliases: ['refillcore'],
    description: 'Refill\'s the bot\'s core',
    usages: [
        {
            argument: null,
            executable: true,
            children: []
        }
    ],
    trust: 0,
    execute(context) {
        context.client.core.move()
        context.sendMessage.ampersand('&aRefilling the core...')
    },
}