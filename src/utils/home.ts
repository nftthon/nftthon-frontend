import {
  collection,
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

const db = fetchDb();
const q = query(collection(db, "contestData"));

export async function getContestDataFromFB () {
  const connection = new Connection(clusterApiUrl("devnet"));
  const metaplex = new Metaplex(connection);
  const data = await getDocs(q);
  const res = await Promise.all(data.docs.map(async (doc) => {
    const mintAddress = new PublicKey(doc.data().contestData.nftMintAccount)
    const nft = await metaplex.nfts().findByMint({mintAddress})
    const imageUrl = nft.json.image
    return {params: {
      id: doc.id.toString(),
      data: doc.data(),
      imageUrl: imageUrl,
    }
  }}))
    return res   
}    