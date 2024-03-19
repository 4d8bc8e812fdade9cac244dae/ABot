module.exports = (client, context) => {
    // TODO: not hard code the messages / delays
    let disableAdvertising = context.serverConfig.disableAdvertising
    client.advertise = {}
    client.advertise.intervals = {
        discord: undefined,
        commands: undefined, // not used yet
    }

    client.advertise.messages = {
        discord: {
            text: '',
            extra: [require('../utils/AmpersandColorUtils')(`&7Join the &6&lABot &9&lDiscord &7at &9${context.config.config.discordInviteLink}&7!`)],
            hoverEvent: {
                action: 'show_text',
                value: [
                    {
                        text: 'Click to join the community!',
                        color: 'green'
                    }
                ]
            },
            clickEvent: {
                action: 'open_url',
                value: `${context.config.config.discordInviteLink}`
            }
        }
    }

    client.once('login', () => {
        if (disableAdvertising) return
        client.advertise.intervals.discord = setInterval(() => {
            client.core.tellraw(client.advertise.messages.discord)
        }, 180000)
    })

    client.once('end', () => {
        if (client.advertise.intervals.discord) clearInterval(client.advertise.intervals.discord)
        client.advertise.intervals.discord = undefined
    })
}