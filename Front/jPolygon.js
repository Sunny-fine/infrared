/*
   jPolygon - a ligthweigth javascript library to draw polygons over HTML5 canvas images.
   Project URL: http://www.matteomattei.com/projects/jpolygon
   Author: Matteo Mattei <matteo.mattei@gmail.com>
   Version: 1.0
   License: MIT License
*/

var perimeter = new Array();
var scope = new Array();
var complete = false;
var canvas = document.getElementById("jPolygon");
var ctx;
var radius;
var circleFlg = true;
var rectangleFlg = false;
var polygonFlg = false;
var index = 0;
var first = 0;
var img;
var imgArray = new Array();
var recLength = 30;
var oldIndex = 0;
var selectFlg = false;
var shape = new Array();
var moveFlg = false;
var pointX, pointY;
var inputArray = new Array();
var color = '#003300'
var selectedIndex = -1;
var selectedGraph;

function line_intersects(p0, p1, p2, p3) {
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1['x'] - p0['x'];
    s1_y = p1['y'] - p0['y'];
    s2_x = p3['x'] - p2['x'];
    s2_y = p3['y'] - p2['y'];

    var s, t;
    s = (-s1_y * (p0['x'] - p2['x']) + s1_x * (p0['y'] - p2['y'])) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0['y'] - p2['y']) - s2_y * (p0['x'] - p2['x'])) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        return true;
    }
    return false; // No collision
}
function circle() {
    circleFlg = true;
	rectangleFlg = false;
	polygonFlg = false;
	document.getElementById("drawCircleBtn").style.background='#ff0000';
	document.getElementById("drawRectBtn").style.background='#ffffff';
}

function rectangle() {
    circleFlg = false;
	rectangleFlg = true;
	polygonFlg = false;
	document.getElementById("drawRectBtn").style.background='#ff0000';
	document.getElementById("drawCircleBtn").style.background='#ffffff';
}

function polygon() {
    circleFlg = false;
	rectangleFlg = false;
	polygonFlg = true;
	first = 0;
	perimeter.length = 0;
}

function sele() {
	selectFlg = !selectFlg;
	if (selectFlg) {
		document.getElementById("selectBtn").style.background='#ff0000';
		color = "#FF0000";
	}
	else {
		document.getElementById("selectBtn").style.background='#ffffff';
		color = "#003300"
	}
}

function move() {
	moveFlg = !moveFlg;
	if (moveFlg) {
		document.getElementById("moveBtn").style.background='#ff0000';
	}
	else {
		document.getElementById("moveBtn").style.background='#ffffff';
	}
}

function point(x, y){
    ctx.fillStyle="white";
    ctx.strokeStyle = "white";
    ctx.fillRect(x-2,y-2,4,4);
    ctx.moveTo(x,y);
}

function undo(){
    ctx = undefined;
    perimeter.pop();
    complete = false;
    start(true);
}

function clear_canvas(){
	index = 0;
    ctx = undefined;
    perimeter = new Array();
	scope = new Array();
	imgArray = new Array();
	shape = new Array();
    complete = false;
    document.getElementById('coordinates').value = '';
    start();
}

function redraw(index) {
	ctx.reset();
	if (circleFlg == true) {
		radius = scope[index];	
		ctx.lineWidth = 5;
		ctx.strokeStyle = color;
		
		ctx.beginPath();
		//imgArray[index] = ctx.getImageData(perimeter[index]['x']-radius-10, perimeter[index]['y']-radius-10, radius*2+20, radius*2+20);				
		ctx.arc(perimeter[index]['x'], perimeter[index]['y'], radius, 0, 2 * Math.PI);		
		ctx.stroke();
	} else if (rectangleFlg == true) {
		recLength = scope[index];	
		ctx.lineWidth = 5;
		ctx.strokeStyle = color;
		ctx.beginPath();
		//imgArray[index] = ctx.getImageData(perimeter[index]['x']-5, perimeter[index]['y']-5, recLength+10, recLength+10);		
		ctx.rect(perimeter[index]['x'], perimeter[index]['y'], recLength, recLength);
		ctx.stroke();
	}
}

function draw(end){
	//img = ctx.getImageData(0, 0, canvas.width, canvas.height);
	index = oldIndex;

	if (circleFlg == true) {		
		
		radius = 30;	
		ctx.lineWidth = 5;
		ctx.strokeStyle = color;
		
		ctx.beginPath();
		//imgArray[index] = ctx.getImageData(perimeter[index]['x']-radius-10, perimeter[index]['y']-radius-10, radius*2+20, radius*2+20);				
		ctx.arc(perimeter[index]['x'], perimeter[index]['y'], radius, 0, 2 * Math.PI);		
		ctx.stroke();
		scope[index] = radius;
		shape[index] = 0;
		index = index + 1;	
		oldIndex = index;


	}
	else if (rectangleFlg == true) {
		ctx.lineWidth = 5;
		ctx.strokeStyle = color;
		ctx.beginPath();
		//imgArray[index] = ctx.getImageData(perimeter[index]['x']-5, perimeter[index]['y']-5, recLength+10, recLength+10);		
		ctx.rect(perimeter[index]['x'], perimeter[index]['y'], recLength, recLength);
		ctx.stroke();
		scope[index] = recLength;	
		shape[index] = 1;
		index = index + 1;	
		oldIndex = index;		

	}
	else if (polygonFlg == true) {	
		ctx.lineWidth = 5;
		ctx.strokeStyle = "#003300";
		//ctx.lineCap = "square";
		ctx.beginPath();
		for(var i=first; i<perimeter.length; i++){
			if(i==first){
				ctx.moveTo(perimeter[i]['x'],perimeter[i]['y']);
				end || point(perimeter[i]['x'],perimeter[i]['y']);
			} else {
				ctx.lineTo(perimeter[i]['x'],perimeter[i]['y']);
				end || point(perimeter[i]['x'],perimeter[i]['y']);
			}
		}
		if(end){
			ctx.lineTo(perimeter[first]['x'],perimeter[first]['y']);
			ctx.closePath();
			//ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
			//ctx.fill();
			ctx.strokeStyle = 'blue';
			complete = true;
			perimeter.length = 0;
		}
		ctx.stroke();
	}
    // print coordinates
    if(perimeter.length == 0){
        document.getElementById('coordinates').value = '';
    } else {
        //document.getElementById('coordinates').value = JSON.stringify(perimeter);
    }
}

function check_intersect(x,y){
    if(perimeter.length < 4){
        return false;
    }
    var p0 = new Array();
    var p1 = new Array();
    var p2 = new Array();
    var p3 = new Array();

    p2['x'] = perimeter[perimeter.length-1]['x'];
    p2['y'] = perimeter[perimeter.length-1]['y'];
    p3['x'] = x;
    p3['y'] = y;

    for(var i=0; i<perimeter.length-1; i++){
        p0['x'] = perimeter[i]['x'];
        p0['y'] = perimeter[i]['y'];
        p1['x'] = perimeter[i+1]['x'];
        p1['y'] = perimeter[i+1]['y'];
        if(p1['x'] == p2['x'] && p1['y'] == p2['y']){ continue; }
        if(p0['x'] == p3['x'] && p0['y'] == p3['y']){ continue; }
        if(line_intersects(p0,p1,p2,p3)==true){
            return true;
        }
    }
    return false;
}

function deleteGraph() {
	if (selectFlg) {
		if (circleFlg == true) {
			//	
			ctx.clearRect(perimeter[index]['x']-scope[index]-5, perimeter[index]['y']-scope[index]-5, scope[index]*2+10, scope[index]*2+10);
			//ctx.putImageData(imgArray[index], perimeter[index]['x']-scope[index]-10, perimeter[index]['y']-scope[index]-10);		
		}
		else if (rectangleFlg == true) {
			ctx.clearRect(perimeter[index]['x']-5, perimeter[index]['y']-5, scope[index]+10, scope[index]+10);
			//ctx.putImageData(imgArray[index], perimeter[index]['x']-5, perimeter[index]['y']-5);	
		}
		for (let i = index; i < perimeter.length-1; i++) {
			perimeter[i]['x'] = perimeter[i+1]['x'];
			perimeter[i]['y'] = perimeter[i+1]['y'];
			imgArray[i] = imgArray[i+1];
			shape[i] = shape[i+1];
			scope[i] = scope[i+1];
		}
		index = perimeter.length-2;
		perimeter.length = perimeter.length - 1;
	}
}

function point_it(event) {
    var rect, x, y;
	x = event.offsetX;//event.clientX;
	y = event.offsetY;//event.clientY;
	pointX = x;
	pointY = y;
	var coor = "X coords: " + x + ", Y coords: " + y;
    document.getElementById('coordinates').value = coor;
	getTemp(event);
	if (circleFlg == true || rectangleFlg == true) {
		rect = canvas.getBoundingClientRect();
		x = event.clientX - rect.left;
		y = event.clientY - rect.top;
		if (selectFlg) {
			findPoint(x, y);
			color = "#FF0000"
			if (shape[index] == 0) {
				circleFlg = true;
				rectangleFlg = false;
				ctx.beginPath();
				ctx.arc(perimeter[index]['x'], perimeter[index]['y'], scope[index], 0, 2 * Math.PI);
				ctx.strokeStyle = color;
				ctx.stroke();
				ctx.save();									
			}
			else if (shape[index] == 1) {
				rectangleFlg = true;
				circleFlg = false;
				ctx.beginPath();
				ctx.rect(perimeter[index]['x'], perimeter[index]['y'], scope[index], scope[index]);
				ctx.strokeStyle = color;
				ctx.stroke();
				ctx.save();					
			}

			if (selectedIndex != -1 && selectedIndex != index) {
				color = "#003300"
				if (shape[selectedIndex] == 0) {
					ctx.beginPath();
					ctx.arc(perimeter[selectedIndex]['x'], perimeter[selectedIndex]['y'], scope[selectedIndex], 0, 2 * Math.PI);
					ctx.strokeStyle = color;
					ctx.stroke();
					ctx.save();									
				}
				else if (shape[selectedIndex] == 1) {
					ctx.beginPath();
					ctx.rect(perimeter[selectedIndex]['x'], perimeter[selectedIndex]['y'], scope[selectedIndex], scope[selectedIndex]);
					ctx.strokeStyle = color;
					ctx.stroke();
					ctx.save();					
				}
			}
			selectedIndex = index;
			//redraw(index);
			return true;
		}
		if (moveFlg) {
			return true;
		}
		perimeter.push({'x':x,'y':y});


		draw(true);
		return true;
	}
	else if (polygonFlg == true) {		
		if(event.ctrlKey || event.which === 3 || event.button === 2){
			if(perimeter.length==2){
				alert('You need at least three points for a polygon');
				return false;
			}
			x = perimeter[first]['x'];
			y = perimeter[first]['y'];
			if(check_intersect(x,y)){
				alert('The line you are drowing intersect another line');
				return false;
			}
			draw(true);
			//alert('Polygon closed');
			event.preventDefault();
			return false;
		} else {
			
			rect = canvas.getBoundingClientRect();
			x = event.clientX - rect.left;
			y = event.clientY - rect.top;
			if (perimeter.length>0 && x == perimeter[perimeter.length-1]['x'] && y == perimeter[perimeter.length-1]['y']){
				// same point - double click
				return false;
			}
			
			if(check_intersect(x,y)){
				alert('The line you are drowing intersect another line');
				return false;
			}
			
			perimeter.push({'x':x,'y':y});
			draw(false);
			return false;
		}
	}
}
function mouse_up(event) {
	moveFlg = false;
	document.getElementById("moveBtn").style.background='#ffffff';
}
function mouse_move(event) {
	var x, y;
	x = event.offsetX;//event.clientX;
	y = event.offsetY;//event.clientY;
	var coor = "X coords: " + x + ", Y coords: " + y;
        document.getElementById('coordinates').value = coor;
	getTemp(event);
	var rect = canvas.getBoundingClientRect();
	x = event.clientX - rect.left;
	y = event.clientY - rect.top;

	if (moveFlg) {		
		findPoint(x, y);
		if (IsDrawed(x, y)) {
			return;
		}

		if (shape[index] == 0) {
			circleFlg = true;
			rectangleFlg = false;
		}
		else if (shape[index] == 1) {
			rectangleFlg = true;
			circleFlg = false;
		}

		if (circleFlg == true) {
			
			ctx.clearRect(perimeter[index]['x']-scope[index]-5, perimeter[index]['y']-scope[index]-5, scope[index]*2+10, scope[index]*2+10);
			//ctx.putImageData(imgArray[index], perimeter[index]['x']-scope[index]-10, perimeter[index]['y']-scope[index]-10);
			perimeter[index]['x'] = x;
			perimeter[index]['y'] = y;
			ctx.beginPath();
			//imgArray[index] = ctx.getImageData(perimeter[index]['x']-scope[index]-10, perimeter[index]['y']-scope[index]-10, scope[index]*2+20, scope[index]*2+20);		
			ctx.arc(perimeter[index]['x'], perimeter[index]['y'], scope[index], 0, 2 * Math.PI);
		}	
		else if (rectangleFlg == true) {
			ctx.clearRect(perimeter[index]['x']-5, perimeter[index]['y']-5, scope[index]+10, scope[index]+10);
			//ctx.putImageData(imgArray[index], perimeter[index]['x']-5, perimeter[index]['y']-5);
			perimeter[index]['x'] = x;
			perimeter[index]['y'] = y;
			ctx.beginPath();
			//imgArray[index] = ctx.getImageData(perimeter[index]['x']-5, perimeter[index]['y']-5, scope[index]+10, scope[index]+10);	
			ctx.rect(perimeter[index]['x'], perimeter[index]['y'], scope[index], scope[index]);				
		}

		ctx.lineWidth = 5;
		ctx.strokeStyle = color;
		ctx.stroke();
		ctx.save();		
	}

}

function mouse_wheel(ev) {
	var ev = ev || window.event;
	var down = true; 
	down = ev.wheelDelta?ev.wheelDelta<0:ev.detail>0;
	if (index == -1) {
		return;
	}
	//ctx.clip();
	if (down)
	{
		if (IsDrawed(perimeter[index]['x']+5, perimeter[index]['y']))
		{
			return;
		}
	}
	if (circleFlg == true) {
		//	
		ctx.clearRect(perimeter[index]['x']-scope[index]-5, perimeter[index]['y']-scope[index]-5, scope[index]*2+10, scope[index]*2+10);
		//ctx.putImageData(imgArray[index], perimeter[index]['x']-scope[index]-10, perimeter[index]['y']-scope[index]-10);		
	}
	else if (rectangleFlg == true) {
		ctx.clearRect(perimeter[index]['x']-5, perimeter[index]['y']-5, scope[index]+10, scope[index]+10);
		//ctx.putImageData(imgArray[index], perimeter[index]['x']-5, perimeter[index]['y']-5);	
	}
	//ctx.restore();
	//ctx.putImageData(img, 0, 0);

	ctx.beginPath();
	if (circleFlg == true) {
		if (down) {
			scope[index] = scope[index] + 5;
			
		}
		else {
			scope[index] = scope[index] - 5;
			if (scope[index] < 5) scope[index] = 5;
		}
		//imgArray[index] = ctx.getImageData(perimeter[index]['x']-scope[index]-10, perimeter[index]['y']-scope[index]-10, scope[index]*2+20, scope[index]*2+20);		
		ctx.arc(perimeter[index]['x'], perimeter[index]['y'], scope[index], 0, 2 * Math.PI);
		//scope[index] = radius;
	}
	else if (rectangleFlg == true) {
		if (down) {
			scope[index] = scope[index] + 5;
		}
		else {
			scope[index] = scope[index] - 5;
			if (scope[index] < 5) scope[index] = 5;
		}		
		//imgArray[index] = ctx.getImageData(perimeter[index]['x']-5, perimeter[index]['y']-5, scope[index]+10, scope[index]+10);	
		ctx.rect(perimeter[index]['x'], perimeter[index]['y'], scope[index], scope[index]);	
		//scope[index] = recLength;
	}

	ctx.lineWidth = 5;
	ctx.strokeStyle = color;
	ctx.stroke();
	ctx.save();

}

function IsDrawed(x, y)
{
	if (circleFlg == true) {
		for (let i = 0; i < perimeter.length; i++) {
			if (i == index) continue;
			var px = perimeter[i]['x'];
			var py = perimeter[i]['y'];

			if (Math.abs(x - px) <=scope[i]+scope[index]+20
				&& Math.abs(y - py) <=scope[i]+scope[index]+20) {	
				return true;
			}
		}
	}
	else if (rectangleFlg == true) {
		for (let i = index + 1; i < perimeter.length; i++) {
			if (i == index) continue;
			var px = perimeter[i]['x'];
			var py = perimeter[i]['y'];

			if (Math.abs(x - px) <=scope[i]+scope[index]+20
				&& Math.abs(y - py) <=scope[i]+scope[index]+20) {		
				return true;
			}
		}
	}
	return false;
}
function findPoint(x, y)
{
	index = -1;
	
	for (let i = 0; i < perimeter.length; i++) {
		var px = perimeter[i]['x'];
		var py = perimeter[i]['y'];
	

		if (x >= px-scope[i] && x <=px+scope[i]
			&& y >= py-scope[i] && y <= py+scope[i]) {
			index = i;
			
			if (shape[index] == 0) {
				document.getElementById("drawCircleBtn").style.background='#ff0000';
				document.getElementById("drawRectBtn").style.background='#ffffff';
			}
			else if (shape[index] == 1) {
				document.getElementById("drawCircleBtn").style.background='#ffffff';
				document.getElementById("drawRectBtn").style.background='#ff0000';
			}
			break;
			
		}
		
	}
}
function start(with_draw) {	
	//document.getElementById("drawCircleBtn").style.background='#ff0000';
    ctx = canvas.getContext("2d", { alpha: true });
    //img = new Image();
    //img.onload = function(){

    //    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if(with_draw == true){
            draw(false);
        }
   //}

	//img.src = canvas.getAttribute('data-imgsrc');
}

function addComment()
{
	findPoint(pointX, pointY);
	if (index != -1) {
		/*
		inputArray[index] = document.createElement("input");
		inputArray[index].setAttribute("type","text"); 
		inputArray[index].setAttribute("maxlength","10"); 
		inputArray[index].setAttribute("size","20"); 
		inputArray[index].setAttribute("value","");
		inputArray[index].style.position = "absolute";
		inputArray[index].style.top = pointY + 'px';
		inputArray[index].style.left = pointX + 'px';
		inputArray[index].style.zIndex = 2;		
		var parent = document.body; //document.getElementById('mynote');
		parent.appendChild(inputArray[index]);
		*/
		//MicroModal.show('modal-1');
		AddCrossHint(pointX, pointY);
	}


}

var hideswitch = 0;
function removeComment()
{
	findPoint(pointX, pointY);
	if (index != -1) {
		//var parent = document.body; //document.getElementById('mynote'); 
		//parent.removeChild(inputArray[index]);
    if (hideswitch) {
      intro.hideHint(index);
    } else {
      intro.showHint(index);
    }
    hideswitch = !hideswitch;
	}
}


function $my(sl) { // input as css selector
	try {
	  var firstAnswer=document.querySelector(sl);
	  return firstAnswer;
	} catch (e) {
	  console.log("Invalid Selector: ", sl);
	}
  }
  function _id(id) {
	return document.getElementById(id);
  }
  function addDiv(index, id, cls, parent) {
	var div = _id(id+index);
	if (div) {
	  console.log("found div", id+index);
	  return div;
	}
	div = document.createElement('div');
	div.id = id+index;
	div.className = cls;
	//document.getElementsByTagName(parent)[0].appendChild(div);
	_id(parent).appendChild(div);
	return div;
  }
  var markcnt = 0
  var hints = {hints:[]}
  var hintsNote = []
  // 0-based
  function clearHint(index) {
	if (hints.hints.length < index) {
	  console.log('clearHint Failed: ', hints.hints.length, index);
	  return;
	}
	hints.hints[index].removed = 1;
  }
  function saveNote(index, value) {
	var hint = $my('.introjs-hint[data-step="' + (index-1) + '"]');
	console.log("saving note:", index, value, hint);
	hintsNote[index-1] = value;
	//intro.setOptions(hints); 
  }
  // 1-based
  function addHint(index, content) {
	if (hints.hints.length < index) {
	  if (hints.hints.length != index-1) {
		console.log("addHint Failed:", hints.hints.length, index, content);
		return;
	  }
	  hints.hints[index-1] = {
		element: $my('div#mark'+(index)),
		hint: "信息 " + content + "<input id='notemark' placeholder='註釋..' value='' onchange='saveNote("+index+",this.value)'>",
		hintPosition: 'middle-middle'
	  }
	}
  }
  
  var intro = introJs();
  intro.setOption("hintButtonLabel",'隱藏');
  intro.onhintclick(function(hintElement, item, stepId) {
	 // stepId, 0-based 
	 console.log('hint clicked', hintElement, item.hint, stepId);
	 $my('div#mark'+(stepId+1)).style.display = 'block';
	 if (hintsNote[stepId]) {
		item.hint = item.hint.replace(/value='[^']*'/, "value='"+hintsNote[stepId]+"'");
		//console.log("hint changed: ", item.hint);
	 }
  });
  
  intro.onhintclose(function (stepId) {
	 console.log('hint closed', stepId);
	 //this.removeHint(stepId);
	 $my('div#mark'+(stepId+1)).style.display = 'none';
	 //clearHint(stepId);
  });


  function AddCrossHint(px, py) {
	console.log("px:", px, " py:", py);  
	var img = _id("img");
	var x = px;//event.offsetX;//event.clientX;AddCrossHint
	var y = py;//event.offsetY;//event.clientY;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		//_id("coordinates").value = this.responseText;
		//console.log(this.responseText);
		let temp = this.responseText.split(',')[2].split(':')[1];
		temp=parseFloat(temp);
		//addMark
		if (temp > 30.0) {
			$my('div#mark'+markcnt).style.backgroundImage="url('cross.16.png')";
		} else {
			$my('div#mark'+markcnt).style.backgroundImage="url('cross.16.white.png')";
		}
		//$my('p#tempinfo').innerHTML = this.responseText;
		//MicroModal.show('modal-1');
		addHint(markcnt, this.responseText);

		intro.setOptions(hints); // json obj for options
		intro.addHints();
	  }
	};
	xhttp.open("POST", "getTemp.php", true);
	xhttp.send(JSON.stringify({x, y}));
	// update mark1's top and left
	console.log("div.img top:", $my('div.outsideWrapper').offsetTop, "div.img left:", $my('div.outsideWrapper').offsetLeft);
	markcnt++;
	var newdiv = addDiv(markcnt, 'mark', 'mark', 'img');
	newdiv.style.top=(y-4)+"px";
	newdiv.style.left= (x-4)+"px";
	newdiv.style.display='block';
	//$my('div#mark'+markcnt).style.top = (y+$my('div#img').offsetTop-1)+"px";
	//$my('div#mark'+markcnt).style.left = (x+$my('div#img').offsetLeft-1)+"px";
	//$my('div#mark'+markcnt).style.display = 'block';
	return newdiv;
  }

  var lastTime=Date.now();
  var xhttp = new XMLHttpRequest();
  function getTemp(event) {
	var curtime=Date.now();
	//console.log(curtime, lastTime, curtime-lastTime);
	if (curtime - lastTime > 200) {
		lastTime = curtime;
	} else {
		return;
	}
	var x = event.offsetX;//event.clientX;
	var y = event.offsetY;//event.clientY;
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
	  document.getElementById('coordinates').value = this.responseText;
	  let temp = this.responseText.split(',')[2].split(':')[1];
	  temp=parseFloat(temp);
	};
  }
  xhttp.open("POST", "getTemp.php", true);
  xhttp.send(JSON.stringify({x, y}));
} 
/*
function id(id) {
  return document.getElementById(id);
}
var intro = introJs();
intro.setOption("hintButtonLabel",'Remove');
intro.onhintclick(function(hintElement, item, stepId) {
   console.log('hint clicked', hintElement, item, stepId);
});

intro.onhintclose(function (stepId) {
   console.log('hint closed', stepId);
   this.removeHint(stepId);
   $('div#mark1').style.display = 'none';
});
var lastTime=Date.now();
function getTemp(event) {
  var curtime=Date.now();
  console.log(curtime, lastTime, curtime-lastTime);
  if (curtime - lastTime > 200) {
	  lastTime = curtime;
  } else {
	  return;
  }
  var img = id("img");
  var x = event.offsetX;//event.clientX;
  var y = event.offsetY;//event.clientY;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //id("coordinates").innerHTML = this.responseText;
      document.getElementById('coordinates').value = this.responseText;
      //console.log(this.responseText);
    let temp = this.responseText.split(',')[2].split(':')[1];
    temp=parseFloat(temp);
    if (temp > 30.0) {
      id('mark1').style.backgroundImage="url('cross.16.png')";
     } else {
      id('mark1').style.backgroundImage="url('cross.16.white.png')";
     }
  var hints = {hints:[{
                element: $('div#mark1'),
                hint: "This is a note: " + this.responseText,
                hintPosition: 'middle-middle'
              }]};
    intro.setOptions(hints); // json obj for options
    //intro.addHints();
  }
  };
  xhttp.open("POST", "getTemp.php", true);
  xhttp.send(JSON.stringify({x, y}));
  // update mark1's top and left
  //console.log($('div#mark1').offsetTop);
  //$('div#mark1').style.top = y+$('div#img').offsetTop-1;
  //$('div#mark1').style.left = x+$('div#img').offsetLeft-1;
  //$('div#mark1').style.display = 'block';
}

function clearCoor() {
  id("info").innerHTML = "";
  //console.log($('div#img').offsetTop, $('div#img').offsetLeft);
}
*/
MicroModal.init({debugMode:true, awaitCloseAnimation: true,});



