import type { Booking, BookingPaymentLine } from "@/features/bookings/types/booking.types";



export function getBookingPaymentLines(booking: Booking): BookingPaymentLine[] {
  const commissionPct = Math.round((booking.platformCommission / booking.amount) * 100)

  return [
    { label: `Space Fee (${booking.capacityLabel})`, amount: booking.spaceFee },
    { label: "Selected Add-ons", amount: booking.addOnsTotal },
    { label: "Refundable Caution Fee", amount: booking.cautionFee },
    { label: "Service Fee", amount: booking.serviceFee },
    { label: "Total charged to guest", amount: booking.amount, isTotal: true },
    { label: `Platform Commission (${commissionPct}%)`, amount: booking.platformCommission, isDeduction: true },
    { label: "Net Payout Host", amount: booking.netPayoutHost, isTotal: true },
  ];
}