import { ICommands } from '../../Interface/ICommands';
export function commandJSONFileOutput(jsonSource?: string) {
    let src;
    if (jsonSource == undefined || jsonSource == '') {
        src = require(`../../json/allEnabled.json`);
    } else {
        src = require(jsonSource);
    }
    const commandOutput: ICommands = src;
    return commandOutput;
}
