const fs = require('fs')
const path = require('path').join(__dirname, '../data/messagefilter.json')

module.exports = {
    get: () => {
        try {
            return JSON.parse(fs.readFileSync(path).toString())
        } catch {
            return []
        }
    },
    add: (name) => {
        let a = this.get()

        a.push(name)

        fs.writeFileSync(path, JSON.stringify(a))
    },
    clear: () => {
        fs.writeFileSync(path, JSON.stringify([]))
    }
}