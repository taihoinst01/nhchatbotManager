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

var rememberSelBoxHtml = '';

$(document).ready(function(){

    // groupType 사양및 장단점 역할
    // sourceType 구분 역할
    var groupType =  "epkim";
    initScenario(groupType);

});

function initScenario(groupType){
    //alert("initScenario" + groupType);
}




/////////////
$(function () {
    /////////////////////////// 디바이스에 맞게 초기 높이 설정 ///////////////////////////////
    $('.scenarioArea').css({ 'height': $(document).height() - 20 + 'px' });
    $('.optionArea').css({ 'height': $(document).height() - 20 + 'px' });
    $('.viewArea').css({ 'height': $(document).height() - 20 + 'px' });
    $(window).resize(function () {
        $('.scenarioArea').css({ 'height': $(document).height() - 20 + 'px' });
        $('.optionArea').css({ 'height': $(document).height() - 20 + 'px' });
        $('.viewArea').css({ 'height': $(document).height() - 20 + 'px' });
    });

    /////////////////////////// input창 value 변경값 ///////////////////////////////
    $('input[id=dlgTitle]').keyup(function () {
        $('#dlgTitle').attr('value', $(this).val());
    });
    $('input[id=dlgSubTitle]').keyup(function () {
        $('#dlgSubTitle').attr('value', $(this).val());
    });
    $('input[id=dlgText]').keyup(function () {
        $('#dlgText').attr('value', $(this).val());
    });
    $('input[id=input-file]').change(function () {
        var imgNm = $(this)[0].files[0].name;
        var realpath = 'C:\\Users\\Taiho_KSO\\Desktop\\';   //절대경로 지정.....
        realpath = realpath + imgNm;
        $('#input-file').attr('value', realpath);
    });
    $('input[id=dlgUrl]').keyup(function () {
        $('#dlgUrl').attr('value', $(this).val());
    });
    $('input[class=btnTitle]').keyup(function () {
        $('.btnTitle').attr('value', $(this).val());
    });

    /////////////////////////// 파일 업로드 관련 ///////////////////////////////
    var fileTarget = $('.filebox .upload-hidden');
    fileTarget.on('change', function () { // 값이 변경되면 
        if (window.FileReader) { // modern browser 
            var filename = $(this)[0].files[0].name;
        } else { // old IE 
            var filename = $(this).val().split('/').pop().split('\\').pop(); // 파일명만 추출 
        } // 추출한 파일명 삽입 
        $(this).siblings('.upload-name').val(filename);
    });

    //preview image 
    var imgTarget = $('.preview-image .upload-hidden');
    imgTarget.on('change', function () {
        var parent = $(this).parent();
        parent.children('.upload-display').remove();
        if (window.FileReader) { //image 파일만 
            if (!$(this)[0].files[0].type.match(/image\//))
                return;
            var reader = new FileReader();
            reader.onload = function (e) {
                var src = e.target.result;
                parent.prepend('<div class="upload-display"><div class="upload-thumb-wrap"><img src="' + src + '" class="upload-thumb"></div></div>');
            }
            reader.readAsDataURL($(this)[0].files[0]);
        } else {
            $(this)[0].select();
            $(this)[0].blur();
            var imgSrc = document.selection.createRange().text;
            parent.prepend('<div class="upload-display"><div class="upload-thumb-wrap"><img class="upload-thumb"></div></div>');
            var img = $(this).siblings('.upload-display').find('img');
            img[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enable='true',sizingMethod='scale',src=\"" + imgSrc + "\")";
        }
    });
});

function imgReset() {
    $('.upload-display').remove();
    $('.upload-hidden').attr('value', '');
    $('.upload-name').val('파일선택');
}

$(function () {
    /////////////////////////// DLG_TYPE ///////////////////////////////
    $(".dlgType").on('click', function() {
        var dlgTypeChk = $('input:radio[name=dlgType]:checked').attr('value');
        if (dlgTypeChk == '3' || dlgTypeChk == '4') {
            $('.mainMenu6').removeClass('dpN');
        } else {
            $('.mainMenu6').addClass('dpN');
            imgReset();
        }
    });

    /////////////////////////// 버튼 추가/삭제 ///////////////////////////////
    var btnCnt = 1;
    $('.addBtn').click(function () {
        var divCnt = $(".btnArea > div").length;
        if (divCnt < 4) {
            $(".btnArea > div").add(
                "<div class='dlgBtn button" + btnCnt + "'>" +
                    "<div>버튼" + btnCnt + "<span class='removeBtn'>삭제</span></div>" +
                    "<div class='btnMenu1'>버튼명" +
                        "<input type='text' class='btnTitle' placeholder='버튼명을 입력하세요.'>" +
                    "</div > " +
                    "<div class='btnMenu2' name='button" + btnCnt + "'>버튼답변" +
                        "<input type='text' class='btnAnswer' placeholder='버튼답변을 입력하세요.'>" +
                    "</div > " +
                    "<div class='btnMenu3'>버튼타입" +
                        "<label class='cp'><input type='radio' class='btnType' name='btnType" + btnCnt + "' value='imBack' checked> imBack</label>" +
                        "<label class='cp'><input type='radio' class='btnType' name='btnType" + btnCnt + "' value='openUrl'> openUrl</label>" +
                    "</div > " +
                "</div>"
            ).appendTo(".btnArea");
            btnCnt++;
            
            //다중을 체크하고 disabled 시킨다.
            if (divCnt > 0) {
                $('.cardType').attr('disabled', false);
                $('input:radio[name=cardType]:input[value=Y]').trigger('click');
                $('.cardType').attr('disabled', true);
            }
        } else {
            alert('버튼은 4개까지만 생성이 가능합니다.');
        }
    });
    $(document).on('click', '.removeBtn', function () {
        var clickBtn = $(this).parent().parent().hasClass('dlgBtn');
        if (clickBtn) {
            $(this).parent().parent().remove();
        }
        
        //단일로 체크하고 disabled를 해제한다.
        var divCnt = $(".btnArea > div").length;
        if (divCnt < 2) {
            $('.cardType').attr('disabled', false);
            $('input:radio[name=cardType]:input[value=N]').trigger('click');
            $('.cardType').attr('disabled', true);
        }
    });
    $(document).on('click', '.btnType', function () {
        if ($(this).val() == 'imBack') {
            var _this = $(this).parent().parent().parent().attr('class');
            var _thisNum = String(_this).substr(_this.length - 1);
            for (var i = 0; i < $(".btnArea > div").length; i++) {
                $('.dlgBtn.button' + _thisNum + ' > .btnMenu2').removeClass('dpN')
            }
        } else {
            var _this = $(this).parent().parent().parent().attr('class');
            var _thisNum = String(_this).substr(_this.length-1);
            for (var i = 0; i < $(".btnArea > div").length; i++) {
                $('.dlgBtn.button' + _thisNum+' > .btnMenu2').addClass('dpN')
            }
        }
    });

    /////////////////////////// 이미지,영상 추가/삭제 ///////////////////////////////
    $('.addImg').click(function () {
        $('.imgArea').removeClass('dpN');
    });
    $(document).on('click', '.removeImg', function () {
        $('.imgArea').addClass('dpN');
        imgReset();
    });

    $('.addMov').click(function () {
        $('.movArea').removeClass('dpN');
    });
    $(document).on('click', '.removeMov', function () {
        $('.movArea').addClass('dpN');
    });
    
    /////////////////////////// 생성 관련 ///////////////////////////////
    $('.createDlg').on('click', function () {
        var valChk = validationChk();
        if (valChk){
            var board_title = $('.dlgTitle').attr('value');
            var board_subTitle = $('.dlgSubTitle').attr('value');
            var board_text = $('.dlgText').attr('value');

            var board_img = $('#input-file').attr('value');
            var board_url = $('.dlgurl').attr('value');

            var board_btn = $(".btnArea > div").length;
            var board_dlgId = $('.dlgId').attr('value');
            var board_type = $('input:radio[name=dlgType]:checked').attr('value');
            var board_carousel = $('input:radio[name=cardType]:checked').attr('value');
            var board_parentId = $('.pDlgId').attr('value');


            var btn_title = "";
            var btn_result = "";
            var btn_type = "";
            var btnCreate = "";
            if (board_btn > 0) {
                btn_title = $('.btnTitle').attr('value');
                for (var i= 1; i <= board_btn; i++){
                    btnCreate = btnCreate + "<div class='board_btn btn"+i+"'>" + btn_title + '"</div>"';
                }
            }

            $(".viewArea > div").add(
                "<div class='dlgBoard'>" +
                    "<div class='board_img dpN'><img src='" + board_img + "'></div>" +
                    "<div class='board_title'>" + board_title + "</div>" +
                    "<div class='board_subTitle'>" + board_subTitle + "</div>" +
                    "<div class='board_text'>" + board_text + "</div>" +
                    btnCreate +
                    "<div class='board_dlgId hidden' alt='" + board_dlgId +"'></div>" +
                    "<div class='board_type hidden' alt='" + board_type +"'></div>" +
                    "<div class='board_carousel hidden' alt='" + board_carousel+"'></div>" +
                    "<div class='board_parentId hidden' alt='" + board_parentId +"'></div>" +
                "</div>"
            ).appendTo(".viewArea");

            board_img = board_img.substr(board_img.length - 4);
            if (board_img == '.jpg' || board_img == '.png') {
                $('.board_img').removeClass('dpN');
            } else {
                $('.board_img').addClass('dpN');
                imgReset();
            }

            //form 지우기
            $("input[type=text], textarea").val("");
            //초기화후 dlgid랑 parentId search
        }


    });

    $('.cancelDlg').on('click', function () {
        $("input[type=text], textarea").val("");
        imgReset();
        //초기화후 dlgid랑 parentId search
    });

    
    
});

/////////////////////////// validation check ///////////////////////////////
function validationChk() {
    var result = true;
    if ($('.dlgTitle').val().length < 1) {
        alert('제목을 입력해주세요.');
        $('.dlgTitle').focus();
        return false;
    }
    if ($('.dlgSubTitle').val().length < 1) {
        alert('부제목을 입력해주세요.');
        $('.dlgSubTitle').focus();
        return false;
    }
    if ($('.dlgText').val().length < 1) {
        alert('내용을 입력해주세요.');
        $('.dlgText').focus();
        return false;
    }
    return result;
}


