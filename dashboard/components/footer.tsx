import Link from "next/link"
import Icon from "./icon"

export default function Footer(){
  return(<footer className="w-11/12">
    <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
    <div className="flex flex-col gap-5 items-center justify-between text-lg font-bold my-12">
      <Link href={"/"} className="flex gap-1 justify-center items-center text-blue-400"><Icon />AutoAce Dashboard</Link>
      <div className="text-xs text-gray-500">© 2025 AutoAce. All rights reserved.</div>
    </div>
  </footer>
)}