import React from "react";
import {
    addDays,
    endOfMonth,
    endOfWeek,
    startOfMonth,
    startOfWeek,
    eachDayOfInterval,
    format,
  } from 'date-fns';
  import { useState } from "react";
  import styled from "styled-components";

//=====================================================================
// 관리자용 달력. 채팅 기록에서 날짜로 건너뛸 때 쓴다.
//
// 예전엔 흰 바탕에 검정/회색/빨강 테두리를 직접 박아 다크모드에서 글자가
// 묻혔고, 칸 폭을 13.7% / 8.3% 같은 % 로 나눠서 줄이 어긋났다.
// 폭은 grid 에 맡기고 색은 전부 테마 토큰으로 바꿨다.
//
// 그리고 chatdata 를 props 로 받아만 두고 쓰지 않았다.
// 대화가 있는 날에 점을 찍어주면 어느 날을 눌러야 하는지 바로 보인다.
//=====================================================================

const Wrapper=styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`
const Title=styled.div`
    font-size: 13px;
    font-weight: 700;
    color: ${(props)=>props.theme.text};
`
//연/월 선택줄
const Segment=styled.div`
    display: grid;
    grid-template-columns: repeat(${(props)=>props.$cols}, 1fr);
    gap: 3px;
`
const Segbutton=styled.button`
    height: ${(props)=>props.$tall?"30px":"26px"};
    padding: 0;
    border-radius: ${(props)=>props.theme.radiusSm};
    font-size: ${(props)=>props.$tall?"12.5px":"11.5px"};
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

    &:hover{ border-color: ${(props)=>props.theme.accent}; }
`
const Grid=styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
`
const Weekname=styled.div`
    display: grid;
    place-items: center;
    height: 22px;
    font-size: 11px;
    font-weight: 700;
    color: ${(props)=>props.$sun
        ? props.theme.like
        : props.$sat
        ? props.theme.accent
        : props.theme.textFaint};
`
const Daycell=styled.button`
    position: relative;
    display: grid;
    place-items: center;
    height: 34px;
    border-radius: ${(props)=>props.theme.radiusSm};
    font-size: 12.5px;
    font-weight: ${(props)=>props.$on?700:500};
    cursor: ${(props)=>props.$has?"pointer":"default"};
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    border: 1px solid ${(props)=>props.$on
        ? props.theme.accent
        : "transparent"};
    background: ${(props)=>props.$on
        ? props.theme.accentSoft
        : "transparent"};

    /* 이번 달이 아닌 날은 흐리게. 일요일 빨강 / 토요일 파랑은 한국 달력 관행 */
    opacity: ${(props)=>props.$thismonth?1:.35};
    color: ${(props)=>props.$on
        ? props.theme.accent
        : props.$sun
        ? props.theme.like
        : props.$sat
        ? props.theme.accent
        : props.theme.text};

    &:hover{ background: ${(props)=>props.theme.surfaceHover}; }
`
//대화가 있는 날 표시
const Dot=styled.span`
    position: absolute;
    bottom: 4px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${(props)=>props.theme.accent};
`

export default function AdminCalander(props){
    const headers=["일","월","화","수","목","금","토"]
    const {currentdate,movemethod,chatdata}=props;
    const [viewdate,setViewdate]=useState(currentdate);
    const [selected,setSelected]=useState(null);

    const monthStart = startOfMonth(viewdate);
    const monthEnd   = endOfMonth(monthStart);
    const startDate  = startOfWeek(monthStart);
    const endDate    = endOfWeek(monthEnd);

    const days=eachDayOfInterval({start:startDate,end:endDate});

    const viewyear=Number(format(viewdate,'y'));
    const viewmonth=Number(format(viewdate,'M'));

    //최근 3개년(올해 포함)
    const baseyear=Number(format(currentdate,'y'));
    const years=[baseyear-2,baseyear-1,baseyear];
    const months=Array.from({length:12},(_,i)=>i+1);

    //대화가 있는 날짜 집합. chatdata 는 "YYYY-MM-DD" 로 묶인 맵이다.
    const chatdays=new Set(Object.keys(chatdata||{}));

    //1일 기준으로 옮긴다. 31일에서 2월로 넘어가면 날짜가 튀기 때문.
    const setyear=(y)=>setViewdate(new Date(y,viewmonth-1,1));
    const setmonth=(m)=>setViewdate(new Date(viewyear,m-1,1));

    /* 예전엔 클릭한 날을 state 에 넣고 useEffect 로 뒤늦게 movemethod 를 불렀다
       ("usestate 동기화문제가 useeffect 말곤 해결법 몰루겟음" 이라고 적혀 있었다).
       클릭 핸들러가 Date 를 이미 들고 있으니 그냥 바로 넘기면 된다. */
    const onClickday=(day)=>{
        const key=format(day,'yyyy-MM-dd');
        if(!chatdays.has(key)) return;   //대화 없는 날은 갈 곳이 없다
        setSelected(key);
        movemethod(key);
    }

    return (
        <Wrapper>
            <Title>날짜로 이동</Title>

            <Segment $cols={3}>
                {years.map((y)=>(
                    <Segbutton key={y} type="button" $tall $on={y===viewyear}
                        onClick={()=>setyear(y)}>{y}</Segbutton>
                ))}
            </Segment>

            <Segment $cols={6}>
                {months.map((m)=>(
                    <Segbutton key={m} type="button" $on={m===viewmonth}
                        onClick={()=>setmonth(m)}>{m}월</Segbutton>
                ))}
            </Segment>

            <Grid>
                {headers.map((d,i)=>(
                    <Weekname key={d} $sun={i===0} $sat={i===6}>{d}</Weekname>
                ))}

                {days.map((day)=>{
                    const key=format(day,'yyyy-MM-dd');
                    const has=chatdays.has(key);
                    return (
                        <Daycell key={key} type="button"
                            $on={selected===key}
                            $has={has}
                            $sun={day.getDay()===0}
                            $sat={day.getDay()===6}
                            $thismonth={monthStart<=day&&day<=monthEnd}
                            title={has?"이 날짜의 대화로 이동":undefined}
                            onClick={()=>onClickday(day)}>
                            {format(day,'d')}
                            {has && <Dot/>}
                        </Daycell>
                    )
                })}
            </Grid>
        </Wrapper>
    )
}
