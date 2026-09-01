import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { InView, useInView } from "react-intersection-observer";
import styled from "styled-components";
import Imageformlist from "./Imageformlist";
import AuthCheck from "../../../customhook/authCheck";
import CreateAxios from "../../../customhook/CreateAxios";
import { useSearchParams } from "react-router-dom";
import { API_BASE, apiUrl } from "../../../config/api";
import EmptyState from "../../../UI/Feedback/EmptyState";

// 고정폭 타일을 flex-wrap 으로 흘리면 남는 자리가 생기고 화면마다 줄이 달라진다.
// auto-fill 로 칸 수를 브라우저가 정하게 하면 어떤 폭에서도 꽉 찬다.
//빈 상태는 그리드가 아니라 가운데 정렬된 한 칸이어야 한다.
const Emptywrap=styled.div`
  width: 100%;
  padding: 8px;
`
const Wrapper=styled.div`
position: relative;

width:100%;
display: grid;
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
gap: 10px;
padding: 12px;

 color:${props => props.theme.text};
 /* 배경은 바깥 MainCss 패널이 갖는다 */
 background: transparent;

@media (max-width: 620px) {
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  padding: 8px;
}
`

export default function Imageform(){
    /*
    const {data : imgnoticelist}=useQuery({
        queryKey:["imgnoticelist"],
        queryFn:async ()=>{
            const res=await axios.get(`${API_BASE}/open/notice/imagelist`)
            console.log(res)
            return res.data.content;
        }

    })
        */
    //무한스크롤용 인피니티쿼리
    //로그인체크용
    let loginuser=AuthCheck();
    let axiosinstance=CreateAxios();
         let [query,setQuery]=useSearchParams({ //기초값일꺼임
                
                selectoptions:"title",
                keywords:"",
                pages:1
            })
            
    const {
        data:imgnoticelist, //받아온전체데이터 (페이지별로쌓인다)
        fetchNextPage, //다음페이지를 불러오는함수
        hasNextPage, //다음페이지존재여부 존재할시true
        isFetchingNextPage, //다음페이지불러오는중인지여부 
        status, //쿼리상태 loading ,error ,success등
    }= useInfiniteQuery({
            queryKey:["imgnoticelist",query.get("selectoptions"),query.get("keywords")],
            queryFn: async ({pageParam=1})=>{
                /* 로그인 여부에 따라 인스턴스가 갈린다.
                   axiosinstance 는 baseURL 이 있지만 순수 axios 는 없다.
                   그래서 비로그인일 때 상대경로로 부르면 요청이 프론트 도메인으로 가고,
                   Pages 가 index.html 을 200 으로 돌려준다.
                   그러면 res.data 가 HTML 문자열이 되어 data.content 가 undefined 가 되고
                   아래 .map() 에서 렌더 중 예외가 난다(화면 전체가 에러 화면으로 바뀐다).
                   비로그인 쪽만 절대주소로 만들어 준다. */
                const logch=loginuser? axiosinstance :axios
                const listurl=loginuser?"/open/notice/imagelist":apiUrl("/open/notice/imagelist")
                const res=await logch.get(listurl,{
                    params:{page:pageParam,
                            option:query.get("selectoptions"),
                            keyword:query.get("keywords"),

                    }
                })
                console.log(res)
                return res.data
            },
            getNextPageParam:(lastPage,allPages)=>{
                //올페이지는 지금까지 fetchNextPage로받아온 모든응답데이터가 배열로쌓여서 들어옴
                //그래서 allPages.length로 페이징도가능
             
                //응답이 예상 모양이 아니면(HTML 등) 더 받으려 하지 않는다.
                if(!lastPage || lastPage.last) return undefined;

                //number는 서버가 마지막으로반환한값 1로처리했지만 0시작임으로 0이들어옴 때문에
                //2를해야 1번데이터 거기서 3이되서 2번데이터 그담2를받고2더해4를 넘기면 3데이터
                return lastPage.number + 2; 
            }
    })
    const {ref,inView}=useInView();

    useEffect(()=>{
        if(inView&&hasNextPage&&!isFetchingNextPage){
            fetchNextPage();
        }
    },[inView,hasNextPage,isFetchingNextPage,fetchNextPage])

    //받아온 사진이 하나도 없는지. "아직 안 받음" 과 "받았는데 0장" 을 구분한다.
    const loaded=!!imgnoticelist;
    const total=loaded
        ? imgnoticelist.pages.reduce((sum,p)=>sum+(p?.content?.length??0),0)
        : 0;

    if(status==="error"){
        return (
            <Emptywrap>
                <EmptyState variant="search"
                    title="사진을 불러오지 못했습니다"
                    desc="잠시 후 새로고침해 주세요."/>
            </Emptywrap>
        );
    }

    if(loaded && total===0){
        return (
            <Emptywrap>
                <EmptyState variant="cloud"
                    title={query.get("keywords")
                        ? `'${query.get("keywords")}' 검색 결과가 없어요`
                        : "아직 올라온 사진이 없어요"}
                    desc={query.get("keywords")
                        ? "다른 낱말로 찾아보세요."
                        : "사진을 넣어 글을 쓰면 여기에 모입니다."}/>
            </Emptywrap>
        );
    }

    return (
        <Wrapper>


        {imgnoticelist&&imgnoticelist.pages.map((data,key)=>{
            return (
                <React.Fragment key={key}>
                
                {(data?.content ?? []).map((da,key)=>{
                    return (
                        
                        <Imageformlist content={da} key={key} option={query.get("selectoptions")} keyword={query.get("keywords")}/>
                       
                        
                    )
                })}
                  
                      
           
                </React.Fragment>
            )
        })}
        {imgnoticelist && //이미지리스트가 있을경우만있어야함 아니면두번됨
              <div ref={ref} >
        {isFetchingNextPage&&<>...로딩중..</>}
         </div>
        }

         {!hasNextPage && !isFetchingNextPage && (
        <div style={{ textAlign: "center", color: "#888", margin: "20px 0" }}>
          마지막입니다!
        </div>
      )}

        </Wrapper>
    )
}