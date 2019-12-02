import { readFileToNumbers } from "../utils/utils";


export function solve(){
    const numbers = readFileToNumbers('../puzzle_1/input.txt');
    const solution = numbers.reduce((acc:number, input:number) => {
        return acc + getFuelForMass(input);
    }, 0);
    console.log(solution);
}

function getFuelForMass(mass: number) : number{
    const fuel= Math.floor(mass/3) - 2;
    let fuelNeededForFeul = 0;
    if(fuel > 0){
         fuelNeededForFeul = Math.max(getFuelForMass(fuel),0);
    }
    return fuel + fuelNeededForFeul;
    
}