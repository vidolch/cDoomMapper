class Spriter {
	constructor(rows, cols) {
		this.canvas;
		this.context;
		this.canvasWidth = 800;
		this.canvasHeight = 800;

		this.rows = rows;
		this.cols = cols; 

		this.clickX = new Array();
		this.clickY = new Array();
		this.clickColor = new Array();
		this.clickTool = new Array();
		this.clickSize = new Array();
		this.clickDrag = new Array();

		this.drag = false;
		this.curColor = "#659b41";
		this.curTool = "crayon";
		this.curSize = "normal";
	}
	start() {
		this.prepareCanvas();
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
			self.addClick(mouseX, mouseY, false);
			self.redraw();
		});

		this.canvas.addEventListener('mousemove', function (e) {
			if (self.drag == true) {
				self.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
				self.redraw();
			}
		});

		this.canvas.addEventListener('mouseup', function (e) {
			self.drag = false;
			self.redraw();
		});
	}

	addClick(x, y, dragging) {
		this.clickX.push(x);
		this.clickY.push(y);
		this.clickTool.push(this.curTool);
		this.clickColor.push(this.curColor);
		this.clickSize.push(this.curSize);
		this.clickDrag.push(dragging);
	}

	clearCanvas() {
		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	}

	redraw() {
		this.context.lineJoin = "square";

		for (var i = 0; i < this.clickX.length; i++) {
			this.context.beginPath();
			if (this.clickDrag[i] && i) {
				this.context.moveTo(this.clickX[i - 1], this.clickY[i - 1]);
			} else {
				this.context.moveTo(this.clickX[i] - 1, this.clickY[i]);
			}
			this.context.lineTo(this.clickX[i], this.clickY[i]);
			this.context.closePath();
			this.context.strokeStyle = this.clickColor[i];
			this.context.lineWidth = 5;
			this.context.stroke();
		}
	}
}