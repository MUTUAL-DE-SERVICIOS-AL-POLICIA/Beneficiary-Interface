"use client";

import { useEffect, useState } from "react";

export const ViewerPdf = ({ blob }: { blob: Blob }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (blob) {
      const objectUrl = URL.createObjectURL(blob);
      const cleanUrl = `${objectUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

      setUrl(cleanUrl);

      return () => {
        URL.revokeObjectURL(objectUrl); // limpieza
      };
    }
  }, [blob]);

  if (!url) return null;

  return <iframe className="w-full h-[90vh] border-0" src={url} title="Visor PDF" />;
};
