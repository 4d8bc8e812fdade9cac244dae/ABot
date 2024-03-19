let shouldReset = false

module.exports = (json) => {
    return fix(json)
}

function fix(json) {
    if (typeof json !== 'object') {
        json = {text: `${json}`} // somewhat failsafe
    }

    if (Array.isArray(json)) {
        let newArray = []

        json.forEach(item => {
            newArray.push(fix(item))
        })

        return newArray
    }

    const text = json.text
    const translate = json.translate
    const extra = json.extra
    const with_ = json.with
    const color = json.color

    const bold = json.bold
    const italic = json.italic
    const obfuscated = json.obfuscated
    const strikethrough = json.strikethrough
    const underlined = json.underlined
    const reset = json.reset
    const insertion = json.insertion

    const clickEvent = json.clickEvent
    const hoverEvent = json.hoverEvent
    
    let newJson = {}

    if (shouldReset === true) {
        newJson.reset = true
        shouldReset = false
    }

    if (clickEvent != undefined) {
        newJson.clickEvent = clickEvent
    } else {
        newJson.clickEvent = undefined
    }

    if (hoverEvent != undefined) {
        newJson.hoverEvent = hoverEvent
    } else {
        newJson.hoverEvent = undefined
    }

    if (insertion != undefined) {
        newJson.insertion = `${insertion}`
    } else {
        newJson.insertion = undefined
    }

    if (reset != undefined) {
        newJson.reset = true
    } else {
        newJson.reset = false
    }

    if (underlined != undefined) {
        newJson.underlined = true
        shouldReset = true
    } else {
        newJson.underlined = false
    }

    if (strikethrough != undefined) {
        newJson.strikethrough = true
        shouldReset = true
    } else {
        newJson.strikethrough = false
    }

    if (obfuscated != undefined) {
        newJson.obfuscated = true
        shouldReset = true
    } else {
        newJson.obfuscated = false
    }

    if (italic != undefined) {
        newJson.italic = true
        shouldReset = true
    } else {
        newJson.italic = false
    }

    if (bold != undefined) {
        newJson.bold = true
        shouldReset = true
    } else {
        newJson.bold = false
    }

    if (color == undefined) {
        newJson.color = 'white'
    } else {
        newJson.color = `${json.color}`
    }

    if (translate == undefined) {
        newJson.translate = undefined
    } else {
        newJson.translate = `${translate}`
    }

    if (text == undefined) {
        newJson.text = text
    } else {
        newJson.text = `${text}`
    }

    if (extra == undefined) {}
    else {
        if (typeof extra === 'object' && Array.isArray(extra)) {
            newJson.extra = []
            extra.forEach(item => {
                if (item.color === undefined) {
                    item.color = newJson.color
                }
                newJson.extra.push(fix(item))
            })
        }
    }

    if (with_ == undefined) {}
    else {
        if (Array.isArray(with_)) {
            newJson.with = []
            with_.forEach(item => {
                if (item.color === undefined) {
                    item.color = newJson.color
                }
                newJson.with.push(fix(item))
            })
        }
    }

    return newJson
}