import { FC } from 'react';

import { Launch } from '../../components/Launch';

export const LaunchView: FC = ({ }) => {
  
  return (
    <div className="max-w-5xl mx-auto">
      <div>
        <div className="flex-col">
          <div className="text-center mt-6 mb-6">
            <Launch />
          </div>
        </div>
      </div>
    </div>
  );
};
