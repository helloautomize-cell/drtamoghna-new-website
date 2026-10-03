/**
 * Contrast table computed in code with the WCAG relative-luminance
 * formula, for every text/background pair in the style guide.
 */

function lum(hex: string) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const l = c.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
}

function ratio(fg: string, bg: string) {
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

const T = {
  primary: "#00838F",
  secondary: "#1E3D49",
  primary500: "#007680",
  primary700: "#006973",
  primary100: "#D9F1F3",
  primary50: "#F1FAFB",
  aqua: "#2AD4D8",
  accent: "#F2A98B",
  ink: "#14303A",
  ink2: "#4A6570",
  line: "#DCE9EC",
  white: "#FFFFFF",
  alert: "#C8302A",
  success: "#2F7D5B",
  wa: "#1F8F55",
};

interface Row {
  label: string;
  fg: string;
  bg: string;
  bgLabel: string;
  use: string;
  passNeeded?: boolean;
}

const rows: Row[] = [
  { label: `Ink ${T.ink}`, fg: T.ink, bg: T.white, bgLabel: "White", use: "All text" },
  { label: `Ink ${T.ink}`, fg: T.ink, bg: T.primary50, bgLabel: "Teal wash", use: "All text" },
  { label: `Ink ${T.ink}`, fg: T.ink, bg: T.primary100, bgLabel: "Teal tint", use: "All text" },
  {
    label: `Ink soft ${T.ink2}`,
    fg: T.ink2,
    bg: T.white,
    bgLabel: "White",
    use: "Captions, card text",
  },
  {
    label: `Ink soft ${T.ink2}`,
    fg: T.ink2,
    bg: T.primary100,
    bgLabel: "Teal tint",
    use: "Captions",
  },
  {
    label: `Teal text ${T.primary500}`,
    fg: T.primary500,
    bg: T.white,
    bgLabel: "White",
    use: "Links, eyebrows, icons",
  },
  {
    label: `Teal text ${T.primary500}`,
    fg: T.primary500,
    bg: T.primary50,
    bgLabel: "Wash",
    use: "Links, eyebrows",
  },
  {
    label: `Teal text ${T.primary500}`,
    fg: T.primary500,
    bg: T.primary100,
    bgLabel: "Tint",
    use: "Links, eyebrows",
  },
  {
    label: `Teal pressed ${T.primary700}`,
    fg: T.primary700,
    bg: T.primary100,
    bgLabel: "Tint",
    use: "Small bold text",
  },
  {
    label: `Teal ${T.primary}`,
    fg: T.primary,
    bg: T.white,
    bgLabel: "White",
    use: "Large text, outlines; not on tints",
  },
  {
    label: "White on teal",
    fg: T.white,
    bg: T.primary,
    bgLabel: T.primary,
    use: "Buttons, Book icon",
  },
  {
    label: "White on slate",
    fg: T.white,
    bg: T.secondary,
    bgLabel: T.secondary,
    use: "Book label, footer",
  },
  {
    label: `Alert ${T.alert}`,
    fg: T.alert,
    bg: T.white,
    bgLabel: "White",
    use: "Emergency line only",
  },
  {
    label: `Success ${T.success}`,
    fg: T.success,
    bg: T.white,
    bgLabel: "White",
    use: "Form success",
  },
  {
    label: "White on WhatsApp green",
    fg: T.white,
    bg: T.wa,
    bgLabel: T.wa,
    use: "WhatsApp button only",
  },
  {
    label: `Aqua ${T.aqua}`,
    fg: T.aqua,
    bg: T.white,
    bgLabel: "White",
    use: "Never text",
    passNeeded: false,
  },
  {
    label: `Peach ${T.accent}`,
    fg: T.accent,
    bg: T.white,
    bgLabel: "White",
    use: "Never text",
    passNeeded: false,
  },
];

export default function ContrastTable() {
  return (
    <table className="ct">
      <thead>
        <tr>
          <th>Text / element</th>
          <th>On</th>
          <th>Ratio</th>
          <th>Use</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => {
          const v = ratio(r.fg, r.bg);
          const pass = v >= 4.5;
          const expected = r.passNeeded !== false;
          return (
            <tr key={i}>
              <td>
                <span
                  className="pv"
                  style={{ color: r.fg, background: r.bg, border: "1px solid var(--line)" }}
                >
                  {r.label}
                </span>
              </td>
              <td>{r.bgLabel}</td>
              <td style={{ fontVariantNumeric: "tabular-nums" }}>{v.toFixed(2)}</td>
              <td className={pass ? "ok" : expected ? "no" : "no"}>
                {pass ? `${r.use} · PASS` : `${r.use} · FAIL`}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
