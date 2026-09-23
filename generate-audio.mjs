#!/usr/bin/env node
/*
 포포 잉글리시 - 성우급 영국 RP 음성 미리 합성 (한 번만 실행)
 고정된 235개 문장을 최상급 음성으로 mp3로 만들어 audio/ 에 저장하고 manifest.json 생성.
 앱은 이 mp3를 재생하므로 실행 시 API 키·비용이 전혀 들지 않음(오프라인).

 [사용법]
   1) ElevenLabs 가입(무료) → 프로필에서 API 키 발급 (계정·키는 본인 것; 저장 안 함)
   2) 터미널에서:
        set ELEVENLABS_API_KEY=여기에_키           (PowerShell:  $env:ELEVENLABS_API_KEY="키")
        node generate-audio.mjs
   3) 끝나면  git add -A && git commit -m "성우 음성 추가" && git push
      → 몇 분 뒤 앱이 자동으로 성우 발음을 재생

 [음성 바꾸기]  환경변수 ELEVENLABS_VOICE_ID 로 지정 (기본: Daniel = 영국 뉴스앵커 RP)
   Daniel(RP남): onwK4e9ZLuTAKqWW03F9   George(영국남): JBFqnCBsd6RMkjVDRZzb
   Alice(영국여): Xb7hH8MSUJpSbSDYk0k2   Lily(영국여):  pFZP5JQG7iQjIQuC4Bku

 [다른 제공사]  Amazon Polly(무료 100만자/월, 음성 Arthur/Amy) 또는 Azure(50만자/월, Sonia/Ryan)로도
   동일하게 audio/<slug>.mp3 + manifest.json 만 만들면 그대로 동작. 필요하면 요청하세요.
*/
import fs from "node:fs";
import path from "node:path";

const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE = process.env.ELEVENLABS_VOICE_ID || "onwK4e9ZLuTAKqWW03F9"; // Daniel (British RP)
const MODEL = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
if (!KEY) { console.error("ELEVENLABS_API_KEY 환경변수를 먼저 설정하세요."); process.exit(1); }

const DIR = path.join(process.cwd(), "audio");
fs.mkdirSync(DIR, { recursive: true });

// 앱과 반드시 동일한 규칙 (index.html의 slug와 일치해야 함)
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

const phrases = fs.readFileSync(path.join(process.cwd(), "phrases.txt"), "utf8")
  .split(/\r?\n/).map(s => s.trim()).filter(Boolean);

const sleep = ms => new Promise(r => setTimeout(r, ms));
let done = 0, made = 0, failed = 0;

for (const text of phrases) {
  const file = path.join(DIR, slug(text) + ".mp3");
  done++;
  if (fs.existsSync(file) && fs.statSync(file).size > 0) continue; // 이어받기(재실행 안전)
  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}`, {
      method: "POST",
      headers: { "xi-api-key": KEY, "accept": "audio/mpeg", "content-type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: MODEL,
        voice_settings: { stability: 0.5, similarity_boost: 0.85, style: 0.15, use_speaker_boost: true }
      })
    });
    if (!res.ok) { failed++; console.error(`[${done}/${phrases.length}] 실패 ${res.status}: ${text} — ${await res.text()}`); await sleep(1500); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(file, buf);
    made++; console.log(`[${done}/${phrases.length}] ✓ ${text} (${buf.length}B)`);
    await sleep(400); // 레이트리밋 여유
  } catch (e) { failed++; console.error(`[${done}/${phrases.length}] 오류: ${text} — ${e.message}`); await sleep(1500); }
}

// manifest = 실제로 파일이 있는 slug 목록
const have = phrases.filter(t => { const f = path.join(DIR, slug(t) + ".mp3"); return fs.existsSync(f) && fs.statSync(f).size > 0; }).map(slug);
fs.writeFileSync(path.join(DIR, "manifest.json"), JSON.stringify(have), "utf8");
console.log(`\n완료: 새로 생성 ${made}, 실패 ${failed}, manifest ${have.length}/${phrases.length}개`);
if (failed) console.log("실패분은 다시 실행하면 이어서 생성됩니다.");
