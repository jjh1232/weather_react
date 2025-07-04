import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Commentlist from "../List/Commentlist";
import NoticeWeathericon from "../UI/Noticetools/NoticeWeathericon";
import Datefor from "../List/noticeformlist/DateCom/Datefor";
import theme from "../UI/Manyim/Themecss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Noticemenu from "../List/noticeformlist/DateCom/Noticemenu";
import CreateAxios from "../customhook/CreateAxios";
import Commentform from "./Commentform";
import Pagenation from "../customhook/Pagenation";
import CommentPagination from "./CommentPagination";
import { faChartSimple as view } from "@fortawesome/free-solid-svg-icons";
import { faHeart as heart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullheart } from "@fortawesome/free-solid-svg-icons";
import Viewtrans from "../List/noticeformlist/DateCom/Viewtrans";
import AuthCheck from "../customhook/authCheck";

const Wrapper=styled.div`
   position: relative;
    display: flex;
    flex-direction: column;
width:100%;
//height:100%;
overflow: hidden;
`
const Noticediv=styled.div`
    
`
const Header=styled.div`
    border: 1px solid blue;
    display: flex;
`

const Profilediv=styled.div`
    border: 1px solid red;

`
const Headdatadiv=styled.div`
    border: 1px solid green;
    display: flex;
    flex-direction: column;
    width: 100%;
`
const Userdiv=styled.div`
    display: flex;
    gap:5px;
    
`

const Nickdiv=styled.div`
      color: ${(props)=>props.theme.text};
`
const Usernamediv=styled.div`
    display: flex;
    color: gray;
`
const Timediv=styled.div`
    
`
const Weatherdiv=styled.div`
    margin-left: auto;
`
const Menudiv=styled.div`
    
`
const TitleTooldiv=styled.div`
    display: flex;
    border: 1px solid gray;
`
const Titlediv=styled.div`
    border: 1px solid blue;
    width: 80%;
`
const Tooldiv=styled.div`
    margin-left:auto;
    width: 19.8%;
    border: 1px solid yellow;
    display: flex;
    justify-content: flex-end;
    


`
const Favoritediv=styled.div`
   
    display: flex;
    border: 1px solid blue;
    width: 50%;
    //여긴 텍스트마진줘서 
    //갭필요없는듯
`
const FavoriteIcon=styled.div`
     position: relative;
     bottom:5px;
`
const FavoriteText=styled.div`
    
    position: relative;
    //패딩주면안겹친
    font-size: 18px;
    //마진이 더좋은듯 패딩은 값늘면 문제생김
    margin-left: 28px;
    //그레인데 좀찐한그레이로바꿔야할듯
    color:${({theme})=>theme.gray};
    bottom: 1px;
`
const Viewsdiv=styled.div`
       position: relative;
       display: flex;
       border:1px solid red;
        gap   : 5px;
       width: 50%;
`
const ViewIcondiv=styled.div`
    
`
const ViewTextdiv=styled.div`
      font-size: 18px;
      color:${({theme})=>theme.gray};
`
const Userprofile=styled.img`
    width: 40px;
    height: 40px;
    border: 1px solid black;
    background-color: white;

    
`
const NoticeMaindiv=styled.div`
   overflow: hidden;
      img {
    max-width: 100%;
    
    height: auto;
    display: block;
  }
`
const Pagenationcss=styled.div`

    display: flex;
    align-items: center;         // 세로 중앙정렬
    justify-content: center;     // 가로 중앙정렬
`

//로컬스트레지에 커멘트페이지연습겸
//근데구지전역할필요없긴함 ㅋ
const Notice_Page_Key="noticecommentpaging";

export default function Noticedetailre(props){
    //커멘트페이지
    const [page,setPage]=useState(()=>{
        const saved=localStorage.getItem(Notice_Page_Key);
        return saved? Number(saved):1;
    });
    const  {noticeid}=useParams();
    const noticemenuref=useRef(null);
    const [ismenu,setIsmenu]=useState(false);
    const [isupdate,setIsupdate]=useState(false);
    let axiosinstance=CreateAxios();
    const pageref=useRef(null)
    console.log("노티스디테일")
    let logincheck=AuthCheck();
    const queryclient=useQueryClient();
    //페이지 저장
    useEffect(()=>{
        
        localStorage.setItem(Notice_Page_Key,page);

    },[page])
   
    const {data:post,isLoading:noticeloading,error:noticeerror}=useQuery({queryKey:["post",Number(noticeid)],
        queryFn:async ()=>{
            const res=await axiosinstance.get("/open/noticedetail/"+noticeid);
            
            console.log("노티스:",res)
            return res.data;
        }
    })

      const {data:comment,isLoading:commentloading,error:commenterror}=
      useQuery({queryKey:["comments",noticeid,page],
        queryFn:async ()=>{
            const res=await axiosinstance.get( "/open/commentshow/",{
                params:{
                    noticeid:noticeid,
                    page:page
                }
            });
              
            console.log("코멘트",res)
            return res.data;
        }
    })


    const weatherKeys = ['sky', 'rain', 'pty', 'temp', 'reh', 'wsd'];
    const Weatherdata=weatherKeys.map((data)=> ({
        type:data,
        value:post?.[data]
    }))

    //메뉴관리
    useEffect(()=>{
        const noticemenuoutside=(e)=>{
            if(noticemenuref.current&&!noticemenuref.current.contains(e.target)){
                setIsmenu(false)
            }
        }
        document.addEventListener("mousedown",noticemenuoutside);
        return ()=>{
            document.removeEventListener("mousedown",noticemenuoutside)
        }
    },[])

    const postUpdate=()=>{
    setIsupdate(true)

 }

 const postDelete=()=>{
    if(window.confirm("정말로삭제하시겠습니까?")){
      axiosinstance.delete(`/noticedelete/${post.id}`)
      .then((res)=>{
        alert("정상적으로삭제되었습니다")
        //뒤로가기구현

      }).catch((err)=>{
        alert("에러가났어요")
      })
    }else{
     // alert("삭제취소")
    }
 }
const isMounted = useRef(false);
//스크롤이어색해서
useEffect(() => {
       setTimeout(() => {
    
  
  if (!isMounted.current) {
    // 최초 렌더링일 때는 아무것도 하지 않고, isMounted만 true로 바꿔줌
    isMounted.current = true;
    return;
  }

  // 최초가 아니라면(즉, page가 바뀌어서 useEffect가 재실행된 경우)
  if (pageref.current) {
    pageref.current.scrollIntoView({ behavior: 'smooth' });
  }
    }, 1500);
}, [page]);

//좋아요시 캐시만 수정
const likemutation=useMutation({
    mutationFn:async (noticeid)=>{
        const res=await axiosinstance.post(`/noticelike/${noticeid}`);

        console.log("데이터여부:"+res.data);
        return res.data
    },onSuccess:(data,noticeid)=>{
        //쿼리키 데이터가져오기
        console.log("노티스아이디타입:"+typeof noticeid + "값:"+noticeid)
        queryclient.setQueryData(["post",noticeid],(oldData)=>{
            if(!oldData) return oldData;
            //좋아요관련 데이터업데이트
            return {
                ...oldData,
              likeusercheck:data,
                //서버에서안내려줌
                likes:oldData.likes+(data?1:-1)
            }
        })
    },onError:()=>{
        alert("잠시후다시시도해주세요")
    }
})

const LikeButtonhandler=(noticeid)=>{
    if(logincheck){
        likemutation.mutate(noticeid);
        }else{
        alert("로그인후 이용하실수있습니다")
    }
}

    return (
<Wrapper>
        {noticeloading&&<>로딩중...</>}
        {post&&<Noticediv>
 
            <Header>

           
      
        <Profilediv>
       <Userprofile src={process.env.PUBLIC_URL+"/userprofileimg/"+post.userprofile }/>
       </Profilediv>
       <Headdatadiv>
            <Userdiv>
         
     
         <Nickdiv>   {post.nickname}</Nickdiv>
         <Usernamediv> {post.username} </Usernamediv>
    <Timediv>
        <Datefor inputdate={post.red}/>
         
         </Timediv>
            <Weatherdiv>
                {Weatherdata&&Weatherdata.map((data,key)=>{
                    return (
             <NoticeWeathericon type={data.type} value={data.value} key={key}/>
                    )
                })}
              

              </Weatherdiv>
              <Menudiv onClick={()=>{setIsmenu(!ismenu)}} ref={noticemenuref}>
                <FontAwesomeIcon onClick={()=>{setIsmenu(!ismenu)}}icon={faEllipsis} fontSize={"25px"}/>
                
                  {ismenu&&<Noticemenu 
                    updatemethod={postUpdate} deletemethod={postDelete} noticeuser={post?.username} noticeid={post?.id}
                    setisblock={null} isclose={setIsmenu}
              />}
            
              </Menudiv>
              
            
       </Userdiv>
                    <TitleTooldiv>
                <Titlediv>
                    {post.title}
               
           
         </Titlediv>
         <Tooldiv>
                    <Favoritediv>
                    <FavoriteIcon onClick={()=>LikeButtonhandler(post.id)}>
                  
                    <FontAwesomeIcon icon={fullheart} size="xl" color={post.likeusercheck?"red":"white"}  style={{position:"absolute",left:"0px",top:"5px"}}/>
                    <FontAwesomeIcon icon={heart} size="xl" color={post.likeusercheck?"red":"black"} style={{position:"absolute",left:"0px",top:"5px"}}/>
                    </FavoriteIcon>
                    <FavoriteText>
                     {Viewtrans(post.likes)}
                    </FavoriteText>
                   </Favoritediv>
                   
                    <Viewsdiv>
                        <ViewIcondiv>
                    <FontAwesomeIcon icon={view} size="xl"/> 
                        </ViewIcondiv>
                    <ViewTextdiv>
                          {Viewtrans(post.views)}
                    </ViewTextdiv>
                    
                    </Viewsdiv>
            
         </Tooldiv>
         </TitleTooldiv>
         </Headdatadiv>
         </Header>
         <NoticeMaindiv>
         <div dangerouslySetInnerHTML={{__html:post.text}} />
        
       </NoticeMaindiv>

        </Noticediv>

        }
        <Commentform noticenum={post?.id} depth={0} cnum={0} page={page} />
        {commentloading&&<>댓글불러오는중....</>}
        {comment&&<>
            <Commentlist comments={comment.content} noticeid={post.id} page={page} ref={pageref} />
            <Pagenationcss>
            <CommentPagination currentpage={page} totalpage={comment?.totalPages} setpage={setPage}/>
            </Pagenationcss>
        </>}
        {
            //코멘트페이지
           
            
        }
       
</Wrapper>
    )
}