import {
  FC,
  useCallback,
  useState,
} from 'react';

import {
  doc,
  setDoc,
} from 'firebase/firestore';
import { PROGRAM_ID } from 'program/config';
import { useForm } from 'react-hook-form';
import { fetchDb } from 'utils/firestore';
import { v4 as uuid } from 'uuid';

import { WebBundlr } from '@bundlr-network/client';
import { UploadResponse } from '@bundlr-network/client/build/common/types';
import {
  AnchorProvider,
  BN,
  Program,
  utils,
  web3,
} from '@coral-xyz/anchor';
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

export const Launch: FC = () => {
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
    
    const handleLinkToYourProjectChange = (event): void => {
      const newInput = event.target.value;
      setLinkToYourProject(newInput);
  }

    const handleTitleOfContestChange = (event): void => {
      const newInput = event.target.value;
      setTitleOfContest(newInput);
  }

    const handlePrizeTokenMintInputChange = (event): void => {
      const newInput = event.target.value;
      setPrizeTokenMintInput(newInput); 
  }

    const handlePrizeRawAmountChange = (event): void => {
      const newInput = event.target.value;
      setPrizeRawAmount(newInput);
      console.log(setPrizeRawAmount);
    }

    const handlePercentageToArtistChange = (event): void | Error => {
      try {
        const target = event.target.value as number;
        if (target > 100) {return new Error}
        console.log(target)
        setPercentageToArtist(target)
      } catch (error: any) {
        console.log("Incorrect input Error: ", error);
        alert("Please input correct number from 0 to 100")
      }
    }

    const handleContestEndAtInputChange = (event): void | Error => {
      try {
        const newInput = event.target.value
        setContestEndAtInput(newInput);
        
      } catch (error: any) {
        console.log("Incorrect input Error: ", error);
        alert("Please input correct date/time")
      }
    } 

    const handleDescriptionOfContestChange = (event): void => {
      const newInput = event.target.value;
      setDescriptionOfContest(newInput);
    }

    const uploadImage = async (): Promise<UploadResponse> => {
      if (image == null) {
          alert('image is null')
          return
      };

      const bundlr = new WebBundlr("http://node1.bundlr.network", "solana", wallet);
      await bundlr.ready()
      console.log("bundlr address: ", bundlr.address)
          
      const bundlrTx = await bundlr.upload(image)
      console.log(bundlrTx);
      console.log(`File uploaded ==> https://arweave.net/${bundlrTx.id}`);
      return bundlrTx
      // alert(image);
      // const storage = fetchStorage();
      // const imageRef = ref(storage, `contests/${contestId}`);
      // uploadBytes(imageRef, image).then(() => {
      //   alert("image uploaded");
      // })
    }

    let counterPda = null;
    let _counterBump = null;
    let contestPda = null;
    let _contestBump = null;
    let prizeVaultPda = null;
    let _prizeVaultBump = null;

    const { connection } = useConnection();
    const wallet = useAnchorWallet(); 
    const { publicKey } = useWallet();

    const getProvider = () => {
        const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
        return provider;
    }
  
    const onClick = useCallback(async () => {
      if (!publicKey) {
          notify({ type: 'error', message: `Wallet not connected!` });
          console.log('error', `Send Transaction: Wallet not connected!`);
          return;
      }

      try {
        console.log('prizeTokenMintInput in execution: ', prizeTokenMintInput);
        const provider = getProvider();
        const program = new Program(IDL, PROGRAM_ID, provider);

        const prizeAmount = new BN(prizeRawAmount*10**9);

        [counterPda, _counterBump] = PublicKey.findProgramAddressSync([utils.bytes.utf8.encode("counter")], programId);
        const counterAccount = await program.account.counter.fetch(counterPda);
        
        let contestCount = counterAccount.contestCount;
        
        console.log("counterPda: ", counterPda.toBase58());
        console.log("contestCount: ", contestCount.toNumber());
        console.log("isInitialized: ", counterAccount.isInitialized);
        console.log("prizeTokenMintInput: ", prizeTokenMintInput);
        
        [contestPda, _contestBump] = PublicKey.findProgramAddressSync([Buffer.from("contest"), 
        publicKey.toBuffer(),
        Buffer.from(utils.bytes.utf8.encode((contestCount.toNumber()).toString()))
      ], programId);
        
        console.log("prizeTokenMint", prizeTokenMintInput)
        const prizeTokenMint = new PublicKey(prizeTokenMintInput);

        [prizeVaultPda, _prizeVaultBump] = PublicKey.findProgramAddressSync(
            [Buffer.from(utils.bytes.utf8.encode("prize_vault")),  
            publicKey.toBuffer(),
            Buffer.from(utils.bytes.utf8.encode((contestCount.toNumber()).toString()))
          ], program.programId);

        const contestOwnerPrizeTokenAccount = await getAssociatedTokenAddress(prizeTokenMint, publicKey);
        
        const nowUnixTime = new Date().getTime();
        console.log("now_unixtime", nowUnixTime);
        const contestEndAt = Date.parse(contestEndAtInput.toString())
        console.log("contestEndAt: ", contestEndAt);

        // Constants
        const submitStartAt = new BN(nowUnixTime);
        const submitEndAt = new BN(contestEndAt);
        const voteStartAt = new BN(nowUnixTime);
        let voteEndAt = new BN(contestEndAt);
        const vecSize = VEC_SIZE_OF_VEC_SIZE_FOR_CONTEST_ACCOUNT;
        console.log("prizeAmount: ", prizeAmount.toNumber());

        // const hash: string = sha1({
        //   time: submitStartAt,
        //   title: titleOfContest,
        //   link: linkToYourProject,
        //   description: descriptionOfContest,
        //   prizeMint: prizeTokenMint,
        //   prizeRawAmount: prizeRawAmount,
        //   percentageToArtist: percentageToArtist.toString(),
        //   submitStartAt: submitStartAt.toString(),
        //   contestAccount: contestPda.toString(),
        // })

        const tx = await program.methods.launch(
            prizeAmount,
            percentageToArtist as number,
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
        // const contestId = (contestCountAfterTransaction.toNumber() - 1).toString() // + "_" + titleOfContest;

        const contestId = uuid();

        const contestData: ContestData = {
          messageId: contestId,
          createdAt: Date.now(),
          contestAccount: contestPda.toString(),
          titleOfContest: titleOfContest,
          linkToYourProject: linkToYourProject,
          descriptionOfContest: descriptionOfContest,
          prizeTokenMint: prizeTokenMint.toString(),
          prizeRawAmount: prizeRawAmount,
          percentageToArtist: percentageToArtist,
          submitStartAt: submitStartAt.toNumber(),
        }

        const bundlrTx = await uploadImage()
        const db = fetchDb();
          await setDoc(doc(db, "contests", contestId), {
            contestData
            })
        
            
        


        
        
          } catch (error: any) {
              console.log("Transaction Error: ", error);
          }
      }
          ,[publicKey, 
            notify, 
            connection, 
            linkToYourProject, 
            titleOfContest,
            prizeTokenMintInput,
            prizeRawAmount,
            descriptionOfContest,
          ]);
      
      return (
        <div className='max-w-5xl'>
          <div className="">
            <div className='mr-6'>
              <div className='pb-3'>
                <label className="label">
                    <span className="label-text">Link to your project</span>
                </label>
                <input type="text" value={linkToYourProject} onChange={handleLinkToYourProjectChange} placeholder="www.agora-protocol.io" className="w-60 text-black" />
              </div>

              <form>
                <label>
                    <input type="file" className="text-sm text-grey-500
                    file:mr-5 file:py-2 file:px-6
                    file:rounded-full file:border-0
                    file:text-sm file:font-small
                    file:bg-secondary file:text-white
                    hover:file:bg-secondary-focus" onChange={(event) => {
                        setImage(event.target.files[0])}}/>
                </label>
              </form>

              <label className="label">
                  <span className="label-text">Title of contest</span>
              </label>
              <input type="text" value={titleOfContest} onChange={handleTitleOfContestChange} placeholder="ex. Agora Meme Contest" className="text-black w-60" />

                <label className="label">
                    <span className="label-text">Prize Token Mint Address</span>
                </label>
                <input type="text" value={prizeTokenMintInput} onChange={handlePrizeTokenMintInputChange} placeholder="0x...." className="text-black w-60" />

                <label className="label">
                    <span className="label-text">Prize Amount</span>
                </label>
                <input type="text" value={prizeRawAmount} onChange={handlePrizeRawAmountChange} placeholder="number of tokens above as prize" className="text-black w-60" />
            
                <label className="label">
                    <span className="label-text">Percentage to Artist</span>
                </label>
                <input type="text" value={percentageToArtist} onChange={handlePercentageToArtistChange} placeholder="set beween 0 to 100 (percentage)" className="text-black w-60" />
            
                <label className="label">
                    <span className="label-text">Contest Ending Time</span>
                </label>
                <input type="datetime-local" value={contestEndAtInput} onChange={handleContestEndAtInputChange} placeholder="" className="text-black w-60" />

            </div>
            <div className='flex-auto'>
                <label className="label">
                    <span className="label-text">Description of contest</span>
                </label>
                <textarea value={descriptionOfContest} onChange={handleDescriptionOfContestChange} placeholder="Overview / What is expected? / Selection Criteria..." className="input h-96 w-60" />   
                </div>
        </div>
              <div className="pt-6">
              <button
                  className="group w-60 m-2"
                  onClick={onClick} disabled={!publicKey}
              >
                  <div className="hidden group-disabled:block ">
                      Wallet not connected
                  </div>
                  <span className="block group-disabled:hidden  bg-blue-600 hover:bg-blue-700 py-0 px-3 mb:px-4 lg:px-6 h-9 sm:h-9 md:h-10 xl:h-12 rounded-full font-bold md:text-lg text-white" > 
                      Launch Contest
                  </span>
              </button>
              </div>
    </div>
      );
  };