import { processBitmap } from './processbitmap.js';

const width = window.innerWidth;
const height = window.innerHeight;

let keybindUp;
let gameObjects = [];

const TILE_SIZE = 50;
const H = "hull";
const F = "floor";
const X = "empty";
var solidTiles = [H];

let tileMap = await processBitmap("game/assets/bmptest.png");
console.log(tileMap);


class jssub extends Phaser.Scene {

    coordinateToTile(coordinate){
        return [Math.floor(coordinate[1] / TILE_SIZE), Math.floor(coordinate[0] / TILE_SIZE)];
    }

    tileToCoordinate(tile){
        return [tile[1] * TILE_SIZE, tile[0] * TILE_SIZE]
    }

    rectTouchingTiles(x, y, width, height){
        let top_left = [x-(width/2), y-(height/2)];
        let top_right = [x+(width/2), y-(height/2)];
        let bottom_left = [x-(width/2), y+(height/2)];
        let bottom_right = [x+(width/2), y+(height/2)];
        let tiles_touched = [];
        try {
            let tile_index = this.coordinateToTile(top_left); 
            tiles_touched.push(tileMap[tile_index[0]][tile_index[1]]);
        } catch(error){console.log(error);}
        try {
            let tile_index = this.coordinateToTile(top_right); 
            tiles_touched.push(tileMap[tile_index[0]][tile_index[1]]);
        } catch(error){console.log(error);}
        try {
            let tile_index = this.coordinateToTile(bottom_left); 
            tiles_touched.push(tileMap[tile_index[0]][tile_index[1]]);
        } catch(error){console.log(error);}
        try {
            let tile_index = this.coordinateToTile(bottom_right); 
            tiles_touched.push(tileMap[tile_index[0]][tile_index[1]]);
        } catch(error){console.log(error);}
        return tiles_touched;
    }

    drawLevel() {
        for(let row = 0; row < tileMap.length; row++){
            for(let col = 0; col < tileMap[0].length; col++){
                let tileType = tileMap[row][col];
                if(tileType == "empty"){
                    continue;
                }
                let tile = this.add.image(col * TILE_SIZE, row * TILE_SIZE, tileType)
                    .setOrigin(0);
                tile.setDisplaySize(TILE_SIZE, TILE_SIZE);
            }
        }
    }

    preload() {
        this.load.image('placeholder', 'game/assets/placeholder.png');
        this.load.image('player1', 'game/assets/player1.png');
        this.load.image('hull', 'game/assets/hull_tile.png');
        this.load.image('floor', 'game/assets/floor_tile.png');
    }
    
    create() {
        var x = 400;
        var y = 300;

        console.log(processBitmap("game/assets/bmptest.bmp"));
        

        this.drawLevel();

    

        this.camera = this.cameras.main;
        this.camera.setZoom(1);

        this.player1 = this.add.image(400, 400, 'player1');
        this.playerspeed = 150

        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    }
    
    update(time, delta) {
        this.camera.centerOn(this.player1.x, this.player1.y);
        // Game loop logic
        if (this.keyUp.isDown && !this.keyDown.isDown) {
            let new_y = this.player1.y - this.playerspeed * (delta/1000)
            let tiles_touched = this.rectTouchingTiles(this.player1.x, new_y, this.player1.width, this.player1.height)
            if (!solidTiles.some(item => tiles_touched.includes(item))){
                this.player1.setY(new_y);
            }
        }
        if (this.keyDown.isDown && !this.keyUp.isDown) {
            let new_y = this.player1.y + this.playerspeed * (delta/1000)
            let tiles_touched = this.rectTouchingTiles(this.player1.x, new_y, this.player1.width, this.player1.height)
            if (!solidTiles.some(item => tiles_touched.includes(item))){
                this.player1.setY(new_y);
            }
        }
        if (this.keyRight.isDown && !this.keyLeft.isDown) {
            let new_x = this.player1.x + this.playerspeed * (delta/1000)
            let tiles_touched = this.rectTouchingTiles(new_x, this.player1.y, this.player1.width, this.player1.height)
            if (!solidTiles.some(item => tiles_touched.includes(item))){
                this.player1.setX(new_x);
            }
        }
        if ((this.keyLeft.isDown && !this.keyRight.isDown)) {
            let new_x = this.player1.x - this.playerspeed * (delta/1000)
            let tiles_touched = this.rectTouchingTiles(new_x, this.player1.y, this.player1.width, this.player1.height)
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
    scene: jssub
};

const game = new Phaser.Game(config);
