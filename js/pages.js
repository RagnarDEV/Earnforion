// ==================== صفحات التطبيق ====================

const Pages = {
  Home: function() {
    return `
      <section class="page hero">
        <span class="badge badge-blue" style="margin-bottom:1rem;">🚀 New: AI-Powered Recommendations</span>
        <h1>Discover Verified Ways To <span>Earn Online</span></h1>
        <p>Explore freelance opportunities, digital income methods, online businesses, and remote earning platforms — all verified by our community.</p>
        <div class="search-bar" style="max-width:600px; margin:0 auto 2rem;">
          <input type="text" placeholder="Search opportunities..." id="homeSearchInput">
          <button id="homeSearchBtn"><i class="ph-magnifying-glass"></i> Search</button>
        </div>
        <button class="btn btn-primary btn-lg">Get Started Free</button>
      </section>

      <section class="container" style="padding:2rem 0;">
        <h2 style="font-size:2rem; margin-bottom:1.5rem;">🔥 Trending This Week</h2>
        <div class="opportunity-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:1.5rem;">
          ${mockData.trending.map(opp => Components.OpportunityCard(opp)).join('')}
        </div>
      </section>

      <!-- أقسام إضافية -->
      <section class="container" style="padding:2rem 0;">
        <h2 style="font-size:2rem; margin-bottom:1.5rem;">📂 Popular Categories</h2>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:1rem;">
          ${['Writing', 'Design', 'Development', 'E-commerce', 'Marketing', 'Finance'].map(cat => `
            <div class="card" style="text-align:center;">
              <i class="ph-folder" style="font-size:2rem; color:var(--blue-500); margin-bottom:0.5rem;"></i>
              <p style="font-weight:600;">${cat}</p>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  },

  Discover: function() {
    return `
      <section class="container page">
        <h1 style="font-size:2.5rem; margin-bottom:1rem;">🔍 Discover Opportunities</h1>
        <div class="search-bar" style="margin-bottom:2rem;">
          <input type="text" placeholder="Filter by keyword..." id="discoverSearchInput">
          <button id="discoverSearchBtn"><i class="ph-funnel"></i> Filter</button>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:1.5rem;">
          ${mockData.discover.map(opp => Components.OpportunityCard(opp)).join('')}
        </div>
      </section>
    `;
  },

  Compare: function() {
    return `
      <section class="container page">
        <h1 style="font-size:2rem;">📊 Compare Opportunities</h1>
        <p style="color:var(--text-secondary); margin:1rem 0;">Select up to 3 opportunities to compare side by side.</p>
        <div style="display:flex; gap:1rem; flex-wrap:wrap; margin-top:2rem;">
          <div class="card" style="flex:1; min-width:200px; text-align:center;"><p>+ Add Opportunity</p></div>
          <div class="card" style="flex:1; min-width:200px; text-align:center;"><p>+ Add Opportunity</p></div>
          <div class="card" style="flex:1; min-width:200px; text-align:center;"><p>+ Add Opportunity</p></div>
        </div>
      </section>
    `;
  },

  Dashboard: function() {
    return `
      <section class="container page">
        <h1 style="font-size:2rem;">👤 Welcome back, User</h1>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.5rem; margin:2rem 0;">
          <div class="card"><strong>Saved</strong><br>12 opportunities</div>
          <div class="card"><strong>Viewed</strong><br>47 methods</div>
          <div class="card"><strong>Completed</strong><br>3 methods</div>
        </div>
        <h2>Your Earning Roadmap</h2>
        <div class="card" style="margin-top:1rem;">
          <ul style="list-style:none; padding:0;">
            <li>✅ Complete profile</li>
            <li>✅ Take skills assessment</li>
            <li>🔄 Start first opportunity</li>
            <li>🔒 Earn first $100</li>
          </ul>
        </div>
      </section>
    `;
  }
};
