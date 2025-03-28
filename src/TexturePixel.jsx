import { useMemo } from "react";

const TexturePixel = ({ rgba, programId, onClick, editable, programVisible, index }) => {

  const rgba2color = (rgba) => {
    return `rgb(${rgba.r},${rgba.g},${rgba.b},${rgba.a / 255.0})`
  }

  const updatedColor = useMemo(() => {
    if (programId === 0) return rgba2color(rgba);

    if (programVisible)
    {
      const r = ((programId & 32) << 2) + ((programId & 4) << 4);
      const g = ((programId & 16) << 3) + ((programId & 2) << 5);
      const b = ((programId & 8) << 4) + ((programId & 1) << 6);
      const a = 255;
      return rgba2color({r, g, b, a});
    }
    
    const newColor = {...rgba};
    newColor.r += ((programId & 32) >> 4) + ((programId & 4) >> 2);
    newColor.g += ((programId & 16) >> 3) + ((programId & 2) >> 1);
    newColor.b += ((programId & 8) >> 2) + ((programId & 1) >> 0);

    return rgba2color(newColor);
  }, [rgba, programId, programVisible])

  return (
    <div
      onClick={editable ? onClick : null}
      style={{
        width: "8px",
        height: "8px",
        backgroundColor: updatedColor,
      }}
    />
  );
};

export default TexturePixel;
