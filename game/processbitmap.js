const fs = require('fs');
const { PNG } = require('pngjs');


export function processBitmap(imagePath) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(imagePath)
            .pipe(new PNG({ filterType: 4 }))
            .on('parsed', function () {
                
                let pixelArray = [];
                for (let y = 0; y < this.height; y++) {
                    let row = [];
                    for (let x = 0; x < this.width; x++) {
                        let index = (y * this.width + x) * 4;
                        let r = this.data[index];
                        let g = this.data[index + 1];
                        let b = this.data[index + 2];
                        if(r == 255 && g == 255 && b == 255){
                            row.push("empty");
                            continue;
                        }
                        if(r == 0 && g == 0 && b == 0){
                            row.push("hull");
                            continue;
                        }
                        if(r == 128 && g == 128 && b == 128){
                            row.push("floor");
                            continue;
                        }
                            
                    }
                    pixelArray.push(row);
                }
                resolve(pixelArray);
            }).on('error', reject);
    });       
}
