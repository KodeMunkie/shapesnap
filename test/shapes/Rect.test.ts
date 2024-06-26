import { Rect } from '../../lib/shapes/Rect';

it('gets props', () => {
  const xBound = 10;
  const yBound = 10;
  const rect = new Rect(xBound, yBound);

  expect(Array.isArray(rect.props)).toBe(true);
});

it('sets props', () => {
  const xBound = 10;
  const yBound = 10;
  const rect = new Rect(xBound, yBound);

  const { props } = rect;
  rect.props = [100, 100, 200, 200];

  expect(rect.props).not.toEqual(props);
});

it('gets export', () => {
  const xBound = 10;
  const yBound = 10;
  const rect = new Rect(xBound, yBound);
  const { svg } = rect;
  const attrs = ['x', 'y', 'width', 'height'];

  expect(svg.name).toBe('rect');
  expect(Object.keys(svg.props)).toEqual(attrs);
});

it('can mutate', () => {
  const xBound = 10000;
  const yBound = 10000;
  const rect = new Rect(xBound, yBound);

  expect(() => rect.mutate()).not.toThrow();
});

it('can rasterize', () => {
  const xBound = 10;
  const yBound = 10;
  const rect = new Rect(xBound, yBound);

  expect(() => rect.rasterize()).not.toThrow();
  expect(Array.isArray(rect.rasterize())).toBe(true);
});

it('can clone itself', () => {
  const xBound = 10;
  const yBound = 10;
  const rect = new Rect(xBound, yBound);
  const clone = rect.clone();

  expect(rect).not.toBe(clone);
  expect(rect.props).toEqual(clone.props);
});
