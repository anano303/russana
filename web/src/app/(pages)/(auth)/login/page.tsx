"use client";

import { LoginForm } from "@/modules/auth/components/login-form";
import { AuthLayout } from "@/modules/auth/layouts/auth-layout";
import { useLanguage } from "@/hooks/LanguageContext";
import { Suspense } from "react";
import HeartLoading from "@/components/HeartLoading/HeartLoading";

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <AuthLayout
      title={t("auth.loginWelcome")}
      subtitle={t("auth.loginSubtitle")}
    >
         <Suspense fallback={<HeartLoading size="medium" />}>
      <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
