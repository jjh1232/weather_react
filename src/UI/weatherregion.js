import React, { useCallback, useEffect, useState } from "react";
import Modal from 'react-modal'
import axios from "axios";
import Button from "./Button";
import styled from "styled-components";
import Pagenation from "./WeatherPagenation";
import useDidMounteffect from "../customhook/usdDidMountEffect";
import WeatherPagenation from "./WeatherPagenation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareXmark as closeicon } from "@fortawesome/free-solid-svg-icons";
const Modalin=styled.div`
display: flex;
flex-direction: column;
  position: fixed;
  bottom: 50px;
  right: 220px;
background-color: white;
  width: 400px;
  height: 450px;
  border: 1px solid black;
  
`

const Headerdiv=styled.div`
border-bottom: 1px solid gray;
padding: 5px;
display: flex;
height: 13%;

`
const Headerdatadiv=styled.div`
display: flex;
flex-direction: column;
padding-left: 3px;
gap: 5px;
`
const Headerclosediv=styled.div`
//border: 1px solid black;
margin-left: auto;
`
const Headerclosebutton=styled.button`
border: none;
background: none;
cursor: pointer;
  position: relative;
  width: 30px;
  height: 30px;
  
`
const Closeimo=styled(FontAwesomeIcon)`
//width와 height사용은가능하지만 권장안한다고함
font-size: 30px;
color: red;
position: absolute;
top: -2px;
right: 0px;

`
const Headertextdiv=styled.div`
  display: flex;
  
  gap: 5px;
   align-items: center;  
`
const Title=styled.label`
  color: #050000ff;
  font-weight: 800;
  font-size:18px;
  

`
const Ex=styled.small`
 color: #757575ff;
  font-weight: 400;
  font-size:14px;
`
const Searchinput=styled.input`
   width: 100%;
  padding: 2px 2px;
  font-size: 16px;
  border: 1.5px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4d90fe;
    box-shadow: 0 0 6px rgba(77, 144, 254, 0.5);
  }

  &::placeholder {
    color: #999;
  }
`


const Maindiv=styled.div`

border-bottom:1px solid black;
height: 82%;
`
//각지역 배열들
const RegionTap=styled.div`
border-bottom:${({ noBorder }) => (noBorder ? 'none' : '0.3px solid gray')};
padding:5px 10px;
background-color: ${({isActive})=>(isActive? `#f0ece3` :`transparent`)};
color:${({isActive})=>(isActive? `blue`: `black`)};
cursor:pointer;

:hover{
    background-color:rgba(0,0,0,0.1);
}

//마지막은 주지않기
 
`


const Bottomdiv=styled.div`
  height: 5%;
flex: 1;

  display: flex;
  justify-content: space-between;  /* 왼쪽과 오른쪽 끝으로 배치 */
  align-items: center;             /* 세로 가운데 정렬 */
  padding: 8px; 
`
//첫 열기버튼
const SubButton=styled.button`
     height: 28px;
  padding: 0px 8px;
  border: 1px solid #797979ff;
  background-color: #25c1ffff;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #4d59ffff;
  }

  &:disabled {
    background-color: #5392ffff;
    cursor: not-allowed;
  }
`
const Pagenationdiv=styled.div`
  position: relative;
  
  float: left;
  height: 20px;
`
const Confirmbutton=styled.button`
  margin-left: auto;

     height: 28px;
  padding: 0 6px;
  border: 1px solid #000000ff;
  background-color: #3365eeff;
  color: white;
  border-radius: 4px;
  font-size: 18px;
  width: 60px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #4900f3ff;
  }

  &:disabled {
    background-color: #196dffff;
    cursor: not-allowed;
  }

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
        Setselectlegion(regiondata[i])//선택위치상태저장
       
    }
    const CloseHandler=()=>{

      setModalIsOpen(false)
      setKeyword("")
        Setregiondata([])
            setTotalPage(0)
            setPage(1)
            setActiveTab(-1)
    }
   
    const Confirmhandler=()=>{
      if(selectlegion){
      onGetdata(selectlegion)
      }
      setModalIsOpen(false)
      setKeyword("")
        Setregiondata([])
            setTotalPage(0)
             setPage(1)
             setActiveTab(-1)
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

        <Headerdatadiv>
     
        <Headertextdiv>
          <Title>	지역 입력</Title>
          <Ex>ex)부산광역시 중구 영주제1동</Ex> 
        </Headertextdiv>
      
        <Searchinput type="text" value={keyword} onChange={(e)=>{setKeyword(e.target.value) 
          setPage(1)}} />
       
       
       {
        //검색시 페이지는 1이 되야함
       }
            
        </Headerdatadiv>
        <Headerclosediv>
        <Headerclosebutton onClick={()=>{CloseHandler()}}>
        <Closeimo icon={closeicon} />
        </Headerclosebutton>
        </Headerclosediv>
       </Headerdiv>
       <Maindiv>

      
        
        {regiondata.map(function(a,i){
          //현재아이템이 10개인지 boolean
            const isFullPage=regiondata.length===10;
            //마지막인지
            const islastitem=i===regiondata.length -1;
            //마지막이고 전체가열개일때만 두조건만족시 true
            const noBorder=isFullPage &&islastitem;
            return (
                <RegionTap 
                    key={i}
                    isActive={activeTab===i}    
                    noBorder={noBorder}         
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

          
         {keyword.trim().length>=2 && totalpage>1 &&
        (<Pagenationdiv>

        
        <WeatherPagenation currentpage={page} getpagedata={getpagedata} totalpages={totalpage} />
      </Pagenationdiv>
        )}

        <Confirmbutton onClick={()=>Confirmhandler()}>확인</Confirmbutton>
      </Bottomdiv>
        </Modalin>
      
}
    </>
    )
}

export default weatherregion;