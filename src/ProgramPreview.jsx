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
import { hsvToRgb, rgbToHsv, rgbaToColor } from "./ColorUtils";

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
  const [overridePrimary, setOverridePrimary] = React.useState(false);
  const [overrideSecondary, setOverrideSecondary] = React.useState(false);

  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    setId(program.b >> 4);
    setSpeed(program.b & 7);
    setPrimaryColor(
      colors[program.r & 63].color ?? { r: 0, g: 0, b: 0, a: 255 },
    );
    setSecondaryColor(
      colors[program.g & 63].color ?? { r: 0, g: 0, b: 0, a: 255 },
    );
    setOverridePrimary((0 === program.r) & 63);
    setOverrideSecondary((0 === program.g) & 63);

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
      ctx.fillStyle = rgbaToColor({ r: 0, g: 0, b: 0, a: 255 });
      ctx.fillRect(0, 0, 192, 192);

      const step = (8 - speed) * 20.0 / 16.0;
      const cycleTicks = (8 - speed) * 20;
      const maxTicks = (1 + crumb) * cycleTicks;
      const progress = ((maxTicks + time - (step * nibble)) % maxTicks) / cycleTicks;

      for (let x = 0; x < 192; x++) {
        for (let y = 0; y < 192; y++) {
          let mixPercent = 0.0;

          let primary = { ...primaryColor };
          let secondary = { ...secondaryColor };

          if (overridePrimary) {
            primary.a = 255;
            primary.r = 15 * Math.floor(x / 12);
            primary.g = 15 * Math.floor(y / 12);
            primary.b = 128;
          }

          if (overrideSecondary) {
            secondary.a = 255;
            secondary.r = 15 * Math.floor(x / 12);
            secondary.g = 15 * Math.floor(y / 12);
            secondary.b = 128;
          }

          const pos = { x: x / 192, y: y / 192 };

          if (id === 0) {
          } else if (id === 1) {
            // End Portal
            primary = boolA ? primary : VOID_COLORS[0];
            let particleColor = boolA ? primary : VOID_COLORS[0];

            let hasParticle = false;

            for (let i = 0; i < nibble + 1; i++) {
              const layerColor = boolB ? secondary : VOID_COLORS[i];

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
            let { h, s, v } = rgbToHsv(primary);
            h = (h + t) % 360;
            secondary = { ...hsvToRgb({ h, s, v }), a: primary.a };
            mixPercent = 1.0;
          } else if (id === 4) {
            // Impulse Mask
            mixPercent = impulseMask(progress);
            if (boolB) {
              let opacity = secondary.a / 255.0;
              secondary = {
                r: (1 - opacity) * primary.r + opacity * secondary.r,
                g: (1 - opacity) * primary.g + opacity * secondary.g,
                b: (1 - opacity) * primary.b + opacity * secondary.b,
                a: Math.max(primary.a, secondary.a),
              };
            }
          } else if (id === 5) {
            // Square Mask
            mixPercent = squareMask(progress);
            if (boolB) {
              let opacity = secondary.a / 255.0;
              secondary = {
                r: (1 - opacity) * primary.r + opacity * secondary.r,
                g: (1 - opacity) * primary.g + opacity * secondary.g,
                b: (1 - opacity) * primary.b + opacity * secondary.b,
                a: Math.max(primary.a, secondary.a),
              };
            }
          } else if (id === 6) {
            // Sine Mask
            mixPercent = sineMask(progress);
            if (boolB) {
              let opacity = secondary.a / 255.0;
              secondary = {
                r: (1 - opacity) * primary.r + opacity * secondary.r,
                g: (1 - opacity) * primary.g + opacity * secondary.g,
                b: (1 - opacity) * primary.b + opacity * secondary.b,
                a: Math.max(primary.a, secondary.a),
              };
            }
          } else if (id === 7) {
            // Sawtooth Mask
            mixPercent = sawtoothMask(progress);
            if (boolB) {
              let opacity = secondary.a / 255.0;
              secondary = {
                r: (1 - opacity) * primary.r + opacity * secondary.r,
                g: (1 - opacity) * primary.g + opacity * secondary.g,
                b: (1 - opacity) * primary.b + opacity * secondary.b,
                a: Math.max(primary.a, secondary.a),
              };
            }
          } else if (id === 8) {
            // Heartbeat Mask
            mixPercent = heartMask(progress);
            if (boolB) {
              let opacity = secondary.a / 255.0;
              secondary = {
                r: (1 - opacity) * primary.r + opacity * secondary.r,
                g: (1 - opacity) * primary.g + opacity * secondary.g,
                b: (1 - opacity) * primary.b + opacity * secondary.b,
                a: Math.max(primary.a, secondary.a),
              };
            }
          }

          const result = interpolate(primary, secondary, mixPercent);

          ctx.fillStyle = rgbaToColor(result);
          ctx.fillRect(x, y, 1, 1);
        }
      }
    },
    [
      time,
      id,
      boolA,
      boolB,
      crumb,
      nibble,
      primaryColor,
      secondaryColor,
      speed,
      dir,
      overridePrimary,
    ],
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
