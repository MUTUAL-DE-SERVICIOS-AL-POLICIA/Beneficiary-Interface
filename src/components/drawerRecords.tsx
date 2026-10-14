"use client";
import { Button, Drawer, Spinner, useOverlayState } from "@heroui/react";
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
  const state = useOverlayState();
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
    state.toggle();
    setIsLoading(false);
  };

  return (
    <>
      <Button isPending={isLoading} variant="secondary" onPress={openDrawer}>
        Historial
        {isLoading ? <Spinner size="md" /> : <HistoryIcon />}
      </Button>
      <Drawer.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Drawer.Content placement="right">
          <Drawer.Dialog className="w-200">
            <Drawer.Header className="flex flex-col gap-1">
              <Drawer.Heading className="text-3xl">Historial de acciones</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
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
                      {showYearBox && (
                        <div className="text-2xl font-bold text-cyan-950 sticky top-0 bg-background z-20 border-b border-default-200">
                          {year}
                        </div>
                      )}
                      <div className="flex gap-3 items-start relative">
                        {!isLast &&
                          (() => {
                            return (
                              <span
                                className="absolute left-5.5 top-0 bottom-0 w-1"
                                style={{ backgroundColor: lineColor }}
                              />
                            );
                          })()}
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
            </Drawer.Body>
            <Drawer.Footer>
              <Button slot="close" variant="danger-soft">
                Cerrar
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </>
  );
};
