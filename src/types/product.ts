/**
 * 쇼핑몰에서 사용하는 기본 상품 타입.
 *
 * v0.1에서는 상품 목록과 상품 상세 화면에 필요한
 * 최소한의 정보만 정의한다.
 *
 * 상품 옵션, 재고, 다중 이미지는 이후 버전에서
 * 요구사항이 생길 때 별도의 구조로 확장한다.
 */
export type Product = {
  /** 상품을 식별하기 위한 고유 ID */
  id: number;

  /** 사용자에게 표시되는 상품명 */
  name: string;

  /** 상품 상세 페이지에 표시할 상품 설명 */
  description: string;

  /** 할인 적용 전 정상 판매 가격 */
  originalPrice: number;

  /** 실제 사용자에게 판매되는 가격 */
  salePrice: number;

  /** 상품 대표 이미지의 URL 또는 경로 */
  image: string;
};
