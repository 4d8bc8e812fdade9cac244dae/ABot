module.exports = {
    name: 'cb',
    aliases: ['core'],
    description: 'Runs a command in a command block as the bot',
    usages: [
        {
            argument: 'String',
            executable: true,
            children: []
        }
    ],
    trust: 0,
    execute(context) {
        context.client.core.run(context.contextData.arguments.join(' '))
    },
}