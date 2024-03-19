module.exports = {
    name: 'getJson',
    aliases: [],
    description: 'Tests some regex magic thingy.',
    usages: [
        {
            argument: 'String',
            executable: true,
            children: []
        }
    ],
    trust: 0,
    execute(context) {
        let json = JSON.stringify(require('../utils/AmpersandColorUtils')(context.contextData.arguments.join(' ')))
        
        context.sendMessage.json(
            [
                '',
                {
                    text: json,
                    clickEvent: {
                        action: 'copy_to_clipboard',
                        value: json
                    },
                    hoverEvent: {
                        action: 'show_text',
                        value: {
                            text: 'Click to copy the generated JSON',
                            color: context.globalContext.config.colors.settings.good
                        }
                    }
                },
                {
                    text: '\n'
                },
                {
                    text: 'Example of JSON below:'
                },
                {
                    text: '\n'
                },
                {
                    text: '',
                    extra: [JSON.parse(json)]
                }
            ]
        )
    },
}