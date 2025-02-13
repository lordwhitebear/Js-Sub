import { processBitmap } from './processbitmap.js';
import { createDoorController, createDoorControllers, toggleDoors } from './interactable.js';

const width = window.innerWidth;
const height = window.innerHeight;

let keybindUp;
let gameObjects = [];

const TILE_SIZE = width/14;
const H = 'hull';
const F = 'floor';
const X = 'empty';
const D = 'door-closed'
const d = 'door-open'
var solidTiles = [H, D];
var door_types = [D, d];

let tileTypeMap = await processBitmap('game/assets/bmptest.bmp');

let tileMap;


export function coordinateToTile(coordinate){
    return [Math.floor(coordinate[1] / TILE_SIZE), Math.floor(coordinate[0] / TILE_SIZE)];
}

export function tileToCoordinate(tile){
    return [(tile[1] * TILE_SIZE), (tile[0] * TILE_SIZE)]
}


class jssub extends Phaser.Scene {

    rectTouchingTileType(x, y, width, height){
        let top_left = [x, y];
        let top_right = [x+width, y];
        let bottom_left = [x, y+height];
        let bottom_right = [x+width, y+height];
        let tile_types_touched = [];
        try {
            let tile_index = coordinateToTile(top_left); 
            tile_types_touched.push(tileTypeMap[tile_index[0]][tile_index[1]]);
        } catch(error){console.log(error);}
        try {
            let tile_index = coordinateToTile(top_right); 
            tile_types_touched.push(tileTypeMap[tile_index[0]][tile_index[1]]);
        } catch(error){console.log(error);}
        try {
            let tile_index = coordinateToTile(bottom_left); 
            tile_types_touched.push(tileTypeMap[tile_index[0]][tile_index[1]]);
        } catch(error){console.log(error);}
        try {
            let tile_index = coordinateToTile(bottom_right); 
            tile_types_touched.push(tileTypeMap[tile_index[0]][tile_index[1]]);
        } catch(error){console.log(error);}
        return tile_types_touched;
    }

    drawLevel() {
        tileMap = [];
        for(let row = 0; row < tileTypeMap.length; row++){
            let tileRow = [];
            for(let col = 0; col < tileTypeMap[0].length; col++){
                let tileType = tileTypeMap[row][col];
                // if(tileType == 'empty'){
                //     continue;
                // }
                let tile = this.add.image(col * TILE_SIZE, row * TILE_SIZE, tileType).setOrigin(0,0);
                tile.setDisplaySize(TILE_SIZE, TILE_SIZE);
                tileRow.push(tile);
            }
            tileMap.push(tileRow);
        }
        return tileMap;
    }

    preload() {
        this.load.image('placeholder', 'game/assets/placeholder.png');
        this.load.image('player1', 'game/assets/player1.png');
        this.load.image('hull', 'game/assets/hull_tile.png');
        this.load.image('floor', 'game/assets/floor_tile.png');
        this.load.image('door-closed', 'game/assets/door_closed_tile.png');
        this.load.image('door-open', 'game/assets/door_open_tile.png');
        this.load.image('empty', 'game/assets/empty_tile.png');
    }

    create() {
        this.physics.world.setBounds(0, 0, width, height);

        tileMap = this.drawLevel();
        
        this.camera = this.cameras.main;
        this.camera.setZoom(1);

        let player_position = tileToCoordinate([20, 9]);
        let player_size_ratio = .55;
        this.player1 = this.physics.add.image(player_position[0], player_position[1], 'player1').setOrigin(0,0);
        this.player1.setDisplaySize(TILE_SIZE*player_size_ratio, TILE_SIZE*player_size_ratio);
        this.player1.width = TILE_SIZE*player_size_ratio;
        this.player1.height = TILE_SIZE*player_size_ratio;
        this.playerspeed = 235;

        createDoorController(this, [19, 13], [TILE_SIZE, TILE_SIZE*2], [tileMap[19][14], tileMap[20][14]], tileTypeMap);
        createDoorController(this, [19, 15], [TILE_SIZE, TILE_SIZE*2], [tileMap[19][14], tileMap[20][14]], tileTypeMap);

        createDoorControllers(this, [[9, 18], [11, 18]], [TILE_SIZE*2, TILE_SIZE], [tileMap[10][18], tileMap[10][19]], tileTypeMap);
        
        createDoorControllers(this, [[19, 22], [19, 24]], [TILE_SIZE, TILE_SIZE*2], [tileMap[19][23], tileMap[20][23]], tileTypeMap);


        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyInteract = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyDebug = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    }
    
    update(time, delta) {
        this.camera.centerOn(this.player1.x, this.player1.y);
        // Game loop logic
        if (this.keyUp.isDown && !this.keyDown.isDown) {
            let new_y = this.player1.y - this.playerspeed * (delta/1000)
            let tile_types_touched = this.rectTouchingTileType(this.player1.x, new_y, this.player1.width, this.player1.height)
            if (!solidTiles.some(item => tile_types_touched.includes(item))){
                this.player1.setY(new_y);
            }
        }
        if (this.keyDown.isDown && !this.keyUp.isDown) {
            let new_y = this.player1.y + this.playerspeed * (delta/1000)
            let tile_types_touched = this.rectTouchingTileType(this.player1.x, new_y, this.player1.width, this.player1.height)
            if (!solidTiles.some(item => tile_types_touched.includes(item))){
                this.player1.setY(new_y);
            }
        }
        if (this.keyRight.isDown && !this.keyLeft.isDown) {
            let new_x = this.player1.x + this.playerspeed * (delta/1000)
            let tile_types_touched = this.rectTouchingTileType(new_x, this.player1.y, this.player1.width, this.player1.height)
            if (!solidTiles.some(item => tile_types_touched.includes(item))){
                this.player1.setX(new_x);
            }
        }
        if ((this.keyLeft.isDown && !this.keyRight.isDown)) {
            let new_x = this.player1.x - this.playerspeed * (delta/1000)
            let tile_types_touched = this.rectTouchingTileType(new_x, this.player1.y, this.player1.width, this.player1.height)
            if (!solidTiles.some(item => tile_types_touched.includes(item))){
                this.player1.setX(new_x);
            }
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyDebug)){
            if(!this.physics.world.drawDebug){
                this.physics.world.drawDebug = true;
            } else {
                this.physics.world.drawDebug = false;
                this.physics.world.debugGraphic.clear();
            }
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    physics: {
        default: 'arcade',
        arcade: {debug: true}
    },
    scene: jssub
};

const game = new Phaser.Game(config);