"use client"
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import { getBeneficiary } from '../service';
import { useParams } from 'next/navigation';
import React from 'react';

interface ChildProps {
  data: any
}

export default function BeneficiaryLayout({ children }: { children: ReactNode }) {
  const [ data, setData ] = useState<any>({})
  const { id } = useParams()
  useEffect(() => {
    const fetchBeneficiary = async () => {
      try {
        const response = await getBeneficiary(`${id}`);
        setData(response);
      } catch (error) {
        console.error("Error al obtener el beneficiario:", error);
      }
    };

    if (id) {
      fetchBeneficiary();
    }
  }, [id]);

  const childWithProps = React.Children.map(children, (child) => {
    if(React.isValidElement(child)) {
      // console.log("data en BeneficiaryLayout:", data)
      return React.cloneElement(child as ReactElement<ChildProps>, { data })
    }
    return child
  })
  return (
    <div className="flex flex-row gap-4 w-[1280px]">
      <div className="flex flex-col">
        <Sidebar data={data} />
      </div>
      <div className="flex flex-col">
        {/* { children } */}
        { childWithProps }
      </div>
    </div>
  );
}