module.exports = {
    name: 'echo',
    aliases: ['say'],
    description: 'Makes the bot say the String after the command.',
    usages: [
        {
            argument: 'String',
            executable: true,
            children: []
        }
    ],
    trust: 0,
    execute(context) {
        context.client.chat(context.contextData.arguments.join(' '))
    },
}