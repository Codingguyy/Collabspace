"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
export default function Mainpage(){
    const router=useRouter()
 useEffect(()=>{
    router.push("/register")
 },[])
}