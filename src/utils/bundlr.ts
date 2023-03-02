import { WebBundlr } from '@bundlr-network/client';
import { useAnchorWallet } from '@solana/wallet-adapter-react';

const wallet = useAnchorWallet();
export const bundlr = new WebBundlr("http://node1.bundlr.network", "solana", wallet);

console.log(bundlr.address)