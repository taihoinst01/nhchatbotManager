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




///////////// KSO
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

    /////////////////////////// DLG_TYPE ///////////////////////////////
    $(".dlgType").on('click', function () {
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
    var btnNum_temp = "";
    var btnNum_list = "";   //버튼의 번호 목록
    $('.addBtn').click(function () {
        var divCnt = $(".btnArea > div").length;
        if (divCnt < 4) {
            $(".btnArea > div").add(
                "<div class='dlgBtn button" + btnCnt + "'>" +
                "<div>버튼" + btnCnt + "<span class='removeBtn' alt=" + btnCnt + ">삭제</span></div>" +

                "<div class='btnMenu1'>버튼명</div>" +
                "<input type='text' id='btnTitle" + btnCnt + "' class='btnTitle' onkeyup='btnTitleKeyup(this, " + btnCnt + ")' placeholder='버튼명을 입력하세요.'>" +

                "<div class='btnMenu2' name='button" + btnCnt + "'>버튼답변</div>" +
                "<input type='text' id='btnAnswer" + btnCnt + "' class='btnAnswer' onkeyup='btnAnswerKeyup(this, " + btnCnt + ")' placeholder='버튼답변을 입력하세요.'>" +

                "<div class='btnMenu3'>버튼타입</div> " +
                "<label class='cp'><input type='radio' class='btnType' name='btnType" + btnCnt + "' value='imBack' checked> imBack</label>" +
                "<label class='cp'><input type='radio' class='btnType' name='btnType" + btnCnt + "' value='openUrl'> openUrl</label>" +
                "</div>"
            ).appendTo(".btnArea");

            btnNum_temp = btnCnt.toString();
            if (divCnt == 0) {
                btnNum_list = btnNum_temp;
            } else {
                btnNum_list = btnNum_list + ',' + btnNum_temp;
            }

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
        var btnNum = btnNum_list.split(',');
        btnNum_list = "";
        var _tempFlag = 0;
        for (var i = 0; i < btnNum.length; i++) {
            if (btnNum[i] != $(this).attr('alt')) {
                if (_tempFlag == 0) {
                    btnNum_list = btnNum[i];
                    _tempFlag = 1;
                } else {
                    btnNum_list = btnNum_list + ',' + btnNum[i];
                }
            }
        }

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
        var _this = $(this).parent().parent().parent().attr('class');
        var _thisNum = String(_this).substr(_this.length - 1);
        if ($(this).val() == 'imBack') {
            for (var i = 0; i < $(".btnArea > div").length; i++) {
                //$('.dlgBtn.button' + _thisNum + ' > .btnMenu2').removeClass('dpN');
                $('.dlgBtn.button' + _thisNum + ' > .btnMenu2').text('버튼답변');
            }
        } else {
            for (var i = 0; i < $(".btnArea > div").length; i++) {
                //$('.dlgBtn.button' + _thisNum + ' > .btnMenu2').addClass('dpN');
                $('.dlgBtn.button' + _thisNum + ' > .btnMenu2').text('URL');
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
    var board_dlgId = 1;
    $('.createDlg').on('click', function () {
        var valChk = validationChk();
        if (valChk) {
            var board_title = $('.dlgTitle').attr('value');
            var board_subTitle = $('.dlgSubTitle').attr('value');
            var board_text = $('.dlgText').attr('value');

            var board_img = $('#input-file').attr('value');
            var board_url = $('.dlgurl').attr('value');
            var board_cardDivision = $('input:radio[name=cardDivision]:checked').attr('value');

            var board_btn = $(".btnArea > div").length;
            var board_dlgId = $('.dlgId').attr('value');
            var board_type = $('input:radio[name=dlgType]:checked').attr('value');
            var board_carousel = $('input:radio[name=cardType]:checked').attr('value');
            var board_parentId = $('.pDlgId').attr('value');

            //버튼 갯수만큼 생성
            var btn_title = "";
            var btn_result = "";
            var btn_type = "";
            var btnCreate_title = "";
            var btnCreate_answer = "";
            var btnCreate_type = "";
            var btnNum = "";
            if (board_btn > 0) {
                //btn_title = $('.btnTitle').attr('value');
                btnNum = btnNum_list.split(',');
                for (var i = 1; i <= board_btn; i++) {
                    btn_title = $('#btnTitle' + btnNum[i - 1]).attr('value');
                    btnCreate_title = btnCreate_title + "<div class='board_btn btn" + i + "'>" + btn_title + "</div>";

                    btn_result = $('#btnAnswer' + btnNum[i - 1]).attr('value');
                    btnCreate_answer = btnCreate_answer + "<div class='board_btn_answer hidden btn" + i + "' alt=" + btn_result + "></div>";

                    btn_type = $("input:radio[name=btnType" + btnNum[i - 1] + "]:checked").attr('value');
                    btnCreate_type = btnCreate_type + "<div class='board_btn_type hidden btn" + i + "' alt=" + btn_type + "></div>";
                }
            }

            //이미지 유무 판단 생성
            var imgCreate = "";
            var imgCardDivision = "";
            if (board_type == '3' || board_type == '4') {
                var ori_path = board_img;
                board_img = board_img.substr(board_img.length - 4);
                if (board_img == '.jpg' || board_img == '.png') {
                    imgCreate = "<div class='board_img img" + board_dlgId + "'><img src='" + ori_path + "'></div>"
                    imgCardDivision = "<div class='board_cardDivision hidden' alt=" + board_cardDivision+"></div>";
                } else {
                    imgReset();
                }
            }

            $(".viewArea > div").add(
                "<div class='dlgBoard'>" +
                imgCreate +
                imgCardDivision +
                "<div class='board_title'><b>" + board_title + "</b></div>" +
                "<div class='board_subTitle'>" + board_subTitle + "</div>" +
                "<div class='board_text'>" + board_text + "</div>" +
                btnCreate_title +
                btnCreate_answer +
                btnCreate_type +
                "<div class='board_dlgId hidden' alt='" + board_dlgId + "'></div>" +
                "<div class='board_type hidden' alt='" + board_type + "'></div>" +
                "<div class='board_carousel hidden' alt='" + board_carousel + "'></div>" +
                "<div class='board_parentId hidden' alt='" + board_parentId + "'></div>" +
                "</div>"
            ).appendTo(".viewArea");

            //form 지우기
            //formReset()
            imgReset();

            //초기화후 dlgid랑 parentId search
            $('.pDlgId').attr('value', board_dlgId);
            $('.pDlgId').val(board_dlgId);
            board_dlgId++;
            $('.dlgId').attr('value', board_dlgId);
            $('.dlgId').val(board_dlgId);

            //      scenarioInsert
            $.ajax({
                url: '/learning/scenarioInsert',
                dataType: 'json',
                type: 'POST',
                data : {'dlgType' : board_type, 'dlgTitle' : board_title, 'dlgText' : board_text, 'dlgSubTitle': board_subTitle, 
                    'dlgBtn1type' : '', 'dlgBtn1title' : '', 'dlgBtn1type' : '',
                    'dlgParentdlgid': board_parentId, dlgDivision : '', dlgUseyn : 'Y', dlgId : '' },
                success: function(data) {
                    alert(language.Added);

                    
                }
            });

            /*
            var result = sql.connect(dbConfig, function (err) {
                if (err) console.log(err);    
                // create Request object    
                var request = new sql.Request();   
                
                request.input('dlgType', board_type);
                request.input('dlgTitle', board_title);
                request.input('dlgText', board_text);
                request.input('dlgSubTitle', board_subTitle);

                request.input('dlgBtn1type', board_type);
                request.input('dlgBtn1title', board_type);
                request.input('dlgBtn1type', board_type);
                
                request.input('dlgParentdlgid', board_parentId);
                request.input('dlgDivision', '');
                request.input('dlgUseyn', 'Y');
                request.input('dlgId', '');

                // query to the database and execute procedure     
                let query = "exec sp_scenario 1 ";    
                //console.log(query)    
                request.query(query, function (err, recordset) {    
                    if (err) {    
                        console.log(err);    
                        sql.close();    
                    }    
                    sql.close();    
                    res.send(recordset.recordsets[0]);    
                });    
            });
            */

            //

        }
    });

    $('.cancelDlg').on('click', function () {
        formReset()
        imgReset();
        //초기화후 dlgid랑 parentId search
    });

    /////////////////////////// board data select & update ///////////////////////////////
    $(document).on('click', '.dlgBoard', function () {

        alert('준비중입니다.');
        console.log($(this).children().attr('class'));
        console.log($(this).children().eq(1).text());

        var board_title = $(this).children().eq(1).text();


        //for (var attr in $(this)) {
        //    console.log($(this)[attr]);
        //}
    });
});

function formReset() {
    $("input[type=text], textarea").val("");
}

function imgReset() {
    $('.upload-display').remove();
    $('.upload-hidden').attr('value', '');
    $('.upload-name').val('파일선택');
}

function btnTitleKeyup(text, btnNum) {
    var divCnt = $(".btnArea > div").length;
    $('#btnTitle' + btnNum).attr('value', text.value);
    $('#btnTitle' + btnNum).val(text.value);
}

function btnAnswerKeyup(text, btnNum) {
    var divCnt = $(".btnArea > div").length;
    $('#btnAnswer' + btnNum).attr('value', text.value);
    $('#btnAnswer' + btnNum).val(text.value);
}

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