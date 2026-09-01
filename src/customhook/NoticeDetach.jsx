import React from "react";
import styled from "styled-components";
import { useConfirm } from "../UI/Feedback/FeedbackProvider";
import { API_BASE } from "../config/api";
import { detachimage } from "../UI/profileimage";

//=====================================================================
// 글에 붙은 이미지 목록(첨부목록).
//
// 예전엔 파일명 + [삭제] 버튼만 글자로 나열돼 있어서, 어떤 이미지인지 보려면
// 본문을 뒤져야 했다. 썸네일을 같이 보여주고, 관리자 화면에서는
// "차단 이미지로 교체"를 이미지 하나씩 할 수 있게 banmethod 를 받는다.
// banmethod 를 안 넘기면(글쓰기 화면) 그 버튼은 안 그린다.
//=====================================================================

//차단 주소는 이미지마다 ?ban={id} 가 붙는다(서버 adminService.bannedurl).
//그래서 === 가 아니라 startsWith 로 봐야 한다.
const BANIMAGE="/front/Subimages/chdan.png";
const isbanned=(path)=>typeof path==="string"&&path.startsWith(BANIMAGE);

const Wrapper=styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
`
const Header=styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    padding-bottom: 8px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
`
const Title=styled.h3`
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: ${(props)=>props.theme.text};
`
const Count=styled.span`
    font-size: 11.5px;
    color: ${(props)=>props.theme.textFaint};
`
const Exitbutton=styled.button`
    margin-left: auto;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 50%;
    background: none;
    color: ${(props)=>props.theme.textMuted};
    font-size: 15px;
    line-height: 1;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover{
        background: ${(props)=>props.theme.surfaceHover};
        color: ${(props)=>props.theme.text};
    }
`
const List=styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow-y: auto;
`
const Item=styled.div`
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusSm};
    background: ${(props)=>props.theme.surface};
`
const Thumb=styled.img`
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    object-fit: cover;
    border-radius: ${(props)=>props.theme.radiusSm};
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`
const Meta=styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
`
const Filename=styled.span`
    font-size: 11.5px;
    color: ${(props)=>props.theme.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const Actions=styled.div`
    display: flex;
    gap: 4px;
`
const Smallbutton=styled.button`
    height: 22px;
    padding: 0 8px;
    border-radius: ${(props)=>props.theme.radiusPill};
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.textMuted};
    transition: background ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover{
        border-color: ${(props)=>props.$danger
            ? props.theme.warning
            : props.theme.accent};
        color: ${(props)=>props.$danger
            ? props.theme.warning
            : props.theme.accent};
    }
    &:disabled{ opacity:.45; cursor:default; }
`
//이미 차단된 이미지 표시
const Banned=styled.span`
    align-self: flex-start;
    padding: 1px 7px;
    border-radius: ${(props)=>props.theme.radiusPill};
    font-size: 10.5px;
    font-weight: 700;
    background: rgba(255, 82, 82, 0.12);
    color: ${(props)=>props.theme.warning};
`
const Empty=styled.div`
    padding: 24px 8px;
    text-align: center;
    font-size: 12px;
    color: ${(props)=>props.theme.textFaint};
`

export default function NoticeDetach(props){
    const {deletemethod,banmethod,restoremethod,detachs,setislibe}=props;
    const confirm=useConfirm();

    //path 가 빈 값인 자리표시자 행은 목록에서 뺀다
    const files=(detachs||[]).filter((d)=>d&&d.path);

    const deletedetach=async(id,rangeindex)=>{
        const ok=await confirm({
            title:"첨부를 목록에서 지울까요?",
            description:"글 본문에서도 그 이미지가 함께 지워집니다.",
            confirmText:"삭제",
            danger:true,
        })
        if(ok) deletemethod(id,rangeindex)
    }

    const bandetach=async(data)=>{
        const ok=await confirm({
            title:"이 이미지를 차단 이미지로 바꿀까요?",
            description:"원본 대신 차단 안내 이미지가 보이게 됩니다. 나중에 되돌릴 수 있습니다.",
            confirmText:"차단",
            danger:true,
        })
        if(ok) banmethod(data)
    }

    const restoredetach=async(data)=>{
        const ok=await confirm({
            title:"차단을 해제할까요?",
            description:"원래 이미지가 다시 보이게 됩니다.",
            confirmText:"해제",
        })
        if(ok) restoremethod(data)
    }

    return (
        <Wrapper>
            <Header>
                <Title>첨부목록</Title>
                <Count>{files.length}장</Count>
                <Exitbutton type="button" onClick={()=>{setislibe(false)}} title="닫기">×</Exitbutton>
            </Header>

            <List>
                {files.length===0
                    ? <Empty>첨부된 이미지가 없습니다.</Empty>
                    : files.map((data,key)=>{
                        const banned=isbanned(data.path);
                        //이 기능이 생기기 전에 차단된 행은 원본 주소를 안 남겨서 못 되돌린다
                        const canrestore=banned && !!data.originalpath;
                        return (
                            <Item key={data.id??key}>
                                <Thumb src={detachimage(data.path)} alt=""/>
                                <Meta>
                                    <Filename title={data.filename}>{data.filename}</Filename>
                                    {banned && <Banned>차단됨</Banned>}
                                    <Actions>
                                        {/* 저장 전 새 이미지는 아직 id 가 없어 서버에서 차단할 수 없다 */}
                                        {banmethod && !banned &&
                                            <Smallbutton type="button" $danger
                                                disabled={!data.id}
                                                title={data.id?"차단 이미지로 교체":"저장 후에 차단할 수 있습니다"}
                                                onClick={()=>{bandetach(data)}}>차단</Smallbutton>}
                                        {restoremethod && banned &&
                                            <Smallbutton type="button"
                                                disabled={!canrestore}
                                                title={canrestore
                                                    ?"원래 이미지로 되돌리기"
                                                    :"원본 정보가 없어 되돌릴 수 없습니다"}
                                                onClick={()=>{restoredetach(data)}}>차단해제</Smallbutton>}
                                        <Smallbutton type="button" $danger
                                            onClick={()=>{deletedetach(data.id,data.rangeindex)}}>삭제</Smallbutton>
                                    </Actions>
                                </Meta>
                            </Item>
                        )
                    })}
            </List>
        </Wrapper>
    )
}
