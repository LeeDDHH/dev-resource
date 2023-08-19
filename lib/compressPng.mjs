import fs from 'fs';
import path from 'path';

import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';

const imagesPng = ['screenshots/*.png'];
const regexpPng = /.*\.png$/;
const screenshotsDir = 'screenshots';

const removePngFromScreenShots = () => {
  fs.readdir(screenshotsDir, 'utf8', (err, files) => {
    files
      .map((oneFile) => path.resolve('screenshots', oneFile))
      .filter((oneFile) => {
        return fs.statSync(oneFile).isFile() && regexpPng.test(oneFile);
      })
      .forEach((oneFile) => {
        fs.unlink(oneFile, (err) => {
          // eslint-disable-next-line no-undef
          if (err) console.log(err);
          // eslint-disable-next-line no-undef
          else console.log('unlink successfull');
        });
      });
  });
};

try {
  await imagemin(imagesPng, {
    destination: screenshotsDir,
    plugins: [
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
      imageminWebp({ quality: 50 }),
    ],
  });
  removePngFromScreenShots();
} catch (e) {
  // eslint-disable-next-line no-undef
  console.error(e);
}
