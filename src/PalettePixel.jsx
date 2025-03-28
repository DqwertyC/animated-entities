const PalettePixel = ({ rgba, onClick, highlight }) => {
  const rgba2color = (rgba) => {
    return `rgb(${rgba.r},${rgba.g},${rgba.b},${rgba.a / 255.0})`;
  };
  return (
    <div
      onClick={onClick}
      style={{
        width: "24px",
        height: "24px",
        backgroundColor: rgba2color(rgba),
        borderColor: "white",
        borderWidth: highlight ? "2px" : "0px",
      }}
    />
  );
};

export default PalettePixel;
