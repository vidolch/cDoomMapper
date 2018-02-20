class Spriter {
	constructor(rows, cols) {
		this.canvas;
		this.context;
		this.canvasWidth = 800;
		this.canvasHeight = 800;
		this.blockHeight = this.canvasHeight / rows;
		this.blockWidth = this.canvasWidth / cols;

		this.spriteMap = [];

		for (let i = 0; i < rows; i++) {
			this.spriteMap.push([]);
			for (let j = 0; j < cols; j++) {
				this.spriteMap[i].push({
					background: 'transparent'
				});
			}
		}
		// this.rows = rows;
		// this.cols = cols; 

		this.clickX = -1;
		this.clickY = -1;

		this.drag = false;
		this.curColor = "#659b41";
	}
	start() {
		this.prepareCanvas();
		this.redraw();
	}
	prepareCanvas() {
		// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
		this.canvasDiv = document.getElementById('canvasDiv');
		this.canvas = document.createElement('canvas');
		this.canvas.setAttribute('width', this.canvasWidth);
		this.canvas.setAttribute('height', this.canvasHeight);
		this.canvas.setAttribute('id', 'canvas');
		this.canvasDiv.appendChild(this.canvas);

		this.context = this.canvas.getContext("2d");

		let self = this;
		// Grab the 2d canvas context

		// Add mouse events
		// ----------------
		this.canvas.addEventListener('mousedown', function (e) {
			// Mouse down location
			var mouseX = e.pageX - this.offsetLeft;
			var mouseY = e.pageY - this.offsetTop;

			self.drag = true;
			self.addClick(mouseX, mouseY);
			self.redraw();
		});

		this.canvas.addEventListener('mousemove', function (e) {
			if (self.drag == true) {
				self.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
				self.redraw();
			}
		});

		this.canvas.addEventListener('mouseup', function (e) {
			self.drag = false;
			self.redraw();
		});
	}

	addClick(x, y) {
		this.clickX = x;
		this.clickY = y;
	}

	updateColor(color) {
		this.curColor = color;
	}

	clearCanvas() {
		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	}

	redraw() {
		if(this.clickX !== -1 && this.clickY !== -1) {
			let clickX = Math.floor(this.clickX / this.blockHeight);
			let clickY = Math.floor(this.clickY / this.blockHeight);
			this.spriteMap[clickY][clickX].background = this.curColor;
			this.clickX = -1;
			this.clickY = -1;
		}

		for (let i = 0; i < this.spriteMap.length; i++) {
			for (let j = 0; j < this.spriteMap[i].length; j++) {
				if(this.spriteMap[i][j].background === 'transparent') {
					this.context.strokeStyle = 'black';
					this.context.lineWidth = 1;
					this.context.strokeRect(j * this.blockWidth, i * this.blockHeight, this.blockWidth, this.blockHeight);
				} else {
					this.context.fillStyle = this.spriteMap[i][j].background;
					this.context.fillRect(j * this.blockWidth, i * this.blockHeight, this.blockWidth, this.blockHeight);
				}
			}
		}
	}
}