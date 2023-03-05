import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
} from 'firebase/firestore';
import { fetchDb } from 'utils/firestore';

import { Metaplex } from '@metaplex-foundation/js';
import {
  clusterApiUrl,
  Connection,
  PublicKey,
} from '@solana/web3.js';

export async function getContestDataFromFB () {
  let numOfSubmittedNft: number;
  const db = fetchDb();
  const q = query(collection(db, "contestData"));
  const connection = new Connection(clusterApiUrl("devnet"));
  const metaplex = new Metaplex(connection);
  const data = await getDocs(q);
  const res = await Promise.all(data.docs.map(async (docContest) => {
    const mintAddress = new PublicKey(docContest.data().contestData.nftMintAccount)
    const nft = await metaplex.nfts().findByMint({mintAddress})
    const imageUrl = nft.json.image
    const qForMint = doc(collection(db, "nftMintAccountList"), docContest.data().contestData.contestAccount);
    const dataOfMint = await getDoc(qForMint);
    console.log("dataOfMint: ", dataOfMint.data());
    const isNftSubmitted = Boolean(dataOfMint.data())
    if (isNftSubmitted) {
      numOfSubmittedNft = (dataOfMint.data().nftMintAccountStr).length
    } else {
      numOfSubmittedNft = 0;
    }
    // const numOfSubmittedNft = Boolean(dataOfMint.data()) ? dataOfMint.data().nftAccountStr: 0
    return {params: {
      id: docContest.id.toString(),
      data: docContest.data(),
      imageUrl: imageUrl,
      numOfSubmittedNft: numOfSubmittedNft
    }
  }}))
    return res   
}    