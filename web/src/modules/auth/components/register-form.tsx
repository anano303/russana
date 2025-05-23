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
    );
  }

  return (
    <div className="register-content">
      <h1 className="register-title">რეგისტრაცია</h1>

      {registrationError && (
        <div className="register-error-message">{registrationError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="register-form">
        <div className="register-field">
          <input
            id="name"
            type="text"
            placeholder="სახელი"
            {...register("name")}
          />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>

        <div className="register-field">
          <input
            id="email"
            type="email"
            placeholder="მეილი"
            {...register("email")}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div className="register-field">
          <input
            id="password"
            type="password"
            placeholder="პაროლი"
            {...register("password")}
          />
          {errors.password && (
            <p className="error-text">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="register-button" disabled={isPending}>
          {isPending ? (
            <>
              <span className="register-loading"></span>
              რეგისტრაცია...
            </>
          ) : (
            "რეგისტრაცია"
          )}
        </button>
      </form>

      <div className="register-divider">
        <span>ან</span>
      </div>

      <div className="social-login">
        <button
          className="social-button google-button"
          onClick={handleGoogleAuth}
        >
          <div className="google-icon">
            <FaGoogle />
          </div>
          <span>
            <span className="google-brand">
              <span className="google-blue">G</span>
              <span className="google-red">o</span>
              <span className="google-yellow">o</span>
              <span className="google-blue">g</span>
              <span className="google-green">l</span>
              <span className="google-red">e</span>
            </span>
          </span>
        </button>
      </div>

      <div className="login-prompt">
        თუ ჩვენთან უკვე დააპიპინე გაიარე
        <Link href="/login" className="login-link">
          ავტორიზაცია
        </Link>
      </div>
    </div>
  );
}
