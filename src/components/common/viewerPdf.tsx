"use client";

import { useEffect, useState } from "react";

interface Props {
  blob: Blob;
}

export const ViewerPdf = ({ blob }: Props) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (blob) {
      const objectUrl = URL.createObjectURL(blob);
      const cleanUrl = `${objectUrl}#toolbar=1&navpanes=0&pagemode=none&scrollbar=0&view=FitH`;

      setUrl(cleanUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [blob]);

  if (!url) return null;

  return <iframe className="w-full h-full border-0" src={url} title="Visor PDF" />;
};
