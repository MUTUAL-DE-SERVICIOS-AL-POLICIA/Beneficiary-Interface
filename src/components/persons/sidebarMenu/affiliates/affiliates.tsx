"use client";

import { Spinner, toast } from "@heroui/react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getAffiliates } from "@/api/person";
import { UserInfo } from "@/components";
import { usePerson } from "@/context/PersonContext";
import { basicPersonInfo } from "@/utils/types";

export const Affiliates = () => {
  // const router = useRouter();
  const [isAffiliates, setIsAffiliates] = useState<basicPersonInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { person } = usePerson();
  const personId = person?.id;

  useEffect(() => {
    let cancelled = false;

    const loadAffiliatesData = async () => {
      if (!personId) return;

      setLoading(true);

      try {
        const { error, message, data } = await getAffiliates(String(personId));

        if (cancelled) return;

        if (error) {
          toast.danger(message || "Ocurrió un error al obtener los afiliados");

          return;
        }

        setIsAffiliates(data ?? []);
      } catch {
        if (!cancelled) {
          toast.danger("Ocurrió un error al obtener los afiliados");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadAffiliatesData();

    return () => {
      cancelled = true;
    };
  }, [personId]);

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Spinner aria-label="Cargando afiliados" className="text-foreground" color="success" size="lg" />
        </div>
      )}
      {isAffiliates.length > 0 ? (
        <div
          className={`${
            isAffiliates.length < 3
              ? "flex flex-wrap justify-center gap-2 p-2"
              : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-2"
          }`}
        >
          {isAffiliates.map((item, index) => (
            <Link key={item.uuidColumn ?? index} className="w-full" href={`/persons/${item.uuidColumn}`}>
              <UserInfo
                isPolice={true}
                user={{
                  fullName: item.fullName,
                  nup: String(item.nup),
                  identityCard: item.identityCard,
                  state: item.state,
                }}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm italic">
          SIN AFILIADOS REGISTRADOS
        </div>
      )}
    </>
  );
};
