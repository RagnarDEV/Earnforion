// ==================== وظائف مساعدة ====================

const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch { return defaultValue; }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const state = {
  currentPath: '/home',
  theme: storage.get('theme', 'light'),
  compareList: storage.get('compareList', []),  // قائمة المقارنة
  savedItems: storage.get('savedItems', [])     // قائمة المحفوظات
};

// بيانات وهمية موسعة
const mockData = {
  all: [
    { id:1, logo:'https://via.placeholder.com/40/3B82F6/FFFFFF?text=U', platform:'Upwork', verified:true, title:'Freelance Writing', description:'Write articles, blogs, and copy for clients worldwide.', category:'Writing', rating:4.8, difficulty:'Beginner', earnings:'$500 - $2,000/mo' },
    { id:2, logo:'https://via.placeholder.com/40/22C55E/FFFFFF?text=F', platform:'Fiverr', verified:true, title:'Graphic Design', description:'Create logos, social media graphics, and brand kits.', category:'Design', rating:4.9, difficulty:'Intermediate', earnings:'$1,000 - $3,000/mo' },
    { id:3, logo:'https://via.placeholder.com/40/F59E0B/FFFFFF?text=P', platform:'PeoplePerHour', verified:false, title:'Web Development', description:'Build websites and web applications for businesses.', category:'Development', rating:4.7, difficulty:'Expert', earnings:'$2,000 - $5,000/mo' },
    { id:4, logo:'https://via.placeholder.com/40', platform:'Toptal', verified:true, title:'Software Development', description:'Work with top companies as a freelance developer.', category:'Development', rating:4.9, difficulty:'Expert', earnings:'$3,000 - $8,000/mo' },
    { id:5, logo:'https://via.placeholder.com/40', platform:'Etsy', verified:false, title:'Handmade Crafts', description:'Sell your handmade products and digital downloads.', category:'E-commerce', rating:4.6, difficulty:'Beginner', earnings:'$200 - $2,000/mo' },
    { id:6, logo:'https://via.placeholder.com/40', platform:'Shopify', verified:true, title:'Dropshipping Store', description:'Start an online store without inventory.', category:'E-commerce', rating:4.7, difficulty:'Intermediate', earnings:'$500 - $10,000/mo' },
    { id:7, logo:'https://via.placeholder.com/40', platform:'Patreon', verified:false, title:'Content Creation', description:'Earn recurring income from your fans.', category:'Content', rating:4.5, difficulty:'Intermediate', earnings:'$100 - $10,000/mo' },
    { id:8, logo:'https://via.placeholder.com/40', platform:'Udemy', verified:true, title:'Online Course Creation', description:'Create and sell video courses on any topic.', category:'Education', rating:4.8, difficulty:'Intermediate', earnings:'$500 - $5,000/mo' }
  ],
  get trending() { return this.all.slice(0,3); },
  get discover() { return this.all; }
};
