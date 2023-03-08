import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
export function commandJSONFileOutput(jsonSource?: string) {
    let src;
    if (jsonSource == undefined || jsonSource == '') {
        src = require(`../../json/allEnabled.json`);
    } else {
        src = require(jsonSource);
    }
    const commandOutput: IInformationsFromJsonFile = src;
    return commandOutput;
}
