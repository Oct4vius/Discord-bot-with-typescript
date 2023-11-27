import fs from 'fs'
import path from 'path'

export const getAllFiles = (directory: string, foldersOnly: boolean = false) => {
    let filesNames: string[] = []

    const files = fs.readdirSync(directory, {withFileTypes: true});
    
    for (const file of files){
        const filePath = path.join(directory, file.name);

        if(foldersOnly){
            
            if(file.isDirectory()){
                filesNames.push(filePath)
            }
        } else {

            if(file.isFile()) {
                filesNames.push(filePath);
            }
        }
    }

    return filesNames;
}

