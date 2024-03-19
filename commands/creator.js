module.exports = {
    name: 'creator',
    aliases: ['maker'],
    description: 'Tells you the creator of the bot',
    usages: [
        {
            argument: 'String',
            executable: true,
            children: []
        }
    ],
    trust: 0,
    execute(context) {
        context.sendMessage.json(
            [
                '',
                {
                    text: '',
                    extra: [context.globalContext.config.colors.botJSON]
                },
                {
                    text: ' was created by ',
                    color: context.globalContext.config.colors.accent
                },
                {
                    text: `${require('../private').BOT.CREATOR}`,
                    color: `${require('../private').BOT.CREATORCOLOR}` || context.globalContext.config.colors.accent
                }
            ]
        )
    },
}