// ==================== وظائف مساعدة ====================

// التخزين المحلي
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

// الحالة العامة
const state = {
  currentPath: '/home',
  theme: storage.get('theme', 'light')
};

// بيانات وهمية للفرص
const mockData = {
  trending: [
    {
      logo: 'https://via.placeholder.com/40/3B82F6/FFFFFF?text=U',
      platform: 'Upwork',
      verified: true,
      title: 'Freelance Writing',
      description: 'Write articles, blogs, and copy for clients worldwide.',
      category: 'Writing',
      rating: 4.8,
      difficulty: 'Beginner',
      earnings: '$500 - $2,000/mo'
    },
    {
      logo: 'https://via.placeholder.com/40/22C55E/FFFFFF?text=F',
      platform: 'Fiverr',
      verified: true,
      title: 'Graphic Design',
      description: 'Create logos, social media graphics, and brand kits.',
      category: 'Design',
      rating: 4.9,
      difficulty: 'Intermediate',
      earnings: '$1,000 - $3,000/mo'
    },
    {
      logo: 'https://via.placeholder.com/40/F59E0B/FFFFFF?text=P',
      platform: 'PeoplePerHour',
      verified: false,
      title: 'Web Development',
      description: 'Build websites and web applications for businesses.',
      category: 'Development',
      rating: 4.7,
      difficulty: 'Expert',
      earnings: '$2,000 - $5,000/mo'
    }
  ],
  discover: [
    {
      logo: 'https://via.placeholder.com/40',
      platform: 'Toptal',
      verified: true,
      title: 'Software Development',
      description: 'Work with top companies as a freelance developer.',
      category: 'Development',
      rating: 4.9,
      difficulty: 'Expert',
      earnings: '$3,000 - $8,000/mo'
    },
    {
      logo: 'https://via.placeholder.com/40',
      platform: 'Etsy',
      verified: false,
      title: 'Handmade Crafts',
      description: 'Sell your handmade products and digital downloads.',
      category: 'E-commerce',
      rating: 4.6,
      difficulty: 'Beginner',
      earnings: '$200 - $2,000/mo'
    }
  ]
};
