// ==================== التطبيق الرئيسي ====================

const appContainer = document.getElementById('app');

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

function updateCompareList(id) {
  const opp = mockData.all.find(o => o.id == id);
  if (!opp) return;
  const index = state.compareList.findIndex(o => o.id == id);
  if (index >= 0) {
    state.compareList.splice(index, 1);
  } else {
    if (state.compareList.length >= 3) {
      alert('You can compare up to 3 opportunities only.');
      return;
    }
    state.compareList.push(opp);
  }
  storage.set('compareList', state.compareList);
  renderPage(state.currentPath); // إعادة رسم الصفحة الحالية لتحديث الأزرار
}

function toggleSaveItem(id) {
  const idNum = Number(id);
  const index = state.savedItems.indexOf(idNum);
  if (index >= 0) {
    state.savedItems.splice(index, 1);
  } else {
    state.savedItems.push(idNum);
  }
  storage.set('savedItems', state.savedItems);
  // تحديث الأيقونة فقط دون إعادة تحميل الصفحة
  const heartBtn = document.querySelector(`.save-btn[data-id="${idNum}"] i`);
  if (heartBtn) {
    heartBtn.className = state.savedItems.includes(idNum) ? 'ph-heart-fill' : 'ph-heart';
  }
}

// التنقل بين الصفحات مع تأثير حركة
function renderPage(path) {
  let pageContent = '';
  switch (path) {
    case '/home': pageContent = Pages.Home(); document.title = 'Earnforion - Home'; break;
    case '/discover': pageContent = Pages.Discover(); document.title = 'Discover Opportunities'; break;
    case '/compare': pageContent = Pages.Compare(); document.title = 'Compare Opportunities'; break;
    case '/dashboard': pageContent = Pages.Dashboard(); document.title = 'Dashboard'; break;
    default: pageContent = Pages.Home(); path = '/home';
  }

  state.currentPath = path;
  appContainer.innerHTML = Components.Navbar(path) + '<main>' + pageContent + '</main>' + Components.Footer();
  applyTheme();
  attachEvents();

  // إعادة تشغيل الأنيميشن للملاحظات
  document.querySelectorAll('.fade-in-up').forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight; // trigger reflow
    el.style.animation = 'fadeInUp 0.4s ease-out forwards';
  });
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
  if (themeBtn) themeBtn.onclick = toggleTheme;

  // أحداث بطاقات الفرص (المقارنة والحفظ)
  document.querySelectorAll('.compare-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      updateCompareList(btn.dataset.id);
    };
  });
  document.querySelectorAll('.save-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      toggleSaveItem(btn.dataset.id);
    };
  });

  // صفحة Discover: الفلاتر
  const filterCategory = document.getElementById('filterCategory');
  const filterDifficulty = document.getElementById('filterDifficulty');
  const filterSearch = document.getElementById('filterSearch');
  if (filterCategory && filterDifficulty && filterSearch) {
    const filterHandler = () => {
      const cat = filterCategory.value;
      const diff = filterDifficulty.value;
      const searchTerm = filterSearch.value.toLowerCase();
      const filtered = mockData.all.filter(opp => {
        return (!cat || opp.category === cat) &&
               (!diff || opp.difficulty === diff) &&
               (!searchTerm || opp.title.toLowerCase().includes(searchTerm));
      });
      const container = document.getElementById('discoverResults');
      if (container) {
        container.innerHTML = filtered.map(opp => Components.OpportunityCard(opp)).join('');
        // إعادة ربط الأحداث بعد التصفية
        document.querySelectorAll('.compare-btn').forEach(btn => {
          btn.onclick = (e) => { e.stopPropagation(); updateCompareList(btn.dataset.id); };
        });
        document.querySelectorAll('.save-btn').forEach(btn => {
          btn.onclick = (e) => { e.stopPropagation(); toggleSaveItem(btn.dataset.id); };
        });
      }
    };
    filterCategory.onchange = filterHandler;
    filterDifficulty.onchange = filterHandler;
    filterSearch.oninput = filterHandler;
  }

  // صفحة Compare: إزالة عنصر من المقارنة
  document.querySelectorAll('.remove-compare-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      updateCompareList(btn.dataset.id);
    };
  });

  // أزرار البحث العامة
  const homeSearchBtn = document.getElementById('homeSearchBtn');
  if (homeSearchBtn) {
    homeSearchBtn.onclick = () => {
      const input = document.getElementById('homeSearchInput');
      if (input && input.value.trim()) window.location.hash = '#/discover';
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
