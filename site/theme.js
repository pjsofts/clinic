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
];

(function () {
  var ids = window.CLINIC_THEMES.map(function (t) { return t.id; });
  var fromUrl = new URLSearchParams(location.search).get('theme');
  var preview = ids.indexOf(fromUrl) !== -1;
  var theme = preview ? fromUrl : window.CLINIC_DEFAULT_THEME || 'calm';
  if (ids.indexOf(theme) === -1) theme = 'calm';

  document.documentElement.dataset.theme = theme;
  // "calm" is the base stylesheet; other themes layer on top of it.
  if (theme !== 'calm') document.write('<link rel="stylesheet" href="themes/' + theme + '.css">');

  if (!preview) return;

  // On preview links, show which design this is and a way to compare the others.
  document.addEventListener('DOMContentLoaded', function () {
    var bar = document.createElement('div');
    bar.className = 'theme-bar';
    var label = document.createElement('span');
    label.textContent = 'طرح: ';
    var select = document.createElement('select');
    select.setAttribute('aria-label', 'انتخاب طرح');
    window.CLINIC_THEMES.forEach(function (t) {
      var option = document.createElement('option');
      option.value = t.id;
      option.textContent = t.name;
      option.selected = t.id === theme;
      select.append(option);
    });
    select.addEventListener('change', function () {
      location.search = '?theme=' + select.value;
    });
    var all = document.createElement('a');
    all.href = 'themes.html';
    all.textContent = 'همه طرح‌ها';
    bar.append(label, select, all);
    document.body.append(bar);
  });
})();
