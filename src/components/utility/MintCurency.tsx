import { FC } from 'react';

import { AnchorProvider } from '@coral-xyz/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  Keypair,
  PublicKey,
  Signer,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

import { notify } from '../../utils/notifications';

export const MintCurrency: FC = () => {
      const { connection } = useConnection();
      const wallet = useAnchorWallet();
      const { publicKey } = useWallet();

      const getProvider = () => {
        const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
        console.log(provider.connection)
        return provider;
    }

    const createMintAccountTransaction =  async (wallet: any, mintKeypair:any): Promise<Transaction> => {
        // Create Mint transaction
        let lamports = await getMinimumBalanceForRentExemptMint(connection)
        let latestBlockHash = await connection.getLatestBlockhash();
        let transaction = new Transaction(
            {
                feePayer: wallet.publicKey as PublicKey,
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
            }
        )  
        // Create new transaction for creating Mint Account
        transaction.add(  
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey as PublicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: MINT_SIZE,
                lamports: lamports,
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMintInstruction(
                mintKeypair.publicKey as PublicKey, // mintAccount
                9 as number, // decimals
                wallet.publicKey as PublicKey, // mintAuthority
                wallet.publicKey as PublicKey, // freezeAuthority
                TOKEN_PROGRAM_ID as PublicKey
            )        
        )
        return transaction

    }
    
    // Create Associated Token Account
    const createTokenAccountTransaction = async (wallet : any, mint: PublicKey | string, tokenOwner : PublicKey | string): Promise<[Transaction, PublicKey]> => {
        if (typeof mint == 'string') {
            mint = new PublicKey(mint)
        }
        if (typeof tokenOwner == 'string') {
            tokenOwner = new PublicKey(tokenOwner)
        }

        // Create New Transaction
        let transaction = new Transaction
       // Add createAssociatedTokenAccountInstruction
        const tempAssociatedToken = await getAssociatedTokenAddress(
            mint as PublicKey, 
            tokenOwner as PublicKey, 
            false, // false : Allow the owner account to be a PDA (Program Derived Address)
            TOKEN_PROGRAM_ID, // programId : SPL Token program account
            ASSOCIATED_TOKEN_PROGRAM_ID // associatedTokenProgramId : SPL Associated Token program account
            );
        transaction.add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey as PublicKey, // PublicKey of payer
                tempAssociatedToken, // PublicKey of associatedToken
                tokenOwner as PublicKey, // PublicKey of owner
                mint as PublicKey // PublicKey of mintAccount 
            )
        )
		return [transaction, tempAssociatedToken]
    } 

    // Mint to Token Account
    async function createMintTokenAccountTransaction(wallet : any, mint : PublicKey | string, associatedToken: PublicKey | string, tokenAmount: number, tokenDecimal?: number ) {

        if (typeof mint == 'string') {
            mint = new PublicKey(mint)
        }
        if (typeof associatedToken == 'string') {
            associatedToken = new PublicKey(associatedToken)
        }
        // Create New Transaction
        let transaction = new Transaction

        // Add createMintToInstruction
        transaction.add(
            createMintToInstruction(
                mint as PublicKey, // PublicKey of mintAccount 
                associatedToken as PublicKey, // PublicKey of recipient token account 
                wallet.publicKey as PublicKey, // PublicKey of mintAuthority 
                tokenAmount * 10**tokenDecimal as number // number
            )
        )
		return transaction
	}
  
      const onClick = async () => {
          if (!publicKey) {
              console.log('error', 'Wallet not connected!');
              notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
              return;
          }
          let signature = '';
          try {
                const mintKeypair = Keypair.generate() as Signer
                const transaction = await createMintAccountTransaction(wallet, mintKeypair)
                const provider = getProvider();
                // transaction.partialSign( [mintKeypair, wallet] );
                const signature_1 = await provider.sendAndConfirm(transaction, [mintKeypair]);
                console.log("signature: ", signature_1);

                const [tokenAccountTransaction, tokenAddress] = await createTokenAccountTransaction(wallet, mintKeypair.publicKey, wallet.publicKey);
                const signature_2 = await provider.sendAndConfirm(tokenAccountTransaction);
                console.log("signature: ", signature_2);

                const mintTokenAccountTransaction = await createMintTokenAccountTransaction(wallet, mintKeypair.publicKey, tokenAddress, 10, 9);
                const signature_3 = await provider.sendAndConfirm(mintTokenAccountTransaction);
                console.log("signature: ", signature_3);
                
                // const messageV0 = new TransactionMessage({
                //     payerKey: publicKey,
                //     recentBlockhash: latestBlockHash.blockhash,
                //     instructions: (  
                //         [SystemProgram.createAccount({
                //             fromPubkey: publicKey as PublicKey,
                //             newAccountPubkey: mintKeypair.publicKey,
                //             space: MINT_SIZE,
                //             lamports: lamports,
                //             programId: TOKEN_PROGRAM_ID,
                //         }),
                //         createInitializeMintInstruction(
                //             mintKeypair.publicKey as PublicKey, // mintAccount
                //             9 as number, // decimals
                //             publicKey as PublicKey, // mintAuthority
                //             publicKey as PublicKey, // freezeAuthority
                //             TOKEN_PROGRAM_ID as PublicKey
                //         )]        
                //     )
                // }).compileToV0Message();
                // Create new transaction for creating Mint Account
                    // Step 3 - Sign your transaction with the required `Signers`
        // let transaction = new VersionedTransaction(messageV0);
        
          
        // transaction.sign(mintKeypair);
        

        // Sign with wallet and send Transaction
       
                
    //         prizeTokenMint = await Token.createMint(
    //         provider.connection,
    //         payer,
    //         mintAuthority.publicKey,
    //         null,
    //         0,
    //         TOKEN_PROGRAM_ID
    //       );
    //       connection
    //           signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
    //           await connection.confirmTransaction(signature, 'confirmed');
    //           notify({ type: 'success', message: 'Airdrop successful!', txid: signature });
  
          } catch (error: any) {
              notify({ type: 'error', message: `Mint failed!`, description: error?.message, txid: signature });
              console.log('error', `Mint failed! ${error?.message}`, signature);
          }
      };
  
      return (
          <div className="my-4">
              <button
                  className="group bg-blue-600 hover:bg-blue-700 py-0 px-3 mb:px-4 lg:px-6 h-9 sm:h-9 md:h-10 xl:h-12 rounded-full font-bold md:text-lg text-white"
                  onClick={onClick}
              >
                  <span>Mint Token </span>
              </button>
          </div>
      );
  };
  
  