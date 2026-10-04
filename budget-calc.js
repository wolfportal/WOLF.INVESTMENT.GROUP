/* WOLF INVESTMENT GROUP — floating budget calculator (all pages).
   Usage: <script src="budget-calc.js?v=1" defer></script>
   Bottom-RIGHT so it never covers the WhatsApp button (bottom-left). */
(function () {
  if (window.__wolfBudgetCalc) return; window.__wolfBudgetCalc = true;
  var WA = '972544228985';
  var DEST = {
    jericho: { label: 'بوابة أريحا', cur: '₪', months: 36, page: 'gallery.html', pageLabel: 'اعرض عقارات بوابة أريحا' },
    georgia: { label: 'جورجيا', cur: '$', months: 36, page: 'georgia.html', pageLabel: 'اعرض الفرص المناسبة في جورجيا' },
    dubai:   { label: 'دبي', cur: '$', months: 48, page: '', pageLabel: '' }
  };
  var PURPOSE = { res: 'سكني', inv: 'استثماري', both: 'سكني واستثماري' };
  var CUR = { ILS: { label: 'شيكل', sym: '₪', after: true }, USD: { label: 'دولار', sym: '$' }, EUR: { label: 'يورو', sym: '€' }, JOD: { label: 'دينار', sym: 'JD', after: true } };
  var DEST_CUR = { jericho: 'ILS', georgia: 'USD', dubai: 'USD' };
  var st = { dest: 'jericho', purpose: 'inv', cur: 'ILS' };
  var money = function (n) { var c = CUR[st.cur]; return c.after ? fmt(n) + ' ' + c.sym : c.sym + ' ' + fmt(n); };

  var css = '' +
    '.wbc-fab{position:fixed;right:20px;bottom:24px;z-index:9995;display:flex;align-items:center;gap:8px;height:52px;padding:0 18px 0 16px;border-radius:999px;border:0;cursor:pointer;' +
      'background:linear-gradient(180deg,#F7EFE2,#D4BE9E);color:#0A0A0A;font-weight:700;font-size:14px;font-family:inherit;box-shadow:0 8px 26px rgba(0,0,0,.4);transition:transform .2s}' +
    '.wbc-fab:hover{transform:translateY(-2px)}' +
    '.wbc-fab svg{flex:none}' +
    '@media (max-width:640px){.wbc-fab{width:52px;padding:0;justify-content:center;right:16px;bottom:22px}.wbc-fab span{display:none}}' +
    '.wbc-ov{position:fixed;inset:0;z-index:9996;background:rgba(0,0,0,.55);opacity:0;pointer-events:none;transition:opacity .25s}' +
    '.wbc-ov.on{opacity:1;pointer-events:auto}' +
    '.wbc{position:fixed;z-index:9997;right:20px;bottom:88px;width:min(380px,calc(100vw - 32px));max-height:calc(100vh - 110px);overflow:auto;direction:rtl;text-align:right;' +
      'background:#0B0B0B;color:#F3EDE3;border:1px solid rgba(212,190,158,.4);border-radius:20px;padding:18px 18px 16px;box-shadow:0 24px 60px rgba(0,0,0,.6);' +
      'transform:translateY(16px) scale(.98);opacity:0;pointer-events:none;transition:transform .25s,opacity .25s;font-family:inherit}' +
    '.wbc.on{transform:none;opacity:1;pointer-events:auto}' +
    '@media (max-width:640px){.wbc{right:0;left:0;bottom:0;width:100%;max-height:88vh;border-radius:22px 22px 0 0;padding-bottom:22px}}' +
    '.wbc h3{font-size:17px;font-weight:800;margin:0 0 2px;color:#FAF7F2}' +
    '.wbc .wbc-sub{font-size:12px;color:#958F86;margin:0 0 12px}' +
    '.wbc-x{position:absolute;top:12px;left:12px;width:34px;height:34px;border-radius:10px;border:1px solid rgba(212,190,158,.3);background:#141414;color:#EADBC4;font-size:15px;cursor:pointer}' +
    '.wbc-l{display:block;font-size:12px;font-weight:700;color:#D4BE9E;margin:12px 0 6px}' +
    '.wbc-chips{display:flex;flex-wrap:wrap;gap:6px}' +
    '.wbc-chip{flex:1 1 auto;min-width:0;padding:9px 10px;border-radius:12px;border:1px solid rgba(212,190,158,.28);background:#141414;color:#CFC8BC;font-weight:700;font-size:13px;font-family:inherit;cursor:pointer;white-space:nowrap}' +
    '.wbc-chip.on{background:linear-gradient(180deg,#F7EFE2,#D4BE9E);color:#0A0A0A;border-color:transparent}' +
    '.wbc-in{position:relative}' +
    '.wbc-in input,.wbc-in select{width:100%;height:46px;border-radius:12px;border:1px solid rgba(212,190,158,.3);background:#141414;color:#FAF7F2;font-weight:700;font-size:16px;font-family:inherit;padding:0 14px 0 52px;direction:ltr;text-align:right;outline:none}' +
    '.wbc-in select{direction:rtl;padding:0 14px;appearance:auto}' +
    '.wbc-in input:focus,.wbc-in select:focus{border-color:#D4BE9E}' +
    '.wbc-cur{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-weight:800;color:#D4BE9E;font-size:15px}' +
    '.wbc-res{margin-top:14px;border-radius:16px;padding:14px;background:linear-gradient(160deg,rgba(212,190,158,.16),rgba(212,190,158,.04));border:1px solid rgba(212,190,158,.35)}' +
    '.wbc-res small{display:block;font-size:12px;color:#B9B2A6}' +
    '.wbc-res b{display:block;font-size:26px;font-weight:900;color:#FAF7F2;direction:ltr;text-align:right;margin:2px 0 6px}' +
    '.wbc-res .wbc-row{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:#CFC8BC;padding-top:6px;border-top:1px solid rgba(212,190,158,.18)}' +
    '.wbc-res .wbc-row i{font-style:normal;direction:ltr}' +
    '.wbc-act{display:flex;flex-direction:column;gap:8px;margin-top:12px}' +
    '.wbc-btn{display:flex;align-items:center;justify-content:center;gap:8px;height:46px;border-radius:12px;font-weight:800;font-size:14px;font-family:inherit;text-decoration:none;cursor:pointer;border:0}' +
    '.wbc-go{background:linear-gradient(180deg,#F7EFE2,#D4BE9E);color:#0A0A0A}' +
    '.wbc-wa{background:#25D366;color:#05220f}' +
    '.wbc-btn[aria-disabled="true"]{opacity:.45;pointer-events:none}' +
    '.wbc-note{font-size:11px;color:#7d776f;margin-top:10px;line-height:1.6}';
  var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);

  var ico = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h4"/></svg>';
  var fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'wbc-fab'; fab.setAttribute('aria-label', 'حاسبة الميزانية'); fab.setAttribute('aria-expanded', 'false');
  fab.innerHTML = ico + '<span>احسب ميزانيتك</span>';
  var ov = document.createElement('div'); ov.className = 'wbc-ov';
  var p = document.createElement('div'); p.className = 'wbc'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-modal', 'true'); p.setAttribute('aria-label', 'حاسبة الميزانية');
  var chips = function (name, obj) { return '<div class="wbc-chips" data-g="' + name + '">' + Object.keys(obj).map(function (k) { return '<button type="button" class="wbc-chip" data-v="' + k + '">' + (obj[k].label || obj[k]) + '</button>'; }).join('') + '</div>'; };
  p.innerHTML =
    '<button type="button" class="wbc-x" aria-label="إغلاق">✕</button>' +
    '<h3>احسب ميزانيتك</h3><p class="wbc-sub">أدخل دفعتك الأولى وقسطك الشهري، ونعرف لك حدود الميزانية المناسبة.</p>' +
    '<span class="wbc-l">مكان الاستثمار</span>' + chips('dest', DEST) +
    '<span class="wbc-l">الغرض من العقار</span>' + chips('purpose', PURPOSE) +
    '<span class="wbc-l">العملة</span>' + chips('cur', CUR) +
    '<label class="wbc-l" for="wbcDown">الدفعة الأولى</label><div class="wbc-in"><input id="wbcDown" type="text" inputmode="numeric" autocomplete="off" placeholder="0"><span class="wbc-cur"></span></div>' +
    '<label class="wbc-l" for="wbcMonthly">الدفعة الشهرية</label><div class="wbc-in"><input id="wbcMonthly" type="text" inputmode="numeric" autocomplete="off" placeholder="0"><span class="wbc-cur"></span></div>' +
    '<label class="wbc-l" for="wbcMonths">مدة التقسيط</label><div class="wbc-in"><select id="wbcMonths">' + [12, 24, 36, 48, 60].map(function (m) { return '<option value="' + m + '">' + m + ' شهراً</option>'; }).join('') + '</select></div>' +
    '<div class="wbc-res"><small>الميزانية الإجمالية التقريبية</small><b id="wbcTotal">—</b>' +
      '<div class="wbc-row"><span>الدفعة الأولى من السعر</span><i id="wbcPct">—</i></div></div>' +
    '<div class="wbc-act"><a class="wbc-btn wbc-go" id="wbcGo" href="#"></a><a class="wbc-btn wbc-wa" id="wbcWa" href="#" target="_blank" rel="noopener">أرسل للمستشار عبر واتساب</a></div>' +
    '<p class="wbc-note">الحساب تقريبي: الدفعة الأولى + (القسط الشهري × عدد الأشهر). الشروط النهائية حسب العقار وخطة الدفع المعتمدة.</p>';
  document.body.appendChild(ov); document.body.appendChild(p); document.body.appendChild(fab);

  var $ = function (id) { return document.getElementById(id); };
  var num = function (el) { return Number(String(el.value).replace(/[^\d]/g, '')) || 0; };
  var fmt = function (n) { return n.toLocaleString('en-US'); };
  function fmtInput(el) {
    var pos = el.value.length - el.selectionStart, v = num(el);
    el.value = v ? fmt(v) : '';
    try { var np = Math.max(0, el.value.length - pos); el.setSelectionRange(np, np); } catch (e) {}
  }
  function setChip(g, v) {
    st[g] = v;
    p.querySelectorAll('[data-g="' + g + '"] .wbc-chip').forEach(function (b) { b.classList.toggle('on', b.dataset.v === v); });
    if (g === 'dest') { $('wbcMonths').value = String(DEST[v].months); if (!st.curPicked) setChip('cur', DEST_CUR[v], true); }
    if (g === 'cur' && !arguments[2]) st.curPicked = true;
    calc();
  }
  function calc() {
    var d = DEST[st.dest], dp = num($('wbcDown')), mo = num($('wbcMonthly')), m = Number($('wbcMonths').value);
    var cs = CUR[st.cur].sym;
    p.querySelectorAll('.wbc-cur').forEach(function (c) { c.textContent = cs; });
    var total = dp + mo * m;
    $('wbcTotal').textContent = total ? money(total) : '—';
    $('wbcPct').textContent = total ? Math.round(dp / total * 100) + '%' : '—';
    var go = $('wbcGo');
    if (d.page) {
      var q = '?wbc=1&dp=' + dp + '&mo=' + mo + '&m=' + m + '&pu=' + st.purpose + '&cur=' + st.cur;
      go.href = d.page + q + (st.dest === 'georgia' ? '#investment-matcher' : '');
      go.textContent = d.pageLabel; go.style.display = '';
    } else { go.style.display = 'none'; }
    var msg = 'مرحباً، حسبت ميزانيتي على موقع WOLF INVESTMENT GROUP:\n' +
      '• مكان الاستثمار: ' + d.label + '\n• الغرض: ' + PURPOSE[st.purpose] + '\n' +
      '• العملة: ' + CUR[st.cur].label + '\n' +
      '• الدفعة الأولى: ' + money(dp) + '\n• الدفعة الشهرية: ' + money(mo) + ' لمدة ' + m + ' شهراً\n' +
      '• الميزانية الإجمالية التقريبية: ' + money(total) + '\nأرجو اقتراح عقارات مناسبة.';
    var wa = $('wbcWa');
    wa.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
    wa.setAttribute('aria-disabled', total ? 'false' : 'true');
  }
  function open() { p.classList.add('on'); ov.classList.add('on'); fab.setAttribute('aria-expanded', 'true'); setTimeout(function () { $('wbcDown').focus({ preventScroll: true }); }, 60); }
  function close() { p.classList.remove('on'); ov.classList.remove('on'); fab.setAttribute('aria-expanded', 'false'); }
  fab.addEventListener('click', function () { p.classList.contains('on') ? close() : open(); });
  ov.addEventListener('click', close);
  p.querySelector('.wbc-x').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && p.classList.contains('on')) close(); });
  p.querySelectorAll('.wbc-chip').forEach(function (b) { b.addEventListener('click', function () { setChip(b.parentNode.dataset.g, b.dataset.v); }); });
  ['wbcDown', 'wbcMonthly'].forEach(function (id) { $(id).addEventListener('input', function () { fmtInput(this); calc(); }); });
  $('wbcMonths').addEventListener('change', calc);
  /* preselect destination from the page */
  var path = location.pathname.toLowerCase();
  setChip('dest', path.indexOf('georgia') > -1 ? 'georgia' : 'jericho');
  setChip('purpose', 'inv');

  /* Georgia page: values from the calculator fill the "find my opportunity" tool */
  try {
    var qs = new URLSearchParams(location.search);
    if (qs.get('wbc') && path.indexOf('georgia') > -1) {
      window.addEventListener('load', function () {
        var dp = +qs.get('dp') || 0, mo = +qs.get('mo') || 0, pu = qs.get('pu');
        if (qs.get('cur') && qs.get('cur') !== 'USD') { dp = 0; mo = 0; }
        var d = $('matchDown'), m = $('matchMonthly');
        if (typeof setMatchPay === 'function') setMatchPay('installment');
        if (typeof setMatchPurpose === 'function') setMatchPurpose(pu === 'res' ? 'residential' : 'investment');
        if (d && dp) { d.value = Math.max(+d.min, Math.min(+d.max, dp)); }
        if (m && mo) { m.value = Math.max(+m.min, Math.min(+m.max, mo)); }
        if (typeof renderMatcher === 'function') renderMatcher();
        var sec = $('investment-matcher'); if (sec) setTimeout(function () { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
      });
    }
  } catch (e) {}
})();
