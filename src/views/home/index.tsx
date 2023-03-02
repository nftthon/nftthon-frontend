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
      <div className="text-center text-bold font-bold text-d-pink text-3xl md:text-4xl pb-4 md:pb-8">
        Decentralized NFTthon (NFT Contest) Platform
      </div>
      {/* <div ref={sliderRef} className="keen-slider w-full h-full object-cover object-center">
        <div className="keen-slider__slide number-slide1">
          <Image src="/dogInSpace.png" width={300} height={200} loading="lazy" alt="solana city" className="object-cover object-center" />
        </div>
        <div className="keen-slider__slide number-slide2">
          <Image src="/cypher-dog.png" width={300} height={300} loading="lazy" alt="solana city" className="w-full h-full object-cover object-center" />
        </div>
      </div> */}
      <div className="pt-8 lg:pt-12 grid md:grid-cols-2 gap-6 lg:gap-6">  
        <div className="mx-6 ">
          <div className="text-left font-bold text-black text-2xl md:text-3xl pb-4 md:pb-8">
            Projects to collect ideas from their community💡
          </div>
          <div className="pl-2 text-left font-bold text-blue-800 text-lg md:text-xl md:pb-4">
            Any project/person can host an NFTthon to enahance engagement from artists and the community members. 
          </div>
          <div className="pt-4 md:pt-6">
            <Link href="/launch">
              {/* <button className="bg-blue-600 hover:bg-blue-700 py-0 px-3 mb:px-4 lg:px-6 h-9 sm:h-9 md:h-10 xl:h-12 rounded-full font-bold text-white"> */}
              <button className="bg-d-pink hover:bg-pink-700 py-0 px-4 md:px-7 h-10 md:h-12 rounded-full font-bold text-xl md:text-xl text-white">
                Launch Contest
              </button>
            </Link>
          </div>
          <div className="text-left font-bold text-black text-2xl md:text-3xl pt-8 md:pt-10 lg:pt-16">
            Artists to contribute more👩‍🎨 
          </div>
          <div className="pl-2 text-left font-bold text-blue-800 text-lg md-text-xl pt-2 md:pt-4">
            Create images with <a href="https://openai.com/dall-e-2/" className="text-bold text-blue-500"> Generative AI Dall-E-2(OpenAI)&nbsp;</a>
            and create NFT within this app.
          </div>
          <div className="pl-2 text-left font-bold text-blue-800 text-lg md-text-xl pt-2 md:pt-2">
            Join Contest live
          </div> 
        </div>
        <div>
          <div className="px-6 text-left text-black font-bold text-2xl md:text-3xl">
            <p>
              Try creating NFT with OpenAI
            </p>
          </div>
          <div className="mt-4 md:mt-8 flex flex-col text-center bg-purple-100 rounded-2xl shadow-xl">
            <CreateImageWithOpenAI setOpenAIBuffer={setOpenAIBuffer}/>
              <div className="text-center flex-auto justify-center">
                <CreateNFT
                id="id" 
                openAIBuffer={openAIBuffer} 
                isOpenAIUsed = {true}
              /> 
            </div>
          </div>
        </div>
      </div>
        <div> 
        {/* <div className="grid md:grid-cols-1"> */}
          {/* <div className="overflow-hidden text-center">
            <div ref={sliderRef} className="keen-slider">
              <div className="keen-slider__slide number-slide1">
                <Image src="/robot.png" width={300} height={300} loading="lazy" alt="solana city" className="w-full h-full object-cover object-center" />
              </div>
              <div className="keen-slider__slide number-slide1">
                <Image src="/cypher-dog.png" width={300} height={300} loading="lazy" alt="solana city" className="w-full h-full object-cover object-center" />
              </div>
           </div>
        </div> */}
        {/* </div> */}
        
      {/* </div>

      <div className='mt-4 md:mt-8 text-center pb-6'>
        <div className="mb-10 md:mb-16">
          <h2 className=" text-gray-900 text-3xl lg:text-4xl font-bold text-center mb-4 md:mb-6">
            Join NFTthon live now:
          </h2>
          {/*  <p className="max-w-screen-md text-gray-500 md:text-lg text-center mx-auto">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text but is random or otherwise generated.</p>*/}
        </div> 
        <div className="pt-8 md:pt-16">
          <ContestCards fetchedData={fetchedData}/>
        </div>
        
      </div>   
  );
};
