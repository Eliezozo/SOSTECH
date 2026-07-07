"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+\-()]{7,20}$/;

type FieldName = "name" | "email" | "phone" | "message";
type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({ dict }: { dict: Dictionary }) {
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "", company: "" });
  const [errors, setErrors] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");

  function update(field: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (field in errors) setErrors((e) => ({ ...e, [field]: false }));
  }

  function validate(): boolean {
    const next: Partial<Record<FieldName, boolean>> = {
      name: values.name.trim().length < 2,
      email: !EMAIL_RE.test(values.email.trim()),
      phone: !PHONE_RE.test(values.phone.trim()),
      message: values.message.trim().length < 10,
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setStatus("success");
        setValues({ name: "", email: "", phone: "", message: "", company: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const fields: { name: FieldName; type: string; autoComplete: string; textarea?: boolean }[] = [
    { name: "name", type: "text", autoComplete: "name" },
    { name: "email", type: "email", autoComplete: "email" },
    { name: "phone", type: "tel", autoComplete: "tel" },
    { name: "message", type: "text", autoComplete: "off", textarea: true },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        value={values.company}
        onChange={(e) => update("company", e.target.value)}
        className="hidden"
        aria-hidden
      />

      {fields.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={`contact-${field.name}`}
            className="mb-2 block text-sm font-medium text-content"
          >
            {dict.contact.form[field.name]}
          </label>
          {field.textarea ? (
            <textarea
              id={`contact-${field.name}`}
              rows={5}
              value={values[field.name]}
              onChange={(e) => update(field.name, e.target.value)}
              className={inputClass(errors[field.name])}
            />
          ) : (
            <input
              id={`contact-${field.name}`}
              type={field.type}
              autoComplete={field.autoComplete}
              value={values[field.name]}
              onChange={(e) => update(field.name, e.target.value)}
              className={inputClass(errors[field.name])}
            />
          )}
          {errors[field.name] && (
            <p className="mt-1.5 text-sm text-red-400">{dict.contact.error[field.name]}</p>
          )}
        </div>
      ))}

      <button type="submit" className="btn-primary w-full" disabled={status === "sending"}>
        {status === "sending" ? dict.contact.form.sending : dict.contact.form.submit}
      </button>

      {status === "success" && (
        <p className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {dict.contact.status.success}
        </p>
      )}
      {status === "error" && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {dict.contact.status.error}
        </p>
      )}
    </form>
  );
}

function inputClass(hasError?: boolean): string {
  return `w-full rounded-md border bg-ink-alt/60 px-4 py-3 text-sm text-content outline-none transition-colors placeholder:text-content-muted/60 focus:border-gold focus:ring-1 focus:ring-gold ${
    hasError ? "border-red-500/60" : "border-white/10"
  }`;
}
