import React from "react"


export const Emailcheck=(email)=>{

const exp=/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
///^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

    return exp.test(email);

}

export const passwordcheck=(password)=>{
const exp=/^([a-z0-9\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"/g;]{8,20}$)+/;

return exp.test(password);
}

export const confirmpasswordcheck=(password,confirmpassword)=>{
   
    if(password===confirmpassword){
        return true;
    }
    else{
        return false
    }
    
}
export const nicknamevalid=(nickname)=>{
const exp=/^[a-z0-9가-힣_]{2,12}$/;
return exp.test(nickname);
}
