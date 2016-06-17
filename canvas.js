var context;
var canvas;
var zoom = 1;
var floor = [];
var colorLib = ["white","rgb(225,51,50)","rgb(87,111,154)","rgb(138,177,78)",
				"rgb(204,169,75)","rgb(91,67,45)"];
var currentSelected = 1;
var dragIndex;
var colorIndex=1;

function createObject(name, color, arrayBuffer, core){
	var obj = new Object();
	obj.name = name;
	obj.color = color;
	obj.arrayBuffer = arrayBuffer;
	obj.zoom = 1;
	obj.core = core;
	return obj;
}
//name 名称
//arrayBuffer 是一个数组，以[x, y, w, h, x1, y1, w1, h1, ...] 格式存储
//Core 存储缩放中心,缩放中心不会影响scale
//zoom 存储缩放倍率
//
function drawObject(obj){
	context.fillStyle = colorLib[obj.color];
	if (obj.zoom == 1){
		for (var i = 0; i<obj.arrayBuffer.length; i=i+4){
			context.fillRect(obj.arrayBuffer[i]*zoom,
							obj.arrayBuffer[i+1]*zoom,
							obj.arrayBuffer[i+2]*zoom,
							obj.arrayBuffer[i+3]*zoom);
		}
	}
	else{
		for (var i = 0; i<obj.arrayBuffer.length; i=i+4){
			context.fillRect((obj.arrayBuffer[i]-(obj.core[0]-obj.arrayBuffer[i])*(obj.zoom-1))*zoom,
							(obj.arrayBuffer[i+1]-(obj.core[1]-obj.arrayBuffer[i+1])*(obj.zoom-1))*zoom,
							obj.arrayBuffer[i+2]*zoom*obj.zoom,
							obj.arrayBuffer[i+3]*zoom*obj.zoom);
		}
	}
}

function move(obj, x, y){
	for (var i = 0; i<obj.arrayBuffer.length; i=i+4){
		obj.arrayBuffer[i]+=x;
		obj.arrayBuffer[(i+1)] += y;				
	}
	obj.core[0]+=x;
	obj.core[1]+=y;
	render();
}

function init(){
	canvas = document.getElementById('mCanvas');
	context = canvas.getContext("2d");
	floor.push(createObject("SNS",1,[100,100,100,100],[150,150]));
	drawObject(floor[0]);
	context.fillStyle= "white";
	context.fillRect(150*zoom,150*zoom,5,5);
}
function clearCanvas(){
	context.clearRect(0,0,750*zoom, 520*zoom);
}
function render(){
	clearCanvas();
	zoom=1;
	for(var i in floor){
		floor[i].zoom=1;
		drawObject(floor[i]);
	}
}
function create(){
	var x = parseInt(document.getElementById('x').value);
	var y = parseInt(document.getElementById('y').value);
	var w = parseInt(document.getElementById('w').value);
	var h = parseInt(document.getElementById('h').value);
	var name = document.getElementById('name').value;
	floor.push(createObject(name,colorIndex,[x,y,w,h],[x,y]));
	render();
}
function ifInArea(obj, x, y){
	for (var i = 0; i<obj.arrayBuffer.length; i=i+4){
		var aB= obj.arrayBuffer;
		if ((aB[i]<x)&&(aB[i+1]<y)&&((aB[i+2]+aB[i])>x)&&((aB[i+3]+aB[i+1])>y)){
			return true;
		}
	}
	return false;
}
function search(x, y){
	for (var i = floor.length-1; i>=0; i--){
		if (ifInArea(floor[i] , x , y)){
			return i;
		}
	}
	return null;
}
var pX, pY;
var ifMouseDown=false;
$(document).ready(function(){
	$('#mCanvas').mousedown(function(e) {
		pX = 0;
		pY = 0;
		dragIndex = search(e.pageX, e.pageY);

		ifMouseDown = true;
	});
	$('#mCanvas').mouseup(function(e) {
		ifMouseDown = false;
	});
	$('mCanvas').mouseleave(function(e) {
		ifMouseDown = false;
	});
	$("#mCanvas").mousemove(function(e){
		if(ifMouseDown&&(pX!=0)){
			move(floor[dragIndex], (e.pageX-pX), (e.pageY-pY));
		}
		if (ifMouseDown){
			pX=e.pageX; pY=e.pageY;
		}
	});
})
