const IsDataRegion = (x, y, textureType) => {
  if (textureType === "chicken") return x >= 0 && x <= 2 && y >= 0 && y <= 2;

  if (textureType === "quadruped") return x >= 0 && x <= 7 && y >= 0 && y <= 7;

  if (textureType === "humanoid") return x >= 0 && x <= 7 && y >= 0 && y <= 7;

  return false;
};

const IsDataMask = (x, y, textureType) => {
  if (textureType === "chicken") return x === 1 && y === 1;

  return (
    (x >= 1 && x <= 2 && y >= 1 && y <= 2) ||
    (x >= 5 && x <= 6 && y >= 1 && y <= 2) ||
    (x >= 3 && x <= 4 && y >= 3 && y <= 5) ||
    (x === 2 && y >= 4 && y <= 6) ||
    (x === 5 && y >= 4 && y <= 6)
  );
};

const IsProgramRegion = (x, y, textureType) => {
  if (textureType === "chicken") return x >= 0 && x <= 7 && y >= 24 && y <= 31;

  if (textureType === "quadruped")
    return x >= 0 && x <= 7 && y >= 56 && y <= 63;

  if (textureType === "humanoid")
    return x >= 56 && x <= 63 && y >= 32 && y <= 39;

  return false;
};

const IsPaletteRegion = (x, y, textureType) => {
  if (textureType === "chicken") return x >= 8 && x <= 15 && y >= 24 && y <= 31;

  if (textureType === "quadruped")
    return x >= 8 && x <= 15 && y >= 56 && y <= 63;

  if (textureType === "humanoid")
    return x >= 56 && x <= 63 && y >= 40 && y <= 47;

  return false;
};

const CoordToTexture = (x, y, textureType) => {
  return 64 * y + x;
};

const CoordToProgram = (x, y, textureType) => {
  if (textureType === "chicken") return 8 * (y - 24) + (x - 0);

  if (textureType === "quadruped") return 8 * (y - 56) + (x - 0);

  if (textureType === "humanoid") return 8 * (y - 32) + (x - 56);
};

const CoordToPalette = (x, y, textureType) => {
  if (textureType === "chicken") return 8 * (y - 24) + (x - 8);

  if (textureType === "quadruped") return 8 * (y - 56) + (x - 8);

  if (textureType === "humanoid") return 8 * (y - 40) + (x - 56);
};

const TextureToCoord = (index, textureType) => {
  return { x: index % 64, y: Math.floor(index / 64) };
};

const ProgramToCoord = (index, textureType) => {
  const x = index % 8;
  const y = Math.floor(index / 8);
  if (textureType === "chicken") return { x: x + 0, y: y + 24 };

  if (textureType === "quadruped") return { x: x + 0, y: y + 56 };

  if (textureType === "humanoid") return { x: x + 56, y: y + 32 };
};

const PaletteToCoord = (index, textureType) => {
  const x = index % 8;
  const y = Math.floor(index / 8);
  
  if (textureType === "chicken") return { x: x + 8, y: y + 24 };

  if (textureType === "quadruped") return { x: x + 8, y: y + 56 };

  if (textureType === "humanoid") return { x: x + 56, y: y + 40 };
};

const PaletteToTexture = (index, textureType) => {
  const coord = PaletteToCoord(index, textureType);
  return CoordToTexture(coord.x, coord.y, textureType);
};

const ProgramToTexture = (index, textureType) => {
  const coord = ProgramToCoord(index, textureType);
  return CoordToTexture(coord.x, coord.y, textureType);
}

const IsNormalRegion = (x, y, textureType) => {
  return (
    !IsDataRegion(x, y, textureType) &&
    !IsProgramRegion(x, y, textureType) &&
    !IsPaletteRegion(x, y, textureType)
  );
};

const TextureHelper = {
  IsDataRegion,
  IsDataMask,
  IsNormalRegion,
  IsPaletteRegion,
  IsProgramRegion,
  TextureToCoord,
  CoordToTexture,
  CoordToPalette,
  CoordToProgram,
  PaletteToTexture,
  ProgramToTexture
};
export default TextureHelper;
