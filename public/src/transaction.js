var cnt = 0;
$("ul").on("click","li",function(){
	$(this).toggleClass("selectli");
});

$("#add").click(function(){  
        var newP = $("#maindrop option:selected").text();
        var pId = $("#maindrop").val();
        var qty = $("#qty").val();
        var str = "<li class= \"list-group-item d-flex justify-content-between align-items-center\">" +
                newP + "<span class= \"badge badge-primary badge-pill\">" + qty + "</span> </li>";

        $("ul").append(str);
        $("<input style = \"display : none\"  name = \"arr[" + cnt +"]\"  type = \"text\" >").insertBefore("#total");
        $("<input style = \"display : none\"  name = \"amt[" + cnt + "]\"  type = \"number\" >").insertBefore("#total");
        document.getElementsByName("arr["+cnt+"]")[0].value = pId;  
        document.getElementsByName("amt["+cnt+"]")[0].value = qty;  

        cnt = cnt+1;

        var temp = '';
        console.log(newP);
        for(var i=0; i<newP.length; ++i){
                if(newP[i] == 'R' && newP[i+1] == 's'){
                        for(var j = i+3; j<newP.length; ++j){
                                temp = temp+newP[j];
                        }
                        break;
                }
        }
        temp = Number(temp);
        var curr = $("#cost").html();
        curr = Number(curr);
        $("#cost").html(curr+qty*temp);
        document.getElementById("total").value = curr + qty*temp;
});

$(".fa-chevron-down").on("click",function(){
        $("input").fadeToggle();
}); 