

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


$(document).ready(function() {
    makeUserTable();
});

$(document).ready(function() {

    //검색
    $('#searchBtn').click(function() {
        makeUserTable();
    });

    //엔터로 검색
    $('#searchName, #searchId').on('keypress', function(e) {
        if (e.keyCode == 13) makeUserTable();
    });

    //추가 버튼
    $('#addBtn').click(function() {
        addUser();
    });

    //삭제 버튼
    $('#deleteBtn').click(function() {
        deleteUser();
    });

    //저장 버튼
    $('#saveBtn').click(function() {
        saveUser();
    });
    
    //초기화 버튼
    $('#initBtn').click(function() {
        initUserList();
    });

});



//페이지 버튼 클릭
$(document).on('click','.li_paging',function(e){
    if(!$(this).hasClass('active')){
        makeUserTable();
    }
});

//사용자 명 클릭 수정
var editCellText="";
$(document).on('click','.editable-cell',function(e){

    if($(this).find('input').length > 0){
        
    } else {
        if($(this).hasClass('editPwTd')) {
            editCellText = $(this).text();
            var inputHtml = '<input type="text" class="form-control editPwInput" id="editCell" spellcheck="false" spellcheck="false" autocomplete="off"/>';
            $(this).html(inputHtml);
            $(this).attr('class', 'edit-cell');
            $(this).children().focus().val('');
        } else {

            editCellText = $(this).text();
            var inputHtml = '<input type="text" class="form-control" id="editCell" spellcheck="false" spellcheck="false" autocomplete="off" value="' + $(this).text() + '"/>';
            $(this).html(inputHtml);
            $(this).attr('class', 'edit-cell');     
    
            $(this).children().focus().val('').val(editCellText);
        }
    }
});

//수정 중 셀 범위 밖 클릭 시 저장
$(document).ready(function() {
    $('html').click(function(e) { 
        if ($('.edit-cell').length > 0) {

            if ( !$('.edit-cell, #editCell').has(e.target).length ) { 
                //영역 밖

                if($('.edit-cell, #editCell').hasClass('editPwInput')) {

                    var changeVal = $('#editCell').val().trim();           
                    if (changeVal == "") {
                        $('.edit-cell').html(editCellText);
                    } else {
                        $('.edit-cell').html(changeVal);
                        $('.edit-cell').parent().children().eq(0).text('EDIT');
                        $('.edit-cell').parent().find('div').iCheck('check'); 
                        $('.edit-cell').attr('data-changeflag', "true");
                    }
                    $('.edit-cell').attr('class', 'editable-cell editPwTd'); 
                } else {

                    var changeVal = $('#editCell').val();
                    $('.edit-cell').html(editCellText);
                    $('.edit-cell').text(changeVal);
                    if (editCellText !== changeVal) {
                        $('.edit-cell').parent().children().eq(0).text('EDIT');
                        $('.edit-cell').parent().find('div').iCheck('check'); 
                    }
                    $('.edit-cell').attr('class', 'editable-cell');
                }
            } 
        }
    });
});

//수정시 엔터로 저장, esc 취소
$(document).on('keyup','#editCell',function(e){
    if(e.keyCode === 13){
        if($(this).hasClass('editPwInput') ) { 
                
            var changeVal = $('#editCell').val();           
            if (changeVal.trim() == "") {
                $('.edit-cell').html(editCellText);
            } else {
                $('.edit-cell').html(changeVal);
                $('.edit-cell').parent().children().eq(0).text('EDIT');
                $('.edit-cell').parent().find('div').iCheck('check'); 
                $('.edit-cell').attr('data-changeflag', "true"); 
            }
            $('.edit-cell').attr('class', 'editable-cell editPwTd'); 
        } else {

            var changeVal = $('#editCell').val();
            //$('.edit-cell').html(editCellText);
            $('.edit-cell').text(changeVal);
            if (editCellText !== changeVal) {
                $('.edit-cell').parent().children().eq(0).text('EDIT');
                $('.edit-cell').parent().find('div').iCheck('check'); 
            }
            $('.edit-cell').attr('class', 'editable-cell');
        }
    } else if(e.keyCode === 27){
        if($(this).hasClass('editPwInput') ) { 

            $('.edit-cell').html(editCellText);
            $('.edit-cell').attr('class', 'editable-cell editPwTd');
        } else {

            var changeVal = $('#editCell').val();
            $('.edit-cell').html(editCellText);
            $('.edit-cell').attr('class', 'editable-cell');
        }
    }
});
var saveTableHtml = "";
function makeUserTable() {
    
    var params = {
        'searchName' : $('#searchName').val(),
        'searchId' : $('#searchId').val(),
        'page' : $('.pagination_wrap').find('.active').val(),
        'rows' : $('td[dir=ltr]').find('select').val()
    };
    
    $.ajax({
        type: 'POST',
        data: params,
        url: '/users/selectUserList',
        success: function(data) {
           
            if (data.rows) {
                
                var tableHtml = "";
    
                for (var i=0;i<data.rows.length;i++) { 
                    tableHtml += '<tr><td>' + data.rows[i].SEQ + '</td>';
                    tableHtml += '<td><input type="checkbox" class="flat-red" name="tableCheckBox"></td>';
                    tableHtml += '<td>' + data.rows[i].USER_ID + '</td>';
                    tableHtml += '<td class="editable-cell">' + data.rows[i].EMP_NM + '</td>';
                    tableHtml += '<td class="editable-cell editPwTd" data-changeflag="false">' + language['EDIT']+ '</td>';
                    tableHtml += '<td>' + data.rows[i].REG_DT + '</td>';
                    tableHtml += '<td>' + data.rows[i].MOD_DT + '</td>';
                    tableHtml += '<td>' + (data.rows[i].LAST_LOGIN_DT).split(" ")[0] + '</br>' + (data.rows[i].LAST_LOGIN_DT).split(" ")[1] +'</td>';
                    tableHtml += '<td>' + data.rows[i].LOGIN_FAIL_CNT + '</td></tr>';
                }
    
                saveTableHtml = tableHtml;
                $('#tableBodyId').html(tableHtml);
            } else {
                $('#tableBodyId').html('');
            }

            iCheckBoxTrans();
            
            $('.pagination').html('').append(data.pageList);
            
        }
    });

}

// 비밀번호 초기화 
function initPassword(userId) {
    if (confirm(language['ASK_PW_INIT'])) {
        var params = {
            paramUserId: userId
        }
        
        $.ajax({
            data: params,
            url: '/users/inItPassword',
            success: function(data) {
                alert(data.message);
            }
        });
        
    }
}

//사용자 추가
function addUser() {
    var addHtml = "";
    addHtml = '<tr><td>NEW</td><td><input type="checkbox" class="flat-red" name="tableCheckBox"></td>'
    addHtml += '<td><input type="text" name="new_user_id" spellcheck="false" autocomplete="off" value="" /></td>';
    addHtml += '<td><input type="text" name="new_user_name" spellcheck="false" autocomplete="off" value="" /></td> ';
    addHtml += '<td><input type="text" name="new_user_password" spellcheck="false" autocomplete="off" value="" /></td>';   
    addHtml += '<td></td>  <td></td>  <td></td>  <td></td></tr>'

    $('#tableBodyId').prepend(addHtml);

    iCheckBoxTrans();

    $('#tableBodyId').children().eq(0).find('div').iCheck('check'); 
}

//사용자 리스트 초기화
function initUserList() {

    $('#tableBodyId').html(saveTableHtml);
    iCheckBoxTrans();
    
}

function deleteUser() {
    if ($('tr div[class*=checked]').length < 1) {
        alert(language['NO_SELECTED_CELL']);
    } else {
        $('tr div[class*=checked]').each(function() {
            $(this).parent().prev().text('DEL');
        });
    }
    
}

function saveUser() {

    if ($('td>div[class*=checked]').length < 1) {
        alert(language['NO_SELECTED_CELL']);
        return;
    }

    var chkEmptyInput = false;
    for (var i=0; i<$('input[name=new_user_id]').length; i++) {
        if ( ($.trim($('input[name=new_user_id]').eq(i).val()) === "") || ($.trim($('input[name=new_user_name]').eq(i).val()) === "")
                || ($.trim($('input[name=new_user_password]').eq(i).val()) === "") ) {
            chkEmptyInput = true;
            break;
        }
    }
    if (chkEmptyInput) {
        alert(language['ID_NAME_BE_FILLED']);
        return;
    }

    if ($('#editCell').length >0 ) {
        var changeVal = $('#editCell').val();
        $('.edit-cell').html(editCellText);
        $('.edit-cell').text(changeVal);
        if (editCellText !== changeVal) {
            $('.edit-cell').parent().children().eq(0).text('EDIT');
        }
        $('.edit-cell').attr('class', 'editable-cell');
    }

    // changeFlag - 유저정보 변경사항이 있는지 체크하는 함수
    var changeFlag = false;
    var saveArr = new Array();
    $('#tableBodyId tr').each(function() {
        if ( $(this).find('div').hasClass('checked') ) {
            
            var statusFlag = $(this).children().eq(0).text();
            
            if (statusFlag === 'EDIT') {
                
                var data = new Object() ;
                data.statusFlag = statusFlag;            
                data.USER_ID = $(this).children().eq(2).text();
                data.EMP_NM = $(this).children().eq(3).text();
                //비밀번호가 변경이 이루어 졌는지 체크
                if($(this).children().eq(4).attr('data-changeflag') == "true") {

                    data.EMP_PASSWORD = $(this).children().eq(4).text();
                }
                saveArr.push(data);
                changeFlag = true;
            } else if (statusFlag === 'NEW' ) {

                var data = new Object() ;
                data.statusFlag = statusFlag;
                data.USER_ID = $(this).find('input[name=new_user_id]').val();
                data.EMP_NM = $(this).find('input[name=new_user_name]').val();
                data.EMP_PASSWORD = $(this).find('input[name=new_user_password]').val();
                saveArr.push(data);
                changeFlag = true;
            } else if (statusFlag === 'DEL') {

                var data = new Object() ;
                data.statusFlag = statusFlag;
                data.USER_ID = $(this).children().eq(2).text();
                data.EMP_NM = $(this).children().eq(3).text();
                saveArr.push(data);
                changeFlag = true;
            }
        }
        
    });
    
    if(changeFlag == false) {

        alert("아무런 변경사항이 없습니다. 추가, 수정, 삭제 등 변경사항이 생겼을시 저장 버튼을 눌러주세요.");
    } else {
        
        var jsonData = JSON.stringify(saveArr);
        var params = {
            'saveArr' : jsonData
        };
        $.ajax({
            type: 'POST',
            datatype: "JSON",
            data: params,
            url: '/users/saveUserInfo',
            success: function(data) {
                console.log(data);
                if (data.status === 200) {
                    alert(language['REGIST_SUCC']);
                    window.location.reload();
                } else {
                    alert(language['It_failed']);
                }
            }
        });  
        
    }  
}


function iCheckBoxTrans() {
    $('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
        checkboxClass: 'icheckbox_minimal-blue',
        radioClass   : 'iradio_minimal-blue'
    })
    //Red color scheme for iCheck
    $('input[type="checkbox"].minimal-red, input[type="radio"].minimal-red').iCheck({
        checkboxClass: 'icheckbox_minimal-red',
        radioClass   : 'iradio_minimal-red'
    })
    //Flat red color scheme for iCheck
    $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass   : 'iradio_flat-green'
    })

    $('#check-all').iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass   : 'iradio_flat-green'
    }).on('ifChecked', function(event) {
        $('input[name=tableCheckBox]').parent().iCheck('check');
        
    }).on('ifUnchecked', function() {
        $('input[name=tableCheckBox]').parent().iCheck('uncheck');
        
    });
}



