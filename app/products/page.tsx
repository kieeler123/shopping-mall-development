import ProductCard from "@/components/product/ProductCard";
import { products } from "@/data/products";

export default function ProductsPage() {
  return (
    <main>
      <h1>상품 목록</h1>

      <ul>
        {products.length === 0 ? (
          <li className="empty">등록된 상품이 없습니다.</li>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </ul>
    </main>
  );
}
