import OpportunityCard from './OpportunityCard';

const dummyOpportunities = [
  {
    logo: 'https://via.placeholder.com/40',
    platform: 'Upwork',
    verified: true,
    title: 'Freelance Writing',
    description: 'Write articles, blogs, and copy for clients worldwide.',
    category: 'Writing',
    rating: 4.8,
    difficulty: 'Beginner',
    earnings: '$500 - $2,000/mo',
  },
  {
    logo: 'https://via.placeholder.com/40',
    platform: 'Fiverr',
    verified: true,
    title: 'Graphic Design',
    description: 'Create logos, social media graphics, and brand kits.',
    category: 'Design',
    rating: 4.9,
    difficulty: 'Intermediate',
    earnings: '$1,000 - $3,000/mo',
  },
];

export default function TrendingSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">🔥 Trending This Week</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dummyOpportunities.map((item, index) => (
          <OpportunityCard key={index} data={item} />
        ))}
      </div>
    </section>
  );
}
