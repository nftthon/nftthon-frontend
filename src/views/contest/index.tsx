import {
  FC,
  useState,
} from 'react';

import { CreateImageWithOpenAI } from 'components/CreateImageWithOpenAI';
import { CreateNFTAndSubmit } from 'components/CreateNFTAndSubmit';

import { useWallet } from '@solana/wallet-adapter-react';

interface ContestViewProps {
    id: string,
    titleOfContest: string,
    prizeAmount: number,
    createdAt: number,
    descriptionOfContest: string,
    linkToYourProject: string,
    percentageToArtist: number,
    submitEndAt: number,
}

export const ContestView: FC<ContestViewProps> = ({
  id, 
  titleOfContest,
  prizeAmount,
  createdAt,
  descriptionOfContest,
  linkToYourProject,
  percentageToArtist,
  submitEndAt,
}) => {
  const [openAIBuffer, setOpenAIBuffer] = useState();
  const [isOpenAIUsed, setIsOpenAIUsed] = useState(true);
  const [imageUrl, setImageUrl] = useState("")
  const wallet = useWallet(); 

  if (!wallet.publicKey) {
    return (
      <div className="mx-auto p-4 md:hero">
        <div className="flex flex-col md:hero-content">
          <h1 className="text-center text-black text-2xl font-bold">
            Wallet Not Connected
          </h1>
          
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col relative max-w-5xl min-h-screen mx-auto p-4 mt-4 justify-center bg-transparent">
      <div className="text-center flex flex-col mt-6">
        <div key={id} className="card card-bordered border-0 bg-purple-100 shadow-xl mx-2 flex-1">
          <h1 className="text-d-pink text-center text-3xl font-bold mt-4">
            Info
          </h1>
          <div className="card-body flex flex-col space-y-2 -mt-2">
            <h2 className="card-title text-center text-4xl font-bold text-slate-700 flex-1">{titleOfContest}</h2>
            <h2 className="card-content text-slate-700 text-left text-2xl flex-1 font-bold">
              <span className="font-normal text-slate-500">Prize:</span> {prizeAmount} SOL (For Artist: {prizeAmount*percentageToArtist/100} SOL)</h2>
            <h2 className="card-content text-slate-700 text-left text-2xl flex-1 font-bold">
              <span className="font-normal text-slate-500">Description: </span>{descriptionOfContest}</h2>
            <h2 className="card-content text-slate-700 text-left text-2xl flex-1 font-bold">
              <span className="font-normal text-slate-500">Held by: </span>{linkToYourProject}</h2>
            <h2 className="card-content text-slate-700 text-left text-2xl flex-1 font-bold">
            <span className="font-normal text-slate-500">Starts at: </span>
              {new Date(createdAt).toLocaleDateString()}&nbsp; 
              {new Date(createdAt).toLocaleTimeString()}
            </h2>
            <h2 className="card-content text-slate-800 text-left text-2xl flex-1 font-bold">
            <span className="font-normal text-slate-500">Starts at: </span>
              {new Date(submitEndAt).toLocaleDateString()}&nbsp; 
              {new Date(submitEndAt).toLocaleTimeString()}
            </h2>
          </div>
        </div>     
      </div>

      <div className='mt-4 mx-2 rounded-3xl shadow-xl bg-purple-100'>
        <div className="pt-6 text-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" onChange={event => setIsOpenAIUsed(!isOpenAIUsed)} className="sr-only peer"/>
          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-slate-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-500"></div>
          <span className="ml-3 text-sm font-medium text-slate-700">Wanna submit your handwork instead of AI generated art?</span>
        </label>
      </div>
        <h1 className="pt-6 text-center text-d-pink text-3xl font-bold ">
          Create your image with Open AI
        </h1>
        {isOpenAIUsed && <CreateImageWithOpenAI setOpenAIBuffer={setOpenAIBuffer}/>}
      </div>
      <div className='pt-4 mt-4 mx-2 rounded-3xl shadow-xl bg-purple-100'>
        <h1 className="text-center text-d-pink font-bold text-3xl">
          Create NFT (from above AI image) and Submit
        </h1>

        <div className="flex flex-col text-center">  
          <div className="text-center flex-auto justify-center pb-6">
            <CreateNFTAndSubmit 
              id={id} 
              openAIBuffer={openAIBuffer} 
              isOpenAIUsed={isOpenAIUsed}
              /> 
          </div>
        </div>
      </div> 
    </div>
  );
};