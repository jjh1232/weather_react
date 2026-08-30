import styled from "styled-components";

//=====================================================================
// 관리자 게시글 상세의 댓글 공용 스타일.
//
// 원글(Adminnoticecomment)과 답글(Adminnoticereply)이 각자 스타일을 들고 있었는데,
// 전부 디버그용 테두리(blue/yellow/green/red)가 남은 채였고
// width:1000px / 930px / 950px 처럼 고정 픽셀에 absolute 좌표라
// 글자와 버튼이 서로 겹쳐 찍혔다.
// 같은 모양이어야 하는 것들이니 여기 한 곳에만 둔다.
//=====================================================================

export const Commentcard=styled.div`
    display: flex;
    gap: 10px;
    padding: 12px 14px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    background: ${(props)=>props.$reply
        ? props.theme.surfaceAlt
        : props.theme.surface};
    min-width: 0;
`
//답글은 원글 아래에 한 칸 들여쓴다. 예전엔 left:50px 절대값이었다.
export const Replyindent=styled.div`
    margin-left: clamp(16px, 4%, 40px);
    margin-top: 8px;
`
export const Avatar=styled.img`
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`
export const Commentbody=styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
`
//닉네임 · 이메일 · 시간 · 버튼을 한 줄에. 좁으면 자연스럽게 접힌다.
export const Commenthead=styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
`
export const Nickname=styled.span`
    font-size: 13.5px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: ${(props)=>props.theme.text};
`
export const Email=styled.span`
    font-size: 12px;
    color: ${(props)=>props.theme.textFaint};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
`
export const Time=styled.span`
    margin-left: auto;
    flex-shrink: 0;
    font-size: 11.5px;
    color: ${(props)=>props.theme.textFaint};
`
export const Commentactions=styled.div`
    display: flex;
    gap: 4px;
    flex-shrink: 0;
`
export const Commenttext=styled.div`
    font-size: 13.5px;
    line-height: 1.65;
    color: ${(props)=>props.theme.text};
    white-space: pre-wrap;
    word-break: break-word;
`
//답글 뱃지
export const Replytag=styled.span`
    flex-shrink: 0;
    padding: 1px 7px;
    border-radius: ${(props)=>props.theme.radiusPill};
    font-size: 10.5px;
    font-weight: 700;
    background: ${(props)=>props.theme.accentSoft};
    color: ${(props)=>props.theme.accent};
`
//운영자 차단 표시. 관리자 화면에서는 원문이 그대로 보이므로
//이 뱃지가 없으면 차단된 건지 아닌지 알 수가 없다.
export const Blockedtag=styled.span`
    flex-shrink: 0;
    padding: 1px 7px;
    border-radius: ${(props)=>props.theme.radiusPill};
    font-size: 10.5px;
    font-weight: 700;
    background: rgba(255, 82, 82, 0.12);
    color: ${(props)=>props.theme.warning};
`
//차단된 댓글 본문은 흐리게 - 목록에서 한눈에 구분된다
export const Blockeddim=styled.div`
    opacity: .55;
`
