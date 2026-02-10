/**
 * Wraps brand names in the logo font (Cormorant Garamond).
 *
 * Use <Brand> for direct JSX wrapping of brand words.
 * Use <BrandText> to auto-wrap brand words within a plain string.
 */
export default function Brand({ children }: { children: React.ReactNode }) {
  return <span className="font-logo font-medium">{children}</span>;
}

/**
 * Renders a string, wrapping "Casa Intelligence" and standalone capitalised
 * "Intelligence" in the logo font.
 */
export function BrandText({ text }: { text: string }) {
  const regex = /(Casa Intelligence\b|(?:Planning |Market |Financial |Cadastral |Local |Development )?Intelligence\b)/g;
  const parts: Array<string | JSX.Element> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const matched = match[0];
    // Only wrap the "Intelligence" portion in the brand font
    if (matched === 'Casa Intelligence') {
      parts.push(<Brand key={match.index}>{matched}</Brand>);
    } else if (matched === 'Intelligence') {
      parts.push(<Brand key={match.index}>{matched}</Brand>);
    } else {
      // E.g. "Planning Intelligence" -- wrap only "Intelligence"
      const prefix = matched.replace('Intelligence', '');
      parts.push(prefix);
      parts.push(<Brand key={match.index}>Intelligence</Brand>);
    }
    lastIndex = match.index + matched.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}
