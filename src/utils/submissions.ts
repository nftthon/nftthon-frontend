import {
  collection,
  doc,
  getDoc,
} from 'firebase/firestore';

import { Metaplex } from '@metaplex-foundation/js';
import {
  clusterApiUrl,
  Connection,
  PublicKey,
} from '@solana/web3.js';

import { fetchDb } from './firestore';

export async function getSubmittedNftData(id: string) {
  const db = fetchDb();
  const docRef = doc(collection(db, "nftMintAccountList"), id);
  const connection = new Connection(clusterApiUrl("devnet"));
  const metaplex = new Metaplex(connection);
  let nfts = []
  const docSnap = await getDoc(docRef)
  const nftMintAccountStrList = docSnap.data().nftMintAccountStr
  console.log("docSnap", docSnap.data())
  console.log("nftMintAccountStrList", nftMintAccountStrList)

  const res = await Promise.all(nftMintAccountStrList.map(async (nftMintAccountStr) => {
    const mintAddress = new PublicKey (nftMintAccountStr)
    const docRef2 = doc(collection(db, "nftMintToArtist"), nftMintAccountStr)
    const docSnap2 = await getDoc(docRef2)
    const artistAddress = docSnap2.data().artistPubkeyStr
    const numOfLikes = docSnap2.data().numOfLikes
    const docRef3 = doc(collection(db, "contestData"), id)
    const docSnap3 = await getDoc(docRef3)
    const contestOwner = docSnap3.data().contestData.contestOwner
    const titleOfContest = docSnap3.data().contestData.titleOfContest
    const nft = await metaplex.nfts().findByMint({mintAddress})
    const name = nft.json.name
    const description = nft.json.description
    const imageUrl = nft.json.image
    console.log("imageUrl", imageUrl)
    
    return {params: {
      contestAddress: id, 
      titleOfContest: titleOfContest,
      mintAddress: mintAddress.toString(), 
      artistAddress: artistAddress,
      contestOwner: contestOwner,
      name: name, 
      description: description, 
      imageUrl: imageUrl,
      numOfLikes: numOfLikes,
    }}}))
  console.log(res)
  return res
  
  // const nftMintAccountStr = docSnap.data().nftMintAccountStr;
  
  // const mintAddress = new PublicKey (docSnap.data().nftMintAccountStr)

  // const docRef2 = doc(collection(db, "nftMintToArtist"), nftMintAccountStr)
  // const docSnap2 = await getDoc(docRef2)
  // const artistAddress = docSnap2.data().artistPubkeyStr

  // const docRef3 = doc(collection(db, "contestData"), id)
  // const docSnap3 = await getDoc(docRef3)
  // const contestOwner = docSnap3.data().contestData.contestOwner
    
  // const nft = await metaplex.nfts().findByMint({mintAddress})
  // const name = nft.json.name
  // const description = nft.json.description
  // const imageUrl = nft.json.image
  
  // nfts.push({ 
  //   contestAddress: id, 
  //   mintAddress: mintAddress.toString(), 
  //   artistAddress: artistAddress,
  //   contestOwner: contestOwner,
  //   name: name, 
  //   description: description, 
  //   imageUrl: imageUrl
  // })

  // await fetchNftData()
  
  // const filtered = nfts.filter(async (re) => {
  //   console.log("nfts: ", nfts)
  //   console.log("res", nfts)
  //     if (re != null) {
  //        return re 
  //     }
  // })
  // console.log("filtered", filtered)
  // return filtered
}