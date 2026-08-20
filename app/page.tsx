import Link from "next/link";

export default function HomePage() {
  return (
    <section className="flex min-h-[70vh] items-center">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium tracking-[0.2em] text-gray-500">
            NEW COLLECTION
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Simple Style,
            <br />
            Better Everyday.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
            기본에 집중한 데일리 아이템을 만나보세요.
          </p>

          <div className="mt-8">
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
