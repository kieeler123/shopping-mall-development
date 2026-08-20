import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          SHOP
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/products">PRODUCTS</Link>
          <Link href="/categories/men">MEN</Link>
          <Link href="/categories/women">WOMEN</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/search">SEARCH</Link>
          <Link href="/cart">CART</Link>
        </div>
      </div>
    </header>
  );
}
