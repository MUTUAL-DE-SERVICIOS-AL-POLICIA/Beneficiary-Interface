import { expect, test } from "vitest"
import { render, screen } from "@testing-library/react"
import Page from "./page"


test("Comprobando el renderizado", () => {
   render(<Page />);
   expect(
      screen.getByRole("heading", { level: 1, name: "Pagina de beneficiarios" }),
   ).toBeDefined();
})