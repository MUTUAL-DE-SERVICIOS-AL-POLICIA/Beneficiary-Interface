"use client";
import { Spinner } from "@heroui/spinner";
import { useEffect, useState } from "react";

import { Derelict, Entry, Service, State } from "./information";

import { getAffiliate } from "@/api/affiliate";
import { usePerson } from "@/utils/context/PersonContext";
import { initialPoliceData } from "@/utils/types";

export const PoliceData = () => {
  const [policeData, setPoliceData] = useState(initialPoliceData);

  const [loading, setLoading] = useState(false);
  const { affiliateId } = usePerson();

  useEffect(() => {
    getPoliceData();
  }, []);

  const getPoliceData = async () => {
    try {
      setLoading(true);
      const { data } = await getAffiliate(affiliateId);

      return setPoliceData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Spinner color="success" size="lg" variant="spinner" />
        </div>
      )}
      <div className="flex gap-6">
        <Entry
          dateEntry={policeData?.dateEntry ?? "Sin registro"}
          registration={policeData?.registration ?? "Sin registro"}
        />
        <State
          nameAffiliateState={policeData?.affiliateState.name ?? "Sin registro"}
          type={policeData?.type ?? "Sin registro"}
        />
      </div>
      <Service
        nameCategory={
          policeData?.category.serviceStatus ? (policeData?.category.name ?? "Sin registro") : "s/n"
        }
        nameDegree={policeData?.degree.serviceStatus ? (policeData?.degree.name ?? "Sin registro") : "s/n"}
        nameUnit={policeData?.unit.serviceStatus ? (policeData?.unit.name ?? "Sin registro") : "s/n"}
        serviceMonths={policeData?.serviceMonths ?? "Sin registro"}
        serviceYears={policeData?.serviceYears ?? "Sin registro"}
      />
      <Derelict
        dateDerelict={policeData?.dateDerelict ?? "Sin registro"}
        reasonDerelict={policeData?.reasonDerelict ?? "Sin registro"}
      />
    </div>
  );
};
