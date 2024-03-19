const colorPalette = {
    PUBLIC: 'green',
    TRUSTED: 'red',
    OWNER: 'dark_red'
}

module.exports = {
    PUBLIC: 0,
    TRUSTED: 1,
    OWNER: 2,
    json: [
        {
            text: 'Public',
            color: colorPalette.PUBLIC
        },
        ' ',
        {
            text: 'Trusted',
            color: colorPalette.TRUSTED
        },
        ' ',
        {
            text: 'Owner',
            color: colorPalette.OWNER
        }
    ],
    arrayPermissions: [
        {
            value: 0,
            name: 'PUBLIC'
        },
        {
            value: 1,
            name: 'TRUSTED'
        },
        {
            value: 2,
            name: 'OWNER'
        }
    ],
    colorPalette: colorPalette
}