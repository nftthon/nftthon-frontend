import {
  FC,
  useState,
} from 'react';

import {
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useMetaplex } from 'hooks/useMetaplex';
import { PROGRAM_ID } from 'program/config';
import { useForm } from 'react-hook-form';
import { fetchDb } from 'utils/firestore';

import { AnchorProvider } from '@coral-xyz/anchor';
import { toMetaplexFile } from '@metaplex-foundation/js';
import {
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

interface FormProps {
  name: string;
  description: string;
  image: any;
}

interface InputProps {
  id: string;
  openAIBuffer: Buffer;
  isOpenAIUsed: boolean;
}

export const CreateNFT: FC<InputProps> = ({
  id,
  openAIBuffer,
  isOpenAIUsed,
}) => {
  const { metaplex: mx } = useMetaplex();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const programId = new PublicKey(PROGRAM_ID);

  const [nftMintAccount, setNftMintAccount] = useState("");
  const [nftMintAccountStr, setNftMintAccountStr] = useState<string>("");

  const { connection } = useConnection();
  const wallet = useWallet(); 
  const { publicKey } = useWallet();

  const getProvider = () => {
      const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
      return provider;
  }

  async function createNft(data: FormProps) {
    try {
      console.log("NFT create")
      let _mintAddress = null;
      
      let reader = new FileReader();
      let blob: Blob;
      let inputForMetadataImage: any;

      if (isOpenAIUsed) {
        inputForMetadataImage = openAIBuffer;
      } else {
        console.log("from uploaded image")
        blob = new Blob([data.image[0]]);
        reader.readAsArrayBuffer(blob);
        reader.onload = async function (event) {
        const arrayBuffer = reader.result;
        inputForMetadataImage = arrayBuffer;
      }}
{
        const { uri } = await mx
          .nfts()
          .uploadMetadata({
            name: data.name,
            description: data.description,
            image: toMetaplexFile(inputForMetadataImage, data.name),
          });

        const { nft, mintAddress } = await mx
          .nfts()
          .create({
            uri,
            name: data.name,
            sellerFeeBasisPoints: 0,
          })
        console.log("nft", nft)
        console.log("mintAddress", mintAddress)
        _mintAddress = mintAddress
        setNftMintAccount(mintAddress.toString())
      };
      console.log("nftMintAccount: ", nftMintAccount)
      const mintAccountStr = _mintAddress.toString()
      const pubkeyStr = publicKey.toString()
      
      const db = fetchDb();
      await updateDoc(doc(db, "nftMintToArtist", mintAccountStr), {
        artistPubkeyStr: arrayUnion(pubkeyStr)
      })
      await setDoc(doc(db, "nftMintAccountList", id), {
        nftMintAccountStr: mintAccountStr
      })

    } catch (error) {
      console.error(error);
    }
  }

  const onSubmitImage = async (data: FormProps) => {
    await createNft(data);
  };

  if (!wallet.publicKey) {
    return (
      <div className="flex flex-col justify-center items-center mx-auto p-4 text-xl font-bold text-black">
        Wallet Not Connected
      </div>
    );
  }

  return (
    <div className="pl-6 -pt-4 relative flex flex-col justify-center">
      <label className="label">
        <span className="label-text font-bold text-lg md:text-2xl text-d-pink">
          Create NFT based on the created image😀
        </span>
      </label>
      {/* Create NFT */}
      <div>
      <form onSubmit={handleSubmit(onSubmitImage)}>
        <div className="items-center form-control w-full">
          <label className="label">
            <span className="label-text text-black font-bold">Name of NFT</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="input input-bordered w-full text-black bg-slate-200 max-w-xs"
            {...register("name", { required: true })}
          />
          {errors.name && <span>This field is required</span>}
          <label className="label">
            <span className="label-text text-black font-bold">Description of NFT</span>
          </label>
          <input
            type="text"
            name="description"
            id="description"
            className="input input-bordered w-full h-20 max-w-xs text-black bg-slate-200"
            {...register("description", { required: true })}
          />
          {errors.description && <span>This field is required</span>}
          
          <div className="w-full pt-4 md:pt-8">
          <div className="hidden group-disabled:block text-normal">
              Wallet not connected
          </div>
          <div className="pb-4 md:pb-8">
            <button
              className="bg-d-pink hover:bg-pink-700 py-0 px-4 md:px-7 h-10 md:h-12 rounded-full font-bold text-xl md:text-xl text-white"
              type="submit"
            >
              Mint NFT
            </button>
          </div>
            
          </div>
        </div>
      </form>
      </div>
    </div>
  );
};
