import React from "react";
import styled from "styled-components";

//=====================================================================
// 신고 내역 모달 전용 페이징.
//
// 예전엔 스타일 없는 <button> 나열에 Wrapper 가 left:50% 로 밀려 있었고,
// 페이지 범위 계산이 `currentpage+5<=totalpage ? currentpage+3 : totalpage`
// 라서 앞뒤 개수가 맞지 않았다(앞은 5개, 뒤는 3개).
// 현재 페이지 앞뒤 5개로 맞춘다. 로그인기록 쪽(HistoryPaging)과 같은 모양이다.
//=====================================================================

const Wrapper=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 4px;
    padding: 12px 0 2px;
`
const Pagebutton=styled.button`
    min-width: 28px;
    height: 28px;
    padding: 0 7px;
    border-radius: ${(props)=>props.theme.radiusSm};
    font-size: 12px;
    font-weight: ${(props)=>props.$on?700:500};
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    border: 1px solid ${(props)=>props.$on
        ? props.theme.accent
        : props.theme.border};
    background: ${(props)=>props.$on
        ? props.theme.accentSoft
        : props.theme.surface};
    color: ${(props)=>props.$on
        ? props.theme.accent
        : props.theme.textMuted};

    &:hover:not(:disabled){
        border-color: ${(props)=>props.theme.accent};
        color: ${(props)=>props.theme.accent};
    }
    &:disabled{
        opacity: .4;
        cursor: default;
        color: ${(props)=>props.theme.textFaint};
    }
`
const Dots=styled.span`
    font-size: 11.5px;
    color: ${(props)=>props.theme.textFaint};
`

export default function SimplePagenation(props){

    const {totalpage,currentpage,setcurrent}=props;

    const total=Number(totalpage)||0;
    if(total<=1) return null;

    const startpage=Math.max(currentpage-5,1);
    const endpage=Math.min(currentpage+5,total);

    const pagearray=[];
    for (let i=startpage;i<=endpage;i++){
        pagearray.push(i)
    }

    return (
        <Wrapper>
            <Pagebutton type="button" disabled={currentpage<=1}
                onClick={()=>setcurrent(currentpage-1)}>&#60;</Pagebutton>

            {startpage>1 &&
                <Pagebutton type="button" onClick={()=>setcurrent(1)}>1</Pagebutton>}
            {startpage>2 && <Dots>…</Dots>}

            {pagearray.map((d)=>(
                <Pagebutton key={d} type="button" $on={d===currentpage}
                    onClick={()=>setcurrent(d)}>{d}</Pagebutton>
            ))}

            {endpage<total-1 && <Dots>…</Dots>}
            {endpage<total &&
                <Pagebutton type="button" onClick={()=>setcurrent(total)}>{total}</Pagebutton>}

            <Pagebutton type="button" disabled={currentpage>=total}
                onClick={()=>setcurrent(currentpage+1)}>&#62;</Pagebutton>
        </Wrapper>
    )
}
