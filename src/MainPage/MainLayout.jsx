import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Header from "./Header";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import { Outlet } from "react-router-dom";
import WeatherComponent from "./WeatherComponent";
import { useCookies } from "react-cookie";
import SkyObject from "./WeatherObject/SkyObject";
import BottomTabBar from "./BottomTabBar";
import useMediaQuery from "../customhook/useMediaQuery";

const Wrapper=styled.div`
   position: relative;
 //  width: 100vw;
   //height: 100vh;
   /* hidden 으로 두면 세로축까지 스크롤 컨테이너가 되어(overflow-y 가 auto 로 계산된다)
      안쪽 position:sticky 가 전부 죽는다 - 붙을 기준이 뷰포트가 아니라 이 div 가 되는데
      이 div 자체는 스크롤되지 않기 때문이다.
      clip 은 잘라내기만 하고 스크롤 컨테이너를 만들지 않아 sticky 가 살아 있다. */
   overflow-x: hidden;
   overflow-x: clip;
    
    
`
//날짜에따른테마
// sky 는 [아래, 중간, 위] 순서다 (Sky 의 gradient 가 0deg = 아래에서 위로).
// 실제 하늘처럼 지평선 쪽이 밝고 위로 갈수록 깊어지게 잡았다.
const thema={
    dawn: {
        //여명 - 지평선의 살구빛에서 위로 갈수록 남보라
        sky: ['#F7C9A4', '#B091C4', '#3E4B7D'],
        horizon: '#F7C9A4'
      },
      morning: {
        //아침 - 맑고 옅은 하늘색
        sky: ['#EAF5FC', '#A9D6F2', '#5CA2DE'],
        horizon: '#EAF5FC'
      },
        noon: {
        //한낮 - 채도가 가장 높은 파랑
        sky: ['#DCEEFB', '#9CCCF2', '#4790DF'],
        horizon: '#DCEEFB'
      },
      evening: {
        //해질녘 - 주황에서 장미빛을 거쳐 땅거미
        sky: ['#F9B265', '#C87C86', '#3F4A74'],
        horizon: '#F9B265'
      },
      night: {
        //밤 - 아래쪽만 옅게 남기고 위는 거의 검정
        sky: ['#2B3B5E', '#16233F', '#070C18'],
        horizon: '#2B3B5E'
      }
}
//백그라운드레이어
const BackgroundLayer=styled.div`
  
`
// 1. 기본 구조 선택
const Background = styled.div`
  /* 화면 전체를 덮는 배경. bottom:50px 이면 아래 50px 이 비어서
     좁은 화면에선 하늘이 끊긴 채로 보인다. */
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
 `

// 2. 하늘 레이어
const Sky = styled.div`
  position: relative;
  height: 100%;
  //그라데이션 아마 시간대별로 조정
  background: linear-gradient( 
    0deg,
    ${({ theme }) => theme.sky[0]} 0%,
    ${({ theme }) => theme.sky[1]} 50%,
    ${({ theme }) => theme.sky[2]} 100%
  );

  /* 지평선 쪽에 옅게 깔리는 대기 - 단색 그라데이션만 있을 때보다 깊이가 생긴다 */
  &::after{
    content:"";
    position:absolute;
    left:0;
    right:0;
    bottom:0;
    height:38%;
    background: linear-gradient(
      0deg,
      ${({ theme }) => theme.horizon}55 0%,
      transparent 100%
    );
    pointer-events:none;
  }
`;

// 3. 지평선 효과
const Horizon = styled.div`
  height: 10px;
  /* theme.horizon[0] 은 색이 아니라 문자열의 첫 글자('#')를 꺼내던 버그였다 */
  background: ${({ theme}) => theme.horizon};
`;

//포그라운드
//====================================================================
// 3단 배치는 여기서만 정한다. Header / LeftSideBar / RightSideBar 는
// 더 이상 자기 좌표(position:fixed, left, right)를 갖지 않는다.
// 칸 구성만 바꾸면 남은 요소가 알아서 자리를 메운다.
//====================================================================
const ForegroundLayer=styled.div`
  position: relative;
  z-index: 1;

  /* 헤더 + 본문 2단 구성.
     헤더는 grid 안에 두면 sticky 가 동작하지 않는다 - grid item 의 sticky 는
     자기 grid area(= 헤더 한 줄) 안에서만 움직일 수 있어 붙을 여유가 0 이다.
     그래서 헤더를 grid 밖(flex 자식)으로 빼고, 아래 3단만 Columns 가 맡는다. */
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 12px;
  margin: 0 auto;
  min-height: 100vh;

  /* 헤더(가로 100%)와 아래 칼럼의 좌우 끝이 어긋나지 않도록,
     칼럼 폭 합계 + 좌우 패딩을 그대로 max-width 로 쓴다.
     넓은 화면: 310 + 860 + 332 + gap 14*2 = 1530, + padding 24 = 1554 */
  max-width: 1554px;

  /* 중간: 날씨 사이드바를 접는다. 860 + 332 + 14 = 1206, + 24 = 1230 */
  @media (max-width: 1400px) {
    max-width: 1230px;
  }

  /* 좁은 화면: 타임라인 한 줄 + 하단 탭바 */
  @media (max-width: 900px) {
    max-width: none;
    gap: 10px;
    padding: 8px;
    /* 하단 탭바에 내용이 가리지 않도록 */
    padding-bottom: calc(68px + env(safe-area-inset-bottom, 0px));
  }
`

//헤더 아래 3단. 칸 구성만 여기서 바꾸면 남은 요소가 알아서 자리를 메운다.
const Columns=styled.div`
  display: grid;
  gap: 14px;
  align-items: start;
  flex: 1;

  /* 넓은 화면: 날씨 | 타임라인 | 로그인+채팅 */
  grid-template-columns: 310px minmax(0, 860px) 332px;
  grid-template-areas: "left main right";

  @media (max-width: 1400px) {
    grid-template-columns: minmax(0, 860px) 332px;
    grid-template-areas: "main right";
  }

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "main";
    gap: 10px;
  }
`
//내용

const Headercss=styled.div`
  /* 스크롤해도 로고/탭/검색은 계속 따라온다.
     top:0 이라 스크롤 전에는 위쪽 12px 여백이 그대로 보이고,
     붙는 순간 화면 맨 위에 딱 맞춰진다(여백 사이로 글이 비쳐 보이지 않는다). */
  position: sticky;
  top: 0;
  z-index: 30;
  flex: none;
`

const LeftCss=styled.div`
  grid-area: left;
  /* fixed 대신 sticky - 스크롤해도 따라오되 자기 칸을 벗어나지 않는다.
     헤더 높이(52) + gap(14) = 66 에서 멈춘다. 이러면 헤더와 사이드바가
     정확히 같은 스크롤 위치에서 함께 붙어 간격 14px 이 그대로 유지된다. */
  position: sticky;
  top: 66px;
  align-self: start;

  /* 사이드바가 화면보다 길면 아래쪽이 영영 안 보이므로 안에서 스크롤시킨다 */
  max-height: calc(100vh - 78px);
  overflow-y: auto;
  overscroll-behavior: contain;

  @media (max-width: 1400px) {
    display: none;
  }
`
const Rightcss=styled.div`
  grid-area: right;
  position: sticky;
  top: 66px;
  align-self: start;

  /* 로그인 카드(186) + 폰 패널(약 600) 이라 낮은 화면에선 화면을 넘긴다.
     안에서 스크롤되게 두지 않으면 채팅 입력창까지 내려갈 방법이 없다. */
  max-height: calc(100vh - 78px);
  overflow-y: auto;
  overscroll-behavior: contain;

  @media (max-width: 900px) {
    display: none;
  }
`
const MainCss=styled.div`
  grid-area: main;
  min-width: 0;

  /* 하늘 배경 위에 뜨는 타임라인 패널.
     overflow:hidden 은 게시글 드롭다운 메뉴가 잘려서 쓰지 않는다. */
  border: 1px solid ${(props)=>props.theme.border};
  border-radius: ${(props)=>props.theme.radiusLg};
  box-shadow: ${(props)=>props.theme.shadowLg};
  background-color: ${(props)=>props.theme.surfaceGlass};
  /* 여기엔 backdrop-filter 를 쓰지 않는다.
     backdrop-filter 가 걸린 요소는 그 안의 position:fixed 자손에게
     "고정 기준점"이 되어버려서(뷰포트가 아니라 이 패널 기준이 된다),
     마우스 좌표로 띄우는 팝업/모달이 전부 어긋난다.
     - 프로필 미리보기(Simpleprofile), 이미지 미리보기, 글작성 모달 등
     좌우 사이드바처럼 작은 패널은 안에 fixed 자손이 없어 그대로 둔다. */
  color: ${(props)=>props.theme.text};

  @media (max-width: 900px) {
    border-radius: ${(props)=>props.theme.radius};
  }
`


export default function MainLayout(props){
    const [currentthema,setCurrentthema]=useState(thema.dawn);

    //접히는 컬럼은 CSS 로 숨기는 것만으로는 부족하다.
    //display:none 이어도 React 는 그대로 마운트하기 때문에
    //  - ChatUi 가 두 번 붙어 #phone-ui 아이디가 중복되고(모달 포털이 깨진다)
    //  - 보이지도 않는 목록이 서버에 쿼리를 날린다.
    //그래서 아예 렌더하지 않는다.
    const ismobile=useMediaQuery("(max-width: 900px)");
    const isnarrow=useMediaQuery("(max-width: 1400px)");

    const [weathercookie,removeweather]=useCookies(['weather'])//어차피쿠키다가져오는데이유는몰겟음
    const [weatherdata,setWeatherdata]=useState();


    //동기화를위해 유즈이펙트가좋다네요..
    useEffect(()=>{
        //데이터존재여부확인이안전하다고함
      if (!weathercookie.weather) {
        setWeatherdata({});
        return;
      }
      //안전하게json파싱
      try{
        //const parsed=JSON.parse(weathercookie.weather)
        //console.log("제대로왔는가:"+parsed)
      const weathercook={
        sky:weathercookie.weather.sky||1,
        pty:weathercookie.weather.pty||0,
        t1h:weathercookie.weather.t1h||10,
        rn1:weathercookie.weather.rn1||0
      }

      setWeatherdata(prev=>JSON.stringify(prev)===JSON.stringify(weathercook)
    ?prev //변경사항 없으면 리렌더링안함
    :weathercook//변경시
    )
    }
    catch(error){
      console.log("쿠키파싱실패:"+error)
      setWeatherdata({});
    }
    },[weathercookie.weather])

    //날씨에다른 변화


    
//시간에따른 배경변화
    const Weatherandtime=()=>{
      let time=new Date().getHours();
     // let time=String(now.getHours.padStart(2,'0'))//한자리숫자를위해padstart

      if(time>=4 &&time<7) setCurrentthema(thema.dawn)
      else if(time>=7 &&time<12) setCurrentthema(thema.morning)
      else if(time>=12 &&time<17) setCurrentthema(thema.noon)
      else if(time>=17 &&time<20) setCurrentthema(thema.evening)
      else setCurrentthema(thema.night)


      
    }
    //날씨데이터에따른 땅배경
    const WeatherGroundset=(weatherdata)=>{
     
    }
    //날씨정리코드
    //구름이나해등추가해야하는데흠..

    //실행유즈이펙트
    useEffect(()=>{
      Weatherandtime();
      const interval=setInterval(Weatherandtime,60000*60)//1시간마다체크

      return ()=>clearInterval(interval) //
    },[])
    return (
        <Wrapper id="Maindiv">
          
          <BackgroundLayer>
            <ThemeProvider theme={currentthema}>
            <Background>
            
                <Sky>
                {weatherdata&&<SkyObject sky={weatherdata.sky} />}
                   
                </Sky>
                <Horizon></Horizon>
                
            </Background>
            </ThemeProvider>
            </BackgroundLayer>
            <ForegroundLayer>
              <Headercss>
                <Header/>
              </Headercss>

              <Columns>
                {!isnarrow &&
                <LeftCss>
                    <LeftSideBar/>
                </LeftCss>}

                <MainCss>
                    <Outlet/>
                </MainCss>

                {!ismobile &&
                <Rightcss>
                    <RightSideBar/>
                </Rightcss>}
              </Columns>
        </ForegroundLayer>

        {ismobile && <BottomTabBar/>}
        </Wrapper>
    )
}