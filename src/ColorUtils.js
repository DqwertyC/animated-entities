export const rgbaToHexa = ({ r, g, b, a }) => {
  return `#${[r, g, b, a].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

export const rgbaToColor = (rgba) => {
  return `rgb(${rgba.r},${rgba.g},${rgba.b},${rgba.a / 255.0})`;
};

export const rgbaToStr = ({ r, g, b, a }) => {
  return `${r}, ${g}, ${b}, ${a}`;
};

export const rgbToHsv = ({ r, g, b }) => {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;

  const x_max = Math.max(rr, gg, bb);
  const x_min = Math.min(rr, gg, bb);
  const c = x_max - x_min;
  const v = x_max;

  const h =
    c === 0
      ? 0
      : v === rr
        ? 60 * (((gg - bb) / c) % 6)
        : v === gg
          ? 60 * ((bb - rr) / c + 2)
          : 60 * ((rr - gg) / c + 4);

  const s = v === 0 ? 0 : c / v;

  return { h, s, v };
};

export const hsvToRgb = ({ h, s, v }) => {
  const kr = (5 + h / 60) % 6;
  const kg = (3 + h / 60) % 6;
  const kb = (1 + h / 60) % 6;

  const r = 255 * (v - v * s * Math.max(0, Math.min(kr, 4 - kr, 1)));
  const g = 255 * (v - v * s * Math.max(0, Math.min(kg, 4 - kg, 1)));
  const b = 255 * (v - v * s * Math.max(0, Math.min(kb, 4 - kb, 1)));

  return { r, g, b };
};

export const idToColor = (id) => {
  const b_table = [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1.0];
  const h_table = [360, 0, 120, 240, 180, 60, 300, 24];
  const s_table = [1, 1, 1, 1, 1, 0.4, 0.2, 0.1];
  const v_table = [0.3, 0.4, 0.5, 0.6, 1.0, 1.0, 1.0, 1.0];

  const x = id % 8;
  const y = Math.floor(id / 8);

  const h = h_table[y];
  const s = y > 0 ? s_table[x] : 0.0;
  const v = y > 0 ? v_table[x] : b_table[x];

  const kr = (5 + h / 60) % 6;
  const kg = (3 + h / 60) % 6;
  const kb = (1 + h / 60) % 6;

  const r = 255 * (v - v * s * Math.max(0, Math.min(kr, 4 - kr, 1)));
  const g = 255 * (v - v * s * Math.max(0, Math.min(kg, 4 - kg, 1)));
  const b = 255 * (v - v * s * Math.max(0, Math.min(kb, 4 - kb, 1)));

  const a = x === 0 && y === 0 ? 0 : 255;
  return rgbaToColor({ r, g, b, a });
};
