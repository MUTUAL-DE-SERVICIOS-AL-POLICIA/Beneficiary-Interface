import { Address, Death, Financial, Basic } from "./information";

import { usePerson } from "@/utils/context/PersonContext";

export const PersonalData = () => {
  const { person, financialEntity } = usePerson();

  return (
    <div className="overflow-y-auto relative h-full w-full">
      <Basic person={person} />
      <div className="flex gap-6">
        <Address />
        <Death
          dateDeath={person?.dateDeath ?? "Sin registro"}
          deathCertificateNumber={person?.deathCertificateNumber ?? "Sin registro"}
          reasonDeath={person?.reasonDeath ?? "Sin registro"}
        />
      </div>
      <Financial
        accountNumber={person?.accountNumber ?? "Sin registro"}
        nameFinancialEntity={
          financialEntity
            ? financialEntity.serviceStatus
              ? (financialEntity.name ?? "Sin registro")
              : "s/n"
            : "Sin registro"
        }
        sigepStatus={person?.sigepStatus ?? "Sin registro"}
      />
    </div>
  );
};
