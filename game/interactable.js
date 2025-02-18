import { coordinateToTile, tileToCoordinate, rectTouchingTileType } from './game.js';


export function createDoorControllers(self, positions, scale, doors, tileTypeMap){
    let doorControllers = [];
    for(let i = 0; i < positions.length; i++){
        let doorcontroller = createDoorController(self, positions[i], scale, doors, tileTypeMap)
        doorControllers.push(doorcontroller)
        
    }
    return doorControllers;
}

export function createDoorController(self, position, scale, doors, tileTypeMap){
    let door_types = ['door-open', 'door-closed'];

    let control_pos = tileToCoordinate(position);
    let doorcontroller = self.physics.add.sprite(control_pos[0], control_pos[1]).setOrigin(0,0);
    doorcontroller.setDisplaySize(scale[0], scale[1]);

    self.physics.add.overlap(
        self.player1, 
        doorcontroller, 
        null,
        () => {
            let tile_types_touched = rectTouchingTileType(self.player1.x, self.player1.y, self.player1.width, self.player1.height);
            if (Phaser.Input.Keyboard.JustDown(self.keyInteract) && !door_types.some(item => tile_types_touched.includes(item))){
                tileTypeMap = toggleDoors(doors, tileTypeMap)
            }
        }
    );
    return doorcontroller;
}

export function toggleDoors(doors, tileTypeMap){
    for(let i = 0; i < doors.length; i++){
        let current_door = doors[i];
        if (current_door.texture.key == 'door-closed'){
            current_door.setTexture('door-open');
            let door_tile = coordinateToTile([current_door.x, current_door.y]);
            tileTypeMap[door_tile[0]][door_tile[1]] = 'door-open'
        } else {
            current_door.setTexture('door-closed');
            let door_tile = coordinateToTile([current_door.x, current_door.y]);
            tileTypeMap[door_tile[0]][door_tile[1]] = 'door-closed'
        }
    }
    return tileTypeMap
}