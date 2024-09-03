import { cleanup, render, screen } from "@testing-library/react";
import { describe } from "node:test";
import { afterEach, expect, test } from "vitest";
import Page from "./page";
import BeneficiaryLayout from "../layout";

describe("Page Beneficiary", () => {
   afterEach(cleanup)
   describe("Render component view beneficiary", () => {
      test("should show text", () => {
         render(<BeneficiaryLayout><Page /></BeneficiaryLayout>)
         const title = screen.getByText('SUB TENIENTE')
         expect(title).toBeDefined()
      })
   })
})