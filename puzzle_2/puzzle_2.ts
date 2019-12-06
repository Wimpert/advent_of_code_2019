import { readFileToNumbers } from "../utils/utils";

export function solve(){
   const originalCodes = readFileToNumbers('../puzzle_2/input.txt', ',');

   
   const output = 19690720;

   for (let noun = 0 ; noun < 99 ; noun++){
     for (let verb = 0 ; verb < 99 ; verb++){
        
        const codes = [...originalCodes];
        codes[1] = noun;
        codes[2] = verb;
        
        execute(codes);
       
     if(codes[0] === output){
         console.log(noun,verb);
         break;
     }
   }
   }

}


function execute(codes: Array<number>) : Array<number>{
    let pointer = 0;
     
    while(codes[pointer] !== 99) {
 
     const operationCode = codes[pointer];
     const noun = codes[codes[pointer+1]];
     const verb = codes[codes[pointer+2]];
  
     if(operationCode === 1){
        codes[codes[pointer+3]] = noun + verb;
     } else if(operationCode === 2){
        codes[codes[pointer+3]] = noun * verb;
     } else {
         throw new Error("unknown oper")
     }
     pointer = pointer + 4; 
 }
 return codes;
}
