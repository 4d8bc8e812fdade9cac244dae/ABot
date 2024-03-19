module.exports = (client) => {
    let queue = []
    let queueTimer

    client._client.once('login', () => {
        queueTimer = setInterval(() => {
            if (queue && queue[0] !== undefined) {
                client._client.chat(queue[0].substring(0, 255)) // substring to prevent kicks from long messages
                queue.shift()
            }
        }, 100)
    })

    client.chat = (message) => {
        if (queue === undefined) return
        while (queue.length > 10) queue.shift()
        queue.push(message)
    }

    client._client.once('end', () => {
        queue = undefined
        if (queueTimer) clearInterval(queueTimer)
        queueTimer = undefined
    })
}