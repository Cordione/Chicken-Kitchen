import * as fs from "fs";
function readCSVFile() {
  const matches = fs
    .readFileSync("./src/csv_files/customer_alergies.csv", {
      encoding: "utf-8",
    })
    .split("\r\n")
    .map((row: string): string[] => {
      return row.split(",");
    });
  console.log(matches);
}
readCSVFile();
