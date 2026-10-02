'use client';
import Link from 'next/link';
import { useDownload } from '@/components/delivery/useDownload';
export default function DownloadClient() {
 const { step, setStep, email, setEmail, code, setCode, busy, downloading, error, setError, notice, expired, requestCode, verify, download, groups } = useDownload('en');
  return (
    <div className="dl-box">
      {step === 'email' && (
        <form onSubmit={requestCode}>
          <label className="dl-label" htmlFor="dl-email">
            Purchase email
          </label>
          <input
            autoComplete="email"
            className="dl-input"
            id="dl-email"
            inputMode="email"
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
          <button className="btn btn-primary dl-submit" disabled={busy} type="submit">
            {busy ? 'Sending code…' : 'Request verification code'}
          </button>
          <p className="dl-hint muted">
            A six-digit code will be sent to this email. Verification is required because the file belongs to your purchase email.
          </p>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={verify}>
          <label className="dl-label" htmlFor="dl-code">
            Six-digit code from your email
          </label>
          <input
            autoComplete="one-time-code"
            className="dl-input dl-code"
            id="dl-code"
            inputMode="numeric"
            maxLength={6}
            onChange={(ev) => setCode(ev.target.value.replace(/\D/g, ''))}
            pattern="\d{6}"
            placeholder="000000"
            required
            value={code}
          />
          <button className="btn btn-primary dl-submit" disabled={busy} type="submit">
            {busy ? 'Checking…' : 'Verify'}
          </button>
          <p className="dl-hint muted">
            No email? Check your spam folder first. {' '}
            <button className="dl-linklike" disabled={busy} onClick={() => requestCode()} type="button">
              Resend code
            </button>
          </p>
          <p className="dl-hint muted">
            <button
              className="dl-linklike"
              onClick={() => {
                setStep('email');
                setCode('');
                setError('');
              }}
              type="button"
            >
              Change email
            </button>
          </p>
        </form>
      )}

      {step === 'list' && (
        <div>
          <p className="dl-verified">Verified:  {email}</p>

          {groups.length === 0 && <p className="muted">No purchases are available to download.</p>}

          {groups.map((group) => {
            const pending = group.orders.some((o) => o.status === 'pending');
            const refs = group.orders.map((o) => o.orderRef).join(' · ');
            const isDownloading = downloading === group.title;

            return (
              <div className="dl-item" key={group.title}>
                <div className="dl-item-head">
                  <strong>{group.title}</strong>
                  <span className="dl-ref mono">{refs}</span>
                </div>

                {pending && <p className="dl-pending">An order is still awaiting payment confirmation.</p>}

                {group.left > 0 ? (
                  <>
                    <p className="dl-meta">
                      Downloads remaining:  <strong>{group.left}</strong>
                    </p>
                    <button
                      className="btn btn-primary"
                      disabled={isDownloading}
                      onClick={() => download(group)}
                      type="button"
                    >
                      {isDownloading ? 'Preparing your file…' : 'Download Thai PDF'}
                    </button>
                    {isDownloading && (
                      <p className="dl-hint muted">
                        The file is about 1.8 MB. Please wait while it is marked with your email.
                      </p>
                    )}
                  </>
                ) : (
                  !pending && (
                    <p className="dl-pending">
                      Your download allowance has been used. If you need another download, contact pornchai.krong@gmail.com.
                    </p>
                  )
                )}
              </div>
            );
          })}

          {expired && (
            <p className="dl-hint">
              <button className="dl-linklike" disabled={busy} onClick={() => requestCode()} type="button">
                Request a new code to continue
              </button>
            </p>
          )}

          <p className="dl-hint muted">
            Your email is marked on every page except the cover. Lab setup: {' '}
            <Link href="/en/lab">teedba.com/en/lab</Link> Unlimited lab downloads. No verification code required.
          </p>
        </div>
      )}

      {error && <p className="form-err dl-msg">{error}</p>}
      {notice && !error && <p className="form-ok dl-msg">{notice}</p>}
    </div>
  );
}
