import Icon from "./icon";
import Link from "next/link";

export function Hero() {
  return (<div className="w-11/12  flex flex-col items-center justify-center">
    <div className="flex justify-center items-center mt-12">
      <div className="flex items-center text-2xl font-bold">
        <div className="flex gap-1 justify-center items-center text-blue-400"><Icon />AutoAce</div>
      </div>
    </div>
    <div className="text-5xl font-bold mt-12">AI agents for car dealerships </div>
    <Link href={'/dashboard'} className="mt-12 mb-32 border-2 border-blue-700 bg-blue-400 px-8 py-3 rounded-xl text-xl text-black font-bold hover:bg-blue-300 hover:">Get Started ➛</Link>
  </div>
)}