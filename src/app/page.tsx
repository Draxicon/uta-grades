import Head from "next/head";
import { Poppins, Montserrat } from 'next/font/google';
import SearchBar from "./components/SearchBar";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'], // Specify weights you need
  variable: '--font-poppins',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-montserrat',
});

export default function Home() {
  return (
    <>
      <Head>
        <title>UTA Grades</title>
      </Head>
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-[#003B66] via-[#2B5198] to-[#B56A2A] text-white">
      {/*Pending permission from UTA to use UTA logo: <h1 className="text-6xl mb-6 tracking-wide text-center">
        <span className={`${poppins.className} font-black text-[#0064B1]`}>
          UT
          <span className="inline-block align-middle -mt-2">
            <Image
              src="/assets/UTA.png"
              alt="UTA logo"
              width={49}
              height={49}
            />
          </span>
        </span>
        <span className={`${montserrat.className} text-gray-300 ml-2`}>
          GRADES
        </span>
      </h1> */}
        <h1 className="text-6xl mb-6 tracking-wide text-center">
          <span className={`${poppins.className} font-extrabold text-gray-300`}>UTA </span>
          <span className={`${montserrat.className} font-light text-gray-300`}>GRADES</span>
        </h1>
        <p className="text-lg text-center text-gray-200 mb-8 max-w-lg">
          Learn from your previous peers. See how they did! It&apos;s free and accessible for all UTA students.
        </p>
        <div className="w-full max-w-md">
          <SearchBar />
        </div>
        <p className="mt-8 text-sm text-gray-300 text-center">
          Enjoy your course registration experience!
        </p>
        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400">
          © 2024 ACM @ UT Arlington. All rights reserved.
        </div>
      </div>
    </>
  );
}
