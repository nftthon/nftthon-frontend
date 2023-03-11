import { FC } from 'react';

import { AppProps } from 'next/app';
import Head from 'next/head';

import { AppBar } from '../components/AppBar';
import { ContentContainer } from '../components/ContentContainer';
import Notifications from '../components/Notification';
import { ContextProvider } from '../contexts/ContextProvider';

require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <>
          <Head>
            <title>NFTthon</title>
            <meta
              name="NFTthon"
              content="NFT Hackathon Project on Solana blockchain"
            />
          </Head>

          <ContextProvider>
            <div className="mx-auto max-x-5xl flex flex-col h-screen bg-slate-100">
            {/* <div className="mx-auto max-x-5xl flex flex-col h-screen bg-[#24193f]"> */}
              <Notifications />
              <AppBar/>
              <ContentContainer>
                <Component {...pageProps} />
              </ContentContainer>
            </div>
          </ContextProvider>
        </>
    );
};

export default App;
