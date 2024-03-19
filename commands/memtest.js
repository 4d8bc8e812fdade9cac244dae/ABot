let enabled = false
let interval

module.exports = {
    name: 'memtest',
    aliases: ['memorytest'],
    description: 'Send\'s the process\'s ram heap usage and heap total as an actionbar',
    usages: [
        {
            argument: null,
            executable: true,
            children: []
        }
    ],
    trust: 0,
    execute(context) {
        enabled = !enabled
        let useMib = false
        let value = useMib === true ? 1024 : 1000
        context.sendMessage.json(
            [
                {
                    text: `Memory action bar is now `,
                    color: context.globalContext.config.colors.accent
                },
                {
                    text: enabled === true ? 'enabled' : 'disabled',
                    color: enabled === true ? context.globalContext.config.colors.settings.enabled : context.globalContext.config.colors.settings.disabled,
                },
            ]
        )

        if (enabled) {
            interval = setInterval(() => {
                if (context.client === undefined || context.client.ended === true || context.client._client === undefined) {
                    if (interval) clearInterval(interval)
                    interval = undefined
                    return
                }
                context.client.core.run(`minecraft:title @a actionbar ${JSON.stringify(
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
                )}`)
            }, 50)
        } else {
            if (interval) clearInterval(interval)
            interval = undefined
        }
    },
}