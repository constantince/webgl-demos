!function(e){function t(t){for(var n,i,u=t[0],l=t[1],c=t[2],s=0,d=[];s<u.length;s++)i=u[s],Object.prototype.hasOwnProperty.call(a,i)&&a[i]&&d.push(a[i][0]),a[i]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(e[n]=l[n]);for(f&&f(t);d.length;)d.shift()();return o.push.apply(o,c||[]),r()}function r(){for(var e,t=0;t<o.length;t++){for(var r=o[t],n=!0,u=1;u<r.length;u++){var l=r[u];0!==a[l]&&(n=!1)}n&&(o.splice(t--,1),e=i(i.s=r[0]))}return e}var n={},a={13:0},o=[];function i(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=e,i.c=n,i.d=function(e,t,r){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(r,n,function(t){return e[t]}.bind(null,n));return r},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var u=window.webpackJsonp=window.webpackJsonp||[],l=u.push.bind(u);u.push=t,u=u.slice();for(var c=0;c<u.length;c++)t(u[c]);var f=l;o.push([62,0]),r()}({0:function(e,t,r){"use strict";function n(e,t,r){var n=e.createShader(t);if(n){if(e.shaderSource(n,r),e.compileShader(n),!e.getShaderParameter(n,e.COMPILE_STATUS)){var a=e.getShaderInfoLog(n);return console.warn(a),null}return n}return null}function a(e,t,r,n){var a=e.createProgram();if(a){if(e.attachShader(a,t),e.attachShader(a,r),n&&n.length>0&&(e.bindAttribLocation(a,n[0],"a_Position"),e.bindAttribLocation(a,n[1],"a_Color")),e.linkProgram(a),!e.getProgramParameter(a,e.LINK_STATUS)){var o=e.getProgramInfoLog(a);return console.warn(o),null}return a}return null}Object.defineProperty(t,"__esModule",{value:!0}),t.clearCanvas=t.preparation=t.resizeCanvasToDisplaySize=t.InitDraggingAction=t.initEvent=t.createFrameBuffer=t.createTexture=t.rotation=t.translateToWebglColor=t.initBuffer=t.initShader=t.createProgram=void 0,t.createProgram=a,t.initShader=function(e,t,r,o){var i=n(e,e.VERTEX_SHADER,t),u=n(e,e.FRAGMENT_SHADER,r);return i&&u?a(e,i,u,o):null},t.initBuffer=function(e,t,r,n,a,o){var i=e.createBuffer();if(i){var u=!1===o?e.ARRAY_BUFFER:e.ELEMENT_ARRAY_BUFFER;if(e.bindBuffer(u,i),e.bufferData(u,r,e.STATIC_DRAW),!1===o&&null!==n&&null!==a){var l=e.getAttribLocation(t,n);if(l<0)return console.log("Failed to get the storage location of "+n),!1;e.vertexAttribPointer(l,a,e.FLOAT,!1,0,0),e.enableVertexAttribArray(l)}}},t.translateToWebglColor=function(e){var t=function(e){var t=e.toLowerCase();if(t&&/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(t)){if(4===t.length){for(var r="#",n=1;n<4;n+=1)r+=t.slice(n,n+1).concat(t.slice(n,n+1));t=r}var a=[];for(n=1;n<7;n+=2)a.push(parseInt("0x"+t.slice(n,n+2)));return a.concat(1)}return[255,255,255,255]}(e);return[t[0]/255,t[1]/255,t[2]/255,t[3]]};var o=Date.now();function i(e){var t=e.clientWidth,r=e.clientHeight,n=e.width!==t||e.height!==r;return n&&(e.width=t,e.height=r),n}t.rotation=function(e,t){return(e+t*(Date.now()-o)/1e3)%360},t.createTexture=function(e,t){return Promise.all(t.map((function(t){return function(e,t,r){return new Promise((function(n,a){var o=new Image;o.crossOrigin="anonymous",o.src=r,o.onload=function(){n(function(e,t,r,n){e.useProgram(t);var a=e.createTexture();e.activeTexture(n),e.bindTexture(e.TEXTURE_2D,a);var o=e.getUniformLocation(t,"u_Sampler");return e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),e.texImage2D(e.TEXTURE_2D,0,e.RGB,e.RGB,e.UNSIGNED_BYTE,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.generateMipmap(e.TEXTURE_2D),e.uniform1i(o,0),a}(e,t,o,e.TEXTURE0))}}))}(e,t.program,t.src)})))},t.createFrameBuffer=function(e,t,r){var n=e.createFramebuffer();if(!n)return console.error("frame buffer error"),null;var a=e.createTexture();if(!a)return console.error("texture created error"),null;e.bindTexture(e.TEXTURE_2D,a),e.texImage2D(e.TEXTURE_2D,0,e.RGB,t,r,0,e.RGB,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR);var o=e.createRenderbuffer();return e.bindRenderbuffer(e.RENDERBUFFER,o),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,t,r),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE?(console.error("something goes wrong"),null):(e.bindFramebuffer(e.FRAMEBUFFER,n),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,a,0),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,o),e.bindTexture(e.TEXTURE_2D,null),e.bindRenderbuffer(e.RENDERBUFFER,null),e.bindFramebuffer(e.FRAMEBUFFER,null),{fbo:n,texture:a})},t.initEvent=function(e,t){var r=!1,n=-1,a=-1;e.onmousedown=function(t){var o=t.clientX,i=t.clientY,u=e.getBoundingClientRect();u.left<=o&&o<u.right&&u.top<=i&&i<u.bottom&&(n=o,a=i,r=!0)},e.onmouseup=function(e){r=!1},e.onmousemove=function(o){var i=o.clientX,u=o.clientY;if(r){var l=100/e.height,c=l*(i-n),f=l*(u-a);t[0]=t[0]+f,t[1]=t[1]+c}n=i,a=u}},t.InitDraggingAction=function(e,t){var r=!1,n=-1,a=-1,o=0,i=0;e.onmousedown=function(t){var o=t.clientX,i=t.clientY,u=e.getBoundingClientRect();u.left<=o&&o<u.right&&u.top<=i&&i<u.bottom&&(n=o,a=i,r=!0)},e.onmouseup=function(e){r=!1},e.onmousemove=function(u){var l=u.clientX,c=u.clientY;if(r&&"function"==typeof t){var f=50/e.height;o+=f*(l-n),i+=f*(c-a),t(0,i%=360,o%=360)}n=l,a=c}},t.resizeCanvasToDisplaySize=i,t.preparation=function(e){e.enable(e.DEPTH_TEST),e.clearColor(.1,.1,.1,1)},t.clearCanvas=function(e){i(e.canvas),e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT)}},10:function(e,t,r){"use strict";e.exports=r(2)},2:function(e,t,r){"use strict";
/** @license React v0.20.2
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var n,a,o,i;if("object"==typeof performance&&"function"==typeof performance.now){var u=performance;t.unstable_now=function(){return u.now()}}else{var l=Date,c=l.now();t.unstable_now=function(){return l.now()-c}}if("undefined"==typeof window||"function"!=typeof MessageChannel){var f=null,s=null,d=function(){if(null!==f)try{var e=t.unstable_now();f(!0,e),f=null}catch(e){throw setTimeout(d,0),e}};n=function(e){null!==f?setTimeout(n,0,e):(f=e,setTimeout(d,0))},a=function(e,t){s=setTimeout(e,t)},o=function(){clearTimeout(s)},t.unstable_shouldYield=function(){return!1},i=t.unstable_forceFrameRate=function(){}}else{var b=window.setTimeout,p=window.clearTimeout;if("undefined"!=typeof console){var v=window.cancelAnimationFrame;"function"!=typeof window.requestAnimationFrame&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"),"function"!=typeof v&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills")}var m=!1,E=null,_=-1,T=5,h=0;t.unstable_shouldYield=function(){return t.unstable_now()>=h},i=function(){},t.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):T=0<e?Math.floor(1e3/e):5};var g=new MessageChannel,y=g.port2;g.port1.onmessage=function(){if(null!==E){var e=t.unstable_now();h=e+T;try{E(!0,e)?y.postMessage(null):(m=!1,E=null)}catch(e){throw y.postMessage(null),e}}else m=!1},n=function(e){E=e,m||(m=!0,y.postMessage(null))},a=function(e,r){_=b((function(){e(t.unstable_now())}),r)},o=function(){p(_),_=-1}}function R(e,t){var r=e.length;e.push(t);e:for(;;){var n=r-1>>>1,a=e[n];if(!(void 0!==a&&0<F(a,t)))break e;e[n]=t,e[r]=a,r=n}}function w(e){return void 0===(e=e[0])?null:e}function P(e){var t=e[0];if(void 0!==t){var r=e.pop();if(r!==t){e[0]=r;e:for(var n=0,a=e.length;n<a;){var o=2*(n+1)-1,i=e[o],u=o+1,l=e[u];if(void 0!==i&&0>F(i,r))void 0!==l&&0>F(l,i)?(e[n]=l,e[u]=r,n=u):(e[n]=i,e[o]=r,n=o);else{if(!(void 0!==l&&0>F(l,r)))break e;e[n]=l,e[u]=r,n=u}}}return t}return null}function F(e,t){var r=e.sortIndex-t.sortIndex;return 0!==r?r:e.id-t.id}var O=[],A=[],x=1,D=null,U=3,M=!1,j=!1,S=!1;function B(e){for(var t=w(A);null!==t;){if(null===t.callback)P(A);else{if(!(t.startTime<=e))break;P(A),t.sortIndex=t.expirationTime,R(O,t)}t=w(A)}}function I(e){if(S=!1,B(e),!j)if(null!==w(O))j=!0,n(C);else{var t=w(A);null!==t&&a(I,t.startTime-e)}}function C(e,r){j=!1,S&&(S=!1,o()),M=!0;var n=U;try{for(B(r),D=w(O);null!==D&&(!(D.expirationTime>r)||e&&!t.unstable_shouldYield());){var i=D.callback;if("function"==typeof i){D.callback=null,U=D.priorityLevel;var u=i(D.expirationTime<=r);r=t.unstable_now(),"function"==typeof u?D.callback=u:D===w(O)&&P(O),B(r)}else P(O);D=w(O)}if(null!==D)var l=!0;else{var c=w(A);null!==c&&a(I,c.startTime-r),l=!1}return l}finally{D=null,U=n,M=!1}}var k=i;t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(e){e.callback=null},t.unstable_continueExecution=function(){j||M||(j=!0,n(C))},t.unstable_getCurrentPriorityLevel=function(){return U},t.unstable_getFirstCallbackNode=function(){return w(O)},t.unstable_next=function(e){switch(U){case 1:case 2:case 3:var t=3;break;default:t=U}var r=U;U=t;try{return e()}finally{U=r}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=k,t.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var r=U;U=e;try{return t()}finally{U=r}},t.unstable_scheduleCallback=function(e,r,i){var u=t.unstable_now();switch("object"==typeof i&&null!==i?i="number"==typeof(i=i.delay)&&0<i?u+i:u:i=u,e){case 1:var l=-1;break;case 2:l=250;break;case 5:l=1073741823;break;case 4:l=1e4;break;default:l=5e3}return e={id:x++,callback:r,priorityLevel:e,startTime:i,expirationTime:l=i+l,sortIndex:-1},i>u?(e.sortIndex=i,R(A,e),null===w(O)&&e===w(A)&&(S?o():S=!0,a(I,i-u))):(e.sortIndex=l,R(O,e),j||M||(j=!0,n(C))),e},t.unstable_wrapCallback=function(e){var t=U;return function(){var r=U;U=t;try{return e.apply(this,arguments)}finally{U=r}}}},3:function(e,t,r){},6:function(e,t,r){"use strict";var n=this&&this.__createBinding||(Object.create?function(e,t,r,n){void 0===n&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]}),a=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)"default"!==r&&Object.prototype.hasOwnProperty.call(e,r)&&n(t,e,r);return a(t,e),t};Object.defineProperty(t,"__esModule",{value:!0});var i=o(r(1));r(7);t.default=function(e){var t=e.id,r=e.height,n=void 0===r?500:r,a=e.width,o=void 0===a?500:a,u=e.main,l=e.children;return i.useEffect((function(){u(t)}),[]),i.default.createElement("div",{className:"earth-container"},i.default.createElement("canvas",{id:t,height:n,width:o}),i.default.createElement("div",{className:"control-area"},l))}},62:function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var a=n(r(1)),o=n(r(9));r(3);var i=n(r(6)),u=r(63);o.default.render(a.default.createElement((function(e){return a.default.createElement("div",{className:"container"},a.default.createElement(i.default,{id:"solar-system",main:u.main}),a.default.createElement("p",null,"source code: ",a.default.createElement("a",null)),a.default.createElement("footer",{className:"footer-desc"},"Power up by Typescript, Webpack and Webgl2 "))}),null),document.getElementById("app"))},63:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.main=void 0;var n=r(0);t.main=function(e){var t=document.getElementById(e).getContext("webgl2");n.preparation(t),n.clearCanvas(t),console.log("solar-system")}},7:function(e,t,r){},8:function(e,t,r){"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/var n=Object.getOwnPropertySymbols,a=Object.prototype.hasOwnProperty,o=Object.prototype.propertyIsEnumerable;function i(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},r=0;r<10;r++)t["_"+String.fromCharCode(r)]=r;if("0123456789"!==Object.getOwnPropertyNames(t).map((function(e){return t[e]})).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach((function(e){n[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var r,u,l=i(e),c=1;c<arguments.length;c++){for(var f in r=Object(arguments[c]))a.call(r,f)&&(l[f]=r[f]);if(n){u=n(r);for(var s=0;s<u.length;s++)o.call(r,u[s])&&(l[u[s]]=r[u[s]])}}return l}}});