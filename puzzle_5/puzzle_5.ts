import { readFileToNumbers } from "../utils/utils";

export function solve(){
   const codes = readFileToNumbers('../puzzle_5/input.txt', ',');
   execute(codes);
}


function execute(codes: Array<number>) : Array<number>{
   let pointer = 0;
   let input = 5;
    
   while(codes[pointer] !== 99) {

   
    const parametersModes = String(codes[pointer]).padStart(5,`0`).split('');
    const operationCode = Number(parametersModes[3]+parametersModes[4]);
    const noun = parametersModes[2] ==='0' ? codes[codes[pointer+1]] : codes[pointer+1];
    const verb = parametersModes[1] ==='0' ? codes[codes[pointer+2]] : codes[pointer+2];
    const position = codes[pointer+3];
    console.log(parametersModes, noun, verb, position);
    let pointerIncrement = 4;
 
    if(operationCode === 1){
       codes[position] = noun + verb;
    } else if(operationCode === 2){
       codes[position] = noun * verb;
    } else if(operationCode === 3){
      codes[codes[pointer + 1]] = input;
      pointerIncrement = 2;
   } else if(operationCode === 4){
      const output = codes[codes[pointer + 1]];
      pointerIncrement = 2;
      console.log(output)
   } else if(operationCode === 5){
      if(noun){
         pointerIncrement = 0;
         pointer = verb;
         console.log('putting pointer to', verb);
      } else {
         pointerIncrement = 3;
      }
   } else if(operationCode === 6){
      if(!noun){
         pointerIncrement = 0;
         pointer = verb;
         console.log('putting pointer to', verb);
      }else {
         pointerIncrement = 3;
      }
   } else if(operationCode === 7){
      let value = noun < verb ? 1 : 0;
      console.log(`putting ${value} at ${position}`);
      codes[position] = value;
   } else if(operationCode === 8){
      let value = noun === verb ? 1 : 0;
      console.log(`putting ${value} at ${position}`);
      codes[position] = value;
   } else {
        throw new Error(`unknown operatoion: ${operationCode}`)
    }
    pointer = pointer + pointerIncrement; 
    console.log(pointer);
    // console.log(codes);
}
return codes;
}