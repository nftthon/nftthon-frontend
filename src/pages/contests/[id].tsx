import type { NextPage } from 'next';
import {
  getAllIds,
  getContestsData,
} from 'utils/contests';
import { ContestView } from 'views';

interface FetchedData {
  id: string,
  data: ContestData,
}

interface ContestProps {
  fetchedData: FetchedData,
}

const Contest: NextPage<ContestProps> = ( { fetchedData } ) => {
  console.log("contestData", fetchedData)
  return (
    <div>
      {console.log("fetchedData", fetchedData)}
      <ContestView 
        id={fetchedData[0].params.id}
        titleOfContest={fetchedData[0].params.data.contestData.titleOfContest}
        prizeAmount={fetchedData[0].params.data.contestData.prizeRawAmount}
        createdAt={fetchedData[0].params.data.contestData.createdAt}
        descriptionOfContest={fetchedData[0].params.data.contestData.descriptionOfContest}
        linkToYourProject={fetchedData[0].params.data.contestData.linkToYourProject}
        percentageToArtist={fetchedData[0].params.data.contestData.percentageToArtist}
        submitEndAt={fetchedData[0].params.data.contestData.submitEndAt}
      />
    </div>
  );
}
export default Contest;
    
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
  const fetchedData = await getContestsData(context.params.id);
  console.log("fetchedData:", fetchedData)
  return {
    props: {
      fetchedData,
    },
  };
}
