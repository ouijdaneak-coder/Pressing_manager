import React, { useState, useRef, useEffect } from "react";

// ── DESIGN TOKENS ───────────────────────────────────────────
const T = {
  bg: "#EEF2F8",
  surface: "#FFFFFF",
  surfaceAlt: "#F0F4FA",
  border: "#D5DEF0",
  borderStrong: "#A8BCDC",
  text: "#0D1B36",
  textMid: "#4A5D7E",
  textLight: "#8A9BBD",
  gold: "#1A3A6B",        // used as accent = deep navy
  goldLight: "#E8EEF8",
  goldBorder: "#B0C4E4",
  green: "#0F6B4F",
  greenLight: "#E6F4EF",
  blue: "#1B3F82",
  blueLight: "#E4ECFA",
  amber: "#7A5200",
  amberLight: "#FDF3E3",
  red: "#8B1A1A",
  redLight: "#FAECEC",
  charcoal: "#0D1B36",    // header = deep navy
  navy1: "#0D1B36",       // darkest
  navy2: "#1B3F82",       // mid
  navy3: "#2F5BB0",       // accent
  navy4: "#D0DEFA",       // very light
};

// ── STATUS CONFIG ────────────────────────────────────────────
const STATUS_FLOW = ["Reçu", "En traitement", "Prêt", "Récupéré"];
const STATUS_CFG = {
  "Reçu":         { bg: T.amberLight,  text: T.amber,  dot: "#D4860A", label: "Reçu" },
  "En traitement":{ bg: T.blueLight,   text: T.blue,   dot: "#2563EB", label: "En traitement" },
  "Prêt":         { bg: T.greenLight,  text: T.green,  dot: "#16A34A", label: "Prêt" },
  "Récupéré":     { bg: T.surfaceAlt,  text: T.textMid,dot: "#9CA3AF", label: "Récupéré" },
};
const PAY_CFG = {
  paid:    { bg: "#E6F4EF", text: "#0F6B4F", dot: "#16A34A", label: "Payé" },
  unpaid:  { bg: T.amberLight, text: T.amber, dot: "#D4860A", label: "Non payé" },
  partial: { bg: "#EEF2F8", text: T.navy2, dot: T.navy3, label: "Acompte" },
};

// ── ICONS (SVG inline — no emojis) ──────────────────────────
const Icon = ({ n, s = 16, c = "currentColor" }) => {
  const paths = {
    home:     "M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z M9 21V12h6v9",
    list:     "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 012-2h2a2 2 0 012 2v0a2 2 0 01-2 2h-2a2 2 0 01-2-2z M9 12h6 M9 16h4",
    users:    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100 8 4 4 0 000-8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
    plus:     "M12 5v14 M5 12h14",
    edit:     "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    receipt:  "M9 5H7a2 2 0 00-2 2v14l3-2 3 2 3-2 3 2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 012-2h2a2 2 0 012 2 M9 12h6 M9 16h4",
    invoice:  "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
    whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M12 2a10 10 0 100 20A10 10 0 0012 2z",
    calendar: "M3 9h18 M8 2v4 M16 2v4 M3 4h18a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z",
    check:    "M20 6L9 17l-5-5",
    alert:    "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
    shirt:    "M20.38 3.46L16 2l-4 4-4-4-4.38 1.46A2 2 0 002 5.33V21h20V5.33a2 2 0 00-1.62-1.87z",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
    print:    "M6 9V2h12v7 M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2 M6 14h12v8H6z",
    arrow:    "M5 12h14 M12 5l7 7-7 7",
    x:        "M18 6L6 18 M6 6l12 12",
    user:     "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 3a4 4 0 100 8 4 4 0 000-8z",
    tag:      "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
    save:     "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8 M7 3v5h8",
    chevdown: "M6 9l6 6 6-6",
    clock:    "M12 2a10 10 0 100 20A10 10 0 0012 2z M12 6v6l4 2",
    money:    "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
    qr:       "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h.01 M18 14h.01 M14 18h.01 M18 18h.01 M14 22h.01 M18 22h.01 M22 14h.01 M22 18h.01 M22 22h.01",
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {(paths[n] || "").split(" M").map((d, i) => <path key={i} d={i === 0 ? d : "M" + d} />)}
    </svg>
  );
};

const PRESTATIONS = ["Repassage", "Lavage", "Lavage + Repassage"];
const DEFAULT_TARIFS = {
  Chemise:  { Repassage: 10, Lavage: 12, "Lavage + Repassage": 18 },
  Pantalon: { Repassage: 12, Lavage: 15, "Lavage + Repassage": 22 },
  Costume:  { Repassage: 25, Lavage: 35, "Lavage + Repassage": 50 },
  Robe:     { Repassage: 20, Lavage: 25, "Lavage + Repassage": 38 },
  Manteau:  { Repassage: 30, Lavage: 40, "Lavage + Repassage": 60 },
  Veste:    { Repassage: 20, Lavage: 28, "Lavage + Repassage": 38 },
  Cravate:  { Repassage:  8, Lavage: 10, "Lavage + Repassage": 15 },
};
const ARTICLES_STD = Object.keys(DEFAULT_TARIFS);
const ART_ICON = { Chemise: "shirt", Costume: "shirt", Robe: "shirt", Manteau: "shirt", Pantalon: "shirt", Veste: "shirt", Cravate: "shirt", Autre: "tag" };

const INIT_CLIENTS = [
  { id: "C001", nom: "Karim Benjelloun", tel: "0661234567" },
  { id: "C002", nom: "Fatima Alaoui", tel: "0672345678" },
  { id: "C003", nom: "Hassan Chraibi", tel: "0683456789" },
  { id: "C004", nom: "Nadia Tazi", tel: "0694567890" },
];

const INIT_DEPOTS = [
  { id: "DEP001", clientId: "C001", items: [{ article: "Costume", qte: 1, prixUnit: 50, prestation: "Lavage + Repassage", note: "", labelAutre: "" }, { article: "Chemise", qte: 2, prixUnit: 18, prestation: "Lavage + Repassage", note: "", labelAutre: "" }], statut: "Prêt", date: "2025-05-27", datePromesse: "2025-05-30", paiement: "unpaid" },
  { id: "DEP002", clientId: "C002", items: [{ article: "Robe", qte: 2, prixUnit: 25, prestation: "Lavage", note: "", labelAutre: "" }], statut: "En traitement", date: "2025-05-28", datePromesse: "2025-06-01", paiement: "partial", acompte: 30 },
  { id: "DEP003", clientId: "C003", items: [{ article: "Chemise", qte: 5, prixUnit: 10, prestation: "Repassage", note: "", labelAutre: "" }, { article: "Pantalon", qte: 3, prixUnit: 12, prestation: "Repassage", note: "", labelAutre: "" }], statut: "Reçu", date: "2025-05-29", datePromesse: "2025-06-02", paiement: "paid" },
  { id: "DEP004", clientId: "C004", items: [{ article: "Manteau", qte: 1, prixUnit: 60, prestation: "Lavage + Repassage", note: "", labelAutre: "" }], statut: "Récupéré", date: "2025-05-26", datePromesse: "2025-05-29", paiement: "paid" },
];

const PRESSING_INFO = { nom: "Pressing Al Nour", adresse: "123 Bd Mohammed V, Casablanca", tel: "0522 34 56 78" };

function genDepotId(n) { return "DEP" + String(n).padStart(3, "0"); }
function genClientId(n) { return "C" + String(n).padStart(3, "0"); }
function totalHT(items) { return items.reduce((s, i) => s + i.prixUnit * i.qte, 0); }
function totalTTC(items) { return Math.round(totalHT(items) * 1.2); }
function getLink(id) { return `https://pressing-track.ma/suivi/${id}`; }
function fmtDate(d) { if (!d) return "—"; return new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" }); }
function initials(nom) { return nom.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(); }
function articleLabel(it) { return it.article === "Autre" ? (it.labelAutre || "Autre") : it.article; }
function itemLabel(it) {
  const art = articleLabel(it);
  return it.prestation ? `${art} — ${it.prestation}` : art;
}

// ── GLOBAL STYLES ────────────────────────────────────────────
const GS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
  body { background: ${T.bg}; }
  input, select, textarea, button { font-family: 'Plus Jakarta Sans', sans-serif; }
  input[type=date]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
  .num { font-family: 'DM Mono', monospace; letter-spacing: -0.5px; }
`;

// ── BADGE ────────────────────────────────────────────────────
function Badge({ statut }) {
  const c = STATUS_CFG[statut];
  return (
    <span style={{ background: c.bg, color: c.text, padding: "3px 10px", borderRadius: 4, fontSize: 10, fontWeight: 600, letterSpacing: .4, display: "inline-flex", alignItems: "center", gap: 5, textTransform: "uppercase" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, flexShrink: 0, display: "inline-block" }} />
      {c.label}
    </span>
  );
}

function PayBadge({ paiement, acompte }) {
  const c = PAY_CFG[paiement] || PAY_CFG.unpaid;
  return (
    <span style={{ background: c.bg, color: c.text, padding: "3px 10px", borderRadius: 4, fontSize: 10, fontWeight: 600, letterSpacing: .4, display: "inline-flex", alignItems: "center", gap: 5, textTransform: "uppercase" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, flexShrink: 0, display: "inline-block" }} />
      {c.label}{paiement === "partial" && acompte ? ` · ${acompte} DH` : ""}
    </span>
  );
}

// ── PROGRESS BAR ─────────────────────────────────────────────
function Progress({ statut }) {
  const idx = STATUS_FLOW.indexOf(statut);
  const dot = STATUS_CFG[statut].dot;
  return (
    <div style={{ display: "flex", gap: 3, margin: "10px 0 4px" }}>
      {STATUS_FLOW.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= idx ? dot : T.border, transition: "background .3s" }} />)}
    </div>
  );
}

// ── TOAST ────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  return (
    <div style={{ position: "fixed", bottom: 24, left: 12, right: 12, maxWidth: 440, margin: "0 auto", background: T.charcoal, color: "#fff", borderRadius: 8, padding: "12px 16px", fontSize: 13, lineHeight: 1.5, zIndex: 999, display: "flex", gap: 10, alignItems: "flex-start", boxShadow: `0 8px 32px rgba(0,0,0,0.28)` }}>
      <div style={{ flex: 1, whiteSpace: "pre-line" }}>{msg}</div>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#999", cursor: "pointer", padding: 0, flexShrink: 0 }}><Icon n="x" s={14} /></button>
    </div>
  );
}

// ── BTN ──────────────────────────────────────────────────────
function Btn({ onClick, children, variant = "dark", small, disabled, style: sx }) {
  const base = { border: "none", borderRadius: 6, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 6, transition: "opacity .15s", opacity: disabled ? .45 : 1, fontFamily: "inherit", fontSize: small ? 11 : 12, padding: small ? "6px 11px" : "9px 16px", ...sx };
  const variants = {
    dark:    { background: T.charcoal, color: "#fff" },
    gold:    { background: T.navy2, color: "#fff" },
    green:   { background: T.green, color: "#fff" },
    ghost:   { background: "transparent", color: T.textMid, border: `1px solid ${T.border}` },
    red:     { background: T.red, color: "#fff" },
    dashed:  { background: T.navy4, color: T.navy2, border: `1.5px dashed ${T.navy3}` },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}>{children}</button>;
}

// ── QR CANVAS ────────────────────────────────────────────────
function QRCanvas({ value, size = 120 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const c = ref.current, ctx = c.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = T.charcoal;
    const cells = 25, cs = size / cells;
    for (let r = 0; r < cells; r++) {
      for (let col = 0; col < cells; col++) {
        const inTL = r < 8 && col < 8, inTR = r < 8 && col >= cells - 8, inBL = r >= cells - 8 && col < 8;
        let draw = false;
        if (inTL || inTR || inBL) {
          const lr = inTL ? r : inTR ? r : r - (cells - 8), lc = inTL ? col : inTR ? col - (cells - 8) : col;
          draw = lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4);
        } else {
          const seed = value.charCodeAt((r * cells + col) % value.length);
          draw = ((seed * 7 + r * 13 + col * 17) % 3) !== 0;
        }
        if (draw) ctx.fillRect(col * cs + 1, r * cs + 1, cs - 1.5, cs - 1.5);
      }
    }
  }, [value, size]);
  return <canvas ref={ref} width={size} height={size} style={{ display: "block", borderRadius: 4 }} />;
}

// ── SECTION TITLE ────────────────────────────────────────────
function SectionTitle({ children }) {
  return <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14, letterSpacing: .3 }}>{children}</div>;
}

// ── DIVIDER ──────────────────────────────────────────────────
function Divider() { return <div style={{ borderTop: `1px solid ${T.border}`, margin: "10px 0" }} />; }

// ── ARTICLE LINE (formulaire) ────────────────────────────────
function ArticleLine({ item, index, tarifs, customArticles, onChange, onRemove, canRemove }) {
  const isAutre = item.article === "Autre";
  const allArticles = [...ARTICLES_STD, ...(customArticles || [])];
  const inputSt = { width: "100%", padding: "9px 12px", borderRadius: 6, border: `1px solid ${T.border}`, fontSize: 13, outline: "none", background: T.surface, color: T.text, fontFamily: "'Plus Jakarta Sans', sans-serif" };

  const selectArticle = (a) => {
    const prest = item.prestation || "Lavage + Repassage";
    const prix = tarifs[a] ? tarifs[a][prest] ?? 0 : 0;
    onChange({ ...item, article: a, prixUnit: prix, labelAutre: "" });
  };

  const selectPrestation = (p) => {
    const prix = !isAutre && tarifs[item.article] ? tarifs[item.article][p] ?? item.prixUnit : item.prixUnit;
    onChange({ ...item, prestation: p, prixUnit: prix });
  };

  return (
    <div style={{ background: T.surfaceAlt, borderRadius: 8, padding: 14, marginBottom: 10, border: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: T.textLight, textTransform: "uppercase", letterSpacing: .5 }}>Article {index + 1}</span>
        {canRemove && <button onClick={onRemove} style={{ background: T.redLight, border: "none", color: T.red, width: 22, height: 22, borderRadius: 4, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon n="x" s={12} c={T.red} /></button>}
      </div>

      {/* Choix article */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {allArticles.map(a => (
          <button key={a} onClick={() => selectArticle(a)}
            style={{ padding: "5px 11px", borderRadius: 4, border: `1px solid ${item.article === a ? T.navy2 : T.border}`, background: item.article === a ? T.navy4 : T.surface, color: item.article === a ? T.navy2 : T.textMid, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
            {a}
          </button>
        ))}
        <button onClick={() => onChange({ ...item, article: "Autre", prestation: "", prixUnit: 0, labelAutre: item.labelAutre || "" })}
          style={{ padding: "5px 11px", borderRadius: 4, border: `1px solid ${isAutre ? T.navy2 : T.border}`, background: isAutre ? T.navy4 : T.surface, color: isAutre ? T.navy2 : T.textMid, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          Autre
        </button>
      </div>

      {/* Champ libre Autre */}
      {isAutre && (
        <input type="text" placeholder="Décrivez l'article (Djellaba, Abaya...)" value={item.labelAutre || ""}
          onChange={e => onChange({ ...item, labelAutre: e.target.value })}
          style={{ ...inputSt, marginBottom: 10, borderColor: T.borderStrong }} />
      )}

      {/* Prestation — uniquement pour articles standard */}
      {!isAutre && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.textLight, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>Prestation</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {PRESTATIONS.map(p => (
              <button key={p} onClick={() => selectPrestation(p)}
                style={{ padding: "5px 12px", borderRadius: 4, border: `1px solid ${item.prestation === p ? T.navy2 : T.border}`, background: item.prestation === p ? T.navy4 : T.surface, color: item.prestation === p ? T.navy2 : T.textMid, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", whiteSpace: "nowrap" }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.textLight, textTransform: "uppercase", letterSpacing: .5, marginBottom: 5 }}>Qté</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => onChange({ ...item, qte: Math.max(1, item.qte - 1) })} style={{ width: 28, height: 28, borderRadius: 4, border: `1px solid ${T.border}`, background: T.surface, fontSize: 16, cursor: "pointer", fontWeight: 600, color: T.textMid, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
            <span style={{ fontWeight: 700, fontSize: 15, minWidth: 22, textAlign: "center", color: T.text }}>{item.qte}</span>
            <button onClick={() => onChange({ ...item, qte: item.qte + 1 })} style={{ width: 28, height: 28, borderRadius: 4, border: `1px solid ${T.border}`, background: T.surface, fontSize: 16, cursor: "pointer", fontWeight: 600, color: T.textMid, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.textLight, textTransform: "uppercase", letterSpacing: .5, marginBottom: 5 }}>Prix unitaire (DH)</div>
          <input type="number" value={item.prixUnit} onChange={e => onChange({ ...item, prixUnit: Math.max(0, Number(e.target.value)) })}
            style={{ ...inputSt, fontWeight: 700, borderColor: isAutre ? T.borderStrong : T.border }} />
        </div>
        <div style={{ textAlign: "right", paddingTop: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'DM Mono', monospace" }}>{item.prixUnit * item.qte} DH</div>
        </div>
      </div>
      <input type="text" placeholder="Note optionnelle..." value={item.note}
        onChange={e => onChange({ ...item, note: e.target.value })}
        style={{ ...inputSt, marginTop: 10, fontSize: 12, color: T.textMid }} />
    </div>
  );
}

// ── LABEL ────────────────────────────────────────────────────
function Label({ children }) {
  return <div style={{ fontSize: 10, fontWeight: 600, color: T.textLight, textTransform: "uppercase", letterSpacing: .6, marginBottom: 6 }}>{children}</div>;
}

// ── FORM INPUT ───────────────────────────────────────────────
function FInput({ type = "text", placeholder, value, onChange, onKeyDown, autoFocus, style: sx }) {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onKeyDown} autoFocus={autoFocus}
      style={{ width: "100%", padding: "10px 13px", borderRadius: 6, border: `1px solid ${T.border}`, fontSize: 13, outline: "none", background: T.surface, color: T.text, fontFamily: "'Plus Jakarta Sans', sans-serif", ...sx }} />
  );
}

// ── TOTAUX BLOCK ─────────────────────────────────────────────
function TotauxBlock({ items, dark }) {
  const ht = totalHT(items), tva = Math.round(ht * .2), ttc = ht + tva;
  const bg = dark ? T.charcoal : T.surfaceAlt;
  const col = dark ? "#fff" : T.text;
  const colMid = dark ? "#AAA49E" : T.textMid;
  return (
    <div style={{ background: bg, borderRadius: 8, padding: "14px 16px" }}>
      {dark && (
        <div style={{ marginBottom: 12 }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 12, color: colMid }}>{itemLabel(it)} ×{it.qte}</span>
              <span style={{ fontSize: 12, color: col, fontWeight: 600 }}>{it.prixUnit * it.qte} DH</span>
            </div>
          ))}
          <Divider />
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: colMid }}>Sous-total HT</span>
        <span style={{ fontSize: 12, color: col, fontWeight: 500 }}>{ht} DH</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 10, marginBottom: 10, borderBottom: `1px solid ${dark ? "#444" : T.border}` }}>
        <span style={{ fontSize: 12, color: colMid }}>TVA (20%)</span>
        <span style={{ fontSize: 12, color: col, fontWeight: 500 }}>{tva} DH</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontWeight: 600, fontSize: 13, color: col }}>Total TTC</span>
        <span style={{ fontWeight: 700, fontSize: 22, color: dark ? "#93B4E8" : T.text, fontFamily: "'DM Mono', monospace" }}>{ttc} DH</span>
      </div>
    </div>
  );
}

// ── STEP INDICATOR ───────────────────────────────────────────
function StepBar({ stepIdx }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
      {[["1", "Numéro"], ["2", "Client"], ["3", "Articles"]].map(([num, lb], i) => {
        const active = i === stepIdx, done = i < stepIdx;
        return (
          <div key={num} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: active ? T.charcoal : done ? T.green : T.surfaceAlt, border: `1.5px solid ${active ? T.charcoal : done ? T.green : T.border}`, color: active || done ? "#fff" : T.textLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                {done ? <Icon n="check" s={12} c="#fff" /> : num}
              </div>
              <div style={{ fontSize: 9, color: active ? T.text : T.textLight, marginTop: 3, fontWeight: active ? 600 : 400, textTransform: "uppercase", letterSpacing: .5 }}>{lb}</div>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 1, background: done ? T.green : T.border, margin: "0 6px", marginBottom: 14 }} />}
          </div>
        );
      })}
    </div>
  );
}

// ── NOUVEAU DÉPÔT ────────────────────────────────────────────
function NouveauDepot({ clients, tarifs, customArticles, onSave, onCancel }) {
  const [step, setStep] = useState("search");
  const [telSearch, setTelSearch] = useState("");
  const [found, setFound] = useState(null);
  const [newNom, setNewNom] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [items, setItems] = useState([{ article: "Chemise", qte: 1, prixUnit: tarifs["Chemise"]["Lavage + Repassage"], prestation: "Lavage + Repassage", note: "", labelAutre: "" }]);
  const [datePromesse, setDatePromesse] = useState("");

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  const stepIdx = { search: 0, confirm_existing: 1, new_client: 1, article: 2 }[step];
  const ht = totalHT(items), tva = Math.round(ht * .2), ttc = ht + tva;
  const canSave = items.length > 0 && items.every(it => it.prixUnit >= 0 && it.qte >= 1 && (it.article !== "Autre" || (it.labelAutre && it.labelAutre.trim())));

  const searchClient = () => {
    const f = clients.find(c => c.tel === telSearch.trim());
    if (f) { setFound(f); setStep("confirm_existing"); } else { setFound(null); setStep("new_client"); }
  };

  return (
    <div style={{ background: T.surface, borderRadius: 12, padding: 20, border: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 600, color: T.text }}>Nouveau dépôt</div>
        <button onClick={onCancel} style={{ background: "none", border: "none", color: T.textLight, cursor: "pointer" }}><Icon n="x" s={18} c={T.textLight} /></button>
      </div>
      <StepBar stepIdx={stepIdx} />

      {step === "search" && (
        <>
          <Label>Numéro de téléphone</Label>
          <FInput type="tel" placeholder="Ex : 0661 23 45 67" value={telSearch} onChange={e => setTelSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && telSearch.length >= 9 && searchClient()} autoFocus />
          <Btn onClick={searchClient} disabled={telSearch.length < 9} style={{ marginTop: 12, width: "100%", justifyContent: "center" }}>
            Rechercher
          </Btn>
        </>
      )}

      {step === "confirm_existing" && found && (
        <>
          <div style={{ background: T.greenLight, borderRadius: 8, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 12, border: `1px solid #B7DFCA` }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: T.green, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{initials(found.nom)}</div>
            <div>
              <div style={{ fontSize: 10, color: T.green, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, marginBottom: 2 }}>Client trouvé</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: T.text }}>{found.nom}</div>
              <div style={{ fontSize: 12, color: T.textMid }}>{found.tel} · {found.id}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => setStep("search")} variant="ghost" style={{ flex: 1, justifyContent: "center" }}>Modifier</Btn>
            <Btn onClick={() => { setSelectedClient(found); setStep("article"); }} style={{ flex: 2, justifyContent: "center" }}>
              <Icon n="check" s={14} c="#fff" /> Confirmer
            </Btn>
          </div>
        </>
      )}

      {step === "new_client" && (
        <>
          <div style={{ background: T.blueLight, borderRadius: 8, padding: 12, marginBottom: 14, display: "flex", alignItems: "center", gap: 10, border: `1px solid #C3D7F5` }}>
            <Icon n="user" s={16} c={T.blue} />
            <div>
              <div style={{ fontSize: 11, color: T.blue, fontWeight: 600 }}>Nouveau client</div>
              <div style={{ fontSize: 12, color: T.blue }}>{telSearch} — non trouvé</div>
            </div>
          </div>
          <Label>Nom complet</Label>
          <FInput placeholder="Ex : Mohammed Benali" value={newNom} onChange={e => setNewNom(e.target.value)} autoFocus style={{ marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => setStep("search")} variant="ghost" style={{ flex: 1, justifyContent: "center" }}>Retour</Btn>
            <Btn onClick={() => { setSelectedClient({ id: "__NEW__", nom: newNom.trim(), tel: telSearch.trim() }); setStep("article"); }} disabled={!newNom.trim()} style={{ flex: 2, justifyContent: "center" }}>Créer le client</Btn>
          </div>
        </>
      )}

      {step === "article" && selectedClient && (
        <>
          <div style={{ background: T.surfaceAlt, borderRadius: 8, padding: 12, marginBottom: 16, display: "flex", alignItems: "center", gap: 10, border: `1px solid ${T.border}` }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: T.charcoal, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{initials(selectedClient.nom)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{selectedClient.nom}</div>
              <div style={{ fontSize: 12, color: T.textMid }}>{selectedClient.tel}</div>
            </div>
            <button onClick={() => setStep("search")} style={{ background: "none", border: "none", color: T.navy2, fontSize: 12, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Changer</button>
          </div>

          <Label>Date de promesse</Label>
          <FInput type="date" value={datePromesse} onChange={e => setDatePromesse(e.target.value)}
            style={{ marginBottom: datePromesse ? 6 : 14, color: datePromesse ? T.text : T.textLight }} />
          {datePromesse && <div style={{ fontSize: 12, color: T.green, fontWeight: 600, marginBottom: 14 }}>Prêt le {fmtDate(datePromesse)}</div>}

          {items.map((item, i) => (
            <ArticleLine key={i} item={item} index={i} tarifs={tarifs} customArticles={customArticles}
              onChange={val => setItems(prev => prev.map((it, idx) => idx === i ? val : it))}
              onRemove={() => setItems(prev => prev.filter((_, idx) => idx !== i))}
              canRemove={items.length > 1} />
          ))}

          <Btn onClick={() => setItems(prev => [...prev, { article: "Chemise", qte: 1, prixUnit: tarifs["Chemise"]["Lavage + Repassage"], prestation: "Lavage + Repassage", note: "", labelAutre: "" }])}
            variant="dashed" style={{ width: "100%", justifyContent: "center", marginBottom: 16 }}>
            + Ajouter un article
          </Btn>

          <TotauxBlock items={items} dark />

          {datePromesse && (
            <div style={{ marginTop: 10, padding: "8px 12px", background: T.greenLight, borderRadius: 6, fontSize: 12, color: T.green, fontWeight: 500 }}>
              Promesse de livraison : {fmtDate(datePromesse)}
            </div>
          )}

          {!canSave && <div style={{ fontSize: 11, color: T.red, textAlign: "center", marginTop: 10 }}>Veuillez remplir la description et le prix pour les articles "Autre"</div>}

          <Btn onClick={() => onSave({ client: selectedClient, items, datePromesse })} disabled={!canSave}
            style={{ width: "100%", justifyContent: "center", marginTop: 14, fontSize: 13 }}>
            Enregistrer le dépôt · {ttc} DH TTC
          </Btn>
        </>
      )}
    </div>
  );
}

// ── REÇU ─────────────────────────────────────────────────────
function RecuModal({ depot, client, onClose }) {
  const ht = totalHT(depot.items), tva = Math.round(ht * .2), ttc = ht + tva;
  const link = getLink(depot.id);

  const handlePrint = () => {
    const el = document.getElementById("recu-zone");
    const win = window.open("", "_blank", "width=420,height=680");
    win.document.write(`<html><head><title>Reçu ${depot.id}</title>
      <style>@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Plus Jakarta Sans',sans-serif;background:#fff;padding:0;}
      .w{width:80mm;margin:0 auto;padding:8mm 6mm;font-size:12px;}.c{text-align:center;}.b{font-weight:700;}
      .s{font-size:10px;color:#888;}.sep{border:none;border-top:1px dashed #ccc;margin:8px 0;}
      .row{display:flex;justify-content:space-between;margin-bottom:4px;}.num{font-family:'DM Mono',monospace;letter-spacing:-0.5px;}</style>
      </head><body onload="window.print()">${el.innerHTML}</body></html>`);
    win.document.close();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: T.surface, borderRadius: "16px 16px 0 0", padding: 20, width: "100%", maxWidth: 480, maxHeight: "93vh", overflowY: "auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 600 }}>Bon de dépôt</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.textLight }}><Icon n="x" s={18} /></button>
        </div>

        <div id="recu-zone">
          <div style={{ maxWidth: 320, margin: "0 auto", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12 }}>
            {/* En-tête */}
            <div style={{ textAlign: "center", marginBottom: 14, paddingBottom: 12, borderBottom: `1px dashed ${T.border}` }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 18, letterSpacing: .5 }}>{PRESSING_INFO.nom}</div>
              <div style={{ fontSize: 11, color: T.textMid, marginTop: 3 }}>{PRESSING_INFO.adresse}</div>
              <div style={{ fontSize: 11, color: T.textMid }}>{PRESSING_INFO.tel}</div>
            </div>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 15, letterSpacing: 1, textTransform: "uppercase" }}>Bon de Dépôt</div>
              <div style={{ fontSize: 11, color: T.textMid, marginTop: 2 }}>#{depot.id} · {fmtDate(depot.date)}</div>
            </div>
            {/* Client */}
            <div style={{ background: T.surfaceAlt, borderRadius: 6, padding: "10px 12px", marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: T.textLight, textTransform: "uppercase", letterSpacing: .5, marginBottom: 3 }}>Client</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{client.nom}</div>
              <div style={{ fontSize: 12, color: T.textMid }}>{client.tel}</div>
            </div>
            {/* Date promesse */}
            {depot.datePromesse && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.greenLight, borderRadius: 6, padding: "10px 12px", marginBottom: 12, border: `1px solid #B7DFCA` }}>
                <Icon n="calendar" s={14} c={T.green} />
                <div>
                  <div style={{ fontSize: 10, color: T.green, fontWeight: 600, textTransform: "uppercase", letterSpacing: .4 }}>Date de promesse</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: T.green }}>{fmtDate(depot.datePromesse)}</div>
                </div>
              </div>
            )}
            {/* Articles */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: T.textLight, textTransform: "uppercase", letterSpacing: .6, marginBottom: 8 }}>Articles</div>
              {depot.items.map((it, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, paddingBottom: 6, borderBottom: `1px solid ${T.border}` }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{itemLabel(it)}</div>
                    {it.note && <div style={{ fontSize: 11, color: T.textMid }}>{it.note}</div>}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: T.textMid }}>{it.qte} × {it.prixUnit} DH</div>
                    <div style={{ fontWeight: 700 }}>{it.prixUnit * it.qte} DH</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Totaux */}
            <div style={{ background: T.surfaceAlt, borderRadius: 6, padding: "10px 12px", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: T.textMid }}>Sous-total HT</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{ht} DH</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, marginBottom: 8, borderBottom: `1px dashed ${T.border}` }}>
                <span style={{ fontSize: 12, color: T.textMid }}>TVA (20%)</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{tva} DH</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Total TTC</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 20, color: T.text }}>{ttc} DH</span>
              </div>
            </div>
            {/* QR */}
            <div style={{ textAlign: "center", paddingTop: 12, borderTop: `1px dashed ${T.border}` }}>
              <div style={{ fontSize: 10, color: T.textLight, marginBottom: 8, textTransform: "uppercase", letterSpacing: .5 }}>Suivre votre commande</div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, padding: 10, background: "#fff", borderRadius: 8, border: `1px solid ${T.border}` }}>
                <QRCanvas value={link} size={100} />
              </div>
              <div style={{ fontSize: 10, color: T.textLight, wordBreak: "break-all" }}>{link}</div>
              <div style={{ fontSize: 11, color: T.textMid, marginTop: 10 }}>Merci de votre confiance</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <Btn onClick={onClose} variant="ghost" style={{ flex: 1, justifyContent: "center" }}>Fermer</Btn>
          <Btn onClick={handlePrint} style={{ flex: 2, justifyContent: "center" }}>
            <Icon n="print" s={14} c="#fff" /> Imprimer / PDF
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── FACTURE ──────────────────────────────────────────────────
function FactureModal({ depot, client, onClose, onSetPaiement }) {
  const [localAcompte, setLocalAcompte] = useState(depot.acompte || 0);
  const ht = totalHT(depot.items), tva = Math.round(ht * .2);
  const ttc = ht + tva;
  const reste = Math.max(0, ttc - localAcompte);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: T.surface, borderRadius: "16px 16px 0 0", padding: 20, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 600 }}>Facture</div>
            <div style={{ fontSize: 12, color: T.textMid, marginTop: 2 }}>#{depot.id} · {depot.date}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <PayBadge paiement={depot.paiement} acompte={depot.acompte} />
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.textLight }}><Icon n="x" s={18} /></button>
          </div>
        </div>

        <div style={{ background: T.surfaceAlt, borderRadius: 8, padding: 14, marginBottom: 18 }}>
          <Label>Client</Label>
          <div style={{ fontWeight: 700, fontSize: 15, color: T.text }}>{client.nom}</div>
          <div style={{ fontSize: 13, color: T.textMid, marginTop: 2 }}>{client.tel}</div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <Label>Prestations</Label>
          {depot.items.map((it, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{itemLabel(it)}</div>
                {it.note && <div style={{ fontSize: 11, color: T.textMid, marginTop: 2 }}>{it.note}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: T.textMid }}>{it.qte} × {it.prixUnit} DH</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{it.prixUnit * it.qte} DH</div>
              </div>
            </div>
          ))}
        </div>

        <TotauxBlock items={depot.items} />

        {/* Statut paiement */}
        <div style={{ marginTop: 16, marginBottom: depot.paiement === "partial" ? 0 : 16 }}>
          <Label>Statut du paiement</Label>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(PAY_CFG).map(([key, cfg]) => (
              <button key={key} onClick={() => onSetPaiement(depot.id, key, key === "partial" ? localAcompte : undefined)}
                style={{ flex: 1, padding: "10px 8px", borderRadius: 8, border: `1.5px solid ${depot.paiement === key ? cfg.dot : T.border}`, background: depot.paiement === key ? cfg.bg : T.surface, color: depot.paiement === key ? cfg.text : T.textMid, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", letterSpacing: .4, transition: "all .15s" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, margin: "0 auto 5px" }} />
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Champ acompte — visible uniquement si paiement = partial */}
        {depot.paiement === "partial" && (
          <div style={{ background: T.blueLight, borderRadius: 8, padding: 14, margin: "12px 0 16px", border: `1px solid ${T.borderStrong}` }}>
            <Label>Montant de l'acompte (DH TTC)</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="number"
                value={localAcompte}
                min={0}
                max={ttc}
                onChange={e => setLocalAcompte(Math.min(ttc, Math.max(0, Number(e.target.value))))}
                style={{ flex: 1, padding: "9px 12px", borderRadius: 6, border: `1.5px solid ${T.borderStrong}`, fontSize: 15, fontWeight: 700, outline: "none", fontFamily: "'DM Mono', monospace", color: T.navy1, background: T.surface }}
              />
              <Btn onClick={() => onSetPaiement(depot.id, "partial", localAcompte)} variant="dark" style={{ whiteSpace: "nowrap" }}>
                <Icon n="check" s={13} c="#fff" /> Enregistrer
              </Btn>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              <span style={{ fontSize: 12, color: T.textMid }}>Acompte versé</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 13, color: T.navy2 }}>{localAcompte} DH</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 12, color: T.textMid }}>Reste à payer</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 13, color: reste > 0 ? T.amber : T.green }}>{reste} DH</span>
            </div>
          </div>
        )}

        <Btn onClick={onClose} variant="ghost" style={{ width: "100%", justifyContent: "center" }}>Fermer</Btn>
      </div>
    </div>
  );
}

// ── EDIT DEPOT ───────────────────────────────────────────────
function EditDepotModal({ depot, client, tarifs, customArticles, onSave, onClose }) {
  const [items, setItems] = useState(depot.items.map(it => ({ ...it })));
  const [datePromesse, setDatePromesse] = useState(depot.datePromesse || "");
  const [statut, setStatut] = useState(depot.statut);
  const [paiement, setPaiement] = useState(depot.paiement || "unpaid");
  const [acompte, setAcompte] = useState(depot.acompte || 0);
  const ttc = totalTTC(items);
  const canSave = items.length > 0 && items.every(it => it.prixUnit >= 0 && it.qte >= 1 && (it.article !== "Autre" || (it.labelAutre && it.labelAutre.trim())));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: T.surface, borderRadius: "16px 16px 0 0", padding: 20, width: "100%", maxWidth: 480, maxHeight: "93vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 600 }}>Modifier le dépôt</div>
            <div style={{ fontSize: 12, color: T.navy2, fontWeight: 600, marginTop: 2 }}>#{depot.id} · {client.nom}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.textLight }}><Icon n="x" s={18} /></button>
        </div>

        <Label>Statut de traitement</Label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {STATUS_FLOW.map(s => {
            const c = STATUS_CFG[s];
            return (
              <button key={s} onClick={() => setStatut(s)}
                style={{ padding: "6px 13px", borderRadius: 4, fontSize: 11, fontWeight: 600, border: `1.5px solid ${statut === s ? c.dot : T.border}`, background: statut === s ? c.bg : T.surface, color: statut === s ? c.text : T.textMid, cursor: "pointer", fontFamily: "inherit", letterSpacing: .3 }}>
                {s}
              </button>
            );
          })}
        </div>

        <Label>Statut du paiement</Label>
        <div style={{ display: "flex", gap: 8, marginBottom: paiement === "partial" ? 0 : 16 }}>
          {Object.entries(PAY_CFG).map(([key, cfg]) => (
            <button key={key} onClick={() => setPaiement(key)}
              style={{ flex: 1, padding: "9px 6px", borderRadius: 6, border: `1.5px solid ${paiement === key ? cfg.dot : T.border}`, background: paiement === key ? cfg.bg : T.surface, color: paiement === key ? cfg.text : T.textMid, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", letterSpacing: .4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: paiement === key ? cfg.dot : T.border, margin: "0 auto 4px" }} />
              {cfg.label}
            </button>
          ))}
        </div>

        {paiement === "partial" && (
          <div style={{ background: T.blueLight, borderRadius: 8, padding: 14, margin: "12px 0 16px", border: `1px solid ${T.borderStrong}` }}>
            <Label>Montant de l'acompte (DH TTC)</Label>
            <input type="number" value={acompte} min={0} max={ttc}
              onChange={e => setAcompte(Math.min(ttc, Math.max(0, Number(e.target.value))))}
              style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: `1.5px solid ${T.borderStrong}`, fontSize: 15, fontWeight: 700, outline: "none", fontFamily: "'DM Mono', monospace", color: T.navy1, background: T.surface, marginBottom: 8 }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: T.textMid }}>Reste à payer</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 13, color: Math.max(0, ttc - acompte) > 0 ? T.amber : T.green }}>{Math.max(0, ttc - acompte)} DH</span>
            </div>
          </div>
        )}

        <Label>Date de promesse</Label>
        <FInput type="date" value={datePromesse} onChange={e => setDatePromesse(e.target.value)} style={{ marginBottom: datePromesse ? 6 : 16 }} />
        {datePromesse && <div style={{ fontSize: 12, color: T.green, fontWeight: 600, marginBottom: 16 }}>Prêt le {fmtDate(datePromesse)}</div>}

        <Label>Articles</Label>
        {items.map((item, i) => (
          <ArticleLine key={i} item={item} index={i} tarifs={tarifs} customArticles={customArticles}
            onChange={val => setItems(prev => prev.map((it, idx) => idx === i ? val : it))}
            onRemove={() => setItems(prev => prev.filter((_, idx) => idx !== i))}
            canRemove={items.length > 1} />
        ))}
        <Btn onClick={() => setItems(prev => [...prev, { article: "Chemise", qte: 1, prixUnit: tarifs["Chemise"]["Lavage + Repassage"], prestation: "Lavage + Repassage", note: "", labelAutre: "" }])}
          variant="dashed" style={{ width: "100%", justifyContent: "center", marginBottom: 16 }}>
          + Ajouter un article
        </Btn>

        <TotauxBlock items={items} />

        {!canSave && <div style={{ fontSize: 11, color: T.red, textAlign: "center", marginTop: 8 }}>Remplissez la description et le prix pour les articles "Autre"</div>}

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <Btn onClick={onClose} variant="ghost" style={{ flex: 1, justifyContent: "center" }}>Annuler</Btn>
          <Btn onClick={() => onSave({ id: depot.id, items, datePromesse, statut, paiement, acompte })} disabled={!canSave} style={{ flex: 2, justifyContent: "center" }}>
            <Icon n="save" s={14} c="#fff" /> Enregistrer
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── VUE CLIENT ───────────────────────────────────────────────
function ClientPage({ depot, client, onClose }) {
  const curIdx = STATUS_FLOW.indexOf(depot.statut);
  const ht = totalHT(depot.items), ttc = Math.round(ht * 1.2);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, overflowY: "auto", background: T.bg }}>
      <div style={{ maxWidth: 480, margin: "0 auto", background: T.surface, minHeight: "100vh" }}>
        <div style={{ background: T.charcoal, padding: "24px 20px 20px", color: "#fff" }}>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.1)", border: "none", color: "#fff", padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer", marginBottom: 14, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon n="arrow" s={12} c="#fff" style={{ transform: "rotate(180deg)" }} /> Retour
          </button>
          <div style={{ fontSize: 10, color: "#AAA49E", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Suivi de commande</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 24, fontWeight: 600 }}>{PRESSING_INFO.nom}</div>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ background: T.surfaceAlt, borderRadius: 10, padding: 16, marginBottom: 14, border: `1px solid ${T.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: T.text }}>{client.nom}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {depot.items.map((it, i) => (
                <span key={i} style={{ background: T.navy4, borderRadius: 4, padding: "3px 9px", fontSize: 11, color: T.navy2, fontWeight: 600, border: `1px solid ${T.borderStrong}` }}>
                  {itemLabel(it)} ×{it.qte}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 12, color: T.textMid }}>Déposé le {fmtDate(depot.date)} · <span style={{ color: T.navy2, fontWeight: 600 }}>#{depot.id}</span></div>
          </div>

          {depot.datePromesse && (
            <div style={{ background: T.greenLight, borderRadius: 8, padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10, border: `1px solid #B7DFCA` }}>
              <Icon n="calendar" s={18} c={T.green} />
              <div>
                <div style={{ fontSize: 10, color: T.green, textTransform: "uppercase", letterSpacing: .5 }}>Date de promesse</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: T.green }}>{fmtDate(depot.datePromesse)}</div>
              </div>
            </div>
          )}

          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 600, marginBottom: 16, color: T.text }}>Suivi de votre commande</div>
          {STATUS_FLOW.map((s, i) => {
            const done = i < curIdx, active = i === curIdx;
            const cfg = STATUS_CFG[s];
            return (
              <div key={s} style={{ display: "flex", gap: 14, marginBottom: 4 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: active ? cfg.dot : done ? cfg.dot + "33" : T.surfaceAlt, border: `2px solid ${active || done ? cfg.dot : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {done ? <Icon n="check" s={12} c={cfg.dot} /> : active ? <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot, display: "block" }} /> : <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.border, display: "block" }} />}
                  </div>
                  {i < STATUS_FLOW.length - 1 && <div style={{ width: 2, height: 24, background: done ? cfg.dot + "55" : T.border, margin: "3px 0" }} />}
                </div>
                <div style={{ paddingTop: 5, flex: 1 }}>
                  <div style={{ fontWeight: active ? 700 : 500, fontSize: active ? 14 : 13, color: i > curIdx ? T.textLight : T.text }}>{s}</div>
                  {active && s === "Prêt" && <div style={{ fontSize: 11, color: T.green, fontWeight: 600, marginTop: 2 }}>Vos articles sont prêts à être récupérés</div>}
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: 24, background: T.surfaceAlt, borderRadius: 10, padding: 16, border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 600, marginBottom: 12, color: T.text }}>Votre facture</div>
            {depot.items.map((it, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: T.textMid }}>{itemLabel(it)} ×{it.qte}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{it.prixUnit * it.qte} DH</span>
              </div>
            ))}
            <div style={{ borderTop: `1px dashed ${T.border}`, marginTop: 8, paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>Total TTC</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 20, color: T.text }}>{ttc} DH</span>
            </div>
          </div>

          <div style={{ marginTop: 14, padding: 14, borderRadius: 8, border: `1px solid ${T.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: T.textMid }}>Une question ? Contactez-nous</div>
            <div style={{ fontWeight: 700, color: T.text, marginTop: 4, fontSize: 14 }}>{PRESSING_INFO.tel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TARIFS ───────────────────────────────────────────────────
function TarifsModal({ tarifs, customArticles, onSave, onClose }) {
  const [local, setLocal] = useState({ ...tarifs });
  const [customs, setCustoms] = useState(customArticles ? [...customArticles] : []);
  const [newName, setNewName] = useState("");

  const addCustom = () => {
    const name = newName.trim();
    if (!name || local[name]) return;
    const newEntry = { Repassage: 10, Lavage: 15, "Lavage + Repassage": 20 };
    setLocal(p => ({ ...p, [name]: newEntry }));
    setCustoms(p => [...p, name]);
    setNewName("");
  };

  const removeCustom = (name) => {
    setLocal(p => { const n = { ...p }; delete n[name]; return n; });
    setCustoms(p => p.filter(c => c !== name));
  };

  const setPrice = (article, prestation, val) => {
    const num = parseInt(val, 10);
    setLocal(p => ({ ...p, [article]: { ...p[article], [prestation]: isNaN(num) ? 0 : Math.max(0, num) } }));
  };

  const allArticles = [...ARTICLES_STD, ...customs];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: T.surface, borderRadius: "16px 16px 0 0", padding: 20, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Grille tarifaire</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.textLight }}><Icon n="x" s={18} /></button>
        </div>
        <div style={{ fontSize: 11, color: T.textMid, marginBottom: 14 }}>Prix en DH HT — modifiez directement les valeurs</div>

        {/* En-tête */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", gap: 4, marginBottom: 6, paddingBottom: 8, borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textLight, textTransform: "uppercase", letterSpacing: .5 }}>Article</div>
          {PRESTATIONS.map(p => (
            <div key={p} style={{ fontSize: 9, fontWeight: 700, color: T.navy2, textTransform: "uppercase", letterSpacing: .3, textAlign: "center", lineHeight: 1.3 }}>{p}</div>
          ))}
        </div>

        {/* Lignes articles */}
        {allArticles.map(a => {
          const isCustom = customs.includes(a);
          return (
            <div key={a} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", gap: 4, alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 12, color: isCustom ? T.navy2 : T.text }}>{a}</span>
                {isCustom && (
                  <button onClick={() => removeCustom(a)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: T.red, padding: 0, display: "flex", alignItems: "center" }}>
                    <Icon n="x" s={11} c={T.red} />
                  </button>
                )}
              </div>
              {PRESTATIONS.map(p => (
                <input key={p} type="number" value={local[a]?.[p] ?? 0} min={0}
                  onChange={e => setPrice(a, p, e.target.value)}
                  style={{ width: "100%", padding: "6px 5px", borderRadius: 5, border: `1px solid ${T.border}`, fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: T.text, background: isCustom ? T.blueLight : T.surface, outline: "none", textAlign: "center" }} />
              ))}
            </div>
          );
        })}

        {/* Ajouter un article */}
        <div style={{ marginTop: 16, padding: 14, background: T.surfaceAlt, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.textMid, marginBottom: 8 }}>Ajouter un article personnalisé</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="text" placeholder="Ex : Djellaba, Abaya..." value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addCustom()}
              style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: `1px solid ${T.border}`, fontSize: 13, outline: "none", fontFamily: "inherit", background: T.surface }} />
            <Btn onClick={addCustom} disabled={!newName.trim()} variant="dark" style={{ flexShrink: 0 }}>
              <Icon n="plus" s={13} c="#fff" /> Ajouter
            </Btn>
          </div>
          {customs.length > 0 && (
            <div style={{ fontSize: 11, color: T.textLight, marginTop: 8 }}>
              {customs.length} article(s) personnalisé(s) — les prix sont modifiables dans le tableau
            </div>
          )}
        </div>

        <Btn onClick={() => { onSave(local, customs); onClose(); }} style={{ width: "100%", justifyContent: "center", marginTop: 16 }}>
          <Icon n="save" s={14} c="#fff" /> Enregistrer les tarifs
        </Btn>
      </div>
    </div>
  );
}

// ── CA MENSUEL ───────────────────────────────────────────────
// ── APP ──────────────────────────────────────────────────────
export default function PressingApp() {
  const [clientsDB, setClientsDB] = useState(INIT_CLIENTS);
  const [depots, setDepots] = useState(INIT_DEPOTS);
  const [tarifs, setTarifs] = useState(DEFAULT_TARIFS);
  const [customArticles, setCustomArticles] = useState([]);
  const [clientSort, setClientSort] = useState("alpha");
  const now = new Date();
  const [selYear, setSelYear] = useState(now.getFullYear());
  const [selMonth, setSelMonth] = useState(now.getMonth() + 1); // 1-12
  const [view, setView] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("Tous");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [factureDepot, setFactureDepot] = useState(null);
  const [recuDepot, setRecuDepot] = useState(null);
  const [clientPage, setClientPage] = useState(null);
  const [showTarifs, setShowTarifs] = useState(false);
  const [editDepot, setEditDepot] = useState(null);
  const [nextDepotId, setNextDepotId] = useState(5);
  const [nextClientId, setNextClientId] = useState(5);
  const toastTimer = useRef(null);

  const showToast = (msg) => { setToast(msg); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 4500); };
  const getClient = (id) => clientsDB.find(c => c.id === id) || { nom: "Inconnu", tel: "" };

  const advanceStatus = (id) => {
    setDepots(prev => prev.map(d => {
      if (d.id !== id) return d;
      const idx = STATUS_FLOW.indexOf(d.statut);
      if (idx >= STATUS_FLOW.length - 1) return d;
      const next = STATUS_FLOW[idx + 1];
      if (next === "Prêt") showToast(`Notification envoyée à ${getClient(d.clientId).nom} — articles prêts`);
      return { ...d, statut: next };
    }));
    setFilter("Tous");
  };

  const setPaiement = (id, paiement, acompte) => {
    setDepots(prev => prev.map(d => d.id === id ? { ...d, paiement, acompte: acompte ?? d.acompte ?? 0 } : d));
    showToast(`Paiement mis à jour : ${PAY_CFG[paiement]?.label}`);
  };

  const handleEditDepot = ({ id, items, datePromesse, statut, paiement, acompte }) => {
    setDepots(prev => prev.map(d => d.id === id ? { ...d, items, datePromesse, statut, paiement, acompte: acompte ?? 0 } : d));
    setEditDepot(null);
    setFilter("Tous");
    showToast("Dépôt modifié avec succès");
  };

  const handleSaveDepot = ({ client, items, datePromesse }) => {
    let clientId = client.id;
    if (client.id === "__NEW__") {
      clientId = genClientId(nextClientId);
      setClientsDB(prev => [...prev, { id: clientId, nom: client.nom, tel: client.tel }]);
      setNextClientId(n => n + 1);
    }
    const id = genDepotId(nextDepotId);
    const newDepot = { id, clientId, items, statut: "Reçu", date: new Date().toISOString().split("T")[0], datePromesse, paiement: "unpaid" };
    setDepots(prev => [newDepot, ...prev]);
    setNextDepotId(n => n + 1);
    setShowForm(false);
    const resolvedClient = client.id === "__NEW__" ? { ...client, id: clientId } : client;
    setRecuDepot({ depot: newDepot, client: resolvedClient });
    setView("liste");
    showToast(`Dépôt ${id} enregistré · ${totalTTC(items)} DH TTC`);
  };

  const stats = {
    total: depots.length,
    prets: depots.filter(d => d.statut === "Prêt").length,
    ca: depots.filter(d => d.paiement === "paid").reduce((s, d) => s + totalTTC(d.items), 0),
    enAttente: depots.filter(d => d.paiement !== "paid").reduce((s, d) => s + totalTTC(d.items), 0),
    caFiltered: depots
      .filter(d => {
        if (d.paiement !== "paid" || !d.date) return false;
        const dd = new Date(d.date);
        return dd.getFullYear() === selYear && dd.getMonth() + 1 === selMonth;
      })
      .reduce((s, d) => s + totalTTC(d.items), 0),
  };
  const enRetard = depots.filter(d => d.datePromesse && d.statut !== "Récupéré" && d.statut !== "Prêt" && new Date(d.datePromesse) < new Date()).length;
  const filtered = depots.filter(d => {
    const cl = getClient(d.clientId);
    return (filter === "Tous" || d.statut === filter) && (cl.nom.toLowerCase().includes(search.toLowerCase()) || cl.tel.includes(search) || d.id.includes(search));
  });

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: T.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto" }}>
      <style>{GS}</style>

      {/* HEADER */}
      <div style={{ background: T.charcoal, padding: "24px 20px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 9, color: "#AAA49E", letterSpacing: 3, textTransform: "uppercase", marginBottom: 5 }}>Pressing Manager</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 600, color: "#fff", lineHeight: 1.1 }}>Tableau de bord</div>
          </div>
          <button onClick={() => setShowTarifs(true)}
            style={{ background: "rgba(255,255,255,.08)", border: `1px solid rgba(255,255,255,.12)`, color: "#D4C5A9", padding: "7px 13px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon n="settings" s={13} c="#D4C5A9" /> Tarifs
          </button>
        </div>
        <div style={{ fontSize: 11, color: "#7A736B", marginTop: 4 }}>
          {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      {/* NAV */}
      <div style={{ display: "flex", background: T.surface, borderBottom: `1px solid ${T.border}` }}>
        {[["dashboard", "home", "Accueil"], ["liste", "list", "Dépôts"], ["clients", "users", "Clients"]].map(([k, ic, lb]) => (
          <button key={k} onClick={() => { setView(k); setShowForm(false); }}
            style={{ flex: 1, padding: "11px 4px", border: "none", background: "none", color: view === k ? T.text : T.textLight, fontWeight: view === k ? 700 : 400, fontSize: 11, cursor: "pointer", borderBottom: `2px solid ${view === k ? T.charcoal : "transparent"}`, transition: "all .2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontFamily: "inherit", letterSpacing: .3 }}>
            <Icon n={ic} s={17} c={view === k ? T.text : T.textLight} />
            {lb}
          </button>
        ))}
      </div>

      <div style={{ padding: 14, paddingBottom: 90 }}>

        {/* ALERTE RETARD */}
        {enRetard > 0 && !showForm && (
          <div style={{ background: T.redLight, borderRadius: 8, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10, border: `1px solid #F5C6C6` }}>
            <Icon n="alert" s={18} c={T.red} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: T.red }}>{enRetard} dépôt(s) en retard</div>
              <div style={{ fontSize: 11, color: T.red, opacity: .8 }}>Date de promesse dépassée</div>
            </div>
          </div>
        )}

        {showForm && <NouveauDepot clients={clientsDB} tarifs={tarifs} customArticles={customArticles} onSave={handleSaveDepot} onCancel={() => setShowForm(false)} />}

        {/* DASHBOARD */}
        {!showForm && view === "dashboard" && (() => {
          // Build available years and months from paid depots
          const yearSet = new Set([now.getFullYear()]);
          depots.filter(d => d.paiement === "paid" && d.date).forEach(d => yearSet.add(new Date(d.date).getFullYear()));
          const years = Array.from(yearSet).sort((a, b) => b - a);
          const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
          const selStyle = { fontSize: 11, fontWeight: 600, color: T.navy2, background: T.navy4, border: `1px solid ${T.borderStrong}`, borderRadius: 5, padding: "4px 6px", cursor: "pointer", fontFamily: "inherit", outline: "none" };
          return (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {/* Dépôts total */}
              <div style={{ background: T.surface, borderRadius: 10, padding: "14px 14px 12px", border: `1px solid ${T.border}` }}>
                <Icon n="list" s={16} c={T.textMid} />
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 600, color: T.text, marginTop: 6 }}>{stats.total}</div>
                <div style={{ fontSize: 11, color: T.textMid, marginTop: 2 }}>Dépôts total</div>
              </div>
              {/* Prêts */}
              <div style={{ background: T.surface, borderRadius: 10, padding: "14px 14px 12px", border: `1px solid ${T.border}` }}>
                <Icon n="check" s={16} c={T.green} />
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 600, color: T.green, marginTop: 6 }}>{stats.prets}</div>
                <div style={{ fontSize: 11, color: T.textMid, marginTop: 2 }}>Prêts</div>
              </div>
              {/* CA encaissé avec sélecteurs mois/année séparés */}
              <div style={{ background: T.surface, borderRadius: 10, padding: "14px 14px 12px", border: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                  <Icon n="money" s={15} c={T.green} />
                  <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                    <select value={selMonth} onChange={e => setSelMonth(Number(e.target.value))} style={selStyle}>
                      {MONTHS_FR.map((m, i) => <option key={i+1} value={i+1}>{m.slice(0,3)}</option>)}
                    </select>
                    <select value={selYear} onChange={e => setSelYear(Number(e.target.value))} style={selStyle}>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 600, color: T.green, marginTop: 6 }}>{stats.caFiltered} DH</div>
                <div style={{ fontSize: 11, color: T.textMid, marginTop: 2 }}>CA encaissé · {MONTHS_FR[selMonth-1]} {selYear}</div>
              </div>
              {/* En attente */}
              <div style={{ background: T.surface, borderRadius: 10, padding: "14px 14px 12px", border: `1px solid ${T.border}` }}>
                <Icon n="clock" s={16} c={T.amber} />
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 600, color: T.amber, marginTop: 6 }}>{stats.enAttente} DH</div>
                <div style={{ fontSize: 11, color: T.textMid, marginTop: 2 }}>En attente</div>
              </div>
            </div>

            {/* Prêts */}
            <div style={{ background: T.surface, borderRadius: 10, padding: 16, marginBottom: 12, border: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <SectionTitle>Articles prêts</SectionTitle>
                {stats.prets > 0 && <span style={{ background: T.green, color: "#fff", borderRadius: 4, padding: "1px 8px", fontSize: 10, fontWeight: 700, marginTop: -14 }}>{stats.prets}</span>}
              </div>
              {depots.filter(d => d.statut === "Prêt").length === 0
                ? <div style={{ color: T.textLight, fontSize: 13, textAlign: "center", padding: "12px 0" }}>Aucun article prêt</div>
                : depots.filter(d => d.statut === "Prêt").map(d => {
                  const cl = getClient(d.clientId);
                  return (
                    <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: T.surfaceAlt, color: T.textMid, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, border: `1px solid ${T.border}` }}>{initials(cl.nom)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{cl.nom}</div>
                          <div style={{ fontSize: 11, color: T.textMid }}>{d.items.length} article(s) · {totalTTC(d.items)} DH TTC</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn small onClick={() => showToast(`Notification envoyée à ${cl.nom}`)} variant="green">
                          <Icon n="whatsapp" s={12} c="#fff" />
                        </Btn>
                        <Btn small onClick={() => setFactureDepot({ depot: d, client: cl })} variant="ghost">
                          <Icon n="invoice" s={12} c={T.textMid} />
                        </Btn>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Récent */}
            <div style={{ background: T.surface, borderRadius: 10, padding: 16, border: `1px solid ${T.border}` }}>
              <SectionTitle>Activité récente</SectionTitle>
              {depots.slice(0, 4).map(d => {
                const cl = getClient(d.clientId);
                const retard = d.datePromesse && d.statut !== "Récupéré" && d.statut !== "Prêt" && new Date(d.datePromesse) < new Date();
                return (
                  <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: retard ? T.redLight : T.surfaceAlt, color: retard ? T.red : T.textMid, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, border: `1px solid ${retard ? "#F5C6C6" : T.border}`, flexShrink: 0 }}>{initials(cl.nom)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{cl.nom}</div>
                      <div style={{ fontSize: 11, color: T.textMid }}>
                        {d.items.length} article(s) · {totalTTC(d.items)} DH
                        {d.datePromesse && <span style={{ color: retard ? T.red : T.green, fontWeight: 600 }}> · {fmtDate(d.datePromesse)}</span>}
                      </div>
                    </div>
                    <Badge statut={d.statut} />
                  </div>
                );
              })}
            </div>
          </>
          );
        })()}

        {/* LISTE DÉPÔTS */}
        {!showForm && view === "liste" && (
          <>
            <div style={{ marginBottom: 12 }}>
              <div style={{ position: "relative", marginBottom: 10 }}>
                <input placeholder="Rechercher un client, téléphone, ID..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width: "100%", padding: "10px 13px 10px 36px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 13, outline: "none", background: T.surface, color: T.text, fontFamily: "inherit" }} />
                <div style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }}>
                  <Icon n="eye" s={15} c={T.textLight} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Tous", ...STATUS_FLOW].map(s => (
                  <button key={s} onClick={() => setFilter(s)}
                    style={{ padding: "5px 12px", borderRadius: 4, fontSize: 10, fontWeight: 600, border: `1px solid ${filter === s ? T.charcoal : T.border}`, background: filter === s ? T.charcoal : T.surface, color: filter === s ? "#fff" : T.textMid, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", letterSpacing: .4 }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0
              ? <div style={{ textAlign: "center", color: T.textLight, padding: 40, fontSize: 13 }}>Aucun résultat</div>
              : filtered.map(d => {
                const cl = getClient(d.clientId);
                const retard = d.datePromesse && d.statut !== "Récupéré" && d.statut !== "Prêt" && new Date(d.datePromesse) < new Date();
                return (
                  <div key={d.id} style={{ background: T.surface, borderRadius: 10, padding: 14, marginBottom: 10, border: `1px solid ${retard ? "#F5C6C6" : T.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.surfaceAlt, color: T.textMid, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, border: `1px solid ${T.border}`, flexShrink: 0 }}>{initials(cl.nom)}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{cl.nom}</div>
                          <div style={{ fontSize: 11, color: T.textMid }}>{cl.tel} · <span style={{ color: T.navy2, fontWeight: 600 }}>#{d.id}</span></div>
                        </div>
                      </div>
                      <Badge statut={d.statut} />
                    </div>

                    {/* Tags articles */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                      {d.items.map((it, i) => (
                        <span key={i} style={{ background: T.surfaceAlt, borderRadius: 4, padding: "2px 8px", fontSize: 10, color: T.textMid, fontWeight: 600, border: `1px solid ${T.border}`, textTransform: "uppercase", letterSpacing: .3 }}>
                          {itemLabel(it)} ×{it.qte}
                        </span>
                      ))}
                      <span style={{ fontSize: 11, color: T.text, fontWeight: 700, marginLeft: "auto", fontFamily: "'DM Mono', monospace", fontSize: 14 }}>{totalTTC(d.items)} DH</span>
                    </div>

                    {/* Badges statuts */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                      <PayBadge paiement={d.paiement} acompte={d.acompte} />
                      {d.datePromesse && (
                        <span style={{ background: retard ? T.redLight : T.greenLight, color: retard ? T.red : T.green, padding: "2px 8px", borderRadius: 4, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: .4 }}>
                          {retard ? "Retard · " : ""}{fmtDate(d.datePromesse)}
                        </span>
                      )}
                    </div>

                    <Progress statut={d.statut} />

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                      {/* Avancer */}
                      {d.statut !== "Récupéré" && (
                        <Btn small onClick={() => advanceStatus(d.id)}>
                          <Icon n="arrow" s={12} c="#fff" /> Avancer
                        </Btn>
                      )}
                      {d.statut === "Prêt" && (
                        <Btn small onClick={() => showToast(`Notification envoyée à ${cl.nom}`)} variant="green">
                          <Icon n="whatsapp" s={12} c="#fff" /> WhatsApp
                        </Btn>
                      )}
                      <Btn small onClick={() => setRecuDepot({ depot: d, client: cl })} variant="ghost">
                        <Icon n="receipt" s={12} c={T.textMid} /> Reçu
                      </Btn>
                      <Btn small onClick={() => setFactureDepot({ depot: d, client: cl })} variant="ghost">
                        <Icon n="invoice" s={12} c={T.textMid} /> Facture
                      </Btn>
                      <Btn small onClick={() => setClientPage({ depot: d, client: cl })} variant="ghost">
                        <Icon n="eye" s={12} c={T.textMid} /> Client
                      </Btn>
                      <Btn small onClick={() => setEditDepot({ depot: d, client: cl })} variant="ghost" style={{ color: T.navy2, borderColor: T.borderStrong }}>
                        <Icon n="edit" s={12} c={T.navy2} /> Modifier
                      </Btn>
                    </div>
                  </div>
                );
              })}
          </>
        )}

        {/* CLIENTS */}
        {!showForm && view === "clients" && (() => {
          const clientsWithStats = clientsDB.map(cl => {
            const dep = depots.filter(d => d.clientId === cl.id);
            const ca = dep.filter(d => d.paiement === "paid").reduce((s, d) => s + totalTTC(d.items), 0);
            return { ...cl, dep, ca, actif: dep.filter(d => d.statut !== "Récupéré").length };
          });
          const sorted = [...clientsWithStats].sort((a, b) => {
            if (clientSort === "alpha") return a.nom.localeCompare(b.nom, "fr");
            if (clientSort === "depots") return b.dep.length - a.dep.length;
            if (clientSort === "montant") return b.ca - a.ca;
            return 0;
          });
          const SORTS = [
            { key: "alpha",   label: "A → Z" },
            { key: "depots",  label: "Dépôts" },
            { key: "montant", label: "Montant" },
          ];
          return (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <SectionTitle>Clients</SectionTitle>
                <span style={{ fontSize: 12, color: T.textMid }}>{clientsDB.length} enregistrés</span>
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {SORTS.map(s => (
                  <button key={s.key} onClick={() => setClientSort(s.key)}
                    style={{ flex: 1, padding: "6px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, border: `1px solid ${clientSort === s.key ? T.navy2 : T.border}`, background: clientSort === s.key ? T.navy4 : T.surface, color: clientSort === s.key ? T.navy2 : T.textMid, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", letterSpacing: .4 }}>
                    {s.label}
                  </button>
                ))}
              </div>
              {sorted.map(cl => (
                <div key={cl.id} style={{ background: T.surface, borderRadius: 10, padding: 14, marginBottom: 10, border: `1px solid ${T.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: T.charcoal, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{initials(cl.nom)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{cl.nom}</div>
                      <div style={{ fontSize: 12, color: T.textMid }}>{cl.tel} · <span style={{ color: T.navy2, fontWeight: 600 }}>#{cl.id}</span></div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 600, color: T.green }}>{cl.ca} DH</div>
                      <div style={{ fontSize: 11, color: T.textMid }}>{cl.dep.length} dépôt(s)</div>
                      {cl.actif > 0 && <div style={{ fontSize: 10, color: T.blue, fontWeight: 600 }}>{cl.actif} en cours</div>}
                    </div>
                  </div>
                </div>
              ))}
            </>
          );
        })()}
      </div>

      {/* FAB */}
      {!showForm && (
        <button onClick={() => { setShowForm(true); setView("liste"); }}
          style={{ position: "fixed", bottom: 24, right: 20, width: 50, height: 50, borderRadius: "50%", background: T.charcoal, color: "#fff", border: "none", cursor: "pointer", zIndex: 50, boxShadow: `0 4px 20px rgba(0,0,0,.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon n="plus" s={22} c="#fff" />
        </button>
      )}

      {editDepot && (() => { const liveD = depots.find(d => d.id === editDepot.depot.id) || editDepot.depot; return <EditDepotModal depot={liveD} client={editDepot.client} tarifs={tarifs} customArticles={customArticles} onSave={handleEditDepot} onClose={() => setEditDepot(null)} />; })()}
      {recuDepot && (() => { const liveD = depots.find(d => d.id === recuDepot.depot.id) || recuDepot.depot; return <RecuModal depot={liveD} client={recuDepot.client} onClose={() => setRecuDepot(null)} />; })()}
      {factureDepot && (() => { const liveD = depots.find(d => d.id === factureDepot.depot.id) || factureDepot.depot; return <FactureModal depot={liveD} client={factureDepot.client} onClose={() => setFactureDepot(null)} onSetPaiement={setPaiement} />; })()}
      {clientPage && (() => { const liveD = depots.find(d => d.id === clientPage.depot.id) || clientPage.depot; return <ClientPage depot={liveD} client={clientPage.client} onClose={() => setClientPage(null)} />; })()}
      {showTarifs && <TarifsModal tarifs={tarifs} customArticles={customArticles} onSave={(t, c) => { setTarifs(t); setCustomArticles(c); }} onClose={() => setShowTarifs(false)} />}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}