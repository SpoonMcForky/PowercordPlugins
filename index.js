const { get } = require('powercord/http');
const { Plugin } = require('powercord/entities');

module.exports = class Detector extends Plugin {
    startPlugin() {
        powercord.api.commands.registerCommand({
            command: 'ip',
            aliases: ['l'],
            description: 'Searches an IP with https://ipapi.co',
            usage: '{c} [ip]',
            executor: this.apiCall.bind(this)
        });
    };

    pluginWillUnload() {
        powercord.api.commands.unregisterCommand('ip');
    };

    async apiCall(args) {
        const api = `https://ipapi.co/${args}/json/`
        console.log(api)
        async function getData(api) {
            const response = await fetch(api);
            return response.json();
        };
      
        const data = await getData(api);
        try {
            if (!args[0]) {
                return {
                    send: false,
                    result: 'Please enter an IP address.'
                }
            };
            let { ip, city, region, country, country_name, country_capital, country_population, postal, latitude, longitude, timezone, currency_name, } = data;
            if (!city) {
                const error = {
                    type: 'rich',
                    author: {
                        name: 'IP: ' + ip,
                    },
                    url: api,
                    color: 0x209cee,
                    description: 'Error: ' + `\`Invalid IP\``,
                    footer: {
                        text: `Data provided by https://ipapi.co/${args}/json/`
                    }
                };
                return {
                    send: false,
                    result: error
                };
            } else {
                const jsonData = ['City: ' + `\`${city}\``, 'Region: ' + `\`${region}\``, 'Country: ' + `\`${country}\``, 'Country Name: ' + `\`${country_name}\``, 'Country Capital: ' + `\`${country_capital}\``, 'Country Population: ' + `\`${country_population}\``, 'Postal Code: ' + `\`${postal}\``, 'Latitude: ' + `\`${latitude}\``, 'Longitude: ' + `\`${longitude}\``, 'Timezone: ' + `\`${timezone}\``, 'Currency: ' + `\`${currency_name}\``]

                const embed = {
                    type: 'rich',
                    author: {
                        name: 'IP: ' + ip,
                    },
                    url: api,
                    color: 0x209cee,
                    description: `${jsonData.join('\n')}`,
                    footer: {
                        text: `Data provided by https://ipapi.co/${args}/json/`
                    }
                };
                return {
                    send: false,
                    result: embed
                };
            }
        } catch (e) {
            console.log(e)
        };
    };
}
