import {
  FC,
  useCallback,
} from 'react';

import {
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  LAMPORTS_PER_SOL,
  TransactionSignature,
} from '@solana/web3.js';

import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';
import { notify } from '../../utils/notifications';

export const RequestAirdrop: FC = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const { getUserSOLBalance } = useUserSOLBalanceStore();

    const onClick = useCallback(async () => {
        if (!publicKey) {
            console.log('error', 'Wallet not connected!');
            notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
            return;
        }

        let signature: TransactionSignature = '';

        try {
            signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
            await connection.confirmTransaction(signature, 'confirmed');
            notify({ type: 'success', message: 'Airdrop successful!', txid: signature });

            getUserSOLBalance(publicKey, connection);
        } catch (error: any) {
            notify({ type: 'error', message: `Airdrop failed!`, description: error?.message, txid: signature });
            console.log('error', `Airdrop failed! ${error?.message}`, signature);
        }
    }, [publicKey, connection, getUserSOLBalance]);

    return (
        <div className="my-4">
            <button
                className="bg-blue-600 hover:bg-blue-700 py-0 px-3 mb:px-4 lg:px-6 h-9 sm:h-9 md:h-10 xl:h-12 rounded-full font-bold md:text-lg text-white"
                onClick={onClick}>
                Airdrop 1 SOL
            </button>
        </div>
    );
};

