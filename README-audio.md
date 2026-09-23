# 성우급 영국 RP 발음 넣기 (한 번만)

앱 발음은 3단계로 동작합니다:
1. **성우급 mp3** — 미리 합성해 둔 최상급 영국 RP 음성 (있으면 최우선)
2. **Kokoro 신경망** — 브라우저에서 도는 무료 신경망 음성 (mp3 없을 때)
3. **시스템 음성** — 최후 폴백

지금은 2단계(Kokoro)로 동작합니다. 아래를 **한 번만** 하면 235개 문장이 **실제 성우급 영국 발음(mp3)** 으로 바뀌고, 이후엔 키·비용 없이 오프라인으로 재생됩니다.

## 준비물
- **ElevenLabs 무료 계정** 1개 → API 키 1개 (최고 품질, 235문장이 무료 한도에 들어감)
- Node (이미 설치됨), 그리고 이 `pages` 폴더

> 계정·키는 전적으로 본인 것입니다. 저(Claude)는 계정 생성·키 입력을 하지 않습니다.
> 키를 알려주시면 제가 생성 스크립트 실행까지 대신 해드릴 수 있습니다(원하실 때만).

## 실행 (터미널)
```powershell
cd "E:\_출력\포포잉글리시\pages"
$env:ELEVENLABS_API_KEY = "여기에_본인_API_키"
node generate-audio.mjs
git add -A
git commit -m "성우급 영국 RP 음성 추가"
git push
```
- 진행 상황이 문장별로 출력됩니다(중간에 멈춰도 다시 실행하면 이어받기).
- 끝나면 `audio/` 에 mp3들과 `audio/manifest.json` 이 생기고, push 몇 분 뒤 앱이 자동으로 성우 발음을 재생합니다.

## 음성 고르기 (귀족 RP)
`generate-audio.mjs` 실행 전에 음성 지정 가능:
```powershell
$env:ELEVENLABS_VOICE_ID = "onwK4e9ZLuTAKqWW03F9"   # Daniel — 영국 뉴스앵커 RP(기본, 가장 '귀족'적)
# George(영국 남): JBFqnCBsd6RMkjVDRZzb | Alice(영국 여): Xb7hH8MSUJpSbSDYk0k2 | Lily(영국 여): pFZP5JQG7iQjIQuC4Bku
```

## 무료 한도가 부족하면
- **Amazon Polly**(무료 100만자/월·12개월, 음성 Arthur/Amy) 또는 **Azure**(50만자/월 영구, Sonia/Ryan)로도
  동일하게 `audio/<slug>.mp3` + `audio/manifest.json` 만 만들면 그대로 동작합니다.
- 그 버전 스크립트가 필요하면 요청하세요 — 만들어 드립니다.

## 문장을 추가/수정했다면
`index.html`의 `UNITS`를 고친 뒤, `phrases.txt`를 다시 뽑고(스크립트가 새 문장만 추가 생성) 다시 실행하면 됩니다.
