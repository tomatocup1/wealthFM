import"./chunks/supabaseClient-CAAA46mf.js";import"./chunks/index-BQfYHZiF.js";var v={},C={exports:{}},r={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var y=Symbol.for("react.element"),U=Symbol.for("react.portal"),A=Symbol.for("react.fragment"),F=Symbol.for("react.strict_mode"),N=Symbol.for("react.profiler"),V=Symbol.for("react.provider"),q=Symbol.for("react.context"),M=Symbol.for("react.forward_ref"),B=Symbol.for("react.suspense"),z=Symbol.for("react.memo"),H=Symbol.for("react.lazy"),$=Symbol.iterator;function W(e){return e===null||typeof e!="object"?null:(e=$&&e[$]||e["@@iterator"],typeof e=="function"?e:null)}var O={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},j=Object.assign,x={};function p(e,t,u){this.props=e,this.context=t,this.refs=x,this.updater=u||O}p.prototype.isReactComponent={};p.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};p.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function P(){}P.prototype=p.prototype;function S(e,t,u){this.props=e,this.context=t,this.refs=x,this.updater=u||O}var E=S.prototype=new P;E.constructor=S;j(E,p.prototype);E.isPureReactComponent=!0;var w=Array.isArray,g=Object.prototype.hasOwnProperty,k={current:null},I={key:!0,ref:!0,__self:!0,__source:!0};function T(e,t,u){var n,o={},f=null,i=null;if(t!=null)for(n in t.ref!==void 0&&(i=t.ref),t.key!==void 0&&(f=""+t.key),t)g.call(t,n)&&!I.hasOwnProperty(n)&&(o[n]=t[n]);var s=arguments.length-2;if(s===1)o.children=u;else if(1<s){for(var c=Array(s),a=0;a<s;a++)c[a]=arguments[a+2];o.children=c}if(e&&e.defaultProps)for(n in s=e.defaultProps,s)o[n]===void 0&&(o[n]=s[n]);return{$$typeof:y,type:e,key:f,ref:i,props:o,_owner:k.current}}function J(e,t){return{$$typeof:y,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function R(e){return typeof e=="object"&&e!==null&&e.$$typeof===y}function Y(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(u){return t[u]})}var b=/\/+/g;function h(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Y(""+e.key):t.toString(36)}function _(e,t,u,n,o){var f=typeof e;(f==="undefined"||f==="boolean")&&(e=null);var i=!1;if(e===null)i=!0;else switch(f){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case y:case U:i=!0}}if(i)return i=e,o=o(i),e=n===""?"."+h(i,0):n,w(o)?(u="",e!=null&&(u=e.replace(b,"$&/")+"/"),_(o,t,u,"",function(a){return a})):o!=null&&(R(o)&&(o=J(o,u+(!o.key||i&&i.key===o.key?"":(""+o.key).replace(b,"$&/")+"/")+e)),t.push(o)),1;if(i=0,n=n===""?".":n+":",w(e))for(var s=0;s<e.length;s++){f=e[s];var c=n+h(f,s);i+=_(f,t,u,c,o)}else if(c=W(e),typeof c=="function")for(e=c.call(e),s=0;!(f=e.next()).done;)f=f.value,c=n+h(f,s++),i+=_(f,t,u,c,o);else if(f==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return i}function d(e,t,u){if(e==null)return e;var n=[],o=0;return _(e,n,"","",function(f){return t.call(u,f,o++)}),n}function G(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(u){(e._status===0||e._status===-1)&&(e._status=1,e._result=u)},function(u){(e._status===0||e._status===-1)&&(e._status=2,e._result=u)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var l={current:null},m={transition:null},K={ReactCurrentDispatcher:l,ReactCurrentBatchConfig:m,ReactCurrentOwner:k};function D(){throw Error("act(...) is not supported in production builds of React.")}r.Children={map:d,forEach:function(e,t,u){d(e,function(){t.apply(this,arguments)},u)},count:function(e){var t=0;return d(e,function(){t++}),t},toArray:function(e){return d(e,function(t){return t})||[]},only:function(e){if(!R(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};r.Component=p;r.Fragment=A;r.Profiler=N;r.PureComponent=S;r.StrictMode=F;r.Suspense=B;r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=K;r.act=D;r.cloneElement=function(e,t,u){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var n=j({},e.props),o=e.key,f=e.ref,i=e._owner;if(t!=null){if(t.ref!==void 0&&(f=t.ref,i=k.current),t.key!==void 0&&(o=""+t.key),e.type&&e.type.defaultProps)var s=e.type.defaultProps;for(c in t)g.call(t,c)&&!I.hasOwnProperty(c)&&(n[c]=t[c]===void 0&&s!==void 0?s[c]:t[c])}var c=arguments.length-2;if(c===1)n.children=u;else if(1<c){s=Array(c);for(var a=0;a<c;a++)s[a]=arguments[a+2];n.children=s}return{$$typeof:y,type:e.type,key:o,ref:f,props:n,_owner:i}};r.createContext=function(e){return e={$$typeof:q,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:V,_context:e},e.Consumer=e};r.createElement=T;r.createFactory=function(e){var t=T.bind(null,e);return t.type=e,t};r.createRef=function(){return{current:null}};r.forwardRef=function(e){return{$$typeof:M,render:e}};r.isValidElement=R;r.lazy=function(e){return{$$typeof:H,_payload:{_status:-1,_result:e},_init:G}};r.memo=function(e,t){return{$$typeof:z,type:e,compare:t===void 0?null:t}};r.startTransition=function(e){var t=m.transition;m.transition={};try{e()}finally{m.transition=t}};r.unstable_act=D;r.useCallback=function(e,t){return l.current.useCallback(e,t)};r.useContext=function(e){return l.current.useContext(e)};r.useDebugValue=function(){};r.useDeferredValue=function(e){return l.current.useDeferredValue(e)};r.useEffect=function(e,t){return l.current.useEffect(e,t)};r.useId=function(){return l.current.useId()};r.useImperativeHandle=function(e,t,u){return l.current.useImperativeHandle(e,t,u)};r.useInsertionEffect=function(e,t){return l.current.useInsertionEffect(e,t)};r.useLayoutEffect=function(e,t){return l.current.useLayoutEffect(e,t)};r.useMemo=function(e,t){return l.current.useMemo(e,t)};r.useReducer=function(e,t,u){return l.current.useReducer(e,t,u)};r.useRef=function(e){return l.current.useRef(e)};r.useState=function(e){return l.current.useState(e)};r.useSyncExternalStore=function(e,t,u){return l.current.useSyncExternalStore(e,t,u)};r.useTransition=function(){return l.current.useTransition()};r.version="18.3.1";C.exports=r;var Q=C.exports;/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var X=Q,Z=Symbol.for("react.element"),ee=Symbol.for("react.fragment"),te=Object.prototype.hasOwnProperty,re=X.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,ne={key:!0,ref:!0,__self:!0,__source:!0};function L(e,t,u){var n,o={},f=null,i=null;u!==void 0&&(f=""+u),t.key!==void 0&&(f=""+t.key),t.ref!==void 0&&(i=t.ref);for(n in t)te.call(t,n)&&!ne.hasOwnProperty(n)&&(o[n]=t[n]);if(e&&e.defaultProps)for(n in t=e.defaultProps,t)o[n]===void 0&&(o[n]=t[n]);return{$$typeof:Z,type:e,key:f,ref:i,props:o,_owner:re.current}}v.Fragment=ee;v.jsx=L;v.jsxs=L;
