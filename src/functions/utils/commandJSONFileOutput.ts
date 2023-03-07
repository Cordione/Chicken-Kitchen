import { ICommands } from '../../Interface/ICommands';
import * as commands from '../../json/allEnabled.json';
export function commandJSONFileOutput(jsonSource?: string) {
    let src;
    if (jsonSource == undefined || jsonSource == '') {
        src = require(`../../json/commands.json`);
    } else {
        src = require(jsonSource);
    }
    const commandOutput: ICommands = src;
    return commandOutput;
}
