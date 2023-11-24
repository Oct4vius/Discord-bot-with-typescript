import { Client } from "discord.js"
import fs from 'fs'
import ascii from 'ascii-table';

export const loadEvents = (client: Client) => {
    const table = new ascii().setHeading('Events', 'Status');
    const folders = fs.readdirSync('./dist/Events');

    for(const folder of folders){
        const files = fs.readdirSync(`./dist/Events/${folder}`).filter(((file) => file.endsWith('.js')));

        for(const file of files){
            const event = require(`../Events/${folder}/${file}`);
            if(event.rest){
                if(event.once)
                    client.rest.once(event.name, (...args) => 
                    event.execute(...args, client)
                    );
                else 
                    client.rest.on(event.name, (...args) => 
                    event.execute(...args, client)
                );
            } else {
                if(event.once)
                    client.rest.on(event.name, (...args) => 
                    event.execute(...args, client));
                else client.rest.on(event.name, (...args) => event.execute(...args, client)); 
            }
            table.addRow(file, 'loaded');
            continue;
        }
    }
    return console.log(table.toString(), '\nLoaded events');
}

module.exports = {loadEvents}