export default function TruncateText(text, charLimit = 30) {
  if (text.length > charLimit) {
    return text.slice(0, charLimit) + "...";
  }
  return text;
}
