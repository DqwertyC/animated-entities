import React from "react";
import {
  fluid,
  heartMask,
  impulseMask,
  portal,
  sawtoothMask,
  sineMask,
  squareMask,
  VOID_COLORS,
} from "./Programs";
import { hsvToRgb, rgbToHsv } from "./ColorUtils";

const ProgramPreview = ({ program, colors, time }) => {
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

  const interpolate = (primary, secondary, mixPercent) => {
    const r = (1 - mixPercent) * primary.r + mixPercent * secondary.r;
    const g = (1 - mixPercent) * primary.g + mixPercent * secondary.g;
    const b = (1 - mixPercent) * primary.b + mixPercent * secondary.b;
    const a = (1 - mixPercent) * primary.a + mixPercent * secondary.a;
    return { r, g, b, a };
  };

  const draw = React.useCallback(
    (ctx) => {
      for (let x = 0; x < 192; x++) {
        for (let y = 0; y < 192; y++) {
          let mixPercent = 0.0;

          let primary = primaryColor;
          let secondary = secondaryColor;
          const pos = { x: x / 192, y: y / 192 };

          if (id === 1) {
            // End Portal
            primary = boolA ? primaryColor : VOID_COLORS[0];
            let particleColor = boolA ? primaryColor : VOID_COLORS[0];

            let hasParticle = false;

            for (let i = 0; i < nibble + 1; i++) {
              const layerColor = boolB ? secondaryColor : VOID_COLORS[i];

              const scale = {
                x: 384 / (i + 1),
                y: 384 / (i + 1),
              };

              const angle = i * i * 72 + i * 0.2;
              const newPos = {
                x: pos.x * Math.cos(angle) - pos.y * Math.sin(angle),
                y: pos.y * Math.cos(angle) + pos.x * Math.sin(angle),
              };

              let layerPercent = portal(newPos, scale, time);

              if (layerPercent > 0) {
                hasParticle = true;
                particleColor = {
                  r: particleColor.r + layerPercent * layerColor.r,
                  g: particleColor.g + layerPercent * layerColor.g,
                  b: particleColor.b + layerPercent * layerColor.b,
                  a: 255,
                };
              }
            }

            secondary = hasParticle ? particleColor : primary;
            mixPercent = 1.0;
          } else if (id === 2) {
            // Fluid
            const scale = {
              x: boolA ? 32 : 16,
              y: boolA ? 32 : 16,
            };
            mixPercent = fluid(pos, scale, dir, nibble, boolB, speed, time);
          } else if (id === 3) {
            // Hue Shift
            const t = (boolA ? -1 : 1) * speed * time;
            let { h, s, v } = rgbToHsv(primaryColor);
            h = (h + t) % 360;
            secondary = { ...hsvToRgb({ h, s, v }), a: primary.a };
            mixPercent = 1.0;
          } else if (id === 4) {
            // Impulse Mask
            mixPercent = impulseMask(
              boolA,
              boolB,
              crumb,
              nibble,
              speed,
              time,
            );
          } else if (id === 5) {
            // Square Mask
            mixPercent = squareMask(
              boolA,
              boolB,
              crumb,
              nibble,
              speed,
              time,
            );
          } else if (id === 6) {
            // Sine Mask
            mixPercent = sineMask(
              boolA,
              boolB,
              crumb,
              nibble,
              speed,
              time,
            );
          } else if (id === 7) {
            // Sawtooth Mask
            mixPercent = sawtoothMask(
              boolA,
              boolB,
              crumb,
              nibble,
              speed,
              time,
            );
          } else if (id === 8) {
            // Heartbeat Mask
            mixPercent = heartMask(
              boolA,
              boolB,
              crumb,
              nibble,
              speed,
              time,
            );
          }

          const result = interpolate(primary, secondary, mixPercent);

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
