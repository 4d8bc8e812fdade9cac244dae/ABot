module.exports = {
    name: 'netmsg',
    aliases: [],
    description: 'Sends a message to all servers',
    usages: [
        {
            argument: null,
            executable: true,
            children: []
        }
    ],
    trust: 0,
    execute(context) {
        let fullName = context.client.tab.findPlayerUUID(context.contextData.uuid) ? context.client.tab.findPlayerUUID(context.contextData.uuid).displayName : undefined
        let usernameComponent = {}

        usernameComponent.text = fullName === undefined ? context.contextData.sender : ''
        if (fullName !== undefined) {
            usernameComponent.extra = [JSON.parse(fullName)]
        }
        usernameComponent.color = fullName === undefined ? context.globalContext.config.colors.accent : 'white'

        let json = {
            translate: '[%s] %s \u203a %s',
            color: 'dark_gray',
            with: [
                {
                    text: context.globalContext.serverConfig.private === true ? 'Private' : `${context.globalContext.options.host}:${context.globalContext.options.port}`,
                    color: context.globalContext.config.colors.accent
                },
                usernameComponent,
                {
                    text: '',
                    extra: [require('../utils/AmpersandColorUtils')(`${context.contextData.arguments.join(' ')}`)],
                    color: 'white'
                }
            ]
        }

        context.client.bots.forEach(client => {
            if (client !== undefined && !client.ended) {
                client.core.tellraw(json)
            }
        })
    },
}