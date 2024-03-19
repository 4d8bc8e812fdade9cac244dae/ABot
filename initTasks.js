module.exports = () => {
    const options = {
        configFileLocation: './config.js',
        defaultConfig: {
            config: {
                prefixes: [
                    'default '
                ],
                logMessages: true,
            },
            servers: [
                {
                    name: 'Example',
                    ip: 'example.com:1234',
                    discord: {
                        channelId: '1234567890'
                    }
                },
            ]
        }
    }

    const fs = require('fs')

    if (!fs.existsSync(options.configFileLocation)) {
        fs.writeFileSync(options.configFileLocation, `module.exports = ${JSON.stringify(options.defaultConfig)}`)
        console.log(`\x1B[33m[${
            new Date().toLocaleString()
        } WARN] No config file was located. Generated default config file. Please fill out the config, then run the index.js file again (node index)\x1B[0m`)
        process.exit(0)
    }
}