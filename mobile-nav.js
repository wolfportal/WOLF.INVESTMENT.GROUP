/* WOLF INVESTMENT GROUP — shared mobile side menu
   Usage: <script src="mobile-nav.js" data-header="header.top" data-hide="#nav,#hamburger" data-lang="#nav .lang-switcher button" defer></script>
   On screens up to 1100px it hides the page's own nav (data-hide), adds a menu button to the header,
   and opens a side drawer with the site links, the page's language buttons and social links. */
(function () {
  var me = document.currentScript;
  var cfg = {
    header: (me && me.getAttribute('data-header')) || 'header',
    hide: (me && me.getAttribute('data-hide')) || '',
    lang: (me && me.getAttribute('data-lang')) || '',
    social: (me && me.getAttribute('data-social')) || '',
    extra: (me && me.getAttribute('data-extra')) || '',
    links: (me && me.getAttribute('data-links')) || ''
  };
  var BP = parseInt((me && me.getAttribute('data-bp')) || '1100', 10) || 1100;

  var LINKS = [
    ['index.html', { ar: 'الرئيسية', en: 'Home', he: 'דף הבית', ka: 'მთავარი' }],
    ['gallery.html', { ar: 'معرض العقارات', en: 'Property Gallery', he: 'גלריית נכסים', ka: 'ქონების გალერეა' }],
    ['georgia.html', { ar: 'معرض عقارات جورجيا', en: 'Georgia Property Gallery', he: 'גלריית נכסים בגאורגיה', ka: 'საქართველოს ქონების გალერეა' }],
    ['about.html', { ar: 'من نحن', en: 'About Us', he: 'מי אנחנו', ka: 'ჩვენ შესახებ' }],
    ['jericho-gate.html', { ar: 'بوابة أريحا', en: 'Jericho Gate', he: 'שער יריחו', ka: 'იერიხონის კარიბჭე' }],
    ['why_invest.html', { ar: 'لماذا نستثمر', en: 'Why Invest', he: 'למה להשקיע', ka: 'რატომ ინვესტიცია' }],
    ['contact.html', { ar: 'تواصل معنا', en: 'Contact Us', he: 'צור קשר', ka: 'კონტაქტი' }]
  ];
  var UI = {
    ar: { menu: 'القائمة', close: 'إغلاق القائمة', lang: 'اللغة' },
    en: { menu: 'Menu', close: 'Close menu', lang: 'Language' },
    he: { menu: 'תפריט', close: 'סגירת התפריט', lang: 'שפה' },
    ka: { menu: 'მენიუ', close: 'მენიუს დახურვა', lang: 'ენა' }
  };

  var css = '' +
    '.mnav-btn,.mnav-drawer,.mnav-backdrop{display:none}' +
    '@media(max-width:' + BP + 'px){' +
      (cfg.hide ? cfg.hide.split(',').map(function (s) { return s.trim() + '{display:none!important}'; }).join('') : '') +
      '.mnav-host{position:relative}' +
      '.mnav-btn{display:grid;place-items:center;width:46px;height:46px;padding:0;margin-inline-start:auto;flex:0 0 auto;border:1px solid rgba(232,220,200,.55);border-radius:12px;background:#1a1a1a;color:#e8dcc8;cursor:pointer;-webkit-appearance:none;appearance:none;-webkit-tap-highlight-color:transparent}' +
      '.mnav-btn svg{width:28px;height:28px;display:block;pointer-events:none}' +
      '.mnav-btn:focus-visible,.mnav-close:focus-visible,.mnav-drawer a:focus-visible,.mnav-langs button:focus-visible{outline:2px solid #e8dcc8;outline-offset:2px}' +
      '.mnav-backdrop{display:block;position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.6);opacity:0;pointer-events:none;transition:opacity .3s}' +
      '.mnav-backdrop.show{opacity:1;pointer-events:auto}' +
      '.mnav-drawer{display:flex;flex-direction:column;position:fixed;top:0;bottom:0;right:0;width:min(84vw,330px);z-index:10001;background:#141414;color:#f5f3ef;box-shadow:-20px 0 60px rgba(0,0,0,.5);border-left:1px solid rgba(255,255,255,.1);padding:18px 22px 28px;overflow-y:auto;transform:translateX(105%);visibility:hidden;transition:transform .35s cubic-bezier(.16,1,.3,1),visibility 0s linear .35s;font-family:"Tajawal","Cairo",system-ui,sans-serif;text-align:start}' +
      '.mnav-drawer.ltr{right:auto;left:0;border-left:0;border-right:1px solid rgba(255,255,255,.1);box-shadow:20px 0 60px rgba(0,0,0,.5);transform:translateX(-105%)}' +
      '.mnav-drawer.open{transform:none;visibility:visible;transition:transform .35s cubic-bezier(.16,1,.3,1)}' +
      '.mnav-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}' +
      '.mnav-title{font-size:.8rem;letter-spacing:.12em;color:rgba(245,243,239,.55);font-weight:700}' +
      '.mnav-close{width:40px;height:40px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:#1c1c1c;color:#e8dcc8;font-size:1.3rem;line-height:1;cursor:pointer}' +
      '.mnav-links a{display:block;padding:14px 4px;font-size:1rem;font-weight:500;color:#f5f3ef;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.1)}' +
      '.mnav-links a.active{color:#e8dcc8;font-weight:700}' +
      '.mnav-extra{margin-top:18px}' +
      '.mnav-extra a{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 14px;border:1px solid rgba(232,220,200,.45);border-radius:999px;color:#e8dcc8;text-decoration:none;font-weight:700}' +
      '.mnav-social{display:flex;justify-content:center;gap:10px;margin-top:22px}' +
      '.mnav-social a{width:38px;height:38px;border-radius:50%;display:grid;place-items:center}' +
      '.mnav-langs{display:flex;justify-content:center;gap:4px;align-self:center;margin-top:18px;padding:4px;border:1px solid rgba(255,255,255,.1);border-radius:9px;background:#181818}' +
      '.mnav-langs button{border:0;background:transparent;color:rgba(245,243,239,.7);font:700 .85rem "Tajawal",sans-serif;padding:7px 12px;border-radius:6px;cursor:pointer}' +
      '.mnav-langs button.active{background:#e8dcc8;color:#111}' +
      'html.mnav-lock,html.mnav-lock body{overflow:hidden}' +
    '}';

  function curLang() {
    if (cfg.lang) {
      var act = document.querySelector(cfg.lang.split(',').map(function (s) { return s.trim() + '.active'; }).join(','));
      if (act) return act.getAttribute('data-lang') || act.getAttribute('data-l') || 'ar';
    }
    var l = (document.documentElement.lang || 'ar').slice(0, 2);
    return UI[l] ? l : 'ar';
  }
  function isLtr() {
    return getComputedStyle(document.body).direction === 'ltr';
  }
  function here() {
    var f = location.pathname.split('/').pop();
    return f || 'index.html';
  }

  function init() {
    var host = document.querySelector(cfg.header);
    if (!host) return;
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mnav-btn';
    btn.setAttribute('aria-controls', 'mnavDrawer');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="6.5" x2="20" y2="6.5"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17.5" x2="20" y2="17.5"/></svg>';
    host.classList.add('mnav-host');
    host.appendChild(btn);

    var bd = document.createElement('div');
    bd.className = 'mnav-backdrop';
    var dr = document.createElement('aside');
    dr.className = 'mnav-drawer';
    dr.id = 'mnavDrawer';
    dr.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bd);
    document.body.appendChild(dr);

    function build() {
      var lang = curLang();
      var ui = UI[lang] || UI.ar;
      btn.setAttribute('aria-label', ui.menu);
      dr.setAttribute('aria-label', ui.menu);
      dr.classList.toggle('ltr', isLtr());
      dr.setAttribute('dir', isLtr() ? 'ltr' : 'rtl');
      var cur = here();
      var html = '<div class="mnav-top"><span class="mnav-title">' + ui.menu + '</span><button type="button" class="mnav-close" aria-label="' + ui.close + '">✕</button></div><nav class="mnav-links">';
      if (cfg.links) {
        html += '</nav>';
      } else LINKS.forEach(function (l) {
        var own = null;
        if (cfg.hide) {
          try {
            document.querySelectorAll(cfg.hide).forEach(function (c) {
              if (!own && c.querySelector) own = c.querySelector('a[href="' + l[0] + '"]');
            });
          } catch (e) {}
        }
        var txt = (own && own.textContent.trim()) || l[1][lang] || l[1].ar;
        if (lang !== 'ar' && own && /[؀-ۿ]/.test(txt)) txt = l[1][lang] || txt;
        html += '<a href="' + l[0] + '"' + (l[0] === cur ? ' class="active" aria-current="page"' : '') + '>' + txt + '</a>';
      });
      if (!cfg.links) html += '</nav>';
      if (cfg.extra) html += '<div class="mnav-extra"></div>';
      if (cfg.social) html += '<div class="mnav-social"></div>';
      if (cfg.lang) html += '<div class="mnav-langs" role="group" aria-label="' + ui.lang + '"></div>';
      dr.innerHTML = html;

      if (cfg.links) {
        var list = dr.querySelector('.mnav-links');
        document.querySelectorAll(cfg.links).forEach(function (orig) {
          var t = orig.textContent.trim();
          if (!t) return;
          var a = document.createElement('a');
          var href = orig.getAttribute('href');
          a.href = href || '#';
          a.textContent = t;
          if (orig.getAttribute('target')) { a.target = orig.getAttribute('target'); a.rel = 'noopener'; }
          var local = !href || href.charAt(0) === '#';
          a.addEventListener('click', function (e) {
            if (local) {
              e.preventDefault();
              setOpen(false);
              setTimeout(function () { orig.click(); }, 30);
            }
          });
          list.appendChild(a);
        });
      }

      if (cfg.extra) {
        var ex = document.querySelector(cfg.extra);
        if (ex) {
          var a = document.createElement('a');
          a.href = ex.getAttribute('href') || '#';
          a.textContent = ex.textContent.trim();
          a.addEventListener('click', function (e) { e.preventDefault(); setOpen(false); ex.click(); });
          dr.querySelector('.mnav-extra').appendChild(a);
        }
      }
      if (cfg.social) {
        var so = document.querySelector(cfg.social);
        if (so) dr.querySelector('.mnav-social').innerHTML = so.innerHTML;
      }
      if (cfg.lang) {
        var box = dr.querySelector('.mnav-langs');
        document.querySelectorAll(cfg.lang).forEach(function (orig) {
          var b = document.createElement('button');
          b.type = 'button';
          b.textContent = orig.textContent.trim();
          if (orig.classList.contains('active')) b.classList.add('active');
          b.addEventListener('click', function () {
            orig.click();
            setTimeout(function () { build(); dr.querySelector('.mnav-close').focus(); }, 60);
          });
          box.appendChild(b);
        });
      }
      dr.querySelector('.mnav-close').addEventListener('click', function () { setOpen(false); btn.focus(); });
      dr.querySelectorAll('.mnav-links a').forEach(function (a) {
        a.addEventListener('click', function () { setOpen(false); });
      });
    }

    function setOpen(o) {
      if (o) build();
      dr.classList.toggle('open', o);
      bd.classList.toggle('show', o);
      dr.setAttribute('aria-hidden', o ? 'false' : 'true');
      btn.setAttribute('aria-expanded', o ? 'true' : 'false');
      document.documentElement.classList.toggle('mnav-lock', o);
      if (o) setTimeout(function () { var c = dr.querySelector('.mnav-close'); if (c) c.focus(); }, 50);
    }

    btn.addEventListener('click', function () { setOpen(!dr.classList.contains('open')); });
    bd.addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dr.classList.contains('open')) { setOpen(false); btn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > BP && dr.classList.contains('open')) setOpen(false); });
    build();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
