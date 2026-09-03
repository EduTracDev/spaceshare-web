import Image from "next/image";
import { Check, Users, DollarSign, CalendarCheck2, CalendarCheck2Icon, Wallet, PartyPopper, LucidePartyPopper, PartyPopperIcon, CircleCheckBig, CircleCheck, Mail, Phone, Calendar } from "lucide-react";

export function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-[#6200EE] text-white flex-col gap-12 px-10 py-10 xl:px-20 xl:py-12 rounded-tr-[40px] rounded-br-[40px] relative overflow-hidden">
      {/* Top section */}
      <div className="relative z-10 space-y-8 xl:space-y-10">
        <div className="flex items-center gap-2">
          <Image src="/vybeshare-logo-white.svg" alt="logo" width={167} height={32} priority />
        </div>
        <h1 className="text-[32px] xl:text-3xl leading-tight max-w-md">
          Powering Bookings Behind the Scenes
        </h1>
      </div>




      {/* DECORATIVE UI CARDS */}
      <div className="relative z-10 h-[320px] xl:h-full">
        {/* Success check badge */}
        <div className="absolute top-22 right-78 xl:right-98 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
          <div className="w-8 h-8 bg-green-500 rounded-full z-10 flex items-center justify-center">
            <Check size={18} strokeWidth={3.5} />
          </div>
        </div>

        {/* Top: Activity Timeline Card */}
        <div className="absolute top-0 right-4 xl:right-18 z-10 bg-white rounded-2xl p-4 py-3 shadow-2xl w-[280px] xl:w-[310px]">
          <div className="flex items-center gap-2 mb-3 border border-gray-100 rounded-md p-2">
            <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
              <CalendarCheck2Icon size={12} className="text-green-600" strokeWidth={3} />
            </div>
            <span className="text-xs font-medium text-gray-900">Request Sent</span>
            <div className="ml-auto w-5 h-5 rounded-full bg-green-50 flex items-center justify-center">
              <CircleCheck size={12} className="text-green-600" strokeWidth={3} />
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5  border border-gray-100 rounded-md p-2">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                <Users size={12} className="text-blue-600" />
              </div>
              <span className="text-xs text-gray-700">Host Review</span>
              <span className="text-[10px] text-gray-400 ml-auto">11-June-2026</span>
            </div>
            <div className="flex items-center gap-2.5  border border-gray-100 rounded-md p-2">
              <div className="w-6 h-6 rounded-full bg-pink-50 flex items-center justify-center">
                <Wallet size={12} className="text-pink-600" />
              </div>
              <span className="text-xs text-gray-700">Payment</span>
            </div>
            <div className="flex items-center gap-2.5  border border-gray-100 rounded-md p-2">
              <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center">
                <PartyPopper size={12} className="text-orange-600" />
              </div>
              <span className="text-xs text-gray-700">Event Completed</span>
              <span className="text-[10px] text-gray-400 ml-auto">23-June-2026</span>
            </div>
          </div>
        </div>


        <div className="z-5 absolute space-y-4 top-52 left-10 xl:left-16 bg-white rounded-2xl shadow-2xl w-[300px] xl:w-[320px] text-gray-900">
          {/* Booking ID Card */}
          <div className="flex items-center justify-between bg-gray-100 w-full py-2 rounded-t-2xl px-6 pt-4">
            <span className="text-[10px] font-medium text-gray-500">Booking ID:</span>
            <span className="text-xs font-semibold">#BK-512</span>
          </div>
          <div className="border-b border-gray-100 px-6 pb-4 space-y-2">
            <div className="text-[10px] text-gray-400">Host Details</div>
            <div className="flex items-center gap-2">
              <div className="text-xs font-medium">Olayinka Bode</div>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <Mail size={14} className="text-gray-600"/>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <Phone size={14} className="text-gray-600"/>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="z-12 absolute bottom-[-20] left-6 xl:left-26 bg-white rounded-2xl p-4 shadow-2xl w-[300px] xl:w-[320px] text-gray-900">
          {/* Date + Breakdown */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
              <span className="text-[10px] text-gray-800 flex items-center gap-1">
                 <Calendar size={12} className="text-gray-800"/>
                 <span>Date</span>
              </span>
              <span className="text-xs font-medium">Sat 22, June 2026</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-600">Space Fee</span>
                <span className="font-medium">₦250,000</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-600">Selected Add-ons</span>
                <span className="font-medium">₦48,000</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-600">Refundable Caution Fee</span>
                <span className="font-medium">₦50,000</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-600 flex items-center gap-1">Service Fee ⓘ</span>
                <span className="font-medium">₦6,250</span>
              </div>
              <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>₦354,250</span>
              </div>
            </div>          
        </div>
      </div>
    </div>
  );
}