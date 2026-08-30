import React, { useState } from "react";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import ReactCrpooer from "./ReactCropper";
import SelfDraw from "./SelfDraw";
import profileimage, { DEFAULTPROFILE } from "../../UI/profileimage";


const Page = styled.div`
  min-height: 100vh;
  padding: 16px;
  display: flex;
  justify-content: center;
  background: ${(props) => props.theme.page};
  color: ${(props) => props.theme.text};
`;

const Card = styled.div`
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 17px;
  font-weight: 750;
  letter-spacing: -0.03em;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.radius};
  background: ${(props) => props.theme.surface};
`;

const Sectiontitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${(props) => props.theme.textFaint};
`;

//고르는 게 아니라 "지금 내 프로필은 이렇다"를 보여주기만 한다
const Currentrow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Currentavatar = styled.img`
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
  background: #fff;
  border: 1px solid ${(props) => props.theme.border};
`;

const Currentinfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Currentname = styled.div`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Currentsub = styled.div`
  font-size: 11.5px;
  font-weight: 600;
  color: ${(props) => props.theme.textFaint};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Tabs = styled.div`
  display: flex;
  gap: 4px;
  padding: 3px;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.radiusPill};
  background: ${(props) => props.theme.surfaceAlt};
`;

const Tab = styled.button`
  flex: 1;
  height: 30px;
  border: none;
  border-radius: ${(props) => props.theme.radiusPill};
  cursor: pointer;
  font-size: 13px;
  font-weight: 650;
  letter-spacing: -0.02em;

  background: ${(props) =>
    props.$active ? props.theme.surface : "transparent"};
  color: ${(props) =>
    props.$active ? props.theme.accent : props.theme.textMuted};
  box-shadow: ${(props) => (props.$active ? props.theme.shadowSm : "none")};
  transition: background ${(props) => props.theme.transition},
    color ${(props) => props.theme.transition};

  &:hover {
    color: ${(props) => props.theme.text};
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.radius};
  background: ${(props) => props.theme.surface};
`;

//실제 아바타와 같은 원형으로 보여줘야 잘리는 부분을 미리 알 수 있다
const Preview = styled.div`
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.surfaceAlt};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Previewlabel = styled.div`
  flex: 1;
  min-width: 0;
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1.45;
  color: ${(props) => props.theme.textMuted};
`;

const Savebutton = styled.button`
  flex-shrink: 0;
  height: 38px;
  padding: 0 18px;
  border: none;
  border-radius: ${(props) => props.theme.radiusPill};
  background: ${(props) => props.theme.accent};
  color: #fff;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background ${(props) => props.theme.transition};

  &:hover {
    background: ${(props) => props.theme.accentHover};
  }
  &:disabled {
    background: ${(props) => props.theme.borderStrong};
    cursor: not-allowed;
  }
`;

export default function Userimage() {
  //팝업이지만 같은 출처라 부모와 쿠키를 공유한다
  const [cookies] = useCookies(["userinfo"]);
  const currentpath = cookies.userinfo?.profileimg;
  //사진이 없으면 profileimage 가 기본 이미지를 돌려준다
  const currentsrc = profileimage(currentpath);

  const [tab, setTab] = useState("upload");
  const [result, setResult] = useState(null);

  const save = () => {
    if (!result) return;

    if (window.opener && window.opener.parentCallback) {
      window.opener.parentCallback(result);
      window.close();
    } else {
      alert("프로필 편집 화면에서 열어주세요.");
    }
  };

  return (
    <Page>
      <Card>
        <Title>프로필 이미지</Title>

        <Section>
          <Sectiontitle>현재 프로필</Sectiontitle>
          <Currentrow>
            {/* 설정된 사진이 없으면 기본 이미지가 그 자리를 대신한다 */}
            <Currentavatar
              src={currentsrc}
              alt="현재 프로필"
            />
            <Currentinfo>
              <Currentname>{cookies.userinfo?.nickname || "이름 없음"}</Currentname>
              <Currentsub>
                {currentsrc ? cookies.userinfo?.username : "기본 이미지 사용 중"}
              </Currentsub>
            </Currentinfo>
          </Currentrow>
        </Section>

        <Section>
          <Sectiontitle>새로 만들기</Sectiontitle>

          <Tabs>
            <Tab
              type="button"
              $active={tab === "upload"}
              onClick={() => setTab("upload")}
            >
              사진 올리기
            </Tab>
            <Tab
              type="button"
              $active={tab === "draw"}
              onClick={() => setTab("draw")}
            >
              직접 그리기
            </Tab>
          </Tabs>

          {tab === "upload" ? (
            <ReactCrpooer onResult={setResult} />
          ) : (
            <SelfDraw onResult={setResult} />
          )}
        </Section>

        <Footer>
          <Preview>{result && <img src={result} alt="미리보기" />}</Preview>
          <Previewlabel>
            {result
              ? "이렇게 원형으로 잘려 보입니다"
              : "적용할 이미지를 먼저 골라주세요"}
          </Previewlabel>
          <Savebutton onClick={save} disabled={!result}>
            적용
          </Savebutton>
        </Footer>
      </Card>
    </Page>
  );
}
