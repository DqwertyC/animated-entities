import { useMemo } from "react";
import {rgbaToColor, idToColor} from "./ColorUtils"

const ProgramPixel = ({
  programId,
  programColor,
  onClick,
  onDoubleClick,
  highlight,
  programVisible,
}) => {
  const updatedColor = useMemo(() => {
    if (programVisible) {
      return idToColor(programId);
    }

    return rgbaToColor(programColor);
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
