import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-bold">SHOP</p>
            <p className="mt-2 text-sm text-gray-500">
              Simple shopping mall development project.
            </p>
          </div>

          <nav className="flex gap-4 text-sm">
            <Link href="/about">ABOUT</Link>
            <Link href="/terms">TERMS</Link>
            <Link href="/privacy">PRIVACY</Link>
          </nav>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          © 2026 SHOP. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
