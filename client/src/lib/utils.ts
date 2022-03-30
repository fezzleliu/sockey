class RGB {
	r: number;
	g: number;
	b: number;
	constructor(hex: string) {
		const nums = hex.substring(1).match(/.{1,2}/g);
		this.r = parseInt(nums[0], 16);
		this.g = parseInt(nums[1], 16);
		this.b = parseInt(nums[2], 16);
	}

	fade(hex: string, between: number) {
		const nums = hex.substring(1).match(/.{1,2}/g);
		let r: number | string = parseInt(nums[0], 16);
		let g: number | string = parseInt(nums[1], 16);
		let b: number | string = parseInt(nums[2], 16);

		r = this.r + (r - this.r) * between;
		g = this.g + (g - this.g) * between;
		b = this.b + (b - this.b) * between;
		
		r = Math.round(r);
		g = Math.round(g);
		b = Math.round(b);

		r = r.toString(16);
		g = g.toString(16);
		b = b.toString(16);

		r = r.padStart(2, '0');
		g = g.padStart(2, '0');
		b = b.padStart(2, '0');
		
		// @ts-ignore
		window.hex = '#' + r + g + b;

		return '#' + r + g + b;
	}

	set(hex: string) {
		const nums = hex.substring(1).match(/.{1,2}/g);
		this.r = parseInt(nums[0], 16);
		this.g = parseInt(nums[1], 16);
		this.b = parseInt(nums[2], 16);
	}
}

export { RGB };