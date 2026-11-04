"use client"
import { useEffect } from "react"
import { set } from "@/socketserver/clientsidesocket"
import { Toklue } from "./store"
export default function Colabactivity(){
    const toklue=Toklue(s=>s.name)
  useEffect(()=>{
    const interval=setInterval(()=>{
        set("request:activity:colab",{token:toklue})
        set("request:alldocuments:colab",{token:toklue})
        set("request:online:colab",{token:toklue})
    },3000)
    return ()=>clearInterval(interval)
  },[])
  return <></>
}