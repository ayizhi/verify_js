$('#name').verify(function(){
    $(this).blur(function(){
        var ifRequired = ErrorType.required.call(this,'required');
        var ifFloat = ErrorType.float.call(this,'float');
        if (ifRequired && ifFloat){
            console.log(11111)
        }
    })
})