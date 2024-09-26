const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function removeBackground(inputPath, outputPath) {
  try {
    const img = await loadImage(inputPath);
    const width = img.width;
    const height = img.height;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, width, height);

    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 200 && imageData.data[i + 1] > 200 && imageData.data[i + 2] > 200) {
        imageData.data[i + 3] = 0; 
      }
    }

    ctx.putImageData(imageData, 0, 0);

    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on( 'finish', () => console.log( 'Done napo magjabol... Output saved to:', outputPath ) );
  } catch (error) {
    console.error('Error removing background:', error);
  }
}

removeBackground('./uploads/bee.png', './nobg/output.png');