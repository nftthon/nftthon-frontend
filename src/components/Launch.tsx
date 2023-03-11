import {
  FC,
  useState,
} from 'react';

import {
  doc,
  setDoc,
} from 'firebase/firestore';
import { useMetaplex } from 'hooks/useMetaplex';
import { PROGRAM_ID } from 'program/config';
import { useForm } from 'react-hook-form';
import { fetchDb } from 'utils/firestore';

import {
  AnchorProvider,
  BN,
  Program,
  utils,
  web3,
} from '@coral-xyz/anchor';
import { toMetaplexFile } from '@metaplex-foundation/js';
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  PublicKey,
  SystemProgram,
} from '@solana/web3.js';

import {
  PRIZE_TOKEN_MINT_ADDRESS,
  VEC_SIZE_OF_VEC_SIZE_FOR_CONTEST_ACCOUNT,
} from '../../constants';
import { IDL } from '../program/idl2';
import { notify } from '../utils/notifications';

interface FormProps {
  linkToYourProject: string;
  image: File;
  titleOfContest: string;
  prizeTokenMintInput: string;
  prizeRawAmount: number;
  percentageToArtist: number;
  contestEndAtInput: number;
}

export const Launch: FC = () => {
    const [isOpenAIUsed, setIsOpenAIUsed] = useState(false);
    const { metaplex: mx } = useMetaplex();
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();

    const programId = new PublicKey(PROGRAM_ID);
    const [descriptionOfContest, setDescriptionOfContest] = useState('');

    const handleDescriptionOfContestChange = (event): void => {
      const newInput = event.target.value;
      setDescriptionOfContest(newInput);
    }
    let prizeTokenMintInput = PRIZE_TOKEN_MINT_ADDRESS;
    let counterPda = null;
    let _counterBump = null;
    let contestPda = null;
    let _contestBump = null;
    let prizeVaultPda = null;
    let _prizeVaultBump = null;
    let nftMintAccount = null;
    let contestId = null;

    const { connection } = useConnection();
    const wallet = useAnchorWallet(); 
    const { publicKey } = useWallet();

    const getProvider = () => {
        const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
        return provider;
    }
  
    const onSubmit = async (data: FormProps) => {
      if (!publicKey) {
          notify({ type: 'error', message: `Wallet not connected!` });
          console.log('error', `Send Transaction: Wallet not connected!`);
          return;
      }

      try {
        const provider = getProvider();
        const program = new Program(IDL, PROGRAM_ID, provider);

        const prizeAmount = new BN(data.prizeRawAmount*10**2); //todo: to be able to set digits by fetching data from token mint account

        [counterPda, _counterBump] = PublicKey.findProgramAddressSync([utils.bytes.utf8.encode("counter")], programId);
        const counterAccount = await program.account.counter.fetch(counterPda);
        
        let contestCount = counterAccount.contestCount;
        
        console.log("counterPda: ", counterPda.toBase58());
        console.log("contestCount: ", contestCount.toNumber());
        console.log("isInitialized: ", counterAccount.isInitialized);
        console.log("prizeTokenMintInput: ", data.prizeTokenMintInput);
        
        [contestPda, _contestBump] = PublicKey.findProgramAddressSync([Buffer.from("contest"), 
          publicKey.toBuffer(),
          Buffer.from(utils.bytes.utf8.encode((contestCount.toNumber()).toString()))
      ], programId);
        
        const prizeTokenMint = new PublicKey(data.prizeTokenMintInput);

        [prizeVaultPda, _prizeVaultBump] = PublicKey.findProgramAddressSync(
          [Buffer.from(utils.bytes.utf8.encode("prize_vault")),  
          publicKey.toBuffer(),
          Buffer.from(utils.bytes.utf8.encode((contestCount.toNumber()).toString()))
          ], program.programId);

        const contestOwnerPrizeTokenAccount = await getAssociatedTokenAddress(prizeTokenMint, publicKey);
        
        const nowUnixTime = new Date().getTime();
        console.log("now_unixtime", nowUnixTime);
        const contestEndAt = Date.parse(data.contestEndAtInput.toString())
        console.log("contestEndAt: ", contestEndAt);

        // Constants
        const submitStartAt = new BN(nowUnixTime);
        const submitEndAt = new BN(contestEndAt);
        const voteStartAt = new BN(nowUnixTime);
        let voteEndAt = new BN(contestEndAt);
        const vecSize = VEC_SIZE_OF_VEC_SIZE_FOR_CONTEST_ACCOUNT;
        console.log("prizeAmount: ", prizeAmount.toNumber());

        const tx = await program.methods.launch(
          prizeAmount,
          data.percentageToArtist as number,
          submitStartAt,
          submitEndAt,
          voteStartAt,
          voteEndAt,
          vecSize,
        ).accounts(
        {
          contestOwner: publicKey,
          counter: counterPda,
          contest: contestPda,
          prizeMint: prizeTokenMint,
          prizeVaultAccount: prizeVaultPda,
          prizeTokenAccount: contestOwnerPrizeTokenAccount,
          rent: web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

        console.log("Sent! Signature: ", tx);

        const counterAccountAfterTransaction = await program.account.counter.fetch(counterPda);
        const contestCountAfterTransaction = counterAccountAfterTransaction.contestCount;
        console.log(contestCountAfterTransaction);

        let contestData: ContestData = {
          contestId: contestPda,
          createdAt: Date.now(),
          contestAccount: contestPda.toString(),
          contestOwner: publicKey.toString(),
          titleOfContest: data.titleOfContest,
          linkToYourProject: data.linkToYourProject,
          descriptionOfContest: descriptionOfContest,
          prizeTokenMint: prizeTokenMint.toString(),
          prizeRawAmount: data.prizeRawAmount,
          percentageToArtist: data.percentageToArtist,
          submitEndAt: submitEndAt.toNumber(),
          nftMintAccount: "",
        }
        
        let reader = new FileReader();
        const fileData = new Blob([data.image[0]]);
        reader.readAsArrayBuffer(fileData);
        reader.onload = async function (event) {
          const arrayBuffer = reader.result;

          console.log("file name: ", data.image[0].name)
          console.log("URI: ", toMetaplexFile(arrayBuffer, data.image[0].name))

          const { metadata, uri } = await mx
            .nfts()
            .uploadMetadata({
              name: data.titleOfContest,
              description: descriptionOfContest,
              image: toMetaplexFile(arrayBuffer, data.image[0].name),
              external_url: data.linkToYourProject
            });
            console.log("metadata:", metadata)
            console.log("uri; ", uri)

          const { nft, mintAddress } = await mx
            .nfts()
            .create({
              uri: uri,
              name: data.titleOfContest,
              sellerFeeBasisPoints: 250,
              tokenOwner: publicKey,
            })
            nftMintAccount = mintAddress;
            console.log("nft: ", nft)
            console.log("nftMintAccount: ", nftMintAccount)
            console.log("mint address: ", mintAddress.toString())

            contestData.contestId = contestPda.toString();
            contestData.nftMintAccount = nftMintAccount.toString()

            const db = fetchDb();
            await setDoc(doc(db, "contestData", contestData.contestId), {
              contestData
              })

            await setDoc(doc(db, "nftMintAccountList", contestData.contestId), {
              })
        }
        
          } catch (error: any) {
              console.log("Transaction Error: ", error);
          }
      };
      
      return (
        <div className='max-w-7xl sm:mx-auto rounded-2xl bg-purple-100 shadow-lg'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="pt-4 px-6 lg:px-20 flex flex-col flex-1">
              <div className='flex flex-col flex-1 pb-3 justify-center items-center space-y-1'>
                <label className="label text-center">
                  <span className="label-text text-center text-slate-800 font-bold xl:text-lg">Title of contest (less than 32 letters)</span>
                </label>
                <input 
                  type="text"
                  name="titleOfContest"
                  id="titleOfContest"
                  placeholder="Solana Grizzlython NFT Contest" 
                  className="w-full bg-slate-200 text-black rounded-full"
                  {...register("titleOfContest", { required: true })}
                />
                  {errors.titleOfContest && <span>This field is required</span>}
              </div>

              {!isOpenAIUsed && 
              <div className='flex flex-col flex-1 pb-3 justify-center items-center'>
                <label className="label">
                  <span className="label-text text-slate-800 font-bold xl:text-lg">Upload Logo for Your Contest</span>
                </label>
                <input 
                  type="file"
                  name="image"
                  id="image"
                  className="input input-bordered text-slate-500 w-full max-w-xs bg-slate-200
                  file:mr-4 file:py-2 file:px-4 file:mt-1
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-100 file:text-pink-500
                  hover:file:bg-violet-100"
                  accept="image/jpeg, image/png, image/jpg" 
                  {...register("image", { required: true })}
                />
                  {errors.image && <span>This field is required</span>}
              </div>
              }

              <div className='flex flex-col flex-1 pb-3 justify-center items-center space-y-1'>
                <label className="label">
                  <span className="label-text text-center text-slate-800 font-bold xl:text-lg">Your Project Name or Link to Your Website</span>
                </label>
                <input type="text" 
                  name="linkToYourProject" 
                  id="LinkToYourProject" 
                  placeholder="https://www.solana.com or solana" 
                  className="w-full bg-slate-200 text-black rounded-full"
                  {...register("linkToYourProject", { required: true })}
                />
                {errors.linkToYourProject && <span>This field is required</span>}
              </div>
              
              <div className='flex flex-col flex-1 pb-3 justify-center items-center space-y-1'>
                <label className="label text-center">
                  <span className="label-text text-center text-slate-800 font-bold xl:text-lg">Prize Token Mint Address</span>
                </label>
                <input 
                  type="text"
                  name="prizeTokenMintInput"
                  id="prizeTokenMintInput"
                  placeholder="hfkjeriofhffoerfjd3628jhfd" 
                  className="w-full bg-slate-200 text-black rounded-full"
                  {...register("prizeTokenMintInput", { required: true })}
                  />
                  {errors.prizeTokenMintInput && <span>This field is required</span>}
              </div>
              
              <div className='flex flex-col flex-1 pb-3 justify-center items-center space-y-1'>
                <label className="label text-center">
                  <span className="label-text text-center text-slate-800 font-bold xl:text-lg">Prize Amount</span>
                </label>
                <input 
                  type="text"
                  name="prizeRawAmount"
                  id="prizeRawAmount"
                  placeholder="number of tokens for prize" 
                  className="max-w-sm w-full bg-slate-200 text-black rounded-full"
                  {...register("prizeRawAmount", { required: true })}
                  />
                  {errors.prizeRawAmount && <span>This field is required</span>}
              </div>

              <div className='flex flex-col flex-1 pb-3 justify-center items-center space-y-1'>
                <label className="label">
                  <span className="label-text text-slate-800 font-bold xl:text-lg">Percentage to Artist</span>
                </label>
                <input 
                  type="text"
                  name="percentageToArtist"
                  id="percentageToArtist"
                  placeholder="90% (Set beween 0 to 100%)" 
                  className="max-w-sm w-full bg-slate-200 text-black rounded-full"
                  {...register("percentageToArtist", { required: true })}
                />
                {errors.percentageToArtist && <span>This field is required</span>}
              </div>
              
              <div className='flex flex-col pb-3 justify-center items-center space-y-1'>
                <label className="label">
                  <span className="label-text text-slate-800 font-bold xl:text-lg">Contest Ends at</span>
                </label>
                <input 
                  type="datetime-local"
                  name="contestEndAtInput"
                  id="contestEndAtInput" 
                  className="max-w-sm w-full bg-slate-200 text-black rounded-full"
                  {...register("contestEndAtInput", { required: true })}
              />
                {errors.contestEndAtInput && <span>This field is required</span>}
              </div>
                
              <div className='flex flex-col flex-1 justify-center items-center'>
                <label className="label text-center">
                  <span className="label-text text-center text-slate-800 font-bold xl:text-lg">Description of Contest</span>
                </label>
                <div className="flex flex-col flex-1 w-full border border-spacing-1">
                  <textarea
                    value={descriptionOfContest} 
                    onChange={handleDescriptionOfContestChange}
                    placeholder="Our NFT Hackthon is..." 
                    className="input h-48  bg-slate-200 text-black rounded-xl"/>
                </div>    
              </div>
              <div className="flex flex-col flex-1 pt-6 pb-6 items-center">
                <button
                  className="group max-w-xs bg-d-pink hover:bg-pink-700 py-2 px-4 md:px-7 h-10 md:h-12 rounded-full font-bold text-xl md:text-xl text-white"
                  type="submit" disabled={!publicKey}
                >
                  <div className="hidden group-disabled:block text-2xl font-bold text-white">
                      Wallet not connected
                  </div>
                  {publicKey && <span  > 
                      Launch Contest
                  </span>}
                </button>
              </div>
            </div>
          </form>
        </div>
      );
    };
