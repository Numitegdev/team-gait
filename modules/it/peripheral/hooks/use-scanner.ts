"use client";

import { uploadScanner }
from "../services/scanner-service";

export function useScanner(){

  async function upload(

    peripheralId:number,

    file:File

  ){

    const text =
      await file.text();

    const json =
      JSON.parse(text);

  const { data, error } =
    await uploadScanner(
        peripheralId,
        json
    );

console.log("DATA");
console.log(data);

console.log("ERROR");
console.log(error);

if (error)
    throw error;

  }

  return{

    upload

  }

}