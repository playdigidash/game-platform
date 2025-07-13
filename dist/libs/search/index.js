import { jsx, jsxs } from 'react/jsx-runtime';
import { Autocomplete, TextField, InputAdornment, useTheme as useTheme$2, useMediaQuery, Box as Box$2, AppBar, Tabs, Tab, Typography, Avatar, Divider, Accordion, AccordionSummary, Card, CardContent, AccordionDetails, Chip, Modal, Button } from '@mui/material';
import * as React from 'react';
import { useContext, createContext, forwardRef, createElement as createElement$1, Fragment, useState, useEffect } from 'react';
import { action, makeAutoObservable } from 'mobx';
import { getMaterialSearchOptions, getCustomerTypeImg, getCustomerItemImage, defaultModalStyle } from '@lidvizion/commonlib';
import { observer } from 'mobx-react';
import SearchIcon from '@mui/icons-material/Search';
import _ from 'lodash';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global$c =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || commonjsGlobal || Function('return this')();

var objectGetOwnPropertyDescriptor = {};

var fails$b = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

var fails$a = fails$b;

// Detect IE8's incomplete defineProperty implementation
var descriptors = !fails$a(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

var fails$9 = fails$b;

var functionBindNative = !fails$9(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});

var NATIVE_BIND$1 = functionBindNative;

var call$6 = Function.prototype.call;

var functionCall = NATIVE_BIND$1 ? call$6.bind(call$6) : function () {
  return call$6.apply(call$6, arguments);
};

var objectPropertyIsEnumerable = {};

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor$1(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

var createPropertyDescriptor$3 = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var NATIVE_BIND = functionBindNative;

var FunctionPrototype$1 = Function.prototype;
var call$5 = FunctionPrototype$1.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype$1.bind.bind(call$5, call$5);

var functionUncurryThis = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call$5.apply(fn, arguments);
  };
};

var uncurryThis$a = functionUncurryThis;

var toString$1 = uncurryThis$a({}.toString);
var stringSlice$1 = uncurryThis$a(''.slice);

var classofRaw = function (it) {
  return stringSlice$1(toString$1(it), 8, -1);
};

var uncurryThis$9 = functionUncurryThis;
var fails$8 = fails$b;
var classof = classofRaw;

var $Object$3 = Object;
var split = uncurryThis$9(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails$8(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object$3('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object$3(it);
} : $Object$3;

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
var isNullOrUndefined$2 = function (it) {
  return it === null || it === undefined;
};

var isNullOrUndefined$1 = isNullOrUndefined$2;

var $TypeError$6 = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible$2 = function (it) {
  if (isNullOrUndefined$1(it)) throw $TypeError$6("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings
var IndexedObject$1 = indexedObject;
var requireObjectCoercible$1 = requireObjectCoercible$2;

var toIndexedObject$5 = function (it) {
  return IndexedObject$1(requireObjectCoercible$1(it));
};

var documentAll$2 = typeof document == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
var IS_HTMLDDA = typeof documentAll$2 == 'undefined' && documentAll$2 !== undefined;

var documentAll_1 = {
  all: documentAll$2,
  IS_HTMLDDA: IS_HTMLDDA
};

var $documentAll$1 = documentAll_1;

var documentAll$1 = $documentAll$1.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
var isCallable$e = $documentAll$1.IS_HTMLDDA ? function (argument) {
  return typeof argument == 'function' || argument === documentAll$1;
} : function (argument) {
  return typeof argument == 'function';
};

var isCallable$d = isCallable$e;
var $documentAll = documentAll_1;

var documentAll = $documentAll.all;

var isObject$6 = $documentAll.IS_HTMLDDA ? function (it) {
  return typeof it == 'object' ? it !== null : isCallable$d(it) || it === documentAll;
} : function (it) {
  return typeof it == 'object' ? it !== null : isCallable$d(it);
};

var global$b = global$c;
var isCallable$c = isCallable$e;

var aFunction = function (argument) {
  return isCallable$c(argument) ? argument : undefined;
};

var getBuiltIn$3 = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global$b[namespace]) : global$b[namespace] && global$b[namespace][method];
};

var uncurryThis$8 = functionUncurryThis;

var objectIsPrototypeOf = uncurryThis$8({}.isPrototypeOf);

var engineUserAgent = typeof navigator != 'undefined' && String(navigator.userAgent) || '';

var global$a = global$c;
var userAgent = engineUserAgent;

var process$1 = global$a.process;
var Deno = global$a.Deno;
var versions = process$1 && process$1.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match$1, version;

if (v8) {
  match$1 = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match$1[0] > 0 && match$1[0] < 4 ? 1 : +(match$1[0] + match$1[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match$1 = userAgent.match(/Edge\/(\d+)/);
  if (!match$1 || match$1[1] >= 74) {
    match$1 = userAgent.match(/Chrome\/(\d+)/);
    if (match$1) version = +match$1[1];
  }
}

var engineV8Version = version;

/* eslint-disable es/no-symbol -- required for testing */

var V8_VERSION = engineV8Version;
var fails$7 = fails$b;
var global$9 = global$c;

var $String$4 = global$9.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails$7(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String$4(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

/* eslint-disable es/no-symbol -- required for testing */

var NATIVE_SYMBOL$1 = symbolConstructorDetection;

var useSymbolAsUid = NATIVE_SYMBOL$1
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

var getBuiltIn$2 = getBuiltIn$3;
var isCallable$b = isCallable$e;
var isPrototypeOf = objectIsPrototypeOf;
var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

var $Object$2 = Object;

var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn$2('Symbol');
  return isCallable$b($Symbol) && isPrototypeOf($Symbol.prototype, $Object$2(it));
};

var $String$3 = String;

var tryToString$1 = function (argument) {
  try {
    return $String$3(argument);
  } catch (error) {
    return 'Object';
  }
};

var isCallable$a = isCallable$e;
var tryToString = tryToString$1;

var $TypeError$5 = TypeError;

// `Assert: IsCallable(argument) is true`
var aCallable$2 = function (argument) {
  if (isCallable$a(argument)) return argument;
  throw $TypeError$5(tryToString(argument) + ' is not a function');
};

var aCallable$1 = aCallable$2;
var isNullOrUndefined = isNullOrUndefined$2;

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
var getMethod$1 = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable$1(func);
};

var call$4 = functionCall;
var isCallable$9 = isCallable$e;
var isObject$5 = isObject$6;

var $TypeError$4 = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
var ordinaryToPrimitive$1 = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable$9(fn = input.toString) && !isObject$5(val = call$4(fn, input))) return val;
  if (isCallable$9(fn = input.valueOf) && !isObject$5(val = call$4(fn, input))) return val;
  if (pref !== 'string' && isCallable$9(fn = input.toString) && !isObject$5(val = call$4(fn, input))) return val;
  throw $TypeError$4("Can't convert object to primitive value");
};

var shared$3 = {exports: {}};

var global$8 = global$c;

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty$5 = Object.defineProperty;

var defineGlobalProperty$3 = function (key, value) {
  try {
    defineProperty$5(global$8, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global$8[key] = value;
  } return value;
};

var global$7 = global$c;
var defineGlobalProperty$2 = defineGlobalProperty$3;

var SHARED = '__core-js_shared__';
var store$3 = global$7[SHARED] || defineGlobalProperty$2(SHARED, {});

var sharedStore = store$3;

var store$2 = sharedStore;

(shared$3.exports = function (key, value) {
  return store$2[key] || (store$2[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.31.1',
  mode: 'global',
  copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.31.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});

var requireObjectCoercible = requireObjectCoercible$2;

var $Object$1 = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
var toObject$4 = function (argument) {
  return $Object$1(requireObjectCoercible(argument));
};

var uncurryThis$7 = functionUncurryThis;
var toObject$3 = toObject$4;

var hasOwnProperty$2 = uncurryThis$7({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty$2(toObject$3(it), key);
};

var uncurryThis$6 = functionUncurryThis;

var id = 0;
var postfix = Math.random();
var toString = uncurryThis$6(1.0.toString);

var uid$2 = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};

var global$6 = global$c;
var shared$2 = shared$3.exports;
var hasOwn$8 = hasOwnProperty_1;
var uid$1 = uid$2;
var NATIVE_SYMBOL = symbolConstructorDetection;
var USE_SYMBOL_AS_UID = useSymbolAsUid;

var Symbol$1 = global$6.Symbol;
var WellKnownSymbolsStore = shared$2('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1['for'] || Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;

var wellKnownSymbol$6 = function (name) {
  if (!hasOwn$8(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn$8(Symbol$1, name)
      ? Symbol$1[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};

var call$3 = functionCall;
var isObject$4 = isObject$6;
var isSymbol$1 = isSymbol$2;
var getMethod = getMethod$1;
var ordinaryToPrimitive = ordinaryToPrimitive$1;
var wellKnownSymbol$5 = wellKnownSymbol$6;

var $TypeError$3 = TypeError;
var TO_PRIMITIVE = wellKnownSymbol$5('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
var toPrimitive$1 = function (input, pref) {
  if (!isObject$4(input) || isSymbol$1(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call$3(exoticToPrim, input, pref);
    if (!isObject$4(result) || isSymbol$1(result)) return result;
    throw $TypeError$3("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

var toPrimitive = toPrimitive$1;
var isSymbol = isSymbol$2;

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
var toPropertyKey$2 = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

var global$5 = global$c;
var isObject$3 = isObject$6;

var document$1 = global$5.document;
// typeof document.createElement is 'object' in old IE
var EXISTS$1 = isObject$3(document$1) && isObject$3(document$1.createElement);

var documentCreateElement$2 = function (it) {
  return EXISTS$1 ? document$1.createElement(it) : {};
};

var DESCRIPTORS$9 = descriptors;
var fails$6 = fails$b;
var createElement = documentCreateElement$2;

// Thanks to IE8 for its funny defineProperty
var ie8DomDefine = !DESCRIPTORS$9 && !fails$6(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

var DESCRIPTORS$8 = descriptors;
var call$2 = functionCall;
var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
var createPropertyDescriptor$2 = createPropertyDescriptor$3;
var toIndexedObject$4 = toIndexedObject$5;
var toPropertyKey$1 = toPropertyKey$2;
var hasOwn$7 = hasOwnProperty_1;
var IE8_DOM_DEFINE$1 = ie8DomDefine;

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
objectGetOwnPropertyDescriptor.f = DESCRIPTORS$8 ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject$4(O);
  P = toPropertyKey$1(P);
  if (IE8_DOM_DEFINE$1) try {
    return $getOwnPropertyDescriptor$1(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn$7(O, P)) return createPropertyDescriptor$2(!call$2(propertyIsEnumerableModule$1.f, O, P), O[P]);
};

var objectDefineProperty = {};

var DESCRIPTORS$7 = descriptors;
var fails$5 = fails$b;

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
var v8PrototypeDefineBug = DESCRIPTORS$7 && fails$5(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});

var isObject$2 = isObject$6;

var $String$2 = String;
var $TypeError$2 = TypeError;

// `Assert: Type(argument) is Object`
var anObject$5 = function (argument) {
  if (isObject$2(argument)) return argument;
  throw $TypeError$2($String$2(argument) + ' is not an object');
};

var DESCRIPTORS$6 = descriptors;
var IE8_DOM_DEFINE = ie8DomDefine;
var V8_PROTOTYPE_DEFINE_BUG$1 = v8PrototypeDefineBug;
var anObject$4 = anObject$5;
var toPropertyKey = toPropertyKey$2;

var $TypeError$1 = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE$1 = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
objectDefineProperty.f = DESCRIPTORS$6 ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty(O, P, Attributes) {
  anObject$4(O);
  P = toPropertyKey(P);
  anObject$4(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject$4(O);
  P = toPropertyKey(P);
  anObject$4(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError$1('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var DESCRIPTORS$5 = descriptors;
var definePropertyModule$3 = objectDefineProperty;
var createPropertyDescriptor$1 = createPropertyDescriptor$3;

var createNonEnumerableProperty$4 = DESCRIPTORS$5 ? function (object, key, value) {
  return definePropertyModule$3.f(object, key, createPropertyDescriptor$1(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var makeBuiltIn$2 = {exports: {}};

var DESCRIPTORS$4 = descriptors;
var hasOwn$6 = hasOwnProperty_1;

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS$4 && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn$6(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS$4 || (DESCRIPTORS$4 && getDescriptor(FunctionPrototype, 'name').configurable));

var functionName = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

var uncurryThis$5 = functionUncurryThis;
var isCallable$8 = isCallable$e;
var store$1 = sharedStore;

var functionToString = uncurryThis$5(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable$8(store$1.inspectSource)) {
  store$1.inspectSource = function (it) {
    return functionToString(it);
  };
}

var inspectSource$1 = store$1.inspectSource;

var global$4 = global$c;
var isCallable$7 = isCallable$e;

var WeakMap$2 = global$4.WeakMap;

var weakMapBasicDetection = isCallable$7(WeakMap$2) && /native code/.test(String(WeakMap$2));

var shared$1 = shared$3.exports;
var uid = uid$2;

var keys = shared$1('keys');

var sharedKey$3 = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var hiddenKeys$4 = {};

var NATIVE_WEAK_MAP = weakMapBasicDetection;
var global$3 = global$c;
var isObject$1 = isObject$6;
var createNonEnumerableProperty$3 = createNonEnumerableProperty$4;
var hasOwn$5 = hasOwnProperty_1;
var shared = sharedStore;
var sharedKey$2 = sharedKey$3;
var hiddenKeys$3 = hiddenKeys$4;

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError$1 = global$3.TypeError;
var WeakMap$1 = global$3.WeakMap;
var set, get, has$3;

var enforce = function (it) {
  return has$3(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject$1(it) || (state = get(it)).type !== TYPE) {
      throw TypeError$1('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap$1());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw TypeError$1(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has$3 = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey$2('state');
  hiddenKeys$3[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn$5(it, STATE)) throw TypeError$1(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty$3(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn$5(it, STATE) ? it[STATE] : {};
  };
  has$3 = function (it) {
    return hasOwn$5(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has$3,
  enforce: enforce,
  getterFor: getterFor
};

var uncurryThis$4 = functionUncurryThis;
var fails$4 = fails$b;
var isCallable$6 = isCallable$e;
var hasOwn$4 = hasOwnProperty_1;
var DESCRIPTORS$3 = descriptors;
var CONFIGURABLE_FUNCTION_NAME$1 = functionName.CONFIGURABLE;
var inspectSource = inspectSource$1;
var InternalStateModule$1 = internalState;

var enforceInternalState = InternalStateModule$1.enforce;
var getInternalState$1 = InternalStateModule$1.get;
var $String$1 = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty$4 = Object.defineProperty;
var stringSlice = uncurryThis$4(''.slice);
var replace$1 = uncurryThis$4(''.replace);
var join = uncurryThis$4([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS$3 && !fails$4(function () {
  return defineProperty$4(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn$1 = makeBuiltIn$2.exports = function (value, name, options) {
  if (stringSlice($String$1(name), 0, 7) === 'Symbol(') {
    name = '[' + replace$1($String$1(name), /^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn$4(value, 'name') || (CONFIGURABLE_FUNCTION_NAME$1 && value.name !== name)) {
    if (DESCRIPTORS$3) defineProperty$4(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn$4(options, 'arity') && value.length !== options.arity) {
    defineProperty$4(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn$4(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS$3) defineProperty$4(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn$4(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn$1(function toString() {
  return isCallable$6(this) && getInternalState$1(this).source || inspectSource(this);
}, 'toString');

var isCallable$5 = isCallable$e;
var definePropertyModule$2 = objectDefineProperty;
var makeBuiltIn = makeBuiltIn$2.exports;
var defineGlobalProperty$1 = defineGlobalProperty$3;

var defineBuiltIn$3 = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable$5(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty$1(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule$2.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};

var objectGetOwnPropertyNames = {};

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
var mathTrunc = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};

var trunc = mathTrunc;

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
var toIntegerOrInfinity$2 = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};

var toIntegerOrInfinity$1 = toIntegerOrInfinity$2;

var max = Math.max;
var min$1 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex$1 = function (index, length) {
  var integer = toIntegerOrInfinity$1(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};

var toIntegerOrInfinity = toIntegerOrInfinity$2;

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
var toLength$1 = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var toLength = toLength$1;

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
var lengthOfArrayLike$1 = function (obj) {
  return toLength(obj.length);
};

var toIndexedObject$3 = toIndexedObject$5;
var toAbsoluteIndex = toAbsoluteIndex$1;
var lengthOfArrayLike = lengthOfArrayLike$1;

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject$3($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

var uncurryThis$3 = functionUncurryThis;
var hasOwn$3 = hasOwnProperty_1;
var toIndexedObject$2 = toIndexedObject$5;
var indexOf = arrayIncludes.indexOf;
var hiddenKeys$2 = hiddenKeys$4;

var push = uncurryThis$3([].push);

var objectKeysInternal = function (object, names) {
  var O = toIndexedObject$2(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn$3(hiddenKeys$2, key) && hasOwn$3(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn$3(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys$3 = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var internalObjectKeys$1 = objectKeysInternal;
var enumBugKeys$2 = enumBugKeys$3;

var hiddenKeys$1 = enumBugKeys$2.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys$1(O, hiddenKeys$1);
};

var objectGetOwnPropertySymbols = {};

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

var getBuiltIn$1 = getBuiltIn$3;
var uncurryThis$2 = functionUncurryThis;
var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;
var anObject$3 = anObject$5;

var concat$1 = uncurryThis$2([].concat);

// all object keys, includes non-enumerable and symbols
var ownKeys$1 = getBuiltIn$1('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject$3(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule$1.f;
  return getOwnPropertySymbols ? concat$1(keys, getOwnPropertySymbols(it)) : keys;
};

var hasOwn$2 = hasOwnProperty_1;
var ownKeys = ownKeys$1;
var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
var definePropertyModule$1 = objectDefineProperty;

var copyConstructorProperties$1 = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule$1.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn$2(target, key) && !(exceptions && hasOwn$2(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};

var fails$3 = fails$b;
var isCallable$4 = isCallable$e;

var replacement = /#|\.prototype\./;

var isForced$1 = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable$4(detection) ? fails$3(detection)
    : !!detection;
};

var normalize = isForced$1.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced$1.data = {};
var NATIVE = isForced$1.NATIVE = 'N';
var POLYFILL = isForced$1.POLYFILL = 'P';

var isForced_1 = isForced$1;

var global$2 = global$c;
var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
var createNonEnumerableProperty$2 = createNonEnumerableProperty$4;
var defineBuiltIn$2 = defineBuiltIn$3;
var defineGlobalProperty = defineGlobalProperty$3;
var copyConstructorProperties = copyConstructorProperties$1;
var isForced = isForced_1;

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global$2;
  } else if (STATIC) {
    target = global$2[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global$2[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty$2(sourceProperty, 'sham', true);
    }
    defineBuiltIn$2(target, key, sourceProperty, options);
  }
};

var internalObjectKeys = objectKeysInternal;
var enumBugKeys$1 = enumBugKeys$3;

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
var objectKeys$2 = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys$1);
};

var DESCRIPTORS$2 = descriptors;
var uncurryThis$1 = functionUncurryThis;
var call$1 = functionCall;
var fails$2 = fails$b;
var objectKeys$1 = objectKeys$2;
var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
var propertyIsEnumerableModule = objectPropertyIsEnumerable;
var toObject$2 = toObject$4;
var IndexedObject = indexedObject;

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty$3 = Object.defineProperty;
var concat = uncurryThis$1([].concat);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
var objectAssign$1 = !$assign || fails$2(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS$2 && $assign({ b: 1 }, $assign(defineProperty$3({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty$3(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] != 7 || objectKeys$1($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject$2(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat(objectKeys$1(S), getOwnPropertySymbols(S)) : objectKeys$1(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS$2 || call$1(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;

var $$1 = _export;
var assign$2 = objectAssign$1;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es/no-object-assign -- required for testing
$$1({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== assign$2 }, {
  assign: assign$2
});

class TopBarViewStore {
  constructor(root) {
    this.searchTabValue = 1;
    this.setSearchTabValue = action(val => {
      this.searchTabValue = val;
    });
    this.changeTabValue = action((event, newValue) => {
      this.setSearchTabValue(newValue);
    });
    this.root = root;
    makeAutoObservable(this);
  }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

class SearchViewStore {
  constructor(root) {
    this.db = null;
    this.pickupItems = [];
    this.dropoffItems = [];
    this.yardItems = [];
    this.furnitureItems = [];
    this.searchIcons = {};
    this.searchOptions = [];
    this.searchOptionValue = '';
    this.autocompleteRef = null;
    this.showMaterialsModal = false;
    this.allMaterialData = [];
    this.svgDoB64 = null;
    this.setDb = action(db => {
      this.db = db;
    });
    //  ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    //  ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    this.setAllMaterialData = action(data => {
      // this.streamsTypesAndItems = data
      this.allMaterialData = data;
    });
    //  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    //  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    this.setYardItems = action(items => {
      this.yardItems = items;
    });
    this.setSvgDoB64 = action(b64 => {
      this.svgDoB64 = b64;
    });
    this.setFurnitureItems = action(items => {
      this.furnitureItems = items;
    });
    this.setPickupItems = action(items => {
      this.pickupItems = items;
    });
    this.setDropoffItems = action(items => {
      this.dropoffItems = items;
    });
    this.setSearchIcons = action(icons => {
      this.searchIcons = icons;
    });
    this.handleSearchSubmit = action(() => {
      return;
    });
    this.setSearchOptions = action(arr => {
      this.searchOptions = arr;
    });
    this.setAutocompleteRef = action(ref => {
      this.autocompleteRef = ref;
    });
    this.onSearchOptChg = action((str, db) => __awaiter(this, void 0, void 0, function* () {
      this.searchOptionValue = str;
      if (str.length >= 3) {
        const opts = yield getMaterialSearchOptions(db, str);
        this.setSearchOptions(opts);
      }
    }));
    this.root = root;
    makeAutoObservable(this);
  }
}

class RootStore {
  constructor() {
    this.topBarViewStore = new TopBarViewStore(this);
    this.searchViewStore = new SearchViewStore(this);
  }
}

// create the context
const StoreContext = /*#__PURE__*/createContext(undefined);
// create the provider component
const RootStoreProvider = ({
  children
}) => {
  //only create the store once ( store is a singleton)
  const root = new RootStore();
  return jsx(StoreContext.Provider, Object.assign({
    value: root
  }, {
    children: children
  }));
};
// create the hook
const useSearchStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useRootStore must be used within RootStoreProvider");
  }
  return context;
};

const SearchBar = observer(({
  allMaterials,
  searchSubmitHandler,
  db,
  searchOptions,
  searchOptionValue,
  onSearchOptChg
}) => {
  const handleChange = (event, value) => {
    if (value === null) return;
    const selectedOption = searchOptions.find(opt => {
      return opt === value;
    });
    if (selectedOption) {
      searchSubmitHandler(selectedOption.id, db);
    }
  };
  return jsx(Autocomplete, {
    sx: {
      flex: 1,
      minWidth: 200,
      maxWidth: 350,
      borderRadius: 75,
      background: 'white',
      margin: '0.5em'
    },
    onChange: (evt, opt) => {
      handleChange(evt, opt);
    },
    options: searchOptions,
    filterOptions: x => x,
    freeSolo: true,
    renderInput: renderInputParams => jsx("div", Object.assign({
      ref: renderInputParams.InputProps.ref,
      style: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row'
      }
    }, {
      children: jsx(TextField, {
        style: {
          flex: 1
        },
        InputProps: Object.assign(Object.assign({}, renderInputParams.InputProps), {
          startAdornment: jsxs(InputAdornment, Object.assign({
            position: "start"
          }, {
            children: [' ', jsx(SearchIcon, {}), ' ']
          }))
        }),
        value: searchOptionValue,
        onChange: evt => {
          onSearchOptChg(evt.target.value, db);
        },
        placeholder: "Teach me about...",
        inputProps: Object.assign({}, renderInputParams.inputProps),
        InputLabelProps: {
          style: {
            display: 'none'
          }
        },
        autoComplete: 'off',
        type: 'text'
      })
    }))
  });
});

var SearchTabs;
(function (SearchTabs) {
  SearchTabs["dropoff"] = " Drop-Off";
  SearchTabs["routineYardTrash"] = "Routine Yard Trash";
  SearchTabs["furnitureAppliances"] = "Furniture and Appliances";
  SearchTabs["curbside"] = "Curbside";
})(SearchTabs || (SearchTabs = {}));
const Topbar = ({
  db,
  searchSubmitHandler,
  allMaterials,
  streamNames,
  searchOptionValue,
  onSearchOptChg,
  searchOptions
}) => {
  const theme = useTheme$2();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    searchTabValue,
    changeTabValue
  } = useSearchStore().topBarViewStore;
  return jsx(Box$2, Object.assign({
    component: "div",
    sx: {
      flexGrow: 1
    }
  }, {
    children: jsxs(AppBar, Object.assign({
      position: "static",
      sx: {
        height: isMobile ? 'auto' : 70,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: isMobile ? 'start' : 'space-between',
        background: theme.palette.background.paper
      }
    }, {
      children: [jsx(Box$2, Object.assign({
        component: "div",
        style: {
          justifySelf: 'start',
          display: 'inline',
          marginLeft: '.5rem',
          padding: isMobile ? '1rem 0' : 0
        }
      }, {
        children: jsx(SearchBar, {
          db: db,
          allMaterials: allMaterials,
          searchSubmitHandler: searchSubmitHandler,
          searchOptionValue: searchOptionValue,
          onSearchOptChg: onSearchOptChg,
          searchOptions: searchOptions
        })
      })), jsx(Tabs, Object.assign({
        value: searchTabValue,
        onChange: changeTabValue,
        "aria-label": "search tab pickup or dropoff"
      }, {
        children: streamNames.map((streamName, idx) => {
          return jsx(Tab, {
            label: jsx(Typography, Object.assign({
              sx: {
                color: searchTabValue === 1 ? null : theme.palette.text.primary
              },
              variant: "caption"
            }, {
              children: streamName
            })),
            value: idx + 1,
            wrapped: true
          });
        })
      }))]
    }))
  }));
};

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

// https://github.com/sindresorhus/is-plain-obj/blob/main/index.js
function isPlainObject(item) {
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(item);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in item) && !(Symbol.iterator in item);
}
function deepClone(source) {
  if ( /*#__PURE__*/React.isValidElement(source) || !isPlainObject(source)) {
    return source;
  }
  const output = {};
  Object.keys(source).forEach(key => {
    output[key] = deepClone(source[key]);
  });
  return output;
}
function deepmerge(target, source, options = {
  clone: true
}) {
  const output = options.clone ? _extends({}, target) : target;
  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach(key => {
      if ( /*#__PURE__*/React.isValidElement(source[key])) {
        output[key] = source[key];
      } else if (isPlainObject(source[key]) &&
      // Avoid prototype pollution
      Object.prototype.hasOwnProperty.call(target, key) && isPlainObject(target[key])) {
        // Since `output` is a clone of `target` and we have narrowed `target` in this block we can cast to the same type.
        output[key] = deepmerge(target[key], source[key], options);
      } else if (options.clone) {
        output[key] = isPlainObject(source[key]) ? deepClone(source[key]) : source[key];
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
}

var propTypes = {exports: {}};

var reactIs = {exports: {}};

var reactIs_production_min = {};

/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
Symbol.for("react.suspense_list"):60120,r$1=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r$1:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}reactIs_production_min.AsyncMode=l;reactIs_production_min.ConcurrentMode=m;reactIs_production_min.ContextConsumer=k;reactIs_production_min.ContextProvider=h;reactIs_production_min.Element=c;reactIs_production_min.ForwardRef=n;reactIs_production_min.Fragment=e;reactIs_production_min.Lazy=t;reactIs_production_min.Memo=r$1;reactIs_production_min.Portal=d;
reactIs_production_min.Profiler=g;reactIs_production_min.StrictMode=f;reactIs_production_min.Suspense=p;reactIs_production_min.isAsyncMode=function(a){return A(a)||z(a)===l};reactIs_production_min.isConcurrentMode=A;reactIs_production_min.isContextConsumer=function(a){return z(a)===k};reactIs_production_min.isContextProvider=function(a){return z(a)===h};reactIs_production_min.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c};reactIs_production_min.isForwardRef=function(a){return z(a)===n};reactIs_production_min.isFragment=function(a){return z(a)===e};reactIs_production_min.isLazy=function(a){return z(a)===t};
reactIs_production_min.isMemo=function(a){return z(a)===r$1};reactIs_production_min.isPortal=function(a){return z(a)===d};reactIs_production_min.isProfiler=function(a){return z(a)===g};reactIs_production_min.isStrictMode=function(a){return z(a)===f};reactIs_production_min.isSuspense=function(a){return z(a)===p};
reactIs_production_min.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r$1||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};reactIs_production_min.typeOf=z;

var reactIs_development = {};

/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (process.env.NODE_ENV !== "production") {
  (function() {

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

reactIs_development.AsyncMode = AsyncMode;
reactIs_development.ConcurrentMode = ConcurrentMode;
reactIs_development.ContextConsumer = ContextConsumer;
reactIs_development.ContextProvider = ContextProvider;
reactIs_development.Element = Element;
reactIs_development.ForwardRef = ForwardRef;
reactIs_development.Fragment = Fragment;
reactIs_development.Lazy = Lazy;
reactIs_development.Memo = Memo;
reactIs_development.Portal = Portal;
reactIs_development.Profiler = Profiler;
reactIs_development.StrictMode = StrictMode;
reactIs_development.Suspense = Suspense;
reactIs_development.isAsyncMode = isAsyncMode;
reactIs_development.isConcurrentMode = isConcurrentMode;
reactIs_development.isContextConsumer = isContextConsumer;
reactIs_development.isContextProvider = isContextProvider;
reactIs_development.isElement = isElement;
reactIs_development.isForwardRef = isForwardRef;
reactIs_development.isFragment = isFragment;
reactIs_development.isLazy = isLazy;
reactIs_development.isMemo = isMemo;
reactIs_development.isPortal = isPortal;
reactIs_development.isProfiler = isProfiler;
reactIs_development.isStrictMode = isStrictMode;
reactIs_development.isSuspense = isSuspense;
reactIs_development.isValidElementType = isValidElementType;
reactIs_development.typeOf = typeOf;
  })();
}

if (process.env.NODE_ENV === 'production') {
  reactIs.exports = reactIs_production_min;
} else {
  reactIs.exports = reactIs_development;
}

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject$1(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject$1(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty$1.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret$3 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret$3;

var has$2 = Function.call.bind(Object.prototype.hasOwnProperty);

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var printWarning$1 = function() {};

if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret$2 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};
  var has$1 = has$2;

  printWarning$1 = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) { /**/ }
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes$1(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (has$1(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$2);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning$1(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning$1(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes$1.resetWarningCache = function() {
  if (process.env.NODE_ENV !== 'production') {
    loggedTypeFailures = {};
  }
};

var checkPropTypes_1 = checkPropTypes$1;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactIs$1 = reactIs.exports;
var assign$1 = objectAssign;

var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
var has = has$2;
var checkPropTypes = checkPropTypes_1;

var printWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bigint: createPrimitiveTypeChecker('bigint'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message, data) {
    this.message = message;
    this.data = data && typeof data === 'object' ? data: {};
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret$1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError(
          'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
          {expectedType: expectedType}
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret$1);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs$1.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (process.env.NODE_ENV !== 'production') {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret$1);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      var expectedTypes = [];
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret$1);
        if (checkerResult == null) {
          return null;
        }
        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
          expectedTypes.push(checkerResult.data.expectedType);
        }
      }
      var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function invalidValidatorError(componentName, location, propFullName, key, type) {
    return new PropTypeError(
      (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
      'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
    );
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret$1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from props.
      var allKeys = assign$1({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (has(shapeTypes, key) && typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret$1);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = ReactPropTypesSecret_1;

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  }  shim.isRequired = shim;
  function getShim() {
    return shim;
  }  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var ReactIs = reactIs.exports;

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  propTypes.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  propTypes.exports = factoryWithThrowingShims();
}

var PropTypes = propTypes.exports;

/**
 * WARNING: Don't import this directly.
 * Use `MuiError` from `@mui/internal-babel-macros/MuiError.macro` instead.
 * @param {number} code
 */
function formatMuiErrorMessage(code) {
  // Apply babel-plugin-transform-template-literals in loose mode
  // loose mode is safe if we're concatenating primitives
  // see https://babeljs.io/docs/en/babel-plugin-transform-template-literals#loose
  /* eslint-disable prefer-template */
  let url = 'https://mui.com/production-error/?code=' + code;
  for (let i = 1; i < arguments.length; i += 1) {
    // rest params over-transpile for this case
    // eslint-disable-next-line prefer-rest-params
    url += '&args[]=' + encodeURIComponent(arguments[i]);
  }
  return 'Minified MUI error #' + code + '; visit ' + url + ' for the full message.';
  /* eslint-enable prefer-template */
}

// It should to be noted that this function isn't equivalent to `text-transform: capitalize`.
//
// A strict capitalization should uppercase the first letter of each word in the sentence.
// We only handle the first word.
function capitalize(string) {
  if (typeof string !== 'string') {
    throw new Error(process.env.NODE_ENV !== "production" ? `MUI: \`capitalize(string)\` expects a string argument.` : formatMuiErrorMessage(7));
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}

function memoize$1(fn) {
  var cache = Object.create(null);
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

var isPropValid = /* #__PURE__ */memoize$1(function (prop) {
  return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
  /* o */
  && prop.charCodeAt(1) === 110
  /* n */
  && prop.charCodeAt(2) < 91;
}
/* Z+1 */
);

/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/
// $FlowFixMe
function sheetForTag(tag) {
  if (tag.sheet) {
    // $FlowFixMe
    return tag.sheet;
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i];
    }
  }
}

function createStyleElement(options) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', options.key);

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));
  tag.setAttribute('data-s', '');
  return tag;
}

var StyleSheet = /*#__PURE__*/function () {
  // Using Node instead of HTMLElement since container may be a ShadowRoot
  function StyleSheet(options) {
    var _this = this;

    this._insertTag = function (tag) {
      var before;

      if (_this.tags.length === 0) {
        if (_this.insertionPoint) {
          before = _this.insertionPoint.nextSibling;
        } else if (_this.prepend) {
          before = _this.container.firstChild;
        } else {
          before = _this.before;
        }
      } else {
        before = _this.tags[_this.tags.length - 1].nextSibling;
      }

      _this.container.insertBefore(tag, before);

      _this.tags.push(tag);
    };

    this.isSpeedy = options.speedy === undefined ? process.env.NODE_ENV === 'production' : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.prepend = options.prepend;
    this.insertionPoint = options.insertionPoint;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.hydrate = function hydrate(nodes) {
    nodes.forEach(this._insertTag);
  };

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      this._insertTag(createStyleElement(this));
    }

    var tag = this.tags[this.tags.length - 1];

    if (process.env.NODE_ENV !== 'production') {
      var isImportRule = rule.charCodeAt(0) === 64 && rule.charCodeAt(1) === 105;

      if (isImportRule && this._alreadyInsertedOrderInsensitiveRule) {
        // this would only cause problem in speedy mode
        // but we don't want enabling speedy to affect the observable behavior
        // so we report this error at all times
        console.error("You're attempting to insert the following rule:\n" + rule + '\n\n`@import` rules must be before all other types of rules in a stylesheet but other rules have already been inserted. Please ensure that `@import` rules are before all other rules.');
      }
      this._alreadyInsertedOrderInsensitiveRule = this._alreadyInsertedOrderInsensitiveRule || !isImportRule;
    }

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e) {
        if (process.env.NODE_ENV !== 'production' && !/:(-moz-placeholder|-moz-focus-inner|-moz-focusring|-ms-input-placeholder|-moz-read-write|-moz-read-only|-ms-clear|-ms-expand|-ms-reveal){/.test(rule)) {
          console.error("There was a problem inserting the following rule: \"" + rule + "\"", e);
        }
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  };

  _proto.flush = function flush() {
    // $FlowFixMe
    this.tags.forEach(function (tag) {
      return tag.parentNode && tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;

    if (process.env.NODE_ENV !== 'production') {
      this._alreadyInsertedOrderInsensitiveRule = false;
    }
  };

  return StyleSheet;
}();

var MS = '-ms-';
var MOZ = '-moz-';
var WEBKIT = '-webkit-';

var COMMENT = 'comm';
var RULESET = 'rule';
var DECLARATION = 'decl';
var IMPORT = '@import';
var KEYFRAMES = '@keyframes';
var LAYER = '@layer';

/**
 * @param {number}
 * @return {number}
 */
var abs = Math.abs;

/**
 * @param {number}
 * @return {string}
 */
var from = String.fromCharCode;

/**
 * @param {object}
 * @return {object}
 */
var assign = Object.assign;

/**
 * @param {string} value
 * @param {number} length
 * @return {number}
 */
function hash (value, length) {
	return charat(value, 0) ^ 45 ? (((((((length << 2) ^ charat(value, 0)) << 2) ^ charat(value, 1)) << 2) ^ charat(value, 2)) << 2) ^ charat(value, 3) : 0
}

/**
 * @param {string} value
 * @return {string}
 */
function trim (value) {
	return value.trim()
}

/**
 * @param {string} value
 * @param {RegExp} pattern
 * @return {string?}
 */
function match (value, pattern) {
	return (value = pattern.exec(value)) ? value[0] : value
}

/**
 * @param {string} value
 * @param {(string|RegExp)} pattern
 * @param {string} replacement
 * @return {string}
 */
function replace (value, pattern, replacement) {
	return value.replace(pattern, replacement)
}

/**
 * @param {string} value
 * @param {string} search
 * @return {number}
 */
function indexof (value, search) {
	return value.indexOf(search)
}

/**
 * @param {string} value
 * @param {number} index
 * @return {number}
 */
function charat (value, index) {
	return value.charCodeAt(index) | 0
}

/**
 * @param {string} value
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function substr (value, begin, end) {
	return value.slice(begin, end)
}

/**
 * @param {string} value
 * @return {number}
 */
function strlen (value) {
	return value.length
}

/**
 * @param {any[]} value
 * @return {number}
 */
function sizeof (value) {
	return value.length
}

/**
 * @param {any} value
 * @param {any[]} array
 * @return {any}
 */
function append (value, array) {
	return array.push(value), value
}

/**
 * @param {string[]} array
 * @param {function} callback
 * @return {string}
 */
function combine (array, callback) {
	return array.map(callback).join('')
}

var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = '';

/**
 * @param {string} value
 * @param {object | null} root
 * @param {object | null} parent
 * @param {string} type
 * @param {string[] | string} props
 * @param {object[] | string} children
 * @param {number} length
 */
function node (value, root, parent, type, props, children, length) {
	return {value: value, root: root, parent: parent, type: type, props: props, children: children, line: line, column: column, length: length, return: ''}
}

/**
 * @param {object} root
 * @param {object} props
 * @return {object}
 */
function copy (root, props) {
	return assign(node('', null, null, '', null, null, 0), root, {length: -root.length}, props)
}

/**
 * @return {number}
 */
function char () {
	return character
}

/**
 * @return {number}
 */
function prev () {
	character = position > 0 ? charat(characters, --position) : 0;

	if (column--, character === 10)
		column = 1, line--;

	return character
}

/**
 * @return {number}
 */
function next () {
	character = position < length ? charat(characters, position++) : 0;

	if (column++, character === 10)
		column = 1, line++;

	return character
}

/**
 * @return {number}
 */
function peek () {
	return charat(characters, position)
}

/**
 * @return {number}
 */
function caret () {
	return position
}

/**
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function slice (begin, end) {
	return substr(characters, begin, end)
}

/**
 * @param {number} type
 * @return {number}
 */
function token (type) {
	switch (type) {
		// \0 \t \n \r \s whitespace token
		case 0: case 9: case 10: case 13: case 32:
			return 5
		// ! + , / > @ ~ isolate token
		case 33: case 43: case 44: case 47: case 62: case 64: case 126:
		// ; { } breakpoint token
		case 59: case 123: case 125:
			return 4
		// : accompanied token
		case 58:
			return 3
		// " ' ( [ opening delimit token
		case 34: case 39: case 40: case 91:
			return 2
		// ) ] closing delimit token
		case 41: case 93:
			return 1
	}

	return 0
}

/**
 * @param {string} value
 * @return {any[]}
 */
function alloc (value) {
	return line = column = 1, length = strlen(characters = value), position = 0, []
}

/**
 * @param {any} value
 * @return {any}
 */
function dealloc (value) {
	return characters = '', value
}

/**
 * @param {number} type
 * @return {string}
 */
function delimit (type) {
	return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)))
}

/**
 * @param {number} type
 * @return {string}
 */
function whitespace (type) {
	while (character = peek())
		if (character < 33)
			next();
		else
			break

	return token(type) > 2 || token(character) > 3 ? '' : ' '
}

/**
 * @param {number} index
 * @param {number} count
 * @return {string}
 */
function escaping (index, count) {
	while (--count && next())
		// not 0-9 A-F a-f
		if (character < 48 || character > 102 || (character > 57 && character < 65) || (character > 70 && character < 97))
			break

	return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32))
}

/**
 * @param {number} type
 * @return {number}
 */
function delimiter (type) {
	while (next())
		switch (character) {
			// ] ) " '
			case type:
				return position
			// " '
			case 34: case 39:
				if (type !== 34 && type !== 39)
					delimiter(character);
				break
			// (
			case 40:
				if (type === 41)
					delimiter(type);
				break
			// \
			case 92:
				next();
				break
		}

	return position
}

/**
 * @param {number} type
 * @param {number} index
 * @return {number}
 */
function commenter (type, index) {
	while (next())
		// //
		if (type + character === 47 + 10)
			break
		// /*
		else if (type + character === 42 + 42 && peek() === 47)
			break

	return '/*' + slice(index, position - 1) + '*' + from(type === 47 ? type : next())
}

/**
 * @param {number} index
 * @return {string}
 */
function identifier (index) {
	while (!token(peek()))
		next();

	return slice(index, position)
}

/**
 * @param {string} value
 * @return {object[]}
 */
function compile (value) {
	return dealloc(parse('', null, null, null, [''], value = alloc(value), 0, [0], value))
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {string[]} rule
 * @param {string[]} rules
 * @param {string[]} rulesets
 * @param {number[]} pseudo
 * @param {number[]} points
 * @param {string[]} declarations
 * @return {object}
 */
function parse (value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
	var index = 0;
	var offset = 0;
	var length = pseudo;
	var atrule = 0;
	var property = 0;
	var previous = 0;
	var variable = 1;
	var scanning = 1;
	var ampersand = 1;
	var character = 0;
	var type = '';
	var props = rules;
	var children = rulesets;
	var reference = rule;
	var characters = type;

	while (scanning)
		switch (previous = character, character = next()) {
			// (
			case 40:
				if (previous != 108 && charat(characters, length - 1) == 58) {
					if (indexof(characters += replace(delimit(character), '&', '&\f'), '&\f') != -1)
						ampersand = -1;
					break
				}
			// " ' [
			case 34: case 39: case 91:
				characters += delimit(character);
				break
			// \t \n \r \s
			case 9: case 10: case 13: case 32:
				characters += whitespace(previous);
				break
			// \
			case 92:
				characters += escaping(caret() - 1, 7);
				continue
			// /
			case 47:
				switch (peek()) {
					case 42: case 47:
						append(comment(commenter(next(), caret()), root, parent), declarations);
						break
					default:
						characters += '/';
				}
				break
			// {
			case 123 * variable:
				points[index++] = strlen(characters) * ampersand;
			// } ; \0
			case 125 * variable: case 59: case 0:
				switch (character) {
					// \0 }
					case 0: case 125: scanning = 0;
					// ;
					case 59 + offset: if (ampersand == -1) characters = replace(characters, /\f/g, '');
						if (property > 0 && (strlen(characters) - length))
							append(property > 32 ? declaration(characters + ';', rule, parent, length - 1) : declaration(replace(characters, ' ', '') + ';', rule, parent, length - 2), declarations);
						break
					// @ ;
					case 59: characters += ';';
					// { rule/at-rule
					default:
						append(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length), rulesets);

						if (character === 123)
							if (offset === 0)
								parse(characters, root, reference, reference, props, rulesets, length, points, children);
							else
								switch (atrule === 99 && charat(characters, 3) === 110 ? 100 : atrule) {
									// d l m s
									case 100: case 108: case 109: case 115:
										parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length), children), rules, children, length, points, rule ? props : children);
										break
									default:
										parse(characters, reference, reference, reference, [''], children, 0, points, children);
								}
				}

				index = offset = property = 0, variable = ampersand = 1, type = characters = '', length = pseudo;
				break
			// :
			case 58:
				length = 1 + strlen(characters), property = previous;
			default:
				if (variable < 1)
					if (character == 123)
						--variable;
					else if (character == 125 && variable++ == 0 && prev() == 125)
						continue

				switch (characters += from(character), character * variable) {
					// &
					case 38:
						ampersand = offset > 0 ? 1 : (characters += '\f', -1);
						break
					// ,
					case 44:
						points[index++] = (strlen(characters) - 1) * ampersand, ampersand = 1;
						break
					// @
					case 64:
						// -
						if (peek() === 45)
							characters += delimit(next());

						atrule = peek(), offset = length = strlen(type = characters += identifier(caret())), character++;
						break
					// -
					case 45:
						if (previous === 45 && strlen(characters) == 2)
							variable = 0;
				}
		}

	return rulesets
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} index
 * @param {number} offset
 * @param {string[]} rules
 * @param {number[]} points
 * @param {string} type
 * @param {string[]} props
 * @param {string[]} children
 * @param {number} length
 * @return {object}
 */
function ruleset (value, root, parent, index, offset, rules, points, type, props, children, length) {
	var post = offset - 1;
	var rule = offset === 0 ? rules : [''];
	var size = sizeof(rule);

	for (var i = 0, j = 0, k = 0; i < index; ++i)
		for (var x = 0, y = substr(value, post + 1, post = abs(j = points[i])), z = value; x < size; ++x)
			if (z = trim(j > 0 ? rule[x] + ' ' + y : replace(y, /&\f/g, rule[x])))
				props[k++] = z;

	return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length)
}

/**
 * @param {number} value
 * @param {object} root
 * @param {object?} parent
 * @return {object}
 */
function comment (value, root, parent) {
	return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0)
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} length
 * @return {object}
 */
function declaration (value, root, parent, length) {
	return node(value, root, parent, DECLARATION, substr(value, 0, length), substr(value, length + 1, -1), length)
}

/**
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function serialize (children, callback) {
	var output = '';
	var length = sizeof(children);

	for (var i = 0; i < length; i++)
		output += callback(children[i], i, children, callback) || '';

	return output
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function stringify (element, index, children, callback) {
	switch (element.type) {
		case LAYER: if (element.children.length) break
		case IMPORT: case DECLARATION: return element.return = element.return || element.value
		case COMMENT: return ''
		case KEYFRAMES: return element.return = element.value + '{' + serialize(element.children, callback) + '}'
		case RULESET: element.value = element.props.join(',');
	}

	return strlen(children = serialize(element.children, callback)) ? element.return = element.value + '{' + children + '}' : ''
}

/**
 * @param {function[]} collection
 * @return {function}
 */
function middleware (collection) {
	var length = sizeof(collection);

	return function (element, index, children, callback) {
		var output = '';

		for (var i = 0; i < length; i++)
			output += collection[i](element, index, children, callback) || '';

		return output
	}
}

/**
 * @param {function} callback
 * @return {function}
 */
function rulesheet (callback) {
	return function (element) {
		if (!element.root)
			if (element = element.return)
				callback(element);
	}
}

var weakMemoize = function weakMemoize(func) {
  // $FlowFixMe flow doesn't include all non-primitive types as allowed for weakmaps
  var cache = new WeakMap();
  return function (arg) {
    if (cache.has(arg)) {
      // $FlowFixMe
      return cache.get(arg);
    }

    var ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};

var identifierWithPointTracking = function identifierWithPointTracking(begin, points, index) {
  var previous = 0;
  var character = 0;

  while (true) {
    previous = character;
    character = peek(); // &\f

    if (previous === 38 && character === 12) {
      points[index] = 1;
    }

    if (token(character)) {
      break;
    }

    next();
  }

  return slice(begin, position);
};

var toRules = function toRules(parsed, points) {
  // pretend we've started with a comma
  var index = -1;
  var character = 44;

  do {
    switch (token(character)) {
      case 0:
        // &\f
        if (character === 38 && peek() === 12) {
          // this is not 100% correct, we don't account for literal sequences here - like for example quoted strings
          // stylis inserts \f after & to know when & where it should replace this sequence with the context selector
          // and when it should just concatenate the outer and inner selectors
          // it's very unlikely for this sequence to actually appear in a different context, so we just leverage this fact here
          points[index] = 1;
        }

        parsed[index] += identifierWithPointTracking(position - 1, points, index);
        break;

      case 2:
        parsed[index] += delimit(character);
        break;

      case 4:
        // comma
        if (character === 44) {
          // colon
          parsed[++index] = peek() === 58 ? '&\f' : '';
          points[index] = parsed[index].length;
          break;
        }

      // fallthrough

      default:
        parsed[index] += from(character);
    }
  } while (character = next());

  return parsed;
};

var getRules = function getRules(value, points) {
  return dealloc(toRules(alloc(value), points));
}; // WeakSet would be more appropriate, but only WeakMap is supported in IE11


var fixedElements = /* #__PURE__ */new WeakMap();
var compat = function compat(element) {
  if (element.type !== 'rule' || !element.parent || // positive .length indicates that this rule contains pseudo
  // negative .length indicates that this rule has been already prefixed
  element.length < 1) {
    return;
  }

  var value = element.value,
      parent = element.parent;
  var isImplicitRule = element.column === parent.column && element.line === parent.line;

  while (parent.type !== 'rule') {
    parent = parent.parent;
    if (!parent) return;
  } // short-circuit for the simplest case


  if (element.props.length === 1 && value.charCodeAt(0) !== 58
  /* colon */
  && !fixedElements.get(parent)) {
    return;
  } // if this is an implicitly inserted rule (the one eagerly inserted at the each new nested level)
  // then the props has already been manipulated beforehand as they that array is shared between it and its "rule parent"


  if (isImplicitRule) {
    return;
  }

  fixedElements.set(element, true);
  var points = [];
  var rules = getRules(value, points);
  var parentRules = parent.props;

  for (var i = 0, k = 0; i < rules.length; i++) {
    for (var j = 0; j < parentRules.length; j++, k++) {
      element.props[k] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
    }
  }
};
var removeLabel = function removeLabel(element) {
  if (element.type === 'decl') {
    var value = element.value;

    if ( // charcode for l
    value.charCodeAt(0) === 108 && // charcode for b
    value.charCodeAt(2) === 98) {
      // this ignores label
      element["return"] = '';
      element.value = '';
    }
  }
};
var ignoreFlag = 'emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason';

var isIgnoringComment = function isIgnoringComment(element) {
  return element.type === 'comm' && element.children.indexOf(ignoreFlag) > -1;
};

var createUnsafeSelectorsAlarm = function createUnsafeSelectorsAlarm(cache) {
  return function (element, index, children) {
    if (element.type !== 'rule' || cache.compat) return;
    var unsafePseudoClasses = element.value.match(/(:first|:nth|:nth-last)-child/g);

    if (unsafePseudoClasses) {
      var isNested = !!element.parent; // in nested rules comments become children of the "auto-inserted" rule and that's always the `element.parent`
      //
      // considering this input:
      // .a {
      //   .b /* comm */ {}
      //   color: hotpink;
      // }
      // we get output corresponding to this:
      // .a {
      //   & {
      //     /* comm */
      //     color: hotpink;
      //   }
      //   .b {}
      // }

      var commentContainer = isNested ? element.parent.children : // global rule at the root level
      children;

      for (var i = commentContainer.length - 1; i >= 0; i--) {
        var node = commentContainer[i];

        if (node.line < element.line) {
          break;
        } // it is quite weird but comments are *usually* put at `column: element.column - 1`
        // so we seek *from the end* for the node that is earlier than the rule's `element` and check that
        // this will also match inputs like this:
        // .a {
        //   /* comm */
        //   .b {}
        // }
        //
        // but that is fine
        //
        // it would be the easiest to change the placement of the comment to be the first child of the rule:
        // .a {
        //   .b { /* comm */ }
        // }
        // with such inputs we wouldn't have to search for the comment at all
        // TODO: consider changing this comment placement in the next major version


        if (node.column < element.column) {
          if (isIgnoringComment(node)) {
            return;
          }

          break;
        }
      }

      unsafePseudoClasses.forEach(function (unsafePseudoClass) {
        console.error("The pseudo class \"" + unsafePseudoClass + "\" is potentially unsafe when doing server-side rendering. Try changing it to \"" + unsafePseudoClass.split('-child')[0] + "-of-type\".");
      });
    }
  };
};

var isImportRule = function isImportRule(element) {
  return element.type.charCodeAt(1) === 105 && element.type.charCodeAt(0) === 64;
};

var isPrependedWithRegularRules = function isPrependedWithRegularRules(index, children) {
  for (var i = index - 1; i >= 0; i--) {
    if (!isImportRule(children[i])) {
      return true;
    }
  }

  return false;
}; // use this to remove incorrect elements from further processing
// so they don't get handed to the `sheet` (or anything else)
// as that could potentially lead to additional logs which in turn could be overhelming to the user


var nullifyElement = function nullifyElement(element) {
  element.type = '';
  element.value = '';
  element["return"] = '';
  element.children = '';
  element.props = '';
};

var incorrectImportAlarm = function incorrectImportAlarm(element, index, children) {
  if (!isImportRule(element)) {
    return;
  }

  if (element.parent) {
    console.error("`@import` rules can't be nested inside other rules. Please move it to the top level and put it before regular rules. Keep in mind that they can only be used within global styles.");
    nullifyElement(element);
  } else if (isPrependedWithRegularRules(index, children)) {
    console.error("`@import` rules can't be after other rules. Please put your `@import` rules before your other rules.");
    nullifyElement(element);
  }
};

/* eslint-disable no-fallthrough */

function prefix(value, length) {
  switch (hash(value, length)) {
    // color-adjust
    case 5103:
      return WEBKIT + 'print-' + value + value;
    // animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)

    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921: // text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break

    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005: // mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,

    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855: // background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)

    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return WEBKIT + value + value;
    // appearance, user-select, transform, hyphens, text-size-adjust

    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return WEBKIT + value + MOZ + value + MS + value + value;
    // flex, flex-direction

    case 6828:
    case 4268:
      return WEBKIT + value + MS + value + value;
    // order

    case 6165:
      return WEBKIT + value + MS + 'flex-' + value + value;
    // align-items

    case 5187:
      return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + 'box-$1$2' + MS + 'flex-$1$2') + value;
    // align-self

    case 5443:
      return WEBKIT + value + MS + 'flex-item-' + replace(value, /flex-|-self/, '') + value;
    // align-content

    case 4675:
      return WEBKIT + value + MS + 'flex-line-pack' + replace(value, /align-content|flex-|-self/, '') + value;
    // flex-shrink

    case 5548:
      return WEBKIT + value + MS + replace(value, 'shrink', 'negative') + value;
    // flex-basis

    case 5292:
      return WEBKIT + value + MS + replace(value, 'basis', 'preferred-size') + value;
    // flex-grow

    case 6060:
      return WEBKIT + 'box-' + replace(value, '-grow', '') + WEBKIT + value + MS + replace(value, 'grow', 'positive') + value;
    // transition

    case 4554:
      return WEBKIT + replace(value, /([^-])(transform)/g, '$1' + WEBKIT + '$2') + value;
    // cursor

    case 6187:
      return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + '$1'), /(image-set)/, WEBKIT + '$1'), value, '') + value;
    // background, background-image

    case 5495:
    case 3959:
      return replace(value, /(image-set\([^]*)/, WEBKIT + '$1' + '$`$1');
    // justify-content

    case 4968:
      return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + 'box-pack:$3' + MS + 'flex-pack:$3'), /s.+-b[^;]+/, 'justify') + WEBKIT + value + value;
    // (margin|padding)-inline-(start|end)

    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return replace(value, /(.+)-inline(.+)/, WEBKIT + '$1$2') + value;
    // (min|max)?(width|height|inline-size|block-size)

    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      // stretch, max-content, min-content, fill-available
      if (strlen(value) - 1 - length > 6) switch (charat(value, length + 1)) {
        // (m)ax-content, (m)in-content
        case 109:
          // -
          if (charat(value, length + 4) !== 45) break;
        // (f)ill-available, (f)it-content

        case 102:
          return replace(value, /(.+:)(.+)-([^]+)/, '$1' + WEBKIT + '$2-$3' + '$1' + MOZ + (charat(value, length + 3) == 108 ? '$3' : '$2-$3')) + value;
        // (s)tretch

        case 115:
          return ~indexof(value, 'stretch') ? prefix(replace(value, 'stretch', 'fill-available'), length) + value : value;
      }
      break;
    // position: sticky

    case 4949:
      // (s)ticky?
      if (charat(value, length + 1) !== 115) break;
    // display: (flex|inline-flex)

    case 6444:
      switch (charat(value, strlen(value) - 3 - (~indexof(value, '!important') && 10))) {
        // stic(k)y
        case 107:
          return replace(value, ':', ':' + WEBKIT) + value;
        // (inline-)?fl(e)x

        case 101:
          return replace(value, /(.+:)([^;!]+)(;|!.+)?/, '$1' + WEBKIT + (charat(value, 14) === 45 ? 'inline-' : '') + 'box$3' + '$1' + WEBKIT + '$2$3' + '$1' + MS + '$2box$3') + value;
      }

      break;
    // writing-mode

    case 5936:
      switch (charat(value, length + 11)) {
        // vertical-l(r)
        case 114:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, 'tb') + value;
        // vertical-r(l)

        case 108:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') + value;
        // horizontal(-)tb

        case 45:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, 'lr') + value;
      }

      return WEBKIT + value + MS + value + value;
  }

  return value;
}

var prefixer = function prefixer(element, index, children, callback) {
  if (element.length > -1) if (!element["return"]) switch (element.type) {
    case DECLARATION:
      element["return"] = prefix(element.value, element.length);
      break;

    case KEYFRAMES:
      return serialize([copy(element, {
        value: replace(element.value, '@', '@' + WEBKIT)
      })], callback);

    case RULESET:
      if (element.length) return combine(element.props, function (value) {
        switch (match(value, /(::plac\w+|:read-\w+)/)) {
          // :read-(only|write)
          case ':read-only':
          case ':read-write':
            return serialize([copy(element, {
              props: [replace(value, /:(read-\w+)/, ':' + MOZ + '$1')]
            })], callback);
          // :placeholder

          case '::placeholder':
            return serialize([copy(element, {
              props: [replace(value, /:(plac\w+)/, ':' + WEBKIT + 'input-$1')]
            }), copy(element, {
              props: [replace(value, /:(plac\w+)/, ':' + MOZ + '$1')]
            }), copy(element, {
              props: [replace(value, /:(plac\w+)/, MS + 'input-$1')]
            })], callback);
        }

        return '';
      });
  }
};

var isBrowser$4 = typeof document !== 'undefined';
var getServerStylisCache = isBrowser$4 ? undefined : weakMemoize(function () {
  return memoize$1(function () {
    var cache = {};
    return function (name) {
      return cache[name];
    };
  });
});
var defaultStylisPlugins = [prefixer];

var createCache = function createCache(options) {
  var key = options.key;

  if (process.env.NODE_ENV !== 'production' && !key) {
    throw new Error("You have to configure `key` for your cache. Please make sure it's unique (and not equal to 'css') as it's used for linking styles to your cache.\n" + "If multiple caches share the same key they might \"fight\" for each other's style elements.");
  }

  if (isBrowser$4 && key === 'css') {
    var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])"); // get SSRed styles out of the way of React's hydration
    // document.head is a safe place to move them to(though note document.head is not necessarily the last place they will be)
    // note this very very intentionally targets all style elements regardless of the key to ensure
    // that creating a cache works inside of render of a React component

    Array.prototype.forEach.call(ssrStyles, function (node) {
      // we want to only move elements which have a space in the data-emotion attribute value
      // because that indicates that it is an Emotion 11 server-side rendered style elements
      // while we will already ignore Emotion 11 client-side inserted styles because of the :not([data-s]) part in the selector
      // Emotion 10 client-side inserted styles did not have data-s (but importantly did not have a space in their data-emotion attributes)
      // so checking for the space ensures that loading Emotion 11 after Emotion 10 has inserted some styles
      // will not result in the Emotion 10 styles being destroyed
      var dataEmotionAttribute = node.getAttribute('data-emotion');

      if (dataEmotionAttribute.indexOf(' ') === -1) {
        return;
      }
      document.head.appendChild(node);
      node.setAttribute('data-s', '');
    });
  }

  var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;

  if (process.env.NODE_ENV !== 'production') {
    // $FlowFixMe
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var inserted = {};
  var container;
  var nodesToHydrate = [];

  if (isBrowser$4) {
    container = options.container || document.head;
    Array.prototype.forEach.call( // this means we will ignore elements which don't have a space in them which
    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
    document.querySelectorAll("style[data-emotion^=\"" + key + " \"]"), function (node) {
      var attrib = node.getAttribute("data-emotion").split(' '); // $FlowFixMe

      for (var i = 1; i < attrib.length; i++) {
        inserted[attrib[i]] = true;
      }

      nodesToHydrate.push(node);
    });
  }

  var _insert;

  var omnipresentPlugins = [compat, removeLabel];

  if (process.env.NODE_ENV !== 'production') {
    omnipresentPlugins.push(createUnsafeSelectorsAlarm({
      get compat() {
        return cache.compat;
      }

    }), incorrectImportAlarm);
  }

  if (isBrowser$4) {
    var currentSheet;
    var finalizingPlugins = [stringify, process.env.NODE_ENV !== 'production' ? function (element) {
      if (!element.root) {
        if (element["return"]) {
          currentSheet.insert(element["return"]);
        } else if (element.value && element.type !== COMMENT) {
          // insert empty rule in non-production environments
          // so @emotion/jest can grab `key` from the (JS)DOM for caches without any rules inserted yet
          currentSheet.insert(element.value + "{}");
        }
      }
    } : rulesheet(function (rule) {
      currentSheet.insert(rule);
    })];
    var serializer = middleware(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));

    var stylis = function stylis(styles) {
      return serialize(compile(styles), serializer);
    };

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      currentSheet = sheet;

      if (process.env.NODE_ENV !== 'production' && serialized.map !== undefined) {
        currentSheet = {
          insert: function insert(rule) {
            sheet.insert(rule + serialized.map);
          }
        };
      }

      stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);

      if (shouldCache) {
        cache.inserted[serialized.name] = true;
      }
    };
  } else {
    var _finalizingPlugins = [stringify];

    var _serializer = middleware(omnipresentPlugins.concat(stylisPlugins, _finalizingPlugins));

    var _stylis = function _stylis(styles) {
      return serialize(compile(styles), _serializer);
    }; // $FlowFixMe


    var serverStylisCache = getServerStylisCache(stylisPlugins)(key);

    var getRules = function getRules(selector, serialized) {
      var name = serialized.name;

      if (serverStylisCache[name] === undefined) {
        serverStylisCache[name] = _stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);
      }

      return serverStylisCache[name];
    };

    _insert = function _insert(selector, serialized, sheet, shouldCache) {
      var name = serialized.name;
      var rules = getRules(selector, serialized);

      if (cache.compat === undefined) {
        // in regular mode, we don't set the styles on the inserted cache
        // since we don't need to and that would be wasting memory
        // we return them so that they are rendered in a style tag
        if (shouldCache) {
          cache.inserted[name] = true;
        }

        if ( // using === development instead of !== production
        // because if people do ssr in tests, the source maps showing up would be annoying
        process.env.NODE_ENV === 'development' && serialized.map !== undefined) {
          return rules + serialized.map;
        }

        return rules;
      } else {
        // in compat mode, we put the styles on the inserted cache so
        // that emotion-server can pull out the styles
        // except when we don't want to cache it which was in Global but now
        // is nowhere but we don't want to do a major right now
        // and just in case we're going to leave the case here
        // it's also not affecting client side bundle size
        // so it's really not a big deal
        if (shouldCache) {
          cache.inserted[name] = rules;
        } else {
          return rules;
        }
      }
    };
  }

  var cache = {
    key: key,
    sheet: new StyleSheet({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy,
      prepend: options.prepend,
      insertionPoint: options.insertionPoint
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  cache.sheet.hydrate(nodesToHydrate);
  return cache;
};

var isBrowser$3 = typeof document !== 'undefined';
function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = '';
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className] + ";");
    } else {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var registerStyles = function registerStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;

  if ( // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (isStringTag === false || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  isBrowser$3 === false && cache.compat !== undefined) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }
};
var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  registerStyles(cache, serialized, isStringTag);
  var className = cache.key + "-" + serialized.name;

  if (cache.inserted[serialized.name] === undefined) {
    var stylesForSSR = '';
    var current = serialized;

    do {
      var maybeStyles = cache.insert(serialized === current ? "." + className : '', current, cache.sheet, true);

      if (!isBrowser$3 && maybeStyles !== undefined) {
        stylesForSSR += maybeStyles;
      }

      current = current.next;
    } while (current !== undefined);

    if (!isBrowser$3 && stylesForSSR.length !== 0) {
      return stylesForSSR;
    }
  }
};

/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2$1(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0; // Mix 4 bytes at a time into the hash

  var k,
      i = 0,
      len = str.length;

  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
    k ^=
    /* k >>> r: */
    k >>> 24;
    h =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Handle the last few bytes of the input array


  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.


  h ^= h >>> 13;
  h =
  /* Math.imul(h, m): */
  (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}

var unitlessKeys = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};

var ILLEGAL_ESCAPE_SEQUENCE_ERROR$2 = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";
var UNDEFINED_AS_OBJECT_KEY_ERROR$1 = "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key).";
var hyphenateRegex$1 = /[A-Z]|^ms/g;
var animationRegex$1 = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var isCustomProperty$1 = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};

var isProcessableValue$1 = function isProcessableValue(value) {
  return value != null && typeof value !== 'boolean';
};

var processStyleName$1 = /* #__PURE__ */memoize$1(function (styleName) {
  return isCustomProperty$1(styleName) ? styleName : styleName.replace(hyphenateRegex$1, '-$&').toLowerCase();
});

var processStyleValue$1 = function processStyleValue(key, value) {
  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          return value.replace(animationRegex$1, function (match, p1, p2) {
            cursor$1 = {
              name: p1,
              styles: p2,
              next: cursor$1
            };
            return p1;
          });
        }
      }
  }

  if (unitlessKeys[key] !== 1 && !isCustomProperty$1(key) && typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

if (process.env.NODE_ENV !== 'production') {
  var contentValuePattern$1 = /(var|attr|counters?|url|element|(((repeating-)?(linear|radial))|conic)-gradient)\(|(no-)?(open|close)-quote/;
  var contentValues$1 = ['normal', 'none', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue$1 = processStyleValue$1;
  var msPattern$1 = /^-ms-/;
  var hyphenPattern$1 = /-(.)/g;
  var hyphenatedCache$1 = {};

  processStyleValue$1 = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues$1.indexOf(value) === -1 && !contentValuePattern$1.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        throw new Error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    var processed = oldProcessStyleValue$1(key, value);

    if (processed !== '' && !isCustomProperty$1(key) && key.indexOf('-') !== -1 && hyphenatedCache$1[key] === undefined) {
      hyphenatedCache$1[key] = true;
      console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern$1, 'ms-').replace(hyphenPattern$1, function (str, _char) {
        return _char.toUpperCase();
      }) + "?");
    }

    return processed;
  };
}

var noComponentSelectorMessage$1 = 'Component selectors can only be used in conjunction with ' + '@emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware ' + 'compiler transform.';

function handleInterpolation$1(mergedProps, registered, interpolation) {
  if (interpolation == null) {
    return '';
  }

  if (interpolation.__emotion_styles !== undefined) {
    if (process.env.NODE_ENV !== 'production' && interpolation.toString() === 'NO_COMPONENT_SELECTOR') {
      throw new Error(noComponentSelectorMessage$1);
    }

    return interpolation;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        if (interpolation.anim === 1) {
          cursor$1 = {
            name: interpolation.name,
            styles: interpolation.styles,
            next: cursor$1
          };
          return interpolation.name;
        }

        if (interpolation.styles !== undefined) {
          var next = interpolation.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor$1 = {
                name: next.name,
                styles: next.styles,
                next: cursor$1
              };
              next = next.next;
            }
          }

          var styles = interpolation.styles + ";";

          if (process.env.NODE_ENV !== 'production' && interpolation.map !== undefined) {
            styles += interpolation.map;
          }

          return styles;
        }

        return createStringFromObject$1(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor$1;
          var result = interpolation(mergedProps);
          cursor$1 = previousCursor;
          return handleInterpolation$1(mergedProps, registered, result);
        } else if (process.env.NODE_ENV !== 'production') {
          console.error('Functions that are interpolated in css calls will be stringified.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }

        break;
      }

    case 'string':
      if (process.env.NODE_ENV !== 'production') {
        var matched = [];
        var replaced = interpolation.replace(animationRegex$1, function (match, p1, p2) {
          var fakeVarName = "animation" + matched.length;
          matched.push("const " + fakeVarName + " = keyframes`" + p2.replace(/^@keyframes animation-\w+/, '') + "`");
          return "${" + fakeVarName + "}";
        });

        if (matched.length) {
          console.error('`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\n' + 'Instead of doing this:\n\n' + [].concat(matched, ["`" + replaced + "`"]).join('\n') + '\n\nYou should wrap it with `css` like this:\n\n' + ("css`" + replaced + "`"));
        }
      }

      break;
  } // finalize string values (regular strings and functions interpolated into css calls)


  if (registered == null) {
    return interpolation;
  }

  var cached = registered[interpolation];
  return cached !== undefined ? cached : interpolation;
}

function createStringFromObject$1(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation$1(mergedProps, registered, obj[i]) + ";";
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key];

      if (typeof value !== 'object') {
        if (registered != null && registered[value] !== undefined) {
          string += _key + "{" + registered[value] + "}";
        } else if (isProcessableValue$1(value)) {
          string += processStyleName$1(_key) + ":" + processStyleValue$1(_key, value) + ";";
        }
      } else {
        if (_key === 'NO_COMPONENT_SELECTOR' && process.env.NODE_ENV !== 'production') {
          throw new Error(noComponentSelectorMessage$1);
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue$1(value[_i])) {
              string += processStyleName$1(_key) + ":" + processStyleValue$1(_key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation$1(mergedProps, registered, value);

          switch (_key) {
            case 'animation':
            case 'animationName':
              {
                string += processStyleName$1(_key) + ":" + interpolated + ";";
                break;
              }

            default:
              {
                if (process.env.NODE_ENV !== 'production' && _key === 'undefined') {
                  console.error(UNDEFINED_AS_OBJECT_KEY_ERROR$1);
                }

                string += _key + "{" + interpolated + "}";
              }
          }
        }
      }
    }
  }

  return string;
}

var labelPattern$1 = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
var sourceMapPattern$1;

if (process.env.NODE_ENV !== 'production') {
  sourceMapPattern$1 = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g;
} // this is the cursor for keyframes
// keyframes are stored on the SerializedStyles object as a linked list


var cursor$1;
var serializeStyles$1 = function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor$1 = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation$1(mergedProps, registered, strings);
  } else {
    if (process.env.NODE_ENV !== 'production' && strings[0] === undefined) {
      console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR$2);
    }

    styles += strings[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation$1(mergedProps, registered, args[i]);

    if (stringMode) {
      if (process.env.NODE_ENV !== 'production' && strings[i] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR$2);
      }

      styles += strings[i];
    }
  }

  var sourceMap;

  if (process.env.NODE_ENV !== 'production') {
    styles = styles.replace(sourceMapPattern$1, function (match) {
      sourceMap = match;
      return '';
    });
  } // using a global regex with .exec is stateful so lastIndex has to be reset each time


  labelPattern$1.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern$1.exec(styles)) !== null) {
    identifierName += '-' + // $FlowFixMe we know it's not null
    match[1];
  }

  var name = murmur2$1(styles) + identifierName;

  if (process.env.NODE_ENV !== 'production') {
    // $FlowFixMe SerializedStyles type doesn't have toString property (and we don't want to add it)
    return {
      name: name,
      styles: styles,
      map: sourceMap,
      next: cursor$1,
      toString: function toString() {
        return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
      }
    };
  }

  return {
    name: name,
    styles: styles,
    next: cursor$1
  };
};

var isBrowser$2 = typeof document !== 'undefined';
var hasOwnProperty = {}.hasOwnProperty;

var EmotionCacheContext = /* #__PURE__ */createContext( // we're doing this to avoid preconstruct's dead code elimination in this one case
// because this module is primarily intended for the browser and node
// but it's also required in react native and similar environments sometimes
// and we could have a special build just for that
// but this is much easier and the native packages
// might use a different theme context in the future anyway
typeof HTMLElement !== 'undefined' ? /* #__PURE__ */createCache({
  key: 'css'
}) : null);

if (process.env.NODE_ENV !== 'production') {
  EmotionCacheContext.displayName = 'EmotionCacheContext';
}

EmotionCacheContext.Provider;

var withEmotionCache = function withEmotionCache(func) {
  // $FlowFixMe
  return /*#__PURE__*/forwardRef(function (props, ref) {
    // the cache will never be null in the browser
    var cache = useContext(EmotionCacheContext);
    return func(props, cache, ref);
  });
};

if (!isBrowser$2) {
  withEmotionCache = function withEmotionCache(func) {
    return function (props) {
      var cache = useContext(EmotionCacheContext);

      if (cache === null) {
        // yes, we're potentially creating this on every render
        // it doesn't actually matter though since it's only on the server
        // so there will only every be a single render
        // that could change in the future because of suspense and etc. but for now,
        // this works and i don't want to optimise for a future thing that we aren't sure about
        cache = createCache({
          key: 'css'
        });
        return /*#__PURE__*/createElement$1(EmotionCacheContext.Provider, {
          value: cache
        }, func(props, cache));
      } else {
        return func(props, cache);
      }
    };
  };
}

var ThemeContext = /* #__PURE__ */createContext({});

if (process.env.NODE_ENV !== 'production') {
  ThemeContext.displayName = 'EmotionThemeContext';
}

var isBrowser$1$1 = typeof document !== 'undefined';
var useInsertionEffect$1 = React['useInsertion' + 'Effect'] ? React['useInsertion' + 'Effect'] : function useInsertionEffect(create) {
  create();
};
function useInsertionEffectMaybe$1(create) {
  if (!isBrowser$1$1) {
    return create();
  }

  useInsertionEffect$1(create);
}

var typePropName = '__EMOTION_TYPE_PLEASE_DO_NOT_USE__';
var labelPropName = '__EMOTION_LABEL_PLEASE_DO_NOT_USE__';

var Insertion$1 = function Insertion(_ref) {
  var cache = _ref.cache,
      serialized = _ref.serialized,
      isStringTag = _ref.isStringTag;
  registerStyles(cache, serialized, isStringTag);
  var rules = useInsertionEffectMaybe$1(function () {
    return insertStyles(cache, serialized, isStringTag);
  });

  if (!isBrowser$2 && rules !== undefined) {
    var _ref2;

    var serializedNames = serialized.name;
    var next = serialized.next;

    while (next !== undefined) {
      serializedNames += ' ' + next.name;
      next = next.next;
    }

    return /*#__PURE__*/createElement$1("style", (_ref2 = {}, _ref2["data-emotion"] = cache.key + " " + serializedNames, _ref2.dangerouslySetInnerHTML = {
      __html: rules
    }, _ref2.nonce = cache.sheet.nonce, _ref2));
  }

  return null;
};

var Emotion = /* #__PURE__ */withEmotionCache(function (props, cache, ref) {
  var cssProp = props.css; // so that using `css` from `emotion` and passing the result to the css prop works
  // not passing the registered cache to serializeStyles because it would
  // make certain babel optimisations not possible

  if (typeof cssProp === 'string' && cache.registered[cssProp] !== undefined) {
    cssProp = cache.registered[cssProp];
  }

  var WrappedComponent = props[typePropName];
  var registeredStyles = [cssProp];
  var className = '';

  if (typeof props.className === 'string') {
    className = getRegisteredStyles(cache.registered, registeredStyles, props.className);
  } else if (props.className != null) {
    className = props.className + " ";
  }

  var serialized = serializeStyles$1(registeredStyles, undefined, useContext(ThemeContext));

  if (process.env.NODE_ENV !== 'production' && serialized.name.indexOf('-') === -1) {
    var labelFromStack = props[labelPropName];

    if (labelFromStack) {
      serialized = serializeStyles$1([serialized, 'label:' + labelFromStack + ';']);
    }
  }

  className += cache.key + "-" + serialized.name;
  var newProps = {};

  for (var key in props) {
    if (hasOwnProperty.call(props, key) && key !== 'css' && key !== typePropName && (process.env.NODE_ENV === 'production' || key !== labelPropName)) {
      newProps[key] = props[key];
    }
  }

  newProps.ref = ref;
  newProps.className = className;
  return /*#__PURE__*/createElement$1(Fragment, null, /*#__PURE__*/createElement$1(Insertion$1, {
    cache: cache,
    serialized: serialized,
    isStringTag: typeof WrappedComponent === 'string'
  }), /*#__PURE__*/createElement$1(WrappedComponent, newProps));
});

if (process.env.NODE_ENV !== 'production') {
  Emotion.displayName = 'EmotionCssPropInternal';
}

/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0; // Mix 4 bytes at a time into the hash

  var k,
      i = 0,
      len = str.length;

  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
    k ^=
    /* k >>> r: */
    k >>> 24;
    h =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Handle the last few bytes of the input array


  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.


  h ^= h >>> 13;
  h =
  /* Math.imul(h, m): */
  (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}

var ILLEGAL_ESCAPE_SEQUENCE_ERROR$1 = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";
var UNDEFINED_AS_OBJECT_KEY_ERROR = "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key).";
var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var isCustomProperty = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};

var isProcessableValue = function isProcessableValue(value) {
  return value != null && typeof value !== 'boolean';
};

var processStyleName = /* #__PURE__ */memoize$1(function (styleName) {
  return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          return value.replace(animationRegex, function (match, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
  }

  if (unitlessKeys[key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

if (process.env.NODE_ENV !== 'production') {
  var contentValuePattern = /(var|attr|counters?|url|element|(((repeating-)?(linear|radial))|conic)-gradient)\(|(no-)?(open|close)-quote/;
  var contentValues = ['normal', 'none', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue = processStyleValue;
  var msPattern = /^-ms-/;
  var hyphenPattern = /-(.)/g;
  var hyphenatedCache = {};

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        throw new Error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    var processed = oldProcessStyleValue(key, value);

    if (processed !== '' && !isCustomProperty(key) && key.indexOf('-') !== -1 && hyphenatedCache[key] === undefined) {
      hyphenatedCache[key] = true;
      console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern, 'ms-').replace(hyphenPattern, function (str, _char) {
        return _char.toUpperCase();
      }) + "?");
    }

    return processed;
  };
}

var noComponentSelectorMessage = 'Component selectors can only be used in conjunction with ' + '@emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware ' + 'compiler transform.';

function handleInterpolation(mergedProps, registered, interpolation) {
  if (interpolation == null) {
    return '';
  }

  if (interpolation.__emotion_styles !== undefined) {
    if (process.env.NODE_ENV !== 'production' && interpolation.toString() === 'NO_COMPONENT_SELECTOR') {
      throw new Error(noComponentSelectorMessage);
    }

    return interpolation;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        if (interpolation.anim === 1) {
          cursor = {
            name: interpolation.name,
            styles: interpolation.styles,
            next: cursor
          };
          return interpolation.name;
        }

        if (interpolation.styles !== undefined) {
          var next = interpolation.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor = {
                name: next.name,
                styles: next.styles,
                next: cursor
              };
              next = next.next;
            }
          }

          var styles = interpolation.styles + ";";

          if (process.env.NODE_ENV !== 'production' && interpolation.map !== undefined) {
            styles += interpolation.map;
          }

          return styles;
        }

        return createStringFromObject(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result);
        } else if (process.env.NODE_ENV !== 'production') {
          console.error('Functions that are interpolated in css calls will be stringified.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }

        break;
      }

    case 'string':
      if (process.env.NODE_ENV !== 'production') {
        var matched = [];
        var replaced = interpolation.replace(animationRegex, function (match, p1, p2) {
          var fakeVarName = "animation" + matched.length;
          matched.push("const " + fakeVarName + " = keyframes`" + p2.replace(/^@keyframes animation-\w+/, '') + "`");
          return "${" + fakeVarName + "}";
        });

        if (matched.length) {
          console.error('`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\n' + 'Instead of doing this:\n\n' + [].concat(matched, ["`" + replaced + "`"]).join('\n') + '\n\nYou should wrap it with `css` like this:\n\n' + ("css`" + replaced + "`"));
        }
      }

      break;
  } // finalize string values (regular strings and functions interpolated into css calls)


  if (registered == null) {
    return interpolation;
  }

  var cached = registered[interpolation];
  return cached !== undefined ? cached : interpolation;
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key];

      if (typeof value !== 'object') {
        if (registered != null && registered[value] !== undefined) {
          string += _key + "{" + registered[value] + "}";
        } else if (isProcessableValue(value)) {
          string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
        }
      } else {
        if (_key === 'NO_COMPONENT_SELECTOR' && process.env.NODE_ENV !== 'production') {
          throw new Error(noComponentSelectorMessage);
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value);

          switch (_key) {
            case 'animation':
            case 'animationName':
              {
                string += processStyleName(_key) + ":" + interpolated + ";";
                break;
              }

            default:
              {
                if (process.env.NODE_ENV !== 'production' && _key === 'undefined') {
                  console.error(UNDEFINED_AS_OBJECT_KEY_ERROR);
                }

                string += _key + "{" + interpolated + "}";
              }
          }
        }
      }
    }
  }

  return string;
}

var labelPattern = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
var sourceMapPattern;

if (process.env.NODE_ENV !== 'production') {
  sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g;
} // this is the cursor for keyframes
// keyframes are stored on the SerializedStyles object as a linked list


var cursor;
var serializeStyles = function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings);
  } else {
    if (process.env.NODE_ENV !== 'production' && strings[0] === undefined) {
      console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR$1);
    }

    styles += strings[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i]);

    if (stringMode) {
      if (process.env.NODE_ENV !== 'production' && strings[i] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR$1);
      }

      styles += strings[i];
    }
  }

  var sourceMap;

  if (process.env.NODE_ENV !== 'production') {
    styles = styles.replace(sourceMapPattern, function (match) {
      sourceMap = match;
      return '';
    });
  } // using a global regex with .exec is stateful so lastIndex has to be reset each time


  labelPattern.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += '-' + // $FlowFixMe we know it's not null
    match[1];
  }

  var name = murmur2(styles) + identifierName;

  if (process.env.NODE_ENV !== 'production') {
    // $FlowFixMe SerializedStyles type doesn't have toString property (and we don't want to add it)
    return {
      name: name,
      styles: styles,
      map: sourceMap,
      next: cursor,
      toString: function toString() {
        return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
      }
    };
  }

  return {
    name: name,
    styles: styles,
    next: cursor
  };
};

var testOmitPropsOnStringTag = isPropValid;

var testOmitPropsOnComponent = function testOmitPropsOnComponent(key) {
  return key !== 'theme';
};

var getDefaultShouldForwardProp = function getDefaultShouldForwardProp(tag) {
  return typeof tag === 'string' && // 96 is one less than the char code
  // for "a" so this is checking that
  // it's a lowercase character
  tag.charCodeAt(0) > 96 ? testOmitPropsOnStringTag : testOmitPropsOnComponent;
};
var composeShouldForwardProps = function composeShouldForwardProps(tag, options, isReal) {
  var shouldForwardProp;

  if (options) {
    var optionsShouldForwardProp = options.shouldForwardProp;
    shouldForwardProp = tag.__emotion_forwardProp && optionsShouldForwardProp ? function (propName) {
      return tag.__emotion_forwardProp(propName) && optionsShouldForwardProp(propName);
    } : optionsShouldForwardProp;
  }

  if (typeof shouldForwardProp !== 'function' && isReal) {
    shouldForwardProp = tag.__emotion_forwardProp;
  }

  return shouldForwardProp;
};

var isBrowser = typeof document !== 'undefined';
var useInsertionEffect = React['useInsertion' + 'Effect'] ? React['useInsertion' + 'Effect'] : function useInsertionEffect(create) {
  create();
};
function useInsertionEffectMaybe(create) {
  if (!isBrowser) {
    return create();
  }

  useInsertionEffect(create);
}

var ILLEGAL_ESCAPE_SEQUENCE_ERROR = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";
var isBrowser$1 = typeof document !== 'undefined';

var Insertion = function Insertion(_ref) {
  var cache = _ref.cache,
      serialized = _ref.serialized,
      isStringTag = _ref.isStringTag;
  registerStyles(cache, serialized, isStringTag);
  var rules = useInsertionEffectMaybe(function () {
    return insertStyles(cache, serialized, isStringTag);
  });

  if (!isBrowser$1 && rules !== undefined) {
    var _ref2;

    var serializedNames = serialized.name;
    var next = serialized.next;

    while (next !== undefined) {
      serializedNames += ' ' + next.name;
      next = next.next;
    }

    return /*#__PURE__*/createElement$1("style", (_ref2 = {}, _ref2["data-emotion"] = cache.key + " " + serializedNames, _ref2.dangerouslySetInnerHTML = {
      __html: rules
    }, _ref2.nonce = cache.sheet.nonce, _ref2));
  }

  return null;
};

var createStyled = function createStyled(tag, options) {
  if (process.env.NODE_ENV !== 'production') {
    if (tag === undefined) {
      throw new Error('You are trying to create a styled element with an undefined component.\nYou may have forgotten to import it.');
    }
  }

  var isReal = tag.__emotion_real === tag;
  var baseTag = isReal && tag.__emotion_base || tag;
  var identifierName;
  var targetClassName;

  if (options !== undefined) {
    identifierName = options.label;
    targetClassName = options.target;
  }

  var shouldForwardProp = composeShouldForwardProps(tag, options, isReal);
  var defaultShouldForwardProp = shouldForwardProp || getDefaultShouldForwardProp(baseTag);
  var shouldUseAs = !defaultShouldForwardProp('as');
  return function () {
    var args = arguments;
    var styles = isReal && tag.__emotion_styles !== undefined ? tag.__emotion_styles.slice(0) : [];

    if (identifierName !== undefined) {
      styles.push("label:" + identifierName + ";");
    }

    if (args[0] == null || args[0].raw === undefined) {
      styles.push.apply(styles, args);
    } else {
      if (process.env.NODE_ENV !== 'production' && args[0][0] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }

      styles.push(args[0][0]);
      var len = args.length;
      var i = 1;

      for (; i < len; i++) {
        if (process.env.NODE_ENV !== 'production' && args[0][i] === undefined) {
          console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
        }

        styles.push(args[i], args[0][i]);
      }
    } // $FlowFixMe: we need to cast StatelessFunctionalComponent to our PrivateStyledComponent class


    var Styled = withEmotionCache(function (props, cache, ref) {
      var FinalTag = shouldUseAs && props.as || baseTag;
      var className = '';
      var classInterpolations = [];
      var mergedProps = props;

      if (props.theme == null) {
        mergedProps = {};

        for (var key in props) {
          mergedProps[key] = props[key];
        }

        mergedProps.theme = useContext(ThemeContext);
      }

      if (typeof props.className === 'string') {
        className = getRegisteredStyles(cache.registered, classInterpolations, props.className);
      } else if (props.className != null) {
        className = props.className + " ";
      }

      var serialized = serializeStyles(styles.concat(classInterpolations), cache.registered, mergedProps);
      className += cache.key + "-" + serialized.name;

      if (targetClassName !== undefined) {
        className += " " + targetClassName;
      }

      var finalShouldForwardProp = shouldUseAs && shouldForwardProp === undefined ? getDefaultShouldForwardProp(FinalTag) : defaultShouldForwardProp;
      var newProps = {};

      for (var _key in props) {
        if (shouldUseAs && _key === 'as') continue;

        if ( // $FlowFixMe
        finalShouldForwardProp(_key)) {
          newProps[_key] = props[_key];
        }
      }

      newProps.className = className;
      newProps.ref = ref;
      return /*#__PURE__*/createElement$1(Fragment, null, /*#__PURE__*/createElement$1(Insertion, {
        cache: cache,
        serialized: serialized,
        isStringTag: typeof FinalTag === 'string'
      }), /*#__PURE__*/createElement$1(FinalTag, newProps));
    });
    Styled.displayName = identifierName !== undefined ? identifierName : "Styled(" + (typeof baseTag === 'string' ? baseTag : baseTag.displayName || baseTag.name || 'Component') + ")";
    Styled.defaultProps = tag.defaultProps;
    Styled.__emotion_real = Styled;
    Styled.__emotion_base = baseTag;
    Styled.__emotion_styles = styles;
    Styled.__emotion_forwardProp = shouldForwardProp;
    Object.defineProperty(Styled, 'toString', {
      value: function value() {
        if (targetClassName === undefined && process.env.NODE_ENV !== 'production') {
          return 'NO_COMPONENT_SELECTOR';
        } // $FlowFixMe: coerce undefined to string


        return "." + targetClassName;
      }
    });

    Styled.withComponent = function (nextTag, nextOptions) {
      return createStyled(nextTag, _extends({}, options, nextOptions, {
        shouldForwardProp: composeShouldForwardProps(Styled, nextOptions, true)
      })).apply(void 0, styles);
    };

    return Styled;
  };
};

var tags = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', // SVG
'circle', 'clipPath', 'defs', 'ellipse', 'foreignObject', 'g', 'image', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'];

var newStyled = createStyled.bind();
tags.forEach(function (tagName) {
  // $FlowFixMe: we can ignore this because its exposed type is defined by the CreateStyled type
  newStyled[tagName] = newStyled(tagName);
});

var emStyled = newStyled;

/**
 * @mui/styled-engine v5.13.2
 *
 * @license MIT
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function styled(tag, options) {
  const stylesFactory = emStyled(tag, options);
  if (process.env.NODE_ENV !== 'production') {
    return (...styles) => {
      const component = typeof tag === 'string' ? `"${tag}"` : 'component';
      if (styles.length === 0) {
        console.error([`MUI: Seems like you called \`styled(${component})()\` without a \`style\` argument.`, 'You must provide a `styles` argument: `styled("div")(styleYouForgotToPass)`.'].join('\n'));
      } else if (styles.some(style => style === undefined)) {
        console.error(`MUI: the styled(${component})(...args) API requires all its args to be defined.`);
      }
      return stylesFactory(...styles);
    };
  }
  return stylesFactory;
}

const _excluded$3 = ["values", "unit", "step"];
const sortBreakpointsValues = values => {
  const breakpointsAsArray = Object.keys(values).map(key => ({
    key,
    val: values[key]
  })) || [];
  // Sort in ascending order
  breakpointsAsArray.sort((breakpoint1, breakpoint2) => breakpoint1.val - breakpoint2.val);
  return breakpointsAsArray.reduce((acc, obj) => {
    return _extends({}, acc, {
      [obj.key]: obj.val
    });
  }, {});
};

// Keep in mind that @media is inclusive by the CSS specification.
function createBreakpoints(breakpoints) {
  const {
      // The breakpoint **start** at this value.
      // For instance with the first breakpoint xs: [xs, sm).
      values = {
        xs: 0,
        // phone
        sm: 600,
        // tablet
        md: 900,
        // small laptop
        lg: 1200,
        // desktop
        xl: 1536 // large screen
      },

      unit = 'px',
      step = 5
    } = breakpoints,
    other = _objectWithoutPropertiesLoose(breakpoints, _excluded$3);
  const sortedValues = sortBreakpointsValues(values);
  const keys = Object.keys(sortedValues);
  function up(key) {
    const value = typeof values[key] === 'number' ? values[key] : key;
    return `@media (min-width:${value}${unit})`;
  }
  function down(key) {
    const value = typeof values[key] === 'number' ? values[key] : key;
    return `@media (max-width:${value - step / 100}${unit})`;
  }
  function between(start, end) {
    const endIndex = keys.indexOf(end);
    return `@media (min-width:${typeof values[start] === 'number' ? values[start] : start}${unit}) and ` + `(max-width:${(endIndex !== -1 && typeof values[keys[endIndex]] === 'number' ? values[keys[endIndex]] : end) - step / 100}${unit})`;
  }
  function only(key) {
    if (keys.indexOf(key) + 1 < keys.length) {
      return between(key, keys[keys.indexOf(key) + 1]);
    }
    return up(key);
  }
  function not(key) {
    // handle first and last key separately, for better readability
    const keyIndex = keys.indexOf(key);
    if (keyIndex === 0) {
      return up(keys[1]);
    }
    if (keyIndex === keys.length - 1) {
      return down(keys[keyIndex]);
    }
    return between(key, keys[keys.indexOf(key) + 1]).replace('@media', '@media not all and');
  }
  return _extends({
    keys,
    values: sortedValues,
    up,
    down,
    between,
    only,
    not,
    unit
  }, other);
}

const shape = {
  borderRadius: 4
};
var shape$1 = shape;

const responsivePropType = process.env.NODE_ENV !== 'production' ? PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object, PropTypes.array]) : {};
var responsivePropType$1 = responsivePropType;

function merge(acc, item) {
  if (!item) {
    return acc;
  }
  return deepmerge(acc, item, {
    clone: false // No need to clone deep, it's way faster.
  });
}

// The breakpoint **start** at this value.
// For instance with the first breakpoint xs: [xs, sm[.
const values$1 = {
  xs: 0,
  // phone
  sm: 600,
  // tablet
  md: 900,
  // small laptop
  lg: 1200,
  // desktop
  xl: 1536 // large screen
};

const defaultBreakpoints = {
  // Sorted ASC by size. That's important.
  // It can't be configured as it's used statically for propTypes.
  keys: ['xs', 'sm', 'md', 'lg', 'xl'],
  up: key => `@media (min-width:${values$1[key]}px)`
};
function handleBreakpoints(props, propValue, styleFromPropValue) {
  const theme = props.theme || {};
  if (Array.isArray(propValue)) {
    const themeBreakpoints = theme.breakpoints || defaultBreakpoints;
    return propValue.reduce((acc, item, index) => {
      acc[themeBreakpoints.up(themeBreakpoints.keys[index])] = styleFromPropValue(propValue[index]);
      return acc;
    }, {});
  }
  if (typeof propValue === 'object') {
    const themeBreakpoints = theme.breakpoints || defaultBreakpoints;
    return Object.keys(propValue).reduce((acc, breakpoint) => {
      // key is breakpoint
      if (Object.keys(themeBreakpoints.values || values$1).indexOf(breakpoint) !== -1) {
        const mediaKey = themeBreakpoints.up(breakpoint);
        acc[mediaKey] = styleFromPropValue(propValue[breakpoint], breakpoint);
      } else {
        const cssKey = breakpoint;
        acc[cssKey] = propValue[cssKey];
      }
      return acc;
    }, {});
  }
  const output = styleFromPropValue(propValue);
  return output;
}
function createEmptyBreakpointObject(breakpointsInput = {}) {
  var _breakpointsInput$key;
  const breakpointsInOrder = (_breakpointsInput$key = breakpointsInput.keys) == null ? void 0 : _breakpointsInput$key.reduce((acc, key) => {
    const breakpointStyleKey = breakpointsInput.up(key);
    acc[breakpointStyleKey] = {};
    return acc;
  }, {});
  return breakpointsInOrder || {};
}
function removeUnusedBreakpoints(breakpointKeys, style) {
  return breakpointKeys.reduce((acc, key) => {
    const breakpointOutput = acc[key];
    const isBreakpointUnused = !breakpointOutput || Object.keys(breakpointOutput).length === 0;
    if (isBreakpointUnused) {
      delete acc[key];
    }
    return acc;
  }, style);
}

function getPath(obj, path, checkVars = true) {
  if (!path || typeof path !== 'string') {
    return null;
  }

  // Check if CSS variables are used
  if (obj && obj.vars && checkVars) {
    const val = `vars.${path}`.split('.').reduce((acc, item) => acc && acc[item] ? acc[item] : null, obj);
    if (val != null) {
      return val;
    }
  }
  return path.split('.').reduce((acc, item) => {
    if (acc && acc[item] != null) {
      return acc[item];
    }
    return null;
  }, obj);
}
function getStyleValue(themeMapping, transform, propValueFinal, userValue = propValueFinal) {
  let value;
  if (typeof themeMapping === 'function') {
    value = themeMapping(propValueFinal);
  } else if (Array.isArray(themeMapping)) {
    value = themeMapping[propValueFinal] || userValue;
  } else {
    value = getPath(themeMapping, propValueFinal) || userValue;
  }
  if (transform) {
    value = transform(value, userValue, themeMapping);
  }
  return value;
}
function style$1(options) {
  const {
    prop,
    cssProperty = options.prop,
    themeKey,
    transform
  } = options;

  // false positive
  // eslint-disable-next-line react/function-component-definition
  const fn = props => {
    if (props[prop] == null) {
      return null;
    }
    const propValue = props[prop];
    const theme = props.theme;
    const themeMapping = getPath(theme, themeKey) || {};
    const styleFromPropValue = propValueFinal => {
      let value = getStyleValue(themeMapping, transform, propValueFinal);
      if (propValueFinal === value && typeof propValueFinal === 'string') {
        // Haven't found value
        value = getStyleValue(themeMapping, transform, `${prop}${propValueFinal === 'default' ? '' : capitalize(propValueFinal)}`, propValueFinal);
      }
      if (cssProperty === false) {
        return value;
      }
      return {
        [cssProperty]: value
      };
    };
    return handleBreakpoints(props, propValue, styleFromPropValue);
  };
  fn.propTypes = process.env.NODE_ENV !== 'production' ? {
    [prop]: responsivePropType$1
  } : {};
  fn.filterProps = [prop];
  return fn;
}

function memoize(fn) {
  const cache = {};
  return arg => {
    if (cache[arg] === undefined) {
      cache[arg] = fn(arg);
    }
    return cache[arg];
  };
}

const properties = {
  m: 'margin',
  p: 'padding'
};
const directions = {
  t: 'Top',
  r: 'Right',
  b: 'Bottom',
  l: 'Left',
  x: ['Left', 'Right'],
  y: ['Top', 'Bottom']
};
const aliases = {
  marginX: 'mx',
  marginY: 'my',
  paddingX: 'px',
  paddingY: 'py'
};

// memoize() impact:
// From 300,000 ops/sec
// To 350,000 ops/sec
const getCssProperties = memoize(prop => {
  // It's not a shorthand notation.
  if (prop.length > 2) {
    if (aliases[prop]) {
      prop = aliases[prop];
    } else {
      return [prop];
    }
  }
  const [a, b] = prop.split('');
  const property = properties[a];
  const direction = directions[b] || '';
  return Array.isArray(direction) ? direction.map(dir => property + dir) : [property + direction];
});
const marginKeys = ['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my', 'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'marginX', 'marginY', 'marginInline', 'marginInlineStart', 'marginInlineEnd', 'marginBlock', 'marginBlockStart', 'marginBlockEnd'];
const paddingKeys = ['p', 'pt', 'pr', 'pb', 'pl', 'px', 'py', 'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'paddingX', 'paddingY', 'paddingInline', 'paddingInlineStart', 'paddingInlineEnd', 'paddingBlock', 'paddingBlockStart', 'paddingBlockEnd'];
const spacingKeys = [...marginKeys, ...paddingKeys];
function createUnaryUnit(theme, themeKey, defaultValue, propName) {
  var _getPath;
  const themeSpacing = (_getPath = getPath(theme, themeKey, false)) != null ? _getPath : defaultValue;
  if (typeof themeSpacing === 'number') {
    return abs => {
      if (typeof abs === 'string') {
        return abs;
      }
      if (process.env.NODE_ENV !== 'production') {
        if (typeof abs !== 'number') {
          console.error(`MUI: Expected ${propName} argument to be a number or a string, got ${abs}.`);
        }
      }
      return themeSpacing * abs;
    };
  }
  if (Array.isArray(themeSpacing)) {
    return abs => {
      if (typeof abs === 'string') {
        return abs;
      }
      if (process.env.NODE_ENV !== 'production') {
        if (!Number.isInteger(abs)) {
          console.error([`MUI: The \`theme.${themeKey}\` array type cannot be combined with non integer values.` + `You should either use an integer value that can be used as index, or define the \`theme.${themeKey}\` as a number.`].join('\n'));
        } else if (abs > themeSpacing.length - 1) {
          console.error([`MUI: The value provided (${abs}) overflows.`, `The supported values are: ${JSON.stringify(themeSpacing)}.`, `${abs} > ${themeSpacing.length - 1}, you need to add the missing values.`].join('\n'));
        }
      }
      return themeSpacing[abs];
    };
  }
  if (typeof themeSpacing === 'function') {
    return themeSpacing;
  }
  if (process.env.NODE_ENV !== 'production') {
    console.error([`MUI: The \`theme.${themeKey}\` value (${themeSpacing}) is invalid.`, 'It should be a number, an array or a function.'].join('\n'));
  }
  return () => undefined;
}
function createUnarySpacing(theme) {
  return createUnaryUnit(theme, 'spacing', 8, 'spacing');
}
function getValue(transformer, propValue) {
  if (typeof propValue === 'string' || propValue == null) {
    return propValue;
  }
  const abs = Math.abs(propValue);
  const transformed = transformer(abs);
  if (propValue >= 0) {
    return transformed;
  }
  if (typeof transformed === 'number') {
    return -transformed;
  }
  return `-${transformed}`;
}
function getStyleFromPropValue(cssProperties, transformer) {
  return propValue => cssProperties.reduce((acc, cssProperty) => {
    acc[cssProperty] = getValue(transformer, propValue);
    return acc;
  }, {});
}
function resolveCssProperty(props, keys, prop, transformer) {
  // Using a hash computation over an array iteration could be faster, but with only 28 items,
  // it's doesn't worth the bundle size.
  if (keys.indexOf(prop) === -1) {
    return null;
  }
  const cssProperties = getCssProperties(prop);
  const styleFromPropValue = getStyleFromPropValue(cssProperties, transformer);
  const propValue = props[prop];
  return handleBreakpoints(props, propValue, styleFromPropValue);
}
function style(props, keys) {
  const transformer = createUnarySpacing(props.theme);
  return Object.keys(props).map(prop => resolveCssProperty(props, keys, prop, transformer)).reduce(merge, {});
}
function margin(props) {
  return style(props, marginKeys);
}
margin.propTypes = process.env.NODE_ENV !== 'production' ? marginKeys.reduce((obj, key) => {
  obj[key] = responsivePropType$1;
  return obj;
}, {}) : {};
margin.filterProps = marginKeys;
function padding(props) {
  return style(props, paddingKeys);
}
padding.propTypes = process.env.NODE_ENV !== 'production' ? paddingKeys.reduce((obj, key) => {
  obj[key] = responsivePropType$1;
  return obj;
}, {}) : {};
padding.filterProps = paddingKeys;
process.env.NODE_ENV !== 'production' ? spacingKeys.reduce((obj, key) => {
  obj[key] = responsivePropType$1;
  return obj;
}, {}) : {};

// The different signatures imply different meaning for their arguments that can't be expressed structurally.
// We express the difference with variable names.
/* tslint:disable:unified-signatures */
/* tslint:enable:unified-signatures */

function createSpacing(spacingInput = 8) {
  // Already transformed.
  if (spacingInput.mui) {
    return spacingInput;
  }

  // Material Design layouts are visually balanced. Most measurements align to an 8dp grid, which aligns both spacing and the overall layout.
  // Smaller components, such as icons, can align to a 4dp grid.
  // https://m2.material.io/design/layout/understanding-layout.html
  const transform = createUnarySpacing({
    spacing: spacingInput
  });
  const spacing = (...argsInput) => {
    if (process.env.NODE_ENV !== 'production') {
      if (!(argsInput.length <= 4)) {
        console.error(`MUI: Too many arguments provided, expected between 0 and 4, got ${argsInput.length}`);
      }
    }
    const args = argsInput.length === 0 ? [1] : argsInput;
    return args.map(argument => {
      const output = transform(argument);
      return typeof output === 'number' ? `${output}px` : output;
    }).join(' ');
  };
  spacing.mui = true;
  return spacing;
}

function compose(...styles) {
  const handlers = styles.reduce((acc, style) => {
    style.filterProps.forEach(prop => {
      acc[prop] = style;
    });
    return acc;
  }, {});

  // false positive
  // eslint-disable-next-line react/function-component-definition
  const fn = props => {
    return Object.keys(props).reduce((acc, prop) => {
      if (handlers[prop]) {
        return merge(acc, handlers[prop](props));
      }
      return acc;
    }, {});
  };
  fn.propTypes = process.env.NODE_ENV !== 'production' ? styles.reduce((acc, style) => Object.assign(acc, style.propTypes), {}) : {};
  fn.filterProps = styles.reduce((acc, style) => acc.concat(style.filterProps), []);
  return fn;
}

function borderTransform(value) {
  if (typeof value !== 'number') {
    return value;
  }
  return `${value}px solid`;
}
const border = style$1({
  prop: 'border',
  themeKey: 'borders',
  transform: borderTransform
});
const borderTop = style$1({
  prop: 'borderTop',
  themeKey: 'borders',
  transform: borderTransform
});
const borderRight = style$1({
  prop: 'borderRight',
  themeKey: 'borders',
  transform: borderTransform
});
const borderBottom = style$1({
  prop: 'borderBottom',
  themeKey: 'borders',
  transform: borderTransform
});
const borderLeft = style$1({
  prop: 'borderLeft',
  themeKey: 'borders',
  transform: borderTransform
});
const borderColor = style$1({
  prop: 'borderColor',
  themeKey: 'palette'
});
const borderTopColor = style$1({
  prop: 'borderTopColor',
  themeKey: 'palette'
});
const borderRightColor = style$1({
  prop: 'borderRightColor',
  themeKey: 'palette'
});
const borderBottomColor = style$1({
  prop: 'borderBottomColor',
  themeKey: 'palette'
});
const borderLeftColor = style$1({
  prop: 'borderLeftColor',
  themeKey: 'palette'
});

// false positive
// eslint-disable-next-line react/function-component-definition
const borderRadius = props => {
  if (props.borderRadius !== undefined && props.borderRadius !== null) {
    const transformer = createUnaryUnit(props.theme, 'shape.borderRadius', 4, 'borderRadius');
    const styleFromPropValue = propValue => ({
      borderRadius: getValue(transformer, propValue)
    });
    return handleBreakpoints(props, props.borderRadius, styleFromPropValue);
  }
  return null;
};
borderRadius.propTypes = process.env.NODE_ENV !== 'production' ? {
  borderRadius: responsivePropType$1
} : {};
borderRadius.filterProps = ['borderRadius'];
compose(border, borderTop, borderRight, borderBottom, borderLeft, borderColor, borderTopColor, borderRightColor, borderBottomColor, borderLeftColor, borderRadius);

// false positive
// eslint-disable-next-line react/function-component-definition
const gap = props => {
  if (props.gap !== undefined && props.gap !== null) {
    const transformer = createUnaryUnit(props.theme, 'spacing', 8, 'gap');
    const styleFromPropValue = propValue => ({
      gap: getValue(transformer, propValue)
    });
    return handleBreakpoints(props, props.gap, styleFromPropValue);
  }
  return null;
};
gap.propTypes = process.env.NODE_ENV !== 'production' ? {
  gap: responsivePropType$1
} : {};
gap.filterProps = ['gap'];

// false positive
// eslint-disable-next-line react/function-component-definition
const columnGap = props => {
  if (props.columnGap !== undefined && props.columnGap !== null) {
    const transformer = createUnaryUnit(props.theme, 'spacing', 8, 'columnGap');
    const styleFromPropValue = propValue => ({
      columnGap: getValue(transformer, propValue)
    });
    return handleBreakpoints(props, props.columnGap, styleFromPropValue);
  }
  return null;
};
columnGap.propTypes = process.env.NODE_ENV !== 'production' ? {
  columnGap: responsivePropType$1
} : {};
columnGap.filterProps = ['columnGap'];

// false positive
// eslint-disable-next-line react/function-component-definition
const rowGap = props => {
  if (props.rowGap !== undefined && props.rowGap !== null) {
    const transformer = createUnaryUnit(props.theme, 'spacing', 8, 'rowGap');
    const styleFromPropValue = propValue => ({
      rowGap: getValue(transformer, propValue)
    });
    return handleBreakpoints(props, props.rowGap, styleFromPropValue);
  }
  return null;
};
rowGap.propTypes = process.env.NODE_ENV !== 'production' ? {
  rowGap: responsivePropType$1
} : {};
rowGap.filterProps = ['rowGap'];
const gridColumn = style$1({
  prop: 'gridColumn'
});
const gridRow = style$1({
  prop: 'gridRow'
});
const gridAutoFlow = style$1({
  prop: 'gridAutoFlow'
});
const gridAutoColumns = style$1({
  prop: 'gridAutoColumns'
});
const gridAutoRows = style$1({
  prop: 'gridAutoRows'
});
const gridTemplateColumns = style$1({
  prop: 'gridTemplateColumns'
});
const gridTemplateRows = style$1({
  prop: 'gridTemplateRows'
});
const gridTemplateAreas = style$1({
  prop: 'gridTemplateAreas'
});
const gridArea = style$1({
  prop: 'gridArea'
});
compose(gap, columnGap, rowGap, gridColumn, gridRow, gridAutoFlow, gridAutoColumns, gridAutoRows, gridTemplateColumns, gridTemplateRows, gridTemplateAreas, gridArea);

function paletteTransform(value, userValue) {
  if (userValue === 'grey') {
    return userValue;
  }
  return value;
}
const color = style$1({
  prop: 'color',
  themeKey: 'palette',
  transform: paletteTransform
});
const bgcolor = style$1({
  prop: 'bgcolor',
  cssProperty: 'backgroundColor',
  themeKey: 'palette',
  transform: paletteTransform
});
const backgroundColor = style$1({
  prop: 'backgroundColor',
  themeKey: 'palette',
  transform: paletteTransform
});
compose(color, bgcolor, backgroundColor);

function sizingTransform(value) {
  return value <= 1 && value !== 0 ? `${value * 100}%` : value;
}
const width = style$1({
  prop: 'width',
  transform: sizingTransform
});
const maxWidth = props => {
  if (props.maxWidth !== undefined && props.maxWidth !== null) {
    const styleFromPropValue = propValue => {
      var _props$theme, _props$theme$breakpoi, _props$theme$breakpoi2;
      const breakpoint = ((_props$theme = props.theme) == null ? void 0 : (_props$theme$breakpoi = _props$theme.breakpoints) == null ? void 0 : (_props$theme$breakpoi2 = _props$theme$breakpoi.values) == null ? void 0 : _props$theme$breakpoi2[propValue]) || values$1[propValue];
      return {
        maxWidth: breakpoint || sizingTransform(propValue)
      };
    };
    return handleBreakpoints(props, props.maxWidth, styleFromPropValue);
  }
  return null;
};
maxWidth.filterProps = ['maxWidth'];
const minWidth = style$1({
  prop: 'minWidth',
  transform: sizingTransform
});
const height = style$1({
  prop: 'height',
  transform: sizingTransform
});
const maxHeight = style$1({
  prop: 'maxHeight',
  transform: sizingTransform
});
const minHeight = style$1({
  prop: 'minHeight',
  transform: sizingTransform
});
style$1({
  prop: 'size',
  cssProperty: 'width',
  transform: sizingTransform
});
style$1({
  prop: 'size',
  cssProperty: 'height',
  transform: sizingTransform
});
const boxSizing = style$1({
  prop: 'boxSizing'
});
compose(width, maxWidth, minWidth, height, maxHeight, minHeight, boxSizing);

const defaultSxConfig = {
  // borders
  border: {
    themeKey: 'borders',
    transform: borderTransform
  },
  borderTop: {
    themeKey: 'borders',
    transform: borderTransform
  },
  borderRight: {
    themeKey: 'borders',
    transform: borderTransform
  },
  borderBottom: {
    themeKey: 'borders',
    transform: borderTransform
  },
  borderLeft: {
    themeKey: 'borders',
    transform: borderTransform
  },
  borderColor: {
    themeKey: 'palette'
  },
  borderTopColor: {
    themeKey: 'palette'
  },
  borderRightColor: {
    themeKey: 'palette'
  },
  borderBottomColor: {
    themeKey: 'palette'
  },
  borderLeftColor: {
    themeKey: 'palette'
  },
  borderRadius: {
    themeKey: 'shape.borderRadius',
    style: borderRadius
  },
  // palette
  color: {
    themeKey: 'palette',
    transform: paletteTransform
  },
  bgcolor: {
    themeKey: 'palette',
    cssProperty: 'backgroundColor',
    transform: paletteTransform
  },
  backgroundColor: {
    themeKey: 'palette',
    transform: paletteTransform
  },
  // spacing
  p: {
    style: padding
  },
  pt: {
    style: padding
  },
  pr: {
    style: padding
  },
  pb: {
    style: padding
  },
  pl: {
    style: padding
  },
  px: {
    style: padding
  },
  py: {
    style: padding
  },
  padding: {
    style: padding
  },
  paddingTop: {
    style: padding
  },
  paddingRight: {
    style: padding
  },
  paddingBottom: {
    style: padding
  },
  paddingLeft: {
    style: padding
  },
  paddingX: {
    style: padding
  },
  paddingY: {
    style: padding
  },
  paddingInline: {
    style: padding
  },
  paddingInlineStart: {
    style: padding
  },
  paddingInlineEnd: {
    style: padding
  },
  paddingBlock: {
    style: padding
  },
  paddingBlockStart: {
    style: padding
  },
  paddingBlockEnd: {
    style: padding
  },
  m: {
    style: margin
  },
  mt: {
    style: margin
  },
  mr: {
    style: margin
  },
  mb: {
    style: margin
  },
  ml: {
    style: margin
  },
  mx: {
    style: margin
  },
  my: {
    style: margin
  },
  margin: {
    style: margin
  },
  marginTop: {
    style: margin
  },
  marginRight: {
    style: margin
  },
  marginBottom: {
    style: margin
  },
  marginLeft: {
    style: margin
  },
  marginX: {
    style: margin
  },
  marginY: {
    style: margin
  },
  marginInline: {
    style: margin
  },
  marginInlineStart: {
    style: margin
  },
  marginInlineEnd: {
    style: margin
  },
  marginBlock: {
    style: margin
  },
  marginBlockStart: {
    style: margin
  },
  marginBlockEnd: {
    style: margin
  },
  // display
  displayPrint: {
    cssProperty: false,
    transform: value => ({
      '@media print': {
        display: value
      }
    })
  },
  display: {},
  overflow: {},
  textOverflow: {},
  visibility: {},
  whiteSpace: {},
  // flexbox
  flexBasis: {},
  flexDirection: {},
  flexWrap: {},
  justifyContent: {},
  alignItems: {},
  alignContent: {},
  order: {},
  flex: {},
  flexGrow: {},
  flexShrink: {},
  alignSelf: {},
  justifyItems: {},
  justifySelf: {},
  // grid
  gap: {
    style: gap
  },
  rowGap: {
    style: rowGap
  },
  columnGap: {
    style: columnGap
  },
  gridColumn: {},
  gridRow: {},
  gridAutoFlow: {},
  gridAutoColumns: {},
  gridAutoRows: {},
  gridTemplateColumns: {},
  gridTemplateRows: {},
  gridTemplateAreas: {},
  gridArea: {},
  // positions
  position: {},
  zIndex: {
    themeKey: 'zIndex'
  },
  top: {},
  right: {},
  bottom: {},
  left: {},
  // shadows
  boxShadow: {
    themeKey: 'shadows'
  },
  // sizing
  width: {
    transform: sizingTransform
  },
  maxWidth: {
    style: maxWidth
  },
  minWidth: {
    transform: sizingTransform
  },
  height: {
    transform: sizingTransform
  },
  maxHeight: {
    transform: sizingTransform
  },
  minHeight: {
    transform: sizingTransform
  },
  boxSizing: {},
  // typography
  fontFamily: {
    themeKey: 'typography'
  },
  fontSize: {
    themeKey: 'typography'
  },
  fontStyle: {
    themeKey: 'typography'
  },
  fontWeight: {
    themeKey: 'typography'
  },
  letterSpacing: {},
  textTransform: {},
  lineHeight: {},
  textAlign: {},
  typography: {
    cssProperty: false,
    themeKey: 'typography'
  }
};
var defaultSxConfig$1 = defaultSxConfig;

function objectsHaveSameKeys(...objects) {
  const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
  const union = new Set(allKeys);
  return objects.every(object => union.size === Object.keys(object).length);
}
function callIfFn(maybeFn, arg) {
  return typeof maybeFn === 'function' ? maybeFn(arg) : maybeFn;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function unstable_createStyleFunctionSx() {
  function getThemeValue(prop, val, theme, config) {
    const props = {
      [prop]: val,
      theme
    };
    const options = config[prop];
    if (!options) {
      return {
        [prop]: val
      };
    }
    const {
      cssProperty = prop,
      themeKey,
      transform,
      style
    } = options;
    if (val == null) {
      return null;
    }
    if (themeKey === 'typography' && val === 'inherit') {
      return {
        [prop]: val
      };
    }
    const themeMapping = getPath(theme, themeKey) || {};
    if (style) {
      return style(props);
    }
    const styleFromPropValue = propValueFinal => {
      let value = getStyleValue(themeMapping, transform, propValueFinal);
      if (propValueFinal === value && typeof propValueFinal === 'string') {
        // Haven't found value
        value = getStyleValue(themeMapping, transform, `${prop}${propValueFinal === 'default' ? '' : capitalize(propValueFinal)}`, propValueFinal);
      }
      if (cssProperty === false) {
        return value;
      }
      return {
        [cssProperty]: value
      };
    };
    return handleBreakpoints(props, val, styleFromPropValue);
  }
  function styleFunctionSx(props) {
    var _theme$unstable_sxCon;
    const {
      sx,
      theme = {}
    } = props || {};
    if (!sx) {
      return null; // Emotion & styled-components will neglect null
    }

    const config = (_theme$unstable_sxCon = theme.unstable_sxConfig) != null ? _theme$unstable_sxCon : defaultSxConfig$1;

    /*
     * Receive `sxInput` as object or callback
     * and then recursively check keys & values to create media query object styles.
     * (the result will be used in `styled`)
     */
    function traverse(sxInput) {
      let sxObject = sxInput;
      if (typeof sxInput === 'function') {
        sxObject = sxInput(theme);
      } else if (typeof sxInput !== 'object') {
        // value
        return sxInput;
      }
      if (!sxObject) {
        return null;
      }
      const emptyBreakpoints = createEmptyBreakpointObject(theme.breakpoints);
      const breakpointsKeys = Object.keys(emptyBreakpoints);
      let css = emptyBreakpoints;
      Object.keys(sxObject).forEach(styleKey => {
        const value = callIfFn(sxObject[styleKey], theme);
        if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            if (config[styleKey]) {
              css = merge(css, getThemeValue(styleKey, value, theme, config));
            } else {
              const breakpointsValues = handleBreakpoints({
                theme
              }, value, x => ({
                [styleKey]: x
              }));
              if (objectsHaveSameKeys(breakpointsValues, value)) {
                css[styleKey] = styleFunctionSx({
                  sx: value,
                  theme
                });
              } else {
                css = merge(css, breakpointsValues);
              }
            }
          } else {
            css = merge(css, getThemeValue(styleKey, value, theme, config));
          }
        }
      });
      return removeUnusedBreakpoints(breakpointsKeys, css);
    }
    return Array.isArray(sx) ? sx.map(traverse) : traverse(sx);
  }
  return styleFunctionSx;
}
const styleFunctionSx = unstable_createStyleFunctionSx();
styleFunctionSx.filterProps = ['sx'];
var styleFunctionSx$1 = styleFunctionSx;

const _excluded$2 = ["breakpoints", "palette", "spacing", "shape"];
function createTheme(options = {}, ...args) {
  const {
      breakpoints: breakpointsInput = {},
      palette: paletteInput = {},
      spacing: spacingInput,
      shape: shapeInput = {}
    } = options,
    other = _objectWithoutPropertiesLoose(options, _excluded$2);
  const breakpoints = createBreakpoints(breakpointsInput);
  const spacing = createSpacing(spacingInput);
  let muiTheme = deepmerge({
    breakpoints,
    direction: 'ltr',
    components: {},
    // Inject component definitions.
    palette: _extends({
      mode: 'light'
    }, paletteInput),
    spacing,
    shape: _extends({}, shape$1, shapeInput)
  }, other);
  muiTheme = args.reduce((acc, argument) => deepmerge(acc, argument), muiTheme);
  muiTheme.unstable_sxConfig = _extends({}, defaultSxConfig$1, other == null ? void 0 : other.unstable_sxConfig);
  muiTheme.unstable_sx = function sx(props) {
    return styleFunctionSx$1({
      sx: props,
      theme: this
    });
  };
  return muiTheme;
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}
function useTheme$1(defaultTheme = null) {
  const contextTheme = React.useContext(ThemeContext);
  return !contextTheme || isObjectEmpty(contextTheme) ? defaultTheme : contextTheme;
}

const systemDefaultTheme = createTheme();
function useTheme(defaultTheme = systemDefaultTheme) {
  return useTheme$1(defaultTheme);
}

const _excluded$1 = ["sx"];
const splitProps = props => {
  var _props$theme$unstable, _props$theme;
  const result = {
    systemProps: {},
    otherProps: {}
  };
  const config = (_props$theme$unstable = props == null ? void 0 : (_props$theme = props.theme) == null ? void 0 : _props$theme.unstable_sxConfig) != null ? _props$theme$unstable : defaultSxConfig$1;
  Object.keys(props).forEach(prop => {
    if (config[prop]) {
      result.systemProps[prop] = props[prop];
    } else {
      result.otherProps[prop] = props[prop];
    }
  });
  return result;
};
function extendSxProp(props) {
  const {
      sx: inSx
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded$1);
  const {
    systemProps,
    otherProps
  } = splitProps(other);
  let finalSx;
  if (Array.isArray(inSx)) {
    finalSx = [systemProps, ...inSx];
  } else if (typeof inSx === 'function') {
    finalSx = (...args) => {
      const result = inSx(...args);
      if (!isPlainObject(result)) {
        return systemProps;
      }
      return _extends({}, systemProps, result);
    };
  } else {
    finalSx = _extends({}, systemProps, inSx);
  }
  return _extends({}, otherProps, {
    sx: finalSx
  });
}

function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);else for(t in e)e[t]&&(n&&(n+=" "),n+=t);return n}function clsx(){for(var e,t,f=0,n="";f<arguments.length;)(e=arguments[f++])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}

const _excluded = ["className", "component"];
function createBox(options = {}) {
  const {
    themeId,
    defaultTheme,
    defaultClassName = 'MuiBox-root',
    generateClassName
  } = options;
  const BoxRoot = styled('div', {
    shouldForwardProp: prop => prop !== 'theme' && prop !== 'sx' && prop !== 'as'
  })(styleFunctionSx$1);
  const Box = /*#__PURE__*/React.forwardRef(function Box(inProps, ref) {
    const theme = useTheme(defaultTheme);
    const _extendSxProp = extendSxProp(inProps),
      {
        className,
        component = 'div'
      } = _extendSxProp,
      other = _objectWithoutPropertiesLoose(_extendSxProp, _excluded);
    return /*#__PURE__*/jsx(BoxRoot, _extends({
      as: component,
      ref: ref,
      className: clsx(className, generateClassName ? generateClassName(defaultClassName) : defaultClassName),
      theme: themeId ? theme[themeId] || theme : theme
    }, other));
  });
  return Box;
}

const Box = createBox();
process.env.NODE_ENV !== "production" ? Box.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
var Box$1 = Box;

var objectDefineProperties = {};

var DESCRIPTORS$1 = descriptors;
var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
var definePropertyModule = objectDefineProperty;
var anObject$2 = anObject$5;
var toIndexedObject$1 = toIndexedObject$5;
var objectKeys = objectKeys$2;

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
objectDefineProperties.f = DESCRIPTORS$1 && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject$2(O);
  var props = toIndexedObject$1(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};

var getBuiltIn = getBuiltIn$3;

var html$1 = getBuiltIn('document', 'documentElement');

/* global ActiveXObject -- old IE, WSH */

var anObject$1 = anObject$5;
var definePropertiesModule = objectDefineProperties;
var enumBugKeys = enumBugKeys$3;
var hiddenKeys = hiddenKeys$4;
var html = html$1;
var documentCreateElement$1 = documentCreateElement$2;
var sharedKey$1 = sharedKey$3;

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO$1 = sharedKey$1('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement$1('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO$1] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject$1(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};

var wellKnownSymbol$4 = wellKnownSymbol$6;
var create$1 = objectCreate;
var defineProperty$2 = objectDefineProperty.f;

var UNSCOPABLES = wellKnownSymbol$4('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  defineProperty$2(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create$1(null)
  });
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables$1 = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

var iterators = {};

var fails$1 = fails$b;

var correctPrototypeGetter = !fails$1(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var hasOwn$1 = hasOwnProperty_1;
var isCallable$3 = isCallable$e;
var toObject = toObject$4;
var sharedKey = sharedKey$3;
var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn$1(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable$3(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};

var fails = fails$b;
var isCallable$2 = isCallable$e;
var isObject = isObject$6;
var getPrototypeOf$1 = objectGetPrototypeOf;
var defineBuiltIn$1 = defineBuiltIn$3;
var wellKnownSymbol$3 = wellKnownSymbol$6;

var ITERATOR$2 = wellKnownSymbol$3('iterator');
var BUGGY_SAFARI_ITERATORS$1 = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf$1(getPrototypeOf$1(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype$2) || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype$2[ITERATOR$2].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable$2(IteratorPrototype$2[ITERATOR$2])) {
  defineBuiltIn$1(IteratorPrototype$2, ITERATOR$2, function () {
    return this;
  });
}

var iteratorsCore = {
  IteratorPrototype: IteratorPrototype$2,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
};

var defineProperty$1 = objectDefineProperty.f;
var hasOwn = hasOwnProperty_1;
var wellKnownSymbol$2 = wellKnownSymbol$6;

var TO_STRING_TAG$1 = wellKnownSymbol$2('toStringTag');

var setToStringTag$2 = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwn(target, TO_STRING_TAG$1)) {
    defineProperty$1(target, TO_STRING_TAG$1, { configurable: true, value: TAG });
  }
};

var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
var create = objectCreate;
var createPropertyDescriptor = createPropertyDescriptor$3;
var setToStringTag$1 = setToStringTag$2;
var Iterators$2 = iterators;

var returnThis$1 = function () { return this; };

var iteratorCreateConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype$1, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag$1(IteratorConstructor, TO_STRING_TAG, false);
  Iterators$2[TO_STRING_TAG] = returnThis$1;
  return IteratorConstructor;
};

var uncurryThis = functionUncurryThis;
var aCallable = aCallable$2;

var functionUncurryThisAccessor = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};

var isCallable$1 = isCallable$e;

var $String = String;
var $TypeError = TypeError;

var aPossiblePrototype$1 = function (argument) {
  if (typeof argument == 'object' || isCallable$1(argument)) return argument;
  throw $TypeError("Can't set " + $String(argument) + ' as a prototype');
};

/* eslint-disable no-proto -- safe */

var uncurryThisAccessor = functionUncurryThisAccessor;
var anObject = anObject$5;
var aPossiblePrototype = aPossiblePrototype$1;

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var $ = _export;
var call = functionCall;
var FunctionName = functionName;
var isCallable = isCallable$e;
var createIteratorConstructor = iteratorCreateConstructor;
var getPrototypeOf = objectGetPrototypeOf;
var setPrototypeOf = objectSetPrototypeOf;
var setToStringTag = setToStringTag$2;
var createNonEnumerableProperty$1 = createNonEnumerableProperty$4;
var defineBuiltIn = defineBuiltIn$3;
var wellKnownSymbol$1 = wellKnownSymbol$6;
var Iterators$1 = iterators;
var IteratorsCore = iteratorsCore;

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$1 = wellKnownSymbol$1('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

var iteratorDefine = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$1]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR$1])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR$1, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty$1(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return call(nativeIterator, this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if (IterablePrototype[ITERATOR$1] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR$1, defaultIterator, { name: DEFAULT });
  }
  Iterators$1[NAME] = defaultIterator;

  return methods;
};

// `CreateIterResultObject` abstract operation
// https://tc39.es/ecma262/#sec-createiterresultobject
var createIterResultObject$1 = function (value, done) {
  return { value: value, done: done };
};

var toIndexedObject = toIndexedObject$5;
var addToUnscopables = addToUnscopables$1;
var Iterators = iterators;
var InternalStateModule = internalState;
var defineProperty = objectDefineProperty.f;
var defineIterator = iteratorDefine;
var createIterResultObject = createIterResultObject$1;
var DESCRIPTORS = descriptors;

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return createIterResultObject(undefined, true);
  }
  if (kind == 'keys') return createIterResultObject(index, false);
  if (kind == 'values') return createIterResultObject(target[index], false);
  return createIterResultObject([index, target[index]], false);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
var values = Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

// V8 ~ Chrome 45- bug
if (DESCRIPTORS && values.name !== 'values') try {
  defineProperty(values, 'name', { value: 'values' });
} catch (error) { /* empty */ }

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = documentCreateElement$2;

var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype$1 = classList && classList.constructor && classList.constructor.prototype;

var domTokenListPrototype = DOMTokenListPrototype$1 === Object.prototype ? undefined : DOMTokenListPrototype$1;

var global$1 = global$c;
var DOMIterables = domIterables;
var DOMTokenListPrototype = domTokenListPrototype;
var ArrayIteratorMethods = es_array_iterator;
var createNonEnumerableProperty = createNonEnumerableProperty$4;
var wellKnownSymbol = wellKnownSymbol$6;

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  handlePrototype(global$1[COLLECTION_NAME] && global$1[COLLECTION_NAME].prototype, COLLECTION_NAME);
}

handlePrototype(DOMTokenListPrototype, 'DOMTokenList');

const RecycleAvatar = ({
  imgPath
}) => {
  useTheme$2();
  return jsx(Avatar, {
    sx: {
      height: 60,
      width: 60
    },
    src: imgPath
  });
};

const CustomDivider = observer(() => {
  const theme = useTheme$2();
  return jsx(Divider, {
    sx: {
      border: 'none',
      width: '90%',
      height: '50px',
      marginTop: 0,
      boxShadow: `0 20px 20px -20px ${theme.palette.background.paper}`,
      margin: '-50px auto 10px'
    }
  });
});

var img = "data:image/png;base64,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";

const AccordionSkeleton = observer(({
  recyclableTypes,
  onChildClickHandler
}) => {
  const [expandedType, setExpandedType] = useState('');
  const [itemsToShow, setItemsToShow] = useState(10);
  const handleChange = typeName => {
    setExpandedType(typeName === expandedType ? '' : typeName);
  };
  const loadMoreItems = () => {
    setItemsToShow(itemsToShow + 10);
  };
  return jsx(Box$2, Object.assign({
    component: "div"
  }, {
    children: recyclableTypes === null || recyclableTypes === void 0 ? void 0 : recyclableTypes.map(type => {
      var _a, _b, _c;
      const typeName = type.typeCusName || '';
      const cusTypeImgId = type.typeCusSvgId;
      return jsxs(TypeAccordion, Object.assign({
        typeId: type.cusTypeId,
        typeName: typeName,
        cusTypeImgId: cusTypeImgId,
        expanded: expandedType === typeName,
        onChange: handleChange
      }, {
        children: [(_b = (_a = type === null || type === void 0 ? void 0 : type.mappedItems) === null || _a === void 0 ? void 0 : _a.slice(0, itemsToShow)) === null || _b === void 0 ? void 0 : _b.map(item => {
          return jsx(AccordionItem, {
            item: item,
            onChildClickHandler: onChildClickHandler
          }, item.id);
        }), ((_c = type === null || type === void 0 ? void 0 : type.mappedItems) === null || _c === void 0 ? void 0 : _c.length) > itemsToShow && jsx("button", Object.assign({
          style: {
            padding: '1em',
            borderRadius: 25,
            backgroundColor: 'white'
          },
          onClick: loadMoreItems
        }, {
          children: "Load more"
        }))]
      }), type.cusTypeId);
    })
  }));
});
function TypeAccordion({
  typeName,
  cusTypeImgId,
  typeId,
  expanded,
  onChange,
  children
}) {
  const theme = useTheme$2();
  const [typeB64, setTypeB64] = useState(img);
  useEffect(() => {
    if (cusTypeImgId && typeId) {
      const getTypeB64 = () => __awaiter(this, void 0, void 0, function* () {
        const b64 = yield getCustomerTypeImg(cusTypeImgId, typeId);
        setTypeB64(b64);
      });
      getTypeB64();
    }
  }, [cusTypeImgId, getCustomerTypeImg, typeId]);
  return jsxs(Accordion, Object.assign({
    expanded: expanded,
    onChange: () => onChange(typeName),
    style: {
      marginBottom: expanded ? 70 : 10,
      background: theme.palette.background.paper
    },
    sx: {
      '&:hover .MuiAccordionSummary-expandIconWrapper': {
        outline: `4px solid ${theme.palette.primary.main}`
      },
      '& .MuiAccordionSummary-expandIconWrapper': {
        transition: 'none',
        borderRadius: '999px',
        '&.Mui-expanded': {
          transform: 'none',
          outline: `4px solid ${theme.palette.primary.main}`
        }
      }
    }
  }, {
    children: [jsx(AccordionSummary, Object.assign({
      style: {
        minHeight: '100px'
      },
      expandIcon: jsx(RecycleAvatar, {
        imgPath: typeB64
      }),
      "aria-controls": "panel1a-content",
      id: "panel1a-header"
    }, {
      children: jsxs(Box$2, Object.assign({
        component: "div",
        style: {
          display: 'flex',
          justifyContent: 'space-around',
          flexGrow: 'inherit',
          flexWrap: 'wrap'
        }
      }, {
        children: [jsx(Card, Object.assign({
          style: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            marginRight: 15,
            minWidth: '250px',
            alignItems: 'center',
            marginBottom: 7,
            background: theme.palette.primary.main
          }
        }, {
          children: jsx(CardContent, {
            children: jsx(Typography, Object.assign({
              variant: "h5",
              sx: {
                fontWeight: 'bold',
                color: theme.palette.background.default
              }
            }, {
              children: typeName
            }))
          })
        })), jsx(Box$2, {
          component: "div",
          style: {
            flex: 2,
            display: 'flex',
            alignItems: 'center'
          }
        }), jsx(Box$2, {
          component: "div",
          style: {
            flex: 0.1
          }
        })]
      }))
    })), jsx(CustomDivider, {}), jsx(AccordionDetails, Object.assign({
      style: {
        flex: 1,
        display: 'flex',
        padding: '0px 20px',
        paddingBottom: '20px'
      }
    }, {
      children: jsx(Box$2, Object.assign({
        component: "div",
        sx: {
          padding: '5px',
          justifyContent: 'center',
          display: 'flex',
          flex: 1,
          gap: 2,
          flexWrap: 'wrap'
        }
      }, {
        children: children
      }))
    }))]
  }));
}
const AccordionItem = ({
  item,
  onChildClickHandler
}) => {
  const theme = useTheme$2();
  const btnStrikethroughStyle = () => {
    let style = {};
    if (!item.isAccepted) {
      style = {
        background: `linear-gradient(to top left,
          rgba(250,0,0,0) 0%,
          rgba(250,0,0,0) calc(50% - 2px),
          rgba(250,0,0,1) 50%,
          rgba(250,0,0,0) calc(50% + 2px),
          rgba(250,0,0,0) 100%),
          linear-gradient(to top right,
            rgba(250,0,0,0) 0%,
            rgba(250,0,0,0) calc(50% - 2px),
            rgba(250,0,0,1) 50%,
            rgba(250,0,0,0) calc(50% + 2px),
            rgba(250,0,0,0) 100%)
          `,
        border: 3,
        borderColor: 'red',
        backgroundColor: theme.palette.primary.main
      };
    } else {
      style = {
        background: theme.palette.primary.main
      };
    }
    return style;
  };
  const [img$1, setImg] = useState(img);
  useEffect(() => {
    if (item && getCustomerItemImage) {
      const getImg = () => __awaiter(void 0, void 0, void 0, function* () {
        const dbImg = yield getCustomerItemImage(item);
        setImg(dbImg);
      });
      getImg();
    }
  }, [getCustomerItemImage, item]);
  return jsx(Chip, {
    sx: Object.assign({
      height: '2.95rem',
      borderRadius: '999px'
    }, btnStrikethroughStyle()),
    onClick: () => {
      onChildClickHandler(item);
    },
    label: jsx(Typography, Object.assign({
      sx: {
        color: theme.palette.background.default,
        fontSize: '1.25rem'
      },
      variant: "subtitle1"
    }, {
      children: _.truncate(item.item || '')
    })),
    avatar: jsx(Avatar, {
      alt: 'recyclable item',
      src: img$1,
      style: {
        width: '40px',
        height: '40px'
      }
    })
  });
};

const Search = observer(({
  searchOptions,
  db,
  searchOptionValue,
  onSearchOptChg,
  loadAcceptedMaterials,
  onChildClickHandler,
  allAcceptedMaterial,
  searchSubmitHandler
}) => {
  const {
    searchTabValue
  } = useSearchStore().topBarViewStore;
  const {
    setAllMaterialData,
    allMaterialData,
    setSvgDoB64
  } = useSearchStore().searchViewStore;
  const {
    org
  } = useParams();
  useEffect(() => {
    //TODO: remove duplicate code
    let custId = null;
    if (org) {
      custId = org;
    }
    if (custId && db) {
      loadAcceptedMaterials(db, custId);
    }
  }, [db, loadAcceptedMaterials, org]);
  return jsxs(Box$1, Object.assign({
    component: "div"
  }, {
    children: [jsx(Topbar, {
      db: db,
      searchSubmitHandler: searchSubmitHandler,
      allMaterials: allMaterialData,
      streamNames: allAcceptedMaterial.map(stream => stream.streamName),
      searchOptionValue: searchOptionValue,
      searchOptions: searchOptions,
      onSearchOptChg: onSearchOptChg
    }), allAcceptedMaterial.map((stream, idx) => {
      var _a;
      const isCurrentTab = idx + 1 === searchTabValue;
      return isCurrentTab && ((_a = stream.mappedTypes) === null || _a === void 0 ? void 0 : _a.length) > 0 ? jsx(AccordionSkeleton, {
        tabName: stream.streamName,
        onChildClickHandler: onChildClickHandler,
        recyclableTypes: stream.mappedTypes
      }) : null;
    })]
  }));
});

const SearchConsumer = observer(({
  db,
  onChildClickHandler,
  allAcceptedMaterial,
  searchSubmitHandler,
  searchPropsCallback,
  searchOptions,
  searchOptionValue,
  loadAcceptedMaterials,
  onSearchOptChg,
  useParams
}) => {
  return jsx(RootStoreProvider, {
    children: jsx(Search, {
      useParams: useParams,
      db: db,
      loadAcceptedMaterials: loadAcceptedMaterials,
      onChildClickHandler: onChildClickHandler,
      allAcceptedMaterial: allAcceptedMaterial,
      searchSubmitHandler: searchSubmitHandler,
      searchPropsCallback: searchPropsCallback,
      searchOptionValue: searchOptionValue,
      searchOptions: searchOptions,
      onSearchOptChg: onSearchOptChg
    })
  });
});

const SearchModal = observer(({
  showSearchModal,
  db,
  allMaterials,
  searchSubmitHandler,
  searchOptionValue,
  onSearchOptChg,
  searchOptions,
  resultDetailBody,
  showResultBody,
  setShowSearchModal,
  useParams,
  handleOnBrowse
}) => {
  const navigate = useNavigate();
  const {
    org
  } = useParams();
  const location = useLocation();
  return jsx(Modal, Object.assign({
    open: showSearchModal,
    "aria-labelledby": "modal-modal-title",
    "aria-describedby": "modal-modal-description",
    className: "detection-search-modal",
    onClose: (evt, reason) => {
      if (reason && reason === 'backdropClick') {
        setShowSearchModal(false);
      }
    }
  }, {
    children: jsxs(Box$2, Object.assign({
      component: "div",
      sx: Object.assign(Object.assign({}, defaultModalStyle), {
        padding: 0,
        maxWidth: '95vw'
      })
    }, {
      children: [showResultBody && resultDetailBody, jsxs(Box$2, Object.assign({
        component: "div",
        display: 'flex'
      }, {
        children: [jsx(Button, Object.assign({
          style: {
            marginLeft: 2
          },
          onClick: () => {
            handleOnBrowse(location, org, navigate);
          }
        }, {
          children: "Browse"
        })), jsx(SearchBar, {
          db: db,
          allMaterials: allMaterials,
          searchSubmitHandler: searchSubmitHandler,
          searchOptionValue: searchOptionValue,
          onSearchOptChg: onSearchOptChg,
          searchOptions: searchOptions
        })]
      }))]
    }))
  }));
});

export { CustomDivider, Search, SearchConsumer, SearchModal, SearchTabs, Topbar };
