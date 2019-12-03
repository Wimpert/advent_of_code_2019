import { readFile } from "../utils/utils";

type RouteEntry = {
   direction: string,
   distance: number
}

type ElfCoordinate = {
   x:number,
   y: number,
}

type WireDistance = {
   coordinate:  ElfCoordinate,
   distance: number
}

enum DIRECTIONS{
   UP='U',
   RIGHT='R',
   DOWN='D',
   LEFT='L',
}

export function solve(){
   const routes = readFile('../puzzle_3/input.txt')
                  .map(routeString => routeString.split(','))
                  .map(route => route.map(entrie => {
                     return {
                        direction : entrie.substring(0,1),
                        distance : Number(entrie.substring(1))};
                  }));

   const paths = mapRoutesToCoordinates(routes);
   //console.log(paths);
   const intersections = findInterSections(paths);
   //intersections.sort((a,b) => getDistance(a) - getDistance(b) );
   intersections.sort((a,b) => a.distance - b.distance);
   console.log(intersections);
   //console.log(getDistance(intersections[0]));
   console.log(intersections[0].distance)
   
}

const mapRoutesToCoordinates = (routes : Array<Array<RouteEntry>>) :  Array<Array<WireDistance>> => {

   const start: WireDistance ={coordinate:{x:0,y:0}, distance:0}

  return routes.map((route: Array<RouteEntry>) => {
      return route.reduce((acc: Array<WireDistance>,routeEntry: RouteEntry) => {
         const currentlocation = acc.length !== 0 ? acc[acc.length-1] : {...start};
         return [...acc, ...getPath(currentlocation,routeEntry)];
      }, [])
   });

}

const getPath = (start: WireDistance, entry: RouteEntry) : Array<WireDistance> => {

   const path = []
   switch (entry.direction) {
      case DIRECTIONS.UP:
         for(let i = 1 ; i <= entry.distance ; i++){
            path.push({...start , coordinate: { ... start.coordinate, y : start.coordinate.y + i }, distance:start.distance+i});
         }
         break;
         case DIRECTIONS.DOWN:
               for(let i = 1 ; i <= entry.distance ; i++){
                  path.push({...start , coordinate: { ... start.coordinate, y : start.coordinate.y - i }, distance:start.distance+i});
               }
         break;
         case DIRECTIONS.RIGHT:
               for(let i = 1 ; i <= entry.distance ; i++){
                  path.push({...start , coordinate: { ... start.coordinate, x : start.coordinate.x + i }, distance:start.distance+i});
               }
         break;
         case DIRECTIONS.LEFT:
               for(let i = 1 ; i <= entry.distance ; i++){
                  path.push({...start , coordinate: { ... start.coordinate, x : start.coordinate.x - i }, distance:start.distance+i});
               }
         break;
      default:
         break;
   }

   return [...path];
}

const findInterSections =  (paths : Array<Array<WireDistance>>) : Array<WireDistance> => {
  return paths[0].map((coor:WireDistance) => {
      const correspondingPoint = paths[1].find((otherCoor: WireDistance) => coor.coordinate.x === otherCoor.coordinate.x && coor.coordinate.y === otherCoor.coordinate.y);
      if(correspondingPoint !== undefined){
         return { ... coor, distance : coor.distance + correspondingPoint.distance}
      }
   }).filter(Boolean);
}


const getDistance = (c : ElfCoordinate) : number => Math.abs(c.x) + Math.abs(c.y);
