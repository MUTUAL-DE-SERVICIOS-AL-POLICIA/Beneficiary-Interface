"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Ah ocurrido un error!</h2>
      <button onClick={() => reset()}>Volver a Intentar</button>
    </div>
  );
}
