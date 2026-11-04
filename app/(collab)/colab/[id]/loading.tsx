import { Spinner } from "@/components/ui/spinner";
export default async function Loading(){
  return(<div className="h-screen w-screen flex items-center justify-center"><Spinner className="h-14 w-14"/></div>)
}