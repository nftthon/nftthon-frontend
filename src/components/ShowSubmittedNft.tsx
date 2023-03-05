import {
  doc,
  increment,
  updateDoc,
} from 'firebase/firestore';
import Image from 'next/image';
import { PROGRAM_ID } from 'program/config';
import { fetchDb } from 'utils/firestore';

import {
  AnchorProvider,
  Program,
  web3,
} from '@coral-xyz/anchor';
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  PublicKey,
  SystemProgram,
} from '@solana/web3.js';

import { PRIZE_TOKEN_MINT_ADDRESS } from '../../constants';
import { IDL } from '../program/idl2';

interface FetchedData {
  contestAddress: string,
  mintAddress: string, 
  artistAddress: string,
  contestOwner: string,
  name: string, 
  description: string, 
  imageUrl: string,
  numOfLikes: number
}

interface SubmissionsProps {
  fetchedData: FetchedData[],
}

export const ShowSubmittedNft: any = ( { 
  nftSubmissionsData
 }) => {
  let artworkPda = null
  let counterPda = null;
  let voteDataPda = null;
  let prizeVaultPda = null;

  let maxNumOfLikes = 0
  for (let d of nftSubmissionsData) {
    if (d.params.numOfLikes > maxNumOfLikes) {
      maxNumOfLikes = d.params.numOfLikes
    }
  }

  const { connection } = useConnection();
  const wallet = useWallet(); 
  const { publicKey } = useWallet();
  
  const getProvider = () => {
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    return provider;
  }

  const prizeTokenMint = new PublicKey(PRIZE_TOKEN_MINT_ADDRESS);
  console.log("nftSubmissionData: ", nftSubmissionsData)

  const handleOnClickForVote = async (nft, e) => {
    e.preventDefault()
    const contestAccount = new PublicKey(nft.params.contestAddress)
    const artistAddress = new PublicKey(nft.params.artistAddress)
    const contestOwner = new PublicKey(nft.params.contestOwner)

    console.log("nft: ", nft.params.mintAddress)
    const artworkMintAccount = new PublicKey(nft.params.mintAddress)
    console.log("mintAddress", nft.params.mintAddress)
    console.log("contestAddress", nft.params.contestAddress)
    const provider = getProvider();
    const program = new Program(IDL, PROGRAM_ID, provider);

    [artworkPda, ] = PublicKey.findProgramAddressSync(
      [Buffer.from("artwork"),  
      contestAccount.toBuffer(), 
      artistAddress.toBuffer()
    ], program.programId);

    [voteDataPda, ] = PublicKey.findProgramAddressSync(
      [Buffer.from("vote"),
      contestAccount.toBuffer(), 
      publicKey.toBuffer()
      ], program.programId);
      console.log(voteDataPda)

    const artworkAccountInfo = await program.account.artwork.fetch(artworkPda); //Bug. cannot read artwork account
    console.log("artwork:", artworkAccountInfo)
    const votedArtworkId = artworkAccountInfo.artworkId.toNumber()
    console.log('voted artwork id: ', votedArtworkId);

    const tx = await program.methods.vote(
      votedArtworkId
      ).accounts(
      {
        voter: publicKey,
        artwork: artworkPda,
        contest: contestAccount,
        voteData: voteDataPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

      const db = fetchDb();
      await updateDoc(doc(db, "nftMintToArtist", nft.params.mintAddress), {
        numOfLikes: increment(1)
    })
    }

    const handleOnClickForVoteClaimByArtist = async (nft, e) => {
      e.preventDefault();
      
      let voteDataPda = null;
      let artworkPda = null;
      let prizeVaultAuthorityPda = null;
      console.log("nft: ", nft.params.mintAddress)
      const artworkAccount = new PublicKey(nft.params.mintAddress)
      const contestAccount = new PublicKey(nft.params.contestAddress)
      const contestOwner = new PublicKey(nft.params.contestOwner)
      const artistAddress = new PublicKey(nft.params.artistAddress)
      const provider = getProvider();
      const program = new Program(IDL, PROGRAM_ID, provider);

      [voteDataPda, ] = PublicKey.findProgramAddressSync(
        [Buffer.from("vote"),
        contestAccount.toBuffer(), 
        publicKey.toBuffer()
        ], program.programId);
        console.log(voteDataPda);
        
        [counterPda, ] = PublicKey.findProgramAddressSync([Buffer.from("counter")], program.programId);
        const counterAccountInfo = await program.account.counter.fetch(counterPda);
        const contestCount = counterAccountInfo.contestCount.toNumber();
        console.log("counterPda: ", counterPda);

        const contestAccountInfo = await program.account.contest.fetch(contestAccount);
        const thenContestCount = contestAccountInfo.contestId.toNumber();
        console.log("counterCount: ", thenContestCount);

      [prizeVaultPda, ] = PublicKey.findProgramAddressSync(
        [Buffer.from("prize_vault"),  
        contestOwner.toBuffer(),
        Buffer.from(thenContestCount.toString())
        ], program.programId);

      [artworkPda, ] = PublicKey.findProgramAddressSync(
        [Buffer.from("artwork"),  
        contestAccount.toBuffer(), 
        artistAddress.toBuffer()
      ], program.programId);

      const artworkAccountInfo = await program.account.artwork.fetch(artworkPda);
      console.log("artwork:", artworkAccountInfo)
      const votedArtworkId = artworkAccountInfo.artworkId.toNumber()
      console.log('voted artwork id: ', votedArtworkId);

      [prizeVaultAuthorityPda,] = PublicKey.findProgramAddressSync(
        [Buffer.from("prize_vault_authority"),
        contestAccount.toBuffer(),
      ], program.programId);

      const artistPrizeTokenAccount = await getAssociatedTokenAddress(
        new PublicKey(prizeTokenMint), 
        artistAddress);

      const tx = await program.methods.claimByArtist().accounts(
        {
          artist: publicKey,
          artwork: artworkPda,
          contest: contestAccount,
          prizeMint: prizeTokenMint,
          prizeVaultAccount: prizeVaultPda,
          prizeVaultAuthority: prizeVaultAuthorityPda,
          artistTokenAccount: artistPrizeTokenAccount,
          rent: web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      }

      const handleOnClickForClaimByVoter = async (nft, e) => {
        e.preventDefault()
        let voteDataPda = null;
        let artworkPda = null;
        let prizeVaultAuthorityPda = null;
        console.log("nft: ", nft.params.mintAddress)
        const artworkAccount = new PublicKey(nft.params.mintAddress)
        const contestAccount = new PublicKey(nft.params.contestAddress)
        const artistAddress = new PublicKey(nft.params.artistAddress)
        const contestOwner = new PublicKey(nft.params.contestOwner)
        const provider = getProvider();
        const program = new Program(IDL, PROGRAM_ID, provider);
  
        [voteDataPda, ] = PublicKey.findProgramAddressSync(
          [Buffer.from("vote"),
          contestAccount.toBuffer(), 
          publicKey.toBuffer()
          ], program.programId);
          console.log(voteDataPda);

        [artworkPda, ] = PublicKey.findProgramAddressSync(
            [Buffer.from("artwork"),  
            contestAccount.toBuffer(), 
            artistAddress.toBuffer()
          ], program.programId);
  
        const artworkAccountInfo = await program.account.artwork.fetch(artworkPda);
        console.log("artwork:", artworkAccountInfo)
        const votedArtworkId = artworkAccountInfo.artworkId.toNumber()
        console.log('voted artwork id: ', votedArtworkId);

        const contestAccountInfo = await program.account.contest.fetch(contestAccount);
        const thenContestCount = contestAccountInfo.contestId.toNumber();
        console.log("counterCount: ", thenContestCount);

        [prizeVaultPda, ] = PublicKey.findProgramAddressSync(
          [Buffer.from("prize_vault"),  
          contestOwner.toBuffer(),
          Buffer.from(thenContestCount.toString())
          ], program.programId);

        [prizeVaultAuthorityPda,] = PublicKey.findProgramAddressSync(
          [Buffer.from("prize_vault_authority"),
          contestAccount.toBuffer(),
        ], program.programId);

        const voterTokenAccount = await getAssociatedTokenAddress(
          prizeTokenMint, 
          publicKey);
  
        const tx = await program.methods.claimByVoter().accounts(
          {
            voter: publicKey,
            artwork: artworkPda,
            contest: contestAccount,
            prizeMint: prizeTokenMint,
            voteData: voteDataPda,
            prizeVaultAccount: prizeVaultPda,
            prizeVaultAuthority: prizeVaultAuthorityPda,
            voterTokenAccount: voterTokenAccount,
            rent: web3.SYSVAR_RENT_PUBKEY,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        }

      return (
        <div className="max-w-7xl mx-auto flex flex-col justify-center items-center">
          <div className="text-d-pink text-3xl md:text-4xl font-bold pt-4 md:pt-8">
            Submitted NFTs
          </div>
         
          <div className="pt-4 md:pt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {nftSubmissionsData.map((nft => (
            <div key={nft.params.mintAddress} className="flex flex-col overflow-hidden bg-purple-100 rounded-2xl shadow-2xl">
              <div className="group block overflow-hidden relative">
                <div>
                {console.log("nft on display nft", nft)}
                  <Image src={nft.params.imageUrl} width={400} height={400} loading="eager" alt="NFT image" className="w-full object-cover object-center" />
                  <div className="flex flex-col justify-between flex-1 px-4 md:px-6 py-2 ms:py-4">
                    <h2 className="text-d-pink text-2xl font-bold mb-2">
                      {nft.params.name}
                    </h2>

                    <h2 className="text-blue-800 text-lg font-semibold mb-2">
                      {nft.params.description}
                    </h2>
                    <h2 className="text-pink-400 text-xl font-semibold">
                      {nft.params.numOfLikes} Likes
                    </h2>
                  </div>

                  {publicKey && 
                    <div className="flex flex-col flex-1 p-2 md:p-4">
                      <div className="flex flex-col flex-1 pt-4 text-sm">
                        <button onClick={(e) => handleOnClickForVote(nft, e)}
                          className="bg-d-pink hover:bg-pink-700 md:px-7 h-10 md:h-12 font-bold text-lg md:text-lg rounded-2xl text-white">
                            Likes as fan!
                        </button>
                      </div>

                    {(nft.params.numOfLikes >= maxNumOfLikes) && 
                    <div className="flex flex-col flex-1 pt-4 text-sm">
                      <button onClick={(e) => handleOnClickForVoteClaimByArtist(nft, e)}
                      className="bg-d-purple hover:bg-purple-700 md:px-7 h-10 md:h-12 font-bold text-lg md:text-lg rounded-2xl text-white">
                        Get Reward as artist
                      </button>
                    </div>}

                    {(nft.params.numOfLikes >= maxNumOfLikes) && 
                    <div className="flex flex-col flex-1 pt-4 text-center">
                      <button onClick={(e) => handleOnClickForClaimByVoter(nft, e)}
                        className="bg-d-purple hover:bg-purple-700 md:px-7 h-10 md:h-12 font-bold text-lg md:text-lg rounded-2xl text-white">
                        Get Reward as fan
                      </button>
                    </div>}
                    </div>
                  }
                </div>
              </div>
            </div>
          )))}
        </div>

        </div>
        
      )
    }