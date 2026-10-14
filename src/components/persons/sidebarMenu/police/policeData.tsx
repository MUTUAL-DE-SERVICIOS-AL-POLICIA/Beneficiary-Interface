"use client";
import { useEffect, useState } from "react";
import { toast } from "@heroui/react";

import { Derelict, Entry, Service, State } from "./information";

import { getAffiliate } from "@/api/affiliate";
import { SpinnerLoading } from "@/components";
import { usePerson } from "@/context/PersonContext";
import { initialPoliceData } from "@/utils/types";

export const PoliceData = () => {
  const [policeData, setPoliceData] = useState(initialPoliceData);
  const [loading, setLoading] = useState(false);
  const { affiliateId } = usePerson();

  useEffect(() => {
    let cancelled = false;

    const fetchPoliceData = async () => {
      if (!affiliateId) return;

      setLoading(true);
      try {
        const { data } = await getAffiliate(affiliateId);

        if (!cancelled) {
          setPoliceData(data);
        }
      } catch {
        if (!cancelled) {
          toast.danger("Ocurrió un error al obtener los datos policiales");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchPoliceData();

    return () => {
      cancelled = true;
    };
  }, [affiliateId]);

  return (
    <div className="relative h-full w-full">
      <SpinnerLoading isLoading={loading} />

      <div className="flex gap-6">
        <Entry
          dateEntry={policeData?.dateEntry ?? "Sin registro"}
          registration={policeData?.registration ?? "Sin registro"}
        />
        <State
          nameAffiliateState={policeData?.affiliateState?.name ?? "Sin registro"}
          type={policeData?.type ?? "Sin registro"}
        />
      </div>
      <Service
        nameCategory={
          policeData?.category?.serviceStatus ? (policeData?.category.name ?? "Sin registro") : "s/n"
        }
        nameDegree={policeData?.degree?.serviceStatus ? (policeData?.degree.name ?? "Sin registro") : "s/n"}
        nameUnit={policeData?.unit?.serviceStatus ? (policeData?.unit.name ?? "Sin registro") : "s/n"}
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
