import React from "react";
import styled from "styled-components";

//=====================================================================
// 렌더 중 예외를 잡아 화면 전체가 백지가 되는 것을 막는다.
//
// 리액트는 렌더/라이프사이클에서 예외가 나면 트리 전체를 언마운트한다.
// 에러 경계가 없으면 그대로 하얀 화면만 남고, 사용자는 뭐가 잘못됐는지도
// 새로고침하면 되는지도 알 수 없다.
//
// 실제로 겪은 사례:
//   게시글 상세에서 댓글 쿼리가 게시글보다 먼저 도착하면 post 가 undefined 인 채로
//   post.id 를 읽어 예외가 났다. 화면은 백지, 새로고침하면 우연히 정상.
//
// ⚠ 잡히는 것과 안 잡히는 것
//   잡힘   : 렌더, 생성자, 라이프사이클 중의 예외
//   안 잡힘 : 이벤트 핸들러, setTimeout, async 콜백 안의 예외
//            (그쪽은 각자 try/catch 해야 한다)
//
// 클래스 컴포넌트로만 만들 수 있다. 훅에는 대응하는 API 가 없다.
//=====================================================================

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 60vh;
  padding: 40px 20px;
  text-align: center;
  color: ${(props) => props.theme?.text || "#12181f"};
`;

const Title = styled.div`
  font-size: 17px;
  font-weight: 650;
`;

const Desc = styled.div`
  font-size: 13.5px;
  line-height: 1.7;
  color: ${(props) => props.theme?.textMuted || "#5b6672"};
  max-width: 340px;
`;

const Button = styled.button`
  margin-top: 4px;
  padding: 9px 18px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13.5px;
  font-weight: 600;
  color: #fff;
  background: ${(props) => props.theme?.accent || "#2f7fe0"};

  &:hover {
    background: ${(props) => props.theme?.accentHover || "#4a93ea"};
  }
`;

//개발 중에만 보여주는 원인 표시. 운영에서는 사용자에게 내부 정보를 노출하지 않는다.
const Detail = styled.pre`
  margin-top: 8px;
  padding: 12px 14px;
  max-width: 90vw;
  overflow: auto;
  text-align: left;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 10px;
  color: ${(props) => props.theme?.textMuted || "#5b6672"};
  background: ${(props) => props.theme?.surfaceAlt || "#f4f6fa"};
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  //렌더 중 예외가 나면 리액트가 이 값을 state 로 반영해 fallback 을 그리게 한다.
  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    //예전엔 이 정보가 아무데도 남지 않았다. 최소한 콘솔에는 남겨야 원인을 쫓을 수 있다.
    console.error("[ErrorBoundary] 렌더 중 예외:", error, info?.componentStack);
  }

  handleReload = () => {
    //상태를 비우고 다시 그려본다. 그래도 같은 예외면 fallback 이 다시 뜬다.
    this.setState({ error: null });
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <Wrap>
        <Title>화면을 그리는 중 문제가 생겼어요</Title>
        <Desc>
          일시적인 오류일 수 있습니다. 새로고침하면 대부분 정상으로 돌아옵니다.
          계속 같은 문제가 나타나면 잠시 후 다시 시도해주세요.
        </Desc>
        <Button onClick={this.handleReload}>새로고침</Button>

        {/* 운영 빌드에서는 내부 오류 메시지를 사용자에게 보여주지 않는다. */}
        {process.env.NODE_ENV !== "production" && (
          <Detail>{String(error?.stack || error)}</Detail>
        )}
      </Wrap>
    );
  }
}

export default ErrorBoundary;
