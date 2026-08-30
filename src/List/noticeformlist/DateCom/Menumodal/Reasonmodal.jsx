import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import CreateAxios from "../../../../customhook/CreateAxios";

/* ─────────────────────────────────────────────────────────────
   차단 / 신고 모달의 공용 껍데기.

   두 모달(Noticeblockmodal, Noticedeclmodal)이 사유 목록과 주소만 다르고
   나머지가 완전히 같은 코드였다. 디자인을 두 번 고치지 않으려고 여기로 합쳤다.
   tone 으로 성격을 나눈다 - 차단은 "내가 안 볼 글"이라 중립(accent),
   신고는 운영자에게 보내는 경고라 warning.
   ───────────────────────────────────────────────────────────── */

const MAX=3;

const tonecolor=(props)=>props.$tone==="report"?props.theme.warning:props.theme.accent;

const Overlay=styled.div`
    position: fixed;
    inset: 0;                       /* 예전엔 600x400 짜리 회색 상자가 화면 한쪽에 떠 있었다 */
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: ${(props)=>props.theme.overlay};
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
`
const Sheet=styled.div`
    position: relative;
    width: min(92vw, 460px);
    max-height: 86vh;               /* 사유가 많아도 잘리지 않고 안에서 스크롤된다 */
    display: flex;
    flex-direction: column;
    background: ${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.text};
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusLg};
    box-shadow: ${(props)=>props.theme.shadowLg};
    overflow: hidden;
`
const Head=styled.div`
    display: flex;
    align-items: flex-start;
    gap: 13px;
    padding: 20px 20px 16px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
`
/* 무슨 동작인지 한눈에 보이게 아이콘을 큼직하게 하나 둔다 */
const Icontile=styled.div`
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: ${(props)=>props.theme.radiusSm};
    display: grid;
    place-items: center;
    font-size: 17px;
    color: ${tonecolor};
    background: ${(props)=>props.$tone==="report"
        ?"rgba(255, 82, 82, 0.12)"
        :props.theme.accentSoft};
`
const Headtext=styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
    padding-right: 28px;   /* 닫기 버튼 자리 */
`
const Title=styled.h3`
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -.02em;
    line-height: 1.4;
`
const Sub=styled.p`
    margin: 0;
    font-size: 13px;
    line-height: 1.55;
    color: ${(props)=>props.theme.textMuted};
    word-break: keep-all;
`
const Closebutton=styled.button`
    position: absolute;
    top: 14px;
    right: 14px;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: ${(props)=>props.theme.textFaint};
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover{
        background: ${(props)=>props.theme.surfaceHover};
        color: ${(props)=>props.theme.text};
    }
`
const Body=styled.div`
    padding: 16px 20px 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
`
/* 몇 개까지 고를 수 있는지, 지금 몇 개인지를 항상 보여준다.
   예전엔 4번째를 누른 뒤에야 alert 로 알려줬다. */
const Countline=styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-size: 12.5px;
    color: ${(props)=>props.$full?tonecolor(props):props.theme.textFaint};
    transition: color ${(props)=>props.theme.transition};
`
const Count=styled.span`
    font-variant-numeric: tabular-nums;
    font-weight: 600;
`
const Reasongrid=styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;

    @media (max-width: 420px){
        grid-template-columns: 1fr;
    }
`
/* 기본 체크박스는 선택 여부가 잘 안 보여서 타일로 바꿨다.
   실제 input 은 숨기되 지우지 않는다(키보드/스크린리더). */
const Reasonitem=styled.label`
    position: relative;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 11px 12px;
    border-radius: ${(props)=>props.theme.radiusSm};
    font-size: 13px;
    line-height: 1.35;
    word-break: keep-all;
    cursor: ${(props)=>props.$off?"not-allowed":"pointer"};
    opacity: ${(props)=>props.$off?.45:1};
    background: ${(props)=>props.$on
        ?(props.$tone==="report"?"rgba(255, 82, 82, 0.10)":props.theme.accentSoft)
        :props.theme.surfaceAlt};
    border: 1px solid ${(props)=>props.$on?tonecolor(props):props.theme.border};
    color: ${(props)=>props.$on?tonecolor(props):props.theme.text};
    font-weight: ${(props)=>props.$on?600:400};
    transition: background ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover{
        border-color: ${(props)=>props.$off
            ?props.theme.border
            :(props.$on?tonecolor(props):props.theme.borderStrong)};
    }

    input{
        position: absolute;
        opacity: 0;
        width: 1px;
        height: 1px;
        pointer-events: none;
    }

    input:focus-visible + span{
        box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    }
`
const Checkbox=styled.span`
    flex-shrink: 0;
    width: 17px;
    height: 17px;
    border-radius: 5px;
    display: grid;
    place-items: center;
    font-size: 9px;
    color: #fff;
    border: 1.5px solid ${(props)=>props.$on?tonecolor(props):props.theme.borderStrong};
    background: ${(props)=>props.$on?tonecolor(props):"transparent"};
    transition: background ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition};
`
const Foot=styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 14px 20px;
    border-top: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`
const Cancelbutton=styled.button`
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusPill};
    padding: 8px 18px;
    font-size: 13.5px;
    font-weight: 600;
    color: ${(props)=>props.theme.textMuted};
    background: ${(props)=>props.theme.surface};
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover{
        background: ${(props)=>props.theme.surfaceHover};
        color: ${(props)=>props.theme.text};
    }
`
const Submitbutton=styled.button`
    border: none;
    border-radius: ${(props)=>props.theme.radiusPill};
    padding: 9px 20px;
    font-size: 13.5px;
    font-weight: 650;
    letter-spacing: -.01em;
    color: #fff;
    background: ${tonecolor};
    cursor: pointer;
    transition: filter ${(props)=>props.theme.transition},
                opacity ${(props)=>props.theme.transition};

    &:hover:not(:disabled){ filter: brightness(1.08); }

    /* 사유를 하나도 안 고르면 보낼 게 없다 */
    &:disabled{
        opacity: .45;
        cursor: not-allowed;
    }
`

export default function Reasonmodal(props){
    const {
        tone,              // "block" | "report"
        icon,              // 헤더 아이콘
        title,
        description,
        reasons,           // {key: 라벨}
        endpoint,          // POST 주소
        invalidatekey,     // 성공 후 무효화할 쿼리키
        submitlabel,
        successmessage,
        noticeid,
        ismodal,           // 모달 닫기
        onDone,            // 성공 후 추가 동작(차단이면 setisblock(true))
    }=props;

    const [checklist,setChecklist]=useState([]);
    const axiosinstance=CreateAxios();
    const queryclient=useQueryClient();

    const isfull=checklist.length>=MAX;

    //ESC 로 닫기
    useEffect(()=>{
        const keyhandler=(e)=>{
            if(e.key==="Escape"){
                ismodal(false)
            }
        }
        document.addEventListener("keydown",keyhandler);
        return ()=>document.removeEventListener("keydown",keyhandler);
    },[ismodal])

    const toggle=(key)=>{
        setChecklist((prev)=>{
            if(prev.includes(key)){
                return prev.filter((el)=>el!==key)
            }
            //꽉 찼으면 그냥 무시한다. 개수는 위 Countline 이 계속 보여주고 있다.
            if(prev.length>=MAX){
                return prev
            }
            return [...prev,key]
        })
    }

    const submitmutation=useMutation({
        //예전엔 여기서 axios 결과를 return 하지 않아서, 요청이 실패해도
        //바로 onSuccess 가 돌면서 "차단하였습니다" 가 떴다.
        mutationFn:()=> axiosinstance.post(endpoint,{
            noticeid:noticeid,
            reason:checklist
        }),
        onSuccess:()=>{
            queryclient.invalidateQueries({queryKey:[invalidatekey]})
            alert(successmessage)
            ismodal(false)
            if(onDone){
                onDone()
            }
        },
        onError:()=>{
            alert("처리하지 못했습니다. 잠시후 다시 시도해주세요")
        }
    })

    return (
        <Overlay onClick={()=>{ismodal(false)}}>
            {/* 시트 안쪽 클릭으로 닫히지 않게 막는다 */}
            <Sheet $tone={tone} onClick={(e)=>e.stopPropagation()}>

                <Closebutton type="button" aria-label="닫기" onClick={()=>{ismodal(false)}}>
                    <FontAwesomeIcon icon={faXmark} />
                </Closebutton>

                <Head>
                    <Icontile $tone={tone}>
                        <FontAwesomeIcon icon={icon} />
                    </Icontile>
                    <Headtext>
                        <Title>{title}</Title>
                        <Sub>{description}</Sub>
                    </Headtext>
                </Head>

                <Body>
                    <Countline $tone={tone} $full={isfull}>
                        <span>{isfull?`최대 ${MAX}개까지 선택했어요`:`최대 ${MAX}개까지 고를 수 있어요`}</span>
                        <Count>{checklist.length} / {MAX}</Count>
                    </Countline>

                    <Reasongrid>
                        {Object.entries(reasons).map(([key,value])=>{
                            const on=checklist.includes(key);
                            //꽉 찬 상태에서 아직 안 고른 항목은 눌러도 안 되니 그렇게 보이게 한다
                            const off=!on&&isfull;
                            return (
                                <Reasonitem key={key} $tone={tone} $on={on} $off={off}>
                                    <input
                                        type="checkbox"
                                        checked={on}
                                        disabled={off}
                                        onChange={()=>toggle(key)}
                                    />
                                    <Checkbox $tone={tone} $on={on}>
                                        {on&&<FontAwesomeIcon icon={faCheck} />}
                                    </Checkbox>
                                    <span>{value}</span>
                                </Reasonitem>
                            )
                        })}
                    </Reasongrid>
                </Body>

                <Foot>
                    <Cancelbutton type="button" onClick={()=>{ismodal(false)}}>
                        취소
                    </Cancelbutton>
                    <Submitbutton
                        type="button"
                        $tone={tone}
                        disabled={checklist.length===0||submitmutation.isPending}
                        onClick={()=>submitmutation.mutate()}
                    >
                        {submitmutation.isPending?"처리중...":submitlabel}
                    </Submitbutton>
                </Foot>

            </Sheet>
        </Overlay>
    )
}
