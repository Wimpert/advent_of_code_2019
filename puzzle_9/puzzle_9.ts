import { readFileToNumbers } from "../utils/utils";


enum OPERATION_CODE {
   ADD = 1,
   MULTIPLY = 2,
   INPUT = 3,
   OUTPUT = 4,
   JUMP_IF_TRUE = 5,
   JUMP_IF_FALSE = 6,
   LESS_THEN = 7,
   EQUALS = 8,
   ADJUST_RELATIVE_BASE = 9
}

enum PARAMETERMODE {
   POSITION,
   IMMEDIATE,
   RELATIVE  
}

export function solve(){
   const codes = readFileToNumbers('../puzzle_9/input.txt', ',');

   const result = execute(codes,[2],0);
 
   console.log(result);
}

const getParameter = (mode:PARAMETERMODE, codes : Array<number>, pointer:number, position: number, relativeBase: number): number => {
   switch (mode) {
      case PARAMETERMODE.POSITION:
         return readValueFromPosition(codes, readValueFromPosition(codes, pointer + position));
      case PARAMETERMODE.IMMEDIATE:
         return readValueFromPosition(codes, pointer + position);
      case PARAMETERMODE.RELATIVE:
         return readValueFromPosition(codes , relativeBase + readValueFromPosition(codes, pointer + position));
      default:
         throw new Error('unknown parameter mode')
   }
}

const getPosition = (mode:PARAMETERMODE, codes : Array<number>, pointer:number, position: number, relativeBase: number): number => {
   switch (mode) {
      case PARAMETERMODE.POSITION:
         return codes[pointer+position];   
      case PARAMETERMODE.RELATIVE:
         return codes[pointer+position] + relativeBase;   
      default:
            throw new Error('unknown position mode')
   }
}


const writeValueToPosition = (codes: Array<number>, value: number, position: number)  : Array<number>=> {
   if(codes.length > position){
      codes[position] = value;
      return codes
   } 
   const diff = position - codes.length;
   const newCodes= [...codes, ... new Array(diff).fill(0)]
   newCodes[position] = value;
   return newCodes;
 }

 const readValueFromPosition =  (codes: Array<number> , position: number) : number => codes[position] !== undefined ? codes[position] : 0; 

const  execute = (codes: Array<number>, inputs: Array<number>, pointer : number) : {output, codes : Array<number>, pointer: number, exitCode: number} => {
   let output ;
   let outputReached = false;
   let operationCode;
   let relativeBase  = 0;
   const outputBuffer = [];

   let it = 0;

   while(codes[pointer] !== 99 && !outputReached) {


   it++;
   //console.log(codes[pointer]);
   if(it === 1000000000){
      console.log("max iteration reached");
      outputReached = true;
   }
   

    const parametersModes = String(codes[pointer]).padStart(5,`0`).split('');
    operationCode = Number(parametersModes[3]+parametersModes[4]);
    const firstParameter = getParameter(Number(parametersModes[2]), codes, pointer, 1,relativeBase);// parametersModes[2] ==='0' ? codes[codes[pointer+1]] : codes[pointer+1];
    const secondParameter = getParameter(Number(parametersModes[1]), codes, pointer, 2, relativeBase);// parametersModes[1] ==='0' ? codes[codes[pointer+2]] : codes[pointer+2];
    let pointerIncrement = 4;
 
    if(operationCode === OPERATION_CODE.ADD){
       const result = firstParameter + secondParameter;
       const position = getPosition(Number(parametersModes[0]), codes, pointer, 3, relativeBase);
       codes = writeValueToPosition(codes, result, position);
    } else if(operationCode === OPERATION_CODE.MULTIPLY){
       const result = firstParameter * secondParameter;
       const position = getPosition(Number(parametersModes[0]), codes, pointer, 3, relativeBase);
       codes = writeValueToPosition(codes, result, position);
    } else if(operationCode === OPERATION_CODE.INPUT){
       let input = inputs.shift();
       if(input === undefined){
          input = output;
       }
      const position = getPosition(Number(parametersModes[2]), codes, pointer, 1, relativeBase);
      codes = writeValueToPosition(codes, input, position);
      pointerIncrement = 2;
   } else if(operationCode === OPERATION_CODE.OUTPUT){
      output = firstParameter // codes[codes[pointer + 1]];
      pointerIncrement = 2;
      console.log("output: ",output)
      outputBuffer.push(output);
   } else if(operationCode === OPERATION_CODE.JUMP_IF_TRUE){
      if(firstParameter){
         pointerIncrement = 0;
         pointer = secondParameter;
      } else {
         pointerIncrement = 3;
      }
   } else if(operationCode === OPERATION_CODE.JUMP_IF_FALSE){
      if(!firstParameter){
         pointerIncrement = 0;
         pointer = secondParameter;
      }else {
         pointerIncrement = 3;
      }
   } else if(operationCode === OPERATION_CODE.LESS_THEN){
      let value = firstParameter < secondParameter ? 1 : 0;
      const position = getPosition(Number(parametersModes[0]), codes, pointer, 3, relativeBase);
      codes = writeValueToPosition(codes, value, position);
   } else if(operationCode === OPERATION_CODE.EQUALS){
      let value = firstParameter === secondParameter ? 1 : 0;
      const position = getPosition(Number(parametersModes[0]), codes, pointer, 3, relativeBase);
      codes = writeValueToPosition(codes, value, position);
   } else if(operationCode === OPERATION_CODE.ADJUST_RELATIVE_BASE){
      relativeBase = relativeBase + firstParameter;
      pointerIncrement = 2;
   } else {
        throw new Error(`unknown operatoion: ${operationCode}, pointer: ${pointer}`)
    }
    pointer = pointer + pointerIncrement; 
}

return {output : outputBuffer, codes:[], pointer, exitCode :  codes[pointer] === 99 ?  codes[pointer] : operationCode};
}



