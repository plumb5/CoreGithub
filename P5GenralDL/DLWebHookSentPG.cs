,thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};function ja(a,b){this.width=a;this.height=b}ja.prototype.toString=function(){return"("+this.width+" x "+this.height+")"};ja.prototype.ceil=function(){this.width=Math.ceil(this.width);this.height=Math.ceil(this.height);return this};ja.prototype.floor=function(){this.width=Math.floor(this.width);this.height=Math.floor(this.height);return this};ja.prototype.round=function(){this.width=Math.round(this.width);this.height=Math.round(this.height);return this};function ka(a,b){var c=la;return Object.prototype.hasOwnProperty.call(c,a)?c[a]:c[a]=b(a)};var ma=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};function na(a,b){return a<b?-1:a>b?1:0}function oa(a){return String(a).replace(/\-([a-z])/g,function(a,c){return c.toUpperCase()})};/*

 The MIT License

 Copyright (c) 2007 Cybozu Labs, Inc.
 Copyright (c) 2012 Google Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to
 deal in the Software without restriction, including without limitation the
 rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 IN THE SOFTWARE.
*/
function pa(a,b,c){this.a=a;this.b=b||1;this.f=c||1};function qa(a){this.b=a;this.a=0}function ra(a){a=a.match(sa);for(var b=0;b<a.length;b++)ta.test(a[b])&&a.splice(b,1);return new qa(a)}var sa=/\$?(?:(?![0-9-\.])(?:\*|[\w-\.]+):)?(?![0-9-\.])(?:\*|[\w-\.]+)|\/\/|\.\.|::|\d+(?:\.\d*)?|\.\d+|"[^"]*"|'[^']*'|[!<>]=|\s+|./g,ta=/^\s/;function t(a,b){return a.b[a.a+(b||0)]}function u(a){return a.b[a.a++]}function ua(a){return a.b.length<=a.a};var v;a:{var va=k.navigator;if(va){var wa=va.userAgent;if(wa){v=wa;break a}}v=""}function x(a){return-1!=v.indexOf(a)};function y(a,b){this.h=a;this.c=l(b)?b:null;this.b=null;switch(a){case "comment":this.b=8;break;case "text":this.b=3;break;case "processing-instruction":this.b=7;break;case "node":break;default:throw Error("Unexpected argument");}}function xa(a){return"comment"==a||"text"==a||"processing-instruction"==a||"node"==a}y.prototype.a=function(a){return null===this.b||this.b==a.nodeType};y.prototype.f=function(){return this.h};
y.prototype.toString=function(){var a="Kind Test: "+this.h;null===this.c||(a+=z(this.c));return a};function ya(a,b){this.j=a.toLowerCase();a="*"==this.j?"*":"http://www.w3.org/1999/xhtml";this.c=b?b.toLowerCase():a}ya.prototype.a=function(a){var b=a.nodeType;if(1!=b&&2!=b)return!1;b=l(a.localName)?a.localName:a.nodeName;return"*"!=this.j&&this.j!=b.toLowerCase()?!1:"*"==this.c?!0:this.c==(a.namespaceURI?a.namespaceURI.toLowerCase():"http://www.w3.org/1999/xhtml")};ya.prototype.f=function(){return this.j};
ya.prototype.toString=function(){return"Name Test: "+("http://www.w3.org/1999/xhtml"==this.c?"":this.c+":")+this.j};function 