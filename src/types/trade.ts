export interface Trade {
  _id: string;
  name: string;
  buyVal: number;
  sellVal: number;
  quantity: number;
  date: string;
  buyTime: string;
  sellTime: string;
  unrealisedgains?: number;
  charges?: number;
  realisedgains?: number;
}

export interface TradeCreatePayload {
  name: string;
  buyVal: number;
  sellVal: number;
  quantity: number;
  date: string;
  buyTime: string;
  sellTime: string;
}

export interface TradeDeletePayload {
  id: string;
}

export interface AuthUser {
  email: string;
  password: string;
}
