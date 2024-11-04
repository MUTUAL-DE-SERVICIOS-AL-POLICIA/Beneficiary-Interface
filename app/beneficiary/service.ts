'use server'
import { apiClient } from "@/services"
// import printJS from "print-js"

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
// export const printAffiliateDocument = async (affiliateId: string, procedureDocument: string): Promise<any> => {
//   try {
//     const response = await apiClient.GET(`/api/affiliates/${affiliateId}/documents/${procedureDocument}`)
//     const pdfBlob = await response.blob()
//     const pdfURL = URL.createObjectURL(pdfBlob)
//     printJS({printable: pdfURL, type: 'pdf', showModal: true})
//     URL.revokeObjectURL(pdfURL)
//   } catch(e: any) {
//     throw e
//   }
// }