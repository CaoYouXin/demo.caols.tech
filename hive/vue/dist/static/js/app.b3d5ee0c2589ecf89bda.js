webpackJsonp([2,0],[function(t,e,a){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var n=a(2),i=r(n),c=a(48),s=r(c),o=a(37),d=r(o),l=a(18),u=r(l),p=a(38),f=r(p),h=a(40),v=r(h),m=a(41),g=r(m),x=a(39),y=r(x);i.default.use(s.default);var w=function(t){return t(f.default)},b=function(t){return t(v.default)},_=function(t){return t(g.default)},k=function(t){return t(y.default)},M=[{path:"",redirectTo:"/dashboard",pathMatch:"full"},{path:"/dashboard",component:w,data:{name:"Dashboard"}},{path:"/users",component:b,data:{name:"用户量"}},{path:"/users-reverse",component:_,data:{name:"用户量（反）"}},{path:"/order",component:k,data:{name:"订单量"}}],A=new s.default({routes:M});new i.default({router:A,data:{routes:M.slice(1)},template:'<App :routes="routes"/>',components:{App:d.default,Route:u.default,Dashboard:f.default}}).$mount("#app")},,,,,,,,,,,,,,,,,function(t,e,a){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function n(t){function e(t){for(t.firstElementChild&&e(t.firstElementChild),a.forEach(function(e){return t.setAttribute(e,"")});t.nextElementSibling;)e(t.nextElementSibling),t=t.nextElementSibling}var a=(0,c.default)(t.attributes,function(t){return t.name}).filter(function(t){return!t.indexOf("data-v")});e(t)}Object.defineProperty(e,"__esModule",{value:!0});var i=a(81),c=r(i);e.default=n;var s=a(2),o=r(s);o.default.directive("d3chart",{bind:function(t,e,a){t.innerHTML="",a.context.createChart(t)},inserted:function(t,e,a){var r=setInterval(function(t){t.innerHTML&&(n(t),a.context.startTransition(t),clearInterval(r),console.log("chart init end"))},1e3,t)}})},function(t,e,a){var r,n;a(34),r=a(78);var i=a(45);n=r=r||{},"object"!=typeof r.default&&"function"!=typeof r.default||(n=r=r.default),"function"==typeof n&&(n=n.options),n.render=i.render,n.staticRenderFns=i.staticRenderFns,n._scopeId="data-v-515edf50",t.exports=r},,,,,,,,,,,,,function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e,a){var r,n;a(35),r=a(75);var i=a(46);n=r=r||{},"object"!=typeof r.default&&"function"!=typeof r.default||(n=r=r.default),"function"==typeof n&&(n=n.options),n.render=i.render,n.staticRenderFns=i.staticRenderFns,n._scopeId="data-v-790fb75e",t.exports=r},function(t,e,a){var r,n;a(31),r=a(76);var i=a(42);n=r=r||{},"object"!=typeof r.default&&"function"!=typeof r.default||(n=r=r.default),"function"==typeof n&&(n=n.options),n.render=i.render,n.staticRenderFns=i.staticRenderFns,n._scopeId="data-v-1eee2aca",t.exports=r},function(t,e,a){var r,n;a(36),r=a(77);var i=a(47);n=r=r||{},"object"!=typeof r.default&&"function"!=typeof r.default||(n=r=r.default),"function"==typeof n&&(n=n.options),n.render=i.render,n.staticRenderFns=i.staticRenderFns,n._scopeId="data-v-9beedb8e",t.exports=r},function(t,e,a){var r,n;a(32),r=a(79);var i=a(43);n=r=r||{},"object"!=typeof r.default&&"function"!=typeof r.default||(n=r=r.default),"function"==typeof n&&(n=n.options),n.render=i.render,n.staticRenderFns=i.staticRenderFns,n._scopeId="data-v-24f3294c",t.exports=r},function(t,e,a){var r,n;a(33),r=a(80);var i=a(44);n=r=r||{},"object"!=typeof r.default&&"function"!=typeof r.default||(n=r=r.default),"function"==typeof n&&(n=n.options),n.render=i.render,n.staticRenderFns=i.staticRenderFns,n._scopeId="data-v-369bb558",t.exports=r},function(t,e){t.exports={render:function(){var t=this,e=(t.$createElement,t._c);return e("div",{staticClass:"welcome"},[t._v("Welcome")])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=(t.$createElement,t._c);return e("div",{directives:[{name:"d3chart",rawName:"v-d3chart"}],staticClass:"chart"})},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=(t.$createElement,t._c);return e("div",{directives:[{name:"d3chart",rawName:"v-d3chart"}],staticClass:"chart"})},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=(t.$createElement,t._c);return e("router-link",{staticClass:"nav",attrs:{to:t.r.path}},[t._v("\n  "+t._s(t.r.data.name)),e("br"),t._v(" "),e("div",{staticClass:"container",class:{show:t.isShow},on:{click:function(e){t.awesome(e)}}},[e("div",{staticClass:"radius",class:{animated:t.isAnimated},style:{width:t.width+"px",height:t.height+"px",left:t.left+"px",top:t.top+"px"}})])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=(t.$createElement,t._c);return e("div",[e("h1",[t._v("Hive")]),t._v(" "),e("nav",t._l(t.routes,function(a){return e("Route",{attrs:{r:a,isSelected:a===t.selected},on:{routeclick:function(e){t.clicked(t.$data,a)}}})})),t._v(" "),e("div",{staticClass:"view"},[e("router-view")])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=(t.$createElement,t._c);return e("div",{directives:[{name:"d3chart",rawName:"v-d3chart"}],staticClass:"chart",on:{dblclick:function(e){t.toggleTweenOverlapAndStacked()}}})},staticRenderFns:[]}},,,,,,,,,,,,,,,,,,,,,,,,,,,,function(t,e,a){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var n=a(18),i=r(n);e.default={name:"App",props:["routes"],data:function(){return{selected:null}},methods:{clicked:function(t,e){t.selected=e}},components:{Route:i.default}}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"dashboard",data:function(){return{}},render:function(t){return t(void 0)}}},function(t,e,a){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e.default=t,e}Object.defineProperty(e,"__esModule",{value:!0});var i=a(16),c=n(i),s=a(2),o=(r(s),a(17)),d=r(o);e.default={name:"order-chart",data:function(){return{htmlValue:null,path:"",data:null,x0:null,x1:null,y1:null,y2:null,y1Axis:null,y2Axis:null,height:null,toggle:!1,canClick:!1}},methods:{createChart:function(t){var e=this,a=c.timeParse("%Y-%m"),r=c.timeFormat("%Y-%m");c.csv("static/data/order-chart-data.csv",function(n,i){var s=c.keys(i[0]).filter(function(t){return"Date"!==t});i.forEach(function(t){var e=0,n=0;t.Date=r(a(t.Date)),t.columnDetails=[].map.call(s,function(a){var r=+t[a];return e=n,n+=r,{name:a,yBegin:e,yEnd:n,value:r}}),t.total=c.max(t.columnDetails,function(t){return t.yEnd}),t.vMax=c.max(t.columnDetails,function(t){return t.value})}),e.data=i,e.makeChart(s,i),t.innerHTML=e.htmlValue})},makeChart:function(t,e){var a={top:20,right:20,bottom:30,left:40},r=960-a.left-a.right,n=500-a.top-a.bottom,i=c.scaleBand().domain([].map.call(e,function(t){return t.Date})).rangeRound([0,r]).padding(.1),s=c.scaleBand().domain(t).rangeRound([0,i.bandwidth()]),o=c.scaleLinear().range([n,0]).domain([0,c.max(e,function(t){return t.total})]),d=c.scaleLinear().range([n,0]).domain([0,c.max(e,function(t){return t.vMax})]),l=c.axisBottom(i),u=c.axisLeft(o).ticks(10,c.format("6.1s")),p=c.axisLeft(d).ticks(10,c.format("6.1s")),f=c.scaleOrdinal().domain(t).range(["#98abc5","#8a89a6","#7b6888","#6b486b"]),h=document.createElement("div"),v=c.select(h).append("svg").attr("width",r+a.left+a.right).attr("height",n+a.top+a.bottom).append("g").attr("transform","translate("+a.left+","+a.top+")");v.append("g").attr("class","x axis").attr("transform","translate(0,"+n+")").call(l),v.append("g").attr("class","y axis").call(u).append("text").attr("transform","rotate(-90)").attr("y",6).attr("dy",".7em").style("text-anchor","end").text("population (k)");var m=(v.append("g").attr("class","bars").selectAll(".dg").data(e).enter().append("g").attr("class","dg").attr("transform",function(t){return"translate("+i(t.Date)+",0)"}).selectAll("rect").data(function(t){return t.columnDetails}).enter().append("rect").attr("width",i.bandwidth()).attr("x",0).attr("y",function(t){return o(t.yBegin)}).attr("height",0).attr("opacity",0).style("fill",function(t){return f(t.name)}),v.selectAll(".legend").data(t.slice().reverse()).enter().append("g").attr("class","legend").attr("transform",function(t,e){return"translate(0,"+20*e+")"}));m.append("rect").attr("x",r-18).attr("width",18).attr("height",18).style("fill",function(t){return f(t)}),m.append("text").attr("x",r-24).attr("y",9).attr("dy",".35em").style("text-anchor","end").text(function(t){return t}),this.x0=i,this.x1=s,this.y1=o,this.y2=d,this.y1Axis=u,this.y2Axis=p,this.height=n,this.htmlValue=h.innerHTML},startTransition:function(t){var e=c.select(t),a=this.y1,r=0;this.data.forEach(function(t,n){var i=e.selectAll("svg > g > g.bars > g:nth-child("+(n+1)+") > rect");i.each(function(e,r,n){var i=t.columnDetails[r],s=c.select(n[r]);+s.attr("y"),s.attr("height");s.transition().duration(500).delay(100*(5*r-r*r/2)).attr("y",a(i.yEnd)).attr("height",a(i.yBegin)-a(i.yEnd)).attr("opacity",1)}),r=100*(5*i.length-i.length*i.length/2)});var n=this;setTimeout(function(){return n.canClick=!0},r)},toggleTweenOverlapAndStacked:function(){if(this.canClick){this.toggle=!this.toggle;var t=this.x0,e=this.x1,a=this.y1,r=this.y2,n=this.y1Axis,i=this.y2Axis,s=this.height;this.toggle?(this.changeYAxis(i),this.data.forEach(function(t,a){c.selectAll("svg > g > g.bars > g:nth-child("+(a+1)+") > rect").each(function(a,n,i){var o=t.columnDetails[n];c.select(i[n]).transition().duration(500).delay(100*(5*n-n*n/2)).attr("x",e(o.name)).attr("y",r(o.value)).attr("width",e.bandwidth()).attr("height",s-r(o.value))})})):(this.changeYAxis(n),this.data.forEach(function(e,r){c.selectAll("svg > g > g.bars > g:nth-child("+(r+1)+") > rect").each(function(r,n,i){var s=e.columnDetails[n];c.select(i[n]).transition().duration(500).delay(100*(5*n-n*n/2)).attr("x",0).attr("y",a(s.yEnd)).attr("width",t.bandwidth()).attr("height",a(s.yBegin)-a(s.yEnd))})}))}},changeYAxis:function(t){var e=c.select("svg > g > g.y.axis");t(e.transition()),setTimeout(function(){return(0,d.default)(e.node())},3e3)}}}},function(t,e,a){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var n=a(2),i=r(n);e.default={name:"Route",props:["r","isSelected"],data:function(){return{isShow:!1,isAnimated:!1,width:!1,height:!1,left:!1,top:!1}},watch:{isSelected:function(t,e){t||(this.isShow=this.isAnimated=t)}},methods:{awesome:function(t){this.$emit("routeclick");var e=t.offsetX*t.offsetX,a=(t.target.offsetHeight-t.offsetY)*(t.target.offsetHeight-t.offsetY),r=(t.target.offsetWidth-t.offsetX)*(t.target.offsetWidth-t.offsetX),n=t.offsetY*t.offsetY,c=Math.sqrt(Math.max(e+n,e+a,r+n,r+a));this.isShow=!0,this.width=this.height=2*c,this.left=t.offsetX-c,this.top=t.offsetY-c;var s=this;i.default.nextTick(function(t){s.isAnimated=!0})}}}},function(t,e,a){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e.default=t,e}Object.defineProperty(e,"__esModule",{value:!0});var i=a(16),c=n(i),s=a(2),o=(r(s),a(17));r(o);e.default={name:"user-chart-reverse",data:function(){return{htmlValue:null,path:""}},methods:{createChart:function(t){var e=this,a=c.timeParse("%Y-%m-%d");c.json("static/data/user-chart-data.json",function(r,n){if(r)return void console.error(r);var i=[].map.call(n,function(t){return{date:a(t.date),pct05:t.pct05/1e3,pct25:t.pct25/1e3,pct50:t.pct50/1e3,pct75:t.pct75/1e3,pct95:t.pct95/1e3}});c.json("static/data/user-chart-markers.json",function(r,n){if(r)return void console.error(r);var c=[].map.call(n,function(t){return{date:a(t.date),type:t.type,version:t.version}});e.makeChart(i,c),t.innerHTML=e.htmlValue})})},startTransition:function(t){var e=c.select(t).select("svg"),a=e.attr("data-rel-chart-width"),r=e.attr("data-rel-chart-height"),n=e.selectAll("g.marker");n.each(function(t,e,a){setTimeout(function(){var t=c.select(a[e]),n=t.attr("data-rel-x"),i=+t.attr("data-rel-y");t.transition().duration(1e3).attr("transform","translate("+n+","+i+")").attr("opacity",1);var s=t.select("path"),o=+s.attr("data-rel");s.transition().duration(1e3).attr("d","M"+o+","+(r-i)+"L"+o+","+2*o)},1e3+500*e)}),e.select("#rect-clip > rect").transition().duration(1e3*n.size()).attr("width",a)},addAxesAndLegend:function(t,e,a,r,n,i){var c=200,s=100;t.append("clipPath").attr("id","axes-clip").append("polygon").attr("points",-r.left+","+-r.top+" "+(n-c-1)+","+-r.top+" "+(n-c-1)+","+s+" "+(n+r.right)+","+s+" "+(n+r.right)+","+(i+r.bottom)+" "+-r.left+","+(i+r.bottom));var o=t.append("g").attr("clip-path","url("+this.path+"#axes-clip)");o.append("g").attr("class","x axis").attr("transform","translate(0,"+i+")").call(e),o.append("g").attr("class","y axis").call(a).append("text").attr("transform","rotate(-90)").attr("y",6).attr("dy",".71em").style("text-anchor","end").text("Population (k)");var d=t.append("g").attr("class","legend").attr("transform","translate("+(n-c)+",0)");d.append("rect").attr("class","legend-bg").attr("width",c).attr("height",s),d.append("rect").attr("class","outer").attr("width",75).attr("height",20).attr("x",10).attr("y",10),d.append("text").attr("x",115).attr("y",25).text("5% - 95%"),d.append("rect").attr("class","inner").attr("width",75).attr("height",20).attr("x",10).attr("y",40),d.append("text").attr("x",115).attr("y",55).text("25% - 75%"),d.append("path").attr("class","median-line").attr("d","M10,80L85,80"),d.append("text").attr("x",115).attr("y",85).text("Median")},drawPaths:function(t,e,a,r){var n=c.area().curve(c.curveBasis).x(function(t){return a(t.date)||1}).y0(function(t){return r(t.pct95)}).y1(function(t){return r(t.pct75)}),i=c.area().curve(c.curveBasis).x(function(t){return a(t.date)||1}).y0(function(t){return r(t.pct75)}).y1(function(t){return r(t.pct50)}),s=c.line().curve(c.curveBasis).x(function(t){return a(t.date)}).y(function(t){return r(t.pct50)}),o=c.area().curve(c.curveBasis).x(function(t){return a(t.date)||1}).y0(function(t){return r(t.pct50)}).y1(function(t){return r(t.pct25)}),d=c.area().curve(c.curveBasis).x(function(t){return a(t.date)||1}).y0(function(t){return r(t.pct25)}).y1(function(t){return r(t.pct05)});t.datum(e),t.append("path").attr("class","area upper outer").attr("d",n).attr("clip-path","url("+this.path+"#rect-clip)"),t.append("path").attr("class","area lower outer").attr("d",d).attr("clip-path","url("+this.path+"#rect-clip)"),t.append("path").attr("class","area upper inner").attr("d",i).attr("clip-path","url("+this.path+"#rect-clip)"),t.append("path").attr("class","area lower inner").attr("d",o).attr("clip-path","url("+this.path+"#rect-clip)"),t.append("path").attr("class","median-line").attr("d",s).attr("clip-path","url("+this.path+"#rect-clip)")},drawMarkers:function(t,e,a,r){[].forEach.call(a,function(a){var n=32,i=r(a.date)-n-3,c=e-n-3,s=("Client"===a.type?80:160)+n-3,o=t.append("g").attr("data-rel-x",i).attr("data-rel-y",s).attr("class","marker "+a.type.toLowerCase()).attr("transform","translate("+i+","+c+")").attr("opacity",0);o.append("path").attr("data-rel",n).attr("d","M"+n+","+(e-c)+"L"+n+","+(e-c)),o.append("circle").attr("class","marker-bg").attr("cx",n).attr("cy",n).attr("r",n),o.append("text").attr("x",n).attr("y",.9*n).text(a.type),o.append("text").attr("x",n).attr("y",1.5*n).text(a.version)})},makeChart:function(t,e){var a=960,r=500,n={top:20,right:20,bottom:40,left:40},i=a-n.left-n.right,s=r-n.top-n.bottom,o=c.scaleTime().range([0,i]).domain(c.extent(t,function(t){return t.date})),d=c.scaleLinear().range([s,0]).domain([0,c.max(t,function(t){return t.pct95})]),l=c.axisBottom(o).tickSizeInner(-s).tickSizeOuter(0).tickPadding(10),u=c.axisLeft(d).tickSizeInner(-i).tickSizeOuter(0).tickPadding(10),p=document.createElement("div"),f=c.select(p).append("svg").attr("data-rel-chart-width",i).attr("data-rel-chart-height",s).attr("width",a).attr("height",r).append("g").attr("transform","translate("+n.left+","+n.top+")");f.append("clipPath").attr("id","rect-clip").append("rect").attr("width",0).attr("height",s);this.addAxesAndLegend(f,l,u,n,i,s),this.drawPaths(f,t,o,d),this.drawMarkers(f,s,e,o),this.htmlValue=p.innerHTML}}}},function(t,e,a){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e.default=t,e}Object.defineProperty(e,"__esModule",{value:!0});var i=a(16),c=n(i),s=a(2),o=(r(s),a(17));r(o);e.default={name:"user-chart-reverse",data:function(){return{htmlValue:null,path:"",appendD3Elem:null}},methods:{createChart:function(t){var e=this,a=c.timeParse("%Y-%m-%d");c.json("static/data/user-chart-data.json",function(r,n){if(r)return void console.error(r);var i=[].map.call(n,function(t){return{date:a(t.date),pct05:t.pct05/1e3,pct25:t.pct25/1e3,pct50:t.pct50/1e3,pct75:t.pct75/1e3,pct95:t.pct95/1e3}});c.json("static/data/user-chart-markers.json",function(r,n){if(r)return void console.error(r);var c=[].map.call(n,function(t){return{date:a(t.date),type:t.type,version:t.version}});e.makeChart(i,c),t.innerHTML=e.htmlValue})})},startTransition:function(t){var e=c.select(t).select("svg"),a=e.attr("data-rel-chart-width"),r=e.attr("data-rel-chart-height"),n=e.selectAll("g.marker");n.each(function(t,e,a){setTimeout(function(){var t=c.select(a[e]),n=t.attr("data-rel-x"),i=+t.attr("data-rel-y");t.transition().duration(1e3).attr("transform","translate("+n+","+i+")").attr("opacity",1);var s=t.select("path"),o=+s.attr("data-rel");s.transition().duration(1e3).attr("d","M"+o+","+(r-i)+"L"+o+","+2*o)},1e3+500*e)}),e.select("#rect-clip > rect").transition().duration(1e3*n.size()).attr("width",a)},addAxesAndLegend:function(t,e,a,r,n,i){var c=200,s=100;t.append("clipPath").attr("id","axes-clip").append("polygon").attr("points",-r.left+","+-r.top+" "+(n-c-1)+","+-r.top+" "+(n-c-1)+","+s+" "+(n+r.right)+","+s+" "+(n+r.right)+","+(i+r.bottom)+" "+-r.left+","+(i+r.bottom));var o=t.append("g").attr("clip-path","url("+this.path+"#axes-clip)");o.append("g").attr("class","x axis").attr("transform","translate(0,"+i+")").call(e),o.append("g").attr("class","y axis").call(a).append("text").attr("transform","rotate(-90)").attr("y",6).attr("dy",".71em").style("text-anchor","end").text("Population (k)");var d=t.append("g").attr("class","legend").attr("transform","translate("+(n-c)+",0)");d.append("rect").attr("class","legend-bg").attr("width",c).attr("height",s),d.append("rect").attr("class","outer").attr("width",75).attr("height",20).attr("x",10).attr("y",10),d.append("text").attr("x",115).attr("y",25).text("5% - 95%"),d.append("rect").attr("class","inner").attr("width",75).attr("height",20).attr("x",10).attr("y",40),d.append("text").attr("x",115).attr("y",55).text("25% - 75%"),d.append("path").attr("class","median-line").attr("d","M10,80L85,80"),d.append("text").attr("x",115).attr("y",85).text("Median")},drawPaths:function(t,e,a,r){var n=c.area().curve(c.curveBasis).x(function(t){return a(t.date)||1}).y0(function(t){return r(t.pct95)}).y1(function(t){return r(t.pct75)}),i=c.area().curve(c.curveBasis).x(function(t){return a(t.date)||1}).y0(function(t){return r(t.pct75)}).y1(function(t){return r(t.pct50)}),s=c.line().curve(c.curveBasis).x(function(t){return a(t.date)}).y(function(t){return r(t.pct50)}),o=c.area().curve(c.curveBasis).x(function(t){return a(t.date)||1}).y0(function(t){return r(t.pct50)}).y1(function(t){return r(t.pct25)}),d=c.area().curve(c.curveBasis).x(function(t){return a(t.date)||1}).y0(function(t){return r(t.pct25)}).y1(function(t){return r(t.pct05)});t.datum(e),t.append("path").attr("class","area upper outer").attr("d",n).attr("clip-path","url("+this.path+"#rect-clip)"),t.append("path").attr("class","area lower outer").attr("d",d).attr("clip-path","url("+this.path+"#rect-clip)"),t.append("path").attr("class","area upper inner").attr("d",i).attr("clip-path","url("+this.path+"#rect-clip)"),t.append("path").attr("class","area lower inner").attr("d",o).attr("clip-path","url("+this.path+"#rect-clip)"),t.append("path").attr("class","median-line").attr("d",s).attr("clip-path","url("+this.path+"#rect-clip)")},drawMarkers:function(t,e,a,r){[].forEach.call(a,function(a){var n=32,i=r(a.date)-n-3,c=e-n-3,s=("Client"===a.type?80:160)+n-3,o=t.append("g").attr("data-rel-x",i).attr("data-rel-y",s).attr("class","marker "+a.type.toLowerCase()).attr("transform","translate("+i+","+c+")").attr("opacity",0);o.append("path").attr("data-rel",n).attr("d","M"+n+","+(e-c)+"L"+n+","+(e-c)),o.append("circle").attr("class","marker-bg").attr("cx",n).attr("cy",n).attr("r",n),o.append("text").attr("x",n).attr("y",.9*n).text(a.type),o.append("text").attr("x",n).attr("y",1.5*n).text(a.version)})},makeChart:function(t,e){var a=960,r=500,n={top:20,right:20,bottom:40,left:40},i=a-n.left-n.right,s=r-n.top-n.bottom,o=c.scaleTime().range([0,i]).domain(c.extent(t,function(t){return t.date})),d=c.scaleLinear().range([s,0]).domain([0,c.max(t,function(t){return t.pct95})]),l=c.axisBottom(o).tickSizeInner(-s).tickSizeOuter(0).tickPadding(10),u=c.axisLeft(d).tickSizeInner(-i).tickSizeOuter(0).tickPadding(10),p=document.createElement("div"),f=c.select(p).append("svg").attr("data-rel-chart-width",i).attr("data-rel-chart-height",s).attr("width",a).attr("height",r).append("g").attr("transform","translate("+n.left+","+n.top+")");f.append("clipPath").attr("id","rect-clip").append("rect").attr("width",0).attr("height",s);this.addAxesAndLegend(f,l,u,n,i,s),this.drawPaths(f,t,o,d),this.drawMarkers(f,s,e,o),this.htmlValue=p.innerHTML}}}}]);
//# sourceMappingURL=app.b3d5ee0c2589ecf89bda.js.map