"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useState } from "react";

import { ModalAlert } from ".";

import { GarbageIcon } from "@/components";

interface Props {
  textHeader?: string;
  textBody?: string;
  textActive?: string;
  textLoading?: string;
  textHover?: string;
  isEdit?: boolean;
  activeId?: string;
  dataId?: string;
  isLoading?: boolean;
  onPress?: () => void;
  onDelete?: boolean;
  removeData?: (data: any) => void;
  height?: string;
  sizeTextBody?: "text-sm" | "text-md" | "text-lg" | "text-xl";
}
export const CardActions = ({
  textHeader,
  textBody,
  textActive,
  textLoading,
  textHover,
  isEdit = false,
  activeId = "0",
  dataId,
  isLoading = false,
  onPress = () => {},
  onDelete = false,
  removeData = () => {},
  height = "min-h-[auto]",
  sizeTextBody = "text-sm",
}: Props) => {
  const [openModalAlert, setOpenModalAlert] = useState(false);

  return (
    <>
      <Card
        className={`group border-small rounded-small border-default-200 dark:border-default-200 ${height}`}
        isPressable={!isEdit && activeId !== dataId}
        onPress={onPress}
      >
        <CardBody className="flex items-start gap-y-2">
          <div>
            <span className="text-sm font-bold">{textHeader}</span>
            <div className="absolute top-2 right-2 flex gap-1">
              <span
                className={`text-xs font-semibold transition-opacity duration-200
                    ${
                      activeId === dataId
                        ? isLoading
                          ? "text-blue-600 opacity-100"
                          : "text-green-600 opacity-100"
                        : "text-yellow-600 opacity-0 group-hover:opacity-100"
                    }
                  `}
              >
                {activeId === dataId ? (isLoading ? textLoading : textActive) : !isEdit ? textHover : ""}
              </span>
              {onDelete && isEdit && (
                <Button
                  isIconOnly
                  className="text-tiny text-white"
                  color="danger"
                  radius="lg"
                  size="sm"
                  variant="flat"
                  onPress={() => {
                    setOpenModalAlert(true);
                  }}
                >
                  <GarbageIcon />
                </Button>
              )}
            </div>
          </div>
          <div>
            <p className={`${sizeTextBody}`}>{textBody}</p>
          </div>
        </CardBody>
      </Card>

      <ModalAlert
        cancelText="Cancelar"
        confirmText="Sí, eliminar"
        isOpen={openModalAlert}
        message={`¿Esta seguro que desea eliminar ${textHeader}?`}
        title={`Eliminar ${textHeader}`}
        onClose={() => {
          setOpenModalAlert(false);
        }}
        onConfirm={() => {
          removeData(dataId);
          setOpenModalAlert(false);
        }}
      />
    </>
  );
};
