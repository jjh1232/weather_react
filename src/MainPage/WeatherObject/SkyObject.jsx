import React, { useMemo } from "react";
import styled, { keyframes } from "styled-components";

//===================== 해 =====================
const sunPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.035); }
`;

const SunObject = styled.div`
  position: absolute;
  top: 60px;
  left: 70px;
  width: 104px;
  height: 104px;
  border-radius: 50%;
  /* 가운데가 하얗게 타고 가장자리로 갈수록 주황이 되는 실제 태양의 느낌 */
  background: radial-gradient(
    circle at 42% 38%,
    #fffdf2 0%,
    #ffe89a 38%,
    #ffc85c 68%,
    #ff9f3c 100%
  );
  box-shadow:
    0 0 50px rgba(255, 198, 92, 0.55),
    0 0 140px rgba(255, 170, 60, 0.32);
  animation: ${sunPulse} 6s ease-in-out infinite;

  /* 바깥으로 넓게 번지는 코로나 */
  &::after {
    content: "";
    position: absolute;
    inset: -40px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(255, 206, 110, 0.28) 0%,
      rgba(255, 206, 110, 0) 70%
    );
    pointer-events: none;
  }
`;

//===================== 달 =====================
// 예전엔 clip-path 로 자른 초승달을 120도 돌려놨는데,
// 크기를 바꾸면 path 가 따라오지 않아 모양이 깨졌다. 보름달로 다시 그린다.
const Moon = styled.div`
  position: absolute;
  top: 70px;
  left: 70px;
  width: ${(props) => props.size || "104px"};
  height: ${(props) => props.size || "104px"};
  border-radius: 50%;
  background: radial-gradient(
    circle at 36% 32%,
    #fffdf0 0%,
    #f4eed2 46%,
    #ded6b4 100%
  );
  box-shadow:
    0 0 44px rgba(255, 250, 214, 0.40),
    0 0 130px rgba(178, 196, 255, 0.28),
    /* 오른쪽 아래로 지는 그림자 - 구체로 보이게 한다 */
    inset -16px -12px 30px rgba(120, 124, 158, 0.30);

  /* 크레이터 */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background:
      radial-gradient(circle at 63% 28%, rgba(126, 130, 160, 0.22) 0 9px, transparent 10px),
      radial-gradient(circle at 37% 58%, rgba(126, 130, 160, 0.18) 0 13px, transparent 14px),
      radial-gradient(circle at 68% 67%, rgba(126, 130, 160, 0.15) 0 7px, transparent 8px),
      radial-gradient(circle at 47% 22%, rgba(126, 130, 160, 0.12) 0 5px, transparent 6px);
  }

  /* 달무리 */
  &::after {
    content: "";
    position: absolute;
    inset: -42px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(214, 226, 255, 0.20) 0%,
      rgba(214, 226, 255, 0) 70%
    );
    pointer-events: none;
  }
`;

//===================== 구름 =====================
const drift = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(110px); }
`;

const Cloud = styled.div`
  position: absolute;
  /* 그림자는 조각이 아니라 컨테이너에 건다.
     조각마다 걸면 겹친 자리에 그림자 경계가 그대로 드러난다. */
  filter: drop-shadow(0 10px 16px rgba(72, 98, 134, 0.16));
  animation: ${drift} ${(props) => props.$duration || 70}s ease-in-out infinite alternate;
`;

const CloudPart = styled.div`
  position: absolute;
  border-radius: 50%;
  /* 조각이 전부 똑같은 단색이어야 겹친 자리에 이음매가 안 보인다 */
  background: ${(props) => (props.$overcast ? "#c2ccd9" : "#ffffff")};
`;

// 구름 한 덩어리의 실루엣.
// 예전에는 원 3개를 늘어놨는데 각 원의 밑변 높이가 달라서(50%/50%/55%)
// 아랫면이 울퉁불퉁했다. 바닥을 넓은 타원 하나로 깔고 그 위에 봉우리를 얹는다.
function CloudShape({ overcast }) {
  return (
    <>
      <CloudPart $overcast={overcast} style={{ width: "100%", height: "46%", left: "0%", bottom: "0%" }} />
      <CloudPart $overcast={overcast} style={{ width: "46%", height: "64%", left: "4%", bottom: "18%" }} />
      <CloudPart $overcast={overcast} style={{ width: "58%", height: "88%", left: "23%", bottom: "20%" }} />
      <CloudPart $overcast={overcast} style={{ width: "42%", height: "56%", left: "58%", bottom: "16%" }} />
    </>
  );
}

export default function SkyObject(props) {
  const { sky } = props;
  const time = new Date().getHours();
  const isnight = 18 <= time || time < 6;

  // 렌더될 때마다 Math.random 을 돌리면 구름이 매번 순간이동한다.
  // 한 번만 만들어두고 재사용한다.
  const clouds = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => ({
        width: `${Math.random() * 100 + 170}px`,
        height: `${Math.random() * 50 + 90}px`,
        top: `${Math.random() * 260 + 20}px`,
        left: `${index * 300 - 40}px`,
        // 멀리 있는 구름일수록 옅게 - 깊이감
        opacity: 0.68 + Math.random() * 0.32,
      })),
    []
  );

  const light = isnight ? <Moon /> : <SunObject />;

  // 맑음(1)
  if (sky === 1) {
    return <>{light}</>;
  }

  // 구름많음(3) 은 흰 구름, 흐림(4) 은 회색 구름
  const overcast = sky !== 3;

  return (
    <>
      {light}
      {clouds.map(({ opacity, ...position }, index) => (
        <Cloud
          key={index}
          style={{ ...position, opacity }}
          $duration={58 + index * 8}
        >
          <CloudShape overcast={overcast} />
        </Cloud>
      ))}
    </>
  );
}
