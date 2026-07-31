import { List, X } from 'phosphor-react';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="font-display font-bold text-2xl text-blue-600">
          Earnforion
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-neutral-600 hover:text-blue-600 dark:text-neutral-300">Discover</a>
          <a href="#" className="text-neutral-600 hover:text-blue-600 dark:text-neutral-300">Categories</a>
          <a href="#" className="text-neutral-600 hover:text-blue-600 dark:text-neutral-300">Compare</a>
          <button className="btn-primary text-sm px-4 py-2">Get Started</button>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <List size={24} />}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-4 py-4 space-y-4">
          <a href="#" className="block text-neutral-600 dark:text-neutral-300">Discover</a>
          <a href="#" className="block text-neutral-600 dark:text-neutral-300">Categories</a>
          <a href="#" className="block text-neutral-600 dark:text-neutral-300">Compare</a>
          <button className="btn-primary w-full text-sm">Get Started</button>
        </div>
      )}
    </nav>
  );
}
