var face = [];
var position = {x:0, y:0};
var scale = 0;
var orientation = {x:0, y:0, z:0};
var mouthWidth = 0;
var mouthHeight = 0;
var eyebrowLeft = 0;
var eyebrowRight = 0;
var eyeLeft = 0;
var eyeRight = 0;
var jaw = 0;
var nostrils = 0;
//var img;
var capture;

function setup() {
  	createCanvas(500, 400);
	setupOsc(8338, 3334);
	//img = loadImage(//CAN PUT IN A PICTURE HERE)
	capture = createCapture(VIDEO);
	capture.size(320,240);
	capture.hide();
}

function draw() {
	//background color
	  background(255);
	  imageMode(CORNER);
	  image(capture, 0, 0, width, width * capture.height / capture.width);
	  rectMode(CENTER);
	  

	// FACE_OUTLINE : 0 - 16
	// LEFT_EYEBROW : 17 - 21
	// RIGHT_EYEBROW : 22 - 26
	// NOSE_BRIDGE : 27 - 30
	// NOSE_BOTTOM : 31 - 35
	// LEFT_EYE : 36 - 41
	// RIGHT_EYE : 42 - 47
	// INNER_MOUTH : 48 - 59
	// OUTER_MOUTH : 60 - 65
	imageMode(CENTER);
	fill(255, 0, 0);
	//ellipse(position.x, position.y, 100, 100);
	
	//image(img,position.x-60, position.y-40, img.width/9, img.height/9);
	/*noFill();
bezier(85, 20, 10, 10, 90, 90, 15, 80);
var steps = 6;
fill(255);
for (var i = 0; i <= steps; i++) {
  var t = i / steps;
  // Get the location of the point
  var x = bezierPoint(85, 10, 90, 15, t);
  var y = bezierPoint(20, 10, 90, 80, t);
  // Get the tangent points
  var tx = bezierTangent(85, 10, 90, 15, t);
  var ty = bezierTangent(20, 10, 90, 80, t);
  // Calculate an angle from the tangent points
  var a = atan2(ty, tx);
  a += PI;
  stroke(255, 102, 0);
  line(x, y, cos(a) * 30 + x, sin(a) * 30 + y);
  // The following line of code makes a line
  // inverse of the above line
  //line(x, y, cos(a)*-30 + x, sin(a)*-30 + y);
  stroke(0);
  ellipse(x, y, 5, 5);
}*/
//reading whenever it is mouth it is going to map to where my mouth height is
	var mouth = map(mouthHeight, 2, 4.4, 0, 255);
if (mouthHeight > 1.3 && mouthHeight < 4.4){
	fill(0, 255, 0);
	//rect (position.x, position.y, 100, 100)
	textSize(20);
	text('Silence', position.x-90, position.y-10) }

	var mouth = map(mouthHeight, 4.5, 7.5, 0, 255);
	if (mouthHeight > 4.4 && mouthHeight < 7.5) {
	// fill(mouth, mouth, mouth);
	fill(255, 0, 0);
	//rect (position.x, position.y, 100, 100)
	textSize(20);
	text('Screaming', position.x-90, position.y-10) }

	var left_eye = map(eyeLeft, 36, 41, 5, 500);
	fill(left_eye, left_eye, left_eye);
	textSize(20);
	text('See', position.x-60, position.y-82)

	var right_eye = map(eyeRight, 36, 41, 5, 500);
	fill(right_eye,right_eye, right_eye);
	textSize(20);
	text('See', position.x-120, position.y-82)

	var right_eyebrow = map(eyebrowRight, 2, 5, 8, 100);
	textSize(30);
	text('eyebrows', position.x-140, position.y-100)

	var nose = map(nostrils, 2, 5, 8, 100);
	textSize(20);
	text('nose', position.x-90, position.y-50)

	//var jaw_face = map(jaw, 2, 5 , 8, 100);
	//textSize(20)
	//text('jaw', position.x-100, position.y-70)

	

}

function receiveOsc(address, value) {
	if (address == '/raw') {
		face = [];
		for (var i=0; i<value.length; i+=2) {
			face.push({x:value[i], y:value[i+1]});
		}
	}
	else if (address == '/pose/position') {
		position = {x:value[0], y:value[1]};
		//print(position);
	}
	else if (address == '/pose/scale') {
		scale = value[0];
	}
	else if (address == '/pose/orientation') {
		orientation = {x:value[0], y:value[1], z:value[2]};
	}
	else if (address == '/gesture/mouth/width') {
		mouthWidth = value[0];
	}
	else if (address == '/gesture/mouth/height') {
		mouthHeight = value[0];
		// print(mouthHeight);
	}
	else if (address == '/gesture/eyebrow/left') {
		eyebrowLeft = value[0];
	}
	else if (address == '/gesture/eyebrow/right') {
		eyebrowRight = value[0];
	}
	else if (address == '/gesture/eye/left') {
		eyeLeft = value[0];
	}
	else if (address == '/gesture/eye/right') {
		eyeRight = value[0];
	}
	else if (address == '/gesture/jaw') {
		jaw = value[0];
	}
	else if (address == '/gesture/nostrils') {
		nostrils = value[0];
	}
}

function setupOsc(oscPortIn, oscPortOut) {
	var socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {	
			server: { port: oscPortIn,  host: '127.0.0.1'},
			client: { port: oscPortOut, host: '127.0.0.1'}
		});
	});
	socket.on('message', function(msg) {
		if (msg[0] == '#bundle') {
			for (var i=2; i<msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}