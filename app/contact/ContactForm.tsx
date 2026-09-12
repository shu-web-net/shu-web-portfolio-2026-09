'use client';

import { useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const TEMPLATE_ID_NOTIFY = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_NOTIFY!;
const TEMPLATE_ID_AUTOREPLY = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_AUTOREPLY!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');

    const params = {
      from_name: (form.elements.namedItem('from_name') as HTMLInputElement).value,
      from_email: (form.elements.namedItem('from_email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      // 通知（自分宛）と自動返信（問い合わせした人宛）を両方送る
      await emailjs.send(SERVICE_ID, TEMPLATE_ID_NOTIFY, params, { publicKey: PUBLIC_KEY });
      await emailjs.send(SERVICE_ID, TEMPLATE_ID_AUTOREPLY, params, { publicKey: PUBLIC_KEY });
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="rounded-xl border border-line bg-surface p-8 text-center">
        <p className="text-[15px]">
          お問い合わせありがとうございます。内容を確認の上、3営業日以内を目安にご連絡いたします。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="from_name" className="font-mono text-[13px] text-muted">
          お名前
        </label>
        <input
          id="from_name"
          name="from_name"
          type="text"
          required
          disabled={status === 'sending'}
          className="rounded-lg border border-line bg-surface px-4 py-3 text-[15px] outline-none transition focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="from_email" className="font-mono text-[13px] text-muted">
          メールアドレス
        </label>
        <input
          id="from_email"
          name="from_email"
          type="email"
          required
          disabled={status === 'sending'}
          className="rounded-lg border border-line bg-surface px-4 py-3 text-[15px] outline-none transition focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="font-mono text-[13px] text-muted">
          お問い合わせ内容
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={7}
          disabled={status === 'sending'}
          className="rounded-lg border border-line bg-surface px-4 py-3 text-[15px] outline-none transition focus:border-accent"
        />
      </div>

      <button type="submit" disabled={status === 'sending'} className="btn btn-primary self-start">
        {status === 'sending' ? '送信中…' : '送信する'}
      </button>

      {status === 'error' && (
        <p className="text-[13px] text-red-500">
          送信に失敗しました。お手数ですが時間をおいて再度お試しください。
        </p>
      )}
    </form>
  );
}
