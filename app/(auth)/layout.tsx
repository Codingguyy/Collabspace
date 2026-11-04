import Image from "next/image";
import Backgroundimage from "@/images/Gemini_Generated_Image_x8g49gx8g49gx8g4.png"

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      
     
      <Image
        src={Backgroundimage}
        alt="Background"
        fill
        className="object-cover -z-10"
        priority
      />

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}