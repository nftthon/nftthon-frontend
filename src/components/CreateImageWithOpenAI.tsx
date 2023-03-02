import {
  FC,
  useState,
} from 'react';

import { useMetaplex } from 'hooks/useMetaplex';
import Image from 'next/image';
import { useForm } from 'react-hook-form';

import { toMetaplexFile } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';

interface FormProps {
  prompt: string;
}

export const CreateImageWithOpenAI: FC<any> = ( { setOpenAIBuffer } ) => {
  const [imageUrl, setImageUrl] = useState("/monkey-coder.png");
  const { publicKey } = useWallet();
  const { metaplex: mx } = useMetaplex();
  const wallet = useWallet();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (submittedData: FormProps) => {
    console.log("prompt: ", submittedData.prompt)
    const response = await fetch(`/api/createBufferImage?prompt=${submittedData.prompt}`, {
    });
    console.log("response: ", response)
    const data = await response.json();
    setOpenAIBuffer(data.buffer);
    
    const { uri, metadata } = await mx
      .nfts()
      .uploadMetadata({
        name: "test",
        description: "test",
        image: toMetaplexFile(data.buffer, "test.png"),
      });
      setImageUrl(metadata.image);
  };

  if (!wallet.publicKey) {
    return (
      <div className="mx-auto md:hero">
        <div className="flex flex-col md:hero-content">
          <h1 className="text-center text-2xl font-bold text-black">  
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6">
      <div className="pt-4 flex items-center flex-col justify-center">
        <form onSubmit={handleSubmit(onSubmit)} className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold text-lg text-d-pink">
              Key in your prompt 😀
              </span>
          </label>
          <input
            type="text"
            name="prompt"
            id="prompt"
            className="mt-4 input input-bordered w-full h-20 text-black bg-slate-200"
            {...register("prompt", { required: true })}
          />
          {errors.name && <span>This field is required</span>}
          <div className='pt-4 md:pt-8 text-center'>
            <button
            // consider adding "animate-pulse" below for hackathon to show off
                // className="max-w-xs btn btn-primary w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500"
                className="bg-d-pink hover:bg-pink-700 py-0 px-4 md:px-7 h-10 md:h-12 rounded-full font-bold text-xl md:text-xl text-white"
                type="submit"
              >
                Create Image!
            </button>
          </div>   
        </form>
        <div className="flex justify-center py-4 lg:py-8">
          <Image src={imageUrl} width={300} height={300} unoptimized={true} 
            className="rounded-3xl w-full h-full object-cover object-center"></Image>
        </div>
      </div>
    </div>
  );
};
