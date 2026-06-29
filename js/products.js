/* =============================================================================
 * Terroir & Proof — 제품 데이터 (단일 출처)
 * =============================================================================
 *
 * ⚠️ 중요: 이 파일이 제품 정보의 유일한 출처입니다.
 *    Collection 섹션과 Taste Notes 섹션 모두 이 배열로 자동 렌더링됩니다.
 *
 * 규칙:
 *  - 제품명/설명/향미노트는 반드시 "실제 인스타그램 자료"를 기준으로만 입력하세요.
 *  - 확인되지 않은 정보(원재료, 효능, 가격, 용량, 카페인, 출시일)는 추정하지 말고
 *    값을 "TODO: ..." 문자열로 그대로 두세요. 화면에는 "확인 필요"로 표시됩니다.
 *  - 카페인 정보는 실제로 확인된 경우에만 입력하세요.
 *  - 이미지가 실제로 있을 때만 image 경로를 넣고, 없으면 image: null 로 두세요.
 *    (null이면 CSS 기반 프리미엄 패키지 placeholder가 자동 표시됩니다.)
 *  - 건강 효과("수면 개선", "불안 완화", "숙취 해소", "간 건강" 등) 표현 금지.
 *
 * 사용법: 아래 name/subtitle/description/notes 값을
 *         실제 인스타그램 자료로 교체하기만 하면 됩니다.
 * ========================================================================== */

window.PRODUCTS = [
  {
    id: "product-01",
    // TODO: 실제 인스타그램 자료에서 제품명 확인 후 입력
    name: "TODO: 실제 제품명 입력",
    // TODO: 인스타그램 기반 한 줄 설명 (자사몰 톤으로 재작성)
    subtitle: "TODO: 한 줄 설명 입력",
    // TODO: 인스타그램 본문을 자사몰 톤으로 재작성한 상세 설명
    description: "TODO: 인스타그램 자료 기반 제품 설명 입력",
    accent: "amber", // 카드 색감 테마: "amber" | "copper" | "leaf" (자유 변경)
    notes: {
      aroma: "TODO: 확인된 정보 또는 확인 불가",
      body: "TODO: 확인된 정보 또는 확인 불가",
      finish: "TODO: 확인된 정보 또는 확인 불가",
      mood: "TODO: 확인된 정보 또는 확인 불가",
      caffeine: "TODO: 확인된 경우에만 입력",
      bestTime: "TODO: 확인된 정보 또는 확인 불가"
    },
    image: null, // 실제 패키지 사진이 있을 때만 "./assets/product-01.jpg" 형태로 입력
    status: "coming-soon" // "available" 이면 [자세히 보기], 그 외에는 [Coming Soon]
  },
  {
    id: "product-02",
    name: "TODO: 실제 제품명 입력",
    subtitle: "TODO: 한 줄 설명 입력",
    description: "TODO: 인스타그램 자료 기반 제품 설명 입력",
    accent: "copper",
    notes: {
      aroma: "TODO: 확인된 정보 또는 확인 불가",
      body: "TODO: 확인된 정보 또는 확인 불가",
      finish: "TODO: 확인된 정보 또는 확인 불가",
      mood: "TODO: 확인된 정보 또는 확인 불가",
      caffeine: "TODO: 확인된 경우에만 입력",
      bestTime: "TODO: 확인된 정보 또는 확인 불가"
    },
    image: null,
    status: "coming-soon"
  },
  {
    id: "product-03",
    name: "TODO: 실제 제품명 입력",
    subtitle: "TODO: 한 줄 설명 입력",
    description: "TODO: 인스타그램 자료 기반 제품 설명 입력",
    accent: "leaf",
    notes: {
      aroma: "TODO: 확인된 정보 또는 확인 불가",
      body: "TODO: 확인된 정보 또는 확인 불가",
      finish: "TODO: 확인된 정보 또는 확인 불가",
      mood: "TODO: 확인된 정보 또는 확인 불가",
      caffeine: "TODO: 확인된 경우에만 입력",
      bestTime: "TODO: 확인된 정보 또는 확인 불가"
    },
    image: null,
    status: "coming-soon"
  }
];
