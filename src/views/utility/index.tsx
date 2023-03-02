import { FC } from 'react';

import { InitializeProgram } from 'components/utility/InitializeProgram';
import { MintCurrency } from 'components/utility/MintCurency';
import { RequestAirdrop } from 'components/utility/RequestAirdrop';

export const UtilityView: FC = ({ }) => {

  return (
    <div className="max-w-5xl sm:mx-auto">
      <div className="flex flex-col text-center">
        <div className="text-xl">
          Utility for development/test
        </div>
          <RequestAirdrop/>
          <MintCurrency/>
          <InitializeProgram/>
      </div>
    </div>
  );
};
