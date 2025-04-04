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
      
      const b_table = [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1.0];
      const h_table = [360, 0, 120, 240, 180, 60, 300, 24];
      const s_table = [1, 1, 1, 1, 1, 0.4, 0.2, 0.1];
      const v_table = [0.3, 0.4, 0.5, 0.6, 1.0, 1.0, 1.0, 1.0];

      const x = programId % 8;
      const y = Math.floor(programId / 8);

      const h = h_table[y];
      const s = y > 0 ? s_table[x] : 0.0;
      const v = y > 0 ? v_table[x] : b_table[x];

      const kr = (5 + (h / 60)) % 6;
      const kg = (3 + (h / 60)) % 6;
      const kb = (1 + (h / 60)) % 6;

      const r = 255 * (v - v*s*Math.max(0, Math.min(kr,4-kr,1)));
      const g = 255 * (v - v*s*Math.max(0, Math.min(kg,4-kg,1)));
      const b = 255 * (v - v*s*Math.max(0, Math.min(kb,4-kb,1)));

      const a = (x === 0 && y === 0) ? 0 : 255;
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
