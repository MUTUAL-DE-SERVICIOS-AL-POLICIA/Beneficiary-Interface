"use server"
import { apiClient } from "@/services"

export const getBeneficiaries = async (limit: number = 10, page: number = 1, filter?:string ): Promise<any> => {
   try {
      const beneficiaries = await apiClient.GET('api/persons', {
         limit,
         page,
         ...(filter ? { filter } : {})
      })
      return beneficiaries
   } catch(e:any) {
      throw e
   }
}