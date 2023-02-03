export function trimMe(singleLine: string[]) {
    const innerArray: string[] = [];
    for (const row of singleLine) {
        innerArray.push(row.trim());
    }
    const secondToNColumn: string[] = [];
    for (let idx = 1; idx < singleLine.length; idx++) {
        secondToNColumn.push(innerArray[idx]);
    }
    return secondToNColumn;
}
