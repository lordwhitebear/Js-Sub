import { processBitmap } from './processbitmap.js';
import { toggleDoors } from './interactable.js';

const width = window.innerWidth;
const height = window.innerHeight;

let keybindUp;
let gameObjects = [];

const TILE_SIZE = width/14;
const H = 'hull';
const F = 'floor';
const X = 'empty';
const D = 'door-closed'
var solidTiles = [H];

let tileTypeMap = await processBitmap('game/assets/bmptest.bmp');


export function coordinateToTile(coordinate){
    return [Math.floor(coordinate[1] / TILE_SIZE), Math.floor(coordinate[0] / TILE_SIZE)];
}

export function tileToCoordinate(tile){
    return [(tile[1] * TILE_SIZE), (tile[0] * TILE_SIZE)-TILE_SIZE]
}

function bing(){
    console.log("bing")
}

class jssub extends Phaser.Scene {

    rectTouchingTileType(x, y, width, height){
        let top_left = [x, y];
        let top_right = [x+width, y];
        let bottom_left = [x, y+height];
        let bottom_right = [x+width, y+height];
        let tiles_touched = [];
        try {
            let tile_index = coordinateToTile(top_left); 
            tiles_touched.push(this.tileTypeMap[tile_index[0]][tile_index[1]]);
        } catch(error){console.log(error);}
        try {
            let tile_index = coordinateToTile(top_right); 
            tiles_touched.push(this.tileTypeMap[tile_index[0]][tile_index[1]]);
        } catch(error){console.log(error);}
        try {
            let tile_index = coordinateToTile(bottom_left); 
            tiles_touched.push(this.tileTypeMap[tile_index[0]][tile_index[1]]);
        } catch(error){console.log(error);}
        try {
            let tile_index = coordinateToTile(bottom_right); 
            tiles_touched.push(this.tileTypeMap[tile_index[0]][tile_index[1]]);
        } catch(error){console.log(error);}
        return tiles_types_touched;
    }

    drawLevel() {
        tileMap = [];
        for(let row = 0; row < tileTypeMap.length; row++){
            tileRow = [];
            for(let col = 0; col < tileTypeMap[0].length; col++){
                let tileType = tileTypeMap[row][col];
                if(tileType == 'empty'){
                    continue;
                }
                let tile = this.add.image(col * TILE_SIZE, row * TILE_SIZE, tileType).setOrigin(0,0);
                tile.setDisplaySize(TILE_SIZE, TILE_SIZE);
                tileRow.push(tile);
            }
            tileMap.push(row);
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
    }

    create() {
        this.physics.world.setBounds(0, 0, width, height);

        this.tileMap = this.drawLevel();
        
        this.camera = this.cameras.main;
        this.camera.setZoom(1);

        let player_position = tileToCoordinate([20, 9]);
        this.player1 = this.physics.add.image(player_position[0], player_position[1], 'player1').setOrigin(0,0);
        this.playerspeed = 200;

        let control_pos = tileToCoordinate([20, 13]);
        this.doorcontroller1 = this.physics.add.image(control_pos[0], control_pos[1], 'placeholder').setOrigin(0,0);

        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyInteract = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.physics.add.overlap(
            this.player1, 
            this.doorcontroller1, 
            null,
            () => {
                if (Phaser.Input.Keyboard.JustDown(this.keyInteract)){
                    let test = toggleDoors([tileMap[19][14], tileMap[20][14]], tileMap)
                    console.log("trigger");
                    tileMap = test;
                }
            }
        );
    }
    
    update(time, delta) {
        this.camera.centerOn(this.player1.x, this.player1.y);
        // Game loop logic
        if (this.keyUp.isDown && !this.keyDown.isDown) {
            let new_y = this.player1.y - this.playerspeed * (delta/1000)
            let tile_types_touched = this.rectTouchingTileType(this.player1.x, new_y, this.player1.width, this.player1.height)
            if (!solidTiles.some(item => tiles_touched.includes(item))){
                this.player1.setY(new_y);
            }
        }
        if (this.keyDown.isDown && !this.keyUp.isDown) {
            let new_y = this.player1.y + this.playerspeed * (delta/1000)
            let tiles_touched = this.rectTouchingTileType(this.player1.x, new_y, this.player1.width, this.player1.height)
            if (!solidTiles.some(item => tiles_touched.includes(item))){
                this.player1.setY(new_y);
            }
        }
        if (this.keyRight.isDown && !this.keyLeft.isDown) {
            let new_x = this.player1.x + this.playerspeed * (delta/1000)
            let tiles_touched = this.rectTouchingTileType(new_x, this.player1.y, this.player1.width, this.player1.height)
            if (!solidTiles.some(item => tiles_touched.includes(item))){
                this.player1.setX(new_x);
            }
        }
        if ((this.keyLeft.isDown && !this.keyRight.isDown)) {
            let new_x = this.player1.x - this.playerspeed * (delta/1000)
            let tiles_touched = this.rectTouchingTileType(new_x, this.player1.y, this.player1.width, this.player1.height)
            if (!solidTiles.some(item => tiles_touched.includes(item))){
                this.player1.setX(new_x);
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