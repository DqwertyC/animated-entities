import { useMemo } from "react";
import { rgbaToColor, idToColor } from "./ColorUtils";

const TexturePixel = ({
  rgba,
  programId,
  onClick,
  onHover,
  editable,
  programVisible,
  index,
  highlight,
}) => {
  const updatedColor = useMemo(() => {
    if (programId === 0) return rgbaToColor(rgba);

    // Yes, this *should* be an external function...
    if (programVisible) {
      return idToColor(programId);
    }

    const newColor = { ...rgba };
    newColor.r += ((programId & 32) >> 4) + ((programId & 4) >> 2);
    newColor.g += ((programId & 16) >> 3) + ((programId & 2) >> 1);
    newColor.b += ((programId & 8) >> 2) + ((programId & 1) >> 0);

    return rgbaToColor(newColor);
  }, [rgba, programId, programVisible]);

  return (
    <div
      onMouseDown={editable ? onClick : null}
      onMouseEnter={editable ? onHover : null}
      style={{
        width: "8px",
        height: "8px",
        backgroundColor: updatedColor,
        borderColor: "white",
        borderWidth: highlight ? "2px" : "0px",
      }}
    />
  );
};

export default TexturePixel;
