

export const validate={
    username:{
         required:true,
         pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // 이메일 정규식
         errorMessage: '이메일 형식이 잘못되었습니다!'
    },
    password: {
    required: true,
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
    errorMessage: '8자리 이상 , 숫자/문자 조합 필수입니다!'
  },
  confirmpassword: {
    required: true,
    custom: (value, form) => value === form.password,
    customMessage: '비밀번호가 일치하지 않습니다!'
  },
  profileid: {
    required: true,
    pattern: /^[a-z][a-z0-9_-]{3,11}$/, // 첫 글자 영문, 이후 숫자, _, - 허용
    errorMessage: '소문자 시작, 4~12자 영문+숫자(-,_)만 가능해요.',
  },
  usernickname: {
    required: true,
    pattern: /^[가-힣a-zA-Z0-9]{2,12}$/, // 한글/영문/숫자만 허용
    errorMessage: '닉네임은 특수문자 제외, 2~12자 이내여야 합니다!',
  },
}

export function Validators(name,value,form){
        //변수로 어떤유형인지 
    const rule=validate[name]

    //없는내용일시 빈값리턴
    if (!rule) return '';
    //필수검사
    if(rule.require && !value) return "필수입력해야합니다!"

    //정규식검사
    if(rule.pattern && !rule.pattern.test(value)){
        return rule.errorMessage;

    }
    //커스텀함수 값이있을시 고 비번과 확인이 같으면 트루니까 에러시 에러메세지
    if(rule.custom && !rule.custom(value,form)){
        return rule.customMessage;

    }

    return ""//이상없음
}