export default function Footer() {
  return (
    <footer className="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between text-sm text-neutral-500">
        <span>© 2026 Earnforion. All rights reserved.</span>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-blue-600">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
