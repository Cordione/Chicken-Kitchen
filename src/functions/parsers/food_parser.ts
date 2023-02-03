import { createRawArray } from '../../utils/createRawArray';
export function parse_food(sourceString: string) {

    const rawArray = createRawArray(sourceString);
    console.log(rawArray);
}

parse_food('./src/csv_files/food.csv');
