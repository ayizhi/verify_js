// 验证使用规则：
// 第一个参数是 是否必填require 选填可以不写
// 支持多种验证类型判断，中间以空格分开就可以
// 现在支持的种类有：
// 1.password 密码 ；
// 2.password-confirm 重复密码；
// 3.number整数；
// 4.float两位正小数；
// 5.all-number正负两位小数；
// 6.phone手机号；
// 7.tel固定电话;
// 7.email邮箱；
// 8.verify-code验证码；
// 9.identity身份证；
// 10.bank-card银行卡；
// 11.input-length长度限制；
//     只有上限；只有下限；有上下限；
// 12.custom自定义验证规则和提示文字；
// 13.date日期强转2012-01-01形式;
// 14.org-code组织机构代码证;
// 15.value-area取值范围;
// 16.username用户名
// 17.date-md日期4位
// 18.password-original原始密码
// 19.password-old 比较老的密码有6位的
// 20.adjust-date 计薪周期的时间
// 21.positive_integer 大于0的整数
// 22.100float 0-100的数值,小数点后最多两位


//前面需要加verify-,只有require前不需要
//define(['/plugins/jquery.min.js','/js/popWin.js'],function(){
//uploader to git

['password','password-confirm','number','float','all-number','phone','tel','email','verify-code','identify-code','bank-card','input-length','custom','date','org-code','value-area','username','date-md','password-original','password-old','adjust-date','positiveInteger','100float','http']

var ErrorType = {
    'required' : require,
    'number' : verifyNumber,
    'float' : verifyFloat,
    'positiveInteger' : verifyPositiveInteger,
    '100percent' : verifyPercent,
    'all-number' : verifyAllNumber,
    'phone' : verifyPhoneNum,
    'resetPhone':verifyResetPhoneNum,
    'tel':verifyTeleNumber,
    'email' : verifyEmail,
    'verify-code' : verifyVerifyCode,
    'identify-code' : verifyIdentity,
    'bank-card':verifyBankCard,
    'input-length' : verifyInputLength,
    'value-area' : verifyAreaLength,
    'date' : verifyDate,
    'username' : verifyUsername,
    'date-md' : verifyDateMd,
    'http' : verifyHttp,


}

for(var i in ErrorType){
    (function(i){
        $(document).on('focusout change','.vf-' + i,function(){
            checkValue(this,i,ErrorType[i.toString()])
        })
    })(i)
}


function checkValue(dom,type,callback){
    var verifyName = $(dom).data("name") || "";//验证提示项目名称
    var val = $(dom).val();
    if(type != 'required'){
        if($.trim(val) == ""){
            return
        }
    }
    callback.call(dom,verifyName,type);
}



//number整数
function verifyNumber(verifyName,type){
    regularCheck(this,type,/^\d*$/,verifyName + "必须是整数！")
}

//float两位小数
function verifyFloat(verifyName,type){
    var allowance = $(this).data("allowance");
    var text = verifyName + "必须是正数，支持最多两位小数！";
    if(1 == allowance){
        text = "奖金津贴必须是正数，支持最多两位小数";
    }
    regularCheck(this,type,/^[0-9]+(\.?[0-9]{1,2})?$/,text)
}

//positiveInterger正整数
function verifyPositiveInteger(verifyName,type){
    var text = verifyName + "必须是大于零的整数";
    regularCheck(this,type,/^[1-9]+[0-9]*]*$/ ,text)
}

//百分比
function verifyPercent(verifyName,type){
    var text = verifyName + '必须是0-100的数值,小数点后最多两位'
    regularCheck(this,type,/^(([0-9]{1,2}(\.\d{0,2})?)|100)$/,text)
}

//正负两位小数
function verifyAllNumber(verifyName,type){
    regularCheck(this,type,/^[+-]?\d*\.?\d{0,2}$/,verifyName + "必须是数字,支持负数,支持最多两位小数!")
}

//验证码
function verifyVerifyCode(verifyName,type){
    regularCheck(this,type,/^\d{6}$/,"验证码输入有误!")
}

//银行卡
function verifyBankCard(verifyName,type){
    regularCheck(this,type,/^\d{15,20}$/,"银行卡号格式错误！")
}

//固定电话
function verifyTeleNumber(verifyName,type){
    regularCheck(this,type,/^\d{3,4}-\d{7,8}$/,verifyName +"格式错误！")
}

//用户名
function verifyUsername(verifyName,type){
    regularCheck(this,type,/(^1[3-9][0-9]\d{4,8}$)|(^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$)/,"请输入正确的邮箱或手机号！")
}

//日期
function verifyDate(verifyName,type){
    var obj = this;
    var objVal = $(this).val()
    var rule = $(obj).data("rule") || "-";
    var dates = objVal.split(rule);

    if($.trim(objVal) == ""){
        return
    }

    if(dates[0].length == 4){
        //2015
        var year = dates[0];
        var mm = Number(dates[1]);
        var dd = Number(dates[2]);
        var date = new Date(year,(mm - 1),dd);
        if(!(year == date.getFullYear() && (mm - 1) == date.getMonth() && dd == date.getDate())){
            showError(obj,type,"日期格式错误!");
            $('.xdsoft_datetimepicker').hide()
            return false;
        }else {
            //补位
            if(mm < 10){
                mm = "0" + mm;
            }

            if(dd < 10){
                dd = "0" + dd;
            }
        }
    }else if(dates[0].length == 8){
        //20151111
        var year = dates[0].substr(0,4);
        var mm = Number(dates[0].substr(4,2));
        var dd = Number(dates[0].substr(6,2));
        var date = new Date(year,(mm - 1),dd);
        if(!(year == date.getFullYear() && (mm - 1) == date.getMonth() && dd == date.getDate())){
            showError(obj,type,"日期格式错误!");
            $('.xdsoft_datetimepicker').hide()
            return false;
        }else {
            //补位
            if(mm < 10){
                mm = "0" + mm;
            }

            if(dd < 10){
                dd = "0" + dd;
            }
        }
    }else {
        //报错
        $('.xdsoft_datetimepicker').hide()
        showError(obj,type,"日期格式错误!");
        return false;

    }

    var new_date = year + rule + mm + rule + dd;
    $(obj).val(new_date);
    clearError(obj,type);
    return true;

}

function verifyDateMd(verifyName,type){
    var obj = this;
    var objVal = $(this).val();
    var rule = $(obj).data("rule");
    var year = "2016";
    var mm;
    var dd;
    if("" == rule || undefined == rule){
        if(objVal.length != 4){
            showError(this,type,"日期格式错误!");
            return false;
        }
        mm = objVal.substr(0,2);
        dd = objVal.substr(2,2);
    }else {
        if(objVal.length != 5){
            showError(this,type,"日期格式错误!");
            return false;
        }
        mm = objVal.split(rule)[0];
        dd = objVal.split(rule)[1];
    }

    var date = new Date(year,(mm - 1),dd);
    if(!(year == date.getFullYear() && (mm - 1) == date.getMonth() && dd == date.getDate())){
        showError(this,type,"日期格式错误!");
        return false;
    }

    var new_date =  mm + (rule || "") + dd;
    $(obj).val(new_date);
    clearError(this,type);
    return true;
}



//身份证
function verifyIdentity(verifyName,type){
    var t = this;
    var faDom = $(t).parent('.input-box')
    var objVal = $(this).val()
    var birthYear = objVal.substr(6,4) - 1 ;
    var birthMonth = objVal.substr(10,2) - 1;
    var birthday = objVal.substr(12,2);
    var nowDate = new Date();
    var date = new Date(birthYear,birthMonth,birthday);
    var employeeId = faDom.attr('employeeId')

    if($.trim(objVal).length != 18){
        showError(t,type,'不是正式的18位格式的身份证号!')
    }else if(nowDate.getTime() < date.getTime()){
        showError(t,type,'身份证号格式错误!')
    }else if(!(date.getFullYear() == birthYear && date.getMonth() == birthMonth && date.getDate() == birthday)){
        showError(t,type,"身份证号格式错误!");
    }else if(!regularCheck(this,type,/(^\d{18}$)|(^\d{17}(\d|X|x)$)/,"身份证号格式错误！")){
        return;
    }
}



//输入长度范围
function verifyInputLength(verifyName,type){
    //验证的是字符不限数字
    var obj = this;
    var objVal = $(this).val();
    var max = $(obj).data("max");
    var min = $(obj).data("min");

    if(objVal == ''){
        return
    }
    if(max && !min){
        //只有上限
        inputLengthCheck("max",'',max,obj,verifyName,type);
    }else if(!max && min){
        //只有下线
        inputLengthCheck("min",min,'',obj,verifyName,type);
    }else if(max && min){

        inputLengthCheck("mid",min,max,obj,verifyName,type);
    }
}

//输入大小范围
function verifyAreaLength(verifyName,type){
    //验证的是字符不限数字
    var obj = this;
    var objVal = $(this).val();
    var max = $(obj).data("max");
    var min = $(obj).data("min");

    if(undefined != max && undefined == min){
        //只有上限
        valueCheck("max","",max,obj,verifyName,type)
    }else if(undefined == max && undefined != min){
        //只有下线
        valueCheck("min",min,"",obj,verifyName,type)
    }else if(undefined != max && undefined != min){
        valueCheck("mid",min,max,obj,verifyName,type)
    }
}

//设置手机号
function verifyPhoneNum(verifyName,type){
    var obj = this,
        faDom = $(this).parent('.input-box'),
        phoneNum = $(obj).val();
    if(!regularCheck(obj,type,/^1[3-9][0-9]\d{8}$/,"请输入正确手机号！")) {
        return
    }
}

//重新设置手机号验证
function verifyResetPhoneNum(verifyName,type){
    var obj = this;
    if(!regularCheck(obj,type,/^1[3-9][0-9]\d{8}$/,"请输入正确手机号！")) {
        return
    }
}

//email
function verifyEmail(verifyName,type){
    var obj = this;
    if(!regularCheck(obj,type,/^([a-zA-Z0-9._-]){2,18}@([a-zA-Z0-9_-]){1,60}\.([a-zA-Z0-9._-]){1,15}$/,"请输入正确邮箱！")){ // @前18个字符，大小写、数字、.-_; @后第一个.前 60个大小写、数字_-，第一个.后15个字符，大小写、数字、.-_
        return
    }
}

//http
function verifyHttp(verifyName,type){
    var reg = "^(http|https)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$"
    var myregex = new RegExp(reg);

    regularCheck(this,type,myregex,verifyName + "必须符合http格式")
}


//require验证
function require(verifyName,type){
    var t = this;
    var tDom = $(t);
    var objVal = $.trim(tDom.val());
    var verifyName = tDom.data('name')?tDom.data('name'):"";

    if(t.tagName.toLowerCase() == "select"){
        if(objVal == 'none'){
            showError(tDom,type,"请选择")
            return false;
        }else{
            clearError(tDom,type)
            return true;
        }
    }

    if(tDom.attr("type") == "radio"){
        var radioName = tDom.attr("name");
        if(!$("input[name="+radioName+"]:checked").val()){
            showError(tDom,type,"请选择");
            return false;
        }else {
            clearError(tDom,type);
            return true;
        }
    }else {
        if($.trim(objVal) == ""){
            showError(tDom,type,verifyName + "不能为空!");
            return false;
        }else {
            clearError(tDom,type);
            return true;
        }
    }
}

function firstContractBeginDate(veifyName,type){
    var firstEnd = $('#first_contract_end_date').val(),
        t = this,
        tDom = $(t),
        objVal = tDom.val();
    if($.trim(firstEnd) != ''){
        var end = new Date(firstEnd),
            begin = new Date(objVal);
        if(begin>=end){
            showError(tDom,type,"合同开始时间需要晚于合同结束时间")
        }else{
            clearError(tDom,type)
        }
    }else{
        clearError(tDom,type)
    }

}


//规则验证 公司名称 密码 小数数字 整数 正负小数 手机号码 邮箱 验证码 身份证号 银行卡号 长度限制 自定义规则
function regularCheck(dom,type,rule,text){
    var objVal = $(dom).val()
    if(!$.trim(objVal)){
        return
    }

    if(!rule.test(objVal)){
        showError(dom,type,text);
        return false;
    }else {
        clearError(dom,type);
        return true;
    }
}




//长度限制
function inputLengthCheck(type,min,max,obj,verifyName,errorType){
    var objVal = $.trim($(obj).val());
    if(type == "min"){
        //只有下线
        if(objVal.length < min){
            var text = verifyName + "最少包含"+ min +"个字符";
            showError(obj,errorType,text);
            return false;
        }else {
            clearError(obj,errorType);
            return true;
        }
    }else if(type == "max"){
        //只有上线
        if(objVal.length > max){
            var text = verifyName + "最多包含"+ max +"个字符";
            showError(obj,errorType,text);
            return false;
        }else {
            clearError(obj,errorType);
            return true;
        }
    }else if(type == "mid"){
        //上下线
        if(min == max){
            if(objVal.length != min){
                var text = verifyName + "只能包含"+ min +"个字符";
                showError(obj,errorType,text);
                return false;
            }else {
                clearError(obj,errorType);
                return true;
            }
        }else {
            if(objVal.length < min || objVal.length > max){
                var text = verifyName + "只能包含"+ min + "~" + max + "个字符";
                showError(obj,errorType,text);
                return false;
            }else {
                clearError(obj,errorType);
                return true;
            }
        }
    }
}

//取值范围限制
function valueCheck(type,min,max,obj,verifyName,errorType){
    //判断值是否可以转化为number来比较
    var objVal = $(obj).val()
    var val = parseFloat(objVal, 10);
    if(!val && val != 0){
        showError(obj,errorType,verifyName + "必须是数字!");
        return false;
    }

    if(type == "min"){
        //只有下限
        var min = parseFloat(min);
        if(val >= min ){
            clearError(obj,errorType);
            return true;
        }else {
            showError(obj,errorType,verifyName + "不能小于"+ min);
            return false;
        }
    }else if(type == "max"){
        //只有上限
        var max = parseFloat(max);
        if(val <= max ){
            clearError(obj,errorType);
            return true;
        }else {
            showError(obj,errorType,verifyName + "不能大于"+ max);
            return false;
        }
    }else if(type == "mid"){
        //上下线
        var min = parseFloat(min);
        var max = parseFloat(max);
        if(val <= max && val >= min){
            clearError(obj,errorType);
            return true;
        }else {
            showError(obj,errorType,verifyName + "范围在"+ min + "~" + max +"之间");
            return false;
        }
    }
}



//报错方法
function showError(thisDom,type,text){
    clearError(thisDom,type);
    var tDom = $(thisDom);
    var faDom = tDom.parent('.input-box');
    var grandFaDom = faDom.parent('.rows');
    faDom.addClass('has-error-input');
    grandFaDom.addClass('has-error');

    if(faDom.find('.error').length == 0){
        var error = $("<div class='error " + type + "'></div>");
        error.text(text);
        faDom.append(error)
    }
}



//清除报错方法
function clearError(thisDom,type){
    var tDom = $(thisDom);
    var faDom = tDom.parent('.input-box');
    var grandFaDom = faDom.parent('.rows');
    faDom.find("." + type).remove();
    faDom.removeClass("has-error-input");
    grandFaDom.removeClass("has-error");
}

//})


