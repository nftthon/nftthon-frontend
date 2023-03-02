import {
  FC,
  useState,
} from 'react';

export const FaqView: FC = ({ }) => {

  const titles = [
    'What is this app used for?',
    // '2. What is Solana? What the heck is Phantom Wallet? ',
    // '3. How can I get started?',
    'How to launch an NFT contest?',
    'I am an artist. How can I join an NFT contest?',
    'NFTthon contest is over. How can I claim my rewards?',
    'What if I want to host NFT contest in a physical event?',
    // '8. I have submitted my art to an NFT contest. How can I know when it ends? Will anyone call me?',
    // '9. Could I use any other wallet, not Phantom?',
    'Sorry, I do not speak English. How can I submit my art to your NFTthon contest?'
  ];

  const contents = [
    'It is for artists to share their artistic talents with the entire world (Web3, Web2, and Web 1). The app allows for transforming their art into an NFT, which can then be used in popularity contests and garner a reputation for art and the artist who created it. Art Collectors or Voters can join popularity contests and vote for their favorite art and artists. Artists and Voters can both claim rewards (in tokens) for their art and votes if the submitted art get the best popularity.',
    // 'Solana is the worlds first carbon-neutral blockchain aimed at transforming Web3. Phantom Wallet is one of the digital wallets supported by Solana, you can hold cryptocurrencies in it and use it for submitting art and voting for your favorite NFT.',
    // 'Create your Phantom Wallet by adding it as a browser extension on either Chrome or Edge or Safari. (https://help.phantom.app/hc/en-us/articles/4412436271635-How-to-install-Phantom-on-other-browsers) Visit the app using any of the supported browsers (Chrome, Edge, Safari). Connect the app to your wallet, and Voila, you are ready to go! ',
    'Click Launch Contest. Enter your contest details (name, logo, start, and end dates, tokens for a prize, etc.). Approve it using Phantom Wallet, and Sign the transaction using Phantom Wallet. Your contest is live! Ensure your contest appears on the app, scroll down for live contests. Check on Youtube: https://youtu.be/znbWXgyV1j0',
    'On the app, select any of the Live contests in which you wish to participate. Click on "Join contest as an artist". The next page is where you submit your art as NFT. Our app is also ready with AI-generated art, so Go Crazy with your imagination, and create a new NFT within our app. If you prefer to participate with your art, that is acceptable, in that case, upload your NFT art on the same page, add relevant details, and Submit for NFTthon. Check on Youtube: https://youtu.be/X3NRlU8Rtqg',
    'Go to the app, and Connect your Phantom wallet. Scroll down for the NFTthon contest (where you have participated). Click on the `Get Reward as an artist` or `Get Reward as fan` buttons to claim your rewards. Your rewards will be added as tokens to your Phantom Wallet directly. You can transfer your rewards to any other crypto or fiat from Phantom Wallet. Check on Youtube: Claiming reward for artist - https://youtu.be/gaGwvH_-Aqo Claiming reward as voter or fan - https://youtu.be/fvKfkWqvO7c',
    'You can host NFT contests at physical venues. Contact us directly for further guidance.',
    // 'Sorry, we will have to rely on your self-discipline fully. Please visit our app regularly (once a day is enough), and check the status of your NFT contest (if it ended or still going on).',
    // 'Currently, our app supports Phantom Wallet only. Our future releases will support other wallets. Stay tuned!',
    'Currently, we assist in English only. However, you can check out our youtube video links posted here (#4, #5, #6) for further guidance.'
  ];

  const [isCollapsed, setIsCollapsed] = useState(new Array(titles.length).fill(true));
    
  const toggleCollapse = (index) => {
    const newCollapsedState = [...isCollapsed];
    newCollapsedState[index] = !newCollapsedState[index];
    setIsCollapsed(newCollapsedState);
  };

return (
  <div className="max-w-5xl sm:mx-auto flex flex-col text-black">   
    <div className="text-center font-bold text-2xl md:text-3xl">
      FAQ
    </div>

    <div className="text-left px-4 md:px-6 lg:px-8">
      {[...Array(titles.length)].map((_, index) => (
      <div key={index} className="text-left pt-4 md:pt-4 pb-4">
        <button onClick={() => toggleCollapse(index)}>
         <div className="text-left">{index + 1}.  {titles[index]}</div>
        </button>
          {!isCollapsed[index] && (
        <div className="text-blue-800 px-4 block">
          {contents[index]}
        </div>
        )}
    </div>
      ))}
    </div>
  </div>
  );
};