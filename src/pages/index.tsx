import type { NextPage } from 'next';
import { getContestDataFromFB } from 'utils/home';

import { HomeView } from '../views';

interface FetchedData {
  params: ContestCardData
}

interface HomeProps {
  fetchedData: FetchedData[],
}

const Home: NextPage<HomeProps> = ({ fetchedData }) => {
  return (
    <div>
      {console.log("fetchedData:", fetchedData)}
      <HomeView fetchedData={fetchedData}/>
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  const fetchedData = await getContestDataFromFB();
  console.log("HomeStaticProps", fetchedData)
  return {
    props: {
      fetchedData,
    },
  };
}