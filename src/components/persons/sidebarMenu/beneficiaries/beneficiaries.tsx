"use client";

import { Spinner, toast } from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getBeneficiaries } from "@/api/person";
import { UserInfo } from "@/components";
import { usePerson } from "@/context/PersonContext";
import { basicPersonInfo } from "@/utils/types";

export const Beneficiaries = () => {
  const [isBeneficiaries, setIsBeneficiaries] = useState<basicPersonInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { person } = usePerson();
  const personId = person?.id;

  useEffect(() => {
    let cancelled = false;

    const loadBeneficiariesData = async () => {
      if (!personId) return;

      setLoading(true);
      try {
        const { error, message, data } = await getBeneficiaries(String(personId));

        if (cancelled) return;

        if (error) {
          toast.danger(message || "Ocurrió un error al obtener los beneficiarios");

          return;
        }

        setIsBeneficiaries(data?.beneficiaries ?? []);
      } catch {
        if (!cancelled) {
          toast.danger("Ocurrió un error al obtener los beneficiarios");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadBeneficiariesData();

    return () => {
      cancelled = true;
    };
  }, [personId]);

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Spinner
            aria-label="Cargando beneficiarios"
            className="text-foreground"
            color="success"
            size="lg"
          />
        </div>
      )}
      {isBeneficiaries.length > 0 ? (
        <div
          className={`${
            isBeneficiaries.length < 3
              ? "flex flex-wrap justify-center gap-2 p-2"
              : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-2"
          }`}
        >
          {isBeneficiaries.map((item, index) => (
            <Link key={item.uuidColumn ?? index} className="w-full" href={`/persons/${item.uuidColumn}`}>
              <UserInfo
                isPolice={false}
                user={{
                  fullName: item.fullName,
                  nup: String(item.nup),
                  identityCard: item.identityCard,
                  kinship: item.kinship,
                  state: item.state,
                }}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm italic">
          SIN BENEFICIARIOS REGISTRADOS
        </div>
      )}
    </>
  );
};
