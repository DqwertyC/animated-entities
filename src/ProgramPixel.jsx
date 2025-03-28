import { useMemo } from "react";

const ProgramPixel = ({
  programId,
  programColor,
  onClick,
  onDoubleClick,
  highlight,
  programVisible,
}) => {
  const rgba2color = (rgba) => {
    return `rgb(${rgba.r},${rgba.g},${rgba.b},${rgba.a / 255.0})`;
  };

  const updatedColor = useMemo(() => {
    if (programVisible) {
      const r = ((programId & 32) << 2) + ((programId & 4) << 4);
      const g = ((programId & 16) << 3) + ((programId & 2) << 5);
      const b = ((programId & 8) << 4) + ((programId & 1) << 6);
      const a = 255;
      return rgba2color({ r, g, b, a });
    }

    return rgba2color(programColor);
  }, [programVisible, programColor, programId]);

  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={{
        width: "24px",
        height: "24px",
        backgroundColor: updatedColor,
        borderColor: "white",
        borderWidth: highlight ? "2px" : "0px",
      }}
    />
  );
};

export default ProgramPixel;
