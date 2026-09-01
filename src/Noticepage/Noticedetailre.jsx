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
import { useConfirm } from "../UI/Feedback/FeedbackProvider";
import profileimage from "../UI/profileimage";

const Wrapper=styled.div`
   position: relative;
    display: flex;
    flex-direction: column;
width:100%;
//height:100%;
overflow: hidden;

`
/* 글 한 편이 들어가는 카드.
   예전엔 여백이 한 군데도 없어서 작성자줄·제목·본문이 서로 붙어 찍혔다. */
const Noticediv=styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px 18px 20px;
`
const Header=styled.div`
    display: flex;
    gap: 10px;
    padding-bottom: 14px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
`

const Profilediv=styled.div`
   

`
const Headdatadiv=styled.div`
  
    display: flex;
    flex-direction: column;
    
    width: 100%;
`
const Userdiv=styled.div`
    display: flex;
    gap:5px;
    
`

const Nickdiv=styled.div`
     font-weight:bold;
     font-size: 18px;
      display: flex;
    justify-content: center;   
    align-items: center;  
      color: ${(props)=>props.theme.text};
     
`
const Usernamediv=styled.div`
    
    display: flex;
    justify-content: center;   
    align-items: center;       
    
    font-size: 15px;
    color: gray;
`
const Timediv=styled.div`
     display: flex;
    justify-content: center;   
    align-items: center;       

    font-size: 15px;
`
const Weatherdiv=styled.div`
    margin-left: auto;
    display: flex;
    /* gap 이 없어서 날씨 값들이 "흐림mm미만맑음26°C" 처럼 붙어 찍혔다 */
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;

`
const Menudiv=styled.div`
    
`
const TitleTooldiv=styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 6px;
`
const Titlediv=styled.div`
    width: 80%;
    /* 제목은 본문보다 커야 한다. 예전엔 본문과 같은 크기라 어디까지가 제목인지
       구분이 안 됐다. */
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.4;
    word-break: break-word;
`
const Tooldiv=styled.div`
    margin-left:auto;
    width: 19.8%;
    
    display: flex;
    justify-content: flex-end;
   // border: 1px solid gray;


`
const Favoritediv=styled.div`
   
    display: flex;
   
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
    margin-top: 5px;
    margin-left:4px;

    
`
const NoticeMaindiv=styled.div`
   overflow: hidden;

   /* 본문이 한 줄이어도 글 한 편으로 보이게 최소 높이를 준다.
      "그렇습니당" 한 줄짜리 글이 제목에 딱 붙어 찍히던 문제. */
   min-height: 160px;
   padding: 4px 2px;
   font-size: 15px;
   line-height: 1.75;
   color: ${(props)=>props.theme.text};
   word-break: break-word;

      img {
    max-width: 100%;
    
    height: auto;
    display: block;
    margin: 10px 0;
    border-radius: ${(props)=>props.theme.radiusSm};
  }
      p { margin: 0 0 10px; }
      p:last-child { margin-bottom: 0; }
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
    const confirm=useConfirm();
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
            const res=await axiosinstance.get("/open/noticedetail/"+Number(noticeid));
            
            console.log("노티스:",res)
            return res.data;
        }
    })

      const {data:comment,isLoading:commentloading,error:commenterror}=
      useQuery({queryKey:["comments",Number(noticeid),Number(page)],
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

 const postDelete=async()=>{
    const ok=await confirm({
      title:"이 글을 삭제할까요?",
      description:"글에 달린 댓글도 함께 사라집니다. 되돌릴 수 없습니다.",
      confirmText:"삭제",
      danger:true,
    })
    if(ok){
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
       <Userprofile src={profileimage(post.userprofile)}/>
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
                
                  {/* 예전엔 isclose 로 넘겼는데 Noticemenu 는 closeisMenu 로 받는다.
                      이름이 안 맞아서 메뉴 안에서 closeisMenu 가 undefined 였고,
                      바깥 클릭으로 닫기와 비로그인 처리가 죽어 있었다.
                      setisblock 도 null 이라 차단 해제 성공 시 예외가 났다. */}
                  {ismenu&&<Noticemenu
                    updatemethod={postUpdate} deletemethod={postDelete} noticeuser={post?.username} noticeid={post?.id}
                    setisblock={()=>{}} closeisMenu={()=>setIsmenu(false)}
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
        <Commentform noticenum={post?.id} depth={0} cnum={0} page={page} setPage={setPage} />
        {commentloading&&<>댓글불러오는중....</>}
        {/* 게시글과 댓글은 각각 별도 쿼리라 도착 순서가 보장되지 않는다.
            comment 만 보고 그리면, 댓글이 먼저 온 경우 post 가 아직 undefined 인데
            post.id 를 읽어서 렌더 중 예외가 난다. 에러 경계가 없어서 화면이 통째로
            백지가 되고, 새로고침하면 타이밍이 달라져 우연히 넘어간다.
            Commentlist 는 게시글 id 가 있어야 동작하므로 둘 다 기다린다. */}
        {post&&comment&&<>
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