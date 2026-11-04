"use client"
import React from 'react'
import { useRouter } from "next/navigation"
import { Onetooneconversationdetails } from "./store"
import { Parmkey } from "./store"
import { Roompicked } from './store'
export default function Navigateonetooneconversation(){
   const router=useRouter()
   const parmkey=Parmkey(s=>s.name)
   const onetooneconversationdetails=Onetooneconversationdetails(s=>s.onetooneconversationdetails)
   const room=Roompicked(s=>s.room)
   React.useEffect(()=>{
    if(parmkey){
        router.push(`/colab/${parmkey}`)
    }
   },[parmkey])
   return(<></>)
}