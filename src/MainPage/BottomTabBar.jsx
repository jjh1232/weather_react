import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faCloudSun } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

//====================================================================
// 좁은 화면 전용 하단 탭바.
// 넓은 화면에서 좌우 사이드바로 동시에 보여주던 것들을,
// 모바일에서는 "한 번에 하나씩" 보여주기 위한 이동 수단이다.
// 탭에는 서로 대등한 목적지만 넣는다(동작/상태/하위목록은 탭이 아니다).
//====================================================================
const Bar = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;

  display: flex;
  gap: 2px;
  /* 아이폰 홈 인디케이터 영역만큼 더 띄운다 */
  padding: 6px 6px calc(6px + env(safe-area-inset-bottom, 0px));

  background: ${(props) => props.theme.surfaceGlass};
  -webkit-backdrop-filter: ${(props) => props.theme.blur};
  backdrop-filter: ${(props) => props.theme.blur};
  border-top: 1px solid ${(props) => props.theme.border};
  box-shadow: 0 -6px 20px rgba(16, 24, 40, 0.08);
`;

const Tab = styled(NavLink)`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 50px;

  border-radius: ${(props) => props.theme.radiusSm};
  font-size: 10px;
  font-weight: 650;
  letter-spacing: -0.03em;
  color: ${(props) => props.theme.textFaint};
  text-decoration: none;
  transition: color ${(props) => props.theme.transition},
              background ${(props) => props.theme.transition};

  svg {
    font-size: 17px;
  }

  /* react-router v6 의 NavLink 는 현재 경로일 때 active 클래스를 자동으로 붙인다 */
  &.active {
    color: ${(props) => props.theme.accent};
    background: ${(props) => props.theme.accentSoft};
  }

  &:hover {
    color: ${(props) => props.theme.accent};
  }
`;

export default function BottomTabBar() {
  const [cookies] = useCookies(["userinfo"]);

  //이제 실제로 profileid 를 넘긴다(없는 옛 계정만 username 으로 떨어진다)
  //(Twitformlist, Usermodal 도 같은 방식으로 이동한다)
  const username = cookies.userinfo?.username;
  const handle = cookies.userinfo?.profileid || username;
  const profilepath = handle ? `/userpage/${handle}` : "/login";

  return (
    <Bar>
      {/* end 가 없으면 "/" 는 모든 경로에서 활성으로 잡힌다 */}
      <Tab to="/" end>
        <FontAwesomeIcon icon={faHouse} />
        홈
      </Tab>
      <Tab to="/weather">
        <FontAwesomeIcon icon={faCloudSun} />
        날씨
      </Tab>
      <Tab to="/chatui">
        <FontAwesomeIcon icon={faComments} />
        채팅
      </Tab>
      <Tab to={profilepath}>
        <FontAwesomeIcon icon={faUser} />
        내 정보
      </Tab>
    </Bar>
  );
}
