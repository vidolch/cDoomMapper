class Spriter {
	constructor(rows, cols) {
		this.canvas;
		this.context;
		this.blockHeight = 30;
		this.blockWidth = 30;
		this.canvasWidth = rows * this.blockWidth;
		this.canvasHeight = cols * this.blockHeight;

		this.spriteMap = [];

		for (let i = 0; i < cols; i++) {
			this.spriteMap.push([]);
			for (let j = 0; j < rows; j++) {
				this.spriteMap[i].push({
					background: 'transparent'
				});
			}
		}

		this.clickX = -1;
		this.clickY = -1;

		this.drag = false;
		this.curColor = "#000";
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

	updateColor(color) {
		this.curColor = color;
	}

	eraseMode() {
		this.curColor = 'transparent';
	}

	clearCanvas() {
		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	}

	redraw() {
		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
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
					this.context.fillStyle = 'rgba(0,0,0,0)';
				} else {
					this.context.fillStyle = this.spriteMap[i][j].background;
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
				if(this.spriteMap[i][j].background === 'transparent') {
					exportObj[i].push('.');
				} else {
					exportObj[i].push(this.spriteMap[i][j].background);
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