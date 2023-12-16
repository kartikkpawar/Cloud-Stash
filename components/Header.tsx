import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Themetoggler from "./ThemeToggler";
import { UploadCloud } from "lucide-react";

function Header() {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <div className="bg-[#0160FE] p-2">
          <UploadCloud size={30} className="text-white" />
        </div>
        <h1 className="font-bold text-xl">Cloud Stash</h1>
      </Link>
      <div className="flex justify-between px-5 space-x-2 items-center">
        <Themetoggler />
        <UserButton afterSignOutUrl="/" />
        <SignedOut>
          <SignInButton afterSignInUrl="/dashboard" mode="modal" />
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
