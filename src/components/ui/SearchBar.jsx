export default function SearchBar() {
  return (
    <div className="max-w-2xl mx-auto relative">
      <input
        type="text"
        placeholder="Search opportunities..."
        className="w-full h-14 pl-6 pr-16 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-shadow"
      />
      <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-lg transition-colors">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  );
}
