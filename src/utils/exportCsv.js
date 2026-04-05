export function transactionsToCsv(rows) {
  const headers = ["date", "amount", "category", "type", "note"];
  const lines = [headers.join(",")];
  for (const r of rows) {
    const note = (r.note || "").replace(/"/g, '""');
    lines.push(
      [
        r.date,
        r.amount,
        `"${r.category}"`,
        r.type,
        `"${note}"`,
      ].join(",")
    );
  }
  return lines.join("\n");
}

export function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
