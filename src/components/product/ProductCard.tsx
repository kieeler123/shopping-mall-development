import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <li>
      <Link href={`/products/${product.id}`}>
        <h2>{product.name}</h2>

        <span>{product.salePrice.toLocaleString()}원</span>

        <p>{product.description}</p>

        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
        />
      </Link>
    </li>
  );
}
