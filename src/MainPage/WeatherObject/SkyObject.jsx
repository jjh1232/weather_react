import React from "react";
import styled from "styled-components";

const SunObject=styled.div`
    width: 100px;
    height: 100px;
    background: radial-gradient(#FFD700, #FF8C00);
  border-radius: 50%;
  top: 50px;
  left:50px;
  position: absolute;
  box-shadow: 0 0 60px rgba(255,69,0,0.5);

`

const Moon = styled.div`
  width: ${(props) => props.size || '100px'};
  height: ${(props) => props.size || '100px'};
  background-color: ${(props) => props.color || '#f0ed668b'};
  border-radius: 50%;
  transform: rotate(120deg);
  top:60px;
  left: 60px;
  position: relative;
  clip-path: path('M50 0A50 50 0 1 1 0 75A25 25 0 0 0 50 0Z');
  //clip-path: polygon(50% 0%, 50% 100%, 0% 100%, 0% 0%);
`;
// 구름 조각
const CloudPart = styled.div`

  z-index: -3px;
  opacity: 0.93;
  background: ${(props)=>props.color?"gray":"white"};
  border-radius: 50%;
  
  position: absolute;
  
 // animation: bounce 3s infinite alternate;

  //@keyframes bounce {
   // 0% { transform: translateY(0); }
   // 100% { transform: translateY(-20px); }
  //}
`;

// 구름 컨테이너
const Cloud = styled.div`
  position: absolute;
 
  margin: 10px;


`;

export default function SkyObject(props){
    const {sky}=props;
    let time=new Date().getHours();
    let isnight=18<=time||time<6?true:false;
    if(sky===1){
      //맑음
      return (
        <>
        {isnight?<Moon/>:<SunObject/>}
        
             
             </>
      )
    }
    else if(sky===3){
        //구름많음

        const generateClouds = (count) => {

          return Array.from({ length: count }, (_,index) => ({//length가 배열길이 object라뭐그렇다는데
            width: `${Math.random() * 100 + 150}px`, // 구름 컨테이너 너비 (150~250px)
            height: `${Math.random() * 50 + 100}px`, // 구름 컨테이너 높이 (100~150px)
            top: `${Math.random() * 300}px`, // 화면 상단에서 랜덤 위치
           left: `${index * 300}px`, // 화면 좌측에서 일정 간격으로 배치
          }));
        };
  
        let Cloudnum=generateClouds(7) //구름생성갯수
        return (
          <>
            {isnight?<Moon/>:<SunObject/>} 
                        
           
            {Cloudnum.map((cloudstyled,index)=>(
  < Cloud key={index} style={cloudstyled}>
  <CloudPart style={{ width: '40%', height: '40%', top: '10%', left: '5%' }} />
          <CloudPart style={{ width: '50%', height: '50%', top: '0%', left: '30%' }} />
          <CloudPart style={{ width: '35%', height: '35%', top: '20%', left: '70%' }} />
  </Cloud>
              ))}
            </>
          )
    }
    else{
      //흐림
      const generateClouds = (count) => {

        return Array.from({ length: count }, (_,index) => ({//length가 배열길이 object라뭐그렇다는데
          width: `${Math.random() * 100 + 150}px`, // 구름 컨테이너 너비 (150~250px)
          height: `${Math.random() * 50 + 100}px`, // 구름 컨테이너 높이 (100~150px)
          top: `${Math.random() * 300}px`, // 화면 상단에서 랜덤 위치
         left: `${index * 300}px`, // 화면 좌측에서 일정 간격으로 배치
        }));
      };

      let Cloudnum=generateClouds(7) //구름생성갯수
      return (
        <>
           {isnight?<Moon/>:<SunObject/>}   
                      
         
          {Cloudnum.map((cloudstyled,index)=>(
< Cloud key={index} style={cloudstyled}>
<CloudPart style={{ width: '40%', height: '40%', top: '10%', left: '5%' }} color={true}/>
        <CloudPart style={{ width: '50%', height: '50%', top: '0%', left: '30%' }} color={true}/>
        <CloudPart style={{ width: '35%', height: '35%', top: '20%', left: '70%' }} color={true}/>
</Cloud>
            ))}
          </>
        )
    }


 
  }

