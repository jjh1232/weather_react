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
  width: ${(props) => props.size || '100px'}; /* 크기 */
  height: ${(props) => props.size || '100px'};
  background-color: ${(props) => props.color || '#f0e68c'}; /* 색상 */
  border-radius: 50%; /* 원형 */
  box-shadow: ${(props) =>
    props.phase === 'full'
      ? '0 0 20px rgba(255, 255, 255, 0.5)' // 가득 찬 달
      : 'inset -20px -20px 30px rgba(0, 0, 0, 0.5)'}; /* 달의 위상 표현 */
  position: relative;
  top: 50px;
   /* 반달 모양 만들기 */
   &::before {
    content: '';
    position: absolute;
    width: ${(props) => props.size || '100px'};
    height: ${(props) => props.size || '100px'};
    background-color: ${(props) => props.background || '#000'}; /* 어두운 부분 */
    border-radius: 50%; /* 원형 */
    top: 0;
    left: ${(props) =>
      props.phase === 'half' ? '50%' : '25%'}; /* 반달 위치 조정 */
    transform: translateX(-50%);
  }
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
  border: 2px solid red;

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

