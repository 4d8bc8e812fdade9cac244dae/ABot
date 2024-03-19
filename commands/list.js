module.exports = {
    name: 'list',
    aliases: ['playerlist', 'pl'],
    description: 'Shows the list of online players',
    usages: [
        {
            argument: null,
            executable: true,
            children: []
        }
    ],
    trust: 0,
    execute(context) {
        let component = []

        component.push('')
        component.push([
            {
                text: 'Players ',
                color: context.globalContext.config.colors.accent
            },
            {
                text: '(',
                color: 'dark_gray'
            },
            {
                text: `${context.client.tab.list.length}`,
                color: context.globalContext.config.colors.settings.good
            },
            {
                text: ')',
                color: 'dark_gray'
            },
            {
                text: '\n'
            }
        ])

        context.client.tab.list.forEach((player, index) => {
            component.push([
                '',
                {
                    text: '',
                    extra: [player.displayName !== undefined ? JSON.parse(player.displayName) : player.player.name]
                },
                {
                    text: ' \u203a ',
                    color: 'dark_aqua'
                },
                {
                    text: player.uuid,
                    color: context.globalContext.config.colors.types.string
                },
                {
                    text: context.client.tab.list.length === index + 1 ? '' : '\n'
                }
            ])
        })

        context.sendMessage.json(component)
    },
}