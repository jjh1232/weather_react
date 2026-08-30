import React from "react";
import styled from "styled-components";

//=====================================================================
// 로그인기록 전용 페이징.
//
// ★ 예전 코드에 이런 줄이 있었다.
//     const endpage = currentpage+5<=totalpage ? querydata.page+3 : totalpage
//   querydata 는 이 파일 어디에도 없는 이름이라 조건이 참이 되는 순간
//   ReferenceError: querydata is not defined 로 렌더가 통째로 터졌다.
//   이 컴포넌트가 화면 맨 아래에 항상 그려지기 때문에 팝업 전체가 백지가 됐다.
//   (기록이 적어 페이지가 1~5개뿐인 회원은 조건이 거짓이라 멀쩡했다 -
//    그래서 어떤 회원은 되고 어떤 회원은 안 되는 것처럼 보였다)
//   현재 페이지 앞뒤 5개를 보여주려던 것이므로 그대로 계산한다.
//=====================================================================

const Wrapper=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 4px;
    padding: 14px 0 4px;
`
const Pagebutton=styled.button`
    min-width: 30px;
    height: 30px;
    padding: 0 8px;
    border-radius: ${(props)=>props.theme.radiusSm};
    font-size: 12.5px;
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

    &:hover{
        border-color: ${(props)=>props.theme.accent};
        color: ${(props)=>props.theme.accent};
    }
    &:disabled{
        opacity: .4;
        cursor: default;
        border-color: ${(props)=>props.theme.border};
        color: ${(props)=>props.theme.textFaint};
    }
`
const Total=styled.span`
    margin-left: 4px;
    font-size: 11.5px;
    color: ${(props)=>props.theme.textFaint};
`

export default function HistoryPaging(props){

    const {currentpage,totalpage,setCurrentpage}=props;

    //전체 페이지를 아직 모르면 페이징을 그릴 게 없다
    const total=Number(totalpage)||0;
    if(total<=1) return null;

    const startpage=Math.max(currentpage-5,1);
    const endpage=Math.min(currentpage+5,total);

    const pagearray=[];
    for (let i=startpage;i<=endpage;i++){
        pagearray.push(i)
    }

    /* 예전엔 setCurrentpage 후에 refetch() 를 불렀다. setState 는 즉시 반영되지
       않으니 이전 페이지로 다시 요청이 나갔다. 지금은 페이지가 쿼리키에 들어가
       react-query 가 알아서 다시 받아온다. */
    const go=(page)=>setCurrentpage(page);

    return (
        <Wrapper>
            <Pagebutton type="button" disabled={currentpage<=1}
                onClick={()=>go(currentpage-1)}>&#60;</Pagebutton>

            {startpage>1 &&
                <Pagebutton type="button" onClick={()=>go(1)}>1</Pagebutton>}
            {startpage>2 && <Total>…</Total>}

            {pagearray.map((d)=>(
                <Pagebutton key={d} type="button" $on={d===currentpage}
                    onClick={()=>go(d)}>{d}</Pagebutton>
            ))}

            {endpage<total-1 && <Total>…</Total>}
            {endpage<total &&
                <Pagebutton type="button" onClick={()=>go(total)}>{total}</Pagebutton>}

            <Pagebutton type="button" disabled={currentpage>=total}
                onClick={()=>go(currentpage+1)}>&#62;</Pagebutton>

            <Total>총 {total}페이지</Total>
        </Wrapper>
    )
}
