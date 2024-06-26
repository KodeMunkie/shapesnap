/**
 * Calculates the average color of all the pixels in an image
 */
import { clampToInt } from './util';
import { draw } from './image';
import { RGBA } from 'color-blend/dist/types';
import { NdArray } from 'ndarray';
import { Shape } from '../shapes/Shape';

export const backgroundColor = (image: any): RGBA => {
  const width = image.shape[0];
  const height = image.shape[1];
  let r: number  = 0;
  let g: number  = 0;
  let b: number = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      r += image.get(x, y, 0);
      g += image.get(x, y, 1);
      b += image.get(x, y, 2);
    }
  }

  r = Math.round(r / (width * height));
  g = Math.round(g / (width * height));
  b = Math.round(b / (width * height));

  return { r, g, b, a:255};
};

/**
 * Calculates the necessary color to move current closer to target
 */
export const scanlineColor = (target: NdArray, current: NdArray, scanlines: number[][], alpha: number): RGBA => {
  const total: number[] = [0, 0, 0];
  let pixels: number = 0;

  const a: number = alpha+1;

  scanlines.forEach(([y, x1, x2]) => {
    for (let x = x1; x < x2 + 1; x += 1) {
      const t: number[] = [target.get(x, y, 0), target.get(x, y, 1), target.get(x, y, 2)];
      const c: number[] = [current.get(x, y, 0), current.get(x, y, 1), current.get(x, y, 2)];

      total[0] += (t[0] - c[0]) * a + c[0] * 257;
      total[1] += (t[1] - c[1]) * a + c[1] * 257;
      total[2] += (t[2] - c[2]) * a + c[2] * 257;

      ++pixels;
    }
  });

  return {
    r: clampToInt(Math.round(total[0] / pixels) >> 8, 0, 255),
    g: clampToInt(Math.round(total[1] / pixels) >> 8, 0, 255),
    b: clampToInt(Math.round(total[2] / pixels) >> 8, 0, 255),
    a: alpha
  };
};

/**
 * Calculates the root-mean-square error between two images
 */
export const differenceFull = (one: NdArray, two: NdArray) => {
  const width: number = one.shape[0];
  const height: number = one.shape[1];
  let total: number = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const difference: number[] = [
        one.get(x, y, 0) - two.get(x, y, 0),
        one.get(x, y, 1) - two.get(x, y, 1),
        one.get(x, y, 2) - two.get(x, y, 2),
        one.get(x, y, 3) - two.get(x, y, 3)
      ];

      total += difference[0] ** 2 + difference[1] ** 2 + difference[2] ** 2 + difference[3] ** 2;
    }
  }

  return Math.sqrt(total / (width * height * 4)) / 255;
};

/**
 * Calculates the root-mean-square error between the parts of the two images within the scanlines
 */
export const differencePartial = (target: NdArray, before: NdArray, after: NdArray, score: number, scanlines: number[][]) => {
  const width: number = target.shape[0];
  const height: number = target.shape[1];
  const rgbaCount: number = width * height * 4;
  let total: number = (score * 255) ** 2 * rgbaCount;

  scanlines.forEach(([y, x1, x2]) => {
    for (let x = x1; x < x2 + 1; x += 1) {
      const diffBefore = [
        target.get(x, y, 0) - before.get(x, y, 0),
        target.get(x, y, 1) - before.get(x, y, 1),
        target.get(x, y, 2) - before.get(x, y, 2),
        target.get(x, y, 3) - before.get(x, y, 3)
      ];

      const diffAfter = [
        target.get(x, y, 0) - after.get(x, y, 0),
        target.get(x, y, 1) - after.get(x, y, 1),
        target.get(x, y, 2) - after.get(x, y, 2),
        target.get(x, y, 3) - after.get(x, y, 3)
      ];

      total -= diffBefore[0] ** 2 + diffBefore[1] ** 2 + diffBefore[2] ** 2 + diffBefore[3] ** 2;
      total += diffAfter[0] ** 2 + diffAfter[1] ** 2 + diffAfter[2] ** 2 + diffAfter[3] ** 2;
    }
  });

  // TODO: https://dirask.com/posts/JavaScript-Mean-absolute-error-MAE-13P7bD
  return Math.sqrt(total / rgbaCount) / 255;
};

/**
 * Calculates a measure of the improvement adding the shape provides, lower energy is better
 */

export const energy = (shape: Shape, alpha: number, target: NdArray, current: NdArray, buffer: NdArray, score: number) => {
  const scanlines: number[][] = shape.rasterize();
  const color: RGBA = scanlineColor(target, current, scanlines, alpha);

  draw(buffer, color, scanlines);
  return differencePartial(target, current, buffer, score, scanlines);
};
