"use client";

import { useEffect, useState } from "react";
import { Card } from "@heroui/card";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";

import { getAffiliates } from "@/api/person";
import { usePerson } from "@/utils/context/PersonContext";
import { basicPersonInfo } from "@/utils/types";
import { UserInfo } from "@/components/persons/sidebarMenu";

export const Affiliates = () => {
  const router = useRouter();
  const [isAffiliates, setIsAffiliates] = useState<basicPersonInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { person } = usePerson();

  useEffect(() => {
    getAffiliatesData();
  }, []);

  const getAffiliatesData = async () => {
    try {
      setLoading(true);

      const { error, message, data } = await getAffiliates(String(person.id));

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

      setIsAffiliates(data);

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
      {isAffiliates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-2">
          {isAffiliates.map((item, index) => (
            <Card
              key={index}
              isPressable
              className="w-full border-small rounded-small border-default-200 dark:border-default-200 flex justify-center items-center"
              onPress={() => {
                router.push(`/persons/${item.uuidColumn}`);
              }}
            >
              <UserInfo
                isPolice={true}
                user={{
                  fullName: item.fullName,
                  nup: item.nup,
                  identityCard: item.identityCard,
                }}
              />
            </Card>
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
