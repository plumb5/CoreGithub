function Q(a,b){b=b.toLowerCase();return"style"==b?ha(a.style.cssText):N&&"value"==b&&R(a,"INPUT")?a.value:fa&&!0===a[b]?String(a.getAttribute(b)):(a=a.getAttributeNode(b))&&a.specified?a.value:null}var ia=/[;]+(?=(?:(?:[^"]*"){2})*[^"]*$)(?=(?:(?:[^']*'){2})*[^']*$)(?=(?:[^()]*\([^()]*\))*[^()]*$)/;
function ha(a){var b=[];t(a.split(ia),function(a){var c=a.indexOf(":");0<c&&(a=[a.slice(0,c),a.slice(c+1)],2==a.length&&b.push(a[0].toLowerCase(),":",a[1],";"))});b=b.join("");return b=";"==b.charAt(b.length-1)?b:b+";"}function S(a,b){N&&"value"==b&&R(a,"OPTION")&&null===Q(a,"value")?(b=[],P(a,b,!1),a=b.join("")):a=a[b];return a}function R(a,b){b&&"string"!==typeof b&&(b=b.toString());return!!a&&1==a.nodeType&&(!b||a.tagName.toUpperCase()==b)}
function T(a){return R(a,"OPTION")?!0:R(a,"INPUT")?(a=a.type.toLowerCase(),"checkbox"==a||"radio"==a):!1};var ja={"class":"className",readonly:"readOnly"},U="allowfullscreen allowpaymentrequest allowusermedia async autofocus autoplay checked compact complete controls declare default defaultchecked defaultselected defer disabled ended formnovalidate hidden indeterminate iscontenteditable ismap itemscope loop multiple muted nohref nomodule noresize noshade novalidate nowrap open paused playsinline pubdate readonly required reversed scoped seamless seeking selected truespeed typemustmatch willvalidate".split(" ");function V(a,b){var e=null,c=b.toLowerCase();if("style"==c)return(e=a.style)&&!f(e)&&(e=e.cssText),e;if(("selected"==c||"checked"==c)&&T(a)){if(!T(a))throw new h(15,"Element is not selectable");b="selected";e=a.type&&a.type.toLowerCase();if("checkbox"==e||"radio"==e)b="checked";return S(a,b)?"true":null}var g=R(a,"A");if(R(a,"IMG")&&"src"==c||g&&"href"==c)return(e=Q(a,c))&&(e=S(a,c)),e;if("spellcheck"==c){e=Q(a,c);if(null!==e){if("false"==e.toLowerCase())return"false";if("true"==e.toLowerCase())return"true"}return S(a,
c)+""}g=ja[b]||b;a:if(f(U))c=f(c)&&1==c.length?U.indexOf(c,0):-1;else{for(var u=0;u<U.length;u++)if(u in U&&U[u]===c){c=u;break a}c=-1}if(0<=c)return(e=null!==Q(a,b)||S(a,g))?"true":null;try{var k=S(a,g)}catch(ka){}(c=null==k)||(c=typeof k,c="object"==c&&null!=k||"function"==c);c?e=Q(a,b):e=k;return null!=e?e.toString():null}var W=["_"],X=d;W[0]in X||!X.execScript||X.execScript("var "+W[0]);
for(var Y;W.length&&(Y=W.shift());){var Z;if(Z=!W.length)Z=void 0!==V;Z?X[Y]=V:X[Y]&&X[Y]!==Object.prototype[Y]?X=X[Y]:X=X[Y]={}};; return this._.apply(null,arguments);}.apply({navigator:typeof window!='undefined'?window.navigator:null,document:typeof window!='undefined'?window.document:null}, arguments);}
ث  function(){return function(){var k=this;function l(a){return void 0!==a}function m(a){return"string"==typeof a}function aa(a,b){a=a.split(".");var c=k;a[0]in c||!c.execScript||c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)!a.length&&l(b)?c[d]=b:c[d]&&c[d]!==Object.prototype[d]?c=c[d]:c=c[d]={}}
function ba(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined