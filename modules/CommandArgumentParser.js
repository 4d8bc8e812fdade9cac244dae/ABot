/*
check utils/ErrorTablesParserUtils for a switch case for error codes
*/

module.exports = (client, context) => {
    client.commandParser = {} // init this for use

    client.commandParser.generic = (toParse, arguments) => {
        let args = arguments
        // move parseUsages to the client command parser so we have access to arguments without having to add arguments to the parseUsages function
        function parseUsages(usages) {
            if (usages.children) usages.children.forEach(usage => parseUsages(usage))
            switch (usages.argument) {
                case 'String':
                    try {
                        let stringValue = JSON.parse(args.join(' '))
                        return {
                            success: true,
                            value: stringValue,
                        }
                      } catch (error) {
                        return {
                            success: false,
                            error: 'INVALIDSTRING',
                        }
                    }
                default:
                    break
            }
        }

        //console.log(toParse)
        //console.log(args)

        // no arguments needed
        if (toParse.length === 1 && toParse[0].argument === null && toParse[0].executable === true) {
            if (args.length === 0) {
                return {
                    success: true
                }
            } else {
                return {
                    success: false,
                    error: 'TOOMANYARGS'
                }
            }
        }
        // arguments handler here (String, Int, Float, etc...)
        let shouldReturn = undefined
        toParse.forEach(usage => {
            console.log(parseUsages(usage))
            if (parseUsages(usage).success === true) shouldReturn = parseUsages(usage)
        })

        if (shouldReturn !== undefined) return shouldReturn

        return {
            success: false,
            error: 'PARSEFAIL'
        }
    }

    client.commandParser.isValid = (toCheck, arguments) => {
        try {
            if (client.commandParser.generic(toCheck, arguments).error === undefined) return true
            else return false
        } catch (e) {
            return false
        }
    }
}