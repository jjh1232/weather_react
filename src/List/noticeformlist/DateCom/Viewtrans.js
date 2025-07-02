
export default function Viewtrans(num){
//_는그냥 구분자 의미없음
    if (num >= 1_000_000) {
        //tofixed로 소수점 n자리까지 문자열로
        //replace로 없애는데 /\.0$/ -> 정규식 소수점아래가 0이면 없앰
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

