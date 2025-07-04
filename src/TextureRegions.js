
const regions = {
  
  tex_00:{
    /** Players */
    id: 0,
    size:   {width: 64, height: 64},
    data:   { x_0: 0,  x_1: 0,  y_0: 0,  y_1: 0  },
    program:{ x_0: 56, x_1: 63, y_0: 32, y_1: 39 },
    palette:{ x_0: 56, x_1: 63, y_0: 40, y_1: 47 }
  },
  tex_01:{
    /** Tiny Mobs (Allay, Vex, etc.) */
    id: 1,
    size:   {width: 32, height: 32},
    data:   { x_0: 0,  x_1: 0,  y_0: 0,  y_1: 0  },
    program:{ x_0: 24, x_1: 31, y_0: 24, y_1: 27 },
    palette:{ x_0: 24, x_1: 31, y_0: 28, y_1: 31 }
  },
  tex_02:{
    /** Foxes */
    id: 2,
    size:   {width: 48, height: 32},
    data:   { x_0: 0,  x_1: 0,  y_0: 0,  y_1: 0  },
    program:{ x_0: 0,  x_1: 7,  y_0: 17, y_1: 20 },
    palette:{ x_0: 20, x_1: 27, y_0: 17, y_1: 20 }
  },
  tex_03:{
    /** Frogs */
    id: 3,
    size:   {width: 48, height: 48},
    data:   { x_0: 0,  x_1: 0,  y_0: 0,  y_1: 0  },
    program:{ x_0: 40, x_1: 47, y_0: 40, y_1: 43 },
    palette:{ x_0: 40, x_1: 47, y_0: 44, y_1: 47 }
  },
  tex_04:{
    /** Most Small Entities */
    id: 4,
    size:   {width: 64, height: 32},
    data:   { x_0: 0,  x_1: 0,  y_0: 0,  y_1: 0 },
    program:{ x_0: 56, x_1: 63, y_0: 24, y_1: 27 },
    palette:{ x_0: 56, x_1: 63, y_0: 28, y_1: 31 }
  },
  tex_05:{
    /** Chickens and Endermen */
    id: 5,
    size:   {width: 64, height: 32},
    data:   { x_0: 0,  x_1: 0,  y_0: 0,  y_1: 0  },
    program:{ x_0: 48, x_1: 55, y_0: 8,  y_1: 11 },
    palette:{ x_0: 48, x_1: 55, y_0: 12, y_1: 15 }
  },
  tex_06:{
    /** Most Medium Mobs */
    id: 6,
    size:   {width: 64, height: 64},
    data:   { x_0: 0,  x_1: 0,  y_0: 0,  y_1: 0  },
    program:{ x_0: 56, x_1: 63, y_0: 56, y_1: 59 },
    palette:{ x_0: 56, x_1: 63, y_0: 60, y_1: 63 }
  },
  tex_07:{
    /** Cows and Creaking */
    id: 7,
    size:   {width: 64, height: 64},
    data:   { x_0: 0, x_1: 0, y_0: 0,  y_1: 0  },
    program:{ x_0: 0, x_1: 7, y_0: 56, y_1: 59 },
    palette:{ x_0: 0, x_1: 7, y_0: 60, y_1: 63 }
  },
  tex_08:{
    /** Goats and Pandas */
    id: 8,
    size:   {width: 64, height: 64},
    data:   { x_0: 0, x_1: 0, y_0: 0, y_1: 0 },
    program:{ x_0: 0, x_1: 7, y_0: 30, y_1: 33 },
    palette:{ x_0: 0, x_1: 7, y_0: 34, y_1: 37 }
  },
  tex_09:{
    /** Horses */
    id: 9,
    size:   {width: 64, height: 64},
    data:   { x_0: 0,  x_1: 0,  y_0: 0, y_1: 0 },
    program:{ x_0: 56, x_1: 63, y_0: 0, y_1: 3 },
    palette:{ x_0: 56, x_1: 63, y_0: 4, y_1: 7 }
  },
  tex_10:{
    /** Stiders and Witches */
    id: 10,
    size:   {width: 64, height: 128},
    data:   { x_0: 0,  x_1: 0,  y_0: 0,   y_1: 0   },
    program:{ x_0: 56, x_1: 63, y_0: 120, y_1: 123 },
    palette:{ x_0: 56, x_1: 63, y_0: 124, y_1: 127 }
  },
  tex_11:{
    /** Most Large Entities */
    id: 11,
    size:   {width: 128, height: 64},
    data:   { x_0: 0,   x_1: 0,   y_0: 0,  y_1: 0  },
    program:{ x_0: 120, x_1: 127, y_0: 56, y_1: 59 },
    palette:{ x_0: 120, x_1: 127, y_0: 60, y_1: 63 }
  },
  tex_12:{
    /** Hoglins and Zoglins */
    id: 12,
    size:   {width: 128, height: 64},
    data:   { x_0: 0,   x_1: 0,   y_0: 0, y_1: 0 },
    program:{ x_0: 120, x_1: 127, y_0: 0, y_1: 3 },
    palette:{ x_0: 120, x_1: 127, y_0: 4, y_1: 7 }
  },
  tex_13:{
    /** Giant Entites */
    id: 13,
    size:   {width: 128, height: 128},
    data:   { x_0: 0, x_1: 0, y_0: 0, y_1: 0 },
    program:{ x_0: 120, x_1: 127, y_0: 120, y_1: 123 },
    palette:{ x_0: 120, x_1: 127, y_0: 124, y_1: 127 }
  },
  tex_14:{
    /** Sniffer */
    id: 14,
    size:   {width: 192, height: 192},
    data:   { x_0: 0, x_1: 0, y_0: 0, y_1: 0 },
    program:{ x_0: 184, x_1: 191, y_0: 0, y_1: 3 },
    palette:{ x_0: 184, x_1: 191, y_0: 4, y_1: 7 }
  },
  tex_15:{
    /** Dragon */
    id: 15,
    size:   {width: 256, height: 256},
    data:   { x_0: 0,   x_1: 0, y_0: 0,   y_1: 0 },
    program:{ x_0: 248, x_1: 0, y_0: 248, y_1: 3 },
    palette:{ x_0: 248, x_1: 4, y_0: 252, y_1: 7 }
  },
  tex_16:{
    /** Tadpoles */
    id: 16,
    size:   {width: 16, height: 16},
    data:   { x_0: 0, x_1: 0,  y_0: 0,  y_1: 0  },
    program:{ x_0: 8, x_1: 15, y_0: 8,  y_1: 11 },
    palette:{ x_0: 8, x_1: 15, y_0: 12, y_1: 15 },
  },
};

const GetId = (textureType) => {
  return regions[textureType].id;
}

const IsInRange = (x, y, range) => {
  return (x >= range.x_0 && x <= range.x_1 && y >= range.y_0 && y <= range.y_1);
}

const IsDataRegion = (x, y, textureType) => {
  const range = regions[textureType].data;
  return IsInRange(x, y, range);
};

const IsProgramRegion = (x, y, textureType) => {
  const range = regions[textureType].program;
  return IsInRange(x, y, range);
};

const IsPaletteRegion = (x, y, textureType) => {
  const range = regions[textureType].palette;
  return IsInRange(x, y, range);
};

const CoordToTexture = (x, y, textureType) => {
  const width = regions[textureType].size.width;
  return width * y + x;
};

const CoordToProgram = (x, y, textureType) => {
  const range = regions[textureType].program;
  return 8 * (y - range.y_0) + (x - range.x_0);
};

const CoordToPalette = (x, y, textureType) => {
  const range = regions[textureType].palette;
  return 8 * (y - range.y_0) + (x - range.x_0);
};

const TextureToCoord = (index, textureType) => {
  const width = regions[textureType].size.width
  return { x: index % width, y: Math.floor(index / width) };
};

const ProgramToCoord = (index, textureType) => {
  const range = regions[textureType].program;
  const x = index % 8;
  const y = Math.floor(index / 8);

  return { x: range.x_0 + x, y: range.y_0 + y};
};

const PaletteToCoord = (index, textureType) => {
  const range = regions[textureType].palette;
  const x = index % 8;
  const y = Math.floor(index / 8);

  return { x: range.x_0 + x, y: range.y_0 + y};
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
  GetId,
  IsDataRegion,
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
