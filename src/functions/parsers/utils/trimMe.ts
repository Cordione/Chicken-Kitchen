export function trimMe(singleLine: string[], endingIndex: number) {
    const innerArray: string[] = [];
    for (const row of singleLine) {
        innerArray.push(row.trim());
    }
    const secondToNColumn: string[] = [];
    for (let idx = 1; idx < singleLine.length - endingIndex; idx++) {
        secondToNColumn.push(innerArray[idx]);
    }
    return secondToNColumn;
}
