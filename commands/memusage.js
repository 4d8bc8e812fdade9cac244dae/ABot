module.exports = {
    name: 'memusage',
    aliases: ['memoryusage'],
    description: 'Send\'s the process\'s ram heap usage and heap total',
    usages: [
        {
            argument: null,
            executable: true,
            children: []
        }
    ],
    trust: 0,
    execute(context) {
        let useMib = false
        let value = useMib === true ? 1024 : 1000
        context.sendMessage.json(
            {
                color: context.globalContext.config.colors.accent,
                translate: `%s / %s M${useMib === true ? 'i' : ''}B`,
                with: [
                    {
                        text: (process.memoryUsage().heapUsed / value / value).toFixed(2),
                        color: context.globalContext.config.colors.main
                    },
                    {
                        text: (process.memoryUsage().heapTotal / value / value).toFixed(2),
                        color: context.globalContext.config.colors.main
                    }
                ]
            }
        )
    },
}