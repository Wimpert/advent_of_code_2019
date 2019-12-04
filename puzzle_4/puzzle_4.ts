

export function solve(){
   const boundaries = [256310,732736];

   let currentCode=  boundaries[0];
   let numberOfCodes = 0;

   // console.log(containsOneStreakOfDoublesThatIsOfLenght(toDigits(777777),2));
   // console.log(isValidCode(toDigits(777777)));
   

   while (currentCode < boundaries[1]){
      let currentDigits = toDigits(currentCode);
      currentDigits = findNextCode(currentDigits);
      numberOfCodes++;
      currentCode = toNumber(currentDigits)
      console.log(`found new code : ${currentCode}, total number of codes: ${numberOfCodes}`);
   }

}

const findNextCode = (currentCode: Array<number>) : Array<number> => {

   // console.log(`checking current code: ${currentCode}`);

   const digitsIncode = [...currentCode];
  
   const nonIncreasingPosition = findNonIncreasingPosition(digitsIncode);
   
   if(nonIncreasingPosition !== -1){
      const newDigits = [...digitsIncode];
      newDigits[nonIncreasingPosition] = newDigits[nonIncreasingPosition-1];
      let positionToIncrease = nonIncreasingPosition+1;
      while(positionToIncrease < newDigits.length){
         newDigits[positionToIncrease] = newDigits[positionToIncrease-1];
         positionToIncrease++;
      }
      // console.log(newDigits);
      if(isValidCode(newDigits)){
         return newDigits;
      } else {
         const addedOne = toDigits(toNumber(newDigits) + 1);
        
      if(isValidCode(addedOne)){
         return addedOne;
      } else {
         return findNextCode(addedOne);
      }
      }
   } else {
      const addedOne = toDigits(toNumber(currentCode) + 1);
      if(isValidCode(addedOne)){
         return addedOne;
      } else {
         return findNextCode(addedOne);
      }
   }

  
   return String(99999999999).split('').map(c => Number(c));
} 


const findNonIncreasingPosition = (digits : Array<Number>) : number => {
   let position = 0;
   let found = false
   while (!found && position < digits.length){
      if(digits[position]>digits[position+1]){
         found = true;
         return position+1;
      }
      position++;
   }
   return -1;
}

const hasAtLeastOneDouble = (digits: Array<number>) : boolean => digits.reduce((acc, currentDigit, index, allDigits) => {
   if(acc) {
      return acc;
   }
   if(index !== 0){
      return currentDigit === allDigits[index-1];
   }
   return acc
}, false)

const getStreaks =(digits: Array<number>) : Array<number> => digits.reduce((allLengths, currentDigit, index, allDigits) => {
   
   if(index === 0){
      return [1];
   } else if(currentDigit === allDigits[index-1]){
      //same as previous:
      let frequency = allLengths.pop();
      frequency++;
      return [...allLengths , frequency]
   } else {
      //not the same:
      return [... allLengths, 1];
   }
   return allLengths
},[0]);

const containsOneStreakOfDoublesThatIsOfLenght = (digits: Array<number>, length:number) : boolean => getStreaks(digits).includes(length);

//const isValidCode = (digits : Array<number>) => findNonIncreasingPosition(digits) === -1 && hasAtLeastOneDouble(digits);
const isValidCode = (digits : Array<number>) => findNonIncreasingPosition(digits) === -1 && containsOneStreakOfDoublesThatIsOfLenght(digits,2);
const toNumber = (digits : Array<number>) : number => Number(digits.reduce((acc, digit)=> acc + digit, ''));
const toDigits = (number: number) : Array<number> => String(number).split('').map(c => Number(c));