import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

//=====================================================================
// 지역 검색 결과 페이지 이동.
//
// 예전 모습:  [...1] [◀] [1][2][3][4][5] [▶] [...21]
//   - 색이 gray/black/red 로 박혀 있어 다크모드에서 밑줄이 안 보이고
//     현재 페이지는 회색 배경 + 빨간 글씨가 됐다.
//   - "...1", "...21" 은 무슨 버튼인지 알기 어렵다.
//   - 숨김 처리를 visibility 로 해서 안 보이는 자리가 그대로 남아
//     페이지를 넘길 때마다 숫자들이 좌우로 흔들렸다.
//
// 지금 모습:  [‹] 1 … 5 [6] 7 … 21 [›]
//   흔한 형태로 바꾸고 색은 전부 테마 토큰에서 가져온다.
//=====================================================================

const Wrapper=styled.nav`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    /* 예전엔 float:left 에 width:300px 이 박혀 있었다.
       부모가 flex 라 흐름만 어긋나고 폭은 결과 수와 상관없이 고정이었다. */
`

const Cell=styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 30px;
    height: 30px;
    padding: 0 8px;

    border: 1px solid ${(props)=>props.$on?"transparent":props.theme.border};
    border-radius: ${(props)=>props.theme.radiusSm};
    background: ${(props)=>props.$on?props.theme.accent:"transparent"};
    color: ${(props)=>props.$on?"#fff":props.theme.textMuted};

    font-size: 13px;
    font-weight: ${(props)=>props.$on?700:500};
    font-variant-numeric: tabular-nums;   /* 자릿수가 달라도 폭이 안 흔들린다 */
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover:not(:disabled){
        background: ${(props)=>props.$on?props.theme.accentHover:props.theme.surfaceHover};
        color: ${(props)=>props.$on?"#fff":props.theme.text};
    }
    &:disabled{
        opacity: .35;
        cursor: default;
    }
`

//누를 수 없는 자리라 button 이 아니라 span 이다.
const Gap=styled.span`
    min-width: 18px;
    text-align: center;
    color: ${(props)=>props.theme.textFaint};
    font-size: 13px;
    user-select: none;
`

function WeatherPagenation(props){

    const {currentpage,getpagedata,totalpages}=props;

    //결과가 한 쪽뿐이면 페이지 이동 자체가 필요 없다.
    if(!totalpages || totalpages<=1) return null;

    const maxpageshow=5;
    let startpage,endpage;

    if(totalpages<=maxpageshow){
        startpage=1;
        endpage=totalpages;
    }else{
        const middle=Math.floor(maxpageshow/2);

        if(currentpage<=middle+1){
            startpage=1;
            endpage=maxpageshow;
        }else if(currentpage>=totalpages-middle){
            startpage=totalpages-maxpageshow+1;
            endpage=totalpages;
        }else{
            startpage=currentpage-middle;
            endpage=currentpage+middle;
        }
    }

    const pagearray=[];
    for(let i=startpage;i<=endpage;i++){
        pagearray.push(i);
    }

    const move=(e,page)=>{
        e.preventDefault();
        if(page<1||page>totalpages||page===currentpage) return;
        getpagedata(page);
    };

    return (
        <Wrapper aria-label="지역 검색 결과 페이지">

            <Cell type="button" disabled={currentpage<=1}
                aria-label="이전 페이지"
                onClick={(e)=>move(e,currentpage-1)}>
                <FontAwesomeIcon icon={faChevronLeft}/>
            </Cell>

            {/* 창이 1쪽부터 시작하지 않으면 첫 쪽으로 가는 길을 열어둔다 */}
            {startpage>1 &&
                <Cell type="button" onClick={(e)=>move(e,1)}>1</Cell>}
            {startpage>2 && <Gap>…</Gap>}

            {pagearray.map((p)=>(
                <Cell key={p} type="button" $on={p===currentpage}
                    aria-current={p===currentpage?"page":undefined}
                    onClick={(e)=>move(e,p)}>
                    {p}
                </Cell>
            ))}

            {endpage<totalpages-1 && <Gap>…</Gap>}
            {endpage<totalpages &&
                <Cell type="button" onClick={(e)=>move(e,totalpages)}>{totalpages}</Cell>}

            <Cell type="button" disabled={currentpage>=totalpages}
                aria-label="다음 페이지"
                onClick={(e)=>move(e,currentpage+1)}>
                <FontAwesomeIcon icon={faChevronRight}/>
            </Cell>

        </Wrapper>
    );
}

export default WeatherPagenation;
