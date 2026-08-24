import AddToCart from "@/components/product/AddToCart";
import { products } from "@/data/products";
import Image from "next/image";
import { notFound } from "next/navigation";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const productId = Number(id);

  const product = products.find((product) => product.id === productId);

  if (!product) {
    notFound();
  }

  const discountRate = Math.round(
    ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
  );

  return (
    <main>
      <Image src={product.image} alt={product.name} width={500} height={500} />

      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>정상가: {product.originalPrice.toLocaleString()}원</p>

      <p>판매가: {product.salePrice.toLocaleString()}원</p>

      <p>{discountRate}% 할인</p>
      <AddToCart productId={product.id} />
    </main>
  );
}
