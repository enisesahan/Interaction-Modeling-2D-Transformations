"use strict";

var canvas;
var gl;

var vBuffer, vertices;
var vPosition;
var transformationMatrix, transformationMatrixLoc;


var xr = 0.2;
var yr = 0.1;
var alfa=0.05;
var theta = 10, dtheta=0;
var xVer, yVer;
var colorLoc;
var transformationX=0, transformationY=0, Rotation=0,scaleX=1, scaleY=1;
var l = 38;
var colorArray1 = {
    red: 1,
    green: 0,
    blue: 0
}

var colorArray2 = {
    red: 0,
    green: 0,
    blue: 1
}
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Make the geometry
	
	
   vertices = [ vec2(0.0,0.0)];
		
     
	for (var i=0; i<= 360; i=i+theta)
	{
		xVer = xr * Math.cos(radians(i));
		yVer = yr * Math.sin (radians(i));
		vertices.push( vec2( xVer , yVer ));
	} 
		vertices.push(vec2(-0.05, 0));
		vertices.push(vec2(0, 0.05));
		vertices.push(vec2(0.05, 0));
		vertices.push(vec2(0, -0.05));
	
	console.log(vertices);


    // Load the data into the GPU
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    transformationMatrixLoc = gl.getUniformLocation( program, "transformationMatrix" );
   
    document.getElementById("inp_objX").oninput = function(event) {
       
		transformationX=event.srcElement.value;
    };
    document.getElementById("inp_objY").oninput = function(event) {
       
		transformationY=event.srcElement.value;
    };
    document.getElementById("inp_obj_scaleX").oninput = function(event) {
       
		scaleX=event.srcElement.value;
    };
    document.getElementById("inp_obj_scaleY").oninput = function(event) {
       
		scaleY=event.srcElement.value;
    };
    document.getElementById("inp_rotation").oninput = function(event) {
        
		Rotation=event.srcElement.value;
    };
    document.getElementById("redSlider1").oninput = function(event) {
       
		colorArray1.red = event.srcElement.value;
    };
    document.getElementById("greenSlider1").oninput = function(event) {
        
		 colorArray1.green = event.srcElement.value;
    };
    document.getElementById("blueSlider1").oninput = function(event) {
       
		colorArray1.blue = event.srcElement.value;
    };
    document.getElementById("redSlider2").oninput = function(event) {
      
		colorArray2.red = event.srcElement.value;
    };
    document.getElementById("greenSlider2").oninput = function(event) {
        
		 colorArray2.green = event.srcElement.value;
    };
    document.getElementById("blueSlider2").oninput = function(event) {
        
		colorArray2.blue = event.srcElement.value;
    };
		
	document.getElementById("theta1").onclick = function(event) {
        
		theta = parseInt(event.srcElement.value);
		l =362;
		init();
    };	
	document.getElementById("theta2").onclick = function(event) {
       
		theta = parseInt(event.srcElement.value);
		l=38;
		init();
    };
	document.getElementById("theta3").onclick = function(event) {
        
		theta = parseInt(event.srcElement.value);
		l=20;
		init();
    };	
	document.getElementById("theta4").onclick = function(event) {
       
		theta = parseInt(event.srcElement.value);
		l=14;
		init();
    };	
	document.getElementById("theta5").onclick = function(event) {
       
		theta = parseInt(event.srcElement.value);
		l=8;
		init();
    };	
	document.getElementById("xrSlider").oninput = function(event) {
       
		xr =  event.srcElement.value;	
		init();
		
    };	
	document.getElementById("yrSlider").oninput = function(event) {
       
		yr =  event.srcElement.value;
		init();
		
    };	

	colorLoc = gl.getUniformLocation(program, "color");
    render();

};


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
	var mvStack=[]; 
	transformationMatrix = mat4();
	transformationMatrix = mult(transformationMatrix, translate(transformationX, transformationY, 0));
	transformationMatrix = mult(transformationMatrix, rotate(Rotation, 0, 0, 1));  
	transformationMatrix = mult(transformationMatrix, scalem(scaleX, scaleY, 0)); 

	mvStack.push(transformationMatrix);
	
	//Ellipse
	gl.uniformMatrix4fv (transformationMatrixLoc, false, flatten(transformationMatrix));
	gl.uniform4fv(colorLoc, vec4(colorArray2.red, colorArray2.green, colorArray2.blue, 1.0));
	gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length-4);
	
	//Diamond
	gl.uniform4fv(colorLoc, vec4(colorArray1.red, colorArray1.green, colorArray1.blue, 1.0));
	transformationMatrix = mvStack.pop();
    mvStack.push(transformationMatrix);
	transformationMatrix = mult(transformationMatrix, translate(0, (yr), 0));
	transformationMatrix = mult(transformationMatrix, translate(0, (0.05), 0));
	gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
    gl.drawArrays( gl.TRIANGLE_FAN, l, 4 );

	gl.uniform4fv(colorLoc, vec4(colorArray1.red, colorArray1.green, colorArray1.blue, 1.0));
	transformationMatrix = mvStack.pop();
    mvStack.push(transformationMatrix);
	transformationMatrix = mult(transformationMatrix, translate(0, -(yr), 0));
	transformationMatrix = mult(transformationMatrix, translate(0, -(0.05), 0));
	gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
    gl.drawArrays( gl.TRIANGLE_FAN, l, 4 );
	
	gl.uniform4fv(colorLoc, vec4(colorArray1.red, colorArray1.green, colorArray1.blue, 1.0));
	transformationMatrix = mvStack.pop();
    mvStack.push(transformationMatrix);
	transformationMatrix = mult(transformationMatrix, translate((xr), 0, 0));
	transformationMatrix = mult(transformationMatrix, translate(0.05, 0, 0));
	gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
    gl.drawArrays( gl.TRIANGLE_FAN, l, 4 );
	
	gl.uniform4fv(colorLoc, vec4(colorArray1.red, colorArray1.green, colorArray1.blue, 1.0));
	transformationMatrix = mvStack.pop();
    mvStack.push(transformationMatrix);
	transformationMatrix = mult(transformationMatrix, translate(-(xr), 0, 0));
	transformationMatrix = mult(transformationMatrix, translate(-0.05, 0, 0));
	gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
    gl.drawArrays( gl.TRIANGLE_FAN, l, 4 );
    window.requestAnimFrame(render);
}
