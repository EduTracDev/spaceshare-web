"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleCheckBig } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { UserManagementTable } from "@/features/users/components/UserManagementTable";
import { UserDetailsSheet } from "@/features/users/components/UserDetailsSheet";
import { SuspendUserDialog } from "@/features/users/components/SuspendUserDialog";
import { InviteAdminDialog } from "@/features/users/components/InviteAdminDialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { userService } from "@/services/user.service";
import type { AnyUser } from "@/features/users/types/user.types";

export default function UsersManagementPage() {
  const queryClient = useQueryClient();

  // Sheets & Dialogs state
  const detailsSheet = useDisclosure();
  const suspendDialog = useDisclosure();
  const reactivateDialog = useDisclosure();
  const inviteDialog = useDisclosure();
  const [selectedUser, setSelectedUser] = React.useState<AnyUser | null>(null);

  const refetchUsers = () =>
    queryClient.invalidateQueries({ queryKey: ["users"] });

  // Suspend mutation
  const suspendMutation = useMutation({
    mutationFn: (u: AnyUser) => userService.suspendUser(u.id),
    onSuccess: (r) => {
      toast.success(r.message);
      suspendDialog.close();
      setSelectedUser(null);
      refetchUsers();
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Failed to suspend user");
    },
  });

  // Reactivate mutation
  const reactivateMutation = useMutation({
    mutationFn: (u: AnyUser) => userService.reactivateUser(u.id),
    onSuccess: (r) => {
      toast.success(r.message);
      reactivateDialog.close();
      setSelectedUser(null);
      refetchUsers();
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Failed to reactivate user");
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader bleed
        title="User Management"
        subtitle="Manage hosts and guests across VybeSpace."
      />

      <UserManagementTable
        onInviteAdminClick={inviteDialog.open}
        onViewDetails={(user) => {
          setSelectedUser(user);
          detailsSheet.open();
        }}
        onSuspend={(user) => {
          setSelectedUser(user);
          suspendDialog.open();
        }}
        onReactivate={(user) => {
          setSelectedUser(user);
          reactivateDialog.open();
        }}
      />

      <UserDetailsSheet
        open={detailsSheet.isOpen}
        onOpenChange={detailsSheet.toggle}
        user={selectedUser}
        onSuspendClick={(user) => {
          setSelectedUser(user);
          suspendDialog.open();
        }}
        onReactivateClick={(user) => {
          setSelectedUser(user);
          reactivateDialog.open();
        }}
      />

      <SuspendUserDialog
        open={suspendDialog.isOpen}
        onOpenChange={suspendDialog.toggle}
        user={selectedUser}
        onConfirm={(user) => suspendMutation.mutate(user)}
        loading={suspendMutation.isPending}
      />

      <ConfirmationDialog
        open={reactivateDialog.isOpen}
        onOpenChange={reactivateDialog.toggle}
        tone="success"
        icon={CircleCheckBig}
        title="Reactivate user account?"
        description={
          selectedUser
            ? `${selectedUser.fullName} will immediately regain access to their VybeSpace account, dashboard, and active listings or bookings.`
            : "The selected user will immediately regain access to their VybeSpace account."
        }
        confirmLabel="Reactivate user"
        cancelLabel="Cancel"
        confirmLoading={reactivateMutation.isPending}
        onConfirm={() => {
          if (!selectedUser) return;
          reactivateMutation.mutate(selectedUser);
        }}
      />

      <InviteAdminDialog
        open={inviteDialog.isOpen}
        onOpenChange={inviteDialog.toggle}
        onSuccess={() => refetchUsers()}
      />
    </div>
  );
}