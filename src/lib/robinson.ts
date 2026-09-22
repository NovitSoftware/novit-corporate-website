/** Robinson's table, every 5° of latitude from the equator: [X, Y]. */
const TABLE = [
  [1, 0], [0.9986, 0.062], [0.9954, 0.124], [0.99, 0.186], [0.9822, 0.248],
  [0.973, 0.31], [0.96, 0.372], [0.9427, 0.434], [0.9216, 0.4958],
  [0.8962, 0.5571], [0.8679, 0.6176], [0.835, 0.6769], [0.7986, 0.7346],
  [0.7597, 0.7903], [0.7186, 0.8435], [0.6732, 0.8936], [0.6213, 0.9394],
  [0.5722, 0.9761], [0.5322, 1],
] as const;

/**
 * Robinson's X and Y factors for a latitude, linearly interpolated. Y is
 * signed, positive north; both are unitless and scale per map.
 */
export function robinson(lat: number, lon: number): [x: number, y: number] {
  const t = Math.min(Math.abs(lat), 90) / 5;
  const i = Math.min(Math.floor(t), TABLE.length - 2);
  const f = t - i;
  const [x0, y0] = TABLE[i];
  const [x1, y1] = TABLE[i + 1];
  return [(x0 + (x1 - x0) * f) * lon, Math.sign(lat) * (y0 + (y1 - y0) * f)];
}
