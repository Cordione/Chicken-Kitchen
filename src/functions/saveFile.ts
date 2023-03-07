import * as fs from 'fs';
export function saveFile(data: string[], whereShouldISaveIt: string) {
    fs.writeFileSync(whereShouldISaveIt, data.join('\n'));
    return data;
}
