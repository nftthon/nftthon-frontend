import 'keen-slider/keen-slider.min.css';

import {
  FC,
  useState,
} from 'react';

import { ContestCards } from 'components/ContestCards';
import { CreateImageWithOpenAI } from 'components/CreateImageWithOpenAI';
import { CreateNFT } from 'components/CreateNFT';
import { useKeenSlider } from 'keen-slider/react';
import Link from 'next/link';

import { useWallet } from '@solana/wallet-adapter-react';

export const HomeView: FC<any> = ( { fetchedData } ) => {
  const { publicKey } = useWallet();
  const [openAIBuffer, setOpenAIBuffer] = useState();
  const [sliderRef] = useKeenSlider(
    {
      loop: true,
    },
    [
      (slider) => {
        let timeout
        let mouseOver = false
        function clearNextTimeout() {
          clearTimeout(timeout)
        }
        function nextTimeout() {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 5000)
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on("dragStarted", clearNextTimeout)
        slider.on("animationEnded", nextTimeout)
        slider.on("updated", nextTimeout)
      },
    ]
  )

  return (
    <div className="max-w-7xl sm:mx-auto flex flex-col items-center py-4 md:py-8">
      {/* <div className="text-center text-bold font-bold text-d-pink text-3xl md:text-4xl pb-4 md:pb-8">
        NFT Contests for Everyone
      </div> */}

      <div className="px-4 md:px-8 pt-8  lg:pt-12 grid md:grid-cols-2 gap-6 lg:gap-6">  
        <div className="pr-4 md:pr-8">
          <div className="text-center md:text-left font-bold text-slate-800 text-2xl md:text-3xl xl:text-5xl leading-loose xl:tracking-wide">
            Projects Collect Ideas💡 AND
            Liven Up Community🚀
          </div>
          {/* <div className="pl-2 text-left font-bold text-blue-800 text-lg md:text-xl md:pb-4 pt-2 md:pt-4">
            Anyone can launch an NFT contests.
          </div> */}
          <div className="flex flex-col justify-center items-center pt-6 md:pt-10">
            <Link href="/launch" passHref={true}>
              <button className=" bg-d-pink hover:bg-pink-700 py-0 px-4 md:px-7 h-10 md:h-12 rounded-full font-bold text-xl md:text-xl text-white">
                Launch Contest
              </button>
            </Link>
          </div>
          <div className="text-center md:text-left font-bold text-slate-800 text-2xl md:text-3xl xl:text-5xl pt-8 md:pt-10 xl:pt-32 leading-loose xl:tracking-wide">
            Artists to Demonstrate Talent and Skills👩‍🎨 
          </div>
          <div className="pl-2 text-center md:text-left font-bold text-slate-500 text-lg md-text-xl xl:text-2xl pt-2 md:pt-4 xl:pt-8">
            Generate images with <a href="https://openai.com/dall-e-2/" className="text-bold text-slate-800"> Generative AI Dall-E-2(OpenAI)&nbsp;</a>
            and create NFT all within this app.
          </div>
        </div>
        <div>
          <div className="text-center text-slate-800 font-bold text-2xl md:text-3xl xl:text-5xl leading-loose xl-tracking-wide">
            <p>
              Try creating <span className="text-d-pink">NFT with OpenAI</span> 
            </p>
          </div>
          <div className="mt-4 md:mt-8 flex flex-col text-center justify-center items-center bg-purple-100 rounded-2xl shadow-xl">
            <CreateImageWithOpenAI setOpenAIBuffer={setOpenAIBuffer}/>
            <CreateNFT
            id="id" 
            openAIBuffer={openAIBuffer} 
            isOpenAIUsed = {true}
          /> 
          </div>
        </div>
      </div>
        <div className="pt-8 md:pt-16">
          <div className="flex flex-col justify-center items-center pl-2 text-left
           font-bold text-black text-2xl md:text-3xl pt-2 md:pt-2 pb-4 md:pb-8 xl:text-5xl">
            Join Contest live
          </div> 
          <ContestCards fetchedData={fetchedData}/>
        </div>
      </div>   
  );
};
