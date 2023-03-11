type ContestData = {
  contestId: string,
  createdAt: number,
  contestAccount: string,
  contestOwner: string,
  titleOfContest: string,
  linkToYourProject: string,
  descriptionOfContest: string,
  prizeTokenMint: string,
  prizeRawAmount: number,
  percentageToArtist: number,
  submitEndAt: number,
  nftMintAccount: string,
}

type ContestDataForNFT = {
  contestId: string,
  createdAt: number,
  contestAccount: string,
  titleOfContest: string,
  linkToYourProject: string,
  descriptionOfContest: string,
}

type NftData = {
  contestId: string,
  createdAt: number,
  contestAccount: string,
}

type ContestCardData = {
  id: string,
  data: ContestData,
  imageUrl: string,
  numOfSubmittedNft: number,
}

type NftSubmissionData = {
  mintAddress,
  name,
  description,
  imageUrl
}

type SubmittedNftData = {
  contestAddress: string, 
  titleOfContest: string,
  mintAddress: string, 
  artistAddress: string,
  contestOwner: string,
  name: string, 
  description: string, 
  imageUrl: string,
  numOfLikes: number,
}