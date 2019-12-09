import { readFileToNumbers } from "../utils/utils";

type Row =  Array<PIXEL>;
type Layer = {
   rows: Array<Row>,
   digitCount?: Array<number>
};

enum PIXEL {
   BLACK, WHITE, TRANSPARENT
}

export function solve(){
   const values = readFileToNumbers('../puzzle_8/input.txt', '');

   const width = 25;
   const height = 6; 

   const layers  = getLayers(values, width, height);
   
   //console.log(solvePartOne(layers));
   //console.log(layers);
   const mergedLayers = mergeLayers(layers, width, height);
   console.log(mergedLayers);

}

const getLayers = (values : Array<number>, width: number, height: number) : Array<Layer> => {

   let pointer = 0;
   const allLayers = [];


   while(pointer < values.length){
      const layerData =[];
      const digitCount = [0,0,0,0,0,0,0,0,0,0];
      for(let i = 0; i<height; i++){
         const pixel = values.slice(pointer,pointer+width);
         pixel.forEach(digit => digitCount[digit] = digitCount[digit]+1);
         layerData.push(pixel);
         pointer += width
      }
      allLayers.push({rows:layerData,digitCount: digitCount});
   }
   return allLayers
}

const solvePartOne = (layers: Array<Layer>) : number => {

   const layerDigitCount = layers.reduce((acc: Array<number>, layer:Layer) => {
      console.log(layer);
      if(!acc){
         return layer.digitCount;
      }
      if(acc[0] > layer.digitCount[0] ){
         return layer.digitCount;
      } 
      return acc;
   },undefined);
   
   return  layerDigitCount[1]*layerDigitCount[2];
   
}

const mergeLayers = (layers: Array<Layer>, width: number, height: number) : Layer => {
   const initial = {
      rows:[],
   } ;
   for(let i = 0 ; i < height ; i++){
      const row : Array<PIXEL> = new Array(width).fill(PIXEL.TRANSPARENT);
      initial.rows.push(row);
   }

   console.log(initial)

   return layers.reduce((acc, layer) => {

      const newRows = acc.rows.map((accRow, rowIndex) => {
         const updatedRow = accRow.map((pixel,pixelIndex) => mergePixels(pixel, layer.rows[rowIndex][pixelIndex]));
         return updatedRow;
      });
      acc.rows = newRows
      return acc;
      
   }, initial)

}
const mergePixels = (currentPixel:PIXEL, newPixel: PIXEL) : PIXEL  => currentPixel === PIXEL.TRANSPARENT ? newPixel : currentPixel; 
