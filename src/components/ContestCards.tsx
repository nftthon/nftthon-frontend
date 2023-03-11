import {
  collection,
  query,
} from 'firebase/firestore';
import { useMetaplex } from 'hooks/useMetaplex';
import Image from 'next/image';
import Link from 'next/link';
import { fetchDb } from 'utils/firestore';

import {
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';

export const ContestCards = ( { fetchedData }) => {
  const { metaplex: mx } = useMetaplex();
  const db = fetchDb();
  const q = query(collection(db, "contestData"));
  const { connection } = useConnection();
  const wallet = useWallet(); 

  // useEffect(() => {
  //   const fetchData = async () => {
  //     let contests = []
  //     const data = await getDocs(q)

  //     data.forEach(async (doc) => {
  //       console.log("doc MintAccount", doc.data().contestData.nftMintAccount)
  //       const mintAddress = new PublicKey(doc.data().contestData.nftMintAccount)
        
  //       const nft = await mx.nfts().findByMint({mintAddress})
  //       const imageUrl = nft.json.image
  //       contests.push({...doc.data(), id: doc.id, imageUrl: imageUrl})
  //       })
  //     console.log("contests: ", contests)
  //     setContestList(contests)
  //     }
  //     fetchData()
  //     }, [])

      return (
        <div className="px-4 md:px-8 pb-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {console.log(fetchedData[0])}
          {fetchedData.map((contest => (
            <div key={contest.params.id} className="flex flex-col justify-between bg-purple-100 rounded-3xl overflow-hidden shadow-xl">
                <div className="flex flex-col text-center justify-between h-full">
                  <Image src={contest.params.imageUrl} width={300} height={300} loading="eager" alt="NFT image" 
                    className="object-cover object-center absolute inset-0 group-hover:scale-110 transition duration-200" />
          
                  <div className="flex flex-col p-2 justify-between md:p-4">
                    <h2 className="text-d-pink text-2xl font-bold mb-2">
                      {contest.params.data.contestData.titleOfContest}
                    </h2>
                    
                    <a href={contest.params.data.contestData.linkToYourProject} className="text-slate-500">
                      held by: <span className="text-blue-800">{contest.params.data.contestData.linkToYourProject}</span>
                    </a>
                  </div>

                  <div className="p-2 md:p-4">
                    <h2 className="text-slate-500 text-base">
                      Prize: <span className="font-semibold text-lg text-d-pink">{contest.params.data.contestData.prizeRawAmount} SOL</span>
                    </h2>
                  </div>

                  <div className="p-2 md:p-4">
                    <h2 className="text-slate-500 text-base">
                      Ends at <span className="font-semibold text-lg text-d-pink">
                        {new Date(contest.params.data.contestData.submitEndAt).toLocaleDateString()}&nbsp; 
                        </span>
                      <span className="font-semibold text-lg text-d-pink">
                        {new Date(contest.params.data.contestData.submitEndAt).toLocaleTimeString()}
                        </span>
                    </h2>
                  </div>
                  <div className="flex flex-col justify-between space-y-4 pb-2 px-4 md:px-6">
                    <Link href={`/contests/${contest.params.id}`} passHref={true}>
                      <button className="bg-d-pink hover:bg-pink-700 max-w-sm px-2 md:px-4 h-10 md:h-14 rounded-full font-bold text-normal md:text-xl text-white">
                        Join as an Artist
                      </button>
                    </Link>
                    
                    {(contest.params.numOfSubmittedNft != 0) &&
                    <Link href={`/submissions/${contest.params.id}`} passHref={true}>
                      <button className=" bg-d-pink hover:bg-pink-700 max-w-sm px-2 md:px-4 h-10 md:h-14 rounded-full font-bold text-normal md:text-xl text-white">
                        Check NFTs/Vote
                      </button>
                    </Link>
                    }
                    {(contest.params.numOfSubmittedNft == 0) &&
                      <button className=" bg-pink-200 hover:bg-pink-700 max-w- px-2 md:px-4 h-10 md:h-14 rounded-full font-bold text-normal md:text-xl text-white">
                        No NFTs yet
                      </button>
                    }     
                  </div>
                 </div>
            </div>
            
          )

          ))}

        </div>
        
            )
        }     
              
              