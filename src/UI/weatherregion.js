import React, { useCallback, useEffect, useState } from "react";
import Modal from 'react-modal'
import axios from "axios";
import Button from "./Button";
import styled, { keyframes } from "styled-components";
import Pagenation from "./WeatherPagenation";
import useDidMounteffect from "../customhook/usdDidMountEffect";
import WeatherPagenation from "./WeatherPagenation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareXmark as closeicon } from "@fortawesome/free-solid-svg-icons";
import { API_BASE } from "../config/api";
//=====================================================================
// 지역 찾기 모달
//  - 예전에는 화면 오른쪽 아래에 고정(bottom:50px; right:220px)으로 떠서
//    창 크기에 따라 폼을 가리거나 화면 밖으로 나갔다. 가운데 모달로 바꿨다.
//  - 색/굴곡은 전부 테마 토큰. 흰 배경 + 검은 테두리가 박혀 있었다.
//=====================================================================

const fadein = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`
const popin = keyframes`
  from { opacity: 0; transform: translateY(10px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

const Backdrop=styled.div`
  position: fixed;
  inset: 0;
  z-index: 9980;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: ${(props)=>props.theme.overlay};
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  animation: ${fadein} 140ms ${(props)=>props.theme.ease};

  @media (prefers-reduced-motion: reduce) { animation: none; }
`
const Modalin=styled.div`
  display: flex;
  flex-direction: column;
  width: min(420px, 100%);
  height: min(520px, 100%);
  overflow: hidden;
  border: 1px solid ${(props)=>props.theme.border};
  border-radius: ${(props)=>props.theme.radiusLg};
  background: ${(props)=>props.theme.surface};
  box-shadow: ${(props)=>props.theme.shadowLg};
  color: ${(props)=>props.theme.text};
  animation: ${popin} 180ms ${(props)=>props.theme.ease};

  @media (prefers-reduced-motion: reduce) { animation: none; }
`
const Headerdiv=styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 18px 18px 14px;
  border-bottom: 1px solid ${(props)=>props.theme.border};
`
const Headerdatadiv=styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const Headerclosediv=styled.div`
  margin-left: auto;
`
const Headerclosebutton=styled.button`
  border: none;
  background: none;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(props)=>props.theme.radiusSm};
  color: ${(props)=>props.theme.textFaint};

  &:hover {
    background: ${(props)=>props.theme.surfaceHover};
    color: ${(props)=>props.theme.text};
  }
  &:focus-visible {
    outline: 2px solid ${(props)=>props.theme.accent};
    outline-offset: 1px;
  }
`
//빨간 X 아이콘이 제목보다 눈에 띄던 자리. 닫기는 조용해야 한다.
const Closeimo=styled(FontAwesomeIcon)`
  font-size: 19px;
`
const Headertextdiv=styled.div`
  display: flex;
  gap: 6px;
  align-items: baseline;
  flex-wrap: wrap;
`
const Title=styled.label`
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.02em;
  color: ${(props)=>props.theme.text};
`
const Ex=styled.small`
  color: ${(props)=>props.theme.textFaint};
  font-weight: 400;
  font-size: 12.5px;
`
const Searchinput=styled.input`
  width: 100%;
  height: ${(props)=>props.theme.fieldHeight};
  padding: 0 ${(props)=>props.theme.fieldPadX};
  font-size: ${(props)=>props.theme.fieldFont};
  color: ${(props)=>props.theme.text};
  background: ${(props)=>props.theme.surfaceAlt};
  border: 1px solid ${(props)=>props.theme.border};
  border-radius: ${(props)=>props.theme.radius};
  outline: none;
  transition: border-color ${(props)=>props.theme.transition},
              box-shadow ${(props)=>props.theme.transition};

  &:focus {
    border-color: ${(props)=>props.theme.accent};
    box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
  }
  &::placeholder { color: ${(props)=>props.theme.textFaint}; }
`
const Maindiv=styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`
//각 지역 줄
const RegionTap=styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 18px;
  font-size: 14px;
  cursor: pointer;
  border-bottom: ${({noBorder,theme})=>(noBorder?"none":`1px solid ${theme.border}`)};
  background: ${({isActive,theme})=>(isActive?theme.accentSoft:"transparent")};
  color: ${({isActive,theme})=>(isActive?theme.accent:theme.text)};
  font-weight: ${({isActive})=>(isActive?600:400)};
  transition: background ${(props)=>props.theme.transition},
              color ${(props)=>props.theme.transition};

  &:hover {
    background: ${({isActive,theme})=>(isActive?theme.accentSoft:theme.surfaceHover)};
  }
`
//검색 전/결과 없음 안내. 예전에는 둘 다 그냥 빈 칸이었다.
const Hintdiv=styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 24px;
  text-align: center;
  color: ${(props)=>props.theme.textMuted};
  font-size: 13.5px;
  line-height: 1.6;
`
const Bottomdiv=styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-top: 1px solid ${(props)=>props.theme.border};
  background: ${(props)=>props.theme.surfaceAlt};
`
//첫 열기버튼 (폼 안에 있는 "지역 찾기")
const SubButton=styled.button`
  flex: none;
  height: 30px;
  padding: 0 12px;
  border: 1px solid transparent;
  background: ${(props)=>props.theme.accent};
  color: #fff;
  border-radius: ${(props)=>props.theme.radiusPill};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: filter ${(props)=>props.theme.transition};

  &:hover:not(:disabled) { filter: brightness(1.08); }
  &:active:not(:disabled) { filter: brightness(0.94); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:focus-visible {
    outline: 2px solid ${(props)=>props.theme.accent};
    outline-offset: 2px;
  }
`
const Pagenationdiv=styled.div`
  min-width: 0;
  overflow-x: auto;
`
const Confirmbutton=styled.button`
  margin-left: auto;
  flex: none;
  height: 34px;
  padding: 0 18px;
  border: 1px solid transparent;
  background: ${(props)=>props.theme.accent};
  color: #fff;
  border-radius: ${(props)=>props.theme.radiusPill};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: filter ${(props)=>props.theme.transition};

  &:hover:not(:disabled) { filter: brightness(1.08); }
  &:disabled {
    background: ${(props)=>props.theme.surface};
    border-color: ${(props)=>props.theme.border};
    color: ${(props)=>props.theme.textFaint};
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${(props)=>props.theme.accent};
    outline-offset: 2px;
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
        axios.get(`${API_BASE}/open/pageregion`,{
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

    //Esc 로도 닫힌다. 모달이 떠 있는 동안은 뒤쪽 스크롤을 막는다.
    useEffect(()=>{
      if(!modalIsOpen) return undefined;
      const onkey=(e)=>{ if(e.key==="Escape"){ e.stopPropagation(); CloseHandler(); } }
      const prevoverflow=document.body.style.overflow;
      document.body.style.overflow="hidden";
      window.addEventListener("keydown",onkey);
      return ()=>{
        window.removeEventListener("keydown",onkey);
        document.body.style.overflow=prevoverflow;
      }
    },[modalIsOpen])

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
        <Backdrop onMouseDown={(e)=>{ if(e.target===e.currentTarget) CloseHandler() }}>
        <Modalin onMouseDown={(e)=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label="지역 찾기">
        <Headerdiv>

        <Headerdatadiv>
     
        <Headertextdiv>
          <Title>	지역 입력</Title>
          <Ex>ex)부산광역시 중구 영주제1동</Ex> 
        </Headertextdiv>
      
        <Searchinput type="text" value={keyword} autoFocus
          placeholder="시/구/동 이름을 두 글자 이상"
          aria-label="지역 검색"
          onChange={(e)=>{setKeyword(e.target.value)
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

        {keyword.trim().length<2 &&
          <Hintdiv>
            <span>찾으실 지역을 입력해주세요</span>
            <span>두 글자 이상 입력하면 검색이 시작됩니다</span>
          </Hintdiv>}

        {keyword.trim().length>=2 && regiondata.length===0 &&
          <Hintdiv>
            <span>검색 결과가 없습니다</span>
            <span>시/구/동 이름을 다시 확인해주세요</span>
          </Hintdiv>}

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

        {/* 고르기 전에는 누를 게 없다. 예전에는 눌러도 아무 일이 없었다. */}
        <Confirmbutton onClick={()=>Confirmhandler()} disabled={!selectlegion}>확인</Confirmbutton>
      </Bottomdiv>
        </Modalin>
        </Backdrop>
      
}
    </>
    )
}

export default weatherregion;