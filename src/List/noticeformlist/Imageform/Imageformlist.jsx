import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages as imagesicon } from "@fortawesome/free-regular-svg-icons";
import { faHeart as heart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullheart } from "@fortawesome/free-solid-svg-icons";
import CreateAxios from "../../../customhook/CreateAxios";
import AuthCheck from "../../../customhook/authCheck";
import theme from "../../../UI/Manyim/Themecss";
import ImageListmodal from "../../Noticeimage/ImageListmodal";
import { useNavigate } from "react-router-dom";
import { faChartSimple as view } from "@fortawesome/free-solid-svg-icons";
import Viewtrans from "../DateCom/Viewtrans";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";


const Wrapper=styled.div`

    border: 1px solid gray;
    width: 266px;
    margin-right:1px ;
    height: 300px;
    overflow: hidden;
    
`
const Header=styled.div`
   //border : 1px solid blue ;
   display: flex;
   width: 100%;
   height: 50px;
      min-width: 0;
      border-bottom: 1px solid ${theme.text};
`
const Profileimg=styled.img`
    width: 40px;
    height: 40px;
    background-color: white;
    border: 1px solid black;
`
const Userandtitlediv=styled.div`
    width: 230px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const Userdatadiv=styled.div`
    width: 100%;
    display: flex;
    border-bottom: 1px solid ${theme.text} ;
`
const Nicknamediv=styled.div`
    font-size: 15px;
    margin-right: 10px;
`
const Usernamediv=styled.div`
    font-size: 10px;
    color: gray;
`

const Titlediv=styled.div`

     width: 100%;
    
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    
`
const Main=styled.div`
    width: 100%;
    height: 250px;
    position: relative;
  
`
const MainImage=styled.img`
    width: 100%;
    height: 100%;
    object-fit: fill;
`
const Imagenumdiv=styled.div`
position: absolute;
   
    top: 1px;
    right: 2px;
    
    border-radius: 4px;
    padding: 3px 5px;
    font-size: 13px;
    background-color: rgba(0, 0, 0, 0.5); 
  color: white; 
`
const Likebuttondiv=styled.div`
position: absolute;
       
     bottom: 10px;
     right: 5px;
   
  color: white; 
`
const Viewsdiv=styled.div`
    position: absolute;
    bottom:10px;
    left:5px;
  border-radius: 4px;
    padding: 3px 5px;
    font-size: 13px;
    background-color: rgba(0, 0, 0, 0.5); 
  color: white; 
  display: flex;       // flex로 정렬
  align-items: center; // 수직 정렬

`
/*
const Likenumdiv=styled.div`
   
 border-radius: 4px;
    //padding: 1px 5px;
    font-size: 13px;
    background-color: rgba(255, 255, 255, 0.4); 
  color: black; 
    right: 8px;
    bottom: 5px;
    text-align: center;
    position: absolute;
    text-align: center;
    width: 40px;
`
*/
export default function Imageformlist(props){
    //옵션과키워드는 쿼리리페치를위해
    const {content,option,keyword}=props;
    const [isPreview,setisPreview]=useState(false);
    let logincheck=AuthCheck();
   let axiosinstance=CreateAxios()
   const navigate=useNavigate();
   const queryclient=useQueryClient();

 const likemutation=useMutation({
     mutationFn:async (noticeid)=>{
         const res=await axiosinstance.post(`/noticelike/${noticeid}`);
 
         console.log("데이터여부:"+res.data);
         return res.data
     },onSuccess:(data,noticeid)=>{
         //쿼리키 데이터가져오기
        
         queryclient.setQueryData(["imgnoticelist",option,keyword],(oldData)=>{
             if(!oldData) return oldData;
             //좋아요관련 데이터업데이트
             return {
                 ...oldData,
                 //pages는 useinfinitequery의 여러페이지배열 
                 //page는 배열내한페이지에 해당하는데이터객체 
                 //content는 각페이지데이터객체안의실제아이템배열(서버응답구조에따라다름)
                 pages:oldData.pages.map(page=>({
                    ...page,
                    content:page.content.map(item=>
                        item.id===noticeid 
                        ?{...item,likeusercheck:data,likes:item.likes+(data ?1 :-1)}
                        :item
                    )
                 }))
           
             }
         })
     },onError:()=>{
         alert("잠시후다시시도해주세요")
     }
 })
    const Noticelikehandler=(noticeid)=>{
        if(logincheck){
             
            likemutation.mutate(noticeid)
            
        }else{
            alert("로그인후이용해주세요")
        }
    }

    return (
        <Wrapper>
            <Header>
                <Profileimg src={process.env.PUBLIC_URL+"/userprofileimg"+content.userprofile}/>
        <Userandtitlediv>
            <Userdatadiv>
                <Nicknamediv>
                 {content.nickname}
                </Nicknamediv>
                
                
       
            </Userdatadiv>
           <Titlediv>
             {content.title} 
            </Titlediv> 
       
        </Userandtitlediv>
    
        
            </Header>
        <Main onClick={()=>{navigate(`/notice/detail/${content.id}`)}}>
            {content.blockcheck?<>
             <MainImage src={process.env.PUBLIC_URL+"/front/Subimages/chdan.png"}/>
          
            </>
            :<>
                <MainImage src={process.env.PUBLIC_URL+content.mainimage}/>
            <Imagenumdiv onClick={()=>{
                    setisPreview(true)
            }}>
                {isPreview&&<ImageListmodal noticeid={content.id} ispreview={setisPreview}/>}

                <FontAwesomeIcon icon={imagesicon} /> {content.imagenum}
            </Imagenumdiv>

            <Likebuttondiv onClick={(e)=>{
                e.stopPropagation();
                Noticelikehandler(content.id)}}>

                <FontAwesomeIcon icon={fullheart} size="xl" color={content.likely?"red":"white"}  style={{position:"absolute",right:"1px",bottom:"1px"}}/>
                <FontAwesomeIcon icon={heart} size="xl" color={content.likely?"red":"black"} style={{position:"absolute",right:"1px",bottom:"1px"}}/>
                        
            </Likebuttondiv>
            <Viewsdiv>
                <FontAwesomeIcon icon={view} style={{marginRight:"6px"}} />
                {Viewtrans(content.views)}
            </Viewsdiv>
            </>
            }
        
             
        </Main>
      

        </Wrapper>
    )

}