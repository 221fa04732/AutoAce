import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import Icon from "./icon";

export default function Header(){
  return(<nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
    <div className="w-11/12 flex justify-between items-center text-sm">
      <div className="flex gap-5 items-center text-lg font-bold">
        <Link href={"/"} className="flex gap-1 justify-center items-center text-blue-400"><Icon />AutoAce Dashboard</Link>
      </div>
      <div className="flex gap-2">
        <ThemeSwitcher />
        {!hasEnvVars ? (
          <EnvVarWarning />
        ) : (
          <Suspense>
            <AuthButton />
          </Suspense>
        )}
      </div>
    </div>
  </nav>
)}