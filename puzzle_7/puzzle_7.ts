import { readFileToNumbers } from "../utils/utils";

export function solve(){
   const codes = readFileToNumbers('../puzzle_7/input_test.txt', ',');
  

   const sequences = [5,6,7,8,9];
   const combinations = generateCombinations(sequences);
   let currentMax = 0;
   let currentMaximumSeq;

   
   for(let combination of combinations){
      //let toThrusters = executeLoopBackProgram(codes, combination);
      let toThrusters = executeLoopBackProgram(codes, combination);

      //console.log(toThrusters);
      if(toThrusters > currentMax) {
         console.log("new max found:", toThrusters, currentMax);
         currentMaximumSeq = combination;
         currentMax = toThrusters;
      }
   }
   console.log("Solution: ", currentMaximumSeq, currentMax);

}

const  execute = (codes: Array<number>, inputs: [number,number], pointer : number) : {output: number, codes : Array<number>, pointer: number, exitCode: number} => {
   let output ;
   let outputReached = false;
   let operationCode;

   while(codes[pointer] !== 99 && !outputReached) {

   
    const parametersModes = String(codes[pointer]).padStart(5,`0`).split('');
    operationCode = Number(parametersModes[3]+parametersModes[4]);
    const firstParameter = parametersModes[2] ==='0' ? codes[codes[pointer+1]] : codes[pointer+1];
    const secondParameter = parametersModes[1] ==='0' ? codes[codes[pointer+2]] : codes[pointer+2];
    const position = codes[pointer+3];
    //console.log(parametersModes, firstParameter, secondParameter, position);
    let pointerIncrement = 4;
 
    if(operationCode === 1){
       codes[position] = firstParameter + secondParameter;
    } else if(operationCode === 2){
       codes[position] = firstParameter * secondParameter;
    } else if(operationCode === 3){
       let input = inputs.shift();
       if(input === undefined){
          input = output;
       }
       
       //console.log(` asking for input, proving: ${input}`);
      codes[codes[pointer + 1]] = input;
      pointerIncrement = 2;
   } else if(operationCode === 4){
      // console.log(`location : ${codes[pointer + 1]}, value at location: ${codes[codes[pointer + 1]]}`);
      output = codes[codes[pointer + 1]];
      pointerIncrement = 2;
      outputReached = true;
   } else if(operationCode === 5){
      if(firstParameter){
         pointerIncrement = 0;
         pointer = secondParameter;
         //console.log('putting pointer to', secondParameter);
      } else {
         pointerIncrement = 3;
      }
   } else if(operationCode === 6){
      if(!firstParameter){
         pointerIncrement = 0;
         pointer = secondParameter;
         //console.log('putting pointer to', secondParameter);
      }else {
         pointerIncrement = 3;
      }
   } else if(operationCode === 7){
      let value = firstParameter < secondParameter ? 1 : 0;
      //console.log(`putting ${value} at ${position}`);
      codes[position] = value;
   } else if(operationCode === 8){
      let value = firstParameter === secondParameter ? 1 : 0;
      //console.log(`putting ${value} at ${position}`);
      codes[position] = value;
   } else {
        throw new Error(`unknown operatoion: ${operationCode}`)
    }
    pointer = pointer + pointerIncrement; 
}

return {output, codes, pointer, exitCode : operationCode ? operationCode : codes[pointer]};
}


const generateCombinations = (sequences : Array<number>) : Array<Array<number>> => {
   let currentFoundCombinations = []
   if(sequences.length === 2 ) {
      return [[sequences[0], sequences[1]],[sequences[1], sequences[0]]];
   } else {
      for(let seq of sequences) {
         currentFoundCombinations = [ ... currentFoundCombinations , ... generateCombinations([...sequences].filter(el => el !== seq)).map((combinations) => [seq, ... combinations])];
      }
   }
   return [...currentFoundCombinations];
}   


const executeProgram = (codes: Array<number>, sequenceCombination : Array<number>) : number => {
   let input = 0;
   for (let seq of sequenceCombination){
      input = execute([...codes], [seq , input], 0).output;
   }
   return input;
}


const executeLoopBackProgram = (codes: Array<number>, sequenceCombination : Array<number>) : number => {
   let outputs = [0,0,0,0,0];
   let amplifierStates = [
      [...codes],
      [...codes],
      [...codes],
      [...codes],
      [...codes],
   ];
   let exit = false;
   let amplifierIndex = 0;
   const pointers = [0,0,0,0,0];
   let firstRound = true;

   while(!exit) {
      let inputs ;
      if(firstRound){
         inputs = [sequenceCombination[amplifierIndex], outputs[getPreviousAmpIndex(amplifierIndex)]];
      }else{
         inputs = [ outputs[getPreviousAmpIndex(amplifierIndex)], sequenceCombination[amplifierIndex]];
      }
      console.log(`starting with: ${amplifierIndex}, outputs: ${outputs}, previous index ${getPreviousAmpIndex(amplifierIndex)}`);
      let out = execute(amplifierStates[amplifierIndex], inputs, pointers[amplifierIndex])
      // console.log(`executed with: ${amplifierIndex}, out: ${out.output}`);
      outputs[amplifierIndex] = out.output;
      amplifierStates[amplifierIndex] = [... out.codes];
      pointers[amplifierIndex] = out.pointer;
      if(firstRound && amplifierIndex === 4){
         firstRound = false;
      }

      if(out.exitCode === undefined || out.exitCode === 99){
         console.log(`${out.exitCode} at ${amplifierIndex}`);
         exit = true;
      }
      amplifierIndex = getNextAmplifierIndex(amplifierIndex);
   }
   return outputs[4];
}

const getNextAmplifierIndex = (index:number) : number => index === 4 ? 0 : index + 1 ;
const getPreviousAmpIndex = (index:number) : number => index === 0 ? 4 : index-1;
