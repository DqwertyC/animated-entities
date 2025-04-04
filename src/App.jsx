import {
  ImageIcon,
  Download,
  Eye,
  EyeClosed,
  Pause,
  Play,
  Youtube,
  Github,
  Check,
  X,
} from "lucide-react";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { PNG } from "pngjs/browser";
import { Colorful } from "@uiw/react-color";
import { toast, Toaster } from "react-hot-toast";
import TextureHelper from "./TextureRegions";
import TexturePixel from "./TexturePixel";
import ProgramPixel from "./ProgramPixel";
import PalettePixel from "./PalettePixel";
import ProgramPreview from "./ProgramPreview";
import { rgbaToHexa, rgbaToColor } from "./ColorUtils";
import resourcePack from "./res/EntityAnimationRP.zip";

const programInfo = [
  {
    programName: "Constant",
    boolNameA: "-",
    boolNameB: "-",
    crumbName: "-",
    crumbIsDir: false,
    nibbleName: "-",
    hasColorB: false,
  },
  {
    programName: "End Portal",
    boolNameA: "Use A:",
    boolNameB: "Use B:",
    crumbName: "-",
    crumbIsDir: false,
    nibbleName: "Particles:",
    hasColorB: true,
  },
  {
    programName: "Falling Fluid",
    boolNameA: "Small:",
    boolNameB: "Tail:",
    crumbName: "Direction:",
    crumbIsDir: true,
    nibbleName: "Density:",
    hasColorB: true,
  },
  {
    programName: "Shifting Hue",
    boolNameA: "Reverse:",
    boolNameB: "-",
    crumbName: "-",
    crumbIsDir: false,
    nibbleName: "-",
    hasColorB: false,
  },
  {
    programName: "Impulse",
    boolNameA: "Invert:",
    boolNameB: "Smooth:",
    crumbName: "Delay:",
    crumbIsDir: false,
    nibbleName: "Offset:",
    hasColorB: true,
  },
  {
    programName: "Square Wave",
    boolNameA: "Invert:",
    boolNameB: "-",
    crumbName: "Delay:",
    crumbIsDir: false,
    nibbleName: "Offset:",
    hasColorB: true,
  },
  {
    programName: "Sin Wave",
    boolNameA: "Invert:",
    boolNameB: "-",
    crumbName: "Delay:",
    crumbIsDir: false,
    nibbleName: "Offset:",
    hasColorB: true,
  },
  {
    programName: "Sawtooth Wave",
    boolNameA: "Invert:",
    boolNameB: "Reverse:",
    crumbName: "Delay:",
    crumbIsDir: false,
    nibbleName: "Offset:",
    hasColorB: true,
  },
  {
    programName: "Heartbeat",
    boolNameA: "Invert:",
    boolNameB: "Reverse:",
    crumbName: "Delay:",
    crumbIsDir: false,
    nibbleName: "Offset:",
    hasColorB: true,
  },
];

const hexToRgba = (hex) => {
  let r = Number.parseInt(hex.substring(1, 3), 16);
  let g = Number.parseInt(hex.substring(3, 5), 16);
  let b = Number.parseInt(hex.substring(5, 7), 16);
  let a = Number.parseInt(hex.substring(7, 9), 16);

  return { r, g, b, a };
};

const getFinalColor = ({ color, program }) => {
  const newColor = { ...color };
  newColor.r += ((program & 32) >> 4) + ((program & 4) >> 2);
  newColor.g += ((program & 16) >> 3) + ((program & 2) >> 1);
  newColor.b += ((program & 8) >> 2) + ((program & 1) >> 0);
  return newColor;
};

export default function App() {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [inputHeight, setInputHeight] = useState(0);
  const [inputWidth, setInputWidth] = useState(0);
  const [textureConfirmed, setTextureConfirmed] = useState(false);
  const [textureType, setTextureType] = useState("unknown");
  const hiddenFileInput = useRef(null);

  const [texturePixels, setTexturePixels] = useState([]);
  const [programPixels, setProgramPixels] = useState([]);
  const [palettePixels, setPalettePixels] = useState([]);

  const [selectedProgram, setSelectedProgram] = useState(0);
  const [selectedPalette, setSelectedPalette] = useState(-1);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [programVisible, setProgramVisible] = useState(true);

  const [showEditor, setShowEditor] = useState(false);
  const [editorProgramType, setEditorProgramType] = useState(false);
  const [editorColorA, setEditorColorA] = useState(0);
  const [editorColorB, setEditorColorB] = useState(0);
  const [editorEmissiveA, setEditorEmissiveA] = useState(false);
  const [editorEmissiveB, setEditorEmissiveB] = useState(false);

  const [editorSpeed, setEditorSpeed] = useState(1);
  const [editorBoolA, setEditorBoolA] = useState(false);
  const [editorBoolB, setEditorBoolB] = useState(false);
  const [editorCrumb, setEditorCrumb] = useState(false);
  const [editorNibble, setEditorNibble] = useState(false);
  const [editorResult, setEditorResult] = useState("#336699BB");

  const [showEditorPicker, setShowEditorPicker] = useState(false);
  const [editorPickerPrimary, setEditorPickerPrimary] = useState(false);

  const [pickerColor, setPickerColor] = useState("#FFFFFFFF");

  const [mouseDown, setMouseDown] = useState(false);

  const [gameTime, setGameTime] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(
      () => playing && setGameTime((old) => (old < 200 ? old + 1 : 0)),
      50,
    );
    return () => clearTimeout(timer);
  }, [playing, gameTime]);

  const handleClick = () => hiddenFileInput.current.click();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setImage(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleChange = (e) => {
    if (e.target?.files[0]) {
      setFile(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target.result;
        const png = new PNG();
        png.parse(buffer, (error, data) => {
          if (error) {
            console.error("Error parsing PNG:", error);
            return;
          }

          if (data.width !== 64 || (data.height !== 64 && data.height !== 32)) {
            toast.error("Invalid Texture!");
            setFile(null);
            setImage(null);
          } else {
            setInputWidth(data.width);
            setInputHeight(data.height);
            setTextureType(data.height === 64 ? "humanoid" : "chicken");
            setImageData(data.data);
          }
        });
      };

      reader.readAsArrayBuffer(file);
    }
  }, [file]);

  const processTexture = useCallback(() => {
    const texture = [];
    const palette = [];
    const program = [];

    const hasData =
      imageData[0] === 68 && imageData[1] === 113 && imageData[2] === 67;

    for (let y = 0; y < inputHeight; y++) {
      for (let x = 0; x < inputWidth; x++) {
        const index = inputWidth * y + x;
        const dataIndex = 4 * (inputWidth * y + x);

        let id = 0;
        let editable = false;

        let [r, g, b, a] = [
          imageData[dataIndex + 0],
          imageData[dataIndex + 1],
          imageData[dataIndex + 2],
          imageData[dataIndex + 3],
        ];

        if (TextureHelper.IsNormalRegion(x, y, textureType)) {
          if (hasData) {
            id =
              ((r & 0x02) << 4) +
              ((g & 0x02) << 3) +
              ((b & 0x02) << 2) +
              ((r & 0x01) << 2) +
              ((g & 0x01) << 1) +
              ((b & 0x01) << 0);
          }

          r &= 252;
          g &= 252;
          b &= 252;
          editable = true;
        } else if (TextureHelper.IsProgramRegion(x, y, textureType)) {
          program[TextureHelper.CoordToProgram(x, y, textureType)] = {
            color: { r, g, b, a },
          };
        } else if (TextureHelper.IsPaletteRegion(x, y, textureType)) {
          let paletteIndex = TextureHelper.CoordToPalette(x, y, textureType);
          palette[paletteIndex] = {
            color: { r, g, b, a },
          };
          if (paletteIndex === 1) {
            setPickerColor(rgbaToHexa({ r, g, b, a }));
          }
        } else if (TextureHelper.IsDataRegion(x, y, textureType)) {
          [r, g, b, a] = [
            68,
            113,
            67,
            textureType === "humanoid"
              ? 255
              : textureType === "quadruped"
                ? 254
                : 253,
          ];
          if (TextureHelper.IsDataMask(x, y, textureType)) {
            [r, g, b, a] = [1, 3, 0, 255];
          }
        }

        texture[index] = {
          color: { r, g, b, a },
          program: id,
          editable: editable,
        };
      }
    }

    setTexturePixels(texture);
    setProgramPixels(program);
    setPalettePixels(palette);
    setTextureConfirmed(true);
  }, [imageData, inputWidth, inputHeight, textureType]);

  const paintPixel = useCallback(
    (index) => {
      setTexturePixels((prevGrid) => {
        const newGrid = [...prevGrid];
        newGrid[index].program = selectedProgram;
        return newGrid;
      });
    },
    [selectedProgram],
  );

  const clickPixel = useCallback(
    (index) => {
      setMouseDown(true);
      document.addEventListener("mouseup", () => {
        setMouseDown(false);
      });
      paintPixel(index);
    },
    [paintPixel],
  );

  const selectProgram = useCallback(
    (index) => {
      setSelectedProgram(index);
    },
    [setSelectedProgram],
  );

  const openColorPicker = useCallback(
    (index) => {
      setSelectedPalette(index);
      const oldColor = palettePixels[index].color;
      setPickerColor(rgbaToHexa(oldColor));
      setColorPickerVisible(true);
    },
    [setSelectedPalette, palettePixels],
  );

  const closeColorPicker = useCallback(() => {
    const newColor = hexToRgba(pickerColor);

    setPalettePixels((oldPalette) => {
      const newPalette = [...oldPalette];
      newPalette[selectedPalette].color = newColor;
      return newPalette;
    });

    setTexturePixels((oldTexture) => {
      const newTexture = [...oldTexture];
      newTexture[
        TextureHelper.PaletteToTexture(selectedPalette, textureType)
      ].color = newColor;
      return newTexture;
    });

    setSelectedPalette(-1);
    setColorPickerVisible(false);
  }, [pickerColor, selectedPalette, textureType]);

  const openEditorPicker = useCallback((isPrimary) => {
    setEditorPickerPrimary(isPrimary);
    setShowEditorPicker(true);
  }, []);

  const closeEditorPicker = useCallback(
    (index) => {
      if (editorPickerPrimary) {
        setEditorColorA(index);
      } else {
        setEditorColorB(index);
      }
      setShowEditorPicker(false);
    },
    [editorPickerPrimary],
  );

  useEffect(() => {
    let [r, g, b, a] = [0, 0, 0, 0];
    r = ((editorEmissiveA ? 128 : 0) + (editorColorA & 63)) & 255;
    g = ((editorEmissiveB ? 128 : 0) + (editorColorB & 63)) & 255;
    b = (((editorProgramType & 15) << 4) + (editorSpeed & 7)) & 255;
    a =
      ((editorBoolA ? 128 : 0) +
        (editorBoolB ? 64 : 0) +
        ((editorCrumb << 4) & 48) +
        ((editorNibble << 0) & 15)) &
      255;

    setEditorResult(rgbaToHexa({ r, g, b, a }));
  }, [
    editorBoolA,
    editorBoolB,
    editorColorA,
    editorColorB,
    editorCrumb,
    editorEmissiveA,
    editorEmissiveB,
    editorNibble,
    editorProgramType,
    editorSpeed,
  ]);

  const updateEditor = useCallback(
    (value) => {
      if (value !== editorResult) {
        let { r, g, b, a } = hexToRgba(value);

        setEditorEmissiveA((r & 128) > 0);
        setEditorColorA(r & 15);
        setEditorEmissiveB((g & 128) > 0);
        setEditorColorB(g & 15);
        // Todo: Change this to 15 when we have more programs
        setEditorProgramType((b >> 4) & 7);
        setEditorSpeed(b & 7);

        setEditorBoolA((a & 128) > 0);
        setEditorBoolB((a & 64) > 0);
        setEditorCrumb((a & 48) >> 4);
        setEditorNibble(a & 15);
      }
    },
    [editorResult],
  );

  const openEditor = useCallback(
    (index) => {
      setSelectedProgram(index);
      updateEditor(rgbaToHexa(programPixels[index].color));
      setShowEditor(true);
    },
    [programPixels, updateEditor],
  );

  const closeEditor = useCallback(() => {
    const newColor = hexToRgba(editorResult);

    setProgramPixels((oldPrograms) => {
      const newPrograms = [...oldPrograms];
      newPrograms[selectedProgram].color = newColor;
      return newPrograms;
    });

    setTexturePixels((oldTexture) => {
      const newTexture = [...oldTexture];
      newTexture[
        TextureHelper.ProgramToTexture(selectedProgram, textureType)
      ].color = newColor;
      return newTexture;
    });

    setShowEditor(false);
  }, [editorResult, selectedProgram, textureType]);

  const getImageBlob = useCallback(() => {
    const png = new PNG({
      width: inputWidth,
      height: inputHeight,
    });
    const dataArray = new Uint8Array(inputWidth * inputHeight * 4);

    for (let i = 0; i < texturePixels.length; i++) {
      const finalColor = getFinalColor(texturePixels[i]);
      dataArray[4 * i + 0] = finalColor.r;
      dataArray[4 * i + 1] = finalColor.g;
      dataArray[4 * i + 2] = finalColor.b;
      dataArray[4 * i + 3] = finalColor.a;
    }

    png.data = dataArray;
    var buffer = PNG.sync.write(png);

    return new Blob([buffer]);
  }, [inputHeight, inputWidth, texturePixels]);

  const saveFile = useCallback(() => {
    const blob = getImageBlob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "animated_texture.png";
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [getImageBlob]);

  const previewColor = useMemo(() => {
    if (showEditor) return hexToRgba(editorResult);
    if (programPixels[selectedProgram])
      return programPixels[selectedProgram].color;

    return { r: 0, g: 0, b: 0, a: 255 };
  }, [showEditor, editorResult, programPixels, selectedProgram]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Animated Texture Editor</h1>
          <p className="text-xl text-gray-400">
            Create animations for entity textures in Minecraft.
          </p>
          <p className="text-xl text-gray-400">
            Requires the{" "}
            <u>
              <a href={resourcePack} download="EntityAnimationRP.zip">
                Animated Entity Shader
              </a>
            </u>
            . <br />
            Currently supports Humanoids, Cows, Pigs, and Chickens.
          </p>
        </header>

        {textureConfirmed ? (
          <main
            className="bg-gray-800 rounded-lg p-8 shadow-xl flex flex-col"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <div className="flex flex-row">
              <div
                className="flex flex-col"
                style={{ justifyContent: "space-between" }}
              >
                <div
                  className="bg-gray-500 rounded-lg p-2 shadow-xl"
                  style={{ height: "256px", width: "210px" }}
                >
                  {colorPickerVisible ? (
                    <>
                      <Colorful
                        color={pickerColor}
                        onChange={(color) => {
                          setPickerColor(color.hexa);
                        }}
                        style={{ width: "100%" }}
                      />
                      <div className="flex flex-row" style={{ width: "100%" }}>
                        <input
                          className="px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ width: "80%" }}
                          type="text"
                          value={pickerColor}
                          onChange={(e) => {
                            setPickerColor(e.target.value);
                          }}
                        />
                        <button
                          className="flex space-x-2 px-2 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-center"
                          style={{
                            width: "20%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            closeColorPicker();
                          }}
                        >
                          OK
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xl text-gray-100 text-center">
                        Program Colors
                      </div>
                      <div style={{ height: "8px" }} />
                      <div
                        style={{
                          display: "grid",
                          gridTemplateRows: "repeat(8, 24px)",
                          gridTemplateColumns: "repeat(8, 24px)",
                          width: "192px",
                          height: "192px",
                          gap: 0,

                          backgroundImage:
                            "linear-gradient(30deg, #808080 25%, transparent 25%), linear-gradient(-30deg, #808080 25%, transparent 25%), linear-gradient(30deg, transparent 75%, #808080 75%), linear-gradient(-30deg, transparent 75%, #808080 75%)",
                          backgroundSize: "20px 20px",
                          backgroundPosition:
                            "0 0, 0 10px, 10px -10px, -10px 0px",
                        }}
                      >
                        {palettePixels &&
                          palettePixels.map((value, index) => (
                            <PalettePixel
                              rgba={value.color}
                              onClick={() => {
                                openColorPicker(index);
                              }}
                              highlight={index === selectedPalette}
                            />
                          ))}
                      </div>
                    </>
                  )}
                </div>

                <div
                  className="bg-gray-500 rounded-lg p-2 shadow-xl"
                  style={{ height: "256px", width: "210px" }}
                >
                  <div
                    className="flex flex-col text-center align"
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <div className="text-sm text-justify">
                      Above is the Color Palette, which controls the colors
                      available to all animation programs. Click a pixel above
                      to edit its color. <br />
                      The upper-left pixel is reserved to tell the shader to use
                      the base texture color instead of a palette color.
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <a
                    className="flex bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-center"
                    style={{
                      width: "45%",
                      height: "100%",
                      display: "flex",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    href="https://github.com/DqwertyC/animated-entities"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github className="mx-auto text-gray-50" />
                  </a>

                  <a
                    className="flex bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-center"
                    style={{
                      width: "45%",
                      height: "100%",
                      display: "flex",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    href="https://www.youtube.com/@DqwertyC"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Youtube className="mx-auto text-gray-50" />
                  </a>
                </div>
              </div>
              <div style={{ width: "32px" }} />
              <div
                className="bg-gray-500 rounded-lg p-8 shadow-xl aspect-1"
                style={{
                  display: "grid",
                  gridTemplateRows: "repeat(64, 8px)",
                  gridTemplateColumns: "repeat(64, 8px)",
                  gap: 0,
                  backgroundImage:
                    "linear-gradient(30deg, #808080 25%, transparent 25%), linear-gradient(-30deg, #808080 25%, transparent 25%), linear-gradient(30deg, transparent 75%, #808080 75%), linear-gradient(-30deg, transparent 75%, #808080 75%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
              >
                {texturePixels.map((value, index) => (
                  <TexturePixel
                    rgba={value.color}
                    programId={value.program}
                    programVisible={programVisible}
                    programs={programPixels}
                    editable={value.editable}
                    onClick={() => {
                      clickPixel(index);
                    }}
                    onHover={() => {
                      if (mouseDown) {
                        paintPixel(index);
                      }
                    }}
                  />
                ))}
              </div>

              <div style={{ width: "32px" }}></div>
              <div
                className="flex flex-col"
                style={{ justifyContent: "space-between" }}
              >
                <div
                  className="bg-gray-500 rounded-lg p-2 shadow-xl"
                  style={{ height: "256px", width: "210px" }}
                >
                  {showEditor ? (
                    showEditorPicker ? (
                      <>
                        <div className="text-xl text-gray-100 text-center">
                          Pick Program Color
                        </div>
                        <div style={{ height: "8px" }} />
                        <div
                          style={{
                            display: "grid",
                            gridTemplateRows: "repeat(8, 24px)",
                            gridTemplateColumns: "repeat(8, 24px)",
                            width: "192px",
                            height: "192px",
                            gap: 0,
                            backgroundImage:
                              "linear-gradient(30deg, #808080 25%, transparent 25%), linear-gradient(-30deg, #808080 25%, transparent 25%), linear-gradient(30deg, transparent 75%, #808080 75%), linear-gradient(-30deg, transparent 75%, #808080 75%)",
                            backgroundSize: "20px 20px",
                            backgroundPosition:
                              "0 0, 0 10px, 10px -10px, -10px 0px",
                          }}
                        >
                          {palettePixels &&
                            palettePixels.map((value, index) => (
                              <PalettePixel
                                rgba={value.color}
                                onClick={() => {
                                  closeEditorPicker(index);
                                }}
                              />
                            ))}
                        </div>
                      </>
                    ) : (
                      <div
                        className="flex flex-col"
                        style={{
                          width: "100%",
                          height: "100%",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          gap: "2px",
                        }}
                      >
                        <div
                          className="flex flex-row"
                          style={{ width: "100%", height: "24px" }}
                        >
                          <div
                            className="text-sm px-1"
                            style={{ width: "30%", textAlign: "right" }}
                          >
                            Type:
                          </div>
                          <select
                            className="bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-center"
                            style={{ width: "70%", height: "24px" }}
                            value={editorProgramType}
                            onChange={(e) =>
                              setEditorProgramType(e.target.value)
                            }
                          >
                            <option className="text-sm px-1" value={0}>
                              {programInfo[0].programName}
                            </option>
                            <option className="text-sm px-1" value={1}>
                              {programInfo[1].programName}
                            </option>
                            <option className="text-sm px-1" value={2}>
                              {programInfo[2].programName}
                            </option>
                            <option className="text-sm px-1" value={3}>
                              {programInfo[3].programName}
                            </option>
                            <option className="text-sm px-1" value={4}>
                              {programInfo[4].programName}
                            </option>
                            <option className="text-sm px-1" value={5}>
                              {programInfo[5].programName}
                            </option>
                            <option className="text-sm px-1" value={6}>
                              {programInfo[6].programName}
                            </option>
                            <option className="text-sm px-1" value={7}>
                              {programInfo[7].programName}
                            </option>
                            <option className="text-sm px-1" value={8}>
                              {programInfo[8].programName}
                            </option>
                          </select>
                        </div>
                        <div
                          className="flex flex-row"
                          style={{ width: "100%", height: "24px" }}
                        >
                          <div
                            className="text-sm px-1"
                            style={{ width: "30%", textAlign: "right" }}
                          >
                            Speed:
                          </div>
                          <select
                            className="bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-center"
                            style={{ width: "70%", height: "24px" }}
                            value={editorSpeed}
                            onChange={(e) => setEditorSpeed(e.target.value)}
                          >
                            <option className="text-sm px-1" value={0}>
                              Frozen
                            </option>
                            <option className="text-sm px-1" value={1}>
                              Very Slow
                            </option>
                            <option className="text-sm px-1" value={2}>
                              Slow
                            </option>
                            <option className="text-sm px-1" value={3}>
                              Slightly Slow
                            </option>
                            <option className="text-sm px-1" value={4}>
                              Normal
                            </option>
                            <option className="text-sm px-1" value={5}>
                              Slightly Fast
                            </option>
                            <option className="text-sm px-1" value={6}>
                              Fast
                            </option>
                            <option className="text-sm px-1" value={7}>
                              Very Fast
                            </option>
                          </select>
                        </div>
                        <div
                          className="flex flex-row"
                          style={{ width: "100%", alignItems: "center" }}
                        >
                          <div
                            className="text-sm px-1"
                            style={{ width: "30%", textAlign: "right" }}
                          >
                            Color A:
                          </div>
                          <div
                            className="px-2 py-2 rounded-md"
                            style={{
                              width: "20%",
                              height: "24px",
                              backgroundImage:
                                editorColorA === 0
                                  ? "linear-gradient(30deg, #808080 25%, transparent 25%), linear-gradient(-30deg, #808080 25%, transparent 25%), linear-gradient(30deg, transparent 75%, #808080 75%), linear-gradient(-30deg, transparent 75%, #808080 75%)"
                                  : "",
                              backgroundSize: "20px 20px",
                              backgroundPosition:
                                "0 0, 0 10px, 10px -10px, -10px 0px",
                              backgroundColor: rgbaToColor(
                                palettePixels[editorColorA].color,
                              ),
                              borderColor: "white",
                              borderWidth: "2px",
                            }}
                            onClick={() => {
                              openEditorPicker(true);
                            }}
                          />
                          {!programInfo[editorProgramType].hasColorB ? (
                            <></>
                          ) : (
                            <>
                              <div
                                className="text-sm px-1"
                                style={{ width: "30%", textAlign: "right" }}
                              >
                                Color B:
                              </div>

                              <div
                                className="px-2 py-2 rounded-md"
                                style={{
                                  width: "20%",
                                  height: "24px",
                                  backgroundImage:
                                    editorColorB === 0
                                      ? "linear-gradient(30deg, #808080 25%, transparent 25%), linear-gradient(-30deg, #808080 25%, transparent 25%), linear-gradient(30deg, transparent 75%, #808080 75%), linear-gradient(-30deg, transparent 75%, #808080 75%)"
                                      : "",
                                  backgroundSize: "20px 20px",
                                  backgroundPosition:
                                    "0 0, 0 10px, 10px -10px, -10px 0px",
                                  backgroundColor: rgbaToColor(
                                    palettePixels[editorColorB].color,
                                  ),
                                  borderColor: "white",
                                  borderWidth: "2px",
                                }}
                                onClick={() => {
                                  openEditorPicker(false);
                                }}
                              />
                            </>
                          )}
                        </div>
                        <div
                          className="flex flex-row"
                          style={{ width: "100%", alignItems: "center" }}
                        >
                          <div
                            className="text-sm px-1"
                            style={{ width: "30%", textAlign: "right" }}
                          >
                            Glow A:
                          </div>
                          <div
                            className="flex rounded-md"
                            style={{
                              width: "20%",
                              height: "24px",
                              backgroundColor: "black",
                              borderColor: "white",
                              borderWidth: "2px",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={() => {
                              setEditorEmissiveA((old) => !old);
                            }}
                          >
                            {editorEmissiveA ? <Check /> : <X />}
                          </div>
                          {!programInfo[editorProgramType].hasColorB ? (
                            <></>
                          ) : (
                            <>
                              <div
                                className="text-sm px-1"
                                style={{ width: "30%", textAlign: "right" }}
                              >
                                Glow B:
                              </div>
                              <div
                                className="flex rounded-md"
                                style={{
                                  width: "20%",
                                  height: "24px",
                                  backgroundColor: "black",
                                  borderColor: "white",
                                  borderWidth: "2px",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                onClick={() => {
                                  setEditorEmissiveB((old) => !old);
                                }}
                              >
                                {editorEmissiveB ? <Check /> : <X />}
                              </div>
                            </>
                          )}
                        </div>
                        <div
                          className="flex flex-row"
                          style={{
                            width: "100%",
                            height: "24px",
                            alignItems: "center",
                          }}
                        >
                          {programInfo[editorProgramType].boolNameA === "-" ? (
                            <></>
                          ) : (
                            <>
                              <div
                                className="text-sm px-1"
                                style={{ width: "30%", textAlign: "right" }}
                              >
                                {programInfo[editorProgramType].boolNameA}
                              </div>
                              <div
                                className="flex rounded-md"
                                style={{
                                  width: "20%",
                                  height: "24px",
                                  backgroundColor: "black",
                                  borderColor: "white",
                                  borderWidth: "2px",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                onClick={() => {
                                  setEditorBoolA((old) => !old);
                                }}
                              >
                                {editorBoolA ? <Check /> : <X />}
                              </div>
                            </>
                          )}
                          {programInfo[editorProgramType].boolNameB === "-" ? (
                            <></>
                          ) : (
                            <>
                              <div
                                className="text-sm px-1"
                                style={{ width: "30%", textAlign: "right" }}
                              >
                                {programInfo[editorProgramType].boolNameB}
                              </div>
                              <div
                                className="flex rounded-md"
                                style={{
                                  width: "20%",
                                  height: "24px",
                                  backgroundColor: "black",
                                  borderColor: "white",
                                  borderWidth: "2px",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                onClick={() => {
                                  setEditorBoolB((old) => !old);
                                }}
                              >
                                {editorBoolB ? <Check /> : <X />}
                              </div>
                            </>
                          )}
                        </div>
                        <div
                          className="flex flex-row"
                          style={{
                            width: "100%",
                            height: "24px",
                            alignItems: "center",
                          }}
                        >
                          {programInfo[editorProgramType].crumbName === "-" ? (
                            <></>
                          ) : (
                            <>
                              <div
                                className="text-sm px-1"
                                style={{ width: "50%", textAlign: "right" }}
                              >
                                {programInfo[editorProgramType].crumbName}
                              </div>
                              <select
                                className="bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-center"
                                style={{ width: "50%", height: "24px" }}
                                value={editorCrumb}
                                onChange={(e) => setEditorCrumb(e.target.value)}
                              >
                                <option value={0}>
                                  {programInfo[editorProgramType].crumbIsDir
                                    ? "Down"
                                    : "0"}
                                </option>
                                <option value={1}>
                                  {programInfo[editorProgramType].crumbIsDir
                                    ? "Up"
                                    : "1"}
                                </option>
                                <option value={2}>
                                  {programInfo[editorProgramType].crumbIsDir
                                    ? "Right"
                                    : "2"}
                                </option>
                                <option value={3}>
                                  {programInfo[editorProgramType].crumbIsDir
                                    ? "Left"
                                    : "3"}
                                </option>
                              </select>
                            </>
                          )}
                        </div>
                        <div
                          className="flex flex-row"
                          style={{
                            width: "100%",
                            height: "24px",
                            alignItems: "center",
                          }}
                        >
                          {programInfo[editorProgramType].nibbleName === "-" ? (
                            <></>
                          ) : (
                            <>
                              <div
                                className="text-sm px-1"
                                style={{ width: "50%", textAlign: "right" }}
                              >
                                {programInfo[editorProgramType].nibbleName}
                              </div>
                              <select
                                className="bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-center"
                                style={{ width: "50%", height: "24px" }}
                                value={editorNibble}
                                onChange={(e) =>
                                  setEditorNibble(e.target.value)
                                }
                              >
                                <option value={0}>0</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                                <option value={9}>9</option>
                                <option value={10}>10</option>
                                <option value={11}>11</option>
                                <option value={12}>12</option>
                                <option value={13}>13</option>
                                <option value={14}>14</option>
                                <option value={15}>15</option>
                              </select>
                            </>
                          )}
                        </div>
                        <div
                          className="text-sm"
                          style={{
                            width: "100%",
                            height: "24px",
                            textAlign: "center",
                            alignContent: "center",
                          }}
                        >
                          {`(${hexToRgba(editorResult).r}, ${hexToRgba(editorResult).g}, ${hexToRgba(editorResult).b}, ${hexToRgba(editorResult).a})`}
                        </div>
                        <div
                          className="flex flex-row"
                          style={{ width: "100%", height: "32px" }}
                        >
                          <input
                            className="px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ width: "80%" }}
                            type="text"
                            value={editorResult}
                            onChange={(e) => {
                              updateEditor(e.target.value);
                            }}
                          />
                          <button
                            className="flex space-x-2 px-2 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-center"
                            style={{
                              width: "20%",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            onClick={() => {
                              closeEditor();
                            }}
                          >
                            OK
                          </button>
                        </div>
                      </div>
                    )
                  ) : (
                    <>
                      <div className="text-xl text-gray-100 text-center">
                        Program Palette
                      </div>
                      <div style={{ height: "8px" }} />
                      <div
                        style={{
                          display: "grid",
                          gridTemplateRows: "repeat(8, 24px)",
                          gridTemplateColumns: "repeat(8, 24px)",
                          width: "192px",
                          height: "192px",
                          gap: 0,
                          backgroundImage:
                            "linear-gradient(30deg, #808080 25%, transparent 25%), linear-gradient(-30deg, #808080 25%, transparent 25%), linear-gradient(30deg, transparent 75%, #808080 75%), linear-gradient(-30deg, transparent 75%, #808080 75%)",
                          backgroundSize: "20px 20px",
                          backgroundPosition:
                            "0 0, 0 10px, 10px -10px, -10px 0px",
                        }}
                      >
                        {programPixels.map((value, index) => (
                          <ProgramPixel
                            programId={index}
                            programColor={value.color}
                            onClick={() => {
                              selectProgram(index);
                            }}
                            onDoubleClick={() => {
                              if (index > 0) openEditor(index);
                            }}
                            highlight={index === selectedProgram}
                            programVisible={programVisible}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div
                  className="bg-gray-500 rounded-lg p-2 shadow-xl"
                  style={{
                    height: "256px",
                    width: "210px",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ height: "8px" }} />
                  {selectedProgram === 0 ? (
                    <div className="text-sm text-justify">
                      Click a pixel above to select its program, then click on
                      the texture to edit which programs are applied to each
                      pixel. <br />
                      Double click a pixel above to edit its program. <br />
                      Use the upper-left pixel to clear programs from the
                      texture.
                    </div>
                  ) : (
                    <>
                      <div style={{ width: "80%", height: "80%" }}>
                        <ProgramPreview
                          program={previewColor}
                          colors={palettePixels}
                          time={gameTime}
                        />
                      </div>
                      <div
                        className="flex flex-row"
                        style={{
                          width: "100%",
                          height: "20%",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <input
                          style={{ width: "80%" }}
                          type="range"
                          min={0}
                          max={200}
                          step={1}
                          onChange={(e) => {
                            setGameTime(e.target.value);
                          }}
                          value={gameTime}
                        />
                        <button
                          className="flex space-x-2 px-2 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-center"
                          style={{
                            width: "18%",
                            height: "50%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            setPlaying((old) => !old);
                          }}
                        >
                          {playing ? (
                            <Pause className="mx-auto text-gray-50" />
                          ) : (
                            <Play className="mx-auto text-gray-50" />
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <button
                    className="flex bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-center"
                    style={{
                      width: "45%",
                      height: "100%",
                      display: "flex",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => {
                      setProgramVisible((old) => !old);
                    }}
                  >
                    {programVisible ? (
                      <Eye className="mx-auto text-gray-50" />
                    ) : (
                      <EyeClosed className="mx-auto text-gray-50" />
                    )}
                  </button>

                  <button
                    className="flex bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-center"
                    style={{
                      width: "45%",
                      height: "100%",
                      display: "flex",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => {
                      saveFile();
                    }}
                  >
                    <Download className="mx-auto text-gray-50" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        ) : (
          <main
            className="bg-gray-800 rounded-lg p-8 shadow-xl flex flex-col"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <div className="flex justify-center mb-8">
              <div
                className="w-64 h-64 border-4 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {image ? (
                  <img
                    src={image}
                    alt="Uploaded Base Texture"
                    className="w-full object-cover"
                    style={{ imageRendering: "pixelated" }}
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-600">Click or drag to upload</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                accept=".png"
                className="hidden"
              />
            </div>

            {inputWidth === 0 ? (
              <div className="flex justify-center mb-8">
                <span>Please upload a base texture to continue!</span>
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-8">
                  <label className="flex items-center space-x-2">
                    <span>Texture Type:</span>
                    <select
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                      onChange={(e) => setTextureType(e.target.value)}
                    >
                      <option value="humanoid" disabled={inputHeight === 32}>
                        Player/Humanoid
                      </option>
                      <option value="quadruped" disabled={inputHeight === 32}>
                        Cow/Pig
                      </option>
                      <option value="chicken" disabled={inputHeight === 64}>
                        Chicken
                      </option>
                    </select>
                  </label>
                </div>
                <div className="flex justify-center mb-8">
                  <button
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                    onClick={processTexture}
                  >
                    Start Animating!
                  </button>
                </div>
              </>
            )}
          </main>
        )}
      </div>
    </div>
  );
}
