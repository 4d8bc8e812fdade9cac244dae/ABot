module.exports = {
    name: 'sus',
    aliases: ['randomchars'],
    description: 'IDK',
    usages: [
        {
            argument: null,
            executable: true,
            children: []
        }
    ],
    trust: 0,
    execute(context) {
        context.sendMessage.json(`${require('../utils/RandomStringUtilsAllChar')(20000)}`)
    },
}