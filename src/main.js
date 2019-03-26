class Spriter {
	constructor(rows, cols) {
		this.canvas;
		this.context;
		this.blockHeight = 30;
		this.blockWidth = 30;
		this.spriteMap = [];
		this.rows = rows;
		this.cols = cols;


		for (let i = 0; i < cols; i++) {
			this.spriteMap.push([]);
			for (let j = 0; j < rows; j++) {
				this.spriteMap[i].push('.');
			}
		}

		this.clickX = -1;
		this.clickY = -1;

		this.drag = false;
		this.curColor = "#000";
		this.prevColor = "#000";
		this.colors = [];
	}
	start() {
		this.prepareCanvas();
		this.redraw();
	}
	import(importObj) {
		this.spriteMap = [];
		for (let i = 0; i < importObj.length; i++) {
			this.spriteMap.push([]);
			for (let j = 0; j < importObj[i].length; j++) {
				this.spriteMap[i].push(importObj[i][j]);
				if(this.colors.filter((color) => color === importObj[i][j]).length === 0) {
					this.colors.push(importObj[i][j]);
				}
			}
		}
		this.rows = importObj[0].length;
		this.cols = importObj.length;
		this.prepareCanvas();
		this.redraw();
	}
	prepareCanvas() {
		this.canvasWidth = this.rows * this.blockWidth;
		this.canvasHeight = this.cols * this.blockHeight;
		// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
		this.canvasDiv = document.getElementById('drawing_area');
		this.canvas = document.createElement('canvas');
		this.canvas.setAttribute('width', this.canvasWidth);
		this.canvas.setAttribute('height', this.canvasHeight);
		this.canvas.setAttribute('id', 'canvas');
		this.canvasDiv.appendChild(this.canvas);

		this.context = this.canvas.getContext("2d");

		// We always use one stroke style
		this.context.strokeStyle = 'black';
		this.context.lineWidth = 1;

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

	updateColor(newColor) {
		this.curColor = newColor;
		if(this.colors.filter((color) => color === newColor).length === 0) {
			this.colors.push(newColor);
		}
	}

	eraseMode() {
		if(this.curColor !== '.') {
			this.prevColor = this.curColor;
			this.curColor = '.';
		} else {
			this.curColor = this.prevColor;
		}
	}

	clearCanvas() {
		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	}

	redraw() {
		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		if(this.clickX !== -1 && this.clickY !== -1) {
			let clickX = Math.floor(this.clickX / this.blockHeight);
			let clickY = Math.floor(this.clickY / this.blockHeight);
			this.spriteMap[clickY][clickX] = this.curColor;
			this.clickX = -1;
			this.clickY = -1;
		}

		for (let i = 0; i < this.spriteMap.length; i++) {
			for (let j = 0; j < this.spriteMap[i].length; j++) {
				if(this.spriteMap[i][j] === '.') {
					this.context.fillStyle = 'rgba(0,0,0,0)';
				} else {
					this.context.fillStyle = this.spriteMap[i][j];
				}
				this.context.strokeRect(j * this.blockWidth, i * this.blockHeight, this.blockWidth, this.blockHeight);
				this.context.fillRect(j * this.blockWidth + 1, i * this.blockHeight + 1, this.blockWidth - 2, this.blockHeight - 2);
			}
		}
	}

	exportAsset() {
		let exportObj = [];
		for (let i = 0; i < this.spriteMap.length; i++) {
			exportObj.push([]);
			let hasHorElements = false;
			let tempHorBuffer = [];
			for (let j = 0; j < this.spriteMap[i].length; j++) {
				if(this.spriteMap[i][j] === '.') {
					exportObj[i].push('.');
				} else {
					exportObj[i].push(this.spriteMap[i][j]);
				}
			}
		}
		var a = document.createElement("a");
		var file = new Blob([JSON.stringify(exportObj)], {type: 'text/plain'});
		a.href = URL.createObjectURL(file);
		a.download = 'asset.json';
		a.click();
		return exportObj;
	}
}