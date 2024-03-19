module.exports = {
    name: 'test',
    aliases: ['debug', 'whoami'],
    description: 'Tests if the bot is working.',
    usages: [
        {
            argument: null,
            executable: true,
            children: []
        }
    ],
    trust: 0,
    execute(context) {
        context.sendMessage.json(
            [
                {
                    color: context.globalContext.config.colors.accent,
                    translate: 'Username: %s',
                    with: [
                        {
                            text: context.contextData.sender,
                            color: context.globalContext.config.colors.main
                        }
                    ]
                },
                {
                    text: '\n'
                },
                {
                    color: context.globalContext.config.colors.accent,
                    translate: 'UUID: %s',
                    with: [
                        {
                            text: context.contextData.uuid,
                            color: context.globalContext.config.colors.main
                        }
                    ]
                },
                {
                    text: '\n'
                },
                {
                    color: context.globalContext.config.colors.accent,
                    translate: 'Prefix: %s',
                    with: [
                        {
                            text: context.contextData.moreInfo.prefix,
                            color: context.globalContext.config.colors.main
                        }
                    ]
                },
            ]
        )
    },
}