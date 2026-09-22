"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Ha ocurrido un error.</h2>
      <button onClick={() => reset()}>Volver a Intentar</button>
    </div>
  );
}
