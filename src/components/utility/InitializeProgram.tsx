import {
  FC,
  useState,
} from 'react';

import {
  AnchorProvider,
  Program,
  utils,
} from '@coral-xyz/anchor';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  PublicKey,
  SystemProgram,
} from '@solana/web3.js';

import { IDL } from '../../program/idl2';
import { notify } from '../../utils/notifications';

export const InitializeProgram: FC = () => {
    const [bundlrAddress, setBundlrAddress] = useState("");
    const [fundStatus, setFundStatus] = useState("");
    const programId = new PublicKey("8wRhhgnw55z1QELi6wDoAnKbnYsU9X9U5kZnMQ12vopf");
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    const { publicKey } = useWallet();

    const getProvider = () => {
        const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
        return provider;
    }

    const onClick = async () => {
        if (!publicKey) {
            notify({ type: 'error', message: `Wallet not connected!` });
            console.log('error', `Send Transaction: Wallet not connected!`);
            return;
        }
        
        try {
            const provider = getProvider();
            const program = new Program(IDL, programId, provider);
            const [counterPda, _counterBump] = PublicKey.findProgramAddressSync([utils.bytes.utf8.encode("counter")
        ], programId);
        console.log("counter pda: ", counterPda.toBase58());

        const tx = await program.methods.initialize().accounts(
        {
            programOwner: publicKey,
            counter: counterPda,
            systemProgram: SystemProgram.programId}
        ).rpc();

        console.log("Sent! Signature: ", tx);

     
        } catch (error: any) {
            console.log("Transaction Error: ", error);
        }
    };

    return (
        <div className="my-4">
            <p> address: {bundlrAddress}</p>
            <p> fundStatus: {fundStatus} </p>
            <button
                className="group bg-blue-600 hover:bg-blue-700 py-0 px-3 mb:px-4 lg:px-6 h-9 sm:h-9 md:h-10 xl:h-12 rounded-full font-bold md:text-lg text-white"
                onClick={onClick} disabled={!publicKey}
            >
                <span className="block group-disabled:hidden" > 
                    Initialize 
                </span>
            </button>
        </div>
    );
};
