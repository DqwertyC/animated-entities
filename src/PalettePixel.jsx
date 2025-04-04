
import {rgbaToColor} from "./ColorUtils"

const PalettePixel = ({ rgba, onClick, highlight }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: "24px",
        height: "24px",
        backgroundColor: rgbaToColor(rgba),
        borderColor: "white",
        borderWidth: highlight ? "2px" : "0px",
      }}
    />
  );
};

export default PalettePixel;
