import React from "react";



    export function getsky(data){
        //console.log("sky데이터가공")
        let sky="";
        switch(data){
           

            case "1":
               // console.log(dates.sky)
               sky="맑음";
                break;
           
            case "3":
            sky="구름맑음"
                  break;
    
            case "4":
             //   console.log("음")
                sky="흐림"
                break;
            }
            return sky;
    }
    export function getpty(data){
        //console.log("pty데이터가공")
        let pty="";
        switch(data){
            
            case "0":
               pty="없음";
                break;
           
            case "1":
                pty="비";
                  break;
    
            case "2":
                //console.log("음")
                pty="비/눈";
                break;
            case "3":
                  //  console.log(dates.sky)
                    pty="눈";
                    break;
               
            case "5":
                pty="빗방울";
                      break;
        
            case "6":
                 //   console.log("음")
                    pty="빗방울,눈날림";
                    break;
             case "7":
                     //   console.log("음")
                        pty="눈날림";
                        break;
            }
            return pty;
    }
