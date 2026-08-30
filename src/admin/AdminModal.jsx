import styled from "styled-components";

//=====================================================================
// 관리자 모달 공용 껍데기.
//
// 회원수정 / 회원추가 / 글작성 / 글수정 / 이미지보기 / 신고내역이 각자
// Modalout·Modalin·Exitbutton 을 따로 갖고 있었다. 그래서 한쪽만 고치면
// 나란히 열었을 때 모양이 달라졌다(실제로 "수정"은 새 모양, "추가"는
// 옛날 모양이라 짝이 안 맞는다는 얘기가 나왔다).
// 껍데기는 여기 한 곳에만 둔다.
//
// 쓰는 법
//   <Modalout onMouseDown={close}>
//     <Modalin onMouseDown={(e)=>e.stopPropagation()} $size="wide">
//       <Head> <Headtitle/> <Headsub/> <Closebutton/> </Head>
//       <Body> ... </Body>
//       <Foot> ... </Foot>
//     </Modalin>
//   </Modalout>
//=====================================================================

export const Modalout=styled.div`
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: ${(props)=>props.theme.overlay};
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
`

//$size: "narrow"(기본 520) | "wide"(980) | "full"(1180)
export const Modalin=styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: min(${(props)=>props.$size==="full"?"1180px"
                        :props.$size==="wide"?"980px":"520px"}, 100%);
    max-height: min(90vh, 860px);
    background: ${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.text};
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusLg};
    box-shadow: ${(props)=>props.theme.shadowLg};
    overflow: hidden;
`

export const Head=styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    padding: 14px 18px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
`
export const Headtitle=styled.h2`
    margin: 0;
    font-size: 16px;
    font-weight: 750;
    letter-spacing: -0.02em;
`
export const Headsub=styled.span`
    font-size: 12.5px;
    color: ${(props)=>props.theme.textFaint};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
export const Closebutton=styled.button`
    margin-left: auto;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 50%;
    background: none;
    color: ${(props)=>props.theme.textMuted};
    font-size: 17px;
    line-height: 1;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover{
        background: ${(props)=>props.theme.surfaceHover};
        color: ${(props)=>props.theme.text};
    }
`
//내용이 길어지면 여기서만 스크롤된다(머리말·버튼줄은 고정)
export const Body=styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: ${(props)=>props.$gap||"14px"};
`
export const Foot=styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    flex-shrink: 0;
    padding: 12px 18px;
    border-top: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`

//---------------------------------------------------------------------
// 폼 조각
//---------------------------------------------------------------------

/* fieldset/legend 를 쓰면 그룹 제목이 테두리에 자연스럽게 얹힌다.
   예전엔 h3 를 절대좌표로 띄워서 테두리와 따로 놀았다. */
export const Section=styled.fieldset`
    margin: 0;
    padding: 12px 14px 14px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    background: ${(props)=>props.theme.surfaceAlt};
`
export const Legend=styled.legend`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 6px;
    font-size: 12.5px;
    font-weight: 700;
    color: ${(props)=>props.theme.text};
`
//필수/선택 표시
export const Tag=styled.span`
    padding: 1px 7px;
    border-radius: ${(props)=>props.theme.radiusPill};
    font-size: 10.5px;
    font-weight: 700;
    background: ${(props)=>props.$optional
        ? props.theme.surfaceHover
        : props.theme.accentSoft};
    color: ${(props)=>props.$optional
        ? props.theme.textFaint
        : props.theme.accent};
`
export const Grid=styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${(props)=>props.$min||"130px"}, 1fr));
    gap: 10px;
`
export const Toprow=styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
`
export const Field=styled.label`
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 0;

    & + & { margin-top: 10px; }
`
export const Fieldname=styled.span`
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    font-weight: 600;
    color: ${(props)=>props.theme.textMuted};
`
//select(Sky/Pty 등)도 입력칸과 같은 모양이 되도록 자손까지 지정한다
export const Control=styled.div`
    display: flex;
    align-items: center;
    gap: 6px;

    input, select{
        width: 100%;
        min-width: 0;
        height: 36px;
        padding: 0 11px;
        border: 1px solid ${(props)=>props.$invalid
            ? props.theme.warning
            : props.theme.border};
        border-radius: ${(props)=>props.theme.radiusSm};
        background: ${(props)=>props.theme.surface};
        color: ${(props)=>props.theme.text};
        font-size: 13.5px;
        outline: none;
        transition: border-color ${(props)=>props.theme.transition},
                    box-shadow ${(props)=>props.theme.transition};
    }
    input::placeholder{ color: ${(props)=>props.theme.textFaint}; }
    input:focus, select:focus{
        border-color: ${(props)=>props.theme.accent};
        box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    }
    input:read-only{
        background: ${(props)=>props.theme.surfaceHover};
        color: ${(props)=>props.theme.textMuted};
    }
`
export const Unit=styled.span`
    flex-shrink: 0;
    font-size: 12px;
    color: ${(props)=>props.theme.textFaint};
    white-space: nowrap;
`
//입력값이 규칙에 안 맞을 때 아래에 붙는 한 줄
export const Hint=styled.span`
    font-size: 11px;
    color: ${(props)=>props.$bad
        ? props.theme.warning
        : props.theme.toneSuccess};
`

/* 라디오는 칩처럼. 예전엔 그냥 나열이라 묶음 구분이 안 됐고,
   label 로 안 감싸서 글자를 눌러도 선택되지 않았다. */
export const Radiorow=styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`
export const Radiochip=styled.label`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 34px;
    padding: 0 13px;
    border: 1px solid ${(props)=>props.$on
        ? props.theme.accent
        : props.theme.border};
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.$on
        ? props.theme.accentSoft
        : props.theme.surface};
    color: ${(props)=>props.$on
        ? props.theme.accent
        : props.theme.textMuted};
    font-size: 13px;
    font-weight: ${(props)=>props.$on?700:500};
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover{ border-color: ${(props)=>props.theme.accent}; }

    input{ margin: 0; accent-color: ${(props)=>props.theme.accent}; }
`
//주소칸 + 지역찾기 버튼처럼 입력 옆에 버튼이 붙는 줄
export const Inputwithbutton=styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    & > input{ flex: 1; min-width: 0; }
    & > button{ flex-shrink: 0; }
`
//목록/그리드가 빈 경우
export const Emptybox=styled.div`
    padding: 32px 12px;
    text-align: center;
    font-size: 12.5px;
    color: ${(props)=>props.theme.textFaint};
`
