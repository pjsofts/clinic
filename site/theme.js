// Loads the selected theme stylesheet. Runs synchronously in <head> so the page never flashes the wrong theme.
window.CLINIC_THEMES = [
  { id: 'calm', name: 'آرامش', description: 'سبز مریمی و کرم؛ آرام، گرم و اطمینان‌بخش' },
  { id: 'night', name: 'شب آرام', description: 'تیره با رنگ‌های اسطوخودوسی؛ مدرن و کم‌نور برای چشم' },
  { id: 'turquoise', name: 'فیروزه', description: 'فیروزه‌ای و طلایی با نقش‌های هندسی ایرانی؛ اصیل و رسمی' },
  { id: 'sunny', name: 'آفتاب', description: 'هلویی و مرجانی با فرم‌های گرد؛ صمیمی و مناسب خانواده و کودک' },
  { id: 'minimal', name: 'مینیمال', description: 'سیاه و سفید با تایپوگرافی درشت؛ ساده، شیک و حرفه‌ای' },
  { id: 'rose', name: 'گل‌سرخ', description: 'صورتی خاکی، آلویی و سبز مریمی؛ لطیف و دلنشین' },
  { id: 'ocean', name: 'دریا', description: 'آبی عمیق و فیروزه‌ای روشن با موج؛ زلال و آرامش‌بخش' },
  { id: 'violet', name: 'بنفشه', description: 'گرادیان بنفش تا ارکیده؛ شاد، امروزی و پرانرژی' },
  { id: 'autumn', name: 'پاییز', description: 'آجری، زیتونی و خردلی؛ گرم، خاکی و صمیمی' },
  { id: 'medical', name: 'آبی پزشکی', description: 'آبی و سفید روشن؛ تمیز، آشنا و کاملاً حرفه‌ای' },
  { id: 'midnight', name: 'نیمه‌شب و نعناع', description: 'سرمه‌ای تیره با سبز نعناعی؛ لوکس، جسور و متمایز' },
  { id: 'moonlight', name: 'نور مهتاب', description: 'آبی نقره‌ای، سفید گرم و طلایی کم‌رنگ؛ بسیار آرام و شبیه اسپا' },
  { id: 'garden', name: 'باغ ایرانی', description: 'آجری ملایم، سبز مریمی، عاجی و فیروزه‌ای کدر؛ فرهنگی و گرم' },
  { id: 'sky', name: 'ابر و آسمان', description: 'آبی آسمانی، سفید ابری و یاسی کم‌رنگ؛ سبک و پرهوا' },
  { id: 'matcha', name: 'چای سبز', description: 'سبز ماچا، بژ گرم و طلایی کدر؛ آرامش ذن و مدرن' },
  { id: 'candle', name: 'شمع و سایه', description: 'زغالی گرم، کهربایی و کرم؛ حس صمیمی اتاق درمان در شب' },
  { id: 'kids', name: 'کودکانه نرم', description: 'هلویی، نعناعی و یاسی پاستلی؛ بازیگوش اما حرفه‌ای، برای کودک و نوجوان' },
];

// Persian font pairings. `body` is used for text, `heading` for titles. All are free/open-licensed.
(function () {
  var G = function (family) { return 'https://fonts.googleapis.com/css2?family=' + family + '&display=swap'; };
  var R = function (repo) { return 'https://cdn.jsdelivr.net/gh/rastikerdar/' + repo + '/dist/font-face.css'; };
  var VAZIR = G('Vazirmatn:wght@400;500;700;800');
  window.CLINIC_FONTS = [
    { id: 'vazirmatn', name: 'وزیرمتن', note: 'مدرن، خوانا و همه‌کاره', css: [VAZIR], body: 'Vazirmatn', heading: 'Vazirmatn', weight: 800 },
    { id: 'estedad', name: 'استعداد', note: 'هندسی و امروزی', css: ['fonts/estedad.css'], body: 'Estedad', heading: 'Estedad', weight: 800 },
    { id: 'sahel', name: 'ساحل', note: 'گرد و صمیمی', css: [R('sahel-font@v3.4.0')], body: 'Sahel', heading: 'Sahel', weight: 700 },
    { id: 'shabnam', name: 'شبنم', note: 'سبک و ظریف', css: [R('shabnam-font@v5.0.1')], body: 'Shabnam', heading: 'Shabnam', weight: 700 },
    { id: 'samim', name: 'صمیم', note: 'ساده و آرام', css: [R('samim-font@v4.0.5')], body: 'Samim', heading: 'Samim', weight: 700 },
    { id: 'gandom', name: 'گندم', note: 'نرم و دوستانه', css: [R('gandom-font@0.8')], body: 'Gandom', heading: 'Gandom', weight: 400 },
    { id: 'plex', name: 'پلکس', note: 'رسمی و حرفه‌ای', css: [G('IBM+Plex+Sans+Arabic:wght@400;500;700')], body: 'IBM Plex Sans Arabic', heading: 'IBM Plex Sans Arabic', weight: 700 },
    { id: 'notosans', name: 'نوتو سنس', note: 'تمیز و متعادل', css: [G('Noto+Sans+Arabic:wght@400;500;800')], body: 'Noto Sans Arabic', heading: 'Noto Sans Arabic', weight: 800 },
    { id: 'parastoo', name: 'پرستو', note: 'کتابی و ادبی', css: [R('parastoo-font@v2.0.1')], body: 'Parastoo', heading: 'Parastoo', weight: 700 },
    { id: 'naskh', name: 'نسخ', note: 'کلاسیک و رسمی', css: [G('Noto+Naskh+Arabic:wght@400;700')], body: 'Noto Naskh Arabic', heading: 'Noto Naskh Arabic', weight: 700 },
    { id: 'amiri', name: 'امیری + وزیرمتن', note: 'تیتر خوشنویسانه، متن مدرن', css: [VAZIR, G('Amiri:wght@700')], body: 'Vazirmatn', heading: 'Amiri', weight: 700 },
    { id: 'nastaliq', name: 'نستعلیق + وزیرمتن', note: 'تیتر نستعلیق، اصیل و هنری', css: [VAZIR, G('Noto+Nastaliq+Urdu:wght@700')], body: 'Vazirmatn', heading: 'Noto Nastaliq Urdu', weight: 700 },
    { id: 'lalezar', name: 'لاله‌زار + وزیرمتن', note: 'تیتر پررنگ و نمایشی', css: [VAZIR, G('Lalezar')], body: 'Vazirmatn', heading: 'Lalezar', weight: 400 },
    { id: 'tanha', name: 'تنها + صمیم', note: 'تیتر ظریف و کشیده، متن آرام', css: [R('samim-font@v4.0.5'), R('tanha-font@0.10')], body: 'Samim', heading: 'Tanha', weight: 400 },
  ];

  // Loads a font's stylesheets and returns its CSS custom properties.
  window.clinicFontCss = function (font, write) {
    font.css.forEach(function (href) {
      if (write) {
        document.write('<link rel="stylesheet" href="' + href + '">');
      } else if (!document.querySelector('link[href="' + href + '"]')) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.append(link);
      }
    });
    return '--font: "' + font.body + '", Tahoma, sans-serif; --font-heading: "' + font.heading + '", Tahoma, sans-serif; --heading-weight: ' + font.weight + ';';
  };
})();

(function () {
  var ids = window.CLINIC_THEMES.map(function (t) { return t.id; });
  var params = new URLSearchParams(location.search);
  var fromUrl = params.get('theme');
  var preview = ids.indexOf(fromUrl) !== -1;
  var theme = preview ? fromUrl : window.CLINIC_DEFAULT_THEME || 'calm';
  if (ids.indexOf(theme) === -1) theme = 'calm';

  document.documentElement.dataset.theme = theme;
  // Each theme layers its own stylesheet on top of the base styles.css.
  document.write('<link rel="stylesheet" href="themes/' + theme + '.css">');

  // Optional font override (?font=...). Without one, the theme's own fonts are used.
  var fontId = params.get('font') || window.CLINIC_DEFAULT_FONT || '';
  var font = window.CLINIC_FONTS.filter(function (f) { return f.id === fontId; })[0];
  if (font) {
    document.documentElement.dataset.font = font.id;
    // html[data-font] outranks the themes' :root rules.
    document.write('<style>html[data-font] {' + window.clinicFontCss(font, true) + '}</style>');
  }

  if (!preview) return;

  // On preview links, show which design and font this is, with a way to compare the others.
  document.addEventListener('DOMContentLoaded', function () {
    function makeSelect(label, options, current) {
      var select = document.createElement('select');
      select.setAttribute('aria-label', label);
      options.forEach(function (o) {
        var option = document.createElement('option');
        option.value = o.id;
        option.textContent = o.name;
        option.selected = o.id === current;
        select.append(option);
      });
      select.addEventListener('change', go);
      return select;
    }
    var themeSelect = makeSelect('انتخاب طرح', window.CLINIC_THEMES, theme);
    var fontSelect = makeSelect('انتخاب فونت', [{ id: '', name: 'فونت طرح' }].concat(window.CLINIC_FONTS), font ? font.id : '');

    function go() {
      var query = '?theme=' + themeSelect.value + (fontSelect.value ? '&font=' + fontSelect.value : '');
      location.search = query;
    }

    var bar = document.createElement('div');
    bar.className = 'theme-bar';
    // Keep each label next to its select when the bar wraps on small screens.
    function group(text, select) {
      var label = document.createElement('label');
      label.className = 'theme-bar-group';
      label.append(text, select);
      return label;
    }
    var all = document.createElement('a');
    all.href = 'themes.html';
    all.textContent = 'همه طرح‌ها';
    bar.append(group('طرح: ', themeSelect), group('فونت: ', fontSelect), all);
    document.body.append(bar);
  });
})();
