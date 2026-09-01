import type { Metadata } from "next";
import { Suspense } from "react";
import { AcceptInvitationForm } from "@/features/auth/components/AcceptInvitationForm";

export const metadata: Metadata = {
  title: "Accept Admin Invitation",
  description:
    "Activate your SpaceShare administrator account by creating a password.",
};


export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={null}>
      <AcceptInvitationForm />
    </Suspense>
  );
}