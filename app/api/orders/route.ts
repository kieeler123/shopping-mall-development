const orders = [
  { id: 1, product: "무선 키보드", price: 59000 },
  { id: 2, product: "게이밍 마우스", price: 35000 },
  { id: 3, product: "USB-C 허브", price: 29000 },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    if (idParam !== null) {
      const id = Number(idParam);

      if (!Number.isInteger(id) || id <= 0) {
        return Response.json(
          {
            success: false,
            error: "올바른 주문 ID를 입력하세요.",
          },
          { status: 400 },
        );
      }

      const order = orders.find((item) => item.id === id);

      if (!order) {
        return Response.json(
          {
            success: false,
            error: "주문을 찾을 수 없습니다.",
          },
          { status: 404 },
        );
      }

      return Response.json(
        {
          success: true,
          order,
        },
        { status: 200 },
      );
    }

    return Response.json(
      {
        success: true,
        count: orders.length,
        orders,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("주문 조회 오류:", error);

    return Response.json(
      {
        success: false,
        error: "서버 내부 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
