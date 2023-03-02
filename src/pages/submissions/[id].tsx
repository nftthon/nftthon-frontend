// import { ShowSubmittedNft } from 'components/ShowSubmittedNft';
import { ShowSubmittedNft } from 'components/ShowSubmittedNft';
import type { NextPage } from 'next';
import { getAllIds } from 'utils/contests';
import { getSubmittedNftData } from 'utils/submissions';

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

const Submissions: NextPage<SubmissionsProps> = ( { fetchedData } ) => {
  console.log("submissionsData", fetchedData )
  return (
    <div>
      {console.log("fetchedData:", fetchedData)}
      <ShowSubmittedNft
        nftSubmissionsData = {fetchedData}
        />
    </div>
  );
}
export default Submissions;
    
export async function getStaticPaths() {
  const paths = await getAllIds();
  console.log("paths:", paths)
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  console.log("params:", context.params)
  const fetchedData = await getSubmittedNftData(context.params.id);
  console.log("fetchedData:", fetchedData)
  return {
    props: {
      fetchedData,
    },
    revalidate: 10,
  };
}
