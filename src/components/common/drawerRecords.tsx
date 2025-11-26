"use client";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { useState } from "react";

import { HistoryIcon } from "@/components";

interface RecordItem {
  id: number;
  action: string;
  description: string;
  createdAt: string;
}

export const colors: Record<string, string> = {
  POST: "rgb(102, 187, 106)",
  GET: "rgb(149, 117, 205)",
  PUT: "rgb(100, 200, 255)",
  PATCH: "rgb(100, 200, 255)",
  DELETE: "rgb(239, 110, 80)",
};

interface Props {
  data: RecordItem[] | [];
  getData: () => void;
}

export const DrawerRecords = ({ data, getData }: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString("es-ES", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    const hour = date.toLocaleString("es-ES", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
    const dateOnly = date.toISOString().split("T")[0]; // yyyy-mm-dd

    return { month, day, hour, year, dateOnly };
  };

  const processedData = data.map((item) => ({
    ...item,
    formatted: formatDate(item.createdAt),
  }));

  const openDrawer = async () => {
    setIsLoading(true);
    await getData();
    onOpen();
    setIsLoading(false);
  };

  return (
    <>
      <Button
        color="secondary"
        endContent={<HistoryIcon />}
        isLoading={isLoading}
        variant="bordered"
        onPress={openDrawer}
      >
        {" "}
        Historial
      </Button>
      <Drawer
        hideCloseButton
        backdrop="opaque"
        classNames={{
          base: "sm:data-[placement=right]:m-2 sm:data-[placement=left]:m-2 rounded-medium",
        }}
        isOpen={isOpen}
        size="3xl"
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Historial de acciones</DrawerHeader>
              <DrawerBody>
                <div className="flex flex-col relative">
                  {processedData.map((item, index) => {
                    const { month, day, hour, year, dateOnly } = formatDate(item.createdAt);
                    const prevItem = processedData[index - 1];
                    const prevDate = prevItem ? formatDate(prevItem.createdAt).dateOnly : null;
                    const showDateBox = dateOnly !== prevDate;
                    const isLast = index === processedData.length - 1;
                    const prevYear = prevItem ? formatDate(prevItem.createdAt).year : null;
                    const showYearBox = year !== prevYear;
                    const actionText = item.action ?? "";
                    const actionType = actionText.split(":")[0].toUpperCase();
                    const lineColor = colors[actionType] || "gray";

                    return (
                      <div key={item.id} className="relative flex flex-col gap-2 mb-3">
                        {/* {showYearBox && (
                          <div className="text-large font-bold text-default-900">
                            {year}
                          </div>
                        )} */}
                        {showYearBox && (
                          <div className="text-large font-bold text-default-900 sticky top-0 bg-background z-20 border-b border-default-200">
                            {year}
                          </div>
                        )}
                        <div className="flex gap-3 items-start relative">
                          {!isLast &&
                            (() => {
                              return (
                                <span
                                  className="absolute left-[22px] top-0 bottom-0 w-1"
                                  style={{ backgroundColor: lineColor }}
                                />
                              );
                            })()}
                          {/* {showDateBox ? (
                            <div className="flex-none border border-default-500/50 rounded-small text-center w-11 overflow-hidden z-10 bg-background">
                              <div className="text-tiny bg-default-200 py-0.5 text-default-900 uppercase font-semibold">
                                {month}
                              </div>
                              <div className="flex items-center justify-center font-bold text-medium h-6 text-default-500">
                                {day}
                              </div>
                            </div>
                          ) : (
                            <div className="flex-none w-11"></div>
                          )} */}
                          {showDateBox ? (
                            <div className="flex-none border border-default-500/50 rounded-small text-center w-11 overflow-hidden sticky top-8 z-10 bg-background">
                              <div className="text-tiny bg-default-200 py-0.5 text-default-900 uppercase font-semibold">
                                {month}
                              </div>
                              <div className="flex items-center justify-center font-bold text-medium h-6 text-default-500">
                                {day}
                              </div>
                            </div>
                          ) : (
                            <div className="flex-none w-11" />
                          )}
                          <div
                            className="flex flex-col w-full relative border p-2 rounded-md"
                            style={{ borderColor: lineColor }}
                          >
                            <p className="text-medium text-foreground font-medium">{item.description}</p>
                            <div className="flex justify-end text-tiny text-default-500 items-center">
                              <span>
                                {day} {month} {year}, {hour}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
