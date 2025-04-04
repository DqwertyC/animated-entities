export const noise = (x, y) => {
  let seed = Math.floor(x) * 73;
  seed ^= 0xe56faa12;
  seed += Math.floor(y) * 179;
  seed ^= 0x69628a2d;
  return ((Math.floor((seed % 201) + 201) % 201) - 100) / 100.0;
};

export const portal = (pos, size, speed, time) => {
  return 3 * (fluid(pos, {x:3 * size.x, y:3 * size.y}, {x:0,y:-1}, 0, false, speed, 0) - 0.2)+ 3 * (fluid(pos, size, {x:1,y:1}, 0, false, speed, 0) - 0.2) + (fluid(pos, {x:2 * size.x, y:2 * size.y}, {x:-3,y:1}, 0, true, speed, 0) - 0.2);
}

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
