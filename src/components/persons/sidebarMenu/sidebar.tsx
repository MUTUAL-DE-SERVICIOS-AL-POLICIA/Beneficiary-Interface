"use client";

import { Card, Separator, toast } from "@heroui/react";
import { useRouter } from "next/navigation";

import { TabsSidebar } from "./";

import { UserInfo } from "@/components";
import { usePermissions } from "@/context/PermissionContext";
import { Features } from "@/utils/interfaces";
import { basicPersonInfo } from "@/utils/types";
import { usePerson } from "@/context";
import { createPersonPhoto, updatePersonPhoto, deletePersonPhoto } from "@/api/person";

interface Props {
  user: basicPersonInfo;
  features: Features;
}

export const Sidebar = ({ user, features }: Props) => {
  const { can } = usePermissions();
  const person = [
    { name: "DATOS PERSONALES", key: "personalData", icon: "PersonalDataIcon" },
    { name: "HUELLAS DACTILARES", key: "fingerprints", icon: "TouchIcon" },
  ].filter((item) => item.key !== "fingerprints" || can("persons.fingerprints", "read"));

  const police = [
    { name: "DATOS POLICIALES", key: "policeData", icon: "PoliceDataIcon" },
    { name: "DOCUMENTOS", key: "documents", icon: "DocumentsDataIcon" },
    { name: "EXPEDIENTES", key: "fileDossiers", icon: "FileDossiersIcon" },
  ].filter((item) => {
    if (item.key === "documents") return can("affiliates.documents", "read");
    if (item.key === "fileDossiers") return can("affiliates.file_dossiers", "read");

    return true;
  });

  const beneficiaries = can("persons.affiliates", "read")
    ? [{ name: "BENEFICIARIOS", key: "beneficiaries", icon: "BeneficiariesDataIcon" }]
    : [];

  const affiliates = can("affiliates", "read")
    ? [{ name: "AFILIADOS", key: "affiliates", icon: "AffiliateDataIcon" }]
    : [];

  const router = useRouter();
  const { person: personData, photoUrl, loadPhoto } = usePerson();

  // 1. Recibes el objeto File desde UserInfo
  const registerPhoto = async (file: File | null) => {
    try {
      if (!file) return;

      // Ejemplo: Enviar archivo a tu backend/API con FormData
      const formData = new FormData();

      formData.append(`file[${personData.identityCard}]`, file);

      const { error, message } = await createPersonPhoto(
        String(personData.id),
        personData.identityCard,
        formData,
      );

      if (error) {
        toast.danger(message);

        return;
      }
      toast.success("Foto registrada correctamente");

      router.refresh();
    } catch {
      toast.danger("Ocurrió un error al registrar la foto");
    }
  };

  const updatePhoto = async (file: File | null) => {
    try {
      if (!file) return;
      // Ejemplo: Enviar archivo a tu backend/API con FormData
      const formData = new FormData();

      formData.append(`file[${personData.identityCard}]`, file);

      const { error, message } = await updatePersonPhoto(
        String(personData.id),
        personData.identityCard,
        formData,
      );

      if (error) {
        toast.danger(message);

        return;
      }
      await loadPhoto();
      toast.success("Foto actualizada correctamente");
    } catch {
      toast.danger("Ocurrió un error al actualizar la foto");
    }
  };

  const deletePhoto = async () => {
    try {
      const { error, message } = await deletePersonPhoto(String(personData.id));

      if (error) {
        toast.danger(message);

        return;
      }
      router.refresh();
      toast.success("Foto eliminada correctamente");
    } catch {
      toast.danger("Ocurrió un error al eliminar la foto");
    }
  };

  return (
    <>
      <Card.Header className="justify-center">
        <UserInfo
          hasPhoto={Boolean(user.personPhoto)}
          isDelete={can("persons.photos", "delete")}
          isEdit={can("persons.photos", "update")}
          isPolice={features.isPolice}
          isRegister={can("persons.photos", "write")}
          photoUrl={photoUrl}
          user={{ ...user, nup: user.nup?.toString() }}
          onPressDelete={deletePhoto}
          onPressEdit={updatePhoto}
          onPressRegister={registerPhoto}
        />
      </Card.Header>
      <Separator className="bg-gray-400 w-full" />
      <Card.Content className="flex flex-col gap-2">
        <TabsSidebar tabSidebar={person} />

        {features.isPolice && (
          <>
            <TabsSidebar tabSidebar={police} />
          </>
        )}
        {features.hasBeneficiaries && (
          <>
            <TabsSidebar tabSidebar={beneficiaries} />
          </>
        )}
        {features.hasAffiliates && (
          <>
            <TabsSidebar tabSidebar={affiliates} />
          </>
        )}
      </Card.Content>
    </>
  );
};
