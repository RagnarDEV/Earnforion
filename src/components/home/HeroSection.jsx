import Button from '../ui/Button';
import SearchBar from '../ui/SearchBar';

export default function HeroSection() {
  return (
    <section className="pt-20 pb-24 text-center px-4">
      <span className="inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full mb-4">
        🚀 New: AI-Powered Recommendations
      </span>
      <h1 className="font-display text-5xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-50 max-w-3xl mx-auto leading-tight mb-4">
        Discover Verified Ways To <span className="text-blue-500">Earn Online</span>
      </h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto mb-8">
        Explore freelance opportunities, digital income methods, online businesses, and remote earning platforms — all verified by our community.
      </p>
      <SearchBar />
      <div className="mt-8">
        <Button variant="primary" className="px-8 py-4 text-lg">
          Get Started Free
        </Button>
      </div>
    </section>
  );
}
