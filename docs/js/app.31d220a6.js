(function(e){function t(t){for(var o,i,s=t[0],l=t[1],c=t[2],u=0,h=[];u<s.length;u++)i=s[u],Object.prototype.hasOwnProperty.call(a,i)&&a[i]&&h.push(a[i][0]),a[i]=0;for(o in l)Object.prototype.hasOwnProperty.call(l,o)&&(e[o]=l[o]);d&&d(t);while(h.length)h.shift()();return r.push.apply(r,c||[]),n()}function n(){for(var e,t=0;t<r.length;t++){for(var n=r[t],o=!0,s=1;s<n.length;s++){var l=n[s];0!==a[l]&&(o=!1)}o&&(r.splice(t--,1),e=i(i.s=n[0]))}return e}var o={},a={app:0},r=[];function i(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=o,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=t,s=s.slice();for(var c=0;c<s.length;c++)t(s[c]);var d=l;r.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("cd49")},"33e4":function(e,t,n){"use strict";n("c89d")},"7f0d":function(e,t,n){},c89d:function(e,t,n){},cd49:function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var o=n("7a23");function a(e,t,n,a,r,i){var s=Object(o["o"])("HolidayPlanner");return Object(o["i"])(),Object(o["c"])(s,{resources:e.rows,infiniteScroll:!0,customDays:{"01022022":{class:"orange"}},onHeaderClick:e.onHeaderClick,onRowClick:e.onRowClick,onDayClick:e.onDayClick,onSelectionEnd:e.onSelectionEnd,class:"holiday-planner"},null,8,["resources","onHeaderClick","onRowClick","onDayClick","onSelectionEnd"])}var r=n("5530"),i=function(e){return Object(o["k"])("data-v-2a9875a8"),e=e(),Object(o["j"])(),e},s={class:"container"},l={class:"header"},c={key:0,class:"range"},d={class:"header"},u=i((function(){return Object(o["f"])("div",{class:"side-header side"},null,-1)})),h={class:"hp-header-scroller",ref:"scrollHeader"},f=["data-day-id"],b={class:"body"},y={class:"side-body side hp-bottom-scrollbar-visible"},p={class:"hp-side-scroller",ref:"scrollSide"},v=["src"],m={class:"card-content"},g={class:"title"},O={class:"subtitle"},j={ref:"rowContainer"},w=["data-row-id"],k=["data-day-id"],D={class:"day-content"};function C(e,t,n,a,r,i){return Object(o["i"])(),Object(o["e"])("div",s,[Object(o["f"])("div",l,[Object(o["n"])(e.$slots,"title",{from:e.from,to:e.to},(function(){return[null!=e.from&&null!=e.to?(Object(o["i"])(),Object(o["e"])("div",c,Object(o["p"])(e.dateFormat(e.from,"MMM YYYY"))+" ― "+Object(o["p"])(e.dateFormat(e.to,"MMM YYYY")),1)):Object(o["d"])("",!0)]}),!0)]),Object(o["f"])("div",d,[u,Object(o["f"])("div",{class:Object(o["h"])(["main-header",{"hp-right-scrollbar-visible":e.rightScrollbarVisible}]),onClick:t[0]||(t[0]=function(){return e.onHeaderClick&&e.onHeaderClick.apply(e,arguments)})},[Object(o["f"])("div",h,[(Object(o["i"])(!0),Object(o["e"])(o["a"],null,Object(o["m"])(e.days,(function(e,t){return Object(o["i"])(),Object(o["e"])("div",{class:Object(o["h"])(["header-day",e.headerClass]),key:t,"data-day-id":t},Object(o["p"])(e.title),11,f)})),128))],512)],2)]),Object(o["f"])("div",b,[Object(o["f"])("div",y,[Object(o["f"])("div",p,[(Object(o["i"])(!0),Object(o["e"])(o["a"],null,Object(o["m"])(e.resources,(function(t){return Object(o["i"])(),Object(o["e"])("div",{key:t.id,class:"row row-side card"},[Object(o["n"])(e.$slots,"row-header",{row:t},(function(){return[Object(o["f"])("img",{class:"avatar",src:t.img},null,8,v),Object(o["f"])("div",m,[Object(o["f"])("div",g,Object(o["p"])(t.title),1),Object(o["f"])("div",O,Object(o["p"])(t.subtitle),1)])]}),!0)])})),128))],512)]),Object(o["f"])("div",{class:"main-body",ref:"scrollBody",onClick:t[1]||(t[1]=function(){return e.onBodyClick&&e.onBodyClick.apply(e,arguments)}),onMousedown:t[2]||(t[2]=function(){return e.onBodyMousedown&&e.onBodyMousedown.apply(e,arguments)})},[Object(o["f"])("div",j,[(Object(o["i"])(!0),Object(o["e"])(o["a"],null,Object(o["m"])(e.resources,(function(t){return Object(o["i"])(),Object(o["e"])("div",{key:t.id,class:"row row-main","data-row-id":t.id},[(Object(o["i"])(!0),Object(o["e"])(o["a"],null,Object(o["m"])(e.days,(function(n,a){return Object(o["i"])(),Object(o["e"])("div",{key:a,class:Object(o["h"])(["day-main",[e._getDateClasses(t,n),{selected:e.selected[n.key]&&e.selectedRows[t.id]}]]),"data-day-id":a},[Object(o["f"])("div",D,Object(o["p"])(n.value),1)],10,k)})),128))],8,w)})),128))],512)],544)])])}var S,M=n("2909"),R=n("b85c"),T=(n("a15b"),n("5a0c")),L=n.n(T),H=n("4650"),x=n.n(H),F=n("2ef0");function B(){if(void 0===S){S=!1;try{"undefined"!==typeof window&&window.parent&&window.parent.document}catch(e){S=!0}}return S}function _(e,t,n){return e.addEventListener(t,n),function(){return e.removeEventListener(t,n)}}function P(e,t){e.appendChild(t)}function E(e){e.parentNode.removeChild(e)}function Y(e,t){var n=getComputedStyle(e),o=(parseInt(n.zIndex)||0)-1;"static"===n.position&&(e.style.position="relative");var a=document.createElement("iframe");a.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; "+"overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: ".concat(o,";")),a.setAttribute("aria-hidden","true"),a.tabIndex=-1;var r,i=B();return i?(a.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",r=_(window,"message",(function(e){e.source===a.contentWindow&&t()}))):(a.src="about:blank",a.onload=function(){r=_(a.contentWindow,"resize",t)}),P(e,a),function(){(i||r&&a.contentWindow)&&r(),E(a)}}L.a.extend(x.a);var I=40,A=70,W=200,V=400,$=5,z=Object(o["g"])({setup:function(){var e=Object(o["l"])(),t=Object(o["l"])(),n=Object(o["l"])(),a=Object(o["l"])();return{scrollBody:e,scrollHeader:t,rowContainer:n,scrollSide:a}},name:"HolidayPlanner",props:{resources:{type:Array,required:!0},startDate:{type:Object,default:function(){return L()().startOf("day")}},maxDate:{type:Object,default:function(){return L()().endOf("year")}},minDate:{type:Object,default:function(){return L()().startOf("year")}},infiniteScroll:{type:Boolean,default:!0},customDays:{type:Object,default:function(){return{}}},getClassFn:{type:Function,default:function(e){var t=e.day();if(6===t||0===t)return"weekend"}},getHeaderClassFn:{type:Function,default:function(e){return{today:e.isSame(L()(),"day"),"start-of-month":1===e.date()}}},getDayValueFn:{type:Function,default:function(e){return e.date()}},getDayHeaderFn:{type:Function,default:function(e){return e.format("dd")[0]}},selectionEnabled:{type:Boolean,default:!0}},created:function(){this.referenceDate=this.startDate,this.scrollableFrom=this.positionToDate(this.scrollableLeft),this.scrollableTo=this.positionToDate(this.scrollableRight)},mounted:function(){var e=this;this.createDays();var t=this.scrollBody,n=t.scrollLeft,o=t.clientWidth;this._updateRange(n,n+o),this.referenceScrollLeft=this.dateToPosition(this.referenceDate),this.scrollBody.addEventListener("scroll",this.onBodyScroll.bind(this)),Y(this.scrollBody,(function(){var t=e.scrollBody,n=t.clientWidth,o=t.clientHeight;e.visibleWidth=n,e.visibleHeight=o})),setTimeout((function(){e.centerOn(e.startDate,"auto")}))},methods:{onBodyScroll:function(e){var t=this,n=this.scrollBody,o=n.scrollLeft,a=n.scrollTop,r=n.clientWidth;requestAnimationFrame((function(){t.scrollHeader.scrollLeft=o,t.scrollSide.scrollTop=a})),this.checkScrollableThresholdHit(o,r),this.updateRange(o,o+r)},onHeaderClick:function(e){var t=e.target;if(null!=t.dataset.dayId){var n=this.days[+t.dataset.dayId];this.$emit("header-click",{event:e,date:n&&n.date}),this.centerOn(n.date)}},onBodyClick:function(e){var t=e.target,n=t.closest("[data-row-id]");n&&this.$emit("row-click",{event:e,row:this.resources[+n.dataset.rowId]});var o=t.closest("[data-day-id]");o&&this.$emit("day-click",{event:e,row:n&&this.resources[+n.dataset.rowId],date:o&&this.days[+o.dataset.dayId].date}),this.selecting||this.clearSelection()},onBodyMousedown:function(e){var t=this;if(this.selectionEnabled){var n=function(e){var n=t.rowContainer.getBoundingClientRect();return{x:e.clientX-n.left,y:e.clientY-n.top}},o=n(e),a=o.x,r=o.y,i=!1,s=function(e){var o=n(e),s=o.x,l=o.y;if(i){t.selecting=!0;var c,d=Math.min(a,s),u=Math.max(a,s),h=Math.min(r,l),f=Math.max(r,l),b={},y={},p=Object(R["a"])(t.days);try{for(p.s();!(c=p.n()).done;){var v=c.value;v.left+I>=d&&v.left<=u&&(b[v.key]=!0)}}catch(j){p.e(j)}finally{p.f()}var m,g=Object(R["a"])(t.rows);try{for(g.s();!(m=g.n()).done;){var O=m.value;O.top+A>=h&&O.top<=f&&(y[O.resource.id]=!0)}}catch(j){g.e(j)}finally{g.f()}t.selected=b,t.selectedRows=y}else{if(!(Math.abs(s-a)>$||Math.abs(l-r)>$))return;i=!0}},l=function e(o){setTimeout((function(){t.selecting=!1}));var i,l=n(o),c=l.x,d=l.y,u=Math.min(a,c),h=Math.max(a,c),f=Math.min(r,d),b=Math.max(r,d),y=[],p=[],v=Object(R["a"])(t.days);try{for(v.s();!(i=v.n()).done;){var m=i.value;m.left+I>=u&&m.left<=h&&y.push(m.date)}}catch(w){v.e(w)}finally{v.f()}var g,O=Object(R["a"])(t.rows);try{for(O.s();!(g=O.n()).done;){var j=g.value;j.top+A>=f&&j.top<=b&&p.push(j.resource)}}catch(w){O.e(w)}finally{O.f()}t.$emit("selection-end",{event:o,dates:y,resources:p}),document.body.removeEventListener("mousemove",s),document.body.removeEventListener("mouseup",e)};document.body.addEventListener("mousemove",s),document.body.addEventListener("mouseup",l)}},centerOn:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"smooth",n=this.scrollBody.clientWidth,o=this.dateToPosition(e);this.scrollBody.scrollTo({left:o+I/2-n/2,behavior:t})},positionToDate:function(e){var t=Math.floor(e/I);return this.referenceDate.add(t,"day")},dateToPosition:function(e){var t=e.diff(this.scrollableFrom,"day"),n=Object(F["clamp"])(t,0,this.days.length-1);return this.days[n].left},_checkScrollableThresholdHit:function(e,t){e-this.referenceScrollLeft<this.scrollableLeftThreshold&&this._expandScrollableRange(this.scrollableLeft-V,this.scrollableRight),e+t-this.referenceScrollLeft>this.scrollableRightThreshold&&this._expandScrollableRange(this.scrollableLeft,this.scrollableRight+V)},_expandScrollableRange:function(e,t){var n=this.scrollableLeft-e;this.scrollableLeft=e,this.scrollableRight=t,this.scrollableFrom=this.minDate&&!this.infiniteScroll?L.a.max(this.positionToDate(this.scrollableLeft),this.minDate):this.positionToDate(this.scrollableLeft),this.scrollableTo=this.maxDate&&!this.infiniteScroll?L.a.min(this.positionToDate(this.scrollableRight),this.maxDate):this.positionToDate(this.scrollableRight),this.scrollableLeftThreshold=this.scrollableLeft+W,this.scrollableRightThreshold=this.scrollableRight-W,this.scrollBody.scrollLeft+=n,this.scrollHeader.scrollLeft=this.scrollBody.scrollLeft,this.createDays(),this.referenceScrollLeft=this.dateToPosition(this.referenceDate)},clearSelection:function(){this.selected={},this.selectedRows={}},createDays:function(){var e=this.scrollableFrom;this.days=[];var t=0;while(e<this.scrollableTo){var n=this.getKey(e),o={title:this.getDayHeaderFn(e),value:this.getDayValueFn(e),key:n,date:e,headerClass:this.getHeaderClassFn(e),class:this._getDateClass(e),left:t};this.days.push(o),t+=I,e=e.add(1,"day")}},_getDateClass:function(e){var t=[],n=this.getKey(e),o=this.customDays[n];if(o&&t.push(o.class),this.getClassFn){var a=this.getClassFn(e);a&&(Array.isArray(a)?t.push.apply(t,Object(M["a"])(a)):t.push(a))}return t.join(" ")},_updateRange:function(e,t){var n=Math.floor(e/I),o=Math.floor(t/I)-1,a=this.days[n].date,r=this.days[o].date;this.from=a,this.to=r},getKey:function(e){return e.format("DDMMYYYY")},_getDateClasses:function(e,t){return(this.classes[e.id][t.key]||"")+(t.class?" "+t.class:"")}},computed:{dateFormat:function(){return function(e,t){return e.format(t)}},classes:function(){var e,t=this.resources,n={},o=Object(R["a"])(t);try{for(o.s();!(e=o.n()).done;){var a=e.value;if(n[a.id]={},a.days){var r,i=Object(R["a"])(a.days);try{for(i.s();!(r=i.n()).done;){var s=r.value,l=this.getKey(s.date);n[a.id][l]=s.class}}catch(c){i.e(c)}finally{i.f()}}}}catch(c){o.e(c)}finally{o.f()}return n},rows:function(){var e,t=this.resources,n=[],o=0,a=Object(R["a"])(t);try{for(a.s();!(e=a.n()).done;){var r=e.value;n.push({resource:r,top:o}),o+=A}}catch(i){a.e(i)}finally{a.f()}return n},rowContainerHeight:function(){return this.rows.length*A},rightScrollbarVisible:function(){return this.rowContainerHeight>this.visibleHeight}},data:function(){return{days:[],from:null,to:null,selected:{},selectedRows:{},today:L()(),referenceDate:null,referenceScrollLeft:0,scrollableFrom:null,scrollableTo:null,scrollableLeft:-1200,scrollableRight:1200,scrollableLeftThreshold:null,scrollableRightThreshold:null,checkScrollableThresholdHit:Object(F["debounce"])(this._checkScrollableThresholdHit.bind(this),250),updateRange:Object(F["throttle"])(this._updateRange.bind(this),250),selecting:!1,visibleWidth:0,visibleHeight:0}}}),K=(n("ebec"),n("6b0d")),q=n.n(K);const J=q()(z,[["render",C],["__scopeId","data-v-2a9875a8"]]);var N=J;function Q(){var e=L()().startOf("year");function t(){return e.add(Math.floor(365*Math.random()),"day")}for(var n=["orange","green","purple"],o=[{title:"Krystalle Logie",subtitle:"Senior Sales Associate",img:"assets/woman1.jpg"},{title:"Izabel Riveles",subtitle:"Senior Financial Analyst",img:"assets/woman2.jpg"},{title:"Rancell Qualtrough",subtitle:"Information Systems Manager",img:"assets/man2.jpg"},{title:"Pearle Vowels",subtitle:"Recruiter",img:"assets/man1.jpg"},{title:"Marysa Rable",subtitle:"VP Product Management",img:"assets/woman3.jpg"}],a=[],i=0;i<10;i++){for(var s=Object(r["a"])(Object(r["a"])({},o[i%o.length]),{},{id:i,days:[]}),l=[],c=0;c<24;c++)for(var d=Math.floor(5*Math.random()),u=n[c%3],h=t(),f=0;f<d;f++)l.push({date:h,class:u}),h=h.add(1,"day");s.days=l,a.push(s)}return a}var X=Object(o["g"])({name:"App",components:{HolidayPlanner:N},methods:{onHeaderClick:function(e){console.log("header click",e)},onRowClick:function(e){console.log("row click",e)},onDayClick:function(e){console.log("day click",e)},onSelectionEnd:function(e){console.log("selection end",e)}},data:function(){return{rows:Q()}}});n("33e4");const G=q()(X,[["render",a]]);var U=G;Object(o["b"])(U).mount("#app")},ebec:function(e,t,n){"use strict";n("7f0d")}});
//# sourceMappingURL=app.31d220a6.js.map