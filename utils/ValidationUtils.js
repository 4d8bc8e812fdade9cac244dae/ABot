const discord_role_name_trusts = {

}

module.exports = class Validator {
    constructor(context) {
        this.context = context
        this.parsed = {
            trust: {
                trusted: null,
                owner: null,
            }
        }
    }

    parse(type) {
        switch (type) {
            case 'discord':
                console.log(this.context.user)
                break
            default:
                break
        }
    }
}