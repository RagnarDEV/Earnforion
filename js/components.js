// ==================== مكونات الواجهة ====================

const Components = {
  // شريط التنقل العلوي
  Navbar: function(activePath) {
    const links = [
      { path: '/home', label: 'Home', icon: 'ph-house' },
      { path: '/discover', label: 'Discover', icon: 'ph-magnifying-glass' },
      { path: '/compare', label: 'Compare', icon: 'ph-scales' },
      { path: '/dashboard', label: 'Dashboard', icon: 'ph-user' }
    ];

    return `
      <nav class="navbar">
        <div class="container">
          <a href="#/home" class="logo">Earnforion</a>
          <div class="nav-links" id="navLinks">
            ${links.map(l => `
              <a href="#${l.path}" class="${activePath === l.path ? 'active' : ''}">
                <i class="${l.icon}"></i> ${l.label}
              </a>
            `).join('')}
            <button id="themeToggle" class="btn btn-ghost" style="padding:0.5rem;">
              <i class="ph-moon"></i>
            </button>
          </div>
          <button class="mobile-menu-btn" id="mobileMenuBtn">
            <i class="ph-list"></i>
          </button>
        </div>
      </nav>
      <div class="mobile-bottom-nav" id="mobileBottomNav">
        ${links.map(l => `
          <a href="#${l.path}" class="${activePath === l.path ? 'active' : ''}">
            <i class="${l.icon}" style="font-size:1.4rem;"></i>
            <span>${l.label}</span>
          </a>
        `).join('')}
      </div>
    `;
  },

  // بطاقة الفرصة
  OpportunityCard: function(opp) {
    return `
      <div class="card opp-card">
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
          <img src="${opp.logo}" alt="${opp.platform}" style="width:40px; height:40px; border-radius:8px; object-fit:contain; background:var(--neutral-200);">
          <div>
            <strong>${opp.platform}</strong>
            ${opp.verified ? `<div style="color:var(--green-600); font-size:0.75rem; display:flex; align-items:center; gap:0.25rem;"><i class="ph-check-circle-fill"></i> Verified</div>` : ''}
          </div>
        </div>
        <h3 style="font-size:1.25rem; margin-bottom:0.5rem;">${opp.title}</h3>
        <p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:1rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${opp.description}</p>
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
          <span class="badge badge-blue">${opp.category}</span>
          <span class="badge badge-green"><i class="ph-star-fill"></i> ${opp.rating}</span>
          <span class="badge badge-amber">${opp.difficulty}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:1rem; border-top:1px solid var(--border);">
          <span style="font-weight:600; color:var(--green-700);">${opp.earnings}</span>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn-ghost" style="padding:0.25rem;" title="Save"><i class="ph-heart"></i></button>
            <button class="btn-ghost" style="padding:0.25rem;" title="Add to compare"><i class="ph-scales"></i></button>
          </div>
        </div>
      </div>
    `;
  },

  // تذييل الموقع
  Footer: function() {
    return `
      <footer class="footer">
        <div class="container">
          <p>© 2026 Earnforion. All rights reserved.</p>
          <div style="margin-top:0.5rem;">
            <a href="#" style="margin-right:1rem;">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    `;
  }
};
