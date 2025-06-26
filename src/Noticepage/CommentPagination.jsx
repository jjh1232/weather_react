import styled from "styled-components";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";

const PagenationWrapper=styled.div`
    
    //width: 30%;
    display: flex;
    gap: 15px;
      cursor: pointer;
      padding: 3px;
`
const Lastmovediv=styled.div`

    flex:1;
    text-align: center;
      font-size: 20px;
      cursor: pointer;

       &:hover{
       border: 2px solid #a8a8a8;
    }
`
const Arrowdiv=styled.div`
   
    flex:1;
      text-align: center;
        cursor: pointer;
          font-size: 20px;

    &:hover{
       border: 2px solid #a8a8a8;
    }
`
const CountWrapper=styled.div`
    display: flex;
   
    flex:6;
      cursor: pointer;
      gap: 10px;
      //align-items: center;
       align-items: center;         /* 세로 중앙 */
justify-content: center;     /* 가로 중앙 */

    
`
const Counttab=styled.div`
width: 20px;
height: 20px;
display: flex;               /* 추가! */
align-items: center;         /* 세로 중앙 */
justify-content: center;     /* 가로 중앙 */
text-align: center;
  width: 20px;
  height: 20px;
    color: ${({isactive,theme})=>isactive?"#fa6e37":theme.text};
    flex:1;
    
    cursor: pointer;
  
      
    font-size: 18px;
    border: 2px solid ${(props)=>(props.isactive?"#a8a8a8":"rgba(0,0,0,0.07)")};
    box-shadow: ${(props)=>props.isactive?'#fff0f0':'white'};
    font-weight: ${(props) => (props.isactive ? 'bold' : 'normal')};
    
  transition: all 0.2s;
    //클릭아닐시 효과
  ${(props) =>
    !props.isactive &&
    `
      &:hover {
        border: 2px solid #a8a8a8;
        box-shadow: 0 2px 8px rgba(255,77,79,0.15);
        color: #f55d37;
        
        font-weight: bold;
      }
    `
    }
`;



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
   {pagearray[0]>1 && (<Lastmovediv onClick={()=>{setpage(1)}}>
   ...1
   </Lastmovediv>)}
   {currentpage>1 && <Arrowdiv onClick={prevhandler}>
     <FontAwesomeIcon icon={faAnglesLeft}/>
    </Arrowdiv>}
   <CountWrapper>
    {pagearray.map((count,key)=>{
     return (
            <React.StrictMode key={key}>
           
              <Counttab isactive={count===currentpage?true:false} onClick={()=>{
                 if (count === currentpage) return; // 현재 페이지면 아무 동작 안 함
                setpage(count);
     }
              }>
        {
            count
        }
        </Counttab> 
       
        
            </React.StrictMode>
        )
    })
}
</CountWrapper>
    {currentpage<totalpage&&<Arrowdiv onClick={nexthandler}>
        <FontAwesomeIcon icon={faAnglesRight}/>
        
        </Arrowdiv>}

  {pagearray[4]<totalpage&&<Lastmovediv onClick={()=>{setpage(totalpage)}}>...{totalpage}</Lastmovediv>}
      
    
  

    </PagenationWrapper>)

}