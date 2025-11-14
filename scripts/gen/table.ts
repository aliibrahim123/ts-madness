export function table (height: number, width: number, exp: (x: number, y: number) => any) {
	let chunks = ['{'];
	for (let y = 0; y < height; y++) {
		chunks.push(`${y}: { `);
		for (let x = 0; x < width; x++) 
			chunks.push(`${x}: ${exp(x, y)}${x === width - 1 ? '' : ','} `);
		chunks.push(y === height - 1 ? '}' : '}, ');
	}
	chunks.push('}');
	return chunks.join('');
}
export function row (width: number, exp: (x: number) => any) {
	let chunks = ['{'];
	for (let x = 0; x < width; x++) 
		chunks.push(`${x}: ${exp(x)}${x === width - 1 ? '' : ','} `);
	chunks.push('}');
	return chunks.join('');
}