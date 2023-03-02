import { FC } from 'react';

import { InitializeProgram } from 'components/utility/InitializeProgram';

export const InitializeView: FC = ({ }) => {
  return (
<div className="max-w-5xl sm:mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Initialize
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          < InitializeProgram/>
        </div>
      </div>
    </div>
  );
};
