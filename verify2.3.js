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
        'password' : verifyPassWord,
        'password-confirm' : verifyPassWordConfirm,
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
        'custom' : verifyCustom,
        'date' : verifyDate,
        'org-code' : verifyOrgCode,
        'username' : verifyUsername,
        'date-md' : verifyDateMd,
        'password-original' : verifyPassWordOriginal,
        'password-old' : verifyPassWordOld,
        'password-old-change' : verifyPassWordOldChange,
        'adjust-date' : verifyAdjustDate,
        'http' : verifyHttp,
        'first-contract-begin':firstContractBeginDate,
        'first-contract-end':firstContractEndDate,
        'now-contract-beigin':nowContractBeginDate,
        'now-contract-end':nowContractEndDate,
        'entrance-yearmo':entranceYearmo,
        'graduation-yearmo':graduationYearmo,
        'lenovo-department':departmentLenovo,
        'lenovo-director':directorLenovo,
        'insurance-num':insuranceNum,


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
    function verifyAdjustDate(veifyName,type){
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
                clearError(this,type);
                if(true != data.status){
                    showError(this,type,data.data.errors.adjust_time);
                    return false;
                }
            }
        });
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
        }else{
            $.ajax({
                url:'/employee/ajax-validate-idcode.html',
                type:'get',
                data:{
                    'idcode':objVal,
                    'employee_id':employeeId
                },
                success:function(reply){
                    if(!reply.status){
                        showAjaxError(faDom,type,reply.message.slice(7));
                    }else{
                        clearAjaxError(faDom,type)
                        var curYear = (new Date()).getFullYear();
                        var age = curYear - birthYear - 1
                        var birth_Month = birthMonth.length == 2 ? birthMonth + 1 : '0' + parseInt(birthMonth + 1);
                        var birth_Day = birthday.length == 2 ? birthday : '0' + birthday;
                        var theBirthDay = birth_Month + birth_Day;
                        var constellation = reply.data['constellation'];
                        var sexual = $.trim(objVal).split("")[16]%2 == 0 ? 2 : 1;


                        if($('#gender').val() == 0 || $('#gender').val() == ''){
                            $('#gender').val(sexual).attr('value',sexual);
                        }
                        if($('#birthday').val() == '' ||$('#birthday').val() == '0'){
                            $('#birthday').val(theBirthDay)
                        }
                        if($('#age').val() == '' || $('#age').val() == '0'){
                            $('#age').val(age);
                        }
                        if($('#constellation').val() == 0 || $('#constellation').val() == ""){
                            $('#constellation').val(constellation).attr('value',constellation)
                        }
                    }
                }
            })
        }



    }

//组织机构
    function verifyOrgCode(verifyName,type){
        var objVal = $(this).val()
        if(orgcodevalidate(objVal)){
            showError(this,type,"组织机构代码证输入错误");
        }else {
            clearError(this,type);
        }
    }

//自定义
    function verifyCustom(verifyName,type){
        var obj = this;
        var rule_input = $(obj).data("rule");
        var text = $(obj).data("text");
        var rule = new RegExp(rule_input);
        regularCheck(obj,type,rule,text)
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
        }else {
            //格式正确,验证是否后台有该手机号码
            var verifyAjax = parseInt($(obj).data("ajax"));//0 否 1 是
            if(verifyAjax == 0 || verifyAjax == undefined){
                //不用去验证
                clearError(this,type);
                return true;
            }else if(verifyAjax == 1){
                //后台判重
                $.ajax({
                    type: 'get',
                    url: '/employee/ajax-validate-mobile.html',
                    data: {'mobile':phoneNum},
                    success: function (reply) {
                        if(!reply.status){
                            //被占用
                            showAjaxError(faDom,type,'手机号已存在或不可用');
                            return false;
                        }else {
                            //没被占用
                            clearAjaxError(faDom,type);
                            return true;
                        }
                    }
                });
            }
        }
    }

//重新设置手机号验证
    function verifyResetPhoneNum(verifyName,type){
        var obj = this;
        if(!regularCheck(obj,type,/^1[3-9][0-9]\d{8}$/,"请输入正确手机号！")) {
            return
        }else {
            //格式正确,验证是否后台有该手机号码
            var verifyAjax = Number($(obj).data("ajax"));//0 否 1 是
            var verifyAjaxUpdate = Number($(obj).attr("data-ajaxUpdate"));//0 否 1 是  更改手机号时的新手机号
            if(verifyAjax == 0 || verifyAjax == undefined){
                //不用去验证
                clearError(this,type);
                return true;
            }else if(verifyAjax == 1){
                if(verifyAjaxUpdate == 1){ //验证新手机号
                    commonAjax("new_mobile",obj,type);
                    return;
                }
                //后台判重
                commonAjax("mobile",obj,type);
            }
        }
    }

//email
    function verifyEmail(verifyName,type){
        var obj = this;
        if(!regularCheck(obj,type,/^([a-zA-Z0-9._-]){2,18}@([a-zA-Z0-9_-]){1,60}\.([a-zA-Z0-9._-]){1,15}$/,"请输入正确邮箱！")){ // @前18个字符，大小写、数字、.-_; @后第一个.前 60个大小写、数字_-，第一个.后15个字符，大小写、数字、.-_
            return
        }else {
            //格式正确,验证是否后台有该邮箱号
            var verifyAjax = Number($(obj).data("ajax"));//0 否 1 是
            //var verifyAjaxUpdate = Number($(obj).attr("data-ajaxUpdate"));//0 否 1 是
            if(verifyAjax == 0 || verifyAjax == undefined){
                //不用去验证
                clearError(this,type);
                return true;
            }else if(verifyAjax == 1){
                //后台判重
                //公司设置中的管理员邮箱判重
                commonAjax("email",obj,type);
            }
        }
    }

//http
    function verifyHttp(verifyName,type){
        var reg = "^(http|https)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$"
        var myregex = new RegExp(reg);

        regularCheck(this,type,myregex,verifyName + "必须符合http格式")
    }

//password
    function verifyPassWord(verifyName,type){
    //密码验证和重复密码验证绑定
    var obj = this;
    var name = $(obj).attr("name");
    var pwd = $("input[name="+name+"]").val();
    var pwd_cfm = $("input[name=confirm_"+name+"]").val();
    var verifyAjax = $("input[name="+name+"]").attr('data-ajax');
    if(pwd && !pwd_cfm){
        //没有输入重复密码
        //正常验证
        if(regularCheck(obj,type,/^[0-9a-zA-Z]{8,20}$/,"密码应为8-20位数字和字母组合！") && regularCheck(obj,type,/\d+/,"密码应为8-20位数字和字母组合") &&regularCheck(obj,type,/[a-zA-Z]+/,"密码应为8-20位数字和字母组合")) {
            //验证通过
            clearError(this,type);
            return true
        
        }else {
            return false;
        }
    }else if(pwd && pwd_cfm){
        //都存在
        //先验证密码位数
        if(regularCheck(obj,type,/^[0-9a-zA-Z]{8,20}$/,"密码应为8-20位数字和字母组合")){
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
                    clearError(this,type);
                    another_parent.find(".error-text").remove();
                    another_grandfather.removeClass("has-error");
                    return true;
                }
            }else if(verifyAjax == 1){
                //ajax
                passwordAjax(true,obj,type);
            }
        }
    }
}

//passwordOriginal
    function verifyPassWordOriginal(verifyName,type){
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
                    showError(obj,type,"原始密码输入错误!");
                    return false;
                }else {
                    //原始密码正确
                    clearError(obj,type);
                    return true;
                }
            }
        });
    }

//passwordConfirm
    function verifyPassWordConfirm(verifyName,type){
        var obj = this;
        var objVal = $(this).val();
        var name = $(obj).attr("name");
        var pwd = $("input[name="+name.substr(8)+"]").val();
        //var pwd = $(this).val();
        if(pwd){
            if(pwd != objVal){
                showError(obj,type,"两次输入密码不一致!");
                return false;
            }else {
                clearError(obj,type);
                return true;
            }
        }else{
            showError(obj,type,"请先输入密码!");
            return false;
        }
    }

//passwordOld
    function verifyPassWordOld(verifyName,type){
        var obj = this;
        var objVal = $(obj).val();
        if(objVal.length < 6){//老密码
            showError(obj,type,"登录密码不可以少于6位!");
        } else {
            clearError(obj,type);
            return true;
        }
    }

//passwordOld change
function verifyPassWordOldChange(verifyName,type){
    var obj = this;
    var objVal = $(obj).val();
    var ajax = $(obj).attr('data-ajax');//ajax ==1 验证密码
    if(objVal.length < 6){//老密码
        showError(obj,type,"登录密码不可以少于6位!");
    } else {
        if(ajax == 1){
            var data = {
                'data[password]' :stringToHex(objVal),
                'scenario' : "change_password",
                'type':"account",
                '_csrf' : $("meta[name=csrf-token]").attr("content")
            };
            $.ajax({
                type: 'POST',
                url: '/site/ajax-validate.html',
                data: data,
                success: function (data) {
                    if(!data.status){
                        //原始密码错误
                        showError(obj,type,"原始密码输入错误!");
                        return false;
                    }else {
                        //原始密码正确
                        clearError(obj,type);
                        return true;
                    }
                }
            });
        }
    }
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
    function firstContractEndDate(verfyName,type){
        var firstBegin = $('#first_contract_begin_date').val(),
            t = this,
            tDom = $(t),
            objVal = tDom.val();
        if($.trim(firstBegin) != ''){
            var begin = new Date(firstBegin),
                end = new Date(objVal);
            if(begin>=end){
                showError(tDom,type,"合同结束时间需要晚于合同开始时间")
            }else{
                clearError(tDom,type)
            }
        }else{
            clearError(tDom,type)
        }
    }
    function nowContractBeginDate(verifyName,type){
        var firstEnd = $('#now_contract_end_date').val(),
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
    function nowContractEndDate(verifyName,type){
        var firstBegin = $('#now_contract_begin_date').val(),
            t = this,
            tDom = $(t),
            objVal = tDom.val();
        if($.trim(firstBegin) != ''){
            var begin = new Date(firstBegin),
                end = new Date(objVal);
            if(begin>=end){
                showError(tDom,type,"合同结束时间需要晚于合同开始时间")
            }else{
                clearError(tDom,type)
            }
        }else{
            clearError(tDom,type)
        }
    }

    function entranceYearmo(verifyName,type){
        var firstEnd = $('#graduation_yearmo').val(),
            t = this,
            tDom = $(t),
            objVal = tDom.val();
        if($.trim(firstEnd) != ''){
            var end = new Date(firstEnd),
                begin = new Date(objVal);
            if(begin>=end){
                showError(tDom,type,"入学时间需要晚于毕业时间")
            }else{
                clearError(tDom,type)
            }
        }else{
            clearError(tDom,type)
        }
    }
    function graduationYearmo(verifyName,type){
        var firstBegin = $('#entrance_yearmo').val(),
            t = this,
            tDom = $(t),
            objVal = tDom.val();
        if($.trim(firstBegin) != ''){
            var begin = new Date(firstBegin),
                end = new Date(objVal);
            if(begin>=end){
                showError(tDom,type,"入学时间需要晚于毕业时间")
            }else{
                clearError(tDom,type)
            }
        }else{
            clearError(tDom,type)
        }
    }

    function departmentLenovo(verifyName,type){
        var t = $(this),
            id = $(this).attr('department_id') ,
            val = $(this).val();
        if(val && id){
            clearError(t,type)
        }else{
            showError(t,type,'不是有效部门')
        }

    }

    function directorLenovo(verifyName,type){
        var t = $(this),
            id = $(this).attr('director_id'),
            val = $(this).val();
        if(val && id){
            clearError(t,type)
        }else{
            showError(t,type,'不是有效部门')
        }
    }

    function insuranceNum(verifyName,type){
        valueCheck("mid",0,1000000,this,verifyName,type)

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

//ajax报错
    function showAjaxError(faDom,type,text){//直接传inputBox
        clearAjaxError(faDom,type);
        var tDom = $(faDom);
        var FaDom = tDom.parent('.rows');
        tDom.addClass('has-error-input');
        FaDom.addClass('has-error');

        if(tDom.find('.error').length == 0){
            var error = $("<div class='error " + type + "'></div>");
            error.text(text);
            tDom.append(error)
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

//清除ajax报错方法
    function clearAjaxError(faDom,type){
        var tDom = $(faDom);
        var FaDom = tDom.parent('.rows');
        tDom.find("." + type).remove();
        tDom.removeClass("has-error-input");
        FaDom.removeClass("has-error");
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


//手机号码,邮箱的后台判断
    function commonAjax(type,obj,errorType){
        var objVal = $(obj).val();
        var data = "data[" + type + "]=" + objVal + "&_csrf=" + $("meta[name=csrf-token]").attr("content") + "&scenario="+ (type == "mobile" || type == 'new_mobile' ? "change_mobile" : "account") +"&type=account";

        $.ajax({
            type: 'POST',
            url: '/site/ajax-validate.html',
            data: data,
            success: function (data) {
                if(!data.status){
                    //被占用
                    if(type == "email"){
                        showError(obj,errorType,"邮箱已被占用!");
                    }else if(type == "mobile"){
                        showError(obj,errorType,data.data.errors.mobile);
                    }else if(type == 'new_mobile'){
                        showError(obj,errorType,data.data.errors.new_mobile);
                    }
                    return false;
                }else {
                    //没被占用
                    clearError(obj,errorType);
                    return true;
                }
            }
        });
    }

//密码的ajax后台判断
    function passwordAjax(status,obj,type){
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
                    showError(obj,type,data.data.errors.password);
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
                            clearError(obj,type);
                            another_parent.find(".error-text").remove();
                            another_grandfather.removeClass("has-error");
                            return true;
                        }
                    }else {
                        clearError(obj,type);
                        return true;
                    }
                }
            }
        });
    }

//指定id的input报错
    function showErrorWithId(id,text){
        var target = $("#"+id);
        var parent = $("#"+id).parent();
        var grandfather = $("#"+id).closest(".rows");

        parent.find(".error-text").remove();
        var error = $("<div class='error-text'></div>");
        error.text(text);
        parent.append(error).addClass("has-error-input");
        grandfather.addClass("has-error");
    }
    function clearErrorWithId(id){
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


    //点击提交监测
    function checkFormHasError(id){
        if($(id + ' .active').find('.error').length >0){
            return true
        }

        $(id + ' .active .rows .input-box').each(function(){
            console.log(123);
            $(this).find('input').blur();
            $(this).find('textarea').blur();
            if($(this).find('select').length > 0){//select
                var select = $(this).find('select');

                if(select.val() == "0" && select.hasClass('vf-required')&&select.attr('id') != 'hire_type'){
                    showError(select,'required',"请选择")
                }else{
                    clearError(select,'required')
                }
            }else if($(this).find('.required-uploader').length > 0){
                var $uploaderBox = $(this).find('.uploader-box');
                var url_tmp = $uploaderBox.find('.replace').attr('url');
                if($.trim(url_tmp) == '' || $.trim(url_tmp) == ""){
                    showError($uploaderBox,'required','请上传')
                }else{
                    clearError($uploaderBox,'required');
                }
            }
        });

        if($(id + ' .active').find('.error').length >0){
            return true
        }
    }

    //点击期权提交验证
    function checkStockFormHasError(id){
        $(id + ' input,' + id + ' textarea').each(function(){
            $(this).trigger('blur');

        })

        if($(id).find('.error').length > 0){
            return true
        }
    }

    function checkHome(){
        $('form .row .input-box').each(function(){
            $(this).trigger('click')
            $(this).find('input').trigger('blur')
        });

    }
//})


