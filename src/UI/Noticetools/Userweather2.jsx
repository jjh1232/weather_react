import React, { useEffect, useState } from "react";
import styled,{ keyframes } from "styled-components";
import { useCookies } from "react-cookie";
import CreateAxios from "../../customhook/CreateAxios";
import axios from "axios";
import Userweatheritem2 from "./Userweatheritem2";
import { css } from "styled-components";
import { API_BASE } from "../../config/api";

const Headers=styled.div`
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${(props)=>props.theme.textMuted};
`

const Datediv=styled.div`

width: 100%;
text-align: center;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${(props)=>props.theme.text};
`
const Wrapper=styled.div`
  position: relative;
  overflow: hidden;
  /* top 오프셋은 높이를 만들지 않아 그만큼 아래가 잘린다. 패딩으로 준다. */
  padding: 12px 0 4px;
  /* 배경은 바깥 사이드바 패널이 갖는다 */
  background-color: transparent;
  color: ${(props)=>props.theme.text};
`
const WeathercardConatiner=styled.div`
  overflow: hidden;
  border-top: 1px solid ${(props)=>props.theme.border};
  height: 400px;
`
//슬라이드애니메이션
//====================================================================
// 카드 한 칸의 높이. Weatheritemwrapper 가 이 높이를 강제하므로
// margin 겹침 같은 변수 없이 "이동거리 = 한 칸"이 항상 정확히 맞는다.
// (예전엔 카드가 실제로 120px 남짓 간격인데 애니메이션은 170px 를 움직여서,
//  슬라이드가 끝나고 상태가 바뀌는 순간 그 차이만큼 카드가 튀었다)
const CARD_PITCH=130;
// 넘김 1회 소요시간. 아래 setTimeout 과 반드시 같아야 한다.
const SLIDE_MS=380;
// 끝에서 부드럽게 감속
const SLIDE_EASE="cubic-bezier(0.22, 1, 0.36, 1)";
//====================================================================

// 가장자리 -> 가운데 (커지며 선명해진다)
const Slideup=keyframes`
  from{
    transform: translateY(0) scale(0.9);
    opacity: 0.5;
  }
  to{
    transform: translateY(-${CARD_PITCH}px) scale(1);
    opacity: 1;
  }
`
const Slidedown=keyframes`
  from{
    transform: translateY(0) scale(0.9);
    opacity: 0.5;
  }
  to{
    transform: translateY(${CARD_PITCH}px) scale(1);
    opacity: 1;
  }
`
// 가운데 -> 가장자리 (작아지며 흐려진다)
const mainSlideup=keyframes`
  from{
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to{
    transform: translateY(-${CARD_PITCH}px) scale(0.9);
    opacity: 0.5;
  }
`
const mainSlidedown=keyframes`
  from{
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to{
    transform: translateY(${CARD_PITCH}px) scale(0.9);
    opacity: 0.5;
  }
`
// 가장자리 -> 화면 밖.
// 예전에는 10%씩 끊어서 옮긴 뒤 476px 로 순간이동시켰는데,
// 그 구간이 등속이라 뚝뚝 끊겨 보였고 어차피 55% 부터 투명해서 보이지도 않았다.
// 그냥 한 칸 밀려나며 사라지게 한다.
const turnup=keyframes`
  from{
    transform: translateY(0) scale(0.9);
    opacity: 0.5;
  }
  to{
    transform: translateY(-${CARD_PITCH}px) scale(0.82);
    opacity: 0;
  }
`
const turndown=keyframes`
  from{
    transform: translateY(0) scale(0.9);
    opacity: 0.5;
  }
  to{
    transform: translateY(${CARD_PITCH}px) scale(0.82);
    opacity: 0;
  }
`
// 끝(첫/마지막 시각)이라 넘어갈 카드가 없을 때는 제자리에서 사라진다
const fadeout=keyframes`
  from{
    opacity: 0.5;
    transform: scale(0.9);
  }
  to{
    opacity: 0;
    transform: scale(0.82);
  }
`

const Arrow=styled.div`
   position: relative;
    margin: 10px;
    content: '';
    width: 14px; //화살표 크기
    height: 14px; //화살표 크기
    cursor: pointer;

    color:${(props)=>props.theme.textMuted};
    border-top: 2px solid ${(props)=>props.theme.textMuted}; //화살표 선
    border-right: 2px solid ${(props)=>props.theme.textMuted}; //화살표 선
    transform:${props=>props.rota?'rotate(-45deg)':'rotate(135deg)'} ; //다음 화살표
    transition: border-color ${(props)=>props.theme.transition};

    &:hover {
      border-top-color: ${(props)=>props.theme.accent};
      border-right-color: ${(props)=>props.theme.accent};
    }
`
//컨테이너스타일
const WeatherContainer=styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  
  position: relative;
`
//애니메이션 효과
const getAnimation=({index,any,isindex})=>{
//첫번째 요소 조건
if(index===0){
 if(any==="down"){
  
  if(isindex==="last"){

    return fadeout;
  }else{

    return turnup;
  }
  
 
  
 }else if(any ==="up"){

 
  
 
  return Slidedown;
  
 }

}
//두번째요소
else if (index===1){

  if(any==="down"){

    return mainSlideup;
  }else if(any ==="up"){
   
    return mainSlidedown;
  }
}
//세번째요소
else if (index===2){

  if(any==="down"){

    
    return Slideup;
    
   }else if(any ==="up"){
  
  
    if(isindex==="first"){

      return fadeout;
    }else{
  
      return turndown;
    }
    
   }
}

return null;

}
const Weatheritemwrapper=styled.div`
  /* 한 칸 높이를 여기서 확정한다. 카드의 margin 에 맡기면
     형제간 margin 겹침 때문에 실제 간격이 애니메이션 이동거리와 어긋난다. */
  height: ${CARD_PITCH}px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: ${props=>props.isCurrent?1:0.5}; //투명도
  transform: scale(${props => props.isCurrent ? 1 : 0.9}); //크기
  will-change: transform, opacity;

  ${({index,any,isindex})=>{
    const name=getAnimation({index,any,isindex});
    //넘기는 중이 아닐 때는 animation 속성을 아예 넣지 않는다
    return name?css`
      animation:${name} ${SLIDE_MS}ms ${SLIDE_EASE} forwards;
    `:"";
  }}
`
function Userweather2(props){
    
    const [loginuser,Setloginuser,removeloginuser]=useCookies(['userinfo'])
    const {userregion}=props;
    const axiosinstance=CreateAxios();
    const [weatherdata,setWeatherdata]=useState();
    const [asd,setAsd]=useState(
      {"123":{
        "asd":{sky:1}
      }}
    )

    const [timeindex,setTimeindex]=useState(2);

    //슬라이드애니메이션
    const [animationeff,setAnimation]=useState(null);
    
    const handlerSlideup=()=>{
        //넘기는 도중에 또 누르면 인덱스가 어긋나므로 막는다
        if(animationeff) return;
        setAnimation("up")
        setTimeout(()=>{
          setTimeindex(previndex=>previndex-1)
          setAnimation(null)//초기화
        },SLIDE_MS)//애니메이션지속시간과 동일해야 한다
    }
    const handlerSlidedown=()=>{
      if(animationeff) return;
      setAnimation("down")
      setTimeout(()=>{
        setTimeindex(previndex=>previndex+1)
        setAnimation(null)//초기화
      },SLIDE_MS)//애니메이션지속시간과 동일해야 한다
  }

    //========================================
    useEffect(()=>{
        if(loginuser.userinfo){
          console.log("유저주소있음"+loginuser.userinfo.gridy)
          axios.get(`${API_BASE}/open/weatherdata`,{
            params:{
                region:loginuser.userinfo.region.replaceAll("+"," "),
                gridx:loginuser.userinfo.gridx,
                gridy:loginuser.userinfo.gridy
            }
          }).then((res)=>{
            console.log(res)
            console.log(asd)
            setWeatherdata(res.data)
            Setloginuser("weather",res.data[0])
            
          }).catch((err)=>{

          })
        }
        else{

          //유저주소없음
            axios.get(`${API_BASE}/open/weatherdata`)
            .then((res)=>{
                console.log("날씨데이터"+res)
                setWeatherdata(res.data)
                //유저없어도쿠키는가져오기
                Setloginuser("weather",res.data[0])
            }).catch((err)=>{
              console.log("날씨정보를가져오지못했습니다")
            })
          console.log("유저없음")
        }
        
      },[])
    
      useEffect(()=>{

      },[timeindex])

      

      //날짜함수
      const Datefor=(data)=>{
        const str = data.toString();
        const year=str.substring(0,4)
        const month=str.substring(4,6)
        const day=str.substring(6,8)
        return `${year}년 ${month}월 ${day}일`
      }
    return(
        
        <Wrapper>
        <Headers>
        {loginuser.userinfo ?loginuser.userinfo.region.replaceAll("+"," "):<>서울</>
       }    

        </Headers>
      

          
            <WeatherContainer>
            {weatherdata?
              <>
              {timeindex>0&&
              <>
              <Datediv>
                  {//날짜정리필요
                  Datefor(weatherdata[timeindex].date)
                     }
              </Datediv>
                {//위화살표
                }
              <Arrow rota={true} onClick={()=>{handlerSlideup()}}/>
          </>
              }
                     { /*키값주면 알아서 렌더링되긴함 useeffect안써도 근데비용이크다고함*/ }
        <WeathercardConatiner>

              <Weatheritemwrapper index={0} isCurrent={false} isNew={true}  any={animationeff} isindex={timeindex===weatherdata.length-2&&"last"} >
          <Userweatheritem2 key={timeindex-1}   dates={weatherdata[timeindex-1]}/>
          </Weatheritemwrapper>
       

               <Weatheritemwrapper index={1}isCurrent={true} isNew={true}  any={animationeff} >
            <Userweatheritem2  key={timeindex}  dates={weatherdata[timeindex]}/> 
            
            </Weatheritemwrapper>
        
            <Weatheritemwrapper index={2} isCurrent={false} isNew={true}  any={animationeff} isindex={timeindex===1&&"first"}>
              <Userweatheritem2  key={timeindex+1}  dates={weatherdata[timeindex+1]} />
              </Weatheritemwrapper>
              </WeathercardConatiner>
              {timeindex<weatherdata.length-1&&
              <>
           
                
                <Arrow rota={false} onClick={()=>{handlerSlidedown()}}/>
                
                
              </>}
          
            </>
:<>
<br/>
서버와의연결을 확인해주세요
</>
}
            <br/>

            </WeatherContainer>
          
        
   
                </Wrapper>
   
    )

}
export default Userweather2;