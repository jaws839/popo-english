# 포포 잉글리시 — GitHub Pages 버전 (영국 원어민 발음)

Claude 아트팩트(미리보기)는 보안 제약으로 외부 발음 엔진을 못 씁니다.
이 폴더를 **GitHub Pages(무료 웹 호스팅)** 에 올리면 제약이 사라져서,
오픈소스 **Piper 신경망 TTS**(`@diffusionstudio/vits-web`)로 **영국 원어민(RP) 발음**이 나옵니다.

```
pages/
├─ index.html          ← 앱 + Piper 발음 엔진 (설치·설정 불필요)
├─ manifest.json       ← '홈 화면에 추가' 시 앱처럼
├─ icon-512.png / apple-touch-icon.png
└─ README.md
```

## 발음 엔진 (Kokoro-82M — 정통 영국 RP)
- 기본 음성: **bf_emma**(영국 여성 RP, 최고 등급) / 대안 **bm_george**(정통 영국 남성)
- Piper보다 훨씬 자연스러운 최신 오픈소스 신경망 TTS, 브라우저에서 100% 로컬 구동
- 첫 실행 때 모델(~80MB)을 자동으로 내려받아 저장 → **이후 오프라인 동작**
- 모델 준비 전 잠깐은 기기 시스템 음성으로 임시 재생(자동 전환)
- `index.html`의 `VOICE` 값을 `bm_george` 등으로 바꾸면 음성 교체 가능

## 올리는 법 (터미널 없이)
1. github.com 가입 → 새 저장소(public) 생성 (예: `popo`)
2. 이 `pages` 폴더의 파일들을 저장소 **루트**에 업로드
   (GitHub 웹에서 "Add file → Upload files"로 드래그)
3. 저장소 **Settings → Pages → Branch: main / (root) → Save**
4. 1~2분 뒤 `https://<아이디>.github.io/popo/` 주소가 열립니다
5. 세 아이 아이폰 사파리로 그 주소 접속 → **공유 → 홈 화면에 추가** → 앱처럼 사용

## 참고
- Piper는 브라우저에서 완전히 로컬로 동작(개인정보 전송 없음, 무료).
- 만약 특정 기기에서 모델 로딩이 느리면, 처음 한 번만 Wi-Fi에서 열어 캐시해 두세요.
- 콘텐츠 수정: `index.html`의 `UNITS` / `VIDEOS` 배열만 고치면 됩니다(웹앱과 동일).
