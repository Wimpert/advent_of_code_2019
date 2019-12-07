import { readFile } from "../utils/utils";

type node = {
   id:string
} 



export function solve(){
   const links  = readFile('../puzzle_6/input.txt', '\n').map(
      link => link.split(')')
   );
   //console.log(links);
   // const tree = buildTree(links);
   // console.log(tree);
   // const weight = calculateNodeWeight(tree, 'COM', 0);
   // console.log(weight)

   const reverseTree =  buildReverseTree(links);
   //console.log(reverseTree);

   const youPath = buildPath(reverseTree , 'YOU');
   const sanPath = buildPath(reverseTree , 'SAN');
   // console.log(youPath);
   // console.log(sanPath);

   const length = findShortestRoute(youPath, sanPath);
   console.log(length);
   

}


const buildTree = (links) => {
   return links.reduce( (acc, link) => {
      if(!acc[link[0]]){
         acc[link[0]] = {childs: []};
      }
      acc[link[0]].childs.push(link[1]);
      return {... acc}
   },{});
}


const calculateNodeWeight = (tree: {[key:string] : {childs: Array<string>}}, nodeName: string, rootWeight: number) => {
   console.log(nodeName, rootWeight);
   if(tree[nodeName] && tree[nodeName].childs.length !== 0){
      console.log(`node ${nodeName} has ${tree[nodeName].childs} as childs`);
      //node has children:
      return rootWeight + tree[nodeName].childs.reduce((acc, child:string) => {
         return acc + calculateNodeWeight(tree, child, rootWeight + 1);
      }, 0)
   } else {
      return rootWeight ;
   } 
}
const buildReverseTree = (links: string[][]) => {
   return links.reduce((acc, link) => {
      if (!acc[link[1]]) {
         acc[link[1]] = { parents: [] };
      }
      acc[link[1]].parents.push(link[0]);
      return { ...acc };
   }, {});
}

const buildPath = (reverseTree, startNode: string) => {

   const path = [];
   let node = startNode;
   
   while (node !== 'COM'){
      node = reverseTree[node].parents[0];
      path.push(node);
   }
   return path;

}

const findShortestRoute = (route1: Array<String>, route2: Array<string>) : number => {
   
   let commonLenght = 0;

   while(route1[route1.length-1-commonLenght] === route2[route2.length-1-commonLenght]){
      commonLenght++;
   }

   const route1Stripped = route1.slice(0, route1.length - commonLenght);
   const route2Stripped = route2.slice(0, route2.length - commonLenght);

   // console.log(route1Stripped);
   // console.log(route2Stripped);
      
   return  route2Stripped.length + route1Stripped.length;
}