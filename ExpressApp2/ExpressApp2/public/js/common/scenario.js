// JavaScript source code
var language;
$(function () {
    console.log("utterance test");
    $.ajax({
        url: '/jsLang',
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            language= data.lang;
        }
    });
});

$(document).ready(function(){
    // recommend에서 넘어온 문장 insert
    var recommendParam = $('#utterence').val();
    if(recommendParam){
        utterInput(recommendParam);
    }
    
    //새로운 다이얼로그 생성 모달창에 필요한 luisId 가져오기
    //getLuisInfo('luisId');

    //새로운 다이얼로그 생성 모달창에 필요한 그룹 가져오기
    getGroupSeelectBox();

    //엔티티 추가 모달 초기 설정
    entityValidation();
    //엔티티추가 모달 selectbox 설정
    selectApiGroup();
    
    selectScenarioList();
    
    $('.addDialogCancel').click(function(){
        $('#appInsertForm')[0].reset();
        var inputEntityStr = "<div style='margin-top:4px;'><input name='entityValue' tabindex='1' id='entityValue' type='text' class='form-control' style=' float: left; width:80%;' placeholder='" + language.Please_enter + "' onkeyup='entityValidation();' spellcheck='false' autocomplete='off'>";
        inputEntityStr += '<a href="#" name="delEntityBtn" class="entity_delete" style="display:inline-block; margin:7px 0 0 7px; "><span class="fa fa-trash" style="font-size: 25px;"></span></a></div>';
        $('.entityValDiv').html(inputEntityStr);
        entityValidation();
    });
    
    $('#entities').click(function() {
        setTimeout(function (){
            $('#addEntityModal').find("input:visible:first").focus();
            //$('#entityDefine').focus();
        }, 500);
    });

    $(document).on("click", "a[name=delEntityBtn]", function(e){
        if ($('.entityValDiv  input[name=entityValue]').length < 2) {
            alert('1개 이상 입력해야 합니다.');
            $('.entityValDiv  input[name=entityValue]').eq($('.entityValDiv  input[name=entityValue]').length-1).focus();
        } else {
            $(this).parent().remove();
            $('.entityValDiv  input[name=entityValue]').eq($('.entityValDiv  input[name=entityValue]').length-1).focus();
            entityValidation();
        }
    });
});

function openModalBox(target) {
    $(".inputArea > div").remove();
    $(".inputArea > div").add(
        "<div class='textLayout'>" +
            // 텍스트
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
                "<label>" + language.IMAGE_URL + "<span class='nec_ico'>*</span></label><button class='dlg_input_img_change'>적용</button>" +
                "<div>sample URL : /images/ico_car.png </div>" +
                "<input type='text' name='imgUrl' class='form-control' onkeyup='writeCarouselImg(this);' placeholder='" + language.Please_enter + "' spellcheck='false' autocomplete='off'>" +
            "</div>" +
            // 버튼선택
            "<div class='clear- both'></div>" +
            "<div class='btn-group btn-group-justified insertBtnArea dpN' role='group'> " + 
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
            // 추가될버튼 영역
            "<div class='inputBtnArea'></div>" +
        "</div>"
    ).appendTo(".inputArea");
}

// 카드타입 변경
$(document).on('change', 'select[name=dlgType]', function (e) {
    var cardType = $(this).val();

    if (cardType == '2') {
        $('.insertBtnArea').addClass('dpN');
        $('.dlg_input_img').addClass('dpN');
        $('.previewImg').addClass("dpN");
        $('.previewImg').attr('src', '');
        $('.dlg_input_img').val('');
        $('.inputBtnArea > div').remove();
        $('.previewBtnArea > button').remove();
    } else if (cardType == '3') {
        $('.insertBtnArea').removeClass('dpN');
        $('.dlg_input_img').removeClass('dpN');
        $('.previewImg').attr('src', '');
    } else if (cardType == '4') {
        $('.insertBtnArea').removeClass('dpN');
        $('.dlg_input_img').removeClass('dpN');
        $('.previewImg').attr('src', '');
    }

});

// 다이얼로그 삭제 버튼
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

// 버튼영역에 버튼 생성
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
            "			    <input type='text' name='cButtonName' class='form-control' placeholder='" + language.Please_enter + "' onkeyup='writeBtnTitle(this," + btnCnt + ");' spellcheck='false' autocomplete='off' alt='" + btnCnt + "'>" +
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

        $('.previewBtnArea > div').add("<button type='button' class='btn btn-default w100'alt='" + btnCnt + "'>button1</button>").appendTo(".previewBtnArea");

        btnNum_temp = btnCnt.toString();
        if (divCnt == 0) {
            btnNum_list = btnNum_temp;
        } else {
            btnNum_list = btnNum_list + ',' + btnNum_temp;
        }
        btnCnt++;
    } else {
        alert(language.SCENARIO_BTN_CNT_VALIDATION);
    }
});

// 버튼영역 버튼 삭제
$(document).on('click', '.btn_delete', function (e) {
    $('button[alt=' + $(this).attr('alt') + ']').remove();
    $(this).parent().parent().parent().parent().parent().parent().parent().remove();
});

// 대화상자 이미지 URL 입력
var imgUrl = "";
function writeCarouselImg(e) {
    imgURL = $(e).parents('.dlg_input_img').find('input[name=imgUrl]').context.value;
}
// 대화상자 미리보기 이미지 출력
$(document).on('click', '.dlg_input_img_change', function (e) {
    //console.log(imgURL);
    if (imgURL == "") {
        $('.previewImg').addClass("dpN");
        $('.previewImg').attr('src', '');
    } else {
        $('.previewImg').removeClass("dpN");
        $('.previewImg').attr('src', imgURL);
    }
});

// 대화상자 미리보기 타이틀 입력
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

// 대화상자 미리보기 서브타이틀 입력
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

// 대화상자 미리보기 내용 입력
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

// 대화상자 미리보기 버튼 타이틀 입력
function writeBtnTitle(e, btnNum) {
    var btnCnt = $('.previewBtnArea > button').length;
    for (var i = 0; i < btnCnt; i++) {
        if ($('.previewBtnArea > button').eq(i).attr('alt') == parseInt(btnNum)){
            $('.previewBtnArea > button').eq(i).text(e.value);
        }
    }
}














//���̾�α� ����
/*
function insertDialog(){

    $.ajax({
        url: '/learning/insertDialog',
        dataType: 'json',
        type: 'POST',
        data: $('#appInsertForm').serializeObject(),
        success: function(data) {
            if(data.status == 200){
                var inputUttrHtml = '';
                inputUttrHtml += '<tr> <td> <div class="check-radio-tweak-wrapper" type="checkbox">';
                inputUttrHtml += '<input name="dlgChk" class="tweak-input"  onclick="" type="checkbox"/> </div> </td>';
                inputUttrHtml += '<td class="txt_left" ><input type="hidden" name="' + data.DLG_ID + '" value="' + data.DLG_ID + '" />' + data.CARD_TEXT + '</td></tr>';
                $('#dlgViewDiv').prepend(inputUttrHtml);                    
                $('.createDlgModalClose').click();
            }
        }
    });
}
*/
//���â �Է°��� ���� save ��ư Ȱ��ȭ ó��
function entityValidation(){
    
    var defineText = $('#entityDefine').val().trim();
    var valueText = true;
    
    $('.entityValDiv  input[name=entityValue]').each(function() {
        if ($(this).val().trim() === "") {
            valueText = false;
            return;
        }
    });

    if(defineText != "" && valueText) {
        $('#btnAddDlg').removeClass("disable");
        $('#btnAddDlg').attr("disabled", false);
    } else {
        $('#btnAddDlg').attr("disabled", "disabled");
        $('#btnAddDlg').addClass("disable");
    }
       
}

//��ƼƼ �߰� group selbox ����
var globalApiGroupStr;
function selectApiGroup() {
    $.ajax({
        type: 'POST',
        datatype: "JSON",
        //data: params,
        url: '/learning/selectApiGroup',
        success: function(data) {
            if (data.groupList) {
                var groupList = data.groupList;
                var optionStr = "";
                for (var i=0; i<groupList.length; i++) {
                    optionStr += '<option value="' + groupList[i].API_GROUP + '">' + groupList[i].API_GROUP + '</option>'
                }
                globalApiGroupStr = optionStr;
                $('#apiGroup').append(optionStr);
                $('#apiGroupRelation').append(optionStr);
            }
        }
    });
}


function createDialog(){
    alert('1');
    var idx = $('form[name=dialogLayout]').length;
    var array = [];
    var exit = false;

    /*
    if($('select[name=luisId]').val().trim() === "") {
        alert(language.Please_reset_the_group);
        exit = true;
    
        return false;
    }
    if(exit) return;
    var luisIntent;
    $('#appInsertForm').find('[name=luisIntent]').each(function() {
        if($(this).attr('disabled') == undefined) {
            luisIntent = $(this).val();
            return false;
        }
    })
    if(luisIntent.trim() === "") {
        alert(language.Please_reset_the_group);
        exit = true;
        return false;
    }
    if(exit) return;
    */
   
    $('.insertForm input[name=dialogText]').each(function(index) {
        if ($(this).val().trim() === "") {
            alert(language.You_must_enter_the_dialog_text);
            exit = true;
            return false;
        }
    });
    
    if(exit) return;

    /*
    $('.insertForm input[name=imgUrl]').each(function(index) {
        if ($(this).val().trim() === "") {
            alert(language.ImageURL_must_be_entered);
            exit = true;
            return false;
        }
    });
   */

    if(exit) return;

    $('.insertForm input[name=mediaImgUrl]').each(function(index) {
        if ($(this).val().trim() === "") {
            alert(language.ImageURL_must_be_entered);
            exit = true;
            return false;
        }
    });

    if(exit) return;


    /*
    if ($('#description').val().trim() === "" ) {
        alert(language.Description_must_be_entered);
        return false;
    }
    
    $('.insertForm input[name=dialogTitle]').each(function(index) {
        if ($(this).val().trim() === "") {
            alert(language.You_must_enter_a_Dialog_Title);
            exit = true;
            return false;
        }
    });

    if(exit) return;   
    
    
    */

    for(var i = 0 ; i < idx ; i++) {
        var tmp = $("form[name=dialogLayout]").eq(i).serializeArray();
        var object  = {};
        var carouselArr = [];
        var objectCarousel = {};
        if (tmp[0].value === "3") {
            var btnTypeCount = 1;
            var cButtonContentCount = 1;
            var cButtonNameCount = 1;
            for (var j = 1; j < tmp.length; j++) {
                if(tmp[j].name == 'btnType') {
                    tmp[j].name = 'btn'+ (btnTypeCount++) +'Type';
                    if(btnTypeCount == 5) {
                        btnTypeCount = 1;
                    }
                }
                if(tmp[j].name == 'cButtonContent') {
                    tmp[j].name = 'cButtonContent'+ (cButtonContentCount++);
                    if(cButtonContentCount == 5) {
                        cButtonContentCount = 1;
                    }
                }
                if(tmp[j].name == 'cButtonName') {
                    tmp[j].name = 'cButtonName'+ (cButtonNameCount++);
                    if(cButtonNameCount == 5) {
                        cButtonNameCount = 1;
                    }
                }
                
                if (typeof objectCarousel[tmp[j].name] !== "undefined" ) {
                    carouselArr.push(objectCarousel);
                    objectCarousel = {};
                    btnTypeCount = 1;
                    cButtonContentCount = 1;
                    cButtonNameCount = 1;
                } 

                if(j === tmp.length-1){
                    object[tmp[0].name] = tmp[0].value;
                    objectCarousel[tmp[j].name] = tmp[j].value;    

                    carouselArr.push(objectCarousel);
                    objectCarousel = {};
                    break;
                }
                object[tmp[0].name] = tmp[0].value;
                objectCarousel[tmp[j].name] = tmp[j].value;
            }
            //carouselArr.push(objectCarousel);
            object['carouselArr'] = carouselArr;
        } else if (tmp[0].value === "4") {

            var btnTypeCount = 1;
            var mButtonContentCount = 1;
            var mButtonNameCount = 1;

            for (var j = 0; j < tmp.length; j++) {

                if(tmp[j].name == 'btnType') {
                    tmp[j].name = 'btn'+ (btnTypeCount++) +'Type';
                }
                if(tmp[j].name == 'mButtonContent') {
                    tmp[j].name = 'mButtonContent'+ (mButtonContentCount++);
    
                }
                if(tmp[j].name == 'mButtonName') {
                    tmp[j].name = 'mButtonName'+ (mButtonNameCount++);
                }

                object[tmp[j].name] = tmp[j].value;
            }
            
        } else {
            for (var j = 0; j < tmp.length; j++) {
                object[tmp[j].name] = tmp[j].value;
            }
        }

        
        
        array[i] = JSON.stringify(object);//JSON.stringify(tmp);//tmp.substring(1, tmp.length-2);
    }
    //JSON.stringify($("form[name=appInsertForm]").serializeObject());
    array[array.length] = JSON.stringify($("form[name=appInsertForm]").serializeObject());//JSON.stringify($("form[name=appInsertForm]"));

    $.ajax({
        url: '/learning/addDialog',
        dataType: 'json',
        type: 'POST',
        data: {'data' : array/*, 'entities' : chkEntities*/},
        success: function(data) {
            alert(language.Added);

            var inputUttrHtml = '';
            for(var i = 0; i < data.list.length; i++) {
                inputUttrHtml += '<input type="hidden" name="dlgId" value="' + data.list[i] + '"/>';
            }
            var largeGroup = $('#appInsertForm').find('#largeGroup')[0].value
            var middleGroup;
             $('#appInsertForm').find('[name=middleGroup]').each(function() {
                if($(this).attr('disabled') == undefined) {
                    middleGroup = $(this).val();
                    return false;
                }
            })
            $('.newMidBtn').click();
            $('.cancelMidBtn').click();

            inputUttrHtml += '<input type="hidden" name="luisId" value="' + largeGroup + '"/>';
            inputUttrHtml += '<input type="hidden" name="luisIntent" value="' + middleGroup + '"/>';

            var createDlgClone = $('.dialogView').children().clone();
            $('#dlgViewDiv').html('');
            $('#dlgViewDiv').append(createDlgClone);
            $('#dlgViewDiv').append(inputUttrHtml);
            $('.createDlgModalClose').click();
        }
    });
}

var botChatNum = 1; 
//dlg ����
var dlgMap = new Object();
function selectDlgListAjax(entity) {
    $.ajax({
        url: '/learning/selectDlgListAjax',                //�ּ�
        dataType: 'json',                  //������ ����
        type: 'POST',                      //���� Ÿ��
        data: {'entity':entity},      //�����͸� json ����, ��ü�������� ����

        success: function(result) {          //�������� �� �Լ� ���� ������ ��� �� ����
            var inputUttrHtml = '';
            for (var i=0; i<result['list'].length; i++) {
                var tmp = result['list'][i];

                for(var j = 0; j < tmp.dlg.length; j++) {
                    if(tmp.dlg[j].DLG_TYPE == 2) {
                        inputUttrHtml += '<div class="wc-message wc-message-from-bot">';
                        inputUttrHtml += '<div class="wc-message-content">';
                        inputUttrHtml += '<svg class="wc-message-callout"></svg>';
                        inputUttrHtml += '<div><div class="format-markdown"><div class="textMent">';
                        inputUttrHtml += '<p>';
                        inputUttrHtml += '<input type="hidden" name="dlgId" value="' + tmp.dlg[j].DLG_ID + '"/>';
                        inputUttrHtml += '<input type="hidden" name="luisId" value="' + tmp.LUIS_ID + '"/>';
                        inputUttrHtml += '<input type="hidden" name="luisIntent" value="' + tmp.LUIS_INTENT + '"/>';
                        inputUttrHtml += tmp.dlg[j].CARD_TEXT;
                        inputUttrHtml += '</p>';
                        inputUttrHtml += '</div></div></div></div></div>';
                    } else if(tmp.dlg[j].DLG_TYPE == 3) {
                        
                        if(j == 0) {
                            inputUttrHtml += '<div class="wc-message wc-message-from-bot" style="width:90%">';
                            inputUttrHtml += '<div class="wc-message-content" style="width:90%;">';
                            inputUttrHtml += '<svg class="wc-message-callout"></svg>';
                            inputUttrHtml += '<div class="wc-carousel slideBanner" style="width: 312px;">';
                            inputUttrHtml += '<div>';
                            inputUttrHtml += '<button class="scroll previous" id="prevBtn' + (botChatNum) + '" style="display: none;" onclick="prevBtn(' + botChatNum + ', this)">';
                            inputUttrHtml += '<img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png">';
                            inputUttrHtml += '</button>';
                            inputUttrHtml += '<div class="wc-hscroll-outer" >';
                            inputUttrHtml += '<div class="wc-hscroll" style="margin-bottom: 0px;" class="content" id="slideDiv' + (botChatNum) + '">';
                            inputUttrHtml += '<ul style="padding-left:0px;">';
                            inputUttrHtml += '<input type="hidden" name="dlgId" value="' + tmp.dlg[j].DLG_ID + '"/>';
                            inputUttrHtml += '<input type="hidden" name="luisId" value="' + tmp.LUIS_ID + '"/>';
                            inputUttrHtml += '<input type="hidden" name="luisIntent" value="' + tmp.LUIS_INTENT + '"/>';
                        }
                        inputUttrHtml += '<li class="wc-carousel-item">';
                        inputUttrHtml += '<div class="wc-card hero">';
                        inputUttrHtml += '<div class="wc-container imgContainer" >';
                        inputUttrHtml += '<img src="' + tmp.dlg[j].IMG_URL +'">';
                        inputUttrHtml += '</div>';
                        if(tmp.dlg[j].CARD_TITLE != null) {
                            inputUttrHtml += '<h1>' + /*cardtitle*/ tmp.dlg[j].CARD_TITLE + '</h1>';
                        }
                        if(tmp.dlg[j].CARD_TEXT != null) {
                            inputUttrHtml += '<p class="carousel">' + /*cardtext*/ tmp.dlg[j].CARD_TEXT + '</p>';
                        }
                        inputUttrHtml += '<ul class="wc-card-buttons"><li><button>' + /*btntitle*/ tmp.dlg[j].BTN_1_TITLE + '<button></li></ul>';
                        inputUttrHtml += '</div>';
                        inputUttrHtml += '</li>';
                        
                        //���̾�αװ� �Ѱ��϶����� ������ ��ư x
                        if((tmp.dlg.length == 2 && j == 1) || (tmp.dlg.length == 1 && j == 0)) {
                            inputUttrHtml += '</ul>';
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '</div></div></div></div></div>';
                        } else if((tmp.dlg.length-1) == j) {
                            inputUttrHtml += '</ul>';
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '<button class="scroll next" id="nextBtn' + (botChatNum) + '" onclick="nextBtn(' + botChatNum + ', this)"><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png"></button>';
                            inputUttrHtml += '</div></div></div></div></div>';
                        }
                   
                    } else if(tmp.dlg[j].DLG_TYPE == 4) {
                        inputUttrHtml += '<div class="wc-message wc-message-from-bot">';
                        inputUttrHtml += '<div class="wc-message-content">';
                        inputUttrHtml += '<svg class="wc-message-callout"></svg>';
                        inputUttrHtml += '<div>';
                        inputUttrHtml += '<div class="wc-carousel">';
                        inputUttrHtml += '<div>';
                        inputUttrHtml += '<button class="scroll previous" disabled=""><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png"></button>';
                        inputUttrHtml += '<div class="wc-hscroll-outer">';
                        inputUttrHtml += '<div class="wc-hscroll" style="margin-bottom: 0px;">';
                        inputUttrHtml += '<ul style="padding-left:0px;>';
                        inputUttrHtml += '<li class="wc-carousel-item wc-carousel-play">';
                        inputUttrHtml += '<div class="wc-card hero">';
                        inputUttrHtml += '<div class="wc-card-div imgContainer">';
                        inputUttrHtml += '<input type="hidden" name="dlgId" value="' + tmp.dlg[j].DLG_ID + '"/>';
                        inputUttrHtml += '<input type="hidden" name="luisId" value="' + tmp.LUIS_ID + '"/>';
                        inputUttrHtml += '<input type="hidden" name="luisIntent" value="' + tmp.LUIS_INTENT + '"/>';
                        inputUttrHtml += '<img src="' + /* �̹��� url */ tmp.dlg[j].MEDIA_URL + '">';
                        inputUttrHtml += '<div class="playImg"></div>';
                        inputUttrHtml += '<div class="hidden" alt="' + tmp.dlg[j].CARD_TITLE + '"></div>';
                        inputUttrHtml += '<div class="hidden" alt="' + /* media url */ tmp.dlg[j].CARD_VALUE + '"></div>';
                        inputUttrHtml += '</div>';
                        inputUttrHtml += '<h1>' + /* title */ tmp.dlg[j].CARD_TITLE + '</h1>';
                        inputUttrHtml += '<ul class="wc-card-buttons">';
                        inputUttrHtml += '</ul>';
                        inputUttrHtml += '</div>';
                        inputUttrHtml += '</li>';

                        //���̾�αװ� �Ѱ��϶����� ������ ��ư x
                        if((tmp.dlg.length == 2 && j == 1) || (tmp.dlg.length == 1 && j == 0)) {
                            inputUttrHtml += '</ul>';
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '</div></div></div></div></div>';
                        } else if((tmp.dlg.length-1) == j) {
                            inputUttrHtml += '</ul>';
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '<button class="scroll next" id="nextBtn' + (botChatNum) + '" onclick="nextBtn(' + botChatNum + ', this)"><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png"></button>';
                            inputUttrHtml += '</div></div></div></div></div>';
                        }

                    }
                }

                //inputUttrHtml += '<tr> <td> <div class="check-radio-tweak-wrapper" type="checkbox">';
                //inputUttrHtml += '<input name="dlgChk" class="tweak-input"  onclick="" type="checkbox"/> </div> </td>';
                //inputUttrHtml += '<td class="txt_left" ><input type="hidden" name="' + tmp.DLG_ID + '" value="' + tmp.DLG_ID + '" />' + tmp.CARD_TEXT + '</td></tr>';
                //inputUttrHtml += '<td class="txt_center" > <a href="#" class="btn btn-small">Add</a> </td></tr>';
            }//<a href="#" class="btn b02  btn-small js-modal-close">Cancel</a>
            //$('#dlgListTable').find('tbody').empty();

            $('#dlgViewDiv').prepend(inputUttrHtml);

            //dlg ���.
            var utter ="";
            for (var i=0; i<entity.length; i++) {
                utter += entity[i] + ",";
            }
            utter = utter.substr(0, utter.length-1);
            dlgMap[utter] = inputUttrHtml;

            botChatNum++;
        } 

    }); // ------      ajax ��-----------------
}





//������ ��ư Ŭ���� �����̵�
function nextBtn(botChatNum, e) {

    var width = parseInt($(e).parent().parent().css('width'));
    $("#slideDiv" + botChatNum).animate({scrollLeft : (parseInt($("#slideDiv" + botChatNum).scrollLeft()) + width)}, 500, function(){

        if($("#slideDiv" + botChatNum).scrollLeft() == 
                ($("#slideDiv" + botChatNum).find(".wc-carousel-item").length - 2) * (width / 2)) {
            $("#nextBtn" + botChatNum).hide();
        }
        
    });

    $("#prevBtn" + botChatNum).show();
}

//���� ��ư Ŭ���� �����̵�
function prevBtn(botChatNum, e) {

    var width = parseInt($(e).parent().parent().css('width'));
    $("#slideDiv" + botChatNum).animate({scrollLeft : ($("#slideDiv" + botChatNum).scrollLeft() - width)}, 500, function() {
        
        if($("#slideDiv" + botChatNum).scrollLeft() == 0) {
            $("#prevBtn" + botChatNum).hide();
        }
    });
    
    $("#nextBtn" + botChatNum).show();
}


//checkbox ���ý� �̺�Ʈ $(this).attr("checked")
/*
$(document).on('ifChecked', '.icheckbox_flat-green',function(event){
    
    var checkedVal = false;
    var checkedVal2 = false;

    if ($(this).hasClass("checked") == false) {
        $(this).iCheck('check');
    } else {
        $(this).iCheck('uncheck');
    }
    

    $("input[name=tableCheckBox]").each(function() {
        if ($(this).parent().hasClass("checked") != false) {
            checkedVal = true;
        } 
    });
    //changeBtnAble('delete', checkedVal);

    $("input[name=dlgChk]").each(function() {
        if ($(this).parent().hasClass("checked") != false) {
            checkedVal2 = true;
        } 
    });

    if(checkedVal == true && checkedVal2 == true) {
        changeBtnAble('learn', true);
    } else {
        changeBtnAble('learn', false);
    }

});

*/

function utterInput(queryText) {
    var queryTextArr = [];
    if (typeof queryText === 'string') {
        queryTextArr[0] = queryText;
    } else {  //'object'
        queryTextArr = queryText.reverse();
    }


    $.ajax({
        url: '/learning/utterInputAjax',                //�ּ�
        dataType: 'json',                  //������ ����
        type: 'POST',                      //���� Ÿ��
        data: {'iptUtterance': queryTextArr},      //�����͸� json ����, ��ü�������� ����

        success: function(result) {          //�������� �� �Լ� ���� ������ ��� �� ����
            var entities = result['entities'];
            for (var k=0; k< queryTextArr.length; k++) {

                
                if(entities[k] != null) {
                    entities[k] = entities[k].split(",");
                }else{
                    entities[k] = [];
                }
    
                if ( result['result'] == true ) {
                    var utter = utterHighlight(result.commonEntities[k],result['iptUtterance'][k]);
                    var selBox = result['selBox'];
    
                    $('input[name="iptUtterance"').val('');
                    var inputUttrHtml = '';
                    inputUttrHtml += '<tr><input type="hidden" name="hiddenUtter" value="' + queryText + '"/>';
                    inputUttrHtml += '<td> <input type="checkbox" name="tableCheckBox" class="flat-red"></td>';
                    inputUttrHtml += '<td class="txt_left clickUtter"><input type=hidden name="entity" value="' + result['entities'][k] + '"/>' + utter + '</td>';
                    inputUttrHtml += '<td><a href="#"><span class="fa  fa-trash utterDelete"><span class="hc">����</span></span></a></td></tr>';
                    inputUttrHtml += '<tr><td></td><td class="txt_left">';
                    
                    if(result.commonEntities[k]){
                        for(var i = 0; i < result.commonEntities[k].length ; i++){
                            var commonTmp = result.commonEntities[k];
                            inputUttrHtml += '<input type=hidden value="' + commonTmp[i].ENTITY_VALUE + '"/>' + commonTmp[i].ENTITY_VALUE + '::' + commonTmp[i].ENTITY;
                            if(i != commonTmp[i].length - 1 ) {
                                inputUttrHtml += "&nbsp&nbsp";
                            }
                        }
                    }else{
                        inputUttrHtml += language.NoEntity;
                    }
                    inputUttrHtml += '</td><td></td></tr>';
             
                    /*
                    if(result.commonEntities){
                        for(var i = 0; i < result.commonEntities.length ; i++){
                            inputUttrHtml += '<tr> <td> </td>';
                            inputUttrHtml += '<td class="txt_left" ><input type=hidden value="' + result.commonEntities[i].ENTITY_VALUE + '"/>' + result.commonEntities[i].ENTITY_VALUE + '::' + result.commonEntities[i].ENTITY + '</td>';
                        }
                    }
                    */
                    //inputUttrHtml += '<td class="txt_right02" >'; 
                    //inputUttrHtml += '<select id="intentNameList" name="intentNameList" class="select_box">'
                    /*
                    if(selBox != null) {
                        for( var i = 0 ; i < selBox.length; i++) {
                            inputUttrHtml += '<option value="' + selBox[i]['LUIS_INTENT'] + '">' + selBox[i]['LUIS_INTENT'] + '</option>'
                        }
                        selectDlgListAjax(selBox[0]['LUIS_INTENT']);
                    } else {
                        inputUttrHtml += '<option value="" selected>no intent</option>'
                    }
    
                    inputUttrHtml += '</select></td></tr>';
                    */
                    $('.recommendTbl').find('tbody').prepend(inputUttrHtml);
    
                    selectDlgListAjax(entities[k]);
    
                    pagingFnc();

                    //Flat red color scheme for iCheck
                    $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
                        checkboxClass: 'icheckbox_flat-green',
                        radioClass   : 'iradio_flat-green'
                    })
                    

                }
            }
        } //function��

    }); // ------      ajax ��-----------------

    
}

$(document).on('ifChecked','input[name=tableAllChk]', function() {  
    
    $('input[name=tableCheckBox]').parent().iCheck('check');
});

$(document).on('ifUnchecked','input[name=tableAllChk]', function() {  
   
    $('input[name=tableCheckBox]').parent().iCheck('uncheck');
});


function utterHighlight(entities, utter) {
    var result = utter;
    if(entities){
        for(var i = 0; i < entities.length; i++) {
            result = result.replace(entities[i].ENTITY_VALUE, '<span class="highlight">' + entities[i].ENTITY_VALUE + '</span>');
        }
    }
    return result;
}

function selectGroup(selectId,str1,str2) {
    $.ajax({
        url: '/learning/selectGroup',                //�ּ�
        dataType: 'json',                  //������ ����
        type: 'POST',
        data: {'selectId':selectId,'selectValue1':str1,'selectValue2':str2},
        success: function(result) {
            var group = result.rows;
            $("#"+selectId).html("");
            if(selectId == "searchLargeGroup") {
                $("#"+selectId).append('<option value="">' + language.Large_group + '</option>');
                $('#searchMediumGroup').html("");
                $('#searchSmallGroup').html("");
                $('#searchMediumGroup').append('<option value="">' + language.Middle_group + '</option>');
                $('#searchSmallGroup').append('<option value="">' + language.Small_group + '</option>');
            } else if(selectId == "searchMediumGroup") {
                $("#"+selectId).append('<option value="">' + language.Middle_group + '</option>' );
                $('#searchSmallGroup').html("");
                $('#searchSmallGroup').append('<option value="">' + language.Small_group + '</option>');
            } else {
                $('#searchSmallGroup').append('<option value="">' + language.Small_group + '</option>');
            }
            for(var i = 0; i < group.length; i++){
                $("#"+selectId).append('<option value="' + group[i]['GROUP'] + '">' + group[i]['GROUP'] + '</option>' );
            }
        }
    });
}




function selectInent(intent) {
    //intent���� entity �����ϸ� entity select box disable���ŵǰ� �����ؾ���
    $('#entityList').removeAttr("disabled");
}

function selectEntity(entity) {
    //intent���� entity �����ϸ� entity select box disable���ŵǰ� �����ؾ���
    $('#btnAddDlg').removeAttr("disabled");
    $('#btnAddDlg').removeClass("disable");
}

function initMordal(objId, objName) {
    //<option selected="selected" disabled="disabled">Select Intent<!-- ���� ���� --></option>
    if (objId == 'entityList') {
        $('#'+ objId).attr("disabled", "disabled");
    }
    $('#btnAddDlg').attr("disabled", "disabled");
    $('#btnAddDlg').addClass("disable");

    $('#'+ objId + ' option:eq(0)').remove();
    $('#'+ objId ).prepend('<option selected="selected" disabled="disabled">' + objName + '</option>');

}

function searchDialog() {
    var formData = $("form[name=searchForm]").serialize();
    $.ajax({
        url: '/learning/searchDialog',
        dataType: 'json',
        type: 'POST',
        data: formData,
        success: function(result) {

            var inputUttrHtml = '';

            var row = [];
            var arrayNum = 0;
            for (var k = 0; k < result['list'].length; k++) {
                if(k != 0 && result['list'][k].RNUM == result['list'][k-1].RNUM) {
                    var num = result['list'][k].DLG_ORDER_NO - 1;
                    arrayNum--;
                    row[arrayNum][num] = result['list'][k];
                    arrayNum++;
                } else{
                    row[arrayNum] = [];
                    row[arrayNum][0] = result['list'][k];
                    arrayNum++;
                }
            }

            for (var i = 0; i < row.length; i++) {
                botChatNum++;
                var val = row[i];

                inputUttrHtml += '<div class="chat_box">';
                inputUttrHtml += '<p><input type="checkbox" name="searchDlgChk" class="flat-red"></p>';          
                inputUttrHtml += '<div style="width: 100%; height: 95%; overflow: scroll; overflow-x: hidden; padding:10px;">';
                inputUttrHtml += '<div>';

                for(var l = 0; l < val.length; l++){
                    var tmp = val[l];

                    for(var j = 0; j < tmp.dlg.length; j++) {

                        if(tmp.dlg[j].DLG_TYPE == 2) {

                            inputUttrHtml += '<div class="wc-message wc-message-from-bot">';
                            inputUttrHtml += '<div class="wc-message-content">';
                            inputUttrHtml += '<svg class="wc-message-callout"></svg>';
                            inputUttrHtml += '<div><div class="format-markdown"><div class="textMent">';
                            inputUttrHtml += '<p>';
                            inputUttrHtml += '<input type="hidden" name="dlgId" value="' + tmp.dlg[j].DLG_ID + '"/>';
                            inputUttrHtml += '<input type="hidden" name="luisId" value="' + tmp.GroupL + '"/>';
                            inputUttrHtml += '<input type="hidden" name="luisIntent" value="' + tmp.GroupM + '"/>';
                            inputUttrHtml += tmp.dlg[j].CARD_TEXT;
                            inputUttrHtml += '</p>';
                            inputUttrHtml += '</div></div></div></div></div>';

                        } else if(tmp.dlg[j].DLG_TYPE == 3) {

                            if(j == 0) {
                                inputUttrHtml += '<div class="wc-message wc-message-from-bot">';
                                inputUttrHtml += '<div class="wc-message-content">';
                                inputUttrHtml += '<svg class="wc-message-callout"></svg>';
                                inputUttrHtml += '<div class="wc-carousel slideBanner" style="width:280px;">';
                                inputUttrHtml += '<div>';
                                inputUttrHtml += '<button class="scroll previous" id="prevBtn' + (botChatNum) + '" style="display: none;" onclick="prevBtn(' + botChatNum + ', this)">';
                                inputUttrHtml += '<img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png">';
                                inputUttrHtml += '</button>';
                                inputUttrHtml += '<div class="wc-hscroll-outer" >';
                                inputUttrHtml += '<div class="wc-hscroll" style="margin-bottom: 0px;" class="content" id="slideDiv' + (botChatNum) + '">';
                                inputUttrHtml += '<ul style="padding-left: 0px;">';
                                inputUttrHtml += '<input type="hidden" name="dlgId" value="' + tmp.dlg[j].DLG_ID + '"/>';
                                inputUttrHtml += '<input type="hidden" name="luisId" value="' + tmp.GroupL + '"/>';
                                inputUttrHtml += '<input type="hidden" name="luisIntent" value="' + tmp.GroupM + '"/>';
                            }
                            inputUttrHtml += '<li class="wc-carousel-item">';
                            inputUttrHtml += '<div class="wc-card hero">';
                            inputUttrHtml += '<div class="wc-container imgContainer" >';
                            if(tmp.dlg[j].IMG_URL != null) {

                                inputUttrHtml += '<img src="' + tmp.dlg[j].IMG_URL +'">';
                            }
                            inputUttrHtml += '</div>';
                            if(tmp.dlg[j].CARD_TITLE != null) {
                                inputUttrHtml += '<h1 style="margin-top: 0px;">' + /*cardtitle*/ tmp.dlg[j].CARD_TITLE + '</h1>';
                            }
                            if(tmp.dlg[j].CARD_TEXT != null) {

                                inputUttrHtml += '<p class="carousel">' + /*cardtext*/ tmp.dlg[j].CARD_TEXT + '</p>';
                            }
                            if(tmp.dlg[j].BTN_1_TITLE != null) {
                                inputUttrHtml += '<ul class="wc-card-buttons" style="padding-left:0px;"><li><button>' + /*btntitle*/ tmp.dlg[j].BTN_1_TITLE + '</button></li></ul>';
                            }
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '</li>';
                            
                            //���̾�αװ� �Ѱ��϶����� ������ ��ư x
                            if((tmp.dlg.length == 2 && j == 1) || (tmp.dlg.length == 1 && j == 0)) {
                                inputUttrHtml += '</ul>';
                                inputUttrHtml += '</div>';
                                inputUttrHtml += '</div>';
                                inputUttrHtml += '</div></div></div></div>';
                            } else if((tmp.dlg.length-1) == j) {
                                inputUttrHtml += '</ul>';
                                inputUttrHtml += '</div>';
                                inputUttrHtml += '</div>';
                                inputUttrHtml += '<button class="scroll next" id="nextBtn' + (botChatNum) + '" onclick="nextBtn(' + botChatNum + ', this)"><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png"></button>';
                                inputUttrHtml += '</div></div></div></div>';
                            }
                        } else if(tmp.dlg[j].DLG_TYPE == 4) {
                            inputUttrHtml += '<div class="wc-message wc-message-from-bot">';
                            inputUttrHtml += '<div class="wc-message-content">';
                            inputUttrHtml += '<svg class="wc-message-callout"></svg>';
                            inputUttrHtml += '<div>';
                            inputUttrHtml += '<div class="wc-carousel">';
                            inputUttrHtml += '<div>';
                            inputUttrHtml += '<button class="scroll previous" disabled=""><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png"></button>';
                            inputUttrHtml += '<div class="wc-hscroll-outer">';
                            inputUttrHtml += '<div class="wc-hscroll" style="margin-bottom: 0px;">';
                            inputUttrHtml += '<ul style="min-width:0px; padding-left: 0px;">';
                            inputUttrHtml += '<li class="wc-carousel-item wc-carousel-play">';
                            inputUttrHtml += '<div class="wc-card hero" style="width:70%">';
                            inputUttrHtml += '<div class="wc-card-div imgContainer">';
                            inputUttrHtml += '<input type="hidden" name="dlgId" value="' + tmp.dlg[j].DLG_ID + '"/>';
                            inputUttrHtml += '<input type="hidden" name="luisId" value="' + tmp.GroupL + '"/>';
                            inputUttrHtml += '<input type="hidden" name="luisIntent" value="' + tmp.GroupM + '"/>';
                            inputUttrHtml += '<img src="' + /* �̹��� url */ tmp.dlg[j].MEDIA_URL + '">';
                            inputUttrHtml += '<div class="playImg"></div>';
                            inputUttrHtml += '<div class="hidden" alt="' + tmp.dlg[j].CARD_TITLE + '"></div>';
                            inputUttrHtml += '<div class="hidden" alt="' + /* media url */ tmp.dlg[j].CARD_VALUE + '"></div>';
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '<h1>' + /* title */ tmp.dlg[j].CARD_TITLE + '</h1>';
                            inputUttrHtml += '<ul class="wc-card-buttons">';
                            inputUttrHtml += '</ul>';
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '</li>';
                            
                            //���̾�αװ� �Ѱ��϶����� ������ ��ư x
                            if((tmp.dlg.length == 2 && j == 1) || (tmp.dlg.length == 1 && j == 0)) {
                                inputUttrHtml += '</ul>';
                                inputUttrHtml += '</div>';
                                inputUttrHtml += '</div>';
                                inputUttrHtml += '</div></div></div></div></div>';
                            } else if((tmp.dlg.length-1) == j) {
                                inputUttrHtml += '</ul>';
                                inputUttrHtml += '</div>';
                                inputUttrHtml += '</div>';
                                inputUttrHtml += '<button class="scroll next" id="nextBtn' + (botChatNum) + '" onclick="nextBtn(' + botChatNum + ', this)"><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png"></button>';
                                inputUttrHtml += '</div></div></div></div></div>';
                            }
                        }
                    }
                }
            
                inputUttrHtml += '</div>';
                inputUttrHtml += '</div>';
                inputUttrHtml += '</div>';
            }
            
            $(".dialog_result strong").html(" " + row.length +" ");
            $('#searchDlgResultDiv').prepend(inputUttrHtml);

            //Flat red color scheme for iCheck
            $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass   : 'iradio_flat-green'
            })
           
        },
        error:function(e){  
            alert(e.responseText);  
        }  
    });
}

// Search Dialogue �˾�â 
// ���̾�α� üũ�ڽ� ���� üũ
$(document).on('ifChecked', 'input[name=searchDlgChk]', function(event) {
    
    $('input[name=searchDlgChk]').not($(this)).each(function(){
        $(this).parent().iCheck('uncheck')
    });
        
})

function selectDialog() {

    var successFlagg = false;
    $("input[name=searchDlgChk]").each(function(n) {
        var chk = $(this).parent().hasClass('checked');
        if(chk == true) {
            var cloneDlg = $(this).parent().parent().next().children().clone();
            $('#dlgViewDiv').html('');
            $('#dlgViewDiv').append(cloneDlg);
            $('.previous').hide();
            $('.next').show();
            $('.searchDialogClose').click();
            successFlagg = true;
            return false;
        }
    });

    if(successFlagg == false) {

        alert(language.Please_select_a_dialogue);
    }

}

/*
function searchSaveDialog() {

    
    var entity = $('input[name=entity]').val();

    var rowNum;
    $("input[name=chksearch]").each(function(n) {
        var chk = $("input[name=chksearch]").parent().eq(n).attr('checked');
        if(chk == "checked") {
            rowNum = n;
        }
    });

    var dlgId = [];

    $("input[name=chksearch]").parent().parent().eq(rowNum).next().find('input[name=searchDlgId]').each(function(n){
        dlgId[n] = $(this).val();
    });

    $.ajax({
        url: '/learning/learnUtterAjax',
        dataType: 'json',
        type: 'POST',
        data: {'entity':entity, 'dlgId':dlgId},
        success: function(result) {
            alert('�߰� �Ǿ����ϴ�.');
            $("#searchDialogCancel").click();
        }
    });
    


}
*/
/*
$(document).on('click', '.carouseBtn',function(e){
    //e.stopPropagation();
    //e.preventDefault();
    //var index = 0;
    $(this).parent().parent().find('select').each(function(index) {
        if ( $(this).css("display") === 'none') {
            $(this).show().removeAttr('disabled');
            $(this).parent().next().find('input').eq(index).show().removeAttr('disabled');;
            $(this).parent().next().next().find('input').eq(index).show().removeAttr('disabled');;
            return false;   
        }
    });
});
*/

//���̾�α׻������ - ��ư�߰�
$(document).on('click', '.carouseBtn',function(e){

    var inputHtml = '<div><label>' + language.BUTTON + '</label></div>' +
                '<div class="form-group col-md-13"  style="padding-left:0; margin-top: 0px;">' +
                '<table class="cardCopyTbl" style="width:100%">' +
                '<col width="21%"><col width="1%"><col width="35%">' +
                '<col width="1%"><col width="35%"><col width="1%"><col width="6%">' +
                '<thead><tr>' + 
                '<th>' + language.Type + '</th><th></th><th>' + language.NAME + '</th>'+
                '<th></th><th>' + language.CONTENTS + '</th><th></th><th></th>' +
                '</tr></thead>' +
                '<tbody>' +
                '<tr>'+
                '<td><select class="form-control" name="btnType"><option value="imBack" selected>imBack</option>' +
                '<option value="openURL">openURL</option></select></td>' +
                '<td></td><td><input type="text" name="cButtonName" class="form-control" placeholder="' + language.Please_enter + '" spellcheck="false" autocomplete="off"></td>' +
                '<td></td><td><input type="text" name="cButtonContent" class="form-control" placeholder="' + language.Please_enter + '" spellcheck="false" autocomplete="off"></td>' +
                '<td></td><td><a href="#" class="btn_delete" style="margin:0px;"><span class="fa fa-trash"></span></a></td>' +
                '</tr></tbody></table></div>';
               
    $btnInsertDiv = $(this).parent().prev().prev().prev();
    if($btnInsertDiv.children().length == 0) {
        $btnInsertDiv.html(inputHtml);
        return;
    }
    var trLength = $(this).parent().prev().prev().prev().find('.cardCopyTbl tbody tr').length;
    if(trLength >= 1 && trLength < 4) {
        
        var inputTrHtml = '<tr>'+
                '<td><select class="form-control" name="btnType"><option value="imBack" selected>imBack</option>' +
                '<option value="openURL">openURL</option></select></td>' +
                '<td></td><td><input type="text" name="cButtonName" class="form-control" placeholder="' + language.Please_enter + '" spellcheck="false" autocomplete="off"></td>' +
                '<td></td><td><input type="text" name="cButtonContent" class="form-control" placeholder="' + language.Please_enter + '" spellcheck="false" autocomplete="off"></td>' +
                '<td></td><td><a href="#" class="btn_delete" style="margin:0px;"><span class="fa fa-trash"></span></a></td>' +
                '</tr>'
                $(this).parent().prev().prev().prev().find('.cardCopyTbl tbody').append(inputTrHtml);





    } else {
        alert(language.ALERT_BUUTON_CNT);
    }

});

//���̾�α׻������ - ���̾�α׻���
$(document).on('click', '.deleteInsertForm',function(e){

    insertFormLength = $('.insertForm').length;
    if(insertFormLength == 1) {
        alert(language.You_must_have_one_dialog_by_default);
    } else {
        var idx = $(".deleteInsertForm").index(this);
        if(idx == 0) {

            $(this).parents('.insertForm').next().remove();
        }
        $(".dialogView").eq(idx).remove();
        $(this).parents('.insertForm').prev().remove();
        $(this).parents('.insertForm').remove();
    }
    $(this).parents('.insertForm'); 
});

//���̾�α׻������ - ī����� 
$(document).on('click', '.deleteCard',function(e){

    var insertFormIdx;
    $('.insertForm').each(function(count){
        if($(this)[0] == $(e.target).parents('#commonLayout').find($('.insertForm').find(e.target).parents('.insertForm'))[0]) {
            insertFormIdx = count;
        }
    })
    insertFormLength = $('.insertForm').length;

    var carouselLayoutLength = $(this).parents('form[name=dialogLayout]').find('.carouselLayout').length;
    var idx = $(this).parents('form[name=dialogLayout]').find('.carouselLayout').find('.deleteCard').index(this);
    
    if(insertFormLength == 1) {

        if(carouselLayoutLength == 1) {
            alert(language.You_must_have_at_least_one_card);

        } else {

            if($('.dialogView').eq(insertFormIdx).find('.slideDiv .wc-carousel-item').length == 3) {
                $('.dialogView').eq(insertFormIdx).find('.next').hide();
                $('.dialogView').eq(insertFormIdx).find('.previous').hide();
            }

            $('.dialogView').eq(insertFormIdx).find('.slideDiv .wc-carousel-item').eq(idx).remove();
            $(this).parent().parent().prev().remove();
            $(this).parent().parent().remove();
        }

    } else {

        if(carouselLayoutLength == 1) {
            alert(language.You_must_have_at_least_one_card);
        } else {

            if($('.dialogView').eq(insertFormIdx).find('.slideDiv .wc-carousel-item').length == 3) {
                $('.dialogView').eq(insertFormIdx).find('.next').hide();
                $('.dialogView').eq(insertFormIdx).find('.previous').hide();
            }

            $(".dialogView").eq(insertFormIdx).find('.slideDiv .wc-carousel-item').eq(idx).remove();
            $(this).parent().parent().prev().prev().remove();
            $(this).parent().parent().prev().remove();
            $(this).parent().parent().remove();
        }

    }

});

//���̾�α׻������ - ��ư����
$(document).on('click', '.btn_delete',function(e){

    var trLength = $(this).parents('tbody').children().length;
    if(trLength == 1) {
        $(this).parents('.btnInsertDiv').html('');
        return;
    }
    $(this).parent().parent().remove();
});



//���̾�α׻������ - �̵���ư�߰�
$(document).on('click', '.addMediaBtn',function(e){
    
    var inputHtml = '<label>' + language.BUTTON + '</label></div>' +
                    '<div class="form-group col-md-13"  style="padding-left:0; margin-top: 0px;">' +
                    '<table class="mediaCopyTbl" style="width:100%"><col width="21%">' +
                    '<col width="1%"><col width="35%"><col width="1%"><col width="35%"><col width="1%"><col width="6%">' +
                    '<thead><tr><th>' + language.Type + '</th><th></th>' +
                    '<th>' + language.NAME + '</th><th></th><th>' + language.CONTENTS + '</th>' +
                    '<th></th><th></th></tr></thead><tbody>' +
                    '<tr><td>' +
                    '<select class="form-control" name="btnType">' +
                    '<option value="imBack" selected>imBack</option>' +
                    '<option value="openURL">openURL</option>' +
                    '</select>' +
                    '</td><td></td>' +
                    '<td><input type="text" name="mButtonName" class="form-control" placeholder="' + language.Please_enter + '" spellcheck="false" autocomplete="off">' +
                    '</td><td></td><td>' +
                    '<input type="text" name="mButtonContent" class="form-control" placeholder="' + language.Please_enter + '" spellcheck="false" autocomplete="off">' +
                    '</td><td></td><td>' +
                    '<a href="#" class="btn_delete" style="margin:0px;"><span class="fa fa-trash"></span></a>' +
                    '</td></tr></tbody></table></div></div></div>';
               
    $btnInsertDiv = $(this).parent().prev();
    if($btnInsertDiv.children().length == 0) {
        $btnInsertDiv.html(inputHtml);
        return;
    }
    var trLength = $btnInsertDiv.find('tbody tr').length;
    if(trLength >= 1 && trLength < 4) {
        
        var inputTrHtml = '<tr>'+
                '<td>' +
                '<select class="form-control" name="btnType">' +
                '<option value="imBack" selected>imBack</option>' +
                '<option value="openURL">openURL</option>' +
                '</select>' +
                '</td><td></td>' +
                '<td><input type="text" name="mButtonName" class="form-control" placeholder="' + language.Please_enter + '" spellcheck="false" autocomplete="off"></td>' +
                '<td></td><td><input type="text" name="mButtonContent" class="form-control" placeholder="' + language.Please_enter + '" spellcheck="false" autocomplete="off"></td>' +
                '<td></td><td><a href="#" class="btn_delete" style="margin:0px;"><span class="fa fa-trash"></span></a></td>' +
                '</tr>'
                $(this).parent().prev().find('tbody').append(inputTrHtml);
    } else {
        alert(language.Up_to_4_buttons_can_be_added);
    }

});

//���̾�α׻��� - ī���߰�
//$(document).on('click', '.addCarouselBtn', function(e){
//    //var $newInsertForm = $insertForm.clone();
//    //var $newDlgForm = $dlgForm.clone();
//    //var $newCarouselForm = $carouselForm.clone();
    
//    if($(this).parents('.insertForm').find('.carouselLayout').length == 10) {
//        alert(language.Up_to_10_cards_can_be_added);
//    } else {

//        var idx =  $(".addCarouselBtn:visible").index(this);
//        var jdx = $('select[name=dlgType]').index(( $(".addCarouselBtn:visible").eq(idx).parents('form[name=dialogLayout]').find('select[name=dlgType]') ));
//        //$('.addCarouselBtn').eq(0).parent().parent().remove();
//        //$(this).parents('.insertForm').after( $newInsertForm);  
//        //<div id="textLayout" style="display: block;">  </div>
//        //var caraousHtml = '<div class="carouselLayout" style="display: block;">' + $carouselForm.html() + '</div>';
//        var dlgFormHtml = '<div class="textLayout" style="display: block;">' + dlgForm + '</div>';
//        $(this).parent().before('<div class="clear-both"></div>').before(dlgFormHtml).before(carouselForm);
//        //$(this).parents('form[name=dialogLayout] .deleteInsertFormDiv').before('<div class="clear-both"></div>').after(dlgFormHtml).append(carouselForm);
//        //$(this).parents('.insertForm').next().find('.clear-both').after($newDlgForm);
//        var claerLen = $(this).parents('form[name=dialogLayout]').children('.clear-both').length-1;
//        $(this).parents('form[name=dialogLayout]').children('.clear-both').eq(claerLen).next().css('display', 'block');
//        $(this).parents('form[name=dialogLayout]').children('.clear-both').eq(claerLen).next().next().css('display', 'block');
//        //$(this).parent().parent().remove();
//        //$(this).parent().css('display', 'none');
//        $(this).parents('form[name=dialogLayout]').find('.addCarouselBtn:last').closest('div').css('display', 'inline-block');
    
//        var inputUttrHtml = '<li class="wc-carousel-item">';
//        inputUttrHtml += '<div class="wc-card hero">';
//        inputUttrHtml += '<div class="wc-container imgContainer" >';
//        inputUttrHtml += '<img src="https://bot.hyundai.com/assets/images/movieImg/teasure/02_teaser.jpg">';
//        inputUttrHtml += '</div>';
//        inputUttrHtml += '<h1>CARD_TITLE</h1>';
//        inputUttrHtml += '<p class="carousel">CARD_TEXT</p>';
//        inputUttrHtml += '<ul class="wc-card-buttons" style="padding-left:0px;"><li><button>BTN_1_TITLE</button></li></ul>';
//        inputUttrHtml += '</div>';
//        inputUttrHtml += '</li>';
    
//        var kdx = $('.insertForm').index($(this).parents('.insertForm'));
    
//        $('.dialogView').eq( jdx ).find('#slideDiv' + kdx).children().append(inputUttrHtml);
        
//        if ($('.dialogView').eq( jdx ).find('#slideDiv' + kdx).children().children().length > 2) {
//            $('#nextBtn'+ jdx).show();
//        }
//    }
//});

//��ƼƼ �߰�
function insertEntity(){

    if ($('#entityDefine').val().trim() === "") {
        alert(language.Please_enter);
        return false;
    }
    var valueText = false;
    
    $('.entityValDiv input[name=entityValue]').each(function() {
        if ($(this).val().trim() === "") {
            valueText = true;
            return;
        }
    });

    if (valueText) {
        alert(language.Please_enter);
        return ;
    }

    var entityDefineVal = $('#entityDefine').val().trim();
    var apiGroupVal = $('#apiGroup :selected').val();
    var entityValueList = [];
    $('.entityValDiv input[name=entityValue]').each(function() {
        
        for (var i=0; i<entityValueList.length; i++) {
            if ( entityValueList[i].entityValue === $(this).val().trim()) {
                valueText = true;
            }
        }

        var obj = new Object();
        obj.entityDefine = entityDefineVal;
        obj.apiGroup = apiGroupVal;
        obj.entityValue = $(this).val().trim();
        entityValueList.push(obj);
    });

    if (valueText) {
        alert(language.DUPLICATE_ENTITIES_EXIST);
        return ;
    }

    $.ajax({
        url: '/learning/insertEntity',
        dataType: 'json',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(entityValueList), //$('#appInsertForm').serializeObject(),
        success: function(data) {
            if(data.status == 200){
                $('.addDialogCancel').click();
                alert(language.Added);
                entitiesAjax();
            } else if(data.status == 'Duplicate') {
                alert(language.DUPLICATE_ENTITIES_EXIST);
            } else {
                alert(language.It_failed);
            }
        }
    });
    
}

//���̾�α� ���� ���â - �߱׷� �űԹ�ư
$(document).on('click', '.newMidBtn, .cancelMidBtn', function() {

    var $iptLuisIntent = $('input[name=middleGroup]');
    var $selectLuisIntent = $('select[name=middleGroup]');

    if($(this).hasClass('newMidBtn')) {
        $('.newMidBtn').hide();
        $('.cancelMidBtn').show();

        $iptLuisIntent.show();
        $iptLuisIntent.removeAttr('disabled');

        $selectLuisIntent.hide();
        $selectLuisIntent.attr('disabled', 'disabled');
    } else {
        $('.newMidBtn').show();
        $('.cancelMidBtn').hide();

        $selectLuisIntent.show();
        $selectLuisIntent.removeAttr('disabled');

        $iptLuisIntent.hide();
        $iptLuisIntent.attr('disabled', 'disabled');
    }
})



function getGroupSeelectBox() {
    $.ajax({
        type: 'POST',
        url: '/learning/getGroupSelectBox',
        isloading: true,
        success: function(data) {
            var groupL = data.groupL;
            var groupM = data.groupM;

            var groupHtml = "";

            for(var i = 0; i < groupL.length; i++ ) {
                groupHtml += '<option value="' + groupL[i].GROUPL + '">' + groupL[i].GROUPL + '</option>';
            }

            $("#largeGroup").html(groupHtml);

            groupHtml = "";
            for(var i = 0; i < groupM.length; i++ ) {
                groupHtml += '<option value="' + groupM[i].GROUPM + '">' + groupM[i].GROUPM + '</option>';
            }

            $("#middleGroup").html(groupHtml);

        }
    });
}


function openApiMordal() {
    var entitiyCheckFlag = true;  
    var entitiyCheckCount = 0;
    $('input[name=tableCheckBox]').each(function() {
        if($(this).parent().hasClass('checked') == true) {               
            entitiyCheckCount++; 
            if($(this).parents('tr').find('input[name=entity]').val() == "") {
                entitiyCheckFlag = false;
            } 
        }
    })
    
    if(entitiyCheckCount == 0) {
        alert(language.ALERT_SELECTED_UTTER);
    } else if(entitiyCheckCount > 1) {
        alert(language.ALERT_CHOOSE_ONE_UTTER); 
    } else if(entitiyCheckCount == 1) {

        if(entitiyCheckFlag == false) {
            alert(language.ALERT_NO_ENTITIES);
        } else {

            //$('#utterTableBody').find('.checked').length
            var entitiesStr = "";
            $('#utterTableBody').find('.checked').parents('tr').find('.highlight').each(function(){
                entitiesStr += "," + $(this).text();
            });
            $('#inputEntity').text(entitiesStr.substr(1, entitiesStr.length));

            $('#apiGroupRelation').html(globalApiGroupStr);

            $('#apiAddBtnHidden').trigger('click');
        }
    }
}

function createApiRelation() {
    if ($('#apiGroupRelation').val().trim() === "") {
        alert(language.ALERT_SEL_API_GROUP);
        //alert(language.Please_enter);
        return;
    }
    if ($('#inputEntity').text().trim() === "") {
        alert(language.ALERT_SEL_RELATION_UTTER);
        return;
    }
    var params = {
        'inputEntity' : $('#inputEntity').text().trim(),
        'apiGroupRelation' : $('#apiGroupRelation').val().trim()
    };
    
    $.ajax({
        type: 'POST',
        data: params,
        url: '/learning/createApiRelation',
        success: function(data) {
            if(data.status == 200){
                $('.addApiCancel').click();
                alert(language.Added);
            } else if(data.status == 'Duplicate') {
                alert(language.DUPLICATE_ENTITIES_EXIST);
            } else {
                alert(language.It_failed);
            }
        }
    });
}



function selectScenarioList() {     //  시나리오 목록
    //alert('selectScenarioList()');
    $.ajax({
        url: '/learning/selectScenarioList',
        dataType: 'json',
        //data: {'searchInfo': searchInfo, 'luisId': luisId},
        type: 'POST',
        isloading: true,
        //data: {'selectId':selectId,'selectValue1':str1,'selectValue2':str2},
        success: function(data) {
            if(data.rows){
                //alert('data.rows');
                var scenarioList = data.rows;
                var strScenarioList = "";
                var j = 1;
                for(var i=0; i<scenarioList.length; i++){
                    j = i + 1;
                    strScenarioList += '<TR><TD>'+j+'</TD><TD><A href="#" onclick="getScenarioDialogs(\''+scenarioList[i].SCENARIO_NM+'\')">'+scenarioList[i].SCENARIO_NM+'</A></TD><TD>'+scenarioList[i].SCENARIO_COUNT+'</TD></TR>';
                    //alert('SCENARIO_NM : '+scenarioList[i].SCENARIO_NM);
                }
                $('#utterTableBody').html(strScenarioList);
            }else{
                alert('selectScenarioList fail');
            }
        }
    });
}

function getScenarioDialogs(strScenarioName){
    //alert('getScenarioDialogs():'+strScenarioName);
    
    $.ajax({
        url: '/learning/getScenarioDialogs',
        dataType: 'json',
        data: {'strScenarioName': strScenarioName},
        type: 'POST',
        isloading: true,
        success: function(data) {
            //alert('getScenarioDialogs SUCCESS!');
             
            if(data.list){
                //alert('data.list'+data.list);
                console.log(data.list);
                //alert('data.list'+data.list);
                 
                var dialogLists = data.list;
                var strDialogLists = "";
                var j = 1;
                for(var i=0; i<dialogLists.length; i++){

                    //strDialogLists += '<TR><TD>'+j+'</TD><TD><A href="#" onclick="">'+dialogLists[i].CARD_TITLE+'</A></TD><TD>'+dialogLists[i].CARD_TEXT+'</TD></TR>';
                    //alert('CARD_TITLE : '+dialogLists[i].CARD_TITLE);

                    if(dialogLists[i].DLG_TYPE == "2"){ //  TEXT
                        strDialogLists += '<div class="dialogView">';
                        strDialogLists += ' <div class="wc-message wc-message-from-bot" style="width:80%;">';
                        strDialogLists += '     <div class="wc-message-content">';
                        strDialogLists += '         <svg class="wc-message-callout"></svg>';
                        strDialogLists += '         <div>';
                        strDialogLists += '             <div class="format-markdown textTypeView dpB">';
                        strDialogLists += '                 <div class="textMent">';
                        strDialogLists += '                     <h1 class="scenario_dlg_Title">'+dialogLists[i].CARD_TITLE+'</h1>';
                        //strDialogLists += '                     <p class="scenario_dlg_SubTitle">서브타이틀</p>';
                        strDialogLists += '                     <p class="scenario_dlg_Text">'+dialogLists[i].CARD_TEXT+'</p>';
                        strDialogLists += '                     <div class="scenario_dlg_BtnArea"></div>';
                        strDialogLists += '                 </div>';
                        strDialogLists += '             </div>';
                        strDialogLists += '         </div>';
                        strDialogLists += '     </div>';
                        strDialogLists += ' </div>';
                        strDialogLists += '</div>';

                    }else if(dialogLists[i].DLG_TYPE == "3"){
                        strDialogLists +='<div class="wc-message wc-message-from-bot" style="width:80%;">';
                        strDialogLists +='  <div class="wc-message-content">';
                        strDialogLists +='      <svg class="wc-message-callout"></svg>';
                        strDialogLists +='      <div>';
                        strDialogLists +='          <div class="format-markdown textTypeView dpB">';
                        strDialogLists +='              <div class="textMent">';
                        strDialogLists +='                  <img src="'+dialogLists[i].IMG_URL+'">';
                        strDialogLists +='                  <h1 class="scenario_dlg_Title">'+dialogLists[i].CARD_TITLE+'</h1>';
                        strDialogLists +='                  <p class="scenario_dlg_SubTitle">'+dialogLists[i].CARD_SUBTITLE+'</p>';
                        strDialogLists +='                  <p class="scenario_dlg_Text">'+dialogLists[i].CARD_TEXT+'</p>';
                        strDialogLists +='                  <div class="scenario_dlg_BtnArea">';
                        if(dialogLists[i].BTN_1_TITLE != '' ) strDialogLists +='                      <button type="button" class="btn btn-default w100">'+dialogLists[i].BTN_1_TITLE+'</button>';
                        if(dialogLists[i].BTN_2_TITLE != '' ) strDialogLists +='                      <button type="button" class="btn btn-default w100">'+dialogLists[i].BTN_2_TITLE+'</button>';
                        if(dialogLists[i].BTN_3_TITLE != '' ) strDialogLists +='                      <button type="button" class="btn btn-default w100">'+dialogLists[i].BTN_3_TITLE+'</button>';
                        if(dialogLists[i].BTN_4_TITLE != '' ) strDialogLists +='                      <button type="button" class="btn btn-default w100">'+dialogLists[i].BTN_4_TITLE+'</button>';
                        strDialogLists +='                  </div>';
                        strDialogLists +='              </div>';
                        strDialogLists +='          </div>';
                        strDialogLists +='      </div>';
                        strDialogLists +='  </div>';
                        strDialogLists +='</div>';

                    }else if(dialogLists[i].DLG_TYPE == "4"){
                        strDialogLists += '<div class="dialogView">';
                        strDialogLists += ' <div class="wc-message wc-message-from-bot" style="width:80%;">';
                        strDialogLists += '     <div class="wc-message-content">';
                        strDialogLists += '         <svg class="wc-message-callout"></svg>';
                        strDialogLists += '         <div>';
                        strDialogLists += '             <div class="format-markdown textTypeView dpB">';
                        strDialogLists += '                 <div class="textMent">';
                        strDialogLists += '                     <h1 class="scenario_dlg_Title">'+dialogLists[i].CARD_TITLE+'</h1>';
                        //strDialogLists += '                     <p class="scenario_dlg_SubTitle">서브타이틀</p>';
                        strDialogLists += '                     <p class="scenario_dlg_Text">'+dialogLists[i].CARD_TEXT+'</p>';
                        strDialogLists += '                     <div class="scenario_dlg_BtnArea"></div>';
                        strDialogLists += '                 </div>';
                        strDialogLists += '             </div>';
                        strDialogLists += '         </div>';
                        strDialogLists += '     </div>';
                        strDialogLists += ' </div>';
                        strDialogLists += '</div>';

                    }else{
                        strDialogLists += '<div class="dialogView">';
                        strDialogLists += ' <div class="wc-message wc-message-from-bot" style="width:80%;">';
                        strDialogLists += '     <div class="wc-message-content">';
                        strDialogLists += '         <svg class="wc-message-callout"></svg>';
                        strDialogLists += '         <div>';
                        strDialogLists += '             <div class="format-markdown textTypeView dpB">';
                        strDialogLists += '                 <div class="textMent">';
                        strDialogLists += '                     <h1 class="scenario_dlg_Title">'+dialogLists[i].CARD_TITLE+'</h1>';
                        //strDialogLists += '                     <p class="scenario_dlg_SubTitle">서브타이틀</p>';
                        strDialogLists += '                     <p class="scenario_dlg_Text">'+dialogLists[i].CARD_TEXT+'</p>';
                        strDialogLists += '                     <div class="scenario_dlg_BtnArea"></div>';
                        strDialogLists += '                 </div>';
                        strDialogLists += '             </div>';
                        strDialogLists += '         </div>';
                        strDialogLists += '     </div>';
                        strDialogLists += ' </div>';
                        strDialogLists += '</div>';

                    }

                }
                $('#divScenarioDialogs').html(strDialogLists);
                
            }else{
                alert('selectScenarioList fail');
            }
            
        }
    });
    
}



//** 모달창 끝 */


//insertHtml += '<button class="scroll previous" id="prevBtn" style="display: none;" onclick="prevBtn(botChatNum)">';
//insertHtml += '<img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png">';
//insertHtml += '</button>';



//inputUttrHtml += '<button class="scroll next" id="nextBtn' + (botChatNum) + '" onclick="nextBtn(' + botChatNum + ')"><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png"></button>';