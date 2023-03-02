import {
  collection,
  query,
} from 'firebase/firestore';
import { useMetaplex } from 'hooks/useMetaplex';
import Image from 'next/image';
import Link from 'next/link';
import { fetchDb } from 'utils/firestore';

export const ContestCards = ( { fetchedData }) => {
  const { metaplex: mx } = useMetaplex();
  // const [contestList, setContestList] = useState([]);

  const db = fetchDb();
  const q = query(collection(db, "contestData"));

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
        <div className="pb-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
          {console.log(fetchedData[0])}
          {fetchedData.map((contest => (
            <div key={contest.params.id} className="flex flex-col bg-purple-100  rounded-3xl overflow-hidden shadow-2xl">
              <Link href={`/contests/${contest.params.id}`} className="group block overflow-hidden relative">
                <div className="flex flex-col flex-1 text-center">
                  <Image src={contest.params.imageUrl} width={300} height={300} loading="eager" alt="NFT image" 
                    className="object-cover object-center absolute inset-0 group-hover:scale-110 transition duration-200" />
          
                  <div className="flex flex-col flex-1 p-4 sm:p-6">
                    <h2 className="text-d-pink text-2xl font-bold mb-2">
                      {contest.params.data.contestData.titleOfContest}
                    </h2>
                    
                    <a href={contest.params.data.contestData.linkToYourProject} className="text-slate-500">
                      held by <span className="text-blue-800">{contest.params.data.contestData.linkToYourProject}</span>
                    </a>
                  </div>

                  <div className="flex flex-col flex-1 p-4 sm:p-6">
                    <h2 className="text-slate-500 text-base mb-2">
                      Prize: <span className="font-semibold text-lg text-d-pink">{contest.params.data.contestData.prizeRawAmount} SOL</span>
                    </h2>
                  </div>

                  <div className="flex flex-col flex-1 p-4 sm:p-6">
                    <h2 className="text-slate-500 text-base mb-2">
                      Ends at <span className="font-semibold text-lg text-d-pink">
                        {new Date(contest.params.data.contestData.submitEndAt).toLocaleDateString()}&nbsp; 
                        </span>
                      <span className="font-semibold text-lg text-d-pink">
                        {new Date(contest.params.data.contestData.submitEndAt).toLocaleTimeString()}
                        </span>
                    </h2>
                  </div>
                  
                  <div className="flex flex-col justify-between space-y-4">
                    <Link href={`/contests/${contest.params.id}`}>
                      <button className="bg-d-pink hover:bg-pink-700 px-2 md:px-4 h-10 md:h-14 rounded font-bold text-normal md:text-xl text-white">
                        Submit Creation as an Artist
                      </button>
                    </Link>
                    <Link href={`/submissions/${contest.params.id}`}>
                      <button className=" bg-d-pink hover:bg-pink-700 px-4 md:px-7 h-10 md:h-14 rounded font-bold text-normal md:text-xl text-white">
                        See submitted NFTs
                      </button>
                    </Link>
                  </div>
                 </div>
              </Link>
            </div>
            
          )

          ))}

        </div>
        
            )
        }     
              
              