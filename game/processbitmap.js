const fs = require('fs');
const bmp = require('bmp-js');

export function processBitmap(imagePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(imagePath, (err, data) => {
            if (err) return reject(err);

            const bmpData = bmp.decode(data);
            const { width, height, data: pixelData} = bmpData;

            let pixelArray = [];

            for (let y = 0; y < height; y++) {
                let row = [];
                for (let x = 0; x < width; x++) {
                    let index = (y * width + x) * 4;
                    //bmp reads in ABGR format
                    let b = pixelData[index + 1];
                    let g = pixelData[index + 2];
                    let r = pixelData[index + 3];

                    if (r === 0 && g === 0 && b === 0) {
                        row.push('hull');
                    } else if (r === 128 && g === 128 && b === 128) {
                        row.push('floor');
                    } else if (r === 255 && g === 0 && b === 0) {
                        row.push('door-closed');
                    } else {
                        row.push('empty');
                    }
                }
                pixelArray.push(row);
            }
            resolve(pixelArray);
        });
    });
}
