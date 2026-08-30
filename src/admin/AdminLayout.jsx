import React from "react";
import styled from "styled-components";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import BrandMark from "../UI/BrandMark";

//=====================================================================
// 관리자 화면 껍데기 (좌측 네비 + 상단바 + 내용)
//
// 예전에는 이런 껍데기가 없었다. AdminLeft 를 Adminmain(=/admin 첫 화면)
// 안에서만 그렸기 때문에, 회원관리·게시글관리로 들어가는 순간 좌측 메뉴가
// 통째로 사라져서 주소를 직접 치지 않으면 돌아올 수가 없었다.
// 라우트 element 로 두고 <Outlet/> 에 각 화면을 끼운다.
//=====================================================================

const NAVWIDTH="228px";

const Wrapper=styled.div`
    min-height: 100vh;
    background: ${(props)=>props.theme.page};
    color: ${(props)=>props.theme.text};
`
//좌측 네비. 내용이 길어져도 항상 같은 자리에 있어야 해서 fixed.
const Nav=styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: ${NAVWIDTH};
    display: flex;
    flex-direction: column;
    padding: 16px 12px;
    background: ${(props)=>props.theme.surface};
    border-right: 1px solid ${(props)=>props.theme.border};
    z-index: 20;

    @media (max-width: 900px) {
        position: static;
        width: 100%;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border-right: none;
        border-bottom: 1px solid ${(props)=>props.theme.border};
        overflow-x: auto;
    }
`
const Brand=styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px 16px;
    cursor: pointer;

    @media (max-width: 900px) {
        padding: 0 8px 0 0;
        flex: none;
    }
`
const Brandname=styled.div`
    display: flex;
    flex-direction: column;
    line-height: 1.2;
`
const Brandtitle=styled.span`
    font-size: 15px;
    font-weight: 750;
    letter-spacing: -0.02em;
`
const Brandsub=styled.span`
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: ${(props)=>props.theme.textFaint};
`
const Menulist=styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;

    @media (max-width: 900px) {
        flex-direction: row;
        gap: 4px;
    }
`
const Menu=styled.button`
    display: flex;
    align-items: center;
    gap: 9px;
    width: 100%;
    height: 38px;
    padding: 0 12px;
    border: none;
    border-radius: ${(props)=>props.theme.radiusSm};
    font-size: 13.5px;
    font-weight: ${(props)=>props.$active?700:500};
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    ${(props)=>props.$active
        ? `background:${props.theme.accentSoft}; color:${props.theme.accent};`
        : `background:none; color:${props.theme.textMuted};
           &:hover{ background:${props.theme.surfaceHover}; color:${props.theme.text}; }`}

    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: -2px;
    }

    @media (max-width: 900px) {
        width: auto;
    }
`
const Menuicon=styled.span`
    flex: none;
    width: 18px;
    text-align: center;
    font-size: 13px;
`
//네비 맨 아래 - 로그인한 관리자와 서비스로 돌아가기
const Navfoot=styled.div`
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid ${(props)=>props.theme.border};

    @media (max-width: 900px) {
        margin-top: 0;
        margin-left: auto;
        flex-direction: row;
        align-items: center;
        padding-top: 0;
        border-top: none;
    }
`
const Adminname=styled.div`
    padding: 0 10px;
    font-size: 12px;
    color: ${(props)=>props.theme.textMuted};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const Backbutton=styled.button`
    height: 32px;
    padding: 0 12px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusSm};
    background: ${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.textMuted};
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover {
        background: ${(props)=>props.theme.surfaceHover};
        color: ${(props)=>props.theme.text};
    }
`
const Content=styled.main`
    margin-left: ${NAVWIDTH};
    padding: 24px 28px 40px;
    min-width: 0;

    @media (max-width: 900px) {
        margin-left: 0;
        padding: 16px 12px 32px;
    }
`

//주소 → 메뉴. index(/admin) 는 정확히 일치할 때만 켠다.
const MENUS=[
    {path:"/admin",         label:"대시보드",   icon:"■", exact:true},
    {path:"/admin/member",  label:"회원 관리",   icon:"◉"},
    {path:"/admin/notice",  label:"게시글 관리", icon:"▤"},
    {path:"/admin/comment", label:"댓글 관리",   icon:"❝"},
    {path:"/admin/chatroom",label:"채팅방 관리", icon:"◧"},
]

export default function AdminLayout(){

    const navigate=useNavigate();
    const location=useLocation();
    const [cookie]=useCookies(["userinfo"]);

    const isactive=(menu)=>menu.exact
        ? location.pathname==="/admin"
        : location.pathname.startsWith(menu.path);

    return (
        <Wrapper>
            <Nav>
                <Brand onClick={()=>navigate("/admin")} title="대시보드로">
                    <BrandMark size={24}/>
                    <Brandname>
                        <Brandtitle>Weave</Brandtitle>
                        <Brandsub>ADMIN</Brandsub>
                    </Brandname>
                </Brand>

                <Menulist>
                    {MENUS.map((menu)=>(
                        <Menu key={menu.path} type="button"
                            $active={isactive(menu)}
                            onClick={()=>navigate(menu.path)}>
                            <Menuicon>{menu.icon}</Menuicon>
                            {menu.label}
                        </Menu>
                    ))}
                </Menulist>

                <Navfoot>
                    <Adminname>{cookie.userinfo?.nickname||"관리자"}</Adminname>
                    <Backbutton type="button" onClick={()=>navigate("/notice/twitform")}>
                        서비스로 돌아가기
                    </Backbutton>
                </Navfoot>
            </Nav>

            <Content>
                <Outlet/>
            </Content>
        </Wrapper>
    )
}
