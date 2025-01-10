import React from "react";
import Admincheck from "./Admincheck";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute=()=>{
    
    return Admincheck() ?<Outlet/>:<Navigate to="/noaccess"/>
}