interface TableOptions {
	rawFormat: 'one-line' | '8-per-line' | '4-per-line' | '2-per-line' | '1-per-line'
}

export function table (
	width: number, height: number, exp: (x: number, y: number) => string, opts: Partial<TableOptions> = {}
) {
	const { rawFormat }: TableOptions = { 
		rawFormat: 'one-line',
		...opts,
	}
	const chunks = ['{\n'];

	for (let y = 0; y < height; y++) {
		chunks.push(`\t${y}: { `);
		if (rawFormat !== 'one-line') chunks.push('\n\t\t');
		
		for (let x = 0; x < width; x++) {
			chunks.push(`${x}: ${exp(x, y)}${x === width - 1 ? '' : ','} `);
			if (
				x !== width - 1 && (
				rawFormat === '1-per-line' ||
				rawFormat === '2-per-line' && x % 2 === 1 ||
				rawFormat === '4-per-line' && x % 4 === 3 ||
				rawFormat === '8-per-line' && x % 8 === 7
			)) chunks.push('\n\t\t');
		}

		chunks.push(rawFormat === 'one-line' ? '},\n' : '\n\t},\n');
	}

	chunks.push('}');
	return chunks.join('');
}

export function row (width: number, exp: (x: number) => string, opts: Partial<TableOptions> = {}) {
	const { rawFormat }: TableOptions = { 
		rawFormat: 'one-line',
		...opts,
	}
	const chunks = ['{'];

	chunks.push(rawFormat === 'one-line' ? ' ' : '\n\t');
	
	for (let x = 0; x < width; x++) {
		chunks.push(`${x}: ${exp(x)}${x === width - 1 ? '' : ','} `);
		if (
			x !== width - 1 && (
			rawFormat === '1-per-line' ||
			rawFormat === '2-per-line' && x % 2 === 1 ||
			rawFormat === '4-per-line' && x % 4 === 3 ||
			rawFormat === '8-per-line' && x % 8 === 7
		)) chunks.push('\n\t');
	}

	chunks.push('}');
	return chunks.join('');
}