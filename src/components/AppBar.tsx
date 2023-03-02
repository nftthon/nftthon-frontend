import { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { useAutoConnect } from '../contexts/AutoConnectProvider';
import NetworkSwitcher from './NetworkSwitcher';

export const AppBar: FC = props => {
  const { autoConnect, setAutoConnect } = useAutoConnect();

  return (
    <div className="flex justify-between pt-2 md:pt-4 pb-2 md:pb-4 lg:pt-6 lg:pb-6 md:pb-6d border border-white border-b-1 border-t-0">
      <div className="flex px-4 justify-center items-center">
        <Link href="/">
          <div>
            <Image src="/logo.png" width={37} height={37} className="hidden md:inline-block px-4"></Image>
            <div className="px-4 xl:px-6 hidden md:inline-block text-md md:text-xl xl:text-4xl font-bold text-d-pink">
              NFTthon 
            </div>
          </div> 
        </Link>
      </div>
      <div className="pr-2 text-xs md:text-normal flex justify-center items-center space-x-4 md:space-x-8 border-b-2">
        <Link href="/">
          <div className="text-d-pink font-bold">Home</div>
        </Link>

        <Link href="/launch">
          <div className=" text-d-pink font-bold">Launch</div>
        </Link>

        <Link href="/faq">
          <div className=" text-d-pink font-bold">FAQ</div>
        </Link>

        <Link href="/utility">
          <div className="text-d-pink font-bold">Utility</div>
        </Link>
      </div>

        {/* Wallet & Settings */}
      <div className="flex justify-between items-center">
        <div>
          <WalletMultiButton className="bg-d-pink h-8 w-18 text-xs" />
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="btn btn-square btn-ghost text-right text-d-pink">
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <ul tabIndex={0} className="p-2 shadow menu dropdown-content bg-base-100 rounded-box sm:w-52">
            <li>
              <div className="form-control">
                <label className="cursor-pointer label">
                  <a>Autoconnect</a>
                  <input type="checkbox" checked={autoConnect} onChange={(e) => setAutoConnect(e.target.checked)} className="toggle" />
                </label>
                <NetworkSwitcher />
              </div>
            </li>
          </ul>
        </div>
      </div>
        
      {props.children}
    </div>
  );
};
