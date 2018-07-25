


//가장 먼저 실행.
var language;
;(function($) {
    $.ajax({
        url: '/jsLang',
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            language= data.lang;
        }
    });
})(jQuery);


$(document).ready(function () {

    $('div[name=colorCircle]').click(function(){
        var colorNum = $(this).attr('class').split(' ')[1];
        
        $('#selColor').attr('class', 'img-circle_l ' + colorNum);
    });

    $('#saveApp').click(function() {
        addApp();
    });
    
    $('#cancelApp').click(function() {
        if( confirm(language['ASK_CANCEL']) ) {
            window.location.href='/list';
        }
    });


})


function addApp() {
    
    if ($('#appInsertName').val() === "") {
        alert(language['INPUT_CHAT_NAME']);
        return;
    }
    var appColor = $('#selColor').attr('class').split(' ')[1];
    var params = {
        'color': appColor,
        'appInsertService': $('#appService').val(),
        'appInsertName': $('#appInsertName').val(),
        'appInsertCulture': $(":input:radio[name=r3]:checked").val(),
        'appDes': $('#appDes').val(),
        'dbId' : $('#dbId').val(),
        'dbPassword' : $('#dbPassword').val(),
        'dbUrl' : $('#dbUrl').val(),
        'dbName' : $('#dbName').val(),
        'luisSubscription': $('#luisSubscription').val()
    };


    $.ajax({
        type: 'POST',
        url: 'admin/addChatBotApps',
        data: params,
        success: function(data) {
            if(data.result == true) {
                alert(language['REGIST_SUCC']);
                window.location.href = '/';
            } else {
                alert(language['It_failed']);
            }
            //console.log(data);
            /*
            if(data.appId != undefined && data.appId != null && data.appId != ''){
                alert(language['REGIST_SUCC']);
                window.location.href='/?appColor=' + appColor + '&appInsertName=' + $('#appInsertName').val();
            }else{
                alert(language['It_failed']);
            }
            */
        }
    });
}