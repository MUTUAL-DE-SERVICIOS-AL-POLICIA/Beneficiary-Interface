import { apiClient } from "@/services"

export const getBeneficiary = async (beneficiaryId: string): Promise<any> => {
  try {
    const beneficiary = await apiClient.GET(`api/persons/${beneficiaryId}`)
    const data = await beneficiary.json()
    return data
  } catch (e: any) {
    throw e
  }
}