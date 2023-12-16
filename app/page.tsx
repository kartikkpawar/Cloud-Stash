import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <div className="flex flex-col lg:flex-row items-center bg-[#1e1919] dark:bg-slate-800">
        <div className="p-10 flex flex-col bg-[#2B2929] dark:bg-slate-800 text-white space-y-5">
          <h1 className="text-5xl font-bold">
            Welcome to Cloud Stash <br />
            Storing everthing for youu and your business needs. All in one place
          </h1>
          <p className="pb-20">
            Enhance your personal storage with Cloud Stash, offering a simple
            and efficient way to upload, organize, and access files from
            anywhere. Securely store important documents and media, and
            experience the convinience if easy file management and sharing in
            the centralized solution
          </p>
          <Link
            href="/dashboard"
            className="flex cursor-pointer bg-blue-500 p-5 w-fit"
          >
            Try it for free <ArrowRight className="ml-10" />
          </Link>
        </div>
        <div className="bg-[#1e1919] dark:bg-slate-800 h-full p-10">
          <video autoPlay loop muted className="rounded-lg">
            <source
              src="https://aem.dropbox.com/cms/content/dam/dropbox/warp/en-us/dropbox/dbx1-hero-1920x1080-en_GB.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    </main>
  );
}
