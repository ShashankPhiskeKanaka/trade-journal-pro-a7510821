export interface Trade {
  _id: string;
  name: string;
  buyVal: number;
  sellVal: number;
  quantity: number;
  date: string;
  buyTime: string;
  sellTime: string;
  // New calculated fields from backend
  unrealisedgains: number; // Gross P/L before charges
  charges: number;         // Total taxes + brokerage
  realisedgains: number;   // Net P/L (Final profit/loss)
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
