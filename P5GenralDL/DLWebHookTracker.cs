this.height=d}E.prototype.toString=function(){return"("+this.a+", "+this.b+" - "+this.width+"w x "+this.height+"h)"};E.prototype.ceil=function(){this.a=Math.ceil(this.a);this.b=Math.ceil(this.b);this.width=Math.ceil(this.width);this.height=Math.ceil(this.height);return this};E.prototype.floor=function(){this.a=Math.floor(this.a);this.b=Math.floor(this.b);this.width=Math.floor(this.width);this.height=Math.floor(this.height);return this};
E.prototype.round=function(){this.a=Math.round(this.a);this.b=Math.round(this.b);this.width=Math.round(this.width);this.height=Math.round(this.height);return this};function lb(a){return(a=a.exec(v))?a[1]:""}(function(){if(eb)return lb(/Firefox\/([0-9.]+)/);if(B||Ta||Sa)return Xa;if(ib)ret