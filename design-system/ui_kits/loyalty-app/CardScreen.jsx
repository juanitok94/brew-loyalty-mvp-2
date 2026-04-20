// CardScreen.jsx — Rowan Coffee stamp card
// Dark aesthetic: black header + cream #DFDFD8 body

function StampCircle({ filled }) {
  return (
    <div style={{
      width: 54, height: 54, borderRadius: '50%',
      background: filled ? '#4A3526' : '#C8C4BC',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 22, color: filled ? '#E8D9B0' : 'transparent',
      transition: 'background 0.3s',
    }}>
      {filled ? '☕' : ''}
    </div>
  );
}

function CardScreen({ phone, stamps = 5, redeemed = 2, onBack }) {
  const TOTAL = 9;
  const isReady = stamps >= TOTAL;
  const displayPhone = phone
    ? phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
    : '(828) 555-0123';

  return (
    <div style={cardStyles.screen}>
      {/* Black header */}
      <div style={cardStyles.header}>
        <img src="../../assets/rowan-logo.webp" alt="Rowan Coffee" style={cardStyles.logo} />
        <div style={cardStyles.brandName}>Rowan Coffee</div>
        <div style={cardStyles.phone}>{displayPhone}</div>
      </div>

      {/* Cream body */}
      <div style={cardStyles.body}>
        {/* Progress / reward banner */}
        {isReady ? (
          <div style={{ background: '#4A3526', borderRadius: 14, padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>🎉</div>
            <p style={{ color: '#E8D9B0', fontWeight: 700, fontSize: 17, margin: '0 0 4px', fontFamily: "'Inknut Antiqua', serif" }}>Free drink ready!</p>
            <p style={{ color: 'rgba(232,217,176,0.75)', fontSize: 12, margin: 0, fontFamily: "'Instrument Sans', sans-serif" }}>Show this to your barista to redeem</p>
          </div>
        ) : (
          <div style={{ background: '#000', borderRadius: 14, padding: '14px 20px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(232,217,176,0.8)', fontSize: 13, fontWeight: 600, margin: 0, fontFamily: "'Instrument Sans', sans-serif" }}>
              {TOTAL - stamps} more {TOTAL - stamps === 1 ? 'coffee' : 'coffees'} until your free drink
            </p>
          </div>
        )}

        {/* Stamp grid */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '20px', border: '1px solid #C8C4BC' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, justifyItems: 'center' }}>
            {Array.from({ length: TOTAL }).map((_, i) => (
              <StampCircle key={i} filled={i < stamps} />
            ))}
          </div>
          <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 12, color: '#8B7F72', textAlign: 'center', marginTop: 12, marginBottom: 0 }}>
            {stamps} / {TOTAL} stamps
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, background: '#000', borderRadius: 14, padding: '14px', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Inknut Antiqua', serif", fontSize: 26, fontWeight: 500, color: '#E8D9B0', margin: '0 0 2px' }}>{stamps}</p>
            <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 11, color: 'rgba(232,217,176,0.55)', margin: 0 }}>current stamps</p>
          </div>
          <div style={{ flex: 1, background: '#000', borderRadius: 14, padding: '14px', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Inknut Antiqua', serif", fontSize: 26, fontWeight: 500, color: '#E8D9B0', margin: '0 0 2px' }}>{redeemed}</p>
            <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 11, color: 'rgba(232,217,176,0.55)', margin: 0 }}>free drinks earned</p>
          </div>
        </div>

        {/* QR placeholder */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '20px', border: '1px solid #C8C4BC', textAlign: 'center' }}>
          <div style={{ width: 140, height: 140, background: '#DFDFD8', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontFamily: "'Instrument Sans', sans-serif", fontSize: 12, color: '#8B7F72', fontWeight: 600, letterSpacing: '0.06em' }}>QR CODE</div>
          <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#4A3526', margin: 0 }}>Show this at the counter</p>
        </div>

        <button onClick={onBack} style={{ background: 'none', border: 'none', fontFamily: "'Instrument Sans', sans-serif", fontSize: 13, color: '#8B7F72', cursor: 'pointer', textDecoration: 'underline', padding: 0, textAlign: 'center', width: '100%' }}>
          ← Back
        </button>
      </div>
    </div>
  );
}

const cardStyles = {
  screen: { minHeight: '100%', display: 'flex', flexDirection: 'column', background: '#DFDFD8', fontFamily: "'Instrument Sans', sans-serif" },
  header: { background: '#000', padding: '24px 24px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  logo: { width: 72, height: 72, objectFit: 'contain' },
  brandName: { fontFamily: "'Inknut Antiqua', serif", fontSize: 20, fontWeight: 500, color: '#E8D9B0', textAlign: 'center' },
  phone: { fontFamily: "'Instrument Sans', sans-serif", fontSize: 12, color: 'rgba(232,217,176,0.55)', letterSpacing: '0.04em' },
  body: { flex: 1, padding: '24px 20px 36px', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, width: '100%', alignSelf: 'center', boxSizing: 'border-box' },
};

Object.assign(window, { CardScreen });
