// JavaScript source code
var language;
$(function () {
    $.ajax({
        url: '/jsLang',
        dataType: 'json',
        type: 'POST',
        success: function (data) {
            language = data.lang;
        }
    });
});

function openModalBox(target) {

    $(".inputArea > div").add(
        "<div class='textLayout'>" +
            // 입력창
            "<div class='scenario-form-group dlg_input_title'>" +
                "<label>" + language.DIALOG_BOX_TITLE + "<span class='nec_ico'>*</span></label>" +
                "<input type='text' name='dialogTitle' class='form-control' onkeyup='writeDialogTitle(this);' placeholder='" + language.Please_enter + "' spellcheck='false' autocomplete='off'>" +
            "</div>" +
            "<div class='scenario-form-group dlg_input_sub_title'>" +
                "<label>" + language.DIALOG_BOX_SUBTITLE + "<span class='nec_ico'>*</span></label>" +
                "<input type='text' name='dialogSubTitle' class='form-control' onkeyup='writeDialogSubTitle(this);' placeholder='" + language.Please_enter + "' spellcheck='false' autocomplete='off'>" +
            "</div>" +
            "<div class='scenario-form-group dlg_input_text'>" +
                "<label>" + language.DIALOG_BOX_CONTENTS + "<span class='nec_ico'>*</span></label>" +
                "<input type='text' name='dialogText' class='form-control' onkeyup='writeDialog(this);' placeholder='" + language.Please_enter + "' spellcheck='false' autocomplete='off'>" +
            "</div>" +
            "<div class='scenario-form-group dlg_input_img dpN'>" +
                "<label>" + language.IMAGE_URL + "<span class='nec_ico'>*</span></label>" +
                "<input type='text' name='imgUrl' class='form-control' onkeyup='writeCarouselImg(this);' placeholder='" + language.Please_enter + "' spellcheck='false' autocomplete='off'>" +
            "</div>" +
            // 버튼 클릭창
            "<div class='clear- both'></div>" +
            "<div class='btn-group btn-group-justified insertBtnArea' role='group'> " + 
                "<div class='btn-group dlg_btn_insert' role='group'>" +
                    "<button type='button' class='btn btn-default carouseBtn'>" + language.INSERT_MORE_BUTTON + "</button>" +
                "</div>" +
                "<div class='btn-group dlg_btn_insert_card' role='group'>" +
                    "<button type='button' class='btn btn-default addCarouselBtn'>" + language.INSERT_MORE_CARDS + "</button>" +
                "</div>" +
            "</div > " +
            "<div class='btn-group btn-group-justified deleteBtnArea'role='group'> " + 
                "<div class='btn-group deleteInsertFormDiv dlg_btn_delete dpN'role='group'>" +
                    "<button type='button' class='btn btn-default deleteInsertForm'>" + language.DELETE_DIALOG + "</button>" +
                "</div>" +
                "<div class='btn-group dlg_btn_delete_card dpN'role='group'>" +
                    "<button type='button' class='btn btn-default deleteCard'>" + language.DELETE_CARD + "</button>" +
                "</div>" +
            "</div>" +
            // 버튼 생성
            "<div class='inputBtnArea'></div>" +
        "</div>"
    ).appendTo(".inputArea");
}

//대화상자 타입 변경
$(document).on('change', 'select[name=dlgType]', function (e) {
    var cardType = $(this).val();

    if (cardType == '2') {

    } else if (cardType == '3') {

    } else if (cardType == '4') {

    }

});


//다이얼로그생성모달 - 다이얼로그삭제
$(document).on('click', '.deleteInsertForm', function (e) {

    insertFormLength = $('.insertForm').length;
    if (insertFormLength == 1) {
        alert(language.You_must_have_one_dialog_by_default);
    } else {
        var idx = $(".deleteInsertForm").index(this);
        if (idx == 0) {

            $(this).parents('.insertForm').next().remove();
        }
        $(".dialogView").eq(idx).remove();
        $(this).parents('.insertForm').prev().remove();
        $(this).parents('.insertForm').remove();
    }
    $(this).parents('.insertForm');
});

//다이얼로그생성모달 - 버튼추가
var btnCnt = 1;
var btnNum_temp = "";
var btnNum_list = "";   //버튼의 번호 목록
$(document).on('click', '.carouseBtn', function (e) {
    var divCnt = $(".inputBtnArea > div").length;
    if (divCnt < 4) {
        $(".inputBtnArea > div").add(
            "<div class='btnOptionDiv' alt='" + btnCnt + "'>" +
            "   <div class='cardBtnCopyDiv'><div>" +
            "	    <label>" + language.BUTTON + "</label>" +
            "	</div>" +
            "	<div class='scenario-form-group col-md-13' style='padding-left:0; margin-top: 0px;'>" +
            "	    <table class='cardCopyTbl' style='width:100%'>" +
            "		<col width='21%'>" +
            "		<col width='1%'>" +
            "		<col width='35%'>" +
            "		<col width='1%'>" +
            "		<col width='35%'>" +
            "		<col width='1%'>" +
            "		<col width='6%'>" +
            "		<thead>" +
            "		    <tr>" +
            "			<th>" + language.Type + "</th>" +
            "			<th></th>" +
            "			<th>" + language.NAME + "</th>" +
            "			<th></th>" +
            "			<th>" + language.CONTENTS + "</th>" +
            "			<th></th>" +
            "			<th></th>" +
            "		    </tr>" +
            "		</thead>" +
            "		<tbody>" +
            "		    <tr>" +
            "			<td>" +
            "			    <select class='form-control' name='btnType'>" +
            "				<option value='imBack' selected>imBack</option>" +
            "				<option value='openURL'>openURL</option>" +
            "			    </select>" +
            "			</td>" +
            "			<td></td>" +
            "			<td>" +
            "			    <input type='text' name='cButtonName' class='form-control' placeholder='" + language.Please_enter + "' spellcheck='false' autocomplete='off' alt='" + btnCnt + "'>" +
            "			</td>" +
            "			<td></td>" +
            "			<td>" +
            "			    <input type='text' name='cButtonContent' class='form-control' placeholder='" + language.Please_enter + "' spellcheck='false' autocomplete='off' alt='" + btnCnt + "'>" +
            "			</td>" +
            "			<td></td>" +
            "			<td>" +
            "			    <a href='#' class='btn_delete' style='margin:0px;' alt='" + btnCnt + "'><span class='fa fa-trash'></span></a>" +
            "			</td>" +
            "		    </tr>" +
            "		</tbody>" +
            "	    </table>" +
            "	</div>" +
            "    </div>" +
            "</div>"
        ).appendTo(".inputBtnArea");

        btnCnt++;

    } else {
        alert(language.SCENARIO_BTN_CNT_VALIDATION);
    }
});

//다이얼로그생성모달 - 버튼삭제
$(document).on('click', '.btn_delete', function (e) {
    $(this).parent().parent().parent().parent().parent().parent().parent().remove();
});




// 다이얼로그생성모달 (다이얼로그 타이틀 입력)
function writeDialogTitle(e) {
    var idx = $('#commonLayout .insertForm').index($(e).parents('.insertForm'));
    var icx = $('#commonLayout').find('.insertForm').index($(e).parents('.insertForm'));
    var jcx = $(e).parents('.insertForm').find('input[name=dialogTitle]').index(e);

    if ($(e).parents('.insertForm').find('select[name=dlgType]').val() == 3) {
        $('.dialogView').children().eq(icx).find('ul:eq(0)').children().eq(jcx).find('h1').text(e.value);
    } else if ($(e).parents('.insertForm').find('select[name=dlgType]').val() == 4) {
        $('.dialogView').children().eq(icx).find('h1').html(e.value);
    } else {
        $('.dialogView').children().eq(icx).find('.textMent .previewTitle').html(e.value);
    }
}

// 다이얼로그생성모달 (다이얼로그 부제목 입력)
function writeDialogSubTitle(e) {
    var idx = $('#commonLayout .insertForm').index($(e).parents('.insertForm'));
    var icx = $('#commonLayout').find('.insertForm').index($(e).parents('.insertForm'));
    var jcx = $(e).parents('.insertForm').find('input[name=dialogTitle]').index(e);

    if ($(e).parents('.insertForm').find('select[name=dlgType]').val() == 3) {
        $('.dialogView').children().eq(icx).find('ul:eq(0)').children().eq(jcx).find('h1').text(e.value);
    } else if ($(e).parents('.insertForm').find('select[name=dlgType]').val() == 4) {
        $('.dialogView').children().eq(icx).find('h1').html(e.value);
    } else {
        $('.dialogView').children().eq(icx).find('.textMent .previewSubTitle').html(e.value);
    }
}

// 다이얼로그 생성 모달 (다이얼로그 내용 입력)
function writeDialog(e) {
    var idx = $('#commonLayout .insertForm').index($(e).parents('.insertForm'));
    var icx = $('#commonLayout').find('.insertForm').index($(e).parents('.insertForm'));

    if ($(e).parents('.insertForm').find('select[name=dlgType]').val() == 3) {
        var jcx = $(e).parents('.insertForm').find('input[name=dialogText]').index(e);
        if ($(e).parent().prev().find('input[name=dialogTitle]').val() == '') {
            $('.dialogView').children().eq(icx).find('ul:eq(0)').children().eq(jcx).find('h1').text('');
        }
        $('.dialogView').children().eq(icx).find('ul:eq(0)').children().eq(jcx).find('p').text(e.value);
    } else if ($(e).parents('.insertForm').find('select[name=dlgType]').val() == 4) {
        $('.dialogView').children().eq(icx).find('.dlgMediaText').text(e.value);
    } else {
        if ($(e).parent().prev().find('input[name=dialogTitle]').val() == '') {
            $('.dialogView').children().eq(icx).find('.textMent .textTitle').text('');
        }
        $('.dialogView').children().eq(icx).find('.textMent .previewText').text(e.value);
    }
}
