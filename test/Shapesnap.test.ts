import { Shapesnap } from '../lib/Shapesnap';
import { Options } from '../lib/config/Options';
import { DEFAULTS } from '../lib/config/defaults';
import Jimp from 'jimp';
import ndarray, { NdArray } from 'ndarray';

it('approximates a raster image with shapes', async (): Promise<void> => {
  let image: Jimp = await Jimp.read('./images/mandrill.png');
  image = image.resize(500, Jimp.AUTO);
  const ndArray: NdArray = ndarray(image.bitmap.data, [image.getWidth(), image.getHeight(), 4], [4, image.getWidth() * 4, 1], 0);

  const shapesnap = new Shapesnap(ndArray, {
    ...DEFAULTS,
    amountOfShapes: 2,
    amountOfAttempts: 2
  } as Options);
  const start = shapesnap.difference;
  shapesnap.step();

  expect(shapesnap.difference).toBeLessThan(start);
});

it('accepts a background color', async (): Promise<void> => {
  let image: Jimp = await Jimp.read('./images/mandrill.png');
  image = image.resize(500, Jimp.AUTO);
  const ndArray: NdArray = ndarray(image.bitmap.data, [image.getWidth(), image.getHeight(), 4], [4, image.getWidth() * 4, 1], 0);

  const shapesnap: Shapesnap = new Shapesnap(ndArray, {
    ...DEFAULTS,
    amountOfShapes: 2,
    amountOfAttempts: 2,
    backgroundColor: {r: 100, g: 100, b: 255, a: 255}
  } as Options);
  const start: number = shapesnap.difference;
  shapesnap.step();

  expect(shapesnap.difference).toBeLessThan(start);
});
