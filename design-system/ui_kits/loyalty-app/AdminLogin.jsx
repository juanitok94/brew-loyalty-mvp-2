// AdminLogin.jsx — Rowan Coffee barista login
// Dark aesthetic: black header + cream body

function AdminLogin({ onLogin }) {
  const [pw, setPw] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!pw) { setError('Password required.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (pw === 'demo' || pw === 'rowan321') {
        onLogin && onLogin();
      } else {
        setError('Incorrect password. (hint: type "demo")');
      }
    }, 500);
  }

  return (
    <div style={alStyles.screen}>
      <div style={alStyles.header}>
        <img src="../../assets/rowan-logo.webp" alt="Rowan Coffee" style={{ width: 72, height: 72, objectFit: 'contain' }} />
        <div style={alStyles.brandName}>Rowan Coffee</div>
        <div style={alStyles.badge}>Barista Login</div>
      </div>

      <div style={alStyles.body}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={alStyles.label}>Admin password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(''); }}
            style={{ ...alStyles.input, borderColor: error ? '#DC2626' : '#C8C4BC' }}
            autoFocus
          />
          {error && <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 13, color: '#DC2626', margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ ...alStyles.btn, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Checking...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}

const alStyles = {
  screen: { minHeight: '100%', display: 'flex', flexDirection: 'column', background: '#DFDFD8', fontFamily: "'Instrument Sans', sans-serif" },
  header: { background: '#000', padding: '32px 24px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  brandName: { fontFamily: "'Inknut Antiqua', serif", fontSize: 22, fontWeight: 500, color: '#E8D9B0', textAlign: 'center' },
  badge: { fontFamily: "'Instrument Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(232,217,176,0.5)' },
  body: { padding: '32px 24px', maxWidth: 360, width: '100%', alignSelf: 'center', boxSizing: 'border-box' },
  label: { fontSize: 13, fontWeight: 600, color: '#1A1210' },
  input: { width: '100%', boxSizing: 'border-box', padding: '13px 16px', borderRadius: 10, border: '1.5px solid #C8C4BC', fontFamily: "'Instrument Sans', sans-serif", fontSize: 16, color: '#1A1210', background: '#fff', outline: 'none' },
  btn: { width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: '#000', color: '#E8D9B0', fontFamily: "'Instrument Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em' },
};

Object.assign(window, { AdminLogin });
