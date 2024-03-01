(function (){

let local = 'http://localhost:3000';
let doc = document;
let win = window;
let ma = Math;
let tw = TweenMax;
let loginDate = id('loginDate');
	loginDate.innerHTML = new Date();
let ri = {
	login:null,
}
let resizeFN = [];
let login = {
	sending:false,
};


init();

function init() {
	addLoginRive();
	addOverlayCanvas();

	win.addEventListener('resize', wResize);
	wResize();
}

function id(d){
	let dom = document.getElementById(d);
	if(dom){
		dom.show = function (){
			dom.style.display = 'block';
		}
		dom.hide = function (){
			dom.style.display = 'none';
		}
		return document.getElementById(d);
	} else {
		console.log("id can't find:" + d);
		return null;
	}
}

function addLoginRive() {
	login.acc = id('iAcc');
	login.pw = id('iPwd');
	let can = id("loginRive");
	const r = new rive.Rive({
	    // src: "riv/sophia_iii.riv",
	    src: "images/login_fud.riv",
	    // OR the path to a discoverable and public Rive asset
	    // src: '/public/example.riv',
	    canvas: can,
	    autoplay: true,
	    stateMachines: "SM",
	    // stateMachines: "SOPHIA_III_DASHBOARD_SEQ",
	    //SOPHIA_III_DASHBOARD_SEQ State Machine 1
	    onLoad: () => {
			// r.resizeDrawingSurfaceToCanvas();
			let sm = r.stateMachineInputs('SM');
			win.ss = sm;
			r.ev = {};
			// return;
			sm.forEach(function (el, index) {
				switch(el.name){
					case 'Error':
						let fxError = id('fxError');
						r.ev.error = function () {
							let sound = fxError.cloneNode();
							sound.addEventListener('ended', function(e) {
								sound = null;
							});
							sound.play();
							el.fire();
						};
						// setTimeout(function () {
						// 	el.fire();	
						// }, 2500);
						break;
					case 'success':
						let fxSuccess = id('fxSuccess');
						r.ev.success = function () {
							let sound = fxSuccess.cloneNode();
							sound.addEventListener('ended', function(e) {
								sound = null;
							});
							sound.play();
							el.fire();
						};
						// setTimeout(function () {
						// 	el.fire();	
						// }, 5000);
						break;
					case 'isHover':
						// setTimeout(function () {
						// 	el.value = true;
						// }, 3500);
						break;
				}
			});
	    },
	});
	ri.login = r;
	
	r.on(rive.EventType.RiveEvent, function (e) {
		switch(e.data.name){
			case 'loginSend':
				// e.data.properties.buttonReport == 'loginSend'
				checkLoginPW();
				break;
		}
		// console.log('event');
		// console.log(e);
	});
}
function checkLoginPW() {
	// console.log(ri.login);
	if (login.acc.value.trim() == 0) {
		ri.login.ev.error();
		console.log('acc error');
		return;
	};
	if (login.pw.value.trim() == 0) {
		ri.login.ev.error();
		console.log('pw error');
		return;
	};

	if (login.acc.value.trim() != 'asd') {
		ri.login.ev.error();
		console.log('acc error');
		return;
	};
	if (login.pw.value.trim() != 'asd') {
		ri.login.ev.error();
		console.log('pw error');
		return;
	};
	ri.login.ev.success();
	login.acc.hide();
	login.pw.hide();
	return;


	axios.post(local + '/login', {
		account: login.acc.value.trim(),
		password: login.pw.value.trim()
	})
	.then(function (r) {
		let rs = r.data;
		console.log(rs);
		if (typeof rs != 'object' ) return;
		if ( !rs.rs ) return;
		console.log(123);
		switch(rs.rs){
			case 'ok':
				ri.login.ev.success();
				break;
			case 'error':
				ri.login.ev.error();
				break;
		}
	})
	.catch(function (err) {
		console.log('err', err);
	});

}


function addOverlayCanvas(arguments) {
	let overCan = id('overCan');
	resizeFN.push(function () {
		overCan.width = win.innerWidth;
		overCan.height = win.innerHeight;	
	});
	let c = overCan;
	let ctx = c.getContext('2d');
	let render;
	let items = [];

	(function (){
		function pImg (cx,img,w,h,x,y,r) {
			cx.save();
			cx.translate(x, y);
			cx.rotate(r);
			cx.drawImage(img,-w/2,-h/2,w,h);
			cx.restore();
		};
		function draw(o){
			let t = o;
			ctx.globalAlpha = t.a;
			pImg(
				ctx, t.img,
				t.w*t.s,t.h*t.s,
				t.x,t.y,
				t.r
			);
		};
		render =function (){
			ctx.clearRect(0,0,c.width,c.height);
			ctx.save();
			let a = [];
			items.forEach(function (el, index) {
				if (el.kill) return;
				a.push(el);
				el.update();
			});
			items = a;
			ctx.restore();
		}
	})();

	c.i = 0;
	tw.to(c,1,{i:1,onUpdate:render, repeat:-1});

	let fxHover = id('fxHover');
	let oui = doc.querySelectorAll('.oui');
	oui.forEach(function (el, index) {
		el.addEventListener('mouseenter', function(e) {
			let sound = fxHover.cloneNode();
			sound.addEventListener('ended', function(e) {
				sound = null;
			});
			sound.load();
			sound.play();
			let s = el.getAttribute('oui');
			ctx.font = '14px Oxanium';
			let metrics = ctx.measureText(s);
			let brect = el.getBoundingClientRect();
			let an = {
				stay:1.5,
				speed:0.3,
				opacity:0,
				arcpi1:2 * ma.PI,
				arcpi2:0,
				arcradius1:0,
				arcradius2:10,
				x:95,
				y:250,
				x:(brect.x + brect.width -25) | 0,
				y:(brect.y + brect.height *0.5) | 0,
				ox:50,
				oy:-50,
				lineLong:metrics.width | 0,
				lineLongNum:0,
				str:'',
				strNum:0
			};
			an.cx = an.tx = an.x + an.ox;
			an.cy = an.ty = an.y + an.oy;
			tw.to(an, 0.05,{
				repeat:2,
				yoyo:true,
				opacity:1
			});
			tw.to(an, an.speed,{
				repeat:1,
				yoyo:true,
				repeatDelay:2,
				arcradius1:3,
				ease:Elastic.easeOut.config(5, 1)
			});
			tw.to(an, an.speed,{
				repeat:1,
				yoyo:true,
				repeatDelay:an.stay,
				arcpi2:an.arcpi1,
				lineLongNum:an.lineLong,
				tx:an.x,
				ty:an.y,
				onComplete:function () {
					o.kill = true;
				}
			});
			tw.to(an, an.speed, {
				repeat:1,
				yoyo:true,
				repeatDelay:2,
				strNum:s.length,onUpdate:function () {
					an.str = s.slice(0, an.strNum | 0);
				}
			});
			
			let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
			let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
			let o = {
				kill:false,
				update : function () {
					// ctx.globalCompositeOperation  = 'lighter';
					ctx.globalAlpha = an.opacity;
					ctx.fillStyle = 'white';
					ctx.strokeStyle = 'white';

					ctx.beginPath();
					ctx.arc(an.x, an.y, an.arcradius1, 0, an.arcpi1);
					ctx.stroke();
					ctx.fill();
					ctx.closePath();

					ctx.beginPath();
					ctx.arc(an.x, an.y, an.arcradius2, 0, an.arcpi2);
					ctx.stroke();
					ctx.closePath();

					ctx.beginPath();
					ctx.moveTo(an.x+an.ox, an.y+an.oy);
					ctx.lineTo(an.x+an.ox + an.lineLongNum, an.y+an.oy);
					ctx.stroke();
					ctx.closePath();

					ctx.beginPath();
					ctx.moveTo(an.x+an.ox, an.y+an.oy);
					ctx.lineTo(an.tx, an.ty);
					ctx.stroke();
					ctx.closePath();

					// ctx.font = '300 14px "Kode Mono"';
					
					ctx.fillText(an.str, an.cx, an.cy - 8);


				}
			};
			
			items.push(o);
			
		});
		
	});
}

function wResize() {
	resizeFN.forEach(function (el, index) {
		el();
	});
}




})();