"use client";

import { Heart } from "lucide-react";
import "./auth-layout.css";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      {/* Floating hearts background */}
      <div className="floating-heart"></div>
      <div className="floating-heart"></div>
      <div className="floating-heart"></div>
      <div className="floating-heart"></div>
      <div className="floating-heart"></div>
      <div className="floating-heart"></div>
      <div className="floating-heart"></div>
      <div className="floating-heart"></div>
      <div className="floating-heart"></div>
      <div className="floating-heart"></div>

      <div className="auth-layout-inner">
        <div className="auth-layout-header">
          <Heart color="#e91e63" fill="#e91e63" size={32} className="mb-2" />
          <h1 className="auth-layout-title">{title}</h1>
          <p className="auth-layout-subtitle">{subtitle}</p>
        </div>
        <div className="auth-layout-children">{children}</div>
      </div>
    </div>
  );
}
