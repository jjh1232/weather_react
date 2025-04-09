import React, { useEffect, useState } from "react";
import styled,{ keyframes } from "styled-components";
import { useCookies } from "react-cookie";
import CreateAxios from "../../customhook/CreateAxios";
import axios from "axios";
import Userweatheritem2 from "./Userweatheritem2";
import { css } from "styled-components";

const Headers=styled.div`
  
`

const Wrapper=styled.div`
  position: relative;
  
  top: 10px;
  background-color: rgba(255,255,255,0.1);
  
  
`
//슬라이드애니메이션
const Slideup=keyframes`
  from{
    transform: translateY(0) scale(0.9) ;
    opacity: 0.5;
    }
  to{
    transform: translateY(-100px) scale(1) ;
    opacity: 1;
    }
`
const Slidedown=keyframes`
    from{
    transform: translateY(0)  scale(0.9) ;
    opacity: 0.5;
   }
  to{
    transform: translateY(100px)  scale(1) ;
    opacity: 1;
    }
`
const mainSlideup=keyframes`
  from{
    transform: translateY(0) scale(1) ;
    opacity: 1;
    }
  to{
    transform: translateY(-100px) scale(0.9) ;
    opacity: 0.5;
    }
`
const mainSlidedown=keyframes`
    from{
    transform: translateY(0)  scale(1) ;
    opacity: 1;
   }
  to{
    transform: translateY(100px)  scale(0.9) ;
    opacity: 0.5;
    }
`
const turnup=keyframes`
    0%{
    transform: translateY(0)  scale(0.9);
  
  }10%{
    transform: translateY(17px)  scale(0.86);
  }20%{
    transform: translateY(34px)  scale(0.82);
  }30%{
    transform: translateY(51px)  scale(0.78);
  }40%{
    transform: translateY(68px)  scale(0.74);
  }50%{
    transform: translateY(85px)  scale(0.7);
  }
  
  60%{
    transform: translateY(102px)  scale(0.74);
  }70%{
    transform: translateY(119px)  scale(0.78);
  }80%{
    transform: translateY(136px)  scale(0.82);
  }90%{
    transform: translateY(153px)  scale(0.86);
  }
  100%{
    transform: translateY(170px)  scale(0.9);
   
  }
`
const turndown=keyframes`
        0%{
    transform: translateY(0)  scale(0.9);
  
  }10%{
    transform: translateY(-17px)  scale(0.86);
  }20%{
    transform: translateY(-34px)  scale(0.82);
  }30%{
    transform: translateY(-51px)  scale(0.78);
  }40%{
    transform: translateY(-68px)  scale(0.74);
  }50%{
    transform: translateY(-85px)  scale(0.7);
  }
  
  60%{
    transform: translateY(-102px)  scale(0.74);
  }70%{
    transform: translateY(-119px)  scale(0.78);
  }80%{
    transform: translateY(-136px)  scale(0.82);
  }90%{
    transform: translateY(-153px)  scale(0.86);
  }
  100%{
    transform: translateY(-170px)  scale(0.9);
   
  }
`
const fadeout=keyframes`
  from{
    opacity: 0.5;
    transform: scale(0.9);
  }
  to{
    
    opacity: 0.0;
    transform: scale(0.5);
  }
`

const Arrow=styled.div`
   position: relative;
    margin: 10px;
    content: '';
    width: 30px; //화살표 크기
    height: 30px; //화살표 크기
    border-top: 5px solid #000; //화살표 선
    border-right: 5px solid #000; //화살표 선
    transform:${props=>props.rota?'rotate(-45deg)':'rotate(135deg)'} ; //다음 화살표
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
  //transition: all 0.3s ease;
  opacity: ${props=>props.isCurrent?1:0.5}; //투명도
  transform: scale(${props => props.isCurrent ? 1 : 0.9}); //크기
  ${({index,any,isindex})=>css`
    animation:${getAnimation({index,any,isindex})} 1s ease-in-out forwards;
  `}
  
  
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
        setAnimation("up")
        setTimeout(()=>{
          setTimeindex(previndex=>previndex-1)
          setAnimation(null)//초기화
        },1000)//애니메이션지속시간
    }
    const handlerSlidedown=()=>{
      setAnimation("down")
      setTimeout(()=>{
        setTimeindex(previndex=>previndex+1)
        setAnimation(null)//초기화
      },1000)//애니메이션지속시간
  }

    //========================================
    useEffect(()=>{
        if(loginuser.userinfo){
          console.log("유저주소있음"+loginuser.userinfo.gridy)
          axios.get("http://localhost:8081/open/weatherdata",{
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
            axios.get("http://localhost:8081/open/weatherdata")
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

      
    return(
        
        <Wrapper>
        <Headers>
        {loginuser.userinfo &&loginuser.userinfo.region.replaceAll("+"," ")
       }    
      
        </Headers>
      
        
          
            <WeatherContainer>
            {weatherdata&&
              <>
              {timeindex>0&&
              <>
          

              <Arrow rota={true} onClick={()=>{handlerSlideup()}}/>
          </>
              }
                     { /*키값주면 알아서 렌더링되긴함 useeffect안써도 근데비용이크다고함*/ }
              <Weatheritemwrapper index={0} isCurrent={false} isNew={true}  any={animationeff} isindex={timeindex===weatherdata.length-2&&"last"} >
          <Userweatheritem2 key={timeindex-1}   dates={weatherdata[timeindex-1]}/>
          </Weatheritemwrapper>
       

               <Weatheritemwrapper index={1}isCurrent={true} isNew={true}  any={animationeff} >
            <Userweatheritem2  key={timeindex}  dates={weatherdata[timeindex]}/> 
            
            </Weatheritemwrapper>
        
            <Weatheritemwrapper index={2} isCurrent={false} isNew={true}  any={animationeff} isindex={timeindex===1&&"first"}>
              <Userweatheritem2  key={timeindex+1}  dates={weatherdata[timeindex+1]} />
              </Weatheritemwrapper>
              {timeindex<weatherdata.length-1&&
              <>
           
                
                <Arrow rota={false} onClick={()=>{handlerSlidedown()}}/>
                
                
              </>}
          
            </>
}
            <br/>

            </WeatherContainer>
          
        
   
                </Wrapper>
   
    )

}
export default Userweather2;