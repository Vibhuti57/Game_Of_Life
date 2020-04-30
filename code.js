var rows = 24;
var cols = 24;

var playing = false;

var grid = new Array(rows);
var nextGrid = new Array(rows);

function initializeGrids() {
	for (var i = 0; i < rows; i++) {
		grid[i] = new Array(cols);
		nextGrid[i] = new Array(cols);
	}
}

function resetGrids() {
	for (var i = 0; i < rows; i++) {
		for (var j= 0; j < cols; j++) {
			grid[i][j] = 0;
			nextGrid[i][j] = 0;
		}
	}
}

// initialize
function initialize() {
	createTable();
	initializeGrids();
	resetGrids();
	setupControlButtons();
}

// lay out the grid - html table
function createTable() {
	var gridContainer = document.getElementById("gridContainer");
	if (!gridContainer) {
		console.error("Problem: no div for the grid table.");
	}
	
	var table = document.createElement("table");
	for (var i = 0; i < rows; i++) {
		var tr = document.createElement("tr");
		for (var j = 0; j < cols; j++) {
			var cell = document.createElement("td");
			cell.setAttribute("id", i + "_" + j);
			cell.setAttribute("class", "dead");
			cell.onclick = cellClickHandler;
			tr.appendChild(cell);
		}
		table.appendChild(tr);
	}	
	gridContainer.appendChild(table);
}

function cellClickHandler() {
	var rowcol = this.id.split("_");
	var row = rowcol[0];
	var col = rowcol[1];
	var classes = this.getAttribute("class");
	if (classes.indexOf("live") > -1 ) {
		this.setAttribute("class", "dead");
		grid[row][col] = 0;
	}
	else {
		this.setAttribute("class", "live");
		grid[row][col] = 1;
	}
}

function setupControlButtons() {
	var startButton = document.getElementById("start");
	startButton.onclick = startButtonHandler;
	
	var clearButton = document.getElementById("clear");
	clearButton.onclick= clearButtonHandler;
}

function clearButtonHandler() {
	console.log("Clear the game: stop playing, clear the grid");
	playing = false;
	var startButton = document.getElementById("start");
	startButton.innerHTML = "Start";
}

function startButtonHandler() {
	if (playing) {
		console.log("Pause the game.");
		playing = false;
		this.innerHTML = "Continue";
	}
	else {
		console.log("Continue the game.");
		playing = true;
		this.innerHTML = "Pause";
		play();
	}
}

function play() {
	console.log("Play the game.")
	computeNextGen();
}

function computeNextGen() {
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			applyRules(i, j);
		}
	}
}

function applyRules(row, col) {
	var numNeighbor = countNeighbors(row, col);
	if (grid[row][col] == 1) {
		if (numNeighbor < 2) {
			// underpopulation
			nextGrid[row][col] = 0;
		}
		else if (numNeighbor == 2 || numNeighbor == 3) {
			nextGrid[row][col] = 1;
		}
		else if (numNeighbor > 3)
			// overpopulation
			nextGrid[row][col] = 0;
	}
	else if (grid[row][col] == 0) {
		if (numNeighbor == 3) {
			//reproduction
			nextGrid[row][col] = 1;
		}
	}
}

function countNeighbors(row, col) {
	var count = 0;
	if (row-1 >= 0 ) {
		if (grid[row-1][col] == 1) count++;
	}
	if (row-1 >= 0 && col-1 >= 0 ) {
		if (grid[row-1][col-1] == 1) count++;
	}
	if (row-1 >= 0 && col+1 < cols ) {
		if (grid[row-1][col+1] == 1) count++;
	}
	if (col-1 >= 0 ) {
		if (grid[row][col-1] == 1) count++;
	}
	if (col+1 < cols ) {
		if (grid[row][col+1] == 1) count++;
	}
	if (row+1 < rows) {
		if (grid[row+1][col] == 1) count++;
	}
	if (row+1 < rows && col-1 >= 0 ) {
		if (grid[row+1][col-1] == 1) count++;
	}
	if (row+1 < rows && col+1 < cols ) {
		if (grid[row+1][col+1] == 1) count++;
	}
	return count;
}

// start everything
window.onload = initialize;