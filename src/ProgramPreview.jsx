import React from "react";
import { fluid, portal } from "./Programs";

const ProgramPreview = ({ program, colors }) => {
  const [time, setTime] = React.useState((Date.now() / 50) % 24000);
  const [id, setId] = React.useState(0);
  const [speed, setSpeed] = React.useState(0);
  const [primaryColor, setPrimaryColor] = React.useState({
    r: 0,
    g: 0,
    b: 0,
    a: 255,
  });
  const [secondaryColor, setSecondaryColor] = React.useState({
    r: 255,
    g: 255,
    b: 255,
    a: 255,
  });
  const [boolA, setBoolA] = React.useState(false);
  const [boolB, setBoolB] = React.useState(false);
  const [crumb, setCrumb] = React.useState(0);
  const [nibble, setNibble] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime((Date.now() / 50) % 24000);
    }, 20); // 20 ms

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const rgba2color = (rgba) => {
    return `rgb(${rgba.r},${rgba.g},${rgba.b},${rgba.a / 255.0})`;
  };

  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    setId(program.b >> 4);
    setSpeed(program.b & 7);
    setPrimaryColor(colors[program.r & 63].color);
    setSecondaryColor(colors[program.g & 63].color);

    setBoolA((program.a & 128) > 0);
    setBoolB((program.a & 64) > 0);
    setCrumb((program.a & 48) >> 4);
    setNibble(program.a & 15);
  }, [program, colors]);

  const dir = React.useMemo(() => {
    return crumb === 0
      ? { x: 0, y: 1 }
      : crumb === 1
        ? { x: 0, y: -1 }
        : crumb === 3
          ? { x: -1, y: 0 }
          : { x: 1, y: 0 };
  }, [crumb]);

  const interpolate = (primary, secondary, factor) => {
    const r = (1 - factor) * primary.r + factor * secondary.r;
    const g = (1 - factor) * primary.g + factor * secondary.g;
    const b = (1 - factor) * primary.b + factor * secondary.b;
    const a = (1 - factor) * primary.a + factor * secondary.a;
    return { r, g, b, a };
  };

  const draw = React.useCallback(
    (ctx) => {
      for (let x = 0; x < 192; x++) {
        for (let y = 0; y < 192; y++) {
          let factor = 0.0;

          let primary = primaryColor;
          let secondary = secondaryColor;
          const pos = { x: x / 192, y: y / 192 };

          if (id === 1) {
            if (!boolA) {
              primary = { r: 0, g: 0, b: 0, a: 255 };
            }

            if (!boolB) {
              secondary = { r: 52, g: 100, b: 77, a: 255 };
            }

            factor = portal(pos, {x:16, y:16}, speed, time);
          } else if (id === 2) {
            factor = fluid(
              pos,
              {
                x: boolA ? 32 : 16,
                y: boolA ? 32 : 16,
              },
              dir,
              nibble,
              boolB,
              speed,
              time,
            );
          }

          const result = interpolate(primary, secondary, factor);

          ctx.fillStyle = rgba2color(result);
          ctx.fillRect(x, y, 1, 1);
        }
      }
    },
    [time, id, boolA, boolB, nibble, primaryColor, secondaryColor, speed, dir],
  );

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    //Our first draw
    draw(context);
  }, [draw]);

  return <canvas ref={canvasRef} width={192} height={192}></canvas>;
};

export default ProgramPreview;
