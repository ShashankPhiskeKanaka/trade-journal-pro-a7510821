export interface Trade {
  _id: string;
  name: string;
  buyval: number;
  sellval: number;
  quantity: number;
  date: string;
  buytime: string;
  selltime: string;
  unrealisedgains?: number;
  charges?: number;
  realisedgains?: number;
}

export interface TradeCreatePayload {
  name: string;
  buyval: number;
  sellval: number;
  quantity: number;
  date: string;
  buytime: string;
  selltime: string;
}

export interface TradeDeletePayload {
  id: string;
}

export interface AuthUser {
  email: string;
  password: string;
}
