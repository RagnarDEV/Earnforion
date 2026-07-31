// ==================== التطبيق الرئيسي ====================

const appContainer = document.getElementById('app');

// تطبيق الوضع الليلي
function applyTheme() {
  const theme = state.theme;
  document.body.className = theme;
  const icon = document.getElementById('themeToggle')?.querySelector('i');
  if (icon) {
    icon.className = theme === 'dark' ? 'ph-sun' : 'ph-moon';
  }
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  storage.set('theme', state.theme);
  applyTheme();
}

// التنقل بين الصفحات
function renderPage(path) {
  let pageContent = '';
  switch (path) {
    case '/home': pageContent = Pages.Home(); break;
    case '/discover': pageContent = Pages.Discover(); break;
    case '/compare': pageContent = Pages.Compare(); break;
    case '/dashboard': pageContent = Pages.Dashboard(); break;
    default: pageContent = Pages.Home(); path = '/home';
  }

  state.currentPath = path;
  appContainer.innerHTML = Components.Navbar(path) + '<main>' + pageContent + '</main>' + Components.Footer();
  applyTheme();
  attachEvents();
}

// ربط الأحداث
function attachEvents() {
  // زر القائمة للموبايل
  const mobileBtn = document.getElementById('mobileMenuBtn');
  if (mobileBtn) {
    mobileBtn.onclick = () => {
      const nav = document.getElementById('navLinks');
      if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    };
  }

  // تبديل الوضع الليلي
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.onclick = toggleTheme;
  }

  // أزرار البحث (للأمثلة)
  const homeSearchBtn = document.getElementById('homeSearchBtn');
  if (homeSearchBtn) {
    homeSearchBtn.onclick = () => {
      const input = document.getElementById('homeSearchInput');
      if (input && input.value.trim()) alert('Search for: ' + input.value);
    };
  }
  const discoverSearchBtn = document.getElementById('discoverSearchBtn');
  if (discoverSearchBtn) {
    discoverSearchBtn.onclick = () => {
      const input = document.getElementById('discoverSearchInput');
      if (input && input.value.trim()) alert('Filter by: ' + input.value);
    };
  }

  // إغلاق قائمة الموبايل عند اختيار رابط
  document.querySelectorAll('.nav-links a, .mobile-bottom-nav a').forEach(link => {
    link.addEventListener('click', () => {
      const nav = document.getElementById('navLinks');
      if (nav && window.innerWidth <= 768) nav.style.display = 'none';
    });
  });
}

// مراقبة تغيير الهاش
window.addEventListener('hashchange', () => {
  const path = window.location.hash.slice(1) || '/home';
  renderPage(path);
});

// التحميل الأولي
applyTheme();
const initialPath = window.location.hash.slice(1) || '/home';
renderPage(initialPath);
