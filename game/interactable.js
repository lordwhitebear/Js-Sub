import { coordinateToTile } from './game.js';


export function toggleDoors(doors){
    for(let i = 0; i < doors.length; i++){
        let current_door = doors[i];
        if (current_door.texture == 'door-closed'){
            current_door.setTexture('door-open');
            let door_tile = coordinateToTile([current_door.x, current_door.y]);
            tileMap[door_tile[0], door_tile[1]] = 'door-open'
        } else {
            current_door.setTexture('door-closed');
            let door_tile = coordinateToTile([current_door.x, current_door.y]);
            tileMap[door_tile[0], door_tile[1]] = 'door-closed'
        }
        return tileMap
    }
}