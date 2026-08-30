import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BrandMark from "../../UI/BrandMark";

//=====================================================================
// 이용약관 / 개인정보 처리방침
//  - 실제로 코드가 수집하는 항목을 그대로 적었다(MemberEntity, 로그인기록, 업로드 이미지).
//  - 수집 항목이 바뀌면 이 문서도 같이 고쳐야 한다. 그게 고지의 핵심이다.
//  - (연락처) 로 표시된 자리는 운영자 정보로 채워 넣어야 한다.
//=====================================================================

const SHIHAENGIL="2026년 8월 26일";
const CONTACT="dlwjdwns1945@gmail.com";

const Wrapper=styled.div`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    padding: 48px 16px 80px;
    background: ${(props)=>props.theme.page};
    color: ${(props)=>props.theme.text};

    @media (max-width: 620px) { padding: 28px 14px 56px; }
`
const Paper=styled.div`
    width: min(760px, 100%);
    padding: 40px 44px 44px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusLg};
    background: ${(props)=>props.theme.surface};
    box-shadow: ${(props)=>props.theme.shadow};

    @media (max-width: 620px) { padding: 26px 20px 30px; }
`
const Brandrow=styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
    width: fit-content;
`
const Wordmark=styled.span`
    font-size: 18px;
    font-weight: 750;
    letter-spacing: -0.03em;
    background-image: linear-gradient(
        120deg,
        ${(props)=>props.theme.accent},
        ${(props)=>props.theme.accentHover}
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`
const Doctitle=styled.h1`
    margin: 26px 0 6px;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.03em;
`
const Docdate=styled.p`
    margin: 0 0 30px;
    font-size: 13px;
    color: ${(props)=>props.theme.textFaint};
`
const Section=styled.section`
    margin-bottom: 28px;

    &:last-of-type { margin-bottom: 0; }
`
const Heading=styled.h2`
    margin: 0 0 10px;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.02em;
`
const Body=styled.div`
    font-size: 14px;
    line-height: 1.75;
    color: ${(props)=>props.theme.textMuted};
    max-width: 68ch;

    p { margin: 0 0 8px; }
    p:last-child { margin-bottom: 0; }
    ul { margin: 0 0 8px; padding-left: 18px; }
    li { margin-bottom: 4px; }
    strong { color: ${(props)=>props.theme.text}; font-weight: 600; }
`
//표는 좁은 화면에서 가로로만 스크롤되게 가둔다.
const Tablebox=styled.div`
    overflow-x: auto;
    margin: 4px 0 10px;
`
const Table=styled.table`
    width: 100%;
    min-width: 460px;
    border-collapse: collapse;
    font-size: 13.5px;

    th, td {
        text-align: left;
        vertical-align: top;
        padding: 9px 12px;
        border-bottom: 1px solid ${(props)=>props.theme.border};
        line-height: 1.6;
    }
    th {
        white-space: nowrap;
        width: 150px;
        font-weight: 600;
        color: ${(props)=>props.theme.text};
        background: ${(props)=>props.theme.surfaceAlt};
    }
    td { color: ${(props)=>props.theme.textMuted}; }
`
const Backbutton=styled.button`
    margin-top: 34px;
    height: 36px;
    padding: 0 18px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.surfaceAlt};
    color: ${(props)=>props.theme.textMuted};
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;

    &:hover { background: ${(props)=>props.theme.surfaceHover}; color: ${(props)=>props.theme.text}; }
    &:focus-visible { outline: 2px solid ${(props)=>props.theme.accent}; outline-offset: 2px; }
`

function Docframe({title,children}){
    const navigate=useNavigate();
    return (
        <Wrapper>
            <Paper>
                <Brandrow onClick={()=>navigate("/")} title="홈으로">
                    <BrandMark size={22}/>
                    <Wordmark>Weave</Wordmark>
                </Brandrow>
                <Doctitle>{title}</Doctitle>
                <Docdate>시행일 {SHIHAENGIL}</Docdate>
                {children}
                <Backbutton type="button" onClick={()=>navigate(-1)}>돌아가기</Backbutton>
            </Paper>
        </Wrapper>
    )
}

//=====================================================================
// 개인정보 처리방침
//=====================================================================
export function Privacypolicy(){
    return (
        <Docframe title="개인정보 처리방침">

            <Section>
                <Body>
                    <p>
                        Weave(이하 &quot;서비스&quot;)는 이용자의 개인정보를 소중히 다루며,
                        개인정보 보호법 등 관련 법령을 준수합니다. 이 방침은 서비스가 어떤 정보를
                        어떤 목적으로 수집하고 얼마나 보관하는지를 설명합니다.
                    </p>
                </Body>
            </Section>

            <Section>
                <Heading>1. 수집하는 개인정보 항목</Heading>
                <Body>
                    <Tablebox>
                    <Table>
                        <tbody>
                            <tr>
                                <th>회원가입 시 (필수)</th>
                                <td>이메일 주소, 비밀번호, 닉네임, 프로필 아이디, 거주 지역(동 단위)</td>
                            </tr>
                            <tr>
                                <th>소셜 로그인 시</th>
                                <td>제공사(구글 · 네이버)로부터 전달받은 이메일 주소와 계정 식별자</td>
                            </tr>
                            <tr>
                                <th>서비스 이용 중</th>
                                <td>프로필 이미지 · 배경 이미지, 자기소개, 작성한 글 · 댓글 · 채팅 내용,
                                    팔로우 · 좋아요 · 신고 · 차단 기록</td>
                            </tr>
                            <tr>
                                <th>자동으로 생성</th>
                                <td>접속 IP 주소, 로그인 일시, 서비스 이용 기록</td>
                            </tr>
                        </tbody>
                    </Table>
                    </Tablebox>
                    <p>
                        거주 지역은 <strong>동 단위 행정구역과 기상청 격자 좌표</strong>만 저장하며,
                        상세 주소나 실시간 위치는 수집하지 않습니다.
                    </p>
                </Body>
            </Section>

            <Section>
                <Heading>2. 개인정보의 이용 목적</Heading>
                <Body>
                    <ul>
                        <li>회원 식별과 로그인, 이메일 인증 및 비밀번호 찾기</li>
                        <li>거주 지역의 날씨 정보 제공</li>
                        <li>글 · 댓글 · 채팅 등 서비스 기능 제공과 이용자 간 소통</li>
                        <li>신고 · 차단 처리 및 부정 이용 방지</li>
                        <li>서비스 이용 기록 분석을 통한 운영 개선</li>
                    </ul>
                </Body>
            </Section>

            <Section>
                <Heading>3. 보유 및 이용 기간</Heading>
                <Body>
                    <p>
                        회원 정보는 <strong>회원 탈퇴 시까지</strong> 보관하며, 탈퇴 즉시 파기합니다.
                        다만 부정 이용 방지를 위해 접속 기록은 탈퇴 후에도 최대 3개월간 보관할 수 있습니다.
                    </p>
                    <p>
                        이용자가 작성한 글과 댓글은 다른 이용자의 대화 맥락이 함께 사라지지 않도록,
                        작성자 정보를 지운 상태로 남을 수 있습니다. 원치 않으시면 탈퇴 전에 직접 삭제해 주세요.
                    </p>
                </Body>
            </Section>

            <Section>
                <Heading>4. 제3자 제공 및 처리 위탁</Heading>
                <Body>
                    <p>서비스는 이용자의 개인정보를 <strong>제3자에게 제공하지 않습니다.</strong></p>
                    <p>다만 아래 업무를 위탁하고 있습니다.</p>
                    <Tablebox>
                    <Table>
                        <tbody>
                            <tr>
                                <th>Google (Gmail)</th>
                                <td>인증메일 · 비밀번호 찾기 메일 발송</td>
                            </tr>
                            <tr>
                                <th>구글 · 네이버</th>
                                <td>소셜 로그인 인증 (이용자가 선택한 경우에 한함)</td>
                            </tr>
                        </tbody>
                    </Table>
                    </Tablebox>
                    <p>
                        날씨 정보는 기상청 공공 API에서 <strong>지역 좌표만으로</strong> 조회하며,
                        개인정보는 외부로 전송되지 않습니다.
                    </p>
                </Body>
            </Section>

            <Section>
                <Heading>5. 이용자의 권리</Heading>
                <Body>
                    <p>
                        이용자는 언제든지 자신의 개인정보를 열람 · 수정할 수 있고, 회원 탈퇴로 삭제를 요구할 수 있습니다.
                        프로필 수정은 마이페이지에서, 탈퇴는 회원 탈퇴 메뉴에서 직접 하실 수 있습니다.
                    </p>
                    <p>그 밖의 처리 정지 요구 등은 아래 연락처로 요청해 주시면 지체 없이 조치합니다.</p>
                </Body>
            </Section>

            <Section>
                <Heading>6. 개인정보의 안전성 확보 조치</Heading>
                <Body>
                    <ul>
                        <li>비밀번호는 복호화가 불가능한 방식(BCrypt)으로 암호화하여 저장합니다</li>
                        <li>이용자와 서버 사이의 통신은 암호화(HTTPS)하여 전송합니다</li>
                        <li>개인정보에 접근할 수 있는 관리자 권한을 최소한으로 제한합니다</li>
                    </ul>
                </Body>
            </Section>

            <Section>
                <Heading>7. 개인정보 보호책임자</Heading>
                <Body>
                    <p>개인정보 관련 문의는 아래로 연락해 주세요.</p>
                    <p><strong>연락처</strong> {CONTACT}</p>
                </Body>
            </Section>

            <Section>
                <Heading>8. 방침의 변경</Heading>
                <Body>
                    <p>
                        이 방침이 변경되는 경우 시행일 최소 7일 전에 서비스 공지사항을 통해 알립니다.
                        이용자에게 불리한 변경일 때는 30일 전에 알립니다.
                    </p>
                </Body>
            </Section>

        </Docframe>
    )
}

//=====================================================================
// 이용약관
//=====================================================================
export function Terms(){
    return (
        <Docframe title="이용약관">

            <Section>
                <Heading>제1조 (목적)</Heading>
                <Body>
                    <p>
                        이 약관은 Weave(이하 &quot;서비스&quot;)를 이용하는 데 필요한 조건과 절차,
                        이용자와 서비스의 권리 · 의무를 정하는 것을 목적으로 합니다.
                    </p>
                </Body>
            </Section>

            <Section>
                <Heading>제2조 (약관의 효력과 변경)</Heading>
                <Body>
                    <p>
                        이 약관은 서비스 화면에 게시하여 효력이 발생합니다.
                        약관을 변경할 때에는 시행일 7일 전(이용자에게 불리한 변경은 30일 전)에 공지합니다.
                        변경된 약관에 동의하지 않으시면 언제든 탈퇴하실 수 있습니다.
                    </p>
                </Body>
            </Section>

            <Section>
                <Heading>제3조 (회원가입)</Heading>
                <Body>
                    <p>
                        이용자는 이메일 인증을 마친 뒤 회원이 됩니다.
                        타인의 정보를 도용하거나 허위 정보를 기재한 경우 이용이 제한될 수 있습니다.
                    </p>
                </Body>
            </Section>

            <Section>
                <Heading>제4조 (이용자의 의무)</Heading>
                <Body>
                    <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
                    <ul>
                        <li>타인의 계정 정보를 도용하거나 무단으로 사용하는 행위</li>
                        <li>타인을 모욕 · 비방하거나 명예를 훼손하는 게시물 작성</li>
                        <li>음란물, 불법 정보, 타인의 저작권을 침해하는 게시물 작성</li>
                        <li>자동화된 수단으로 서비스에 과도한 부하를 주는 행위</li>
                        <li>다른 이용자의 개인정보를 수집 · 저장 · 공개하는 행위</li>
                    </ul>
                </Body>
            </Section>

            <Section>
                <Heading>제5조 (게시물의 권리와 관리)</Heading>
                <Body>
                    <p>
                        이용자가 작성한 게시물의 저작권은 작성자에게 있습니다.
                        다만 서비스는 게시물을 서비스 화면에 노출하는 데 필요한 범위에서 이를 사용할 수 있습니다.
                    </p>
                    <p>
                        신고가 접수되었거나 제4조를 위반한 게시물은 사전 통보 없이 숨김 처리하거나 삭제할 수 있습니다.
                    </p>
                </Body>
            </Section>

            <Section>
                <Heading>제6조 (서비스의 중단)</Heading>
                <Body>
                    <p>
                        점검 · 장애 · 천재지변 등으로 서비스 제공이 어려울 때에는 일시적으로 중단될 수 있으며,
                        예정된 점검은 미리 공지합니다.
                    </p>
                </Body>
            </Section>

            <Section>
                <Heading>제7조 (이용 계약의 해지)</Heading>
                <Body>
                    <p>
                        이용자는 언제든지 회원 탈퇴로 이용 계약을 해지할 수 있습니다.
                        서비스는 이용자가 제4조를 반복하여 위반하는 경우 이용을 제한하거나 계약을 해지할 수 있습니다.
                    </p>
                </Body>
            </Section>

            <Section>
                <Heading>제8조 (날씨 정보에 관한 고지)</Heading>
                <Body>
                    <p>
                        서비스가 제공하는 날씨 정보는 기상청 공공 API를 그대로 전달하는 참고 자료입니다.
                        실제 기상 상황과 다를 수 있으며, 이를 근거로 한 판단의 결과에 대해서는 책임지지 않습니다.
                    </p>
                </Body>
            </Section>

            <Section>
                <Heading>제9조 (문의)</Heading>
                <Body>
                    <p>약관에 관한 문의는 {CONTACT} 로 연락해 주세요.</p>
                </Body>
            </Section>

        </Docframe>
    )
}

export default Privacypolicy;
