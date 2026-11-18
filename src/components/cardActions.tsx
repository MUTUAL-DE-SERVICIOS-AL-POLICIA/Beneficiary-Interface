"use client";

import { Button, Card } from "@heroui/react";
import { useState } from "react";

import { ModalAlert } from "./modalAlert";

import { ButtonEdit, ButtonDelete } from "@/components";

interface Props {
  textHeader?: string;
  textBody?: string;
  textActive?: string;
  textLoading?: string;
  textHover?: string;
  haveButton?: boolean;
  isEdit?: boolean;
  activeId?: string;
  dataId?: string;
  isLoading?: boolean;
  onPress?: () => void;
  onDelete?: boolean;
  onPressDelete?: (data: any) => void;
  onEdit?: boolean;
  onPressEdit?: () => void;
  height?: string;
  sizeTextBody?: "text-sm" | "text-md" | "text-lg" | "text-xl";
}

export const CardActions = ({
  textHeader,
  textBody,
  textActive,
  textLoading,
  textHover,
  haveButton = false,
  isEdit = false,
  activeId = "0",
  dataId,
  isLoading = false,
  onPress = () => {},
  onDelete = false,
  onPressDelete = () => {},
  onEdit = false,
  onPressEdit = () => {},
  height = "min-h-[auto]",
  sizeTextBody = "text-xl",
}: Props) => {
  const [openModalAlert, setOpenModalAlert] = useState(false);

  return (
    <>
      <Card
        className={`group flex flex-col border-2 rounded-small border-default-200 dark:border-default-200 ${height} w-auto max-w-full`}
      >
        <Card.Header className="relative z-0 flex flex-1 flex-col gap-2">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <Card.Title className="pr-8">{textHeader}</Card.Title>
            <div className="flex items-center gap-1 shrink-0 min-h-8">
              {onEdit && isEdit && <ButtonEdit onPress={onPressEdit} />}
              {onDelete && isEdit && <ButtonDelete onPress={() => setOpenModalAlert(true)} />}
            </div>
          </div>
          <Card.Description className={`${sizeTextBody} text-foreground/80`}>{textBody}</Card.Description>
          {!isEdit && haveButton && (
            <div className="mt-auto flex w-full shrink-0 justify-end pt-2">
              <Button className="w-full sm:w-auto" variant="outline" onPress={onPress}>
                {activeId === dataId ? (isLoading ? textLoading : textActive) : textHover}
              </Button>
            </div>
          )}
        </Card.Header>
      </Card>

      <ModalAlert
        cancelText="Cancelar"
        confirmText="Sí, eliminar"
        isOpen={openModalAlert}
        message={`¿Está seguro que desea eliminar ${textHeader}?`}
        title={`Eliminar ${textHeader}`}
        onClose={() => setOpenModalAlert(false)}
        onConfirm={() => {
          onPressDelete(dataId);
          setOpenModalAlert(false);
        }}
      />
    </>
  );
};
