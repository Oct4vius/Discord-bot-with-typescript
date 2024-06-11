import axios from "axios";
import { IPerson } from "../types/index.types";

const url = "https://random-list-project-default-rtdb.firebaseio.com";

export function shiftObjectOrder(obj: IPerson[]): IPerson[] {
  const arrObj = Object.values(obj)

  const fistHalf = arrObj.slice(0, arrObj.length / 2);
  const secondHalf = arrObj.slice(arrObj.length / 2, arrObj.length);

  const shuffledArray = [...shuffle(secondHalf as IPerson[]), ...shuffle(fistHalf as IPerson[])];

  const tempobj: Record<string, IPerson> = {}

  shuffledArray.forEach((item, index) => {
    tempobj[index] = item
  })

  axios.put(`${url}/people.json`, {
    ...tempobj,
  });

  return arrObj;
}

export const handleReset = async () => {
  const objToSend: Record<string, { name: string }> = {};

  const arr = [
    "Bryan",
    "Luima",
    "Nohemy",
    "Ezequiel",
    "Alan",
    "Miguel",
    "Anderson",
    "Lee",
    "Octavio",
    "Sami",
    "Jarvin",
    "Jochy",
    "Sahira",
    "Edwille",
    "Eliezer",
  ];

  arr.forEach((item, index) => {
    objToSend[`${index}${item}12`] = {
      name: item,
    };
  });

  const res = await axios.put(`${url}/people.json`, {
    ...objToSend,
  }).catch((err) => {
    return err;
  });

  return res;
};


function shuffle(arr: IPerson[]): IPerson[] {
      // Get the length of the array
      let n = arr.length;
      // Traverse the array from the last element to the first element
      for (let i = n - 1; i > 0; i--) {
          // Generate a random index from 0 to i
          const j = Math.floor(Math.random() * (i + 1));
          // Swap arr[i] with the element at the random index
          [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
}