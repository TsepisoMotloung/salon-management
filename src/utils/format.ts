export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (date: Date): string => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateTime = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCurrency = (amount: number): string => {
  return `R${amount.toFixed(2)}`;
};

export const parseCurrency = (str: string): number => {
  return parseFloat(str.replace(/[^0-9.-]+/g, ""));
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

export const getDateRange = (
  type: "day" | "week" | "month" | "year"
): { start: Date; end: Date } => {
  const today = new Date();
  const start = new Date();
  const end = new Date();

  switch (type) {
    case "week":
      start.setDate(today.getDate() - today.getDay());
      break;
    case "month":
      start.setDate(1);
      break;
    case "year":
      start.setMonth(0);
      start.setDate(1);
      break;
    case "day":
    default:
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
  }

  end.setHours(23, 59, 59, 999);
  return { start, end };
};
