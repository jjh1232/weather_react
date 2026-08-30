import styled from "styled-components";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";

/* 페이지 번호 줄.
   예전엔 hover 마다 2px 테두리가 생겨 글자가 흔들렸다(레이아웃 시프트).
   테두리는 항상 투명하게 깔아두고 색만 바꾼다. */
const PagenationWrapper=styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.surfaceAlt};
    border: 1px solid ${(props)=>props.theme.border};
`
/* 처음/끝으로 건너뛰기 */
const Lastmovediv=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 34px;
    height: 30px;
    padding: 0 6px;
    border-radius: ${(props)=>props.theme.radiusSm};
    font-size: 13px;
    color: ${(props)=>props.theme.textFaint};
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover{
        background: ${(props)=>props.theme.accentSoft};
        color: ${(props)=>props.theme.accent};
    }
`
/* 이전/다음 화살표 */
const Arrowdiv=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 13px;
    color: ${(props)=>props.theme.textMuted};
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover{
        background: ${(props)=>props.theme.accentSoft};
        color: ${(props)=>props.theme.accent};
    }
`
const CountWrapper=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
`
const Counttab=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 13.5px;
    cursor: pointer;
    user-select: none;

    /* 테두리는 자리만 잡아두고 색으로만 상태를 표현한다 */
    border: 1px solid transparent;
    font-weight: ${(props)=>props.isactive?700:500};
    color: ${({isactive,theme})=>isactive?"#fff":theme.textMuted};
    background: ${({isactive,theme})=>isactive?theme.accent:"transparent"};
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    ${(props)=>
    !props.isactive &&
    `
      &:hover {
        background: ${props.theme.accentSoft};
        color: ${props.theme.accent};
      }
    `
    }
`;

export default function CommentPagination(props){
    const {currentpage,totalpage,setpage}=props;
    
    

    const pageLimit=5; //한번에 보여줄 페이지개수
    const half=Math.floor(pageLimit/2); //소수점이하 내림
    let start=Math.max(1,currentpage-half); //시작페이지
    let end=Math.min(totalpage,currentpage+half); //마지막페이지

    //페이지 끝에 가까울때 보정
    if(end-start+1<pageLimit){ //+1해야갯수가나온다
        if(start===1){
            end =Math.min(totalpage,start+pageLimit-1); //5개가나와야하니까 
        }else if(end===totalpage){
            start= Math.max(1,end-pageLimit +1); //+1해야함 8-5 =3 인데 4,5,6,7,8이런식으로나와야함
        }
    }

    const pagearray=[];
    
    for (let i=start;i<=end;i++){
        pagearray.push(i);
    }



    //페이지 한번에
    
    const prevhandler=()=>{
        setpage((prev)=>Math.max(1,pagearray[0]-1))
    }
      const nexthandler=()=>{
        setpage((prev)=>Math.min(totalpage,pagearray[pagearray.length - 1]+1))
    }

    return (
    <PagenationWrapper>
   {pagearray[0]>1 && (<Lastmovediv onClick={()=>{setpage(1)}}>
   ...1
   </Lastmovediv>)}
   {currentpage>1 && <Arrowdiv onClick={prevhandler}>
     <FontAwesomeIcon icon={faAnglesLeft}/>
    </Arrowdiv>}
   <CountWrapper>
    {pagearray.map((count,key)=>{
     return (
            <React.StrictMode key={key}>
           
              <Counttab isactive={count===currentpage?true:false} onClick={()=>{
                 if (count === currentpage) return; // 현재 페이지면 아무 동작 안 함
                setpage(count);
     }
              }>
        {
            count
        }
        </Counttab> 
       
        
            </React.StrictMode>
        )
    })
}
</CountWrapper>
    {currentpage<totalpage&&<Arrowdiv onClick={nexthandler}>
        <FontAwesomeIcon icon={faAnglesRight}/>
        
        </Arrowdiv>}

  {pagearray[4]<totalpage&&<Lastmovediv onClick={()=>{setpage(totalpage)}}>...{totalpage}</Lastmovediv>}
      
    
  

    </PagenationWrapper>)

}