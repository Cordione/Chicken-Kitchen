import * as fs from 'fs';
export function saveFile(data: string[]) {
    fs.writeFileSync('./src/reports/Restaurant.txt', data.join('\n'));
    return data;
}
