import { Client } from "discord.js";
import { getAllFiles } from '../utils/getAllFiles'
import path from "path";

export const eventHandler = (client: Client) => {
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);
    
    for (const eventFolder of eventFolders){
        const eventFiles = getAllFiles(eventFolder);

        const eventName: string | undefined = eventFolder.replace(/\\/g, '/').split('/').pop();

        if(!eventName) return console.log('Something is wrong :(')

        client.on(eventName, async (arg) => {
            for(const eventFile of eventFiles){
                const eventFunction = require(eventFile);
                await eventFunction(client, arg);
            }
        })

    }
}