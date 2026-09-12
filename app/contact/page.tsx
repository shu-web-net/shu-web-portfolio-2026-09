import type { Metadata } from 'next';
import ContactForm from './ContactForm';

const TITLE = 'お問い合わせ | しゅう | Webコーダー ポートフォリオ';
const DESC = 'Webサイト制作・コーディングに関するご相談・お問い合わせはこちらから。';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  openGraph: { type: 'website', url: '/contact/', title: TITLE, description: DESC },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-wrap px-6">
      <section className="mx-auto max-w-xl py-16">
        <h1 className="text-[clamp(24px,4vw,34px)] font-extrabold leading-[1.3]">お問い合わせ</h1>
        <p className="mt-4 text-[15px] leading-[1.9] text-muted">
          Webサイト制作・コーディングのご相談、その他お問い合わせは下記フォームよりお送りください。
          内容を確認の上、3営業日以内を目安にご連絡いたします。
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
