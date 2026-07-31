// ==================== صفحات التطبيق ====================

const Pages = {
  Home: function() {
    return `
      <section class="page hero fade-in-up">
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
      <section class="container page fade-in-up">
        <h1 style="font-size:2.5rem; margin-bottom:1rem;">🔍 Discover Opportunities</h1>

        <!-- Filter Bar -->
        <div class="filter-bar">
          <select id="filterCategory">
            <option value="">All Categories</option>
            <option value="Writing">Writing</option>
            <option value="Design">Design</option>
            <option value="Development">Development</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Content">Content</option>
            <option value="Education">Education</option>
          </select>
          <select id="filterDifficulty">
            <option value="">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
          <input type="text" id="filterSearch" placeholder="Search by title...">
        </div>

        <div id="discoverResults" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:1.5rem;">
          ${mockData.discover.map(opp => Components.OpportunityCard(opp)).join('')}
        </div>
      </section>
    `;
  },

  Compare: function() {
    const list = state.compareList;
    let html = `
      <section class="container page fade-in-up">
        <h1 style="font-size:2rem;">📊 Compare Opportunities</h1>
        <p style="color:var(--text-secondary); margin:1rem 0;">
          Select up to 3 opportunities to compare side by side. You can add them from any page using the <i class="ph-scales"></i> icon.
        </p>
    `;

    if (list.length === 0) {
      html += `<div class="card" style="text-align:center; padding:3rem;">No items added to compare yet. Browse opportunities and click the compare icon.</div>`;
    } else {
      html += `
        <div style="overflow-x:auto;">
          <table class="compare-table">
            <thead>
              <tr>
                <th>Feature</th>
                ${list.map(opp => `<th>${opp.platform} <button class="remove-compare-btn" data-id="${opp.id}" style="margin-left:0.5rem;">Remove</button></th>`).join('')}
                ${list.length < 3 ? `<th style="color:var(--neutral-400);">+ Add more</th>` : ''}
              </tr>
            </thead>
            <tbody>
              <tr><td>Title</td>${list.map(opp => `<td>${opp.title}</td>`).join('')}${list.length < 3 ? '<td></td>' : ''}</tr>
              <tr><td>Category</td>${list.map(opp => `<td>${opp.category}</td>`).join('')}${list.length < 3 ? '<td></td>' : ''}</tr>
              <tr><td>Rating</td>${list.map(opp => `<td>⭐ ${opp.rating}</td>`).join('')}${list.length < 3 ? '<td></td>' : ''}</tr>
              <tr><td>Difficulty</td>${list.map(opp => `<td>${opp.difficulty}</td>`).join('')}${list.length < 3 ? '<td></td>' : ''}</tr>
              <tr><td>Earnings</td>${list.map(opp => `<td style="color:var(--green-600); font-weight:600;">${opp.earnings}</td>`).join('')}${list.length < 3 ? '<td></td>' : ''}</tr>
              <tr><td>Verification</td>${list.map(opp => `<td>${opp.verified ? '✅ Verified' : '❌ Unverified'}</td>`).join('')}${list.length < 3 ? '<td></td>' : ''}</tr>
            </tbody>
          </table>
        </div>
      `;
    }

    html += `</section>`;
    return html;
  },

  Dashboard: function() {
    const savedItems = mockData.all.filter(opp => state.savedItems.includes(opp.id));
    return `
      <section class="container page fade-in-up">
        <h1 style="font-size:2rem;">👤 Welcome back, User</h1>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.5rem; margin:2rem 0;">
          <div class="card"><strong>Saved</strong><br>${state.savedItems.length} opportunities</div>
          <div class="card"><strong>Viewed</strong><br>${Math.floor(Math.random()*50)} methods</div>
          <div class="card"><strong>Completed</strong><br>${Math.floor(Math.random()*5)} methods</div>
        </div>
        <h2>Your Saved Opportunities</h2>
        ${savedItems.length > 0 ? 
          `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:1.5rem; margin-top:1rem;">
            ${savedItems.map(opp => Components.OpportunityCard(opp, false)).join('')}
          </div>` :
          `<div class="card" style="text-align:center; padding:2rem;">No saved opportunities yet. Click the heart icon on any opportunity.</div>`
        }
        <h2 style="margin-top:2rem;">Your Earning Roadmap</h2>
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
