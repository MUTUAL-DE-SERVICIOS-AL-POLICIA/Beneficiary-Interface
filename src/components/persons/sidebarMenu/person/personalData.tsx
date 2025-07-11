import { Address, Death, Financial, Basic } from "./information";

import { usePerson } from "@/utils/context/PersonContext";

export const PersonalData = () => {
  const { person, financialEntity } = usePerson();

  return (
    <div className="px-5 py-5 space-y-3 max-h-[520px] 2xl:max-h-[710px] overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      {/* <h1 className="text-md font-semibold">DATOS PERSONALES</h1>
      <Divider className="bg-gray-400 mb-5" /> */}
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
