
//jwt는 header.payload.signature 3부분으로구성
function ParseJwt(token){
    if( !token) return null;
    try{

        
         const base64url=token.split('.')[1]; //페이로드
         //base64url을 표준 base64로 변환해야함
         //Base64URL : 안전한 URL 전송 위해 → + → -, / → _ 바꿔서 인코딩 함	
        //하지만 JS의 atob() 함수는 Base64 표준 포맷만 이해함
         const base64=base64url.replace(/-/g,"+").replace(/_/g,"/");
         //atob->base64문자열을 디코딩해서 원래문자로보여줌 ,각각문자를 하나씩문자배열로쪼개서 %xx형태의
         //이스케이프문자열로바꿔줌 안그러면 한글 공백해석못함
         //decodeURIcom.. -> %EC%AO같은 형태를 실제글자로복원 ->모든특수문자한글등 JSON안전하게파싱
         const JsonPayload=decodeURIComponent(atob(base64).split('').map(function(c){
            return '%' + ('00'+c.charCodeAt(0).toString(16)).slice(-2);
          }).join('')); //charcoad는유니코드 16진수로 바꾸고 
        return JSON.parse(JsonPayload);
    }catch(e){
        return null;
    }
    

}export default ParseJwt;