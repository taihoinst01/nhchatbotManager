(function() {
    // Your base, I'm in it!
    var originalAddClassMethod = jQuery.fn.addClass;

    jQuery.fn.addClass = function() {
        // Execute the original method.
        var result = originalAddClassMethod.apply( this, arguments );

        // trigger a custom event
        jQuery(this).trigger('cssClassChanged');

        // return the original result
        return result;
    }
})();

$(function() {
    $(".icheckbox_flat-green").bind('cssClassChanged',function() {
        if($(".icheckbox_flat-green").hasClass("checked")) {
            var userInputId = $("input[name='mLoginId']").val();
            setCookie("tiisUserInputId", userInputId, 7);
        } else {
            deleteCookie("tiisUserInputId");
        }
    });
});

$(document).ready(function () {

    $('#mLoginId').focus();

    $('#sendLoginBtn').click(function () {
        $('#loginfrm').submit();
    });

    $('#mLoginPass, #mLoginId').keyup(function(e) {
        if(e.keyCode == 13) {
            $('#sendLoginBtn').click();
        }
    });

    // 저장된 쿠키값을 가져와서 ID 칸에 넣어준다. 없으면 공백으로 들어감.
    var userInputId = getCookie("tiisUserInputId");
    $("input[name='mLoginId']").val(userInputId); 

    if($("input[name='mLoginId']").val() != ""){ // 그 전에 ID를 저장해서 처음 페이지 로딩 시, 입력 칸에 저장된 ID가 표시된 상태라면,
        $(".icheckbox_flat-green").addClass("checked");
        $(".icheckbox_flat-green").attr("aria-checked",true);
        $("#idSaveCheck").attr("checked", true); // ID 저장하기를 체크 상태로 두기.
    }
     
    // ID 저장하기를 체크한 상태에서 ID를 입력하는 경우, 이럴 때도 쿠키 저장.
    $("input[name='mLoginId']").keyup(function() {
        if($(".icheckbox_flat-green").hasClass("checked")) {
            var userInputId = $("input[name='mLoginId']").val();
            setCookie("tiisUserInputId", userInputId, 7);
        }
    });
});

function setCookie(cookieName, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
    document.cookie = cookieName + "=" + cookieValue;
}
 
function deleteCookie(cookieName) {
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}
 
function getCookie(cookieName) {
    cookieName = cookieName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cookieName);
    var cookieValue = '';
    if(start != -1) {
        start += cookieName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cookieValue = cookieData.substring(start, end);
    }
    return unescape(cookieValue);
}