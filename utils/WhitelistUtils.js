const fs = require('fs')
const path = require('path').join(__dirname, '../data/whitelist.json')

module.exports = {
    get: (getFull) => {
        try {
            return JSON.parse(fs.readFileSync(path).toString())
        } catch (e) {
            return {}
        }
    },
    add: (name) => {
        let a = this.get(true)

        a.list.push(name)

        fs.writeFileSync(path, JSON.stringify(a))
    },
    clear: () => {
        let a = this.get(true)
        a.list = []
        fs.writeFileSync(path, JSON.stringify(a))
    }
}