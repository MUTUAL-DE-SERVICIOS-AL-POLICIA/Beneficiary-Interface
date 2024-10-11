"use server"
import { apiClient } from "@/services"
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// export const getCookies = async () => {
//    console.log("getCookies");

//    const cookieStore = cookies();
//    const cookie = cookieStore.get("Set-Cookie");

//    return cookie;
// };

export const getBeneficiaries = async (limit: number = 10, page: number = 1, filter?:string ): Promise<any> => {
   try {
      // const cookie = await getCookies();
      // console.log(cookie)
      // if (cookie == undefined) {
      //    console.log("Sin cookie");
      //    redirect('http://192.168.2.201:3000/');
      // }
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