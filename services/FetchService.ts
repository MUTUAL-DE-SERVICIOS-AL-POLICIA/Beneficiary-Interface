import { APIConnection } from "./APIConnection";

export class FetchService extends APIConnection {

   constructor(baseUrl: string) {
      super(baseUrl)
   }

   async GET(endpoint:string, params?: Record<string, string>): Promise<any> {
      let url = this.buildUrl(endpoint)
      if (params) {
         const queryParams = new URLSearchParams(params).toString();
         url += `?${queryParams}`;
      }
      const requestConfig = this.addInterceptors({
         method: 'GET'
      })
      const response = await fetch(url, requestConfig)

      if(!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
   }

   async POST(endpoint: string, body: any): Promise<any> {
      const url = this.buildUrl(endpoint)
      const requestConfig = this.addInterceptors({
         method: 'POST',
         body: JSON.stringify(body)
      })
      const response = await fetch(url, requestConfig)
      if(!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
   }

   async PUT(endpoint: string, body: any): Promise<any> {
      const url = this.buildUrl(endpoint)
      const requestConfig = this.addInterceptors({
         method: 'PUT',
         body: JSON.stringify(body)
      })
      const response = await fetch(url, requestConfig)
      if(!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
   }
   async DELETE(endpoint: string): Promise<any> {
      const url = this.buildUrl(endpoint)
      const requestConfig = this.addInterceptors({
         method: 'DELETE',
      })
      const response = await fetch(url, requestConfig)
      if(!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
   }

}