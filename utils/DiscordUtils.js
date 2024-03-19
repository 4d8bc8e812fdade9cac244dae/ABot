const Discord = require('discord.js')
const client = new Discord.Client({
    intents: [Object.keys(Discord.GatewayIntentBits)]
})

let channels = []

let timeout = 250

client.loggedIn = false

client.once('ready', () => {
    client.loggedIn = true

    setInterval(() => {
        channels.forEach(channel => {
            channel.timeLastMessage++

            if (channel.queue[0] && channel.timeLastMessage > timeout) {
                client.channels.cache.get(channel.id).send(channel.queue.join('\n').substring(0, 2000)) // substring to prevent exceptions
                channel.queue = []
                channel.timeLastMessage = 0
            }
        })
    }, 1)
})

module.exports = {
    getClient: () => {return client},
    sendMessage: (channelId, message) => {
        if (client.loggedIn === true) {
            try {
                if (channels.findIndex(item => item.id === channelId) === -1) channels.push({id: channelId, timeLastMessage: timeout, queue: []})
                const cl = channels.find(item => item.id === channelId)

                if (cl) {
                    cl.queue.push(message)
                }
            } catch (e) {}
        }
    },
    sendMessageInstantly: (channelId, message) => {
        client.channels.cache.get(channelId).send(`${message}`.substring(0, 2000))
    }
}