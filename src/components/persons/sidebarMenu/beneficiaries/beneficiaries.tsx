"use client";

import { useEffect, useState } from "react";
import { Card } from "@heroui/card";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";

import { getBeneficiaries } from "@/api/person";
import { usePerson } from "@/utils/context/PersonContext";
import { basicPersonInfo } from "@/utils/types";
import { UserInfo } from "@/components/persons/sidebarMenu";

export const Beneficiaries = () => {
  const router = useRouter();
  const [isBeneficiaries, setIsBeneficiaries] = useState<basicPersonInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { person } = usePerson();

  useEffect(() => {
    getBeneficiariesData();
  }, []);

  const getBeneficiariesData = async () => {
    try {
      setLoading(true);
      const { error, message, data } = await getBeneficiaries(String(person.id));

      if (error) {
        addToast({
          title: "Ocurrió un error",
          description: message,
          color: "danger",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });

        return;
      }

      setIsBeneficiaries(data.beneficiaries);

      return;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Spinner
            classNames={{ label: "text-foreground mt-4" }}
            color="success"
            size="lg"
            variant="spinner"
          />
        </div>
      )}
      {isBeneficiaries.length > 0 ? (
        <div
          className={`${
            isBeneficiaries.length < 4
              ? "flex flex-wrap justify-center gap-2 p-2"
              : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-2"
          }`}
        >
          {isBeneficiaries.map((item, index) => (
            <Card
              key={index}
              isPressable
              className="w-full border-small rounded-small border-default-200 dark:border-default-200 flex justify-center items-center"
              onPress={() => {
                router.push(`/persons/${item.uuidColumn}`);
              }}
            >
              <UserInfo
                isPolice={false}
                user={{
                  fullName: item.fullName,
                  nup: item.nup,
                  identityCard: item.identityCard,
                  kinship: item.kinship,
                }}
              />
            </Card>
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
