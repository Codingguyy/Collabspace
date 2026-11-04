"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Field } from "./ui/field";
import { FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowBigRight } from "lucide-react";
import { Userregister } from "./store";
import { Toklue } from "./store";
import { UsercurrentId } from "./store";
import Registerr from "@/actions/register";
import Loginuser from "@/actions/loginuser";
import Authenticate from "@/actions/authenticate";
import Checkusername from "@/actions/checkusername";
import Checkuseremail from "@/actions/checkuseremail";
import { set } from "@/socketserver/clientsidesocket";
import { on } from "@/socketserver/clientsidesocket";
import toast from "react-hot-toast";
export default function Register(){
    const router=useRouter()
    const name=Userregister(s=>s.name)
    const email=Userregister(s=>s.email)
    const password=Userregister(s=>s.password)
    const setemail=Userregister(s=>s.setemail)
    const setpassword=Userregister(s=>s.setpassword)
    const setname=Userregister(s=>s.setname)
    const setoken=Toklue(s=>s.setname)
    const setusercurrentid=UsercurrentId(s=>s.setname)
    function handleemail(value:string){
        setemail(value)
    }
    function handlepassword(value:string){
        setpassword(value)
    }
    function handlename(value:string){
        setname(value)
    }
    async function handleregister(){
            const message=await Registerr({name:name,password:password,email:email})
            if(message!=="Already login"&&message!=="Error Registering"&&message!=="Email already in use"&&message!=="Username already taken"){
            const response=await Loginuser({name:name,email:email,password:password})
            if(response==="Dont have an Account"){
                router.push("/register")
            }
            else if(response!=="Error happened during verifying"){
            console.log("second condition passed")
            const token=await Authenticate({name:name,_id:response?._id,email:response?.email})
            setoken(token)
            console.log(token,"token")
            setusercurrentid(response?._id)
            set("register:request",{token:token,name:name,email:email,_id:response?._id})
            }
            else{
              toast.error("Error happened during Registering")
            }
            }
            else if(message==="Already login"){
            router.push("/login")
        }
         else if(message==="Username already taken"){
            toast.error(`${name} is already taken`)
         }
         else if(message==="Email already in use"){
            toast.error(`${email} is already in use`)
         }
        else if(message==="Error Registering"){
            toast.error("Error happened during Registering")
        }
    }
         
    useEffect(()=>{
       on("login/register",(value)=>{
        if(value){
            router.push("/colab")
        }
        on("navigate",(value)=>{
            router.push("/colab")
        })
       })
       on("kick",(value)=>{
        router.push("/colab")
       })
    },[])
    return(
    <Card className="flex flex-col px-3 py-3 m-12 w-[277px] py-12 md:w-[407px] md:py-16 md:px-6 md:m-3 lg:w-[437px] lg:py-6 lg:px-6 lg:m-24">
            <Field>
                <FieldLabel htmlFor="Name" style={{fontFamily:"'Roboto-mono',monospace"}}>Name:</FieldLabel>
                <Input value={name} id="Name" placeholder="Enter ur Name" onChange={(e)=>{e.stopPropagation();handlename(e.target.value)}}/>
            </Field>
            <Field>
                <FieldLabel htmlFor="Email" style={{fontFamily:"'Roboto-mono',monospace"}}>Email:</FieldLabel>
                <Input value={email} id="Email" placeholder="Enter ur Email" onChange={(e)=>{e.stopPropagation();handleemail(e.target.value)}}/>
            </Field>
            <Field>
                <FieldLabel htmlFor="Password" style={{fontFamily:"'Roboto-mono',monospace"}}>Password</FieldLabel>
                <Input value={password} id="Password" placeholder="Enter ur Password" onChange={(e)=>{e.stopPropagation();handlepassword(e.target.value)}}/>
            </Field>
            <Button variant={"outline"} className="text-primary w-[137px]" style={{fontFamily:"'Roboto-mono',monospace"}} onClick={(e)=>{e.stopPropagation();handleregister()}}>Verify</Button>
            <Field orientation={"horizontal"}>
                <FieldLabel htmlFor="Donthaveanaccount" style={{fontFamily:"'Roboto-mono',monospace"}}>Don't have an account?</FieldLabel>
                <Button id="Donthaveanaccount" variant={"outline"} className="text-primary w-[107px] md:w-[167px]" style={{fontFamily:"'Roboto-mono',monospace"}}>Register <ArrowBigRight size={17} color="black"/></Button>
            </Field>
            </Card>)
}