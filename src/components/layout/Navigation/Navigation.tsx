/**
 * Main navigation component
 */

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useModalState } from "@/components/ui/Modal";
import { ContactForm } from "@/components/forms/ContactForm";
import { Modal } from "@/components/ui/Modal";
import { MessageSquare, Home, FileText, Database, Zap } from "lucide-react";
import styles from "./Navigation.module.scss";

const navigationItems = [
  {
    href: "/",
    label: "Главная",
    icon: Home,
    description: "Добро пожаловать на главную страницу",
  },
  {
    href: "/ssg",
    label: "SSG",
    icon: FileText,
    description: "Static Site Generation - статическая генерация",
  },
  {
    href: "/ssr",
    label: "SSR",
    icon: Database,
    description: "Server-Side Rendering - серверный рендеринг",
  },
  {
    href: "/isr",
    label: "ISR",
    icon: Zap,
    description: "Incremental Static Regeneration",
  },
  {
    href: "/csr",
    label: "CSR",
    icon: MessageSquare,
    description: "Client-Side Rendering - клиентский рендеринг",
  },
];

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { isOpen, open, close } = useModalState();

  return (
    <>
      <nav
        className={styles.navigation}
        role="navigation"
        aria-label="Основная навигация"
      >
        <div className="container">
          <div className={styles.navContent}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <h1>Next.js Test Task</h1>
            </Link>

            {/* Navigation Links */}
            <ul className={styles.navList}>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(styles.navLink, {
                        [styles.navLinkActive]: isActive,
                      })}
                      title={item.description}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                      {isActive && <span className={styles.activeIndicator} />}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Contact Button */}
            <Button
              variant="primary"
              size="md"
              onClick={open}
              leftIcon={<MessageSquare size={18} />}
            >
              Связаться
            </Button>
          </div>
        </div>
      </nav>

      {/* Contact Modal */}
      <Modal isOpen={isOpen} onClose={close} title="Связаться с нами" size="md">
        <ContactForm
          onSuccess={() => {
            close();
          }}
        />
      </Modal>
    </>
  );
};
