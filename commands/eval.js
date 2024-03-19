const Runner = require('../utils/EvalUtils')

module.exports = {
    name: 'eval',
    aliases: [],
    description: 'Run javascript code',
    usages: [
        {
            argument: 'String',
            executable: true,
            children: []
        }
    ],
    trust: 0,
    execute(context) {
        new Runner(context.contextData.arguments.join(' ')).execute().then(result => {
            context.sendMessage.json([
                {
                    text: '[',
                    color: 'dark_gray',
                },
                {
                    text: 'Eval',
                    color: 'red',
                },
                {
                    text: ']',
                    color: 'dark_gray',
                },
                ' ',
                {
                    text: `${result}`,
                    color: 'gray'
                }
            ])
        }).catch(e => {
            context.sendMessage.json([
                {
                    text: '[',
                    color: 'dark_gray',
                },
                {
                    text: 'Eval',
                    color: 'red',
                },
                {
                    text: ']',
                    color: 'dark_gray',
                },
                ' ',
                {
                    text: e.message,
                    color: 'red'
                }
            ])
        })
    },
}