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

['password','password-confirm','number','float','all-number','phone','email','verify-code','identify-code','bank-card','input-length','custom','date','org-code','value-area','username','date-md','password-original','password-old','adjust-date','positiveInteger','100float','http']


var ErrorType = {
    'require' : require,
    'password' : verifyPassWord,
    'password-confirm' : verifyPassWordConfirm,
    'number' : verifyNumber,
    'float' : verifyFloat,
    'positiveInteger' : verifyPositiveInteger,
    '100percent' : verifyPercent,
    'all-number' : verifyAllNumber,
    'phone' : verifyPhoneNum,
    'email' : verifyEmail,
    'verify-code' : verifyVerifyCode,
    'identify-code' : verifyIdentity,
    'bank-card':verifyBankCard,
    'input-length' : verifyInputLength,
    'custom' : verifyCustom,
    'date' : verifyDate,
    'org-code' : verifyOrgCode,
    'value-area' : verifyAreaLength,
    'username' : verifyUsername,
    'date-md' : verifyDateMd,
    'password-original' : verifyPassWordOriginal,
    'password-old' : verifyPassWordOld,
    'adjust-date' : verifyAdjustDate,
    'http' : verifyHttp

}


for(var i in ErrorType){
    (function(i){
        $(document).on('blur change','.vf-' + i,function(){
            checkValue(this,ErrorType[i])
        })
    })(i)
}

function checkValue(dom,callback){
    var verifyName = $(dom).data("name") || "";//验证提示项目名称
    callback.call(dom,verifyName);
}



//number整数
function verifyNumber(verifyName){
   regularCheck(this,/^\d*$/,verifyName + "必须是整数！")
}

//float两位小数
function verifyFloat(verifyName){
    var allowance = $(this).data("allowance");
    var text = verifyName + "必须是正数，支持最多两位小数！";
    if(1 == allowance){
        text = "奖金津贴必须是正数，支持最多两位小数";
    }
    regularCheck(this,/^[0-9]+(\.?[0-9]{1,2})?$/,text)
}

//positiveInterger正整数
function verifyPositiveInteger(verifyName){
    var text = verifyName + "必须是大于零的整数";
    regularCheck(this,/^[1-9]+[0-9]*]*$/ ,text)
}

//百分比
function verifyPercent(verifyName){
    var text = verifyName + '必须是0-100的数值,小数点后最多两位'
    regularCheck(this,/^(([0-9]{1,2}(\.\d{0,2})?)|100)$/,text)
}

//正负两位小数
function verifyAllNumber(verifyName){
    regularCheck(this,/^[+-]?\d*\.?\d{0,2}$/,verifyName + "必须是数字,支持负数,支持最多两位小数! ")
}

//验证码
function verifyVerifyCode(verifyName){
    regularCheck(this,/^\d{6}$/,"验证码输入有误! ")
}

//银行卡
function verifyBankCard(verifyName){
    regularCheck(this,/^\d{15,20}$/,"银行卡号格式错误！")
}

//固定电话
function verifyTeleNumber(verifyName){
    regularCheck(this,/^\d{3,4}-\d{7,8}$/,verifyName +"格式错误！")
}

//用户名
function verifyUsername(verifyName){
    regularCheck(this,/(^1[3-9][0-9]\d{4,8}$)|(^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$)/,"请输入正确的邮箱或手机号！")
}

//日期
function verifyDate(verifyName){
    var obj = this;
    var objVal = $(this).val()
    var rule = $(obj).data("rule") || "-";
    var dates = objVal.split(rule);
    if(dates[0].length == 4){
        //2015
        var year = dates[0];
        var mm = Number(dates[1]);
        var dd = Number(dates[2]);
        var date = new Date(year,(mm - 1),dd);
        if(!(year == date.getFullYear() && (mm - 1) == date.getMonth() && dd == date.getDate())){
            showError(obj,"日期格式错误!");
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
            showError(obj,"日期格式错误!");
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
        showError(obj,"日期格式错误!");
        return false;
    }

    var new_date = year + rule + mm + rule + dd;
    $(obj).val(new_date);
    clearError(obj);
    return true;

}
function verifyDateMd(verifyName){
    var obj = this;
    var objVal = $(this).val();
    var rule = $(obj).data("rule");
    var year = "2016";
    var mm;
    var dd;
    if("" == rule || undefined == rule){
        if(objVal.length != 4){
            showError(this,"日期格式错误!");
            return false;
        }
        mm = objVal.substr(0,2);
        dd = objVal.substr(2,2);
    }else {
        if(objVal.length != 5){
            showError(this,"日期格式错误!");
            return false;
        }
        mm = objVal.split(rule)[0];
        dd = objVal.split(rule)[1];
    }

    var date = new Date(year,(mm - 1),dd);
    if(!(year == date.getFullYear() && (mm - 1) == date.getMonth() && dd == date.getDate())){
        showError(this,"日期格式错误!");
        return false;
    }

    var new_date =  mm + (rule || "") + dd;
    $(obj).val(new_date);
    clearError(this);
    return true;
}
function verifyAdjustDate(veifyName){
    var obj = this;
    var objVal = $(this).val();
    var id = $(obj).data("id");
    var data = {
        'data[employee_id]':id,
        'data[adjust_time]':objVal,
        'data[yearmo]' : $("#datepicker-yearmo").val(),
        'type':"payroll-transaction",
        'scenario':"adjust",
        '_csrf': $("meta[name=csrf-token]").attr("content")
    };

    $.ajax({
        type: 'POST',
        url: '/site/ajax-validate.html',
        data: data,
        success: function (data) {
            clearError(this);
            if(true != data.status){
                showError(this,data.data.errors.adjust_time);
                return false;
            }
        }
    });
}

//身份证
function verifyIdentity(verifyName){
    var objVal = $(this).val()
    var birthYear = objVal.substr(6,4);
    var birthMonth = objVal.substr(10,2)-1;
    var birthday = objVal.substr(12,2);
    var date = new Date(birthYear,birthMonth,birthday);

    if(!regularCheck(this,/(^\d{18}$)|(^\d{17}(\d|X|x)$)/,"身份证号应该包含18个字符！")){
       return
    }
    if(!(date.getFullYear() == birthYear && date.getMonth() == birthMonth && date.getDate() == birthday)){
        showError(this,"身份证号格式错误!");
    }else{
        clearError(this)
    }
}

//组织机构
function verifyOrgCode(verifyName){
    var objVal = $(this).val()
    if(orgcodevalidate(objVal)){
        showError(this,"组织机构代码证输入错误");
    }else {
        clearError(this);
    }
}

//自定义
function verifyCustom(verifyName){
    var obj = this;
    var rule_input = $(obj).data("rule");
    var text = $(obj).data("text");
    var rule = new RegExp(rule_input);
    regularCheck(obj,rule,text)
}

//输入长度范围
function verifyInputLength(verifyName){
    //验证的是字符不限数字
    var obj = this;
    var objVal = $(this).val();
    var max = $(obj).data("max");
    var min = $(obj).data("min");
    if(max && !min){
        //只有上限
        inputLengthCheck("max",'',max,obj,verifyName);
    }else if(!max && min){
        //只有下线
        inputLengthCheck("min",min,'',obj,verifyName);
    }else if(max && min){
        inputLengthCheck("mid",min,max,obj,verifyName);
    }
}

//输入大小范围
function verifyAreaLength(verifyName){
    //验证的是字符不限数字
    var obj = this;
    var objVal = $(this).val();
    var max = $(obj).data("max");
    var min = $(obj).data("min");

    if(undefined != max && undefined == min){
        //只有上限
        valueCheck("max","",max,obj,verifyName)
    }else if(undefined == max && undefined != min){
        //只有下线
        valueCheck("min",min,"",obj,verifyName)
    }else if(undefined != max && undefined != min){
        valueCheck("mid",min,max,obj,verifyName)
    }
}

//手机号
function verifyPhoneNum(verifyName){
    var obj = this;
    if(!regularCheck(obj,/^1[3-9][0-9]\d{8}$/,"请输入正确手机号！")) {
        return
    }else {
        //格式正确,验证是否后台有该手机号码
        var verifyAjax = Number($(obj).data("ajax"));//0 否 1 是
        if(verifyAjax == 0 || verifyAjax == undefined){
            //不用去验证
            clearError(this);
            return true;
        }else if(verifyAjax == 1){
            //后台判重
            commonAjax("mobile",'',obj);
        }
    }
}

//email
function verifyEmail(verifyName){
    var obj = this;
    if(!regularCheck(obj,/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,"请输入正确邮箱！")){
        return
    }else {
        //格式正确,验证是否后台有该邮箱号
        var verifyAjax = Number($(obj).data("ajax"));//0 否 1 是
        if(verifyAjax == 0 || verifyAjax == undefined){
            //不用去验证
            clearError(this);
            return true;
        }else if(verifyAjax == 1){
            //后台判重
            //公司设置中的管理员邮箱判重
            if($(obj).data("company")){
                commonAjax("email",true,obj);
                return;
            }
            commonAjax("email",'',obj);
        }
    }
}

//http
function verifyHttp(verifyName){
    var reg = "^(http|https)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$"
    var myregex = new RegExp(reg);

    regularCheck(this,myregex,verifyName + "必须符合http格式")
}

//password
function verifyPassWord(verifyName){
    //密码验证和重复密码验证绑定
    var obj = this;
    var name = $(obj).attr("name");
    var pwd = $("input[name="+name+"]").val();
    var pwd_cfm = $("input[name=confirm_"+name+"]").val();
    var verifyAjax = Number($(obj).data("ajax"));//0 否 1 是
    if(pwd && !pwd_cfm){
        //没有输入重复密码
        //正常验证
        if(regularCheck(obj,/^[0-9a-zA-Z]{8,20}$/,"密码应为8-20位字符！")){
            //前端验证通过,判断是否要去后端验证
            if(verifyAjax == 0 || verifyAjax == undefined){
                //验证通过
                clearError(this);
                return true;
            }else if(verifyAjax == 1){
                //ajax
                passwordAjax('',obj);
            }
        }else {
            return false;
        }
    }else if(pwd && pwd_cfm){
        //都存在
        //先验证密码位数
        if(regularCheck(obj,/^[0-9a-zA-Z]{8,20}$/,"密码应为8-20位字符！")){
            //密码位数验证通过
            //ajax here
            //前端验证通过,判断是否要去后端验证
            if(verifyAjax == 0 || verifyAjax == undefined){
                //验证通过
                //验证两次密码是否一致
                var another_parent = $("input[name="+name+"]").parent(".input-box");
                var another_grandfather = $("input[name=confirm_"+name+"]").closest(".rows");
                if(pwd != pwd_cfm){
                    //两次不一致，焦点移到confirm并报错
                    another_parent.find(".error-text").remove();
                    var error = $("<div class='error-text'></div>");
                    error.text("两次输入密码不一致！");
                    another_parent.append(error);
                    another_grandfather.addClass("has-error");
                    return false;
                }else{
                    //密码一致，没问题，清除报错信息
                    clearError(this);
                    another_parent.find(".error-text").remove();
                    another_grandfather.removeClass("has-error");
                    return true;
                }
            }else if(verifyAjax == 1){
                //ajax
                passwordAjax(true,obj);
            }
        }
    }
}

//passwordOriginal
function verifyPassWordOriginal(verifyName){
    var obj = this;
    var objVal = $(this).val();
    var employee = $(obj).data("employee");
    var url = "/site/ajax-validate-account-info.html";
    var data = {
        'data[password]' :stringToHex(objVal),
        'scenario' : "change_password",
        '_csrf' : $("meta[name=csrf-token]").attr("content")
    };
    if(employee == "1"){
        url = "/employee-center/ajax-validate-password-correctness.html";
        data = {
            'password' :stringToHex(objVal),
            '_csrf' : $("meta[name=csrf-token]").attr("content")
        }
    }

    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: function (data) {
            if(!data.status){
                //原始密码错误
                showError(obj,"原始密码输入错误!");
                return false;
            }else {
                //原始密码正确
                clearError(obj);
                return true;
            }
        }
    });
}

//passwordConfirm
function verifyPassWordConfirm(verifyName){
    var obj = this;
    var objVal = $(this).val();
    var name = $(obj).attr("name");
    var pwd = $("input[name="+name.substr(8)+"]").val();
    if(pwd){
        if(pwd != objVal){
            showError(obj,"两次输入密码不一致！");
            return false;
        }else {
            clearError(obj);
            return true;
        }
    }else{
        showError(obj,"请先输入密码！");
        return false;
    }
}

//passwordOld
function verifyPassWordOld(verifyName){
    var obj = this;
    var objVal = $(obj).val();
    if(objVal.length < 6){//老密码
        showError(obj,"登录密码不可以少于6位!");
    }
}

//require验证
function require(){

    console.log(this)
    var tDom = $(this);
    var objVal = tDom.val();
    var verifyName = tDom.data('name');

    if(tDom.attr("type") == "radio"){
        var radioName = tDom.attr("name");
        if(!$("input[name="+radioName+"]:checked").val()){
            showError(tDom,"请选择");
            return false;
        }else {
            clearError(tDom);
            return true;
        }
    }else {
        if($.trim(objVal) == ""){
            showError(tDom,verifyName + "不能为空！");
            return false;
        }else {
            clearError(tDom);
            return true;
        }
    }
}

//规则验证 公司名称 密码 小数数字 整数 正负小数 手机号码 邮箱 验证码 身份证号 银行卡号 长度限制 自定义规则
function regularCheck(dom,rule, text){
    var objVal = $(dom).val()
    if(!$.trim(objVal)){
        return
    }

    if(!rule.test(objVal)){
        showError(dom,text);
        return false;
    }else {
        clearError(dom);
        return true;
    }
}

//报错方法
function showError(thisDom,text){
    clearError(thisDom);
    var tDom = $(thisDom);
    var faDom = tDom.parent('.input-box');
    var grandFaDom = faDom.parent('.rows');

    var error = $("<div class='error'></div>");
    error.text(text);
    faDom.append(error).addClass("has-error-input");
    grandFaDom.addClass("has-error");
}

//清除报错方法
function clearError(thisDom){
    var tDom = $(thisDom);
    var faDom = tDom.parent('.input-box');
    var grandFaDom = faDom.parent('.rows');

    faDom.find(".error").remove();
    faDom.removeClass("has-error-input");
    grandFaDom.removeClass("has-error");
}

//验证组织机构合法性方法
//value是组织机构的值 如XXXXXXXX-X格式
//false 就是组织机构代码是对的
//true 组织机构代码不合法
function orgcodevalidate(objVal){
    var values = objVal.split("-");
    var ws = [3, 7, 9, 10, 5, 8, 4, 2];
    var str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var reg = /^([0-9A-Z]){8}$/;
    if (!reg.test(values[0])) {
        return true
    }
    var sum = 0;
    for (var i = 0; i < 8; i++) {
        sum += str.indexOf(values[0].charAt(i)) * ws[i];
    }
    var C9 = 11 - (sum % 11);
    var YC9=values[1]+'';
    if (C9 == 11) {
        C9 = '0';
    } else if (C9 == 10) {
        C9 = 'X'  ;
    } else {
        C9 = C9+'';
    }
    return YC9!=C9;
}

//长度限制
function inputLengthCheck(type,min,max,obj,verifyName){
    var objVal = $(obj).val();
    if(type == "min"){
        //只有下线
        if(objVal.length < min){
            var text = verifyName + "最少包含"+ min +"个字符";
            showError(obj,text);
            return false;
        }else {
            clearError(obj);
            return true;
        }
    }else if(type == "max"){
        //只有上线
        if(objVal.length > max){
            var text = verifyName + "最多包含"+ max +"个字符";
            showError(obj,text);
            return false;
        }else {
            clearError(obj);
            return true;
        }
    }else if(type == "mid"){
        //上下线
        if(min == max){
            if(objVal.length != min){
                var text = verifyName + "只能包含"+ min +"个字符";
                showError(obj,text);
                return false;
            }else {
                clearError(obj);
                return true;
            }
        }else {
            if(objVal.length < min || objVal.length > max){
                var text = verifyName + "可以包含"+ min + "~" + max + "个字符";
                showError(obj,text);
                return false;
            }else {
                clearError(obj);
                return true;
            }
        }
    }
}

//取值范围限制
function valueCheck(type,min,max,obj,verifyName){
    //判断值是否可以转化为number来比较
    var val = parseFloat(objVal, 10);
    var objVal = $(obj).val()
    if(!val && val != 0){
        showError(obj,verifyName + "必须是数字!");
        return false;
    }

    if(type == "min"){
        //只有下限
        var min = parseFloat(min);
        if(val >= min ){
            clearError(obj);
            return true;
        }else {
            showError(obj,verifyName + "不能小于"+ min);
            return false;
        }
    }else if(type == "max"){
        //只有上限
        var max = parseFloat(max);
        if(val <= max ){
            clearError(obj);
            return true;
        }else {
            showError(obj,verifyName + "不能大于"+ max);
            return false;
        }
    }else if(type == "mid"){
        //上下线
        var min = parseFloat(min);
        var max = parseFloat(max);
        if(val <= max && val >= min){
            clearError(obj);
            return true;
        }else {
            showError(obj,verifyName + "范围在"+ min + "~" + max +"之间");
            return false;
        }
    }
}

//手机号码,邮箱的后台判断
function commonAjax(type,company,obj){
    var objVal = $(obj)
    var data = "data[" + type + "]=" + objVal + "&_csrf=" + $("meta[name=csrf-token]").attr("content") + "&scenario="+ (type == "mobile" ? "account" : "index") +"&type=register";
    if(true == company){
        data = "data[" + type + "]=" + objVal + "&_csrf=" + $("meta[name=csrf-token]").attr("content") + "&scenario=company&type=company";
    }
    $.ajax({
        type: 'POST',
        url: '/site/ajax-validate.html',
        data: data,
        success: function (data) {
            if(!data.status){
                //被占用
                if(type == "email"){
                    showError(obj,"邮箱已被占用! ");
                }else if(type == "mobile"){
                    showError(obj,"手机号码已被占用! ");
                }
                return false;
            }else {
                //没被占用
                clearError(obj);
                return true;
            }
        }
    });
}

//密码的ajax后台判断
function passwordAjax(status,obj){
    var repassword = false;
    var objVal = $(obj).val();
    if(status == true){
        //清空重复密码
        repassword = true;
    }

    var employee = $(obj).data("employee");
    var site = "site";
    if(employee == "1"){
        site = "employee-center";
    }

    $.ajax({
        type: 'POST',
        url: '/'+ site +'/ajax-validate.html',
        data: "data[password]=" + objVal + "&_csrf=" + $("meta[name=csrf-token]").attr("content") + "&scenario=account&type=register",
        success: function (data) {
            if(!data.status){
                //密码强度不通过
                showError(obj,data.data.errors.password);
                return false;
            }else {
                //通过
                if(repassword == true){
                    //验证两次密码是否一致
                    var name = $(obj).attr("name");
                    var pwd = $("input[name="+name+"]").val();
                    var pwd_cfm = $("input[name=confirm_"+name+"]").val();
                    var another_parent = $("input[name=confirm_"+name+"]").parent(".input-box");
                    var another_grandfather = $("input[name=confirm_"+name+"]").closest(".rows");
                    if(pwd != pwd_cfm){
                        //两次不一致，焦点移到confirm并报错
                        another_parent.find(".error-text").remove();
                        var error = $("<div class='error-text'></div>");
                        error.text("两次输入密码不一致！");
                        another_parent.append(error);
                        another_grandfather.addClass("has-error");
                        return false;
                    }else{
                        //密码一致，没问题，清除报错信息
                        clearError(obj);
                        another_parent.find(".error-text").remove();
                        another_grandfather.removeClass("has-error");
                        return true;
                    }
                }else {
                    clearError(obj);
                    return true;
                }
            }
        }
    });
}

//指定id的input报错
function showErrorWithId(id,text) {
    var target = $("#"+id);
    var parent = $("#"+id).parent();
    var grandfather = $("#"+id).closest(".rows");

    parent.find(".error-text").remove();
    var error = $("<div class='error-text'></div>");
    error.text(text);
    parent.append(error).addClass("has-error-input");
    grandfather.addClass("has-error");
}
function clearErrorWithId(id) {
    var target = $("#"+id);
    var parent = $("#"+id).parent();
    var grandfather = $("#"+id).closest(".rows");

    parent.find(".error-text").remove();
    parent.removeClass("has-error-input");
    grandfather.removeClass("has-error");
}
function stringToHex(str){
    var val="";
    for(var i = 0; i < str.length; i++){
        if(val == "")
            val = str.charCodeAt(i).toString(16);
        else
            val += str.charCodeAt(i).toString(16);
    }
    return val;
};