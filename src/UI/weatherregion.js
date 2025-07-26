import React, { useCallback, useEffect, useState } from "react";
import Modal from 'react-modal'
import axios from "axios";
import Button from "./Button";
import styled from "styled-components";
import Pagenation from "./WeatherPagenation";
import useDidMounteffect from "../customhook/usdDidMountEffect";
import WeatherPagenation from "./WeatherPagenation";


const Modalin=styled.div`
display: flex;
flex-direction: column;
  position: fixed;
  right: 100px;
background-color: white;
  width: 400px;
  height: 430px;
  
`
const Wrapper=styled.div`
  display :flex ;
  flex-direction: column;

`
const Headerdiv=styled.div`
border: 1px solid red;
`
const Maindiv=styled.div`
border : 1px solid blue;
height: 340px;
`
const Bottomdiv=styled.div`
border: 1px solid green;
flex: 1;

  display: flex;
  justify-content: space-between;  /* 왼쪽과 오른쪽 끝으로 배치 */
  align-items: center;             /* 세로 가운데 정렬 */
  padding: 8px; 
`

//각지역 배열들
const RegionTap=styled.div`
border:none;
padding:5px 10px;
background-color: ${({isActive})=>(isActive? `#f0ece3` :`transparent`)};
color:${({isActive})=>(isActive? `grey`: `black`)};
cursor:pointer;
`

//첫 열기버튼
const SubButton=styled.button`
     height: 28px;
  padding: 0 6px;
  border: 1px solid #000000ff;
  background-color: #4d6b77ff;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #35e84dff;
  }

  &:disabled {
    background-color: #196dffff;
    cursor: not-allowed;
  }
`
const Pagenationdiv=styled.div`
  position: relative;
  border: 1px solid blue;
  float: left;
`

function weatherregion(props){
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [keyword,setKeyword]=useState("")
    const [page,setPage]=useState(1)
 
    const {title,onGetdata}=props;

    const [regiondata,Setregiondata]=useState([])

    const [selectlegion,Setselectlegion]=useState();
   
    const [totalpage,setTotalPage]=useState();

    const [activeTab,setActiveTab]=useState(-1)
    
  
useDidMounteffect(()=>{
    console.log("페이지변경")
    if(keyword.length<2){
      return ; //길이가짧으면검색안하기

    }
    const handler=setTimeout(()=>{
       weathersearch();
    },500);
    //바뀌기전에 기존타이머제거
    return ()=>{
      clearTimeout(handler);
    }
   
},[page,keyword])

//lodash라이브러리로 debounce사용해보자


    const weathersearch=(e)=>{
      //모달창내부가 form안에있기때문에 버튼이 submit이되버림
      //또한 useeffect때문에 페이지변경시도실행되기때문에 if문처리해야함
      //e객체가있으때만  
      if(e && e.preventDefault){
        e.preventDefault()
        }
        console.log("page로검색")
        axios.get("/open/pageregion",{
            params:{
                keyword:keyword,
                page:page
            }
        }).then((res)=>{
            console.log(res)
            console.log(res.data.content)
            Setregiondata(res.data.content)
            setTotalPage(res.data.totalPages)
            
        })
    }

    const getpagedata=(currentpagedata)=>{
      console.log(currentpagedata)
      setPage(currentpagedata)
      setActiveTab(-1)
      console.log("크레잇데이터"+page)
      
    }

    const regionda=(i,e)=>{
        console.log(regiondata[i])
        onGetdata(regiondata[i])
       
    }
   

    return (
        <>
      <SubButton onClick={(e)=> {
        e.preventDefault()
        setModalIsOpen(true)
      }
      }>{title}</SubButton>
      {
        //리액트모달컴포넌트 
        //isopen으로 모달창 여부고 onrequest가 외부클릭또는 esc시 닫힘처리임 
        //ariahideapp은 접근성설정이라함
      }
      {modalIsOpen &&
     

        <Modalin>
        <Headerdiv>

        

      	지역 입력 <br/>
        <input type="text" value={keyword} onChange={(e)=>{setKeyword(e.target.value) 
          setPage(1)}} />
       
       
       {
        //검색시 페이지는 1이 되야함
       }
       </Headerdiv>
       <Maindiv>

      
        
        {regiondata.map(function(a,i){
            
        {
            //이거왜 익명안썻지 ㅋ
        }
            return (
                <RegionTap 
                    key={i}
                    isActive={activeTab===i}             
                  onClick={(e)=>{
                        regionda(i,e);
                        setActiveTab(i);
                        }} >
                   {a.region}
        
                </RegionTap>
            )
        })}
         </Maindiv>
         <Bottomdiv>

         
        <Pagenationdiv>

        
        <WeatherPagenation currentpage={page} getpagedata={getpagedata} totalpages={totalpage} />
      </Pagenationdiv>
      

        <button onClick={()=>setModalIsOpen(false)}>확인</button>
      </Bottomdiv>
        </Modalin>
      
}
    </>
    )
}

export default weatherregion;