import {
  FC,
  useState,
} from 'react';

import { useMetaplex } from 'hooks/useMetaplex';
import { useForm } from 'react-hook-form';

import {
  Nft,
  toMetaplexFile,
} from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';

interface FormProps {
  name: string;
  description: string;
  image: any;
}

export const CreateMetaplexNFT: FC = ({}) => {
  const { metaplex: mx } = useMetaplex();
  const wallet = useWallet();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [nft, setNft] = useState<Nft>(null);

  async function createNft(data: FormProps) {
    try {
      let reader = new FileReader();
      const fileData = new Blob([data.image[0]]);
      reader.readAsArrayBuffer(fileData);
      reader.onload = async function (event) {
        const arrayBuffer = reader.result;

        const { uri, metadata } = await mx
          .nfts()
          .uploadMetadata({
            name: data.name,
            description: data.description,
            image: toMetaplexFile(arrayBuffer, data.name),
          });

        const { nft } = await mx
          .nfts()
          .create({
            uri,
            name: data.name,
            sellerFeeBasisPoints: 0,
          })
        console.log(nft)
      };
    } catch (error) {
      console.error(error);
    }
  }

  const onSubmit = async (data: FormProps) => {
    await createNft(data);
  };

  if (!wallet.publicKey) {
    return (
      <div className="mx-auto p-4 md:hero">
        <div className="flex flex-col md:hero-content">
          <h1 className="bg-gradient-to-tr from-[#9945FF] to-[#14F195] bg-clip-text text-center text-5xl font-bold text-transparent">
            Wallet Not Connected
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 md:hero">
      <div className="flex flex-col">
        {/* Create NFT */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="input input-bordered w-full max-w-xs"
              {...register("name", { required: true })}
            />
            {errors.name && <span>This field is required</span>}
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <input
              type="text"
              name="description"
              id="description"
              className="input input-bordered w-full max-w-xs"
              {...register("description", { required: true })}
            />
            {errors.description && <span>This field is required</span>}
            <label className="label">
              <span className="label-text">Image</span>
            </label>
            <input
              type="file"
              name="image"
              id="image"
              className="input input-bordered w-full max-w-xs"
              accept="image/jpeg, image/png, image/jpg"
              {...register("image", { required: true })}
            />
            {errors.image && <span>This field is required</span>}
            <div className="w-full pt-2">
            <div className="hidden group-disabled:block">
                    Wallet not connected
                </div>
              <button
                className="btn btn-primary w-full animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 "
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
