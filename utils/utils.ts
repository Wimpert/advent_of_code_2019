const fs = require('fs');
const path = require("path");

export function readFile(location: string, splitter = '\n') : Array<string>{ 
    return fs.readFileSync(path.resolve(__dirname, location), 'utf8').split(splitter);
}

export function readFileToNumbers(location: string, splitter? : string) : Array<number>{ 
    return readFile(location, splitter).map(s => Number(s));
}