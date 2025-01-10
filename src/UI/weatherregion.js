import React, { useEffect, useState } from "react";
import Modal from 'react-modal'
import axios from "axios";
import Button from "./Button";
import styled from "styled-components";
import Pagenation from "./Pagenation";
import useDidMounteffect from "../customhook/usdDidMountEffect";


const RegionTap=styled.div`
border:none;
padding:10px 20px;
background-color: ${({isActive})=>(isActive? `#f0ece3` :`transparent`)};
color:${({isActive})=>(isActive? `grey`: `black`)};
cursor:pointer;
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
    weathersearch();
},[page])


    const weathersearch=()=>{
        
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
      <button onClick={(e)=> {
        e.preventDefault()
        setModalIsOpen(true)
      }
      }>{title}</button>
	  <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}
        ariaHideApp={false}
        > 


      	지역 입력 <br/>
        <input type="text" value={keyword} onChange={(e)=>{setKeyword(e.target.value)}} />
        <Button title="검색" onClick={()=>{
            weathersearch();
            setPage(1);
        }} />
        <br/>
       
        
        {regiondata.map(function(a,i){
            
        
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
        
        <Pagenation currentpage={page} getpagedata={getpagedata} totalpages={totalpage} />
        {totalpage}
        <br/>
        <button onClick={()=>setModalIsOpen(false)}>확인</button>
        {selectlegion}
        
      </Modal>
    </>
    )
}

export default weatherregion;