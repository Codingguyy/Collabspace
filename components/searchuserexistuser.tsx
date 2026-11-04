"use client"
import { useEffect } from "react"
import Userlistttttt from "./searchuserlist"
import Existuserlist from "./existuserlist"
import { ScrollArea } from "./ui/scroll-area"
import { Searchvalue } from "./store"
import { Userexistlistt } from "./store"
export default function Searchuserexistuser(){
    const value=Searchvalue(s=>s.value)
    const users=Userexistlistt(s=>s.users)
    const message=Userexistlistt(s=>s.message)
    const setmessage=Userexistlistt(s=>s.setmessage)
    useEffect(()=>{
        setmessage(`${users.length} conversations exists`)
    },[users.length])
    return(
        <><ScrollArea className="flex flex-col items-center h-[86.3%] w-[100%]">{!value?<Existuserlist/>:<Userlistttttt/>}</ScrollArea></>
    )
}