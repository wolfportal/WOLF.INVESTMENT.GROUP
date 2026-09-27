/* WOLF INVESTMENT GROUP — chatbot switch for the whole site.
   To turn the respond.io chat back on, change false to true below. */
var WOLF_CHATBOT_ON = false;

(function () {
  if (!WOLF_CHATBOT_ON) {
    var st = document.createElement('style');
    st.textContent = '.chat-hint,.chat-hint-g{display:none!important}';
    document.head.appendChild(st);
    return;
  }
  var s = document.createElement('script');
  s.id = 'respondio__widget';
  s.src = 'https://cdn.respond.io/webchat/widget/widget.js?cId=143f07de414e0f78d978da9b8cadcf2';
  document.body.appendChild(s);
})();
