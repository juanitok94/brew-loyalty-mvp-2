// HomeScreen.jsx — Rowan Coffee loyalty app home screen
// Dark aesthetic: black header + cream #DFDFD8 body

function HomeScreen({ onSubmit }) {
  const [phone, setPhone] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  function formatDisplay(digits) {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  function handleChange(e) {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(formatDisplay(raw));
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError('Please enter a valid 10-digit US phone number.');
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); onSubmit && onSubmit(digits); }, 600);
  }

  return (
    <div style={homeStyles.screen}>
      {/* Black header */}
      <div style={homeStyles.header}>
        <img src="../../assets/rowan-logo.webp" alt="Rowan Coffee" style={homeStyles.logo} />
        <div style={homeStyles.brandName}>Rowan Coffee</div>
        <div style={homeStyles.tagline}>West Asheville</div>
      </div>

      {/* Cream body */}
      <div style={homeStyles.body}>
        {/* Teaser card */}
        <div style={homeStyles.teaser}>
          <p style={homeStyles.teaserTop}>Buy 9 coffee or tea drinks</p>
          <p style={homeStyles.teaserMain}>Get the 10th FREE</p>
          <p style={homeStyles.teaserSub}>No app download needed</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={homeStyles.form}>
          <label style={homeStyles.label}>Enter your phone number to see your card</label>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="(828) 555-0123"
            value={phone}
            onChange={handleChange}
            style={{ ...homeStyles.input, borderColor: error ? '#DC2626' : '#C8C4BC' }}
          />
          {error && <p style={homeStyles.error}>{error}</p>}
          <button type="submit" disabled={loading} style={{ ...homeStyles.btn, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Loading...' : 'See My Card'}
          </button>
          <p style={homeStyles.fine}>Not valid on smoothies or frappes. One stamp per drink</p>
        </form>
      </div>
    </div>
  );
}

const homeStyles = {
  screen: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#DFDFD8',
    fontFamily: "'Instrument Sans', sans-serif",
  },
  header: {
    background: '#000000',
    padding: '28px 24px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  logo: { width: 88, height: 88, objectFit: 'contain' },
  brandName: {
    fontFamily: "'Inknut Antiqua', serif",
    fontSize: 22,
    fontWeight: 500,
    color: '#E8D9B0',
    letterSpacing: '0.01em',
    lineHeight: 1.2,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(232,217,176,0.55)',
  },
  body: {
    flex: 1,
    padding: '28px 24px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    boxSizing: 'border-box',
  },
  teaser: {
    background: '#000000',
    borderRadius: 16,
    padding: '20px 24px',
    textAlign: 'center',
  },
  teaserTop: {
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: 'rgba(232,217,176,0.7)',
    margin: '0 0 6px',
  },
  teaserMain: {
    fontFamily: "'Inknut Antiqua', serif",
    fontSize: 20,
    fontWeight: 500,
    color: '#E8D9B0',
    margin: '0 0 6px',
  },
  teaserSub: {
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: 12,
    color: 'rgba(232,217,176,0.5)',
    margin: 0,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  label: { fontSize: 13, fontWeight: 600, color: '#1A1210' },
  input: {
    width: '100%', boxSizing: 'border-box',
    padding: '13px 16px', borderRadius: 10,
    border: '1.5px solid #C8C4BC',
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: 16, color: '#1A1210', background: '#fff', outline: 'none',
  },
  error: { fontSize: 13, color: '#DC2626', margin: 0 },
  btn: {
    width: '100%', padding: '14px', borderRadius: 10, border: 'none',
    background: '#000000', color: '#E8D9B0',
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
    letterSpacing: '0.04em',
  },
  fine: { fontSize: 12, color: '#8B7F72', textAlign: 'center', margin: 0 },
};

Object.assign(window, { HomeScreen });
