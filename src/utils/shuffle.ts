import { IPerson, IShufflerResult } from "../types/index.types";


export const shuffle = (data: IPerson): IShufflerResult => {
  const array = Object.entries(data).map((key) => key[1]);

  array.sort((v, v2) => v2.points - v.points);

  const result = Object.fromEntries(
    array.map((item, index) => [index + 1, item])
  );

  return result;
};
