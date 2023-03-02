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
import { v4 as uuid } from 'uuid';

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
import { CreateImageWithOpenAI } from './CreateImageWithOpenAI';

//todo: avoid iteration of approval by phantom wallet?

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
    const [prizeRawAmount, setPrizeRawAmount] = useState(0);
    const [prizeTokenMintInput, setPrizeTokenMintInput] = useState(PRIZE_TOKEN_MINT_ADDRESS);
    const [percentageToArtist, setPercentageToArtist] = useState(0);
    const [submitStartAt, setSubmitStartAt] = useState(0);
    const [submitEndAt, setSubmitEndAt] = useState(0);
    const [voteStartAt, setVoteStartAt] = useState(0);
    const [voteEndAt, setVoteEndAt] = useState(0);
    const [contestEndAtInput, setContestEndAtInput] = useState(0);

    const [linkToYourProject, setLinkToYourProject] = useState('');
    const [titleOfContest, setTitleOfContest] = useState('');
    const [descriptionOfContest, setDescriptionOfContest] = useState('');

    const [image, setImage] = useState(null);
    
  //   const handleLinkToYourProjectChange = (event): void => {
  //     const newInput = event.target.value;
  //     setLinkToYourProject(newInput);
  // }

  //   const handleTitleOfContestChange = (event): void => {
  //     const newInput = event.target.value;
  //     setTitleOfContest(newInput);
  // }

  //   const handlePrizeTokenMintInputChange = (event): void => {
  //     const newInput = event.target.value;
  //     setPrizeTokenMintInput(newInput); 
  // }

  //   const handlePrizeRawAmountChange = (event): void => {
  //     const newInput = event.target.value;
  //     setPrizeRawAmount(newInput);
  //     console.log(setPrizeRawAmount);
  //   }

    // const handlePercentageToArtistChange = (event): void | Error => {
    //   try {
    //     const target = event.target.value as number;
    //     if (target > 100) {return new Error}
    //     console.log(target)
    //     setPercentageToArtist(target)
    //   } catch (error: any) {
    //     console.log("Incorrect input Error: ", error);
    //     alert("Please input correct number from 0 to 100")
    //   }
    // }

    // const handleContestEndAtInputChange = (event): void | Error => {
    //   try {
    //     const newInput = event.target.value
    //     setContestEndAtInput(newInput);
    //   } catch (error: any) {
    //     console.log("Incorrect input Error: ", error);
    //     alert("Please input correct date/time")
    //   }
    // } 

    const handleDescriptionOfContestChange = (event): void => {
      const newInput = event.target.value;
      setDescriptionOfContest(newInput);
    }

    let counterPda = null;
    let _counterBump = null;
    let contestPda = null;
    let _contestBump = null;
    let prizeVaultPda = null;
    let _prizeVaultBump = null;
    let nftMintAccount: PublicKey;

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
          contestId: "ddd",
          createdAt: Date.now(),
          contestAccount: contestPda.toString(),
          titleOfContest: data.titleOfContest,
          linkToYourProject: data.linkToYourProject,
          descriptionOfContest: descriptionOfContest,
          prizeTokenMint: prizeTokenMint.toString(),
          prizeRawAmount: data.prizeRawAmount,
          percentageToArtist: data.percentageToArtist,
          submitStartAt: submitStartAt.toNumber(),
          // nftMintAccount: nftMintAccount.toString(),
        }
        
        let reader = new FileReader();
        const fileData = new Blob([data.image]);
        reader.readAsArrayBuffer(fileData);
        reader.onload = async function (event) {
          const arrayBuffer = reader.result;

          console.log("URI: ", toMetaplexFile(arrayBuffer, "metaplex.png"))

          const { metadata, uri } = await mx
            .nfts()
            .uploadMetadata({
              name: data.titleOfContest,
              description: descriptionOfContest,
              image: toMetaplexFile(arrayBuffer, "metaplex.png")
              // externalUrl: linkToYourProject
            });
            console.log("metadata:", metadata)
            console.log("uri; ", uri)

          const { nft } = await mx
            .nfts()
            .create({
              uri: uri,
              name: data.titleOfContest,
              sellerFeeBasisPoints: 250,
              // tokenOwner: publicKey,
            })
            // nftMintAccount = mintAddress;
            console.log("nft: ", nft)
            // console.log("mint address: ", mintAddress)
        }
        const contestId = uuid();
        contestData.contestId = contestId;

        const db = fetchDb();
          await setDoc(doc(db, "contestData", contestId), {
            contestData
            })
          } catch (error: any) {
              console.log("Transaction Error: ", error);
          }
      };
      
      return (
        <div className='max-w-5xl'>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" onChange={event => setIsOpenAIUsed(!isOpenAIUsed)} className="sr-only peer"/>
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-sky-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sky-300"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Wanna use OpenAI?</span>
          </label>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="pt-4">
              <div className='pb-3'>
                <label className="label">
                  <span className="label-text">Link to your project</span>
                </label>
                <input type="text" 
                  name="linkToYourProject" 
                  id="LinkToYourProject" 
                  // value={linkToYourProject} onChange={handleLinkToYourProjectChange} 
                  placeholder="https:://solana.com" 
                  className="w-60 text-black"
                  {...register("linkToYourProject", { required: true })}
                />
                  {errors.linkToYourProject && <span>This field is required</span>}
              </div>

              {isOpenAIUsed && <CreateImageWithOpenAI />}

              {!isOpenAIUsed && 
              <div>
                <label className="label">
                  <span className="label-text">Set a logo of your project</span>
                </label>
                <input 
                  type="file"
                  name="image"
                  id="image"
                  className="input input-bordered w-full max-w-xs"
                  accept="image/jpeg, image/png, image/jpg" 
                  // onChange={(event) => {
                  //   setImage(event.target.files[0])}}
                  {...register("image", { required: true })}
                />
                  {errors.image && <span>This field is required</span>}
              </div>
              }

              <div>
                <label className="label">
                  <span className="label-text">Title of contest</span>
                </label>
                <input 
                  type="text"
                  name="titleOfContest"
                  id="titleOfContest"
                  // value={titleOfContest} 
                  // onChange={handleTitleOfContestChange} 
                  placeholder="Solana Grizzlython NFT Contest" 
                  className="text-black w-60"
                  {...register("titleOfContest", { required: true })}
                />
                  {errors.titleOfContest && <span>This field is required</span>}
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Prize Token Mint Address</span>
                </label>
                <input 
                  type="text"
                  name="prizeTokenMintInput"
                  id="prizeTokenMintInput"
                  // value={prizeTokenMintInput} 
                  // onChange={handlePrizeTokenMintInputChange} 
                  placeholder="..." 
                  className="text-black w-60"
                  {...register("prizeTokenMintInput", { required: true })}
                  />
                  {errors.prizeTokenMintInput && <span>This field is required</span>}
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Prize Amount</span>
                </label>
                <input 
                  type="text"
                  name="prizeRawAmount"
                  id="prizeRawAmount"
                  // value={prizeRawAmount} 
                  // onChange={handlePrizeRawAmountChange} 
                  placeholder="number of tokens for prize" 
                  className="text-black w-60"
                  {...register("prizeRawAmount", { required: true })}
                  />
                  {errors.prizeRawAmount && <span>This field is required</span>}
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Percentage to Artist</span>
                </label>
                <input 
                  type="text"
                  name="percentageToArtist"
                  id="percentageToArtist"
                  // value={percentageToArtist} 
                  // onChange={handlePercentageToArtistChange} 
                  placeholder="set beween 0 to 100 (percentage)" 
                  className="text-black w-60"
                  {...register("percentageToArtist", { required: true })}
                />
                {errors.percentageToArtist && <span>This field is required</span>}
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Contest Ending Time</span>
                </label>
                <input 
                  type="datetime-local"
                  name="contestEndAtInput"
                  id="contestEndAtInput"
                  // value={contestEndAtInput} 
                  // onChange={handleContestEndAtInputChange} 
                  className="text-black w-60"
                  {...register("contestEndAtInput", { required: true })}
              />
                {errors.contestEndAtInput && <span>This field is required</span>}
              </div>
                
              <div className='flex-auto pt-12'>
                <label className="label">
                  <span className="label-text">Description of contest</span>
                </label>
                <div className="border border-spacing-1">
                  <textarea
                    value={descriptionOfContest} 
                    onChange={handleDescriptionOfContestChange}
                    placeholder="Our NFT Hackthon is..." 
                    className="input h-96 w-full hover-bordered"/>
                </div>    
              </div>
              <div className="pt-6">
                <button
                  className="group w-60 m-2"
                  type="submit" disabled={!publicKey}
                >
                  <div className="hidden group-disabled:block ">
                      Wallet not connected
                  </div>
                  <span className="button block group-disabled:hidden  bg-blue-600 hover:bg-blue-700 py-0 px-3 mb:px-4 lg:px-6 h-9 sm:h-9 md:h-10 xl:h-12 rounded-full font-bold md:text-lg text-white" > 
                      Launch Contest
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      );
    };