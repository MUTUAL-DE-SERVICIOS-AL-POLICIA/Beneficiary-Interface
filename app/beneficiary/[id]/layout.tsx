import { ReactNode } from 'react';
import Sidebar from '@/components/sidebar';

export default function BeneficiaryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row gap-4 w-[1280px]">
      <div className="flex flex-col">
        <Sidebar />
      </div>
      <div className="flex flex-col">
        { children }
      </div>
    </div>
  );
}