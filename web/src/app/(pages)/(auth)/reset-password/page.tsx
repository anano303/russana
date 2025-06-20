import { Suspense } from "react";
import { ResetPasswordForm } from "@/modules/auth/components/reset-password";
import { AuthLayout } from "@/modules/auth/layouts/auth-layout";
import HeartLoading from "@/components/HeartLoading/HeartLoading";

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Please fill in the password recovery form"
    >
      <Suspense fallback={<HeartLoading size="medium" />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
