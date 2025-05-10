"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle, FaCheck } from "react-icons/fa";
import { toast } from "@/hooks/use-toast";
import { useRegister } from "../hooks/use-auth";
import "./register-form.css";
import { useLanguage } from "@/hooks/LanguageContext";

// Import the schema directly from validation.ts
import { registerSchema, type RegisterSchema } from "../validation";

export function RegisterForm() {
  const { t } = useLanguage();
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );

  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    setRegistrationError(null);

    interface RegisterUserOptions {
      onSuccess: () => void;
      onError: (error: { message?: string }) => void;
    }

    registerUser(data, {
      onSuccess: () => {
        setIsSuccess(true);
        toast({
          title: t("auth.registrationSuccessful"),
          description: t("auth.accountCreatedSuccessfully"),
          variant: "default",
        });

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      },
      onError: (error: { message?: string }) => {
        setRegistrationError(
          error.message || "Registration failed. Please try again."
        );
        toast({
          title: t("auth.registrationFailed"),
          description: error.message,
          variant: "destructive",
        });
      },
    } as RegisterUserOptions);
  };
  const handleGoogleAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  if (isSuccess) {
    return (
      <div className="register-container">
        <div className="register-content">
          <div className="register-success">
            <div className="register-success-icon">
              <FaCheck />
            </div>
            <h3 className="register-success-title">
              {t("auth.registrationSuccessful")}
            </h3>
            <p className="register-success-text">
              {t("auth.accountCreatedSuccessfully")}
            </p>
            <p className="register-success-text">
              {t("auth.redirectingToLogin")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-decoration"></div>
      <div className="register-circles"></div>

      <div className="register-content">
        <div className="register-header">
          <h2 className="register-title">{t("auth.createAccount")}</h2>
        </div>

        {registrationError && (
          <div className="register-error-message">{registrationError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <div className="register-field">
            <label className="register-label" htmlFor="name">
              {t("auth.fullName")}
            </label>
            <input
              className="register-input"
              id="name"
              type="text"
              placeholder="John Doe"
              {...register("name")}
            />
            {errors.name && (
              <p className="register-error">{errors.name.message}</p>
            )}
          </div>

          <div className="register-field">
            <label className="register-label" htmlFor="email">
              {t("auth.email")}
            </label>
            <input
              className="register-input"
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="register-error">{errors.email.message}</p>
            )}
          </div>

          <div className="register-field">
            <label className="register-label" htmlFor="password">
              {t("auth.password")}
            </label>
            <input
              className="register-input"
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="register-error">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="register-loading"></span>
                {t("auth.registering")}...
              </>
            ) : (
              <>{t("auth.register")}</>
            )}
          </button>
        </form>

        <div className="register-separator">
          <span>{t("auth.orContinueWith")}</span>
        </div>

        <div className="social-buttons">
          <button
            className="social-button"
            onClick={handleGoogleAuth}
            disabled={isPending}
          >
            <span className="google-icon">
              <FaGoogle />
            </span>
            Google
          </button>
        </div>

        <div className="register-footer">
          {t("auth.alreadyHaveAccount")}{" "}
          <Link href="/login" className="login-link">
            {t("auth.login")}
          </Link>
        </div>
      </div>
    </div>
  );
}
