"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { Card } from "./ui/card"
import { Field } from "./ui/field"
import { FieldLabel } from "./ui/field"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ArrowBigRight } from "lucide-react"
import { Userlogin } from "./store"
import { Toklue } from './store'
import { UsercurrentId } from './store'
import { Logincount } from './store'
import Loginuser from "@/actions/loginuser"
import Authenticate from "@/actions/authenticate"
import { set } from "@/socketserver/clientsidesocket"
import { on } from "@/socketserver/clientsidesocket"
import toast from 'react-hot-toast'
export default function Login(){
    const router=useRouter()
    const email=Userlogin(s=>s.email)
    const password=Userlogin(s=>s.password)
    const setemail=Userlogin(s=>s.setemail)
    const setpassword=Userlogin(s=>s.setpassword)
    const setoken=Toklue(s=>s.setname)
    const usercurrentid=UsercurrentId(s=>s.name)
    const setusercurrentid=UsercurrentId(s=>s.setname)
    const login=Logincount(s=>s.count)
    const count=Logincount(s=>s.count)
    const setcount=Logincount(s=>s.setcount)
    function handleemail(value:string){
        setemail(value)
    }
    function handlepassword(value:string){
        setpassword(value)
    }
    function handledonthaveanaccount(){
        if(count>3){
            router.push("/register")
        }
        else{
            toast.error(`You have made an ${count} unsuccessfull attempt`)
            setcount(count+1)
        }
    }
    async function handleverify(){
        if(email&&password){
           const response=await Loginuser({name:"",email:email,password:password})
           if(response==="Dont have an Account"){
              handledonthaveanaccount()
           }
           else if(response!=="Error happened during verifying"){
           const token=await Authenticate({email:response?.email,name:response?.name,_id:response?._id})
           setoken(token)
           setusercurrentid(response?._id)
           if(token){
            set("login:request",{token:token,email:email})
            set("request:userrooms:colab",{token:token})
            setcount(0)
           }
           else{
            toast.error("An error occured")
           }
           }
        }
    }
    React.useEffect(()=>{
        on("login/register",(data)=>{
            if(data){
              router.push("/colab")
            }
        })
        on("kick",(value)=>{
            router.push("/colab")
        })
    },[])
    return(
    <Card className="flex flex-col px-3 py-3 m-12 w-[277px] py-12 md:w-[407px] md:py-16 md:px-6 md:m-3 lg:w-[437px] lg:py-6 lg:px-6 lg:m-24">
            <Field>
                <FieldLabel htmlFor="Email" style={{fontFamily:"'Roboto-mono',monospace"}}>Email:</FieldLabel>
                <Input value={email} id="Email" placeholder="Enter ur Email" onChange={(e)=>{e.stopPropagation();handleemail(e.target.value)}}/>
            </Field>
            <Field>
                <FieldLabel htmlFor="Password" style={{fontFamily:"'Roboto-mono',monospace"}}>Password</FieldLabel>
                <Input value={password} id="Password" placeholder="Enter ur Password" onChange={(e)=>{e.stopPropagation();handlepassword(e.target.value)}}/>
            </Field>
            <Button variant={"outline"} className="text-primary w-[137px]" style={{fontFamily:"'Roboto-mono',monospace"}} onClick={(e)=>{e.stopPropagation();handleverify()}}>Verify</Button>
            <Field orientation={"horizontal"}>
                <FieldLabel htmlFor="Donthaveanaccount" style={{fontFamily:"'Roboto-mono',monospace"}}>Don't have an account?</FieldLabel>
                <Button id="Donthaveanaccount" variant={"outline"} className="text-primary w-[107px] md:w-[167px]" style={{fontFamily:"'Roboto-mono',monospace"}}>Register <ArrowBigRight size={17} color="black"/></Button>
            </Field>
            </Card>)
}