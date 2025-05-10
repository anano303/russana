"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin } from "../hooks/use-auth";
import { FaGoogle, FaEnvelope, FaLock, FaHeart } from "react-icons/fa";
import { toast } from "@/hooks/use-toast";
import "./login-form.css";
import { useLanguage } from "@/hooks/LanguageContext";

const schema = z.object({
  email: z.string().email({ message: "არასწორი ელ-ფოსტის ფორმატი" }),
  password: z.string().min(6, { message: "მინიმუმ 6 სიმბოლო" }),
});

type LoginFormValues = z.infer<typeof schema>;

export function LoginForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const router = useRouter();

  const [loginError, setLoginError] = useState<string | null>(null);

  const { mutate: loginUser, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoginError(null);

    loginUser(data, {
      onSuccess: () => {
        toast({
          title: t("auth.loginSuccess"),
          description: t("auth.welcomeBack"),
          variant: "default",
        });
        router.push(redirect);
      },
      onError: (error: { message?: string }) => {
        setLoginError(error.message || "Login failed. Please try again.");
        toast({
          title: t("auth.loginFailed"),
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };
  const handleGoogleAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="login-container">
      <div className="login-wave"></div>

      <div className="login-content">
        <div className="login-greeting">
          <div className="login-greeting-icon">
            <FaHeart />
          </div>
          <p className="login-greeting-text">{t("auth.welcomeBack")}</p>
        </div>

        {loginError && <div className="login-error">{loginError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="login-field">
            <label htmlFor="email">{t("auth.email")}</label>
            <input
              id="email"
              type="email"
              placeholder="youremail@example.com"
              {...register("email")}
            />
            <FaEnvelope className="login-field-icon" />
            {errors.email && (
              <p className="error-text">{errors.email.message}</p>
            )}
          </div>

          <div className="login-field">
            <label htmlFor="password">{t("auth.password")}</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            <FaLock className="login-field-icon" />
            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
          </div>

          <Link href="/forgot-password" className="forgot-password">
            {t("auth.forgotPassword")}
          </Link>

          <button type="submit" className="login-button" disabled={isPending}>
            {isPending ? (
              <>
                <span className="login-loading"></span>
                {t("auth.loggingIn")}...
              </>
            ) : (
              t("auth.loginButton")
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>{t("auth.orContinueWith")}</span>
        </div>

        <div className="social-login">
          <button
            className="social-button google-button"
            onClick={handleGoogleAuth}
          >
            <FaGoogle />
            <span>Google</span>
          </button>
        </div>

        <div className="register-prompt">
          {t("auth.dontHaveAccount")}{" "}
          <Link href="/register" className="register-link">
            {t("auth.createAccount")}
          </Link>
        </div>
      </div>
    </div>
  );
}
