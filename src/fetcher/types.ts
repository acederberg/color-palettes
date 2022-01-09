import { Request, CreateRequest, VarientsRequest } from '../controllers'

export type APIRequest = Request | CreateRequest | VarientsRequest
export type HTTPEnum = 'GET' | 'PUT' | 'READ' | 'UPDATE'
export type CRUDEnum = 'create' | 'read' | 'update' | 'destroy'

export interface Data
{
  create : Function
  read : Function
  update : Function
  destroy : Function
}
