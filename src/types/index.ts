export type Booking = {
  id: string;
  fullname: string;
  phoneNumber: string;
  styleRequested: string;
  mediumReached: string;
  bookingDate: Date;
  estimatedAmount?: number;
  notes?: string;
  status: "Pending" | "Completed" | "Cancelled";
  createdAt: Date;
  updatedAt: Date;
};

export type Client = {
  id: string;
  fullname: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Transaction = {
  id: string;
  type: "money-in" | "money-out" | "investment" | "withdrawal";
  category: string;
  amount: number;
  description?: string;
  paymentMethod: string;
  transactionDate: Date;
  clientId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InventoryItem = {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  costPrice: number;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  username: string;
  createdAt: Date;
};

export type DashboardStats = {
  todayBookings: number;
  todayIncome: number;
  todayExpenses: number;
  todayProfit: number;
  availableCash: number;
  lowStockItems: InventoryItem[];
  upcomingBookings: Booking[];
};
