import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faEraser } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

const CANVAS_SIZE = 280;

//배경 프리셋. 첫 번째(흰색)가 기본값이다.
const BACKGROUNDS = [
  "#ffffff",
  "#f2f4f7",
  "#e3f0fb",
  "#e6f6ec",
  "#fdeee3",
  "#efe9fb",
  "#2b3440",
];

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

//캔버스 자체는 투명하게 두고, 배경색은 이 컨테이너가 보여준다.
//그래야 나중에 배경색을 바꿔도 이미 그린 선이 지워지지 않는다.
const Canvasdiv = styled.div`
  width: ${CANVAS_SIZE}px;
  height: ${CANVAS_SIZE}px;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.radius};
  box-shadow: ${(props) => props.theme.shadowSm};
  background: ${(props) => props.$bg};
  transition: background ${(props) => props.theme.transition};
`;

const Canvasstyle = styled.canvas`
  display: block;
  touch-action: none;
  cursor: ${(props) =>
    props.$tool === "eraser"
      ? `url(${process.env.PUBLIC_URL}/front/cursor/eragercursor.cur), cell`
      : `url(${process.env.PUBLIC_URL}/front/cursor/pencursor.cur), crosshair`};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  width: ${CANVAS_SIZE}px;
`;

const Toolbutton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: ${(props) => props.theme.radiusPill};
  border: 1px solid
    ${(props) => (props.$active ? props.theme.accent : props.theme.border)};
  background: ${(props) =>
    props.$active ? props.theme.accentSoft : props.theme.surface};
  color: ${(props) =>
    props.$active ? props.theme.accent : props.theme.textMuted};
  font-size: 12.5px;
  font-weight: 650;
  cursor: pointer;
  transition: background ${(props) => props.theme.transition},
    color ${(props) => props.theme.transition},
    border-color ${(props) => props.theme.transition};

  &:hover {
    color: ${(props) => props.theme.accent};
    border-color: ${(props) => props.theme.accent};
  }
`;

const Colorinput = styled.input`
  width: 32px;
  height: 32px;
  padding: 2px;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.radiusSm};
  background: ${(props) => props.theme.surface};
  cursor: pointer;
`;

const Widthfield = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0 12px;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.radiusPill};
  background: ${(props) => props.theme.surface};
  font-size: 11.5px;
  font-weight: 600;
  color: ${(props) => props.theme.textMuted};

  input {
    flex: 1;
    min-width: 0;
    accent-color: ${(props) => props.theme.accent};
  }
`;

const Label = styled.div`
  width: ${CANVAS_SIZE}px;
  font-size: 11.5px;
  font-weight: 650;
  letter-spacing: -0.02em;
  color: ${(props) => props.theme.textFaint};
`;

const Swatch = styled.button`
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  background: ${(props) => props.$color};
  border: 2px solid
    ${(props) => (props.$active ? props.theme.accent : props.theme.border)};
  box-shadow: ${(props) =>
    props.$active ? `0 0 0 3px ${props.theme.accentSoft}` : "none"};
  transition: transform ${(props) => props.theme.transition};

  &:hover {
    transform: scale(1.1);
  }
`;

export default function SelfDraw(props) {
  const { onResult } = props;

  const canvasRef = useRef(null);
  const drawing = useRef(false);

  const [tool, setTool] = useState("pen");
  const [pencolor, setPencolor] = useState("#111111");
  const [lineWidth, setLineWidth] = useState(6);
  const [bgcolor, setBgcolor] = useState(BACKGROUNDS[0]);

  const getctx = () => canvasRef.current.getContext("2d");

  //캔버스에 그려진 것(투명 배경) 위에 배경색을 깔아 하나의 PNG 로 합친다.
  //이렇게 분리해두면 배경색을 언제 바꿔도 선이 그대로 남는다.
  const exportimage = () => {
    const src = canvasRef.current;
    const out = document.createElement("canvas");
    out.width = src.width;
    out.height = src.height;

    const ctx = out.getContext("2d");
    ctx.fillStyle = bgcolor;
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(src, 0, 0);

    return out.toDataURL("image/png");
  };

  const publish = () => {
    if (onResult) onResult(exportimage());
  };

  //배경색만 바꿔도 결과물이 달라지므로 부모에 다시 알려준다
  useEffect(() => {
    if (onResult) onResult(exportimage());
  }, [bgcolor]);

  const startstroke = (e) => {
    const ctx = getctx();
    //지우개는 배경색으로 덮는 게 아니라 실제로 지운다.
    //덮는 방식이면 배경색을 바꿨을 때 지운 자리만 옛 색으로 남는다.
    ctx.globalCompositeOperation =
      tool === "eraser" ? "destination-out" : "source-over";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = pencolor;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    drawing.current = true;
  };

  const movestroke = (e) => {
    if (!drawing.current) return;
    const ctx = getctx();
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const endstroke = () => {
    if (!drawing.current) return;
    drawing.current = false;
    publish();
  };

  const onClear = () => {
    const canvas = canvasRef.current;
    const ctx = getctx();
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    publish();
  };

  return (
    <Panel>
      <Canvasdiv $bg={bgcolor}>
        <Canvasstyle
          ref={canvasRef}
          $tool={tool}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onMouseDown={startstroke}
          onMouseMove={movestroke}
          onMouseUp={endstroke}
          onMouseOut={endstroke}
        />
      </Canvasdiv>

      <Row>
        <Toolbutton
          type="button"
          $active={tool === "pen"}
          onClick={() => setTool("pen")}
        >
          <FontAwesomeIcon icon={faPen} /> 펜
        </Toolbutton>

        <Toolbutton
          type="button"
          $active={tool === "eraser"}
          onClick={() => setTool("eraser")}
        >
          <FontAwesomeIcon icon={faEraser} /> 지우개
        </Toolbutton>

        <Colorinput
          type="color"
          value={pencolor}
          title="펜 색"
          onChange={(e) => {
            setPencolor(e.target.value);
            setTool("pen"); //색을 고르면 자연스럽게 펜으로 돌아온다
          }}
        />

        <Toolbutton type="button" onClick={onClear}>
          <FontAwesomeIcon icon={faTrashCan} /> 지우기
        </Toolbutton>
      </Row>

      <Row>
        <Widthfield>
          굵기
          <input
            type="range"
            min="1"
            max="40"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
          />
          {lineWidth}
        </Widthfield>
      </Row>

      <Label>배경색</Label>
      <Row>
        {BACKGROUNDS.map((color) => (
          <Swatch
            key={color}
            type="button"
            title={color}
            $color={color}
            $active={bgcolor === color}
            onClick={() => setBgcolor(color)}
          />
        ))}
        <Colorinput
          type="color"
          value={bgcolor}
          title="배경색 직접 고르기"
          onChange={(e) => setBgcolor(e.target.value)}
        />
      </Row>
    </Panel>
  );
}
