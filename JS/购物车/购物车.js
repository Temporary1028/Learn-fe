// JavaScript Document
window.onload = function() {
  var goodsTable = document.getElementById("goodsTable"); 
  var tr = goodsTable.children[1].rows; //通过children获取所有的子节点并选择第二个，即tbody，.rows 获取所有的tr元素
  var checkInput = document.getElementsByClassName("check");
  var checkAllInputs = document.getElementsByClassName("check-all");
  var selectedTotal = document.getElementById("selectedTotal");
  var priceTotal = document.getElementById("priceTotal");
  var deleteAll = document.getElementById("deleteAll");
  
  
  //计算函数
  function getTotal () {
    var selected = 0 ;
    var price = 0 ;
    for (var i = 0, len=tr.length; i<len;i++){
      if (tr[i].getElementsByTagName("input")[0].checked) {  //遍历取得每一行的第一个输入框，即checkbox 的状态
        tr[i].className="on";
        selected += parseInt(tr[i].getElementsByTagName("input")[1].value);//将数量框的内容，利用parseint转化为数字；
        price += parseFloat(tr[i].cells[4].innerHTML); //利用cells[4]获得td——价格,并将价格转化为浮点数 
      }
      else {
        tr[i].className="";
      }
    }
    selectedTotal.innerHTML = selected;
    priceTotal.innerHTML = price.toFixed(2); // tofixed方法，只保留两位小数
  }
  
  //小计
  function getSubTotal(tr) {
    var tds=tr.cells;
    var price = parseFloat(tds[2].innerHTML);
    var count = parseInt(tr.getElementsByTagName("input")[1].value);
    var SubTotal = parseFloat(price*count);
    tds[4].innerHTML = SubTotal.toFixed(2);
  }
  
  //全选
  for (var i = 0 ,len= checkInput.length; i<len; i++) {
    checkInput[i].onclick = function(){
      if (this.className === "check-all check") {    //当点击全选框时，遍历所有选择框，并使checked一致
        for (var j = 0 ;j<checkInput.length;j++){
          checkInput[j].checked = this.checked;
        }
      }
      if (this.checked==false){
        for (var k = 0; k<checkAllInputs.length;k++){  //当有一个选择框取消选择时，同时取消全选框的勾选
          checkAllInputs[k].checked=false;
        }
      }
      getTotal();
    }
  }
  
  //数量加减号
  for (var i = 0 ;i<tr.length;i++){
    tr[i].onclick = function (e) {
      e = e || window.Event;
      var el = e.srcElement;
      var cls = el.className;
      var input = this.getElementsByTagName("input")[1];
      var val = parseInt(input.value);
      var reduce = this.getElementsByTagName("span")[1];
      switch (cls) {
        case "add" :
          input.value = val + 1;
          reduce.innerHTML = "-"; //数量为零时，减号不显示，而增加后，出现减号
          getSubTotal(this);
          break;
        case "reduce":
          if (val>1) {
            input.value = val - 1;
          }
          if(input.value<=1) {
            reduce.innerHTML=""
          }
          getSubTotal(this);
          break;
        case "delete" :
          var conf = confirm("确定要删除这件商品吗");
          if (conf){
            this.parentNode.removeChild(this)  //先取到父节点，再调用removeChild删除自身
          }
          break;
        default:
          break;
      }
      getTotal();
    }
    tr[i].getElementsByTagName("input")[1].onkeyup = function(){
      var val= this.value;
      var tr = this.parentNode.parentNode //通过输入框获取父节点的父节点，得到对应的tr
      var reduce = tr.getElementsByTagName("span")[1];
      if (isNaN(val)||val<=1){   //在表格内输入不为数字，或者输入小于一的数，则默认数量为1
        val = 1;
      }
      this.value= val;
      if (val<=1){
        reduce.innerHTML="";
      }
      else {
        reduce.innerHTML="-"
      }
      getSubTotal(tr);
      getTotal();
    }
  }
  
  //批量删除
  deleteAll.onclick = function(){
    if(selectedTotal.innerHTML!="0"){   //先判断选中商品是否为0，即若没有选商品，就不做操作
      var conf = confirm("确定要删除所选吗？")
      if (conf){
        for (var i =0; i<tr.length;i++){
          var input = tr[i].getElementsByTagName("input")[0];
          if (input.checked) {
            tr[i].parentNode.removeChild(tr[i]);
            i--;          //删除一项后，数组的数量减少，此时若标号 i 不对应减少，就会造成混乱
          }
        }
        getTotal();
      }
    }
  }
}




