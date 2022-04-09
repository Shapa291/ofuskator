
function randNum(min = 0, max = 9) {
	return Math.floor(min + Math.random() * (max - min + 1));
}
function randLetter() {
	const r = Math.random();
	let c = String.fromCharCode(randNum(97, 122));
	if (r < 0.5) {
		c = c.toUpperCase();
	}
	return c;
}
function randChar() {
	const r = Math.random();
	if (r < 0.3) return randNum();
	else return randLetter();
}
function repeat(n, func) {
	let result = "";
	for (let i = 0; i < n; i++) result += func();
	return result;
}
function randName() {
	let result = randLetter();
	for (let i = 0; i < 12; i++) {
		result += randChar();
	}
	return result;
}
function randDefine() {
	return `#define ${randName()} ${randName()}`;
}
function randVariable() {
	const r = Math.random();
	const types = ["int", "long long", "double"];
	if (r < 0.25) {
		return `string ${randName()} = "${randName()}";`;
	} else {
		return `${types[randNum(0, types.length - 1)]} ${randName()} = ${randNum(
			-1e9,
			1e9
		)};`;
	}
}
function randExpression() {
	const a = randNum(0, 2000);
	const b = randNum(2001, 4000);
	const expressions = [
		`${a} > ${b}`,
		`${a} >= ${b}`,
		`${b} < ${a}`,
		`${b} <= ${a}`,
		`${a} == ${b}`,
		"false",
		"!true",
	];
	return expressions[randNum(0, expressions.length - 1)];
}
function randIf(inner = "") {
	return `if (${randExpression()}){\n${inner}\n}`;
}
function randWhile(inner = "") {
	return `while (${randExpression()}){\n${inner}\n}`;
}
function randFor(inner = "") {
	const types = ["int", "long long", "double"];
	const varType = types[randNum(0, types.length - 1)];
	const varName = randName();
	return `for (${varType} ${varName} = ${randNum(
		0,
		1e8
	)}; ${randExpression()}; ${varName}++){\n${inner}\n}`;
}

function randBlock(n = 5) {
	let inner = randVariable();
	if (n > 1) inner = randBlock(n - 1);
	const funs = [randIf, randWhile, randFor];
	return funs[randNum(0, funs.length - 1)](inner);
}
function obfText() {
	return (
		randBlock(randNum(2, 5)) +
		"\n" +
		repeat(randNum(3, 5), () => randVariable() + "\n") +
		randBlock(randNum(2, 5)) +
		"\n"
	);
}

const blockInput = document.querySelector("#cicles textarea");
const defineInput = document.querySelector("#define textarea");
const variablesInput = document.querySelector("#variables textarea");
blockInput.innerHTML = repeat(2, () => randBlock(randNum(2, 5) + "\n"));
defineInput.innerHTML = repeat(20, () => randDefine() + "\n");
variablesInput.innerHTML = repeat(20, () => randVariable() + "\n");

const obfButton = document.querySelector("#input input");
obfButton.addEventListener("click", () => {

for (let l = 0; l < 10; l++) {

	try {
	let p = document.querySelector("#input textarea").value;
	// p = repeat(randNum(3, 5), () => randDefine() + "\n") + p;
	for (let i = 0; i < 100; i++) {
		p = p.replace("//OBF", obfText());
		p = p.replace(
			"//DEF",
			repeat(randNum(4, 7), () => randDefine() + "\n")
		);
		p = p.replace(
			"//VAR",
			repeat(randNum(5, 10), () => randVariable() + "\n")
		);
	}


    var mystring = "" + p
	var blob = new Blob([mystring], { type: "text/plain;charset=utf-8" });
	var path = randName() + (l + 1) + ".cpp";
    saveAs(blob, path);
    document.querySelector("#output textarea").innerHTML = p;
} catch(e) {
	document.querySelector("#output textarea").innerHTML = e;
}
}
});

const copyButton = document.querySelector("#output input");
copyButton.addEventListener("click", () => {
	const text = document.querySelector("#output textarea");
	text.select();
	document.execCommand("copy");
});

const closeButton = document.querySelector("#close");
closeButton.addEventListener("click", () => {
	const generic = document.querySelector("#generic");
	generic.style.display = "none";
});




//----------------------------------------------------------------------------------------------------

var _global = typeof window === 'object' && window.window === window
  ? window : typeof self === 'object' && self.self === self
  ? self : typeof global === 'object' && global.global === global
  ? global
  : this

function bom (blob, opts) {
  if (typeof opts === 'undefined') opts = { autoBom: false }
  else if (typeof opts !== 'object') {
    console.warn('Deprecated: Expected third argument to be a object')
    opts = { autoBom: !opts }
  }

  // prepend BOM for UTF-8 XML and text/* types (including HTML)
  // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
  if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
    return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type })
  }
  return blob
}

function download (url, name, opts) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    saveAs(xhr.response, name, opts)
  }
  xhr.onerror = function () {
    console.error('could not download file')
  }
  xhr.send()
}

function corsEnabled (url) {
  var xhr = new XMLHttpRequest()
  // use sync to avoid popup blocker
  xhr.open('HEAD', url, false)
  try {
    xhr.send()
  } catch (e) {}
  return xhr.status >= 200 && xhr.status <= 299
}

// `a.click()` doesn't work for all browsers (#465)
function click (node) {
  try {
    node.dispatchEvent(new MouseEvent('click'))
  } catch (e) {
    var evt = document.createEvent('MouseEvents')
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
                          20, false, false, false, false, 0, null)
    node.dispatchEvent(evt)
  }
}

// Detect WebView inside a native macOS app by ruling out all browsers
// We just need to check for 'Safari' because all other browsers (besides Firefox) include that too
// https://www.whatismybrowser.com/guides/the-latest-user-agent/macos
var isMacOSWebView = _global.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent)

var saveAs = _global.saveAs || (
  // probably in some web worker
  (typeof window !== 'object' || window !== _global)
    ? function saveAs () { /* noop */ }

  // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView
  : ('download' in HTMLAnchorElement.prototype && !isMacOSWebView)
  ? function saveAs (blob, name, opts) {
    var URL = _global.URL || _global.webkitURL
    var a = document.createElement('a')
    name = name || blob.name || 'download'

    a.download = name
    a.rel = 'noopener' // tabnabbing

    // TODO: detect chrome extensions & packaged apps
    // a.target = '_blank'

    if (typeof blob === 'string') {
      // Support regular links
      a.href = blob
      if (a.origin !== location.origin) {
        corsEnabled(a.href)
          ? download(blob, name, opts)
          : click(a, a.target = '_blank')
      } else {
        click(a)
      }
    } else {
      // Support blobs
      a.href = URL.createObjectURL(blob)
      setTimeout(function () { URL.revokeObjectURL(a.href) }, 4E4) // 40s
      setTimeout(function () { click(a) }, 0)
    }
  }

  // Use msSaveOrOpenBlob as a second approach
  : 'msSaveOrOpenBlob' in navigator
  ? function saveAs (blob, name, opts) {
    name = name || blob.name || 'download'

    if (typeof blob === 'string') {
      if (corsEnabled(blob)) {
        download(blob, name, opts)
      } else {
        var a = document.createElement('a')
        a.href = blob
        a.target = '_blank'
        setTimeout(function () { click(a) })
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name)
    }
  }

  // Fallback to using FileReader and a popup
  : function saveAs (blob, name, opts, popup) {
    // Open a popup immediately do go around popup blocker
    // Mostly only available on user interaction and the fileReader is async so...
    popup = popup || open('', '_blank')
    if (popup) {
      popup.document.title =
      popup.document.body.innerText = 'downloading...'
    }

    if (typeof blob === 'string') return download(blob, name, opts)

    var force = blob.type === 'application/octet-stream'
    var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari
    var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent)

    if ((isChromeIOS || (force && isSafari) || isMacOSWebView) && typeof FileReader !== 'undefined') {
      // Safari doesn't allow downloading of blob URLs
      var reader = new FileReader()
      reader.onloadend = function () {
        var url = reader.result
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;')
        if (popup) popup.location.href = url
        else location = url
        popup = null // reverse-tabnabbing #460
      }
      reader.readAsDataURL(blob)
    } else {
      var URL = _global.URL || _global.webkitURL
      var url = URL.createObjectURL(blob)
      if (popup) popup.location = url
      else location.href = url
      popup = null // reverse-tabnabbing #460
      setTimeout(function () { URL.revokeObjectURL(url) }, 4E4) // 40s
    }
  }
)

_global.saveAs = saveAs.saveAs = saveAs

if (typeof module !== 'undefined') {
  module.exports = saveAs;
}
