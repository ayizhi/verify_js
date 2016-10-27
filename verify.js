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
// 23.value-area-remove 取值范围(0~10),0报错
//24.passport 护照号
//100all-number  [-100,100],支持两位小数
//3float 百分比,最多支持三位小数



//前面需要加verify-,只有require前不需要

    var ErrorType = {
        'required' : require,
        'password' : verifyPassWord,
        'number' : verifyNumber,
        'float' : verifyFloat,
        '3float': verify3Float,
        'positiveFloat':verifyPositiveFloat,
        'positiveInteger' : verifyPositiveInteger,
        'positive':verifyPositive,
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
        'value-area-remove':verifyAreaRemoLength,
        'value-area-mid':verifyAreaLengthMid,
        'custom' : verifyCustom,
        'date' : verifyDate,
        'org-code' : verifyOrgCode,
        'username' : verifyUsername,
        'date-md' : verifyDateMd,
        'password-old' : verifyPassWordOld,
        'http' : verifyHttp,
        'first-contract-begin':firstContractBeginDate,
        'first-contract-end':firstContractEndDate,
        'now-contract-begin':nowContractBeginDate,
        'now-contract-end':nowContractEndDate,
        'entrance-yearmo':entranceYearmo,
        'graduation-yearmo':graduationYearmo,
        'later-than-enterDate':laterThanEnterDate,
        'earlier-than-today':earlierThanToday,
        'regular-date':regularDateVerify,
        'insurance-num':insuranceNum,
        'passport':verifyPassport,
        '100float':verify100Float,
        '100all-number' : verify100AllNumber,
        'ccemail': verifyCCEmail,
        '0to500-number' : verify0to500Number,
    }

    //===============================================基础工作区start===============================================
    //============================================================================================================
    //============================================================================================================

    for(var i in ErrorType){
        (function(i){
            $(document).on('change blur','.vf-' + i,function(){
                var $t = $(this);
                $t.attr('async') === undefined && checkValue(this,i,ErrorType[i.toString()])
            })
        })(i)
    }

    function checkValue(dom,type,callback){
        var val = $(dom).val();
        if(type != 'required'){
            if($.trim(val) == ""){
                return
            }
        }

        callback.call(dom,type);
    }

    //verify方法绑定$
    $.fn.verify = function(callback){
        if(callback){
            callback.call(this)
        }
    }

    //ShowError方法绑定$
    $.fn.showError = function(type,text){
        showError(this,type,text)
    }

    $.fn.clearError = function(type){
        clearError(this,type)
    }


    //报错方法
    function showError(thisDom,type,text){
        clearError(thisDom,type);
        var tDom = $(thisDom);
        var faDom = tDom.parents('.input-box');

        faDom.addClass('has-error-input');
        faDom.addClass(type + 'errorerrorerror');

        if(faDom.find('.error').length == 0){
            var error = $("<div class='error " + type + "'></div>");
            error.text(text);
            faDom.append(error)
        }
        return false
    }



    //清除报错方法
    function clearError(thisDom,type){
        var tDom = $(thisDom);
        var faDom = tDom.parents('.input-box');
        faDom.find("." + type).remove();
        if(faDom.hasClass(type + 'errorerrorerror')){
            faDom.removeClass("has-error-input");
            faDom.removeClass(type + 'errorerrorerror');
        };
    }


    //规则验证
    function regularCheck(dom,type,rule,text){
        var objVal = $(dom).val()
        if(type == 'phone' || type == 'resetPhone'){
            objVal = formatPhoneNum(objVal);
        }
        if(!rule.test(objVal)){
            showError(dom,type,text);
            return false;
        }else {
            clearError(dom,type);
            return true;
        }
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
    function inputLengthCheck(type,min,max,obj,errorType){
        var objVal = $.trim($(obj).val());
        if(type == "min"){
            //只有下线
            if(objVal.length < min){
                var text =  "最少包含"+ min +"个字符";
                showError(obj,errorType,text);
                return false;
            }else {
                clearError(obj,errorType);
                return true;
            }
        }else if(type == "max"){
            //只有上线
            if(objVal.length > max){
                var text =  "最多包含"+ max +"个字符";
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
                    var text =  "只能包含"+ min +"个字符";
                    showError(obj,errorType,text);
                    return false;
                }else {
                    clearError(obj,errorType);
                    return true;
                }
            }else {
                if(objVal.length < min || objVal.length > max){
                    var text =  "只能包含"+ min + "~" + max + "个字符";
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
    function valueCheck(type,min,max,obj,errorType){
        //判断值是否可以转化为number来比较
        var objVal = $(obj).val()
        var val = parseFloat(objVal, 10);
        if(!val && val != 0){
            showError(obj,errorType, "必须是数字!");
            return false;
        }

        if(type == "min"){
            //只有下限
            var min = parseFloat(min);
            if(val >= min ){
                clearError(obj,errorType);
                return true;
            }else {
                showError(obj,errorType, "不能小于"+ min);
                return false;
            }
        }else if(type == "max"){
            //只有上限
            var max = parseFloat(max);
            if(val <= max ){
                clearError(obj,errorType);
                return true;
            }else {
                showError(obj,errorType, "不能大于"+ max);
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
                showError(obj,errorType, "范围在"+ min + "~" + max +"之间");
                return false;
            }
        }else if(type == "midR"){
            //不包括最小值
            var min = parseFloat(min);
            var max = parseFloat(max);
            if(val <= max && val > min){
                clearError(obj,errorType);
                return true;
            }else {
                showError(obj,errorType, "范围在"+ min + "~" + max +"之间");
                return false;
            }
        }else if(type == 'midZ'){
            //不包括最小值最大值
            var min = parseFloat(min);
            var max = parseFloat(max);
            if(val < max && val > min){
                clearError(obj,errorType);
                return true;
            }else {
                showError(obj,errorType, "范围在"+ min + "~" + max +"之间");
                return false;
            }
        }
    }




    //rc4
    function encrypt(str) {
        var key = $("meta[name='csrf-token']").attr('content') || 'qjydxone';
        // rc4
        var s = [], j = 0, x, res = '';
        for (var i = 0; i < 256; i++) {
            s[i] = i;
        }
        for (i = 0; i < 256; i++) {
            j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
            x = s[i];
            s[i] = s[j];
            s[j] = x;
        }
        i = 0;
        j = 0;
        for (var y = 0; y < str.length; y++) {
            i = (i + 1) % 256;
            j = (j + s[i]) % 256;
            x = s[i];
            s[i] = s[j];
            s[j] = x;
            res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
        }

        // strToHex
        var val="";
        for(var i = 0; i < res.length; i++){
            var ascii = res.charCodeAt(i);
            if(val == "")
                val = ascii >= 16 ? ascii.toString(16) : ('0' + ascii.toString(16));
            else
                val += ascii >= 16 ? ascii.toString(16) : ('0' + ascii.toString(16));
        }
        return val;
    }



    //============================================================================================================
    //============================================================================================================
    //===============================================基础工作区end==================================================










    //================================================功能函数区start==============================================
    //============================================================================================================
    //============================================================================================================


    //number整数
    function verifyNumber(type){
        return regularCheck(this,type,/^\d*$/,"必须是正整数！")
    }

    //float两位小数
    function verifyFloat(type){
        var allowance = $(this).data("allowance");
        var text = "必须是正数，支持最多两位小数！";
        if(1 == allowance){
            text = "奖金津贴必须是正数，支持最多两位小数";
        }
        return regularCheck(this,type,/^[0-9]+(\.?[0-9]{1,2})?$/,text)
    }

    //3float两位小数
    function verify3Float(type){
        var text = "最多支持三位小数！";
        return regularCheck(this,type,/(?!^0\.0?0$)^[0-9][0-9]?(\.[0-9]{1,3})?$|^100$/,text)

    }

    //大于零的两位小数
    function verifyPositiveFloat(type){
        var text = "必须是正数，支持最多两位小数！";
        var val = $(this).val();
        if(parseFloat(val) > 0){
            return regularCheck(this,type,/^[0-9]+(\.?[0-9]{1,2})?$/,text)
        }else{
            showError(this,type,text)
            return false
        }
    }


    //positiveInterger正整数
    function verifyPositiveInteger(type){
        var text = "必须是大于零的整数";
        return regularCheck(this,type,/^[1-9]+[0-9]*]*$/ ,text)
    }

    //大于零
    function verifyPositive(type){
        var val = $(this).val();
        if(parseFloat(val) > 0){
            clearError(this,type)
            return true
        }else{
            showError(this,type,'必需大于零')
            return false
        }
    }


    //百分比
    function verifyPercent(type){
        var text =  '必须是0-100的数值,小数点后最多两位'
        return regularCheck(this,type,/^(([0-9]{1,2}(\.\d{0,2})?)|100)$/,text)
    }



    //正负两位小数
    function verifyAllNumber(type){
        return regularCheck(this,type,/^[+-]?\d*\.?\d{0,2}$/, "必须是数字,支持负数,支持最多两位小数!")
    }

    //验证码
    function verifyVerifyCode(type){
        return regularCheck(this,type,/^\d{6}$/,"验证码输入有误!")
    }

    //银行卡
    function verifyBankCard(type){
        return regularCheck(this,type,/^\d{15,20}$/,"银行卡号格式错误！")
    }

    //固定电话
    function verifyTeleNumber(type){
        return regularCheck(this,type,/^\d{3,4}-\d{7,8}$/,"格式错误！")
    }

    //用户名
    function verifyUsername(type){
        return regularCheck(this,type,/(^1[3-9][0-9]\d{4,8}$)|(^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$)/,"请输入正确的邮箱或手机号！")
    }

    //日期
    function verifyDate(type){
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
    function verifyDateMd(type){
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
    function verifyIdentity(type){
        var t = this;
        var faDom = $(t).parent('.input-box')
        var objVal = $(this).val()
        var birthYear = objVal.substr(6,4) ;
        var birthMonth = objVal.substr(10,2) - 1;
        var birthday = objVal.substr(12,2);
        var nowDate = new Date();
        var date = new Date(birthYear,birthMonth,birthday);


        if($.trim(objVal).length != 18){
            showError(t,type,'不是正确的18位格式的身份证号!');
            return false
        }else if(nowDate.getTime() < date.getTime()){
            showError(t,type,'身份证号格式错误!');
            return false;
        }else if(!(date.getFullYear() == birthYear && date.getMonth() == birthMonth && date.getDate() == birthday)){
            showError(t,type,"身份证号格式错误!");
            return false
        }else{
            return regularCheck(this,type,/(^\d{18}$)|(^\d{17}(\d|X|x)$)/,"身份证号格式错误！")
        }
    }


    //护照号验证
    function verifyPassport(type){
        var obj = $(this);
        var val = obj.val();
        var len = val.length;
        if(len > 0){
            if(len >= 5 && len <= 20){
                return true;
            }else{
                showError(obj,type,'护照号为5-20个字符');
                return false;
            }
        }
    }

    //组织机构
    function verifyOrgCode(type){
        var objVal = $(this).val()
        if(orgcodevalidate(objVal)){
            showError(this,type,"组织机构代码证输入错误");
            return false;
        }else {
            clearError(this,type);
            return true;
        }
    }

    //自定义
    function verifyCustom(type){
        var obj = this;
        var rule_input = $(obj).data("rule");
        var text = $(obj).data("text");
        var rule = new RegExp(rule_input);
        return regularCheck(obj,type,rule,text)
    }

    //输入长度范围
    function verifyInputLength(type){
        //验证的是字符不限数字
        var obj = this;
        var max = $(obj).data("max");
        var min = $(obj).data("min");

        if(max && !min){
            //只有上限
            return inputLengthCheck("max",'',max,obj,type);
        }else if(!max && min){
            //只有下线
            return inputLengthCheck("min",min,'',obj,type);
        }else if(max && min){
            return inputLengthCheck("mid",min,max,obj,type);
        }
    }

    //输入大小范围
    function verifyAreaLength(type){
        //验证的是字符不限数字
        var obj = this;
        var max = $(obj).attr('data-max');
        var min = $(obj).attr('data-min')

        if(undefined != max && undefined == min){
            //只有上限
            return valueCheck("max","",max,obj,type)
        }else if(undefined == max && undefined != min){
            //只有下线
            return valueCheck("min",min,"",obj,type)
        }else if(undefined != max && undefined != min){
            return valueCheck("mid",min,max,obj,type)
        }
    }

    //数值范围(0~10,包含0)
    function verifyAreaRemoLength(type){
        //验证的是字符不限数字
        var obj = this;
        var max = $(obj).attr('data-max');
        var min = $(obj).attr('data-min');
        return valueCheck("midR",min,max,obj,type);
    }

    //输入范围(0~10,[0-10])
    function verifyAreaLengthMid(type){
        var obj = this;
        var max = $(obj).attr('data-max');
        var min = $(obj).attr('data-min');
        return valueCheck("midZ",min,max,obj,type);
    }

    //设置手机号
    function verifyPhoneNum(type){
        var obj = this,
            employeeId = $(this).attr('employeeId');
        return regularCheck(obj,type,/^1[3-9][0-9]\d{8}$/,"请输入正确手机号！")
    }

    //重新设置手机号验证
    function verifyResetPhoneNum(type){
        var obj = this;
        var phoneNum = $(this).val();
        $(this).val(phoneNum);
        return regularCheck(obj,type,/^1[3-9][0-9]\d{8}$/,"请输入正确手机号！")
    }

    //email
    function verifyEmail(type){
        var obj = this;
        return regularCheck(obj,type,/^([a-zA-Z0-9._-]){2,18}@([a-zA-Z0-9_-]){1,60}\.([a-zA-Z0-9._-]){1,15}$/,"请输入正确邮箱！")
    }

    //http
    function verifyHttp(type){
        var reg = "^(http|https)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$"
        var myregex = new RegExp(reg);
        return regularCheck(this,type,myregex, "必须符合http格式")
    }


    //password
    function verifyPassWord(type){
        //密码验证和重复密码验证绑定
        var obj = this;
        return regularCheck(obj,type,/^[0-9a-zA-Z]{8,20}$/,"密码应为8-20位数字和字母组合！") && regularCheck(obj,type,/\d+/,"密码应为8-20位数字和字母组合") &&regularCheck(obj,type,/[a-zA-Z]+/,"密码应为8-20位数字和字母组合")
    }


    //passwordOld
    function verifyPassWordOld(type){
        var obj = this;
        var objVal = $(obj).val();
        if(objVal.length < 6){//老密码
            showError(obj,type,"登录密码不可以少于6位!");
            return false;
        } else {
            clearError(obj,type);
            return true;
        }
    }


    //require验证
    function require(type){
        if($(this).hasClass('selectingDate')){
            $(this).removeClass('selectingDate');
            return
        }

        //地区选择,必填的时候
        if($(this).attr('id') == 'company_city'){
            if($(this).siblings('.areaPicker-box').css('display') == 'block'){
                return
            }
        }

        console.log(223452345)

        var t = this;
        var tDom = $(t);
        var objVal = $.trim(tDom.val());

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
                showError(tDom,type, "不能为空!");
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
                showError(tDom,type,"合同开始时间需要早于合同结束时间")
                return false
            }else{
                clearError(tDom,type)
                return true
            }
        }else{
            clearError(tDom,type)
            return true
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

    function nowContractBeginDate(type){
        var nowEnd = $('#now_contract_end_date').val(),
            t = this,
            tDom = $(t),
            objVal = tDom.val();
        if($.trim(nowEnd) != ''){
            var end = new Date(nowEnd),
                begin = new Date(objVal);
            if(begin>=end){
                showError(tDom,type,"合同开始时间需要早于合同结束时间")
            }else{
                clearError(tDom,type)
            }
        }else{
            clearError(tDom,type)
        }


    }
    function nowContractEndDate(type){
        var nowBegin = $('#now_contract_begin_date').val(),
            t = this,
            tDom = $(t),
            objVal = tDom.val();
        if($.trim(nowBegin) != ''){
            var begin = new Date(nowBegin),
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

    function entranceYearmo(type){
        var firstEnd = $('#graduation_yearmo').val(),
            t = this,
            tDom = $(t),
            objVal = tDom.val();
        if($.trim(firstEnd) != ''){
            var end = new Date(firstEnd),
                begin = new Date(objVal);
            if(begin>=end){
                showError(tDom,type,"入学时间需要早于毕业时间")
            }else{
                clearError(tDom,type)
            }
        }else{
            clearError(tDom,type)
        }
    }
    function graduationYearmo(type){
        var firstBegin = $('#entrance_yearmo').val(),
            t = this,
            tDom = $(t),
            objVal = tDom.val();
        if($.trim(firstBegin) != ''){
            var begin = new Date(firstBegin),
                end = new Date(objVal);
            if(begin>=end){
                showError(tDom,type,"毕业时间需要晚于入学时间")
            }else{
                clearError(tDom,type)
            }
        }else{
            clearError(tDom,type)
        }
    }

    function laterThanEnterDate(type){
        var tDom = $(this);
        var enterDate = new Date($(this).attr('enterDate'));
        var selectDate = new Date($(this).val());
        if(selectDate<enterDate){
            showError(tDom,type,'必需晚于或等于入职时间')
        }else{
            clearError(tDom,type)
        }

    }

    function earlierThanToday(type){
        var tDom = $(this);
        var todayDate = new Date();
        var selectDate = new Date($(this).val());

        if(selectDate.getTime() > todayDate.getTime()){
            showError(tDom,type,'不得晚于今天')
        }else{
            clearError(tDom,type)
        }
    }


    function regularDateVerify(verfyName,type){
        var firstBegin = $('#entry_date').html(),
            t = this,
            tDom = $(t),
            objVal = tDom.val();

        if($.trim(firstBegin) != ''){
            var begin = new Date(firstBegin),
                end = new Date(objVal);
            if(begin>end){
                showError(tDom,type,"要晚于或等于入职时间")
            }else{
                clearError(tDom,type)
            }
        }else{
            clearError(tDom,type)
        }
    }



    function insuranceNum(type){
        var text =  "必须是正数，支持最多两位小数！";
        if(!regularCheck(this,type,/^[0-9]+(\.?[0-9]{1,2})?$/,text)){
            return false
        }
        return valueCheck("mid",0,1000000,this,type)

    }

    //100float, [0,100],支持两位小数
    function verify100Float(type){
        var text =  "0到100之间，支持两位小数！";
        return regularCheck(this,type,/(?!^0\.0?0$)^[0-9][0-9]?(\.[0-9]{1,2})?$|^100$/,text)
    }

    //[-100,100],支持两位小数
    function verify100AllNumber(type){
        return regularCheck(this,type,/^-?(100|[1-9]?\d(\.\d{0,2})?)$/, "-100到100,支持两位小数!")
    }

    //[0,500],支持一位小数
    function verify0to500Number(type){
        return regularCheck(this,type,/(?!^0\.0?0$)^([1-4][0-9]?[0-9]?|[0-9][0-9]?)(\.[0-9])?$|^500$/, "范围在0到500之间，保留一位小数")
    }


    // CCEmail验证
    function verifyCCEmail(type) {
        var content = $(this).val();
        var data = content.replace(/；/g, ';');
        var dataArray = data.split(";");
        var state = true;
        var reg = /^([a-zA-Z0-9._-]){2,18}@([a-zA-Z0-9_-]){1,60}\.([a-zA-Z0-9._-]){1,15}$/;
        if (dataArray.pop().trim() != '') {
            showError(this, type, "请以分号结尾!");
            return false;
        }

        dataArray.forEach(function(value){
            if (!reg.test(value.trim())) {
                state = false;
            }
        });

        if(!state){
            showError(this, type, "请输入正确邮箱!");
            return false
        }

        clearError(this,type)
        return true
    }

    function formatPhoneNum(phoneNum){
        var tmp = phoneNum.split('-');
        return tmp.join('')
    }
    //=========================================================================================================
    //=========================================================================================================
    //================================================功能函数区end==============================================


