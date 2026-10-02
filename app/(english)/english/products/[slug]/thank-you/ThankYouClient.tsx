'use client';
import Link from 'next/link';
import { usePaymentStatus } from '@/components/delivery/usePaymentStatus';
export default function ThankYouClient({ sessionId }: { sessionId: string }) {
 const { state, info } = usePaymentStatus(sessionId);
  if (state === 'ready') {
    return (
      <div className="dl-box">
        <p className="dl-verified">
          Payment confirmed {info?.orderRef && <span className="mono">{info.orderRef}</span>}
        </p>
        <p style={{ margin: '0 0 18px', lineHeight: 1.7 }}>
          Your download is ready. A link has also been sent to your email for later.
        </p>
        <a
          className="btn btn-primary dl-submit"
          href={`/api/download/file?session=${encodeURIComponent(sessionId)}`}
        >
          Download Thai PDF
        </a>
        <p className="dl-hint muted">
          Your email is marked on every page except the cover. Lab setup: {' '}
          <Link href="/en/lab">teedba.com/en/lab</Link> Unlimited downloads.
        </p>
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className="dl-box">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Payment was not confirmed. To try again, return to the product page. If your account was charged, contact pornchai.krong@gmail.com before trying again.
        </p>
      </div>
    );
  }

  if (state === 'expired' || state === 'timeout') {
    return (
      <div className="dl-box">
        <p style={{ margin: '0 0 14px', lineHeight: 1.7 }}>
          {state === 'expired'
            ? 'This page link has expired.'
            : 'Payment confirmation is taking longer than expected.'}
        </p>
        <p style={{ margin: '0 0 18px', lineHeight: 1.7 }}>
          Once payment is confirmed, a download link will be emailed to you. You can also return to the download page.
        </p>
        <Link className="btn btn-primary dl-submit" href="/english/download">
          Go to downloads
        </Link>
      </div>
    );
  }

  return (
    <div className="dl-box">
      <p style={{ margin: '0 0 12px', lineHeight: 1.7 }}>
        Order received. Waiting for payment confirmation.
      </p>
      <p className="muted" style={{ margin: 0, lineHeight: 1.7, fontSize: 14 }}>
        PromptPay confirmation may take a moment. A download button appears after confirmation. You can close this page; the download link is also sent by email.
      </p>
    </div>
  );
}
