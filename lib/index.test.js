/* eslint-env jest */

const baboon = require('baboon-image');
const isNdarray = require('isndarray');
const isSvg = require('is-svg');
const Cutout = require('.');

it('approximates a raster image with shapes', () => {
  const cutout = new Cutout(baboon, {
    amountOfShapes: 2,
    amountOfAttempts: 2
  });
  const start = cutout.difference;
  cutout.step().step();

  expect(cutout.difference).toBeLessThan(start);
  expect(isSvg(cutout.svg)).toBe(true);
  expect(isNdarray(cutout.image)).toBe(true);
});