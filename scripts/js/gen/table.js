function table(width, height, exp, opts = {}) {
  const { rawFormat } = {
    rawFormat: "one-line",
    ...opts
  };
  const chunks = ["{\n"];
  for (let y = 0; y < height; y++) {
    chunks.push(`	${y}: { `);
    if (rawFormat !== "one-line") chunks.push("\n		");
    for (let x = 0; x < width; x++) {
      chunks.push(`${x}: ${exp(x, y)}${x === width - 1 ? "" : ","} `);
      if (x !== width - 1 && (rawFormat === "1-per-line" || rawFormat === "2-per-line" && x % 2 === 1 || rawFormat === "4-per-line" && x % 4 === 3 || rawFormat === "8-per-line" && x % 8 === 7)) chunks.push("\n		");
    }
    chunks.push(rawFormat === "one-line" ? "},\n" : "\n	},\n");
  }
  chunks.push("}");
  return chunks.join("");
}
function row(width, exp, opts = {}) {
  const { rawFormat } = {
    rawFormat: "one-line",
    ...opts
  };
  const chunks = ["{"];
  chunks.push(rawFormat === "one-line" ? " " : "\n	");
  for (let x = 0; x < width; x++) {
    chunks.push(`${x}: ${exp(x)}${x === width - 1 ? "" : ","} `);
    if (x !== width - 1 && (rawFormat === "1-per-line" || rawFormat === "2-per-line" && x % 2 === 1 || rawFormat === "4-per-line" && x % 4 === 3 || rawFormat === "8-per-line" && x % 8 === 7)) chunks.push("\n	");
  }
  chunks.push("}");
  return chunks.join("");
}
export {
  row,
  table
};
