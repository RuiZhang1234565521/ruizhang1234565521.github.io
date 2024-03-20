var data={
	opidurl:'http://1.hao933.top',
	serverurl:'http://144.123.142.106:4998/zhuanfa',
	wenlvtong:'http://144.123.142.106:4998'
}
function getopid(){
    return new Promise((resolve,reject)=>{
        let cokopid = getCookie('opid')
        if(cokopid.length==28){data.opid = cokopid;resolve();return}
        let code = getUrlParam('code')
        if(code && code.length==32){
            $.ajax({
                type:'get',dataType:'jsonp',async:false,
                url:`${data.opidurl}/myapi/code.php`,
                data:{code,mode:'opid'},
                success:function(resp){
                    [data.opid,data.token]=resp
                    setCookie("opid",data.opid,1)
                    resolve()
                }
            })
        }else{
            let str = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
            str = str.replace(/\./g,"0d0").replace(/\//g,"0g0").replace(/\:/g,"0m0")
            let url = `${data.opidurl}/myapi/code.php?state=${str}`
            window.location.replace(url)
            resolve()
        }
    })
}
function getuser(){
    if(data.opid.length!=28){$("body").html("Please log in!");return}
    $.ajax({
        type:'get',dataType:'jsonp',async:false,
        url: `${data.opidurl}/myapi/code.php`,
        data:{opid:data.opid,token:data.token},
        success:function(resp){
            data = {...data,...resp}
            let tm = ((data.tm - (new Date().getTime()) / 1000) / 60).toFixed(0)
            $("#head").attr("src",data.headimgurl);
            $("#nickname").text(data.nickname+" "+tm);
            if(tm < 0){reuser()}
            return
        }
    })
}
function reuser(){
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;) {
            document.cookie = `${keys[i]}=0;path=/;expires=${new Date(0).toUTCString()}`
        }
    }
    $("#nickname").html("exited!")
}
function setCookie(cname,cvalue,exdays){
	var d = new Date();
	d.setTime(d.getTime()+(exdays*240*60*60*1000));
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
function displayCookies(){var ca = document.cookie.replace(/;/g,"<br>");$("#a").html(ca)}
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
async function isadmin(){
    let db1 = JSON.stringify({mode:8,opid:data.opid})
    db1 = js_encrypt(db1,"52c7f81cd24c9699","42e07d2f7199c35d")
    $("#b").html(db1)
    return await new Promise((resolve,reject)=>{$.ajax({
        type: "get",dataType: "jsonp",jsonp: "callback",
        url: `${data.serverurl}/myapi/webapi.php`,
        data:{db1},
        success: function(db){$("#b").html(db),data.adminlv=db,resolve(db)},
        error: function(db){$("#b").html("Data acquisition failed!");reject(db)}
    })})
}