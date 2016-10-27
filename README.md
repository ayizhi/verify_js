# verify_js

针对表单验证写的js库

##需要结构
<div class='input-box'>
   <input class='vf-required vf-float'>
</div>

也就是说外面必须有个input－box的框
input需要哪个验证就去verify/ErrorType中去找，然后在input类名中以vf- 加上 ErrorType的所需要的验证类型的值

##回调
$(dom).verify(function(){})来添加回调以及事件，并在input的属性中加上 'async'


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
