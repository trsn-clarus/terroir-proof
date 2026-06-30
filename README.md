# Terroir & Proof · 떼루아앤프루프

> A Nightly Ritual, Without the Alcohol.
> 위스키의 무드와 티의 웰니스를 담은 프리미엄 블렌딩 티 — 자사몰 랜딩 페이지.

순수 **HTML / CSS / JavaScript** 정적 사이트입니다. 빌드 과정이 없으며 GitHub Pages에 바로 배포할 수 있습니다.

**디자인 톤:** 밝고 깔끔한 웜 아이보리(밝은) 테마 + 실제 차(茶) 사진 기반.
(이전의 어두운 "딥 나이트" 테마 및 CSS 일러스트 비주얼을 실사 이미지로 대체했습니다.)

## 파일 구조

```
.
├── index.html        # 전체 랜딩 페이지 마크업
├── css/styles.css    # 디자인 시스템 · 레이아웃 · 애니메이션
├── js/products.js    # ⭐ 제품 3종 데이터 (유일한 제품 정보 출처)
├── js/main.js        # 렌더링 · 네비 · reveal · tilt
├── .nojekyll         # GitHub Pages 정적 처리(폴더 그대로 서빙)
└── README.md
```

## 로컬 실행

빌드 불필요. 둘 중 하나로 실행하세요.

```bash
# 1) 그냥 index.html 더블클릭 — 바로 열립니다.

# 2) 로컬 서버 (권장)
python -m http.server 5173
#   → http://localhost:5173
```

## ⭐ 제품 정보 입력 (가장 중요)

제품명·설명·향미노트는 **추정 금지**, 실제 인스타그램 자료로만 채웁니다.
모든 제품 정보는 [js/products.js](js/products.js) **한 파일**에만 있습니다. 여기만 수정하면
Collection / Taste Notes 섹션이 자동으로 갱신됩니다.

각 제품 객체에서 `TODO:` 로 시작하는 값을 실제 값으로 교체하세요.

- `name`, `subtitle`, `description` → 인스타그램 자료 기반(자사몰 톤으로 재작성)
- `notes.aroma / body / finish / mood / caffeine / bestTime` → 확인된 것만 입력, 나머지는 `TODO:` 유지
- `notes.caffeine` → **실제로 확인된 경우에만** 입력 (확인되면 카드에 칩으로 표시)
- `image` → 현재 `./assets/product-01.jpg` 처럼 **로컬 임시 차 사진**(무료 라이선스)이 연결돼 있습니다. 실제 패키지 사진이 생기면 `assets/` 의 같은 파일을 덮어쓰면 됩니다. `null` 로 두면 CSS placeholder가 표시되며, 사진 로딩 실패 시에도 자동으로 placeholder로 폴백됩니다.
- `status` → 판매 가능하면 `"available"`(자세히 보기), 아니면 `"coming-soon"`(Coming Soon)

> `TODO:` 값은 화면에서 **흐린 글씨 + "· 확인 필요"** 로 표시되어, 미입력 항목이 한눈에 보입니다.

## GitHub Pages 배포

1. 새 저장소를 만들고 이 폴더 내용을 푸시합니다.
   ```bash
   git init && git add . && git commit -m "Terroir & Proof landing"
   git branch -M main
   git remote add origin https://github.com/<USER>/<REPO>.git
   git push -u origin main
   ```
2. GitHub 저장소 → **Settings → Pages** → Source: `Deploy from a branch`,
   Branch: `main` / `/ (root)` 선택 후 저장.
3. 잠시 후 `https://<USER>.github.io/<REPO>/` 에서 확인.

경로 처리: 모든 리소스가 `./css/...`, `./js/...` 상대 경로라 프로젝트 페이지(`/<REPO>/`)
하위 경로에서도 그대로 동작합니다. 별도 base 설정이 필요 없습니다.
사용자/조직 페이지(`<USER>.github.io` 루트)에 올려도 동일하게 동작합니다.

## 이미지(사진) 안내 — 교체 방법

페이지의 모든 사진은 **실제 차(茶) 사진**(무료 라이선스, 출처 표기 의무 없음)이며 `assets/` 폴더에
내려받아 포함돼 있습니다. 외부 연결 없이 동작하는 **자급자족(self-contained)** 구조라 GitHub Pages에
올리면 그대로 보입니다. (사진이 없거나 로딩 실패 시 우아한 placeholder로 자동 폴백)

> ⚠️ 현재 사진은 분위기 전달용 **임시 스톡 사진**입니다. 가능하면 **자체 촬영본이나 실제 제품/AI 생성
> 이미지**로 교체하세요. 교체는 `assets/` 의 해당 파일을 **같은 이름으로 덮어쓰기만** 하면 끝입니다.

| 위치 | 파일 | 권장 비율 |
| --- | --- | --- |
| 히어로(메인 상단) | `assets/hero.jpg` | 세로 4:5 |
| 브랜드 스토리 | `assets/brand.jpg` | 가로 4:3 |
| 리추얼(실제 티백) | `assets/ritual.jpg` | 가로 |
| 웰니스(사람) | `assets/wellness.jpg` | 가로 |
| 제품 1·2·3 | `assets/product-01.jpg` ~ `product-03.jpg` | 4:3 |
| OG 대표 이미지 | `assets/og-cover.jpg` | 1200×630 |

> 파일명을 바꾸려면 히어로·브랜드·리추얼·웰니스는 `index.html` 의 `<img src>`,
> 제품 3종은 `js/products.js` 의 `image` 값을 함께 수정하세요.

## 추가로 필요한 실제 자산

- [ ] 브랜드 로고 (현재 텍스트 로고로 대체)
- [ ] 제품 패키지 이미지 3종 (현재 임시 차 사진 → 실제 패키지 사진으로 교체)
- [ ] 섹션 사진 4종(히어로·브랜드·리추얼·웰니스) (현재 임시 차 사진 → 자체 촬영/AI 이미지 권장)
- [ ] 제품명 / 상세 설명 / 향미 노트 (현재 TODO)
- [ ] 카페인 정보 (확인된 경우에만)
- [ ] OG 대표 이미지 (현재 임시 `assets/og-cover.jpg` → 자체 대표 이미지로 교체, 배포 도메인 확정 시 절대 URL 권장)
- [ ] 실제 문의 이메일 (footer `mailto:` 교체)
- [ ] 실제 인스타그램 링크 (footer)
- [ ] 브랜드 컬러 확정 (css `:root` 토큰)

## 표현 가이드 (준수됨)

의학적 효능·치료 효과·건강 보장 문구를 사용하지 않습니다. 무알코올 대체 음용 경험,
밤 루틴, 향 중심 경험 위주로만 작성되어 있습니다.
