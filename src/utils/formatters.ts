export const formatCurrency = (
  amount: number,
  currency: string = "NGN",
  locale: string = "en-NG"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(
    "en-NG",
    options ?? {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-NG", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
};