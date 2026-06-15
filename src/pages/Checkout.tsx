import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { LucideIcon } from '../components/LucideIcon';

export function Checkout() {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const { total } = useCartStore((state) => state.getTotals)();
  const currentUser = useAuthStore((state) => state.user);
  const upiId   = useSettingsStore((s) => s.upi_id);
  const upiName = useSettingsStore((s) => s.upi_name);

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | 'upi'>('upi');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUpiPending, setIsUpiPending] = useState(false);

  const [utrNumber, setUtrNumber] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState('');
  const [proofUploading, setProofUploading] = useState(false);
  const proofInputRef = useRef<HTMLInputElement>(null);

  const [dispatchedCredentials, setDispatchedCredentials] = useState<{ service: string; email: string; password: string; instructions?: string }[]>([]);
  const [orderError, setOrderError] = useState('');

  const token = useAuthStore((state) => state.token);
  const { subtotal, discount } = useCartStore((state) => state.getTotals)();

  const handleProofSelect = (file: File) => { setProofFile(file); setProofPreview(URL.createObjectURL(file)); };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    if (paymentMethod === 'upi') {
      if (!utrNumber.trim()) { setOrderError('Please enter your UTR / reference number.'); return; }
      if (!proofFile) { setOrderError('Please upload your payment screenshot.'); return; }
    }
    setIsSubmitting(true);
    setOrderError('');
    try {
      let proofUrl = '';
      if (paymentMethod === 'upi' && proofFile) {
        setProofUploading(true);
        const fd = new FormData();
        fd.append('proof', proofFile);
        const upRes = await fetch('/api/orders/upload-proof', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
        const upData = await upRes.json();
        if (!upRes.ok) throw new Error(upData.error || 'Proof upload failed');
        proofUrl = upData.url;
        setProofUploading(false);
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          items: cartItems.map((item) => ({ productId: item.id, name: item.name, price: item.price, originalPrice: item.originalPrice, quantity: item.quantity, isBundle: item.isBundle, logo: item.logo })),
          subtotal, discount, total, paymentMethod,
          userEmail: email.trim(), userName: name.trim(),
          utrNumber: utrNumber.trim() || undefined, paymentProof: proofUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');

      clearCart();
      if (paymentMethod === 'upi') setIsUpiPending(true);
      else { setDispatchedCredentials(data.order.credentials); setIsSuccess(true); }
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setProofUploading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const payBtnCls = (active: boolean) =>
    `p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 font-bold text-xs transition-all cursor-pointer ${active ? 'border-brand-500 bg-brand-500/10 text-brand-400' : 'border-line text-slate-400 hover:border-slate-600'}`;
  const inputCls = 'bg-surface-2 px-3.5 py-2.5 rounded-xl border border-line focus:outline-none focus:border-brand-500 text-xs font-bold text-white placeholder-slate-500';

  if (cartItems.length === 0 && !isSuccess && !isUpiPending) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center pt-10 pb-16 px-4">
        <div className="text-center max-w-sm flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-brand-500/15 text-brand-400"><LucideIcon name="ShoppingCart" size={32} /></div>
          <h1 className="text-2xl font-black text-white tracking-tight">Checkout is Empty</h1>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">You don't have any subscriptions in your cart to checkout.</p>
          <Link to="/products" className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-500/25 cursor-pointer">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-8 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {isUpiPending ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-line shadow-2xl shadow-black/40 max-w-xl mx-auto flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center"><LucideIcon name="Clock" size={30} strokeWidth={2} /></div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase">Pending Verification</span>
              <h1 className="text-2xl font-black text-white tracking-tight mt-3">Payment Submitted!</h1>
              <p className="text-sm text-slate-400 font-semibold mt-2 leading-relaxed">
                We've received your payment proof. Our team will verify it and send a confirmation email to <strong className="text-slate-200">{email}</strong> within <strong className="text-brand-400">2–5 minutes</strong>.
              </p>
            </div>
            <div className="w-full p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-left space-y-2">
              {[{ icon: 'QrCode', text: 'UPI payment proof received' }, { icon: 'Mail', text: 'Confirmation email will be sent to your inbox' }, { icon: 'Zap', text: 'Credentials delivered within 2–5 minutes of verification' }].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5 text-xs font-bold text-brand-300"><LucideIcon name={item.icon} size={13} className="flex-shrink-0" /> {item.text}</div>
              ))}
            </div>
            <button onClick={() => navigate('/')} className="px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm rounded-xl transition-all w-full cursor-pointer">Back to Home</button>
          </div>
        ) : isSuccess ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-line shadow-2xl shadow-black/40 max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center scale-110"><LucideIcon name="Check" size={28} strokeWidth={3} /></div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase leading-none">Payment Authorized</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-3">Your Subscriptions are Active!</h1>
              <p className="text-sm font-semibold text-slate-400 mt-2">We've set up your premium workspaces. Your account credentials are below:</p>
            </div>
            <div className="w-full space-y-4 text-left my-2">
              {dispatchedCredentials.map((cred, i) => (
                <div key={i} className="p-5 rounded-2xl bg-surface-2 border border-line flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-line pb-2">
                    <div className="w-6 h-6 rounded bg-brand-500/15 text-brand-400 flex items-center justify-center"><LucideIcon name="Shield" size={12} /></div>
                    <span className="text-sm font-black text-white">{cred.service}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Username / Email</span>
                      <strong className="text-white font-bold block mt-0.5 select-all">{cred.email}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Password</span>
                      <strong className="text-white font-mono font-black block mt-0.5 select-all">{cred.password}</strong>
                    </div>
                  </div>
                  {cred.instructions && <div className="text-[10px] text-slate-400 font-semibold leading-normal bg-surface p-2.5 rounded-lg border border-line mt-1">📖 <strong className="text-slate-300">Guide:</strong> {cred.instructions}</div>}
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/')} className="px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm rounded-xl transition-all w-full cursor-pointer">Back to Home</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Form */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-surface border border-line">
              <h2 className="text-lg font-black text-white tracking-tight mb-6 flex items-center gap-2"><LucideIcon name="Contact" size={18} className="text-brand-400" /> Billing Details</h2>

              <form onSubmit={handleSubmitOrder} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Full Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sarah Jenkins" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Email</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" className={inputCls} />
                  </div>
                </div>

                <div className="border-t border-line pt-6">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 flex items-center gap-2"><LucideIcon name="CreditCard" size={14} className="text-brand-400" /> Payment Method</h3>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <button type="button" onClick={() => setPaymentMethod('upi')} className={payBtnCls(paymentMethod === 'upi')}><LucideIcon name="QrCode" size={16} /><span>UPI / Wallet</span></button>
                    <button type="button" onClick={() => setPaymentMethod('card')} className={payBtnCls(paymentMethod === 'card')}><LucideIcon name="CreditCard" size={16} /><span>Credit Card</span></button>
                    <button type="button" onClick={() => setPaymentMethod('crypto')} className={payBtnCls(paymentMethod === 'crypto')}><LucideIcon name="Bitcoin" size={16} /><span>Crypto</span></button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 p-4 rounded-2xl bg-surface-2 border border-line">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Card Number</label>
                        <input type="text" required value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4111 •••• •••• 1111" className="bg-surface px-3 py-2 rounded-xl border border-line focus:outline-none focus:border-brand-500 text-xs font-mono font-bold text-white placeholder-slate-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Expiry</label>
                          <input type="text" required value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" className="bg-surface px-3 py-2 rounded-xl border border-line focus:outline-none focus:border-brand-500 text-xs font-mono font-bold text-white placeholder-slate-500" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">CVV</label>
                          <input type="text" required value={cardCVV} onChange={(e) => setCardCVV(e.target.value)} placeholder="•••" className="bg-surface px-3 py-2 rounded-xl border border-line focus:outline-none focus:border-brand-500 text-xs font-mono font-bold text-white placeholder-slate-500" />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'crypto' && (
                    <div className="p-5 rounded-2xl bg-surface-2 border border-line text-white flex flex-col gap-4 text-left">
                      <div className="flex items-center gap-2"><LucideIcon name="Coins" size={16} className="text-amber-400" /><span className="text-xs font-bold text-slate-200">Ethereum Network Direct Deposit</span></div>
                      <div>
                        <span className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider block">ERC-20 Ethereum Address</span>
                        <strong className="text-xs font-mono text-brand-400 font-bold block mt-1 select-all break-all bg-black/50 p-2.5 rounded-lg border border-line">0x4b78A9C102Ef34cD7189033fA675306B78e1212c</strong>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-normal">🔒 After confirmation on the Ethereum mainnet, credentials are delivered to your dashboard in 2–5 minutes.</p>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-surface-2 border border-line flex flex-col sm:flex-row items-center gap-5">
                        {upiId ? (
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&cu=INR&am=${total}`)}`} alt="UPI QR" className="w-32 h-32 rounded-xl border border-line bg-white p-1 flex-shrink-0" />
                        ) : (
                          <div className="w-32 h-32 rounded-xl border border-line bg-surface flex items-center justify-center flex-shrink-0"><LucideIcon name="QrCode" size={56} className="text-slate-600" /></div>
                        )}
                        <div className="text-center sm:text-left">
                          <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">Step 1 — Scan &amp; Pay</p>
                          <p className="text-sm font-black text-white mb-1">Scan QR or pay to UPI ID</p>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 rounded-lg"><LucideIcon name="QrCode" size={11} className="text-white" /><span className="text-xs font-black text-white tracking-wide">{upiId || 'UPI ID not set'}</span></div>
                          <p className="text-[10px] text-slate-400 font-semibold mt-2">Amount: <strong className="text-slate-200">₹{total.toLocaleString('en-IN')}</strong></p>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-surface-2 border border-line space-y-3">
                        <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Step 2 — Upload Payment Screenshot</p>
                        <input ref={proofInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleProofSelect(f); }} />
                        {proofPreview ? (
                          <div className="relative">
                            <img src={proofPreview} alt="proof" className="w-full max-h-48 object-contain rounded-xl border border-emerald-500/30 bg-surface" />
                            <button type="button" onClick={() => { setProofFile(null); setProofPreview(''); }} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center"><LucideIcon name="X" size={11} /></button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => proofInputRef.current?.click()} className="w-full py-6 border-2 border-dashed border-line hover:border-brand-500 rounded-xl flex flex-col items-center gap-2 text-slate-500 hover:text-brand-400 transition-all cursor-pointer">
                            <LucideIcon name="Upload" size={22} /><span className="text-xs font-bold">Click to upload payment screenshot</span><span className="text-[10px]">PNG, JPG up to 5MB</span>
                          </button>
                        )}
                      </div>

                      <div className="p-5 rounded-2xl bg-surface-2 border border-line space-y-2">
                        <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Step 3 — Enter UTR / Reference Number</p>
                        <input type="text" value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} placeholder="e.g. 423598716234" className="w-full bg-surface px-3.5 py-2.5 rounded-xl border border-line focus:outline-none focus:border-brand-500 text-xs font-mono font-bold text-white placeholder-slate-500" />
                        <p className="text-[10px] text-slate-500 font-semibold">Find this in your UPI app under transaction details</p>
                      </div>
                    </div>
                  )}
                </div>

                {orderError && <p className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3.5 py-2.5">{orderError}</p>}

                <button type="submit" disabled={isSubmitting || proofUploading} className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-500/25 transition-all cursor-pointer flex items-center justify-center gap-2">
                  {(isSubmitting || proofUploading)
                    ? <><LucideIcon name="RefreshCcw" size={16} className="animate-spin" /> {proofUploading ? 'Uploading proof...' : paymentMethod === 'upi' ? 'Submitting...' : 'Authorizing...'}</>
                    : paymentMethod === 'upi'
                      ? <><LucideIcon name="ShieldCheck" size={16} strokeWidth={2.5} /> Submit for Verification — ₹{total.toLocaleString('en-IN')}</>
                      : <><LucideIcon name="ShieldCheck" size={16} strokeWidth={2.5} /> Pay Securely — ₹{total.toLocaleString('en-IN')}</>}
                </button>
              </form>
            </div>

            {/* Summary */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-surface border border-line flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6 border-b border-line pb-3">Order Summary</h3>
                <div className="space-y-3.5 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-surface-2 text-slate-400 border border-line"><LucideIcon name={item.logo || 'HelpCircle'} size={14} /></div>
                        <div className="flex flex-col">
                          <span className="text-xs font-extrabold text-white leading-none">{item.name}</span>
                          <span className="text-[10px] text-slate-500 font-bold mt-1 leading-none">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-line pt-6">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-xs font-bold text-slate-400">Total</span>
                  <span className="text-xl sm:text-2xl font-black text-brand-400">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-surface-2 border border-line rounded-2xl p-4 flex items-center gap-3 text-[11px] font-bold text-slate-400 leading-snug">
                  <LucideIcon name="ShieldCheck" size={14} className="text-brand-400 flex-shrink-0" />
                  <span>Your payment is protected with 256-bit SSL encryption under PCI-DSS Level 1 compliance.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
