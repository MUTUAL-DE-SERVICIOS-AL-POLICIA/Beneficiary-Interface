"use client";

import { Button, Input, Label, Card, Surface, toast, Avatar, ListBox } from "@heroui/react";
import { useState } from "react";

import { apiClient } from "@/services";
import { ExcelIcon } from "@/components";

export default function Persons() {
  const dateNow = new Date().toISOString().split("T")[0];

  const [dateFrom, setDateFrom] = useState(dateNow);
  const [dateTo, setDateTo] = useState(dateNow);
  const [, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string[]>([]);

  const downloadReport = async () => {
    try {
      setLoading(true);

      const api = `beneficiaries/reports/${selectedReport[0]}?dateFrom=${dateFrom}&dateTo=${dateTo}`;

      const response = await apiClient.GET(api);

      if (!response.ok) {
        toast.danger("No se pudo generar el reporte");

        return;
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename = contentDisposition?.match(/filename="?([^"]+)"?/i)?.[1] ?? "ventas";

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch {
      toast.danger("No se pudo descargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1 min-w-62.5 max-w-75 2xl:max-w-100 h-full">
        <Card className="relative flex flex-col border-2 h-full w-full min-h-0 gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <Surface className="flex w-full items-center justify-center rounded-xl bg-surface">
              <Label className="w-1/4">Desde</Label>
              <Input
                className="w-3/4"
                defaultValue={dateFrom}
                type="date"
                variant="secondary"
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </Surface>
            <Surface className="flex w-full items-center justify-center rounded-xl bg-surface">
              <Label className="w-1/4">Hasta</Label>
              <Input
                className="w-3/4"
                defaultValue={dateTo}
                type="date"
                variant="secondary"
                onChange={(e) => setDateTo(e.target.value)}
              />
            </Surface>
          </div>
          <Button
            className="mt-auto w-full border-2 bg-emerald-400 hover:bg-emerald-200 text-black"
            isDisabled={selectedReport.length === 0}
            variant="secondary"
            onPress={downloadReport}
          >
            GENERAR
          </Button>
        </Card>
      </div>
      <Card className="card-no-outline flex-1 border-2 p-3 min-w-162.5 h-full">
        <div className="flex w-full flex-col gap-1 overflow-y-auto overflow-x-hidden">
          <ListBox
            aria-label="Assignee"
            className="rounded-xl border border-border/80 bg-surface- p-1 shadow-sm"
            selectionMode="single"
            onSelectionChange={(keys) => {
              const selectedKey = keys instanceof Set ? keys.values().next().value : null;

              setSelectedReport(selectedKey == null ? [] : [String(selectedKey)]);
            }}
          >
            <ListBox.Item
              className="rounded-lg data-[focused=true]:bg-accent/10 data-[selected=true]:bg-accent/30"
              id="registerFingerprints"
              textValue="Bob"
            >
              <Avatar size="md">
                <ExcelIcon className="h-6 w-6" />
              </Avatar>
              <div className="flex flex-col">
                <Label>REPORTE DE BENEFICIARIOS CON HUELLAS DIGITALES REGISTRADAS</Label>
              </div>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>
        </div>
      </Card>
    </>
  );
}
