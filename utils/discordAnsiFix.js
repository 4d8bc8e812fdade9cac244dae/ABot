module.exports = (message) => {
    try {
        return preventAbuses(resetFix(fixNormalAnsi(fixRGBRegex(message))))
    } catch (e) {
        console.error(e.stack)
        return ''
    }
}

function resetFix(text) {
    const ansiRegex = /\x1b\[[0-9;]*[mGK]/g
    let match
    let lastIndex = 0
    let modifiedString = ''
    let lastAnsi = ''

    while ((match = ansiRegex.exec(text)) !== null) {
        const ansi = match[0]
        const textBefore = text.substring(lastIndex, match.index)

        if (ansi.includes('\x1b')) {
            lastAnsi += textBefore + ansi
        } else {
            modifiedString += lastAnsi + textBefore + '\x1b[0m' + ansi
            lastAnsi = ''
        }
        lastIndex = ansiRegex.lastIndex
    }

    modifiedString += lastAnsi + text.substring(lastIndex)
    return modifiedString
}

function fixNormalAnsi(message) {
    const ansilist = {
        "\x1B\[93m": "\x1B[33m", // Yellow
        "\x1B\[96m": "\x1B[36m", // Blue
        "\x1B\[94m": "\x1B[34m", // Discord Blue
        "\x1B\[90m": "\x1B[30m", // Dark Gray
        "\x1B\[91m": "\x1B[31m", // Light Red
        "\x1B\[95m": "\x1B\[35m", // Pink
        "\x1B\[92m": "\x1B\[32m", // Green
        "\x1B\[97m": "\x1B\[37m", // White
    }
    let i = message
  
    for (const ansi in ansilist) {
        if (ansilist.hasOwnProperty(ansi)) {
            i = i.replace(new RegExp(escapeRegExpChars(ansi), 'g'), ansilist[ansi])
  
            function escapeRegExpChars(text) {
                return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
            }
        }
    }
  
    return i
}

function fixRGBRegex(text) {
    const regex = /\u001b\[38;2;(\d+);(\d+);(\d+)m/g
  
    const convertedText = text.replace(regex, (match, r, g, b) => {
        const convertedCode = convertRGBToANSI(parseInt(r), parseInt(g), parseInt(b))
        return `\u001b[${convertedCode}m`
    })
  
    return convertedText
}

function convertRGBToANSI(r, g, b) {
    const lookupTable = [
        [0, 0, 0, 30], // Black
        [128, 0, 0, 31], // Red
        [0, 128, 0, 32], // Green
        [128, 128, 0, 33], // Yellow
        [0, 0, 128, 34], // Blue
        [128, 0, 128, 35], // Magenta
        [0, 128, 128, 36], // Cyan
        [192, 192, 192, 37], // Light Gray
        [128, 128, 128, 30], // Dark Gray
        [255, 0, 0, 31], // Light Red
        [0, 255, 0, 32], // Light Green
        [255, 255, 0, 33], // Light Yellow
        [0, 0, 255, 34], // Light Blue
        [255, 0, 255, 35], // Light Magenta
        [0, 255, 255, 36], // Light Cyan
        [255, 165, 0, 33], // Orange
        [255, 192, 203, 35], // Pink
        [128, 0, 128, 35], // Purple
        [0, 0, 0, 30], // Darker Black
        [64, 0, 0, 31], // Dark Red
        [0, 64, 0, 32], // Dark Green
        [64, 64, 0, 33], // Dark Yellow
        [0, 0, 64, 34], // Dark Blue
        [64, 0, 64, 35], // Dark Magenta
        [0, 64, 64, 36], // Dark Cyan
        [96, 96, 96, 0], // Medium Gray
        [0, 0, 0, 30], // Extra Black
        [64, 0, 64, 35], // Extra Magenta
        [0, 64, 64, 36], // Extra Cyan    
  
        [160, 120, 120, 31], // Light Red
        [120, 120, 160, 32], // Light Green
        [120, 160, 120, 36], // Light Blue
        [255, 251, 148, 33], // Light Yellow
        [159, 255, 139, 32], // Light Green
        [255, 160, 131, 31], // Peach
        [255, 137, 177, 35], // Pink
        [198, 137, 255, 35], // Purple
        [188, 255, 155, 32], // Lime
        [80, 160, 80, 32], // Dark Green
        [160, 80, 80, 31], // Dark Red
        [80, 80, 160, 34], // Dark Blue
        [230, 193, 76, 33], // Gold/Brown
  
        [170, 170, 170, 37], // Light Gray
        [85, 85, 85, 30], // Dark Gray
        [255, 255, 255, 37], // White
    ]
  
    let minDistance = Infinity
    let closestCode = 0
  
    for (const [lookupR, lookupG, lookupB, code] of lookupTable) {
        const distance = Math.sqrt((r - lookupR) ** 2 + (g - lookupG) ** 2 + (b - lookupB) ** 2)
        if (distance < minDistance) {
            minDistance = distance
            closestCode = code
        }
    }
  
    return closestCode
}

function preventAbuses(message) {
    return message.replaceAll('`', '\u200b`')
}