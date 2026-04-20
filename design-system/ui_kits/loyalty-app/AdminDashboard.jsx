// AdminDashboard.jsx — Rowan Coffee barista dashboard
// Dark aesthetic: black header + cream body

function AdminDashboard({ onLogout }) {
  const TOTAL = 9;
  const [phone, setPhone] = React.useState('');
  const [customer, setCustomer] = React.useState(null);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);

  function formatPhone(digits) {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  function handlePhoneChange(e) {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(formatPhone(raw));
    setError(''); setMessage(''); setCustomer(null);
  }

  function handleLookup(e) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) { setError('Enter a valid 10-digit number.'); return; }
    setLoading(true); setError(''); setMessage('');
    setTimeout(() => {
      setLoading(false);
      setCustomer({ phone: digits, stamps: 5, redeemed: 2, lastVisit: '2 days ago' });
    }, 500);
  }

  function doAction(action) {
    setActionLoading(true); setMessage('');
    setTimeout(() => {
      setActionLoading(false);
      if (action === 'add') {
        const next = Math.min(customer.stamps + 1, TOTAL);
        setCustomer({ ...customer, stamps: next });
        setMessage(next >= TOTAL ? 'Stamp added! Reward unlocked!' : 'Stamp added!');
      } else if (action === 'remove') {
        setCustomer({ ...customer, stamps: Math.max(customer.stamps - 1, 0) });
        setMessage('Stamp removed.');
      } else if (action === 'redeem') {
        setCustomer({ ...customer, stamps: 0, redeemed: customer.redeemed + 1 });
        setMessage('Reward redeemed! Card reset to 0 stamps.');
      }
    }, 400);
  }

  const isReady = customer && customer.stamps >= TOTAL;
  const displayPhone = customer ? customer.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '';

  return (
    <div style={dashStyles.screen}>
      {/* Black header */}
      <div style={dashStyles.header}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={dashStyles.brandName}>Rowan Coffee</div>
          <button onClick={onLogout} style={dashStyles.logoutBtn}>Logout →</button>
        </div>
        <div style={dashStyles.subLabel}>Barista Dashboard</div>
      </div>

      {/* Cream body */}
      <div style={dashStyles.body}>
        {/* Quick links */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={dashStyles.outlineBtn}>View QR Code</button>
          <button style={dashStyles.outlineBtn}>Scan Customer</button>
        </div>

        {/* Lookup */}
        <form onSubmit={handleLookup} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={dashStyles.label}>Customer phone number</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="tel" inputMode="numeric"
              placeholder="(828) 555-0123"
              value={phone} onChange={handlePhoneChange}
              style={{ ...dashStyles.input, flex: 1, borderColor: error ? '#DC2626' : '#C8C4BC' }}
            />
            <button type="submit" disabled={loading} style={dashStyles.lookupBtn}>
              {loading ? '...' : 'Look Up'}
            </button>
          </div>
          {error && <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{error}</p>}
          {message && <p style={{ fontSize: 13, fontWeight: 600, color: '#16A34A', margin: 0 }}>{message}</p>}
        </form>

        {/* Customer card */}
        {customer && (
          <div style={dashStyles.customerCard}>
            <div>
              <p style={dashStyles.customerName}>{displayPhone}</p>
              <p style={dashStyles.customerMeta}>Last visit: {customer.lastVisit} · {customer.redeemed} free drinks earned</p>
            </div>

            {isReady && (
              <div style={{ background: '#4A3526', color: '#E8D9B0', borderRadius: 12, padding: '10px 14px', textAlign: 'center', fontFamily: "'Instrument Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>
                🎉 Free drink ready to redeem!
              </div>
            )}

            {/* Stamp grid */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                {Array.from({ length: TOTAL }).map((_, i) => (
                  <div key={i} style={{
                    aspectRatio: '1', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
                    background: i < customer.stamps ? '#4A3526' : '#C8C4BC',
                    color: i < customer.stamps ? '#E8D9B0' : 'transparent',
                  }}>
                    {i < customer.stamps ? '☕' : ''}
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 11, color: '#8B7F72', textAlign: 'center', marginTop: 6, marginBottom: 0 }}>
                {customer.stamps} / {TOTAL} stamps
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => doAction('add')} disabled={actionLoading || customer.stamps >= TOTAL}
                  style={{ ...dashStyles.actionBtn, flex: 1, background: '#000', color: '#E8D9B0', opacity: (actionLoading || customer.stamps >= TOTAL) ? 0.35 : 1 }}>
                  {actionLoading ? '...' : '+ Add Stamp'}
                </button>
                <button onClick={() => doAction('remove')} disabled={actionLoading || customer.stamps === 0}
                  style={{ ...dashStyles.actionBtn, flex: 1, background: '#DFDFD8', color: '#4A3526', border: '1.5px solid #C8C4BC', opacity: (actionLoading || customer.stamps === 0) ? 0.35 : 1 }}>
                  {actionLoading ? '...' : '− Remove'}
                </button>
              </div>
              {isReady && (
                <button onClick={() => doAction('redeem')} disabled={actionLoading}
                  style={{ ...dashStyles.actionBtn, background: '#4A3526', color: '#E8D9B0', width: '100%', opacity: actionLoading ? 0.4 : 1 }}>
                  {actionLoading ? '...' : 'Redeem Free Drink'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const dashStyles = {
  screen: { minHeight: '100%', display: 'flex', flexDirection: 'column', background: '#DFDFD8', fontFamily: "'Instrument Sans', sans-serif" },
  header: { background: '#000', padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 4 },
  brandName: { fontFamily: "'Inknut Antiqua', serif", fontSize: 18, fontWeight: 500, color: '#E8D9B0' },
  subLabel: { fontFamily: "'Instrument Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(232,217,176,0.45)' },
  logoutBtn: { background: 'none', border: 'none', fontFamily: "'Instrument Sans', sans-serif", fontSize: 12, color: 'rgba(232,217,176,0.5)', cursor: 'pointer', padding: 0 },
  body: { flex: 1, padding: '20px 20px 36px', display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 400, width: '100%', alignSelf: 'center', boxSizing: 'border-box' },
  outlineBtn: { flex: 1, padding: '9px 12px', borderRadius: 10, border: '1.5px solid #C8C4BC', background: 'transparent', fontFamily: "'Instrument Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#4A3526', cursor: 'pointer' },
  label: { fontSize: 13, fontWeight: 600, color: '#1A1210' },
  input: { padding: '12px 14px', borderRadius: 10, border: '1.5px solid #C8C4BC', fontFamily: "'Instrument Sans', sans-serif", fontSize: 15, color: '#1A1210', background: '#fff', outline: 'none', boxSizing: 'border-box' },
  lookupBtn: { padding: '12px 16px', borderRadius: 10, border: 'none', background: '#000', color: '#E8D9B0', fontFamily: "'Instrument Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  customerCard: { background: '#fff', border: '1px solid #C8C4BC', borderRadius: 18, padding: '18px', display: 'flex', flexDirection: 'column', gap: 14 },
  customerName: { fontFamily: "'Instrument Sans', sans-serif", fontSize: 15, fontWeight: 600, color: '#1A1210', margin: '0 0 2px' },
  customerMeta: { fontFamily: "'Instrument Sans', sans-serif", fontSize: 11, color: '#8B7F72', margin: 0 },
  actionBtn: { padding: '13px', borderRadius: 10, border: 'none', fontFamily: "'Instrument Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' },
};

Object.assign(window, { AdminDashboard });
