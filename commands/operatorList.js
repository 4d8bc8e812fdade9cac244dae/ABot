// client.ops.forEach

module.exports = {
    name: 'operatorList',
    aliases: ['ops', 'oplist'],
    description: 'Shows all operator players online',
    usages: [
        {
            argument: null,
            executable: true,
            children: []
        }
    ],
    trust: 0,
    execute(context) {
        let client = context.client
        let json = []

        client.ops.forEach((op, index) => {
            json.push(
                {
                    text: op,
                    color: context.globalContext.config.colors.main
                },
                {
                    text: index + 1 === client.ops.length ? '' : ', ',
                    color: context.globalContext.config.colors.accent
                }
            )
        })

        context.sendMessage.json(json)
    },
}