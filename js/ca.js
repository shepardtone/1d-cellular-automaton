
var canvas;
var pjs;

var canvasWidth = 600;
var canvasHeight = 300;

var cellWidth = 5;

var cellsPerRow = canvasWidth / cellWidth;
var numRows = canvasHeight / cellWidth;

var firstCellIndex = Math.ceil(cellsPerRow / 2) - 1;

var ruleNum = 30;
var binaryRule;		//	int[]


function cellSizeChanged(cellSize) {
	cellWidth = cellSize;
	cellsPerRow = canvasWidth / cellWidth;
	numRows = canvasHeight / cellWidth;
	firstCellIndex = Math.ceil(cellsPerRow / 2) - 1;
	
	pjs.setup();
	pjs.redraw();
}


function startProcessing() {
	
	canvas = document.getElementById('ca_canvas');
	pjs = new Processing(canvas);
	
	pjs.setup = function() {
		pjs.size(canvasWidth, canvasHeight);
		
		pjs.stroke(0);
		pjs.fill(0);
	}
	
	pjs.draw = function() {
		pjs.background(255);
		drawRows();
		pjs.exit();
	}
	
	pjs.setup();
	pjs.redraw();
}


function drawRows() {
	
	binaryRule = convertRuleNumber(ruleNum);
	
	var xOffset = 0;
	var yOffset = 0;
	var currentRow = 1;
	
	var currentRowCells = new Array(cellsPerRow);
	var nextRowCells = new Array(cellsPerRow);
	
	for (var i=0; i<cellsPerRow; i++) {
		currentRowCells[i] = 0;
		nextRowCells[i] = 0;
	}
	
	currentRowCells[firstCellIndex] = 1;
	
	//	draw the start cell
	drawCell(firstCellIndex*cellWidth, 0);
	
	
	while (currentRow < numRows) {
		
		yOffset = currentRow * cellWidth;
		
		for (var i=1; i<currentRowCells.length-1; i++) {
			
			nextRowCells[i] = checkCell(currentRowCells[i-1], currentRowCells[i], currentRowCells[i+1]);
			
			if (nextRowCells[i] == 1) {
				xOffset = i * cellWidth;
				drawCell(xOffset, yOffset);
			}
			
		}
		
		currentRowCells = nextRowCells.slice(0);
		currentRow++;
	}
	
}


function drawCell(x_offset, y_offset) {
	pjs.rect(x_offset, y_offset, cellWidth, cellWidth);
}

function checkCell(prevCell, currentCell, nextCell) {
	
	if (prevCell == 1 && currentCell == 1 && nextCell == 1) return binaryRule[0];
	if (prevCell == 1 && currentCell == 1 && nextCell == 0) return binaryRule[1];
	if (prevCell == 1 && currentCell == 0 && nextCell == 1) return binaryRule[2];
	if (prevCell == 1 && currentCell == 0 && nextCell == 0) return binaryRule[3];
	if (prevCell == 0 && currentCell == 1 && nextCell == 1) return binaryRule[4];
	if (prevCell == 0 && currentCell == 1 && nextCell == 0) return binaryRule[5];
	if (prevCell == 0 && currentCell == 0 && nextCell == 1) return binaryRule[6];
	if (prevCell == 0 && currentCell == 0 && nextCell == 0) return binaryRule[7];
	
}

function convertRuleNumber(ruleNumber) {
	
	var binString = ruleNumber.toString(2);
	
	var binArray = new Array(binString.length);
	
	for (var i=0; i<binString.length; i++) {
		binArray[i] = binString[i];
	}
	
	//	pad beginning of array, if needed. it should contain 8 digits
	if (binArray.length < 8) {
		var numToAdd = 8 - binArray.length;
		
		for (var i=0; i<numToAdd; i++) {
			binArray.unshift(0);
		}
	}
	
	return binArray;
}

function setRuleNum(ruleNum) {
	binaryRule = convertRuleNumber(ruleNum);
}


