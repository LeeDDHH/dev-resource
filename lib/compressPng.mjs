import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';

const imagesPng = ['screenshots/*.png'];

try {
  await imagemin(imagesPng, {
    destination: 'screenshots',
    plugins: [
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });
} catch (e) {
  console.error(e);
}
