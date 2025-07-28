var data={
  opidurl:  'https://tt.cycs666.com:4999/zf-sf',
  serverurl:'https://tt.cycs666.com:4999/zf-sf',
  wenlvtong:'https://tt.cycs666.com:4999',
}
async function getopid() {
  try {
    const cokopid = getCookie('opid');
    if (cokopid.length === 28) {
      data.opid = cokopid;
      return;
    }

    const code = getUrlParam('code');
    if (!code || code.length !== 32) {
      const encodedUrl = encodeUriForRedirection(window.location);
      const redirectionUrl = `${data.opidurl}/myapi/code2.php?state=${encodedUrl}`;
      window.location.replace(redirectionUrl);
      return;
    }

    const response = await fetch(`${data.opidurl}/myapi/code2.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: JSON.stringify({ code, mode: 'opid' })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const [opid, token] = await response.json();
    data.opid = opid;
    data.token = token;
    setCookie('opid', opid, 365);
  } catch (error) {
    console.error('Failed to get opid:', error);
  }
}

function encodeUriForRedirection(location) {
  const { protocol, host, pathname } = location;
  return `${protocol}//${host}${pathname}`
    .replace(/\./g, '0d0')
    .replace(/\//g, '0g0')
    .replace(/\:/g, '0m0');
}
async function getuser() {
  if (data.opid.length !== 28) {
    $('body').html('Please log in!');
    return;
  }
  try {
    const { opid, token } = data;
    const requestData = token ? { opid, token } : { opid };

    const response = await fetch(`${data.opidurl}/myapi/code2.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const userData = await response.json();
    updateUserData(userData);
    if (data.tm < 0) { reuser() };
    return;
  } catch (error) {
  console.error('Failed to get user data:', error);
  }
}

function updateUserData(userData) {
  Object.assign(data, userData);
  const tm = Math.floor((data.tm - Date.now() / 1000) / 60);
  document.getElementById('head').src = data.headimgurl;
  document.getElementById('nickname').innerHTML = data.nickname;
  document.getElementById('coktm').innerHTML = tm;
}

function reuser(){
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
    for (var i = keys.length; i--;) {
       document.cookie = `${keys[i]}=0;path=/;expires=${new Date(0).toUTCString()}`
    }
  }
  nickname.innerHTML="exited!"
}
function setCookie(cname,cvalue,exdays){
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie =`${cname}=${cvalue};${expires};path=/`;
}
function getCookie(cname){
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++){
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}
function displayCookies(){
  var ca = document.cookie.replace(/;/g,"<br>");
  $("#a").html(ca)
}
function getUrlParam(name){
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
function js_encrypt(str, key, iv) {
  key = CryptoJS.enc.Utf8.parse(key);
  iv = CryptoJS.enc.Utf8.parse(iv);
  let encrypted = CryptoJS.AES.encrypt(str, key, {
    iv: iv,mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

function js_decrypt(str, key, iv) {
  key = CryptoJS.enc.Utf8.parse(key);
  iv = CryptoJS.enc.Utf8.parse(iv);
  let decrypted = CryptoJS.AES.decrypt(str, key, {
    iv: iv,padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8);
  return decrypted
}

function IsPC(){
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {flag = false;break;}
  }
  return flag;
}
