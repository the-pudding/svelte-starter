import"../chunks/disclose-version.Bg9kRutz.js";import{b as ut,ad as ft,c as _t,aw as H,i as gt,h as B,d as X,a as lt,f as St,w as Dt,o as ct,s as vt,y as Ct,aE as ht,ac as kt,ab as Et,a5 as f,ay as u,az as d,a4 as k,a6 as M,G as l,X as P,x as W,u as at,z as Y,E as st,aD as Q,aF as It,aG as At}from"../chunks/runtime.Dtv5Q2M4.js";import{a as wt,b as i,t as D,d as I,e as Mt}from"../chunks/template.Cr5k1p6c.js";import{s as nt,p as N,a as xt}from"../chunks/props.i5HDODFL.js";import{s as A}from"../chunks/render.DxwwMOwz.js";import{a as dt,c as mt,e as O,i as j,s as Tt,b as Rt,d as Lt}from"../chunks/attributes.DX3ZY9Xv.js";import{c as ot,b as qt,i as U}from"../chunks/this.BruNCOZW.js";import{c as Bt}from"../chunks/copy.DpoC0QzE.js";import{h as pt}from"../chunks/html.CeouB82Y.js";import{f as Nt}from"../chunks/utils.DNs8SwWK.js";function bt(e,t,...a){var n=e,o=H,r;ut(()=>{o!==(o=t())&&(r&&(gt(r),r=null),r=_t(()=>o(n,...a)))},ft),B&&(n=X)}function rt(e,t,a,n,o,r){let m=B;B&&lt();var s,v,c=null;B&&X.nodeType===1&&(c=X,lt());var g=B?X:e,p,b=mt;ut(()=>{const _=t()||null;var h=_==="svg"?ht:null;if(_!==s){var E=mt;dt(b),p&&(_===null?kt(p,()=>{p=null,v=null}):_===v?Et(p):gt(p)),_&&_!==v&&(p=_t(()=>{if(c=B?c:h?document.createElementNS(h,_):document.createElement(_),wt(c,c),n){var y=B?St(c):c.appendChild(Dt());B&&(y===null?ct(!1):vt(y)),n(c,y)}Ct.nodes_end=c,g.before(c)})),s=_,s&&(v=s),dt(E)}},ft),m&&(ct(!0),vt(g))}function Pt(e,t,a){if(a){if(e.classList.contains(t))return;e.classList.add(t)}else{if(!e.classList.contains(t))return;e.classList.remove(t)}}var zt=D('<section id="demo-link"><h2>Link</h2> <p><a href="elements">Default element styles demo</a></p> <p><a href="fonts">Pudding-hosted font previews</a></p></section>');function Ft(e){var t=zt();i(e,t)}var Gt=D('<section id="demo-image"><h2>Image</h2> <p>img tag</p> <img src="../assets/demo/test.jpg" alt="cat" class="svelte-o47y6s"> <p>background image</p> <div class="svelte-o47y6s"></div></section>');function Ot(e){var t=Gt();i(e,t)}var jt=D('<section id="demo-element"><h2>Dynamic Svelte Element</h2> <!></section>');function Jt(e){const t=[{tag:"h3",text:"I am a h3 tag."},{tag:"p",text:"I am p tag."}];var a=jt(),n=f(u(a),2);O(n,17,()=>t,j,(o,r)=>{let m=()=>l(r).tag,s=()=>l(r).text;var v=I(),c=k(v);rt(c,m,!1,(g,p)=>{var b=Mt();M(()=>A(b,s())),i(p,b)}),i(o,v)}),d(a),i(e,a)}var Vt=D("<p> </p>");function $t(e,t){var a=Vt(),n=u(a);d(a),M(()=>A(n,`I am component A and my favorite number is ${t.number??""}.`)),i(e,a)}var Kt=D("<p> </p>");function Ut(e,t){var a=Kt(),n=u(a);d(a),M(()=>A(n,`I am component B and my name is ${t.name??""}.`)),i(e,a)}var Xt=D('<section id="demo-component"><h2>Dynamic Svelte Component</h2> <!></section>');function Ht(e){const t={A:$t,B:Ut},a=[{component:"A",number:42},{component:"B",name:"Russell"}];var n=Xt(),o=f(u(n),2);O(o,17,()=>a,j,(r,m)=>{var s=I();const v=P(()=>t[l(m).component]);var c=k(s);ot(c,()=>l(v),(g,p)=>{p(g,nt(()=>l(m)))}),i(r,s)}),d(n),i(e,n)}var Qt=D("<div><!></div>");function Wt(e,t){W(t,!0);let a=N(t,"root",3,null),n=N(t,"top",3,0),o=N(t,"bottom",3,0),r=N(t,"increments",3,100),m=N(t,"value",15,void 0),s=[],v=[],c=[],g=[],p;function b(){let x=0,C=0;for(let S=0;S<s.length;(S+=1)-1)s[S]>x&&(x=s[S],C=S);x>0?m(C):m(void 0)}function _(x,C){const S=w=>{w[0].isIntersecting;const G=w[0].intersectionRatio;s[C]=G,b()},R=n()?n()*-1:0,T=o()?o()*-1:0,z=`${R}px 0px ${T}px 0px`,F={root:a(),rootMargin:z,threshold:v};g[C]&&g[C].disconnect();const L=new IntersectionObserver(S,F);L.observe(x),g[C]=L}function h(){c.length&&c.forEach(_)}at(()=>{for(let x=0;x<r()+1;(x+=1)-1)v.push(x/r());c=p.querySelectorAll(":scope > *:not(iframe)"),h()}),at(()=>{n(),o(),h()});var E=Qt();qt(E,x=>p=x,()=>p);var y=u(E);bt(y,()=>t.children??H),d(E),i(e,E),Y()}var Yt=D('<div class="step svelte-12sq0x6"><p class="svelte-12sq0x6"> </p></div>'),Zt=D('<section id="scrolly"><h2 class="svelte-12sq0x6">Scrolly <span> </span></h2> <div class="spacer svelte-12sq0x6"></div> <!> <div class="spacer svelte-12sq0x6"></div></section>');function te(e){let t=Q(void 0);var a=Zt(),n=u(a),o=f(u(n)),r=u(o);d(o),d(n);var m=f(n,4);Wt(m,{get value(){return l(t)},set value(s){st(t,xt(s))},children:(s,v)=>{var c=I(),g=k(c);O(g,16,()=>[0,1,2,3,4],j,(p,b,_)=>{var h=Yt();const E=P(()=>l(t)===_);var y=u(h),x=u(y);d(y),d(h),M(()=>{Pt(h,"active",l(E)),A(x,b)}),i(p,h)}),i(s,c)},$$slots:{default:!0}}),It(2),d(a),M(()=>A(r,l(t)||"-")),i(e,a)}const ee=`{
	"meta": { "title": "Title TK", "description": "Description tk." },
	"body": [
		{
			"section": "intro",
			"content": [
				{ "type": "h4", "value": "An h4 element with no attributes" },
				{
					"type": "text",
					"value": "Some random text here, followed by an img tag."
				},
				{
					"type": "img",
					"value": { "src": "../assets/demo/test.jpg", "alt": "A cat" }
				},
				{
					"type": "Test",
					"value": { "label": "I’m a custom component!", "value": "50" }
				}
			]
		}
	]
}
`;var ae=D("<p><!></p>"),ne=D("<section><!></section>");function oe(e,t){W(t,!0);var a=I(),n=k(a);O(n,17,()=>t.body,j,(o,r)=>{let m=()=>l(r).section,s=()=>l(r).content;var v=ne();const c=P(()=>m().toLowerCase().replace(/[^a-z0-9]/g,"")),g=P(()=>t.components[m()]);var p=u(v);U(p,()=>l(g),b=>{var _=I(),h=k(_);ot(h,()=>l(g),(E,y)=>{y(E,nt(s))}),i(b,_)},b=>{var _=I(),h=k(_);O(h,17,s,j,(y,x)=>{let C=()=>l(x).type,S=()=>l(x).value;var R=I();const T=P(()=>t.components[C()]),z=P(()=>typeof S()=="string");var F=k(R);U(F,()=>l(T),L=>{var w=I(),G=k(w);ot(G,()=>l(T),(J,q)=>{q(J,nt(S))}),i(L,w)},L=>{var w=I(),G=k(w);U(G,()=>C()==="text",J=>{var q=ae(),Z=u(q);pt(Z,S),d(q),i(J,q)},J=>{var q=I(),Z=k(q);U(Z,()=>l(z),tt=>{var V=I(),et=k(V);rt(et,C,!1,(K,it)=>{var $=I(),yt=k($);pt(yt,S),i(it,$)}),i(tt,V)},tt=>{var V=I(),et=k(V);rt(et,C,!1,(K,it)=>{let $;M(()=>$=Rt(K,$,{...S()},void 0,K.namespaceURI!==ht,K.nodeName.includes("-")))}),i(tt,V)},!0),i(J,q)},!0),i(L,w)}),i(y,R)}),i(b,_)}),d(v),M(()=>Tt(v,"id",l(c))),i(o,v)}),i(e,a),Y()}var re=D('<p> </p> <progress max="100"></progress>',1);function se(e,t){let a=N(t,"label",3,"A"),n=N(t,"value",3,0);var o=re(),r=k(o),m=u(r);d(r);var s=f(r,2);M(()=>{A(m,a()),Lt(s,n())}),i(e,o)}var ie=D('<section id="cms"><h2>MicroCMS</h2> <code><pre> </pre></code> <!></section>');function le(e,t){W(t,!0);const{body:a}=Bt,n={Test:se};var o=ie(),r=f(u(o),2),m=u(r),s=u(m);M(()=>A(s,ee.replace(/\t/g," "))),d(m),d(r);var v=f(r,2);oe(v,{components:n,body:a}),d(o),i(e,o),Y()}var ce=D('<div class="person svelte-1ltx6da"><p class="svelte-1ltx6da"> </p> <p class="svelte-1ltx6da"> </p></div>'),ve=(e,t)=>At(t),de=(e,t)=>t.random(Math.floor(Math.random()*10)),me=D('<h2>Svelte5</h2> <h3>Reactive variables 3 ways:</h3> <button class="svelte-1ltx6da">count++</button> <p class="svelte-1ltx6da"> </p> <p class="svelte-1ltx6da"> </p> <p class="svelte-1ltx6da"> </p> <h3>Children (previously slots):</h3> <div class="children"><!></div> <h3>Dispatch Event</h3> <button class="svelte-1ltx6da">Random</button>  <h3>Snippets</h3> <div class="people svelte-1ltx6da"></div>',1);function pe(e,t){W(t,!0);const a=(R,T=H)=>{var z=ce(),F=u(z),L=u(F);d(F);var w=f(F,2),G=u(w);d(w),d(z),M(()=>{A(L,T().name),A(G,T().age)}),i(R,z)};N(t,"age",3,30);const n=[{name:"John",age:30},{name:"Jill",age:45}];let o=Q(0),r=P(()=>l(o)*2),m=P(()=>l(o)*2),s=Q(0);at(()=>{st(s,l(o)*2)});var v=me(),c=f(k(v),4);c.__click=[ve,o];var g=f(c,2),p=u(g);d(g);var b=f(g,2),_=u(b);d(b);var h=f(b,2),E=u(h);d(h);var y=f(h,4),x=u(y);bt(x,()=>t.children??H),d(y);var C=f(y,4);C.__click=[de,t];var S=f(C,4);O(S,21,()=>n,j,(R,T)=>{a(R,()=>l(T))}),d(S),M(()=>{A(p,`${l(o)??""} doubled is ${l(r)??""} (derived)`),A(_,`${l(o)??""} doubled is ${l(m)??""} (derived by)`),A(E,`${l(o)??""} doubled is ${l(s)??""} ($effect)`)}),i(e,v),Y()}Nt(["click"]);var ue=D('<div id="demo" class="svelte-m1ilu3"><h1>Demo</h1> <!> <!> <!> <!> <!> <!> <!></div>');function fe(e){let t=Q(0);function a(p){console.log(p)}var n=ue(),o=f(u(n),2);pe(o,{get value(){return l(t)},set value(p){st(t,xt(p))},random:a});var r=f(o,2);Ft(r);var m=f(r,2);Ot(m);var s=f(m,2);Jt(s);var v=f(s,2);Ht(v);var c=f(v,2);le(c,{});var g=f(c,2);te(g),d(n),i(e,n)}function Ee(e){fe(e)}export{Ee as component};