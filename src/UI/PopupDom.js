import { ReactDOM } from "react-dom";

const PopupDom=({children})=>{
    const el=document.getElementById('popupDom');
    return ReactDom.createPotal(children,el);
};

export default PopupDom;