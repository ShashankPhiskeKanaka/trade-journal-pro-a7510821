export interface Trade {
  id: string;
  name: string;
  buyValue: number;
  sellValue: number;
  quantity: number;
  date: string;
  buyTime: string;
  sellTime: string;
}

export interface TradeCreatePayload {
  name: string;
  buyValue: number;
  sellValue: number;
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
