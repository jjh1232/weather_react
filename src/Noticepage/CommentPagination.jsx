import styled from "styled-components";
import React from "react";

const PagenationWrapper=styled.div`
    border: 1px solid red;
    width: 50%;
    display: flex;
      cursor: pointer;
`
const Lastmovediv=styled.div`
    border: 1px solid blue;
    flex:1;
    text-align: center;
      font-size: 20px;
      cursor: pointer;
`
const Arrowdiv=styled.div`
    border: 1px solid yellow;
    flex:1;
      text-align: center;
        cursor: pointer;
          font-size: 20px;
`
const CountWrapper=styled.div`
    display: flex;
    border: 1px solid blue;
    flex:6;
      cursor: pointer;
`
const Counttab=styled.div`
    border:1px solid green;
    color: ${(props)=>props.color};
    flex:1;
      text-align: center;
    cursor: pointer;
    font-size: 20px;
`


export default function CommentPagination(props){
    const {currentpage,totalpage,setpage}=props;
    
    

    const pageLimit=5; //한번에 보여줄 페이지개수
    const half=Math.floor(pageLimit/2); //소수점이하 내림
    let start=Math.max(1,currentpage-half); //시작페이지
    let end=Math.min(totalpage,currentpage+half); //마지막페이지

    //페이지 끝에 가까울때 보정
    if(end-start+1<pageLimit){ //+1해야갯수가나온다
        if(start===1){
            end =Math.min(totalpage,start+pageLimit-1); //5개가나와야하니까 
        }else if(end===totalpage){
            start= Math.max(1,end-pageLimit +1); //+1해야함 8-5 =3 인데 4,5,6,7,8이런식으로나와야함
        }
    }

    const pagearray=[];
    
    for (let i=start;i<=end;i++){
        pagearray.push(i);
    }



    //페이지 한번에
    
    const prevhandler=()=>{
        setpage((prev)=>Math.max(1,pagearray[0]-1))
    }
      const nexthandler=()=>{
        setpage((prev)=>Math.min(totalpage,pagearray[pagearray.length - 1]+1))
    }

    return (
    <PagenationWrapper>
   {pagearray[0]>1 && (<Lastmovediv>
   ...1
   </Lastmovediv>)}
   {currentpage>1 && <Arrowdiv onClick={prevhandler}>이전</Arrowdiv>}
   <CountWrapper>
    {pagearray.map((count,key)=>{
     return (
            <React.StrictMode key={key}>
            {count===currentpage?
              <Counttab color="red">
        {//현재페이지
            count
        }
        </Counttab> 
        :
         <Counttab color="black" onClick={()=>{setpage(count)}}>
        {//다른페이지
            count
        }
        </Counttab>   
        }
            </React.StrictMode>
        )
    })
}
</CountWrapper>
    {currentpage<totalpage&&<Arrowdiv onClick={nexthandler}>다음</Arrowdiv>}

  {pagearray[4]<totalpage&&<Lastmovediv>...{totalpage}</Lastmovediv>}
      
    
  

    </PagenationWrapper>)

}