import * as fs from 'fs';
export async function saveFile(data: string[]) {
    await fs.writeFileSync('./src/reports/Restaurant.txt', data.join('\n'))
}
