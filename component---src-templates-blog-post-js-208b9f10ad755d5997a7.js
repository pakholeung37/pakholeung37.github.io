(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{"3nLz":function(e,t,a){"use strict";a("t+fG")("fixed",(function(e){return function(){return e(this,"tt","","")}}))},"9eSz":function(e,t,a){"use strict";a("rzGZ"),a("Dq+y"),a("8npG"),a("YbXK"),a("eMsz"),a("zTTH"),a("3nLz");var r=a("TqRt");t.__esModule=!0,t.default=void 0;var i,n=r(a("PJYZ")),s=r(a("VbXa")),l=r(a("8OQS")),o=r(a("pVnL")),d=r(a("q1tI")),u=r(a("17x9")),c=function(e){var t=(0,o.default)({},e),a=t.resolutions,r=t.sizes,i=t.critical;return a&&(t.fixed=a,delete t.resolutions),r&&(t.fluid=r,delete t.sizes),i&&(t.loading="eager"),t.fluid&&(t.fluid=E([].concat(t.fluid))),t.fixed&&(t.fixed=E([].concat(t.fixed))),t},f=function(e){var t=e.media;return!!t&&(y&&!!window.matchMedia(t).matches)},p=function(e){var t=e.fluid,a=e.fixed;return g(t||a).src},g=function(e){if(y&&function(e){return!!e&&Array.isArray(e)&&e.some((function(e){return void 0!==e.media}))}(e)){var t=e.findIndex(f);if(-1!==t)return e[t];var a=e.findIndex((function(e){return void 0===e.media}));if(-1!==a)return e[a]}return e[0]},m=Object.create({}),h=function(e){var t=c(e),a=p(t);return m[a]||!1},b="undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype,y="undefined"!=typeof window,v=y&&window.IntersectionObserver,S=new WeakMap;function w(e){return e.map((function(e){var t=e.src,a=e.srcSet,r=e.srcSetWebp,i=e.media,n=e.sizes;return d.default.createElement(d.default.Fragment,{key:t},r&&d.default.createElement("source",{type:"image/webp",media:i,srcSet:r,sizes:n}),d.default.createElement("source",{media:i,srcSet:a,sizes:n}))}))}function E(e){var t=[],a=[];return e.forEach((function(e){return(e.media?t:a).push(e)})),[].concat(t,a)}function x(e){return e.map((function(e){var t=e.src,a=e.media,r=e.tracedSVG;return d.default.createElement("source",{key:t,media:a,srcSet:r})}))}function L(e){return e.map((function(e){var t=e.src,a=e.media,r=e.base64;return d.default.createElement("source",{key:t,media:a,srcSet:r})}))}function I(e,t){var a=e.srcSet,r=e.srcSetWebp,i=e.media,n=e.sizes;return"<source "+(t?"type='image/webp' ":"")+(i?'media="'+i+'" ':"")+'srcset="'+(t?r:a)+'" '+(n?'sizes="'+n+'" ':"")+"/>"}var z=function(e,t){var a=(void 0===i&&"undefined"!=typeof window&&window.IntersectionObserver&&(i=new window.IntersectionObserver((function(e){e.forEach((function(e){if(S.has(e.target)){var t=S.get(e.target);(e.isIntersecting||e.intersectionRatio>0)&&(i.unobserve(e.target),S.delete(e.target),t())}}))}),{rootMargin:"200px"})),i);return a&&(a.observe(e),S.set(e,t)),function(){a.unobserve(e),S.delete(e)}},O=function(e){var t=e.src?'src="'+e.src+'" ':'src="" ',a=e.sizes?'sizes="'+e.sizes+'" ':"",r=e.srcSet?'srcset="'+e.srcSet+'" ':"",i=e.title?'title="'+e.title+'" ':"",n=e.alt?'alt="'+e.alt+'" ':'alt="" ',s=e.width?'width="'+e.width+'" ':"",l=e.height?'height="'+e.height+'" ':"",o=e.crossOrigin?'crossorigin="'+e.crossOrigin+'" ':"",d=e.loading?'loading="'+e.loading+'" ':"",u=e.draggable?'draggable="'+e.draggable+'" ':"";return"<picture>"+e.imageVariants.map((function(e){return(e.srcSetWebp?I(e,!0):"")+I(e)})).join("")+"<img "+d+s+l+a+r+t+n+i+o+u+'style="position:absolute;top:0;left:0;opacity:1;width:100%;height:100%;object-fit:cover;object-position:center"/></picture>'},R=d.default.forwardRef((function(e,t){var a=e.src,r=e.imageVariants,i=e.generateSources,n=e.spreadProps,s=e.ariaHidden,l=d.default.createElement(A,(0,o.default)({ref:t,src:a},n,{ariaHidden:s}));return r.length>1?d.default.createElement("picture",null,i(r),l):l})),A=d.default.forwardRef((function(e,t){var a=e.sizes,r=e.srcSet,i=e.src,n=e.style,s=e.onLoad,u=e.onError,c=e.loading,f=e.draggable,p=e.ariaHidden,g=(0,l.default)(e,["sizes","srcSet","src","style","onLoad","onError","loading","draggable","ariaHidden"]);return d.default.createElement("img",(0,o.default)({"aria-hidden":p,sizes:a,srcSet:r,src:i},g,{onLoad:s,onError:u,ref:t,loading:c,draggable:f,style:(0,o.default)({position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"},n)}))}));A.propTypes={style:u.default.object,onError:u.default.func,onLoad:u.default.func};var k=function(e){function t(t){var a;(a=e.call(this,t)||this).seenBefore=y&&h(t),a.isCritical="eager"===t.loading||t.critical,a.addNoScript=!(a.isCritical&&!t.fadeIn),a.useIOSupport=!b&&v&&!a.isCritical&&!a.seenBefore;var r=a.isCritical||y&&(b||!a.useIOSupport);return a.state={isVisible:r,imgLoaded:!1,imgCached:!1,fadeIn:!a.seenBefore&&t.fadeIn},a.imageRef=d.default.createRef(),a.placeholderRef=t.placeholderRef||d.default.createRef(),a.handleImageLoaded=a.handleImageLoaded.bind((0,n.default)(a)),a.handleRef=a.handleRef.bind((0,n.default)(a)),a}(0,s.default)(t,e);var a=t.prototype;return a.componentDidMount=function(){if(this.state.isVisible&&"function"==typeof this.props.onStartLoad&&this.props.onStartLoad({wasCached:h(this.props)}),this.isCritical){var e=this.imageRef.current;e&&e.complete&&this.handleImageLoaded()}},a.componentWillUnmount=function(){this.cleanUpListeners&&this.cleanUpListeners()},a.handleRef=function(e){var t=this;this.useIOSupport&&e&&(this.cleanUpListeners=z(e,(function(){var e=h(t.props);t.state.isVisible||"function"!=typeof t.props.onStartLoad||t.props.onStartLoad({wasCached:e}),t.setState({isVisible:!0},(function(){t.setState({imgLoaded:e,imgCached:!(!t.imageRef.current||!t.imageRef.current.currentSrc)})}))})))},a.handleImageLoaded=function(){var e,t,a;e=this.props,t=c(e),a=p(t),m[a]=!0,this.setState({imgLoaded:!0}),this.props.onLoad&&this.props.onLoad()},a.render=function(){var e=c(this.props),t=e.title,a=e.alt,r=e.className,i=e.style,n=void 0===i?{}:i,s=e.imgStyle,l=void 0===s?{}:s,u=e.placeholderStyle,f=void 0===u?{}:u,p=e.placeholderClassName,m=e.fluid,h=e.fixed,b=e.backgroundColor,y=e.durationFadeIn,v=e.Tag,S=e.itemProp,E=e.loading,I=e.draggable,z=!1===this.state.fadeIn||this.state.imgLoaded,k=!0===this.state.fadeIn&&!this.state.imgCached,N=(0,o.default)({opacity:z?1:0,transition:k?"opacity "+y+"ms":"none"},l),W="boolean"==typeof b?"lightgray":b,V={transitionDelay:y+"ms"},C=(0,o.default)((0,o.default)((0,o.default)({opacity:this.state.imgLoaded?0:1},k&&V),l),f),B={title:t,alt:this.state.isVisible?"":a,style:C,className:p,itemProp:S};if(m){var M=m,T=g(m);return d.default.createElement(v,{className:(r||"")+" gatsby-image-wrapper",style:(0,o.default)({position:"relative",overflow:"hidden",maxWidth:T.maxWidth?T.maxWidth+"px":null,maxHeight:T.maxHeight?T.maxHeight+"px":null},n),ref:this.handleRef,key:"fluid-"+JSON.stringify(T.srcSet)},d.default.createElement(v,{"aria-hidden":!0,style:{width:"100%",paddingBottom:100/T.aspectRatio+"%"}}),W&&d.default.createElement(v,{"aria-hidden":!0,title:t,style:(0,o.default)({backgroundColor:W,position:"absolute",top:0,bottom:0,opacity:this.state.imgLoaded?0:1,right:0,left:0},k&&V)}),T.base64&&d.default.createElement(R,{ariaHidden:!0,ref:this.placeholderRef,src:T.base64,spreadProps:B,imageVariants:M,generateSources:L}),T.tracedSVG&&d.default.createElement(R,{ariaHidden:!0,ref:this.placeholderRef,src:T.tracedSVG,spreadProps:B,imageVariants:M,generateSources:x}),this.state.isVisible&&d.default.createElement("picture",null,w(M),d.default.createElement(A,{alt:a,title:t,sizes:T.sizes,src:T.src,crossOrigin:this.props.crossOrigin,srcSet:T.srcSet,style:N,ref:this.imageRef,onLoad:this.handleImageLoaded,onError:this.props.onError,itemProp:S,loading:E,draggable:I})),this.addNoScript&&d.default.createElement("noscript",{dangerouslySetInnerHTML:{__html:O((0,o.default)((0,o.default)({alt:a,title:t,loading:E},T),{},{imageVariants:M}))}}))}if(h){var J=h,j=g(h),G=(0,o.default)({position:"relative",overflow:"hidden",display:"inline-block",width:j.width,height:j.height},n);return"inherit"===n.display&&delete G.display,d.default.createElement(v,{className:(r||"")+" gatsby-image-wrapper",style:G,ref:this.handleRef,key:"fixed-"+JSON.stringify(j.srcSet)},W&&d.default.createElement(v,{"aria-hidden":!0,title:t,style:(0,o.default)({backgroundColor:W,width:j.width,opacity:this.state.imgLoaded?0:1,height:j.height},k&&V)}),j.base64&&d.default.createElement(R,{ariaHidden:!0,ref:this.placeholderRef,src:j.base64,spreadProps:B,imageVariants:J,generateSources:L}),j.tracedSVG&&d.default.createElement(R,{ariaHidden:!0,ref:this.placeholderRef,src:j.tracedSVG,spreadProps:B,imageVariants:J,generateSources:x}),this.state.isVisible&&d.default.createElement("picture",null,w(J),d.default.createElement(A,{alt:a,title:t,width:j.width,height:j.height,sizes:j.sizes,src:j.src,crossOrigin:this.props.crossOrigin,srcSet:j.srcSet,style:N,ref:this.imageRef,onLoad:this.handleImageLoaded,onError:this.props.onError,itemProp:S,loading:E,draggable:I})),this.addNoScript&&d.default.createElement("noscript",{dangerouslySetInnerHTML:{__html:O((0,o.default)((0,o.default)({alt:a,title:t,loading:E},j),{},{imageVariants:J}))}}))}return null},t}(d.default.Component);k.defaultProps={fadeIn:!0,durationFadeIn:500,alt:"",Tag:"div",loading:"lazy"};var N=u.default.shape({width:u.default.number.isRequired,height:u.default.number.isRequired,src:u.default.string.isRequired,srcSet:u.default.string.isRequired,base64:u.default.string,tracedSVG:u.default.string,srcWebp:u.default.string,srcSetWebp:u.default.string,media:u.default.string}),W=u.default.shape({aspectRatio:u.default.number.isRequired,src:u.default.string.isRequired,srcSet:u.default.string.isRequired,sizes:u.default.string.isRequired,base64:u.default.string,tracedSVG:u.default.string,srcWebp:u.default.string,srcSetWebp:u.default.string,media:u.default.string,maxWidth:u.default.number,maxHeight:u.default.number});k.propTypes={resolutions:N,sizes:W,fixed:u.default.oneOfType([N,u.default.arrayOf(N)]),fluid:u.default.oneOfType([W,u.default.arrayOf(W)]),fadeIn:u.default.bool,durationFadeIn:u.default.number,title:u.default.string,alt:u.default.string,className:u.default.oneOfType([u.default.string,u.default.object]),critical:u.default.bool,crossOrigin:u.default.oneOfType([u.default.string,u.default.bool]),style:u.default.object,imgStyle:u.default.object,placeholderStyle:u.default.object,placeholderClassName:u.default.string,backgroundColor:u.default.oneOfType([u.default.string,u.default.bool]),onLoad:u.default.func,onError:u.default.func,onStartLoad:u.default.func,Tag:u.default.string,itemProp:u.default.string,loading:u.default.oneOf(["auto","lazy","eager"]),draggable:u.default.bool};var V=k;t.default=V},H5Hb:function(e){e.exports=JSON.parse('{"data":{"avatar":{"childImageSharp":{"fixed":{"base64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAElklEQVQ4y02UyW9TVxSHDYSimiS23/N7tuMptuMJj5lJjJ3BTkKMg50BMhWCABXaRFSQMKRqN1SVummXhVXVVXeV2KMuKrHpolJFCwToLNR/4+u5LxR18dM99713v/s75577bKbXj9vw4nk9GiKH6Jini687Orlhs7F74ICl6xL/WSnzeTpDcWyU77/b4NcXp9h7OmeNjx5dwmaYPtxv5MXnC9Au8QkBfnP0KJsC+VABDx7kssQ/pJN8m8pz826Lv39v8PinKV7sneb5swa/vWxg0w0PhsdnuVNAQ+SSZ2lx/JU4vP0a+JFIwZ+PDHMvmeXTL5fYe1wV4AwvnyvgHM+eClCBFFTBlEvlOBgI0yHzd3Q3Nw8f5rq4e19gn2kar6ZqDJt+trbnxeECe0+mefakIarz1x9NbKakpit3/wMrqNcfxC/gpri81NbGe4cO8aPPx/lwhDbNYGiwlwcP1vnl5zMW6J9XZ3j48N19h4bZJcB9d8ql7vagNjJELnnXsrfzhdSzGQhxRB2g9Y2Pvv5ern2wyP37K9z95CyV8bIC+iyY+sDhdMsoG3j8lkyBGd4AXpFf5ofaXdIFamN5J3NNfWsG8HXF5PuwZUyAql2UQz+FwoC0T5BOh4GmywYuD06niVPzkkznmGs0CQSj6Po+dF//ZddlcWxqB03vIhyOs7W1xdWrmxzLFCkWBxgcPE4+38/wcImlpSV2d3eZmJyhvcMtgKC1zvCEJJOg5dTt9iuH8kLz092dZGFhgbW1NSYnJxkfH6NarTIyMkK5XGZ2dpadnR2qtboADTySot8fkxIFpAzBfZkhAbpDWDJCTE3NSNoFcTZoOVIqlUrE43HS6TRXrlwllSpKGbrEVZiZmZMyL+B0SepG2JIAVdAtdQmTy/XJAXhJJBKsra+zsrpKKBQiFouRzWap1Wr4Q1k5PMnKFSSZzNDbOywbBC2GYgkwgpJpxsgX+qReQ1KnCcZkrE/XrLher1M+UZI26We1lickB6fLmnwuL9CilKxbgFGLYzPcMdx6FNOIE4smpX5VFs+uUE70UMoXWFpeYWV5maHjo4TjOa7MFVgccBCM5SgUh/B64gKKojiGjDZdU0EPht4jvZWgKJd/ulbl5OwMjUqWUzKebraYLaWY6IsSDwZo9R6hNaAT9sVwuWKYsl4ZUhxbwJ9Bd6kHCem/BIPxEBcXxzm3OMV23WRjYZyLqw1uN4NsVp0s9rZxpv8t7s4dJR8RZ2ZGzMRxOZWxBLZ4IiWp9uLWEuhakoA3xbW5GDdbEXbmE+y0omw3oxLHuTTpYXnQzsaonQsTUnsBRSI90qvDJBODFsPmcOnSEjl8nhwe4xgBf56NaoJb81GuN3u4cTrCtlIzxoWKxmK/ncsVO+uVJPYO+bFoDulJk0wmSyFXwubUTLrkzxLtzollH6FImrMTGT5eCnOr1c2d+Qh3FmLclvj8aLs4fJvNyQ5mB8IC1GSNLnV04XA4SCRT2Fy6Vy65/GRNj1wlE7vc42IywLmJECuVEKuVIGtjQZbLAaZznYyn7Jw7oZGJGnQ6Nelf/Y0U9F+Tr3q6RMxC5QAAAABJRU5ErkJggg==","width":50,"height":50,"src":"/static/8be793a4ddced23854655bf7e7a617d0/8ba1e/profile-pic.png","srcSet":"/static/8be793a4ddced23854655bf7e7a617d0/8ba1e/profile-pic.png 1x,\\n/static/8be793a4ddced23854655bf7e7a617d0/f937a/profile-pic.png 1.5x,\\n/static/8be793a4ddced23854655bf7e7a617d0/71eb7/profile-pic.png 2x"}}},"site":{"siteMetadata":{"author":{"name":"梁伯豪","summary":""}}}}}')},SGlo:function(e,t,a){"use strict";var r=a("rj/q"),i=a("N+BI").getWeak,n=a("1a8y"),s=a("BjK0"),l=a("xa9o"),o=a("yde8"),d=a("Wadk"),u=a("qDzq"),c=a("O1i0"),f=d(5),p=d(6),g=0,m=function(e){return e._l||(e._l=new h)},h=function(){this.a=[]},b=function(e,t){return f(e.a,(function(e){return e[0]===t}))};h.prototype={get:function(e){var t=b(this,e);if(t)return t[1]},has:function(e){return!!b(this,e)},set:function(e,t){var a=b(this,e);a?a[1]=t:this.a.push([e,t])},delete:function(e){var t=p(this.a,(function(t){return t[0]===e}));return~t&&this.a.splice(t,1),!!~t}},e.exports={getConstructor:function(e,t,a,n){var d=e((function(e,r){l(e,d,t,"_i"),e._t=t,e._i=g++,e._l=void 0,null!=r&&o(r,a,e[n],e)}));return r(d.prototype,{delete:function(e){if(!s(e))return!1;var a=i(e);return!0===a?m(c(this,t)).delete(e):a&&u(a,this._i)&&delete a[this._i]},has:function(e){if(!s(e))return!1;var a=i(e);return!0===a?m(c(this,t)).has(e):a&&u(a,this._i)}}),d},def:function(e,t,a){var r=i(n(t),!0);return!0===r?m(e).set(t,a):r[e._i]=a,e},ufstore:m}},eMsz:function(e,t,a){"use strict";var r,i=a("emib"),n=a("Wadk")(0),s=a("IYdN"),l=a("N+BI"),o=a("k5Iv"),d=a("SGlo"),u=a("BjK0"),c=a("O1i0"),f=a("O1i0"),p=!i.ActiveXObject&&"ActiveXObject"in i,g=l.getWeak,m=Object.isExtensible,h=d.ufstore,b=function(e){return function(){return e(this,arguments.length>0?arguments[0]:void 0)}},y={get:function(e){if(u(e)){var t=g(e);return!0===t?h(c(this,"WeakMap")).get(e):t?t[this._i]:void 0}},set:function(e,t){return d.def(c(this,"WeakMap"),e,t)}},v=e.exports=a("94Pd")("WeakMap",b,y,d,!0,!0);f&&p&&(o((r=d.getConstructor(b,"WeakMap")).prototype,y),l.NEED=!0,n(["delete","has","get","set"],(function(e){var t=v.prototype,a=t[e];s(t,e,(function(t,i){if(u(t)&&!m(t)){this._f||(this._f=new r);var n=this._f[e](t,i);return"set"==e?this:n}return a.call(this,t,i)}))})))},"t+fG":function(e,t,a){var r=a("P8UN"),i=a("96qb"),n=a("ap2Z"),s=/"/g,l=function(e,t,a,r){var i=String(n(e)),l="<"+t;return""!==a&&(l+=" "+a+'="'+String(r).replace(s,"&quot;")+'"'),l+">"+i+"</"+t+">"};e.exports=function(e,t){var a={};a[e]=t(l),r(r.P+r.F*i((function(){var t=""[e]('"');return t!==t.toLowerCase()||t.split('"').length>3})),"String",a)}},yZlL:function(e,t,a){"use strict";a.r(t),a.d(t,"pageQuery",(function(){return p}));a("E5k/");var r=a("q1tI"),i=a.n(r),n=a("Wbzz"),s=(a("pJf4"),a("3nLz"),a("H5Hb")),l=a("9eSz"),o=a.n(l),d=a("p3AD"),u=function(){var e=s.data,t=e.site.siteMetadata.author;return i.a.createElement("div",{style:{display:"flex",marginBottom:Object(d.a)(2.5)}},i.a.createElement(o.a,{fixed:e.avatar.childImageSharp.fixed,alt:t.name,style:{marginRight:Object(d.a)(.5),marginBottom:0,minWidth:50,borderRadius:"100%"},imgStyle:{borderRadius:"50%"}}),i.a.createElement("p",null,"Written by ",i.a.createElement("strong",null,t.name)," ",t.summary," "))},c=a("Bl7J"),f=a("vrFN"),p=(t.default=function(e){var t=e.data,a=e.pageContext,r=e.location,s=t.markdownRemark,l=a.previous,o=a.next;return i.a.createElement(c.a,{location:r,title:"Home"},i.a.createElement(f.a,{title:s.frontmatter.title,description:s.frontmatter.description||s.excerpt}),i.a.createElement("article",null,i.a.createElement("header",null,i.a.createElement("h1",{style:{marginBottom:0}},s.frontmatter.title),i.a.createElement("p",{style:Object.assign(Object.assign({},Object(d.b)(-.2)),{},{display:"block",marginBottom:Object(d.a)(1)})},s.frontmatter.date)),i.a.createElement("section",{dangerouslySetInnerHTML:{__html:s.html}}),i.a.createElement("hr",{style:{marginBottom:Object(d.a)(1)}}),i.a.createElement("footer",null,i.a.createElement(u,null))),i.a.createElement("nav",null,i.a.createElement("ul",{style:{display:"flex",flexWrap:"wrap",justifyContent:"space-between",listStyle:"none",padding:0}},i.a.createElement("li",null,l&&i.a.createElement(n.Link,{to:l.fields.slug,rel:"prev"},"← ",l.frontmatter.title)),i.a.createElement("li",null,o&&i.a.createElement(n.Link,{to:o.fields.slug,rel:"next"},o.frontmatter.title," →")))))},"2868899261")},zTTH:function(e,t,a){"use strict";var r=a("P8UN"),i=a("Wadk")(6),n="findIndex",s=!0;n in[]&&Array(1)[n]((function(){s=!1})),r(r.P+r.F*s,"Array",{findIndex:function(e){return i(this,e,arguments.length>1?arguments[1]:void 0)}}),a("Dq1/")(n)}}]);
//# sourceMappingURL=component---src-templates-blog-post-js-208b9f10ad755d5997a7.js.map