export const noise = (x, y) => {
  let seed = Math.floor(x) * 73;
  seed ^= 0xe56faa12;
  seed += Math.floor(y) * 179;
  seed ^= 0x69628a2d;
  return ((Math.floor((seed % 201) + 201) % 201) - 100) / 100.0;
};

export const VOID_COLORS = [
  { r: 255 * 0.022087, g: 255 * 0.098399, b: 255 * 0.110818, a: 255 },
  { r: 255 * 0.011892, g: 255 * 0.095924, b: 255 * 0.089485, a: 255 },
  { r: 255 * 0.027636, g: 255 * 0.101689, b: 255 * 0.100326, a: 255 },
  { r: 255 * 0.046564, g: 255 * 0.109883, b: 255 * 0.114838, a: 255 },
  { r: 255 * 0.064901, g: 255 * 0.117696, b: 255 * 0.097189, a: 255 },
  { r: 255 * 0.063761, g: 255 * 0.086895, b: 255 * 0.123646, a: 255 },
  { r: 255 * 0.084817, g: 255 * 0.111994, b: 255 * 0.16638, a: 255 },
  { r: 255 * 0.097489, g: 255 * 0.15412, b: 255 * 0.091064, a: 255 },
  { r: 255 * 0.106152, g: 255 * 0.131144, b: 255 * 0.195191, a: 255 },
  { r: 255 * 0.097721, g: 255 * 0.110188, b: 255 * 0.187229, a: 255 },
  { r: 255 * 0.133516, g: 255 * 0.138278, b: 255 * 0.148582, a: 255 },
  { r: 255 * 0.070006, g: 255 * 0.243332, b: 255 * 0.235792, a: 255 },
  { r: 255 * 0.196766, g: 255 * 0.142899, b: 255 * 0.214696, a: 255 },
  { r: 255 * 0.047281, g: 255 * 0.315338, b: 255 * 0.32197, a: 255 },
  { r: 255 * 0.204675, g: 255 * 0.39001, b: 255 * 0.302066, a: 255 },
  { r: 255 * 0.080955, g: 255 * 0.314821, b: 255 * 0.661491, a: 255 },
];

export const end_portal_mask = (coord, size, time) => {
  let width = Math.floor(size.x);
  let height = Math.floor(size.y);

  //const height = Math.floor(width * screenSize.y / screenSize.x);

  let x = Math.floor(coord.x) % width;
  let y = Math.floor(coord.y - 4000 * time) % height;

  let pixel_size = 3;

  x -= x % pixel_size;
  y -= y % pixel_size;

  let result = noise(x, y);
  if (result > 0.5) {
    return 1.0;
  }

  result = noise(x, y + pixel_size);
  if (result > 0.5) {
    return 0.5;
  }

  result = noise(x, y + 2 * pixel_size);
  if (result > 0.5) {
    return 0.1;
  }

  return 0.0;
};

export const portal = (pos, size, time) => {
  let x = Math.floor(size.x * pos.x) % size.x;
  let y = (Math.floor(size.y * pos.y) - time) % size.y;

  let pixel_size = 3;

  x -= x % pixel_size;
  y -= y % pixel_size;

  let threshold = 0.97;

  let result = noise(x, y);
  if (result > threshold) {
    return 1.0;
  }

  result = noise(x, y + pixel_size);
  if (result > threshold) {
    return 0.5;
  }

  result = noise(x, y + 2 * pixel_size);
  if (result > threshold) {
    return 0.1;
  }

  return 0.0;
};

export const fluid = (pos, size, dir, density, hasTail, speed, time) => {
  let offsetA = 0.125 * speed * time;
  let offsetB = Math.floor(offsetA);
  let offsetC = offsetB - 1;
  offsetA = offsetA - offsetB;

  let oldValue = 0.0;
  let newValue = 0.0;

  let new_x = Math.floor(size.x * pos.x - offsetB * dir.x) % size.x;
  let new_y = Math.floor(size.y * pos.y - offsetB * dir.y) % size.y;
  let old_x = Math.floor(size.x * pos.x - offsetC * dir.x) % size.x;
  let old_y = Math.floor(size.y * pos.y - offsetC * dir.y) % size.y;

  let threshold = 0.9 - 0.05 * density;

  let result = noise(new_x, new_y);
  if (result > threshold) newValue = 0.8;
  else if (result < 0.1) newValue = 0.1;

  if (hasTail) {
    if (noise(new_x + dir.x, new_y + dir.y) > threshold) newValue += 0.6;
    if (noise(new_x + 2 * dir.x, new_y + 2 * dir.y) > threshold)
      newValue += 0.4;
    if (noise(new_x + 3 * dir.x, new_y + 3 * dir.y) > threshold)
      newValue += 0.2;
  }

  result = noise(old_x, old_y);
  if (result > threshold) oldValue = 0.8;
  else if (result < 0.1) oldValue = 0.1;

  if (hasTail) {
    if (noise(old_x + dir.x, old_y + dir.y) > threshold) oldValue += 0.6;
    if (noise(old_x + 2 * dir.x, old_y + 2 * dir.y) > threshold)
      oldValue += 0.4;
    if (noise(old_x + 3 * dir.x, old_y + 3 * dir.y) > threshold)
      oldValue += 0.2;
  }

  return offsetA * newValue + (1.0 - offsetA) * oldValue;
};

export const impulseMask = (invert, fade, delay, offset, speed, time) => {
  const progress = (speed * time) / 20;

  const maxSequence = (delay + 1) * 16;
  const sequence_0 = Math.floor(progress % maxSequence);

  const val_0 = (sequence_0 === offset) !== invert ? 1.0 : 0.0;

  if (!fade) {
    return val_0;
  }

  const next = Math.floor((sequence_0 + 1) % maxSequence);
  const val_1 = (next === offset) !== invert ? 1.0 : 0.0;

  const delta = progress - Math.floor(progress);
  return delta * val_1 + (1 - delta) * val_0;
};

export const sineMask = (invert, fade, delay, offset, speed, time) => {
  const maxAngle = 2 * Math.PI * (delay + 1);
  const progress = (speed * time) / 20;
  const angle = (progress - (2 * Math.PI * offset) / 16.0) % maxAngle;

  if (angle > 2 * Math.PI) {
    return invert ? 1.0 : 0.0;
  }

  const val = 0.5 - 0.5 * Math.cos(angle);
  return invert ? 1.0 - val : val;
};

export const squareMask = (invert, fade, delay, offset, speed, time) => {
  const maxAngle = 2 * Math.PI * (delay + 1);
  const progress = (speed * time) / 20;
  const angle = (progress - (2 * Math.PI * offset) / 16.0) % maxAngle;

  if (angle > 2 * Math.PI) {
    return invert ? 1.0 : 0.0;
  }

  const val = angle <= Math.PI ? 1.0 : 0.0;
  return invert ? 1.0 - val : val;
};

export const sawtoothMask = (invertX, invertY, delay, offset, speed, time) => {
  const maxAngle = 2 * Math.PI * (delay + 1);
  const progress = (speed * time) / 20;
  let angle = (progress - (2 * Math.PI * offset) / 16.0) % maxAngle;

  if (angle > 2 * Math.PI) {
    return invertY ? 1.0 : 0.0;
  }

  angle = invertX ? 2 * Math.PI - angle : angle;
  const val = angle / (2 * Math.PI);
  return invertY ? 1.0 - val : val;
};

export const heartMask = (invertX, invertY, delay, offset, speed, time) => {
  const maxAngle = 2 * Math.PI * (delay + 1);
  const progress = (speed * time) / 20;
  let angle = (progress - (2 * Math.PI * offset) / 16.0) % maxAngle;

  if (angle > 2 * Math.PI) {
    return invertY ? 1.0 : 0.0;
  }

  angle = invertX ? 2 * Math.PI - angle : angle;
  let val = 0;

  if (angle < Math.PI / 4) {
    val = 1.0 - angle / (Math.PI / 2);
  } else {
    angle -= Math.PI / 4;
    val = 1.0 - angle / ((7 * Math.PI) / 4);
  }

  return invertY ? 1.0 - val : val;
};
