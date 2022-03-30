class Point {
	x: number
	y: number

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	rotateAroundPoint(center: Point, angle: number) {
		const cos = Math.cos(angle),
			sin = Math.sin(angle),
			newPoint = new Point();
	
		newPoint.x = (cos * (this.x - center.x)) + (sin * (this.y - center.y)) + center.x;
		newPoint.y = (cos * (this.y - center.y)) + (sin * (this.x - center.x)) + center.y;
	
		return newPoint;
	}

	add(point: Point) {
		return new Point(this.x + point.x, this.y + point.y);
	}

	addX(x: number) {
		return new Point(this.x + x, this.y);
	}

	addY(y: number) {
		return new Point(this.x, this.y + y);
	}

	distanceTo(point: Point) {
		return Math.sqrt((this.x - point.x) ** 2 + (this.y - point.y) ** 2);
	}
}

export { Point }