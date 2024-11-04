'use server'
import { apiClient } from "@/services"

export const getBeneficiary = async (beneficiaryId: string): Promise<any> => {
  try {
    const beneficiary = await apiClient.GET(`api/persons/findPersonAffiliatesWithDetails/${beneficiaryId}`)
    const data = await beneficiary.json()
    return data
  } catch (e: any) {
    throw e
  }
}

export const getAffiliate = async (affiliateId: string): Promise<any> => {
  try {
    const affiliate = await apiClient.GET(`api/affiliates/${affiliateId}`)
    const data = await affiliate.json()
    return data
  } catch(e: any) {
    throw e
  }
}

export const obtainAffiliateDocuments = async (affiliateId: string): Promise<any> => {
  try {
    const documents = await apiClient.GET(`api/affiliates/${affiliateId}/documents`)
    const data = await documents.json()
    return data
  } catch(e: any) {
    throw e
  }
}