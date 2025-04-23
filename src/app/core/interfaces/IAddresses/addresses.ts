export interface Addresses {
  results: number
  status: string
  data: details[]
}
export interface details {
  _id: string
  name: string
  details: string
  phone: string
  city: string
}
