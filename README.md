# Teaching Coach AI

An Android-first teaching-practice coach for trainee teachers and language educators. It lets you prepare a lesson, capture speech into a transcript, and review evidence against a chosen teaching framework.

## Included in this starter app
- Lesson setup with 150+ grammar lesson topics grouped by CEFR-style level (A1 to C2) and grammar for specific purposes, plus a custom topic option; learner level and PPP / TTT / ESA frameworks.
- AI Grammar Lesson Studio: generates lesson objectives, timed stages, teacher steps, examples, CCQs and answers, ICQs, anticipated problems, differentiation, assessment, and an answer key through the configured Groq backend.
- Live session screen with timer, speech-recognition status, transcript, and manual transcript entry.
- Local heuristic review for context/lead-in, meaning, form, pronunciation, concept-checking questions, practice, production, instructions, and pacing signals.
- Feedback dashboard with an evidence-based score, strengths, possible gaps, and next-step suggestions.
- Save reports on the device using local storage; no account or remote database.
- GitHub Actions workflow to build a debug Android APK.

## Important speech-recognition note
On Android the app uses a native speech-recognition plugin (it asks for microphone permission the first time). In a desktop browser it falls back to the browser speech API. Recognition support and whether it works offline depend on the Android speech service installed on the device. The rest of the app and its saved reports work locally. If recognition is unavailable, use **Add transcript manually** or paste a transcript after practising. The feedback engine is a transparent, rule-based first version; it is not a cloud LLM and cannot reliably determine whether every teaching explanation is correct. Treat scores as practice prompts, not formal certification.

## Build an APK from GitHub (phone-friendly)
1. Create a new GitHub repository.
2. Extract this ZIP on your phone.
3. Upload the **contents inside** the `TeachingCoachAI` folder to the repository root. Make sure `.github/workflows/build-apk.yml` is included (hidden folder: turn on "show hidden files" in your file manager, or create the file in GitHub via Add file → Create new file and paste its contents).
4. Open the repository on GitHub → **Actions**.
5. Choose **Build Teaching Coach AI Android APK** → **Run workflow** (or wait for the first push workflow).
6. Open the completed run and download the artifact named **Teaching-Coach-AI-offline-vosk-debug-apk**. Extract the artifact ZIP to get `app-debug.apk`.
7. Transfer/install the APK on your Android phone. Android may ask you to allow installs from that source.

## Build requirements
GitHub Actions installs Node 20 and Java 17, builds the web app, generates the Capacitor Android project, and creates a debug APK. This is a debug build for testing and direct sharing, not a Play Store-signed release.

## Project structure
- `src/` React interface and evaluation logic
- `public/` app assets
- `.github/workflows/build-apk.yml` Android build workflow
- `capacitor.config.json` Capacitor Android settings

## Privacy
Lesson transcripts and saved reports are stored in this app's local browser storage. Avoid entering sensitive information about real pupils. Android speech recognition may be processed by the speech service configured on your device; its privacy/offline behavior is controlled by that service.


## Where to enter your Groq key

For a phone app using a deployed backend, enter the key in **Render Dashboard → your backend service → Environment → `GROQ_API_KEY`**. The app itself only needs the backend URL in its Settings screen. The AI Grammar Lesson Studio calls `POST /api/generate-lesson`; redeploy the backend after updating `backend/server.js` so the new generator endpoint becomes available. `backend/.env.example` is only a template for local development; do not paste a real key into the repository. See `backend/KEY_SETUP.txt`.

## Quick deployment with Render

The repository includes `render.yaml` to define the backend service. To deploy it, create a new Blueprint in Render from your GitHub repository and follow the prompts. Render will ask you to set `GROQ_API_KEY` as a secret environment variable; paste a **newly generated key** there, not into this repository. After deployment, copy the backend service URL and check `/health`. Then paste that base URL into the app's Online review settings.

**Security:** A Groq key shared in chat or otherwise exposed should be revoked and replaced before use. Never place a key in frontend code, the APK, GitHub files, or the app settings screen.

## Hybrid review with Groq AI (optional)

The app continues to work offline with its local keyword-based review. To add a deeper transcript review, run/deploy the separate `backend/` service. **Never put your Groq key in the Android app, frontend code, GitHub repository, or this settings screen.** The backend reads `GROQ_API_KEY` from its private environment variables and calls Groq on behalf of the app.

### Recommended setup: personal test first

1. In your Groq console, create an API key. Do not paste it into ChatGPT or commit it to GitHub.
2. Deploy the contents of the `backend/` folder as a Node.js web service (for example, on a trusted host that supports environment variables). Set the service root directory to `backend` if the host asks for one.
3. In the hosting dashboard, add environment variable `GROQ_API_KEY` with your key. The default `GROQ_MODEL` is `openai/gpt-oss-120b`; you can override it in the hosting environment if needed. The server listens on the port provided by the host. Do not create a `.env` file in the repository.
4. Wait for deployment and open `https://YOUR-BACKEND-URL/health`. It should return JSON containing `"ok":true`.
5. Install/open the app, tap the settings icon in the top-right, the app is preconfigured with `https://teaching-coach-ai-backend.onrender.com`; if needed, you can change it in Settings, then save. Do **not** enter the Groq key in the app.
6. Complete a practice session with a transcript. The report should show a **Groq AI Coach Review** section in addition to the local checkpoints. If the online review fails, the app still shows the local review.

### Before publishing publicly

- Restrict `ALLOWED_ORIGINS` on the backend to the origins you actually use, if your hosting setup supports origin headers. Native apps may not send an Origin header, so CORS is not an authentication mechanism.
- Add real user authentication or per-user access controls, quotas, and abuse monitoring before exposing this backend publicly. The included rate limit is only a basic safeguard; anyone who knows the backend URL may otherwise attempt to use it and consume your Groq quota.
- Review the host's privacy, retention, and billing terms. When online review is enabled, the transcript, topic, framework, level, and duration are sent to your backend and then to Groq. Do not include identifiable or sensitive pupil information.
- Treat AI feedback as coaching suggestions, not a validated assessment. The model sees the transcript, not the whole classroom, and cannot reliably judge tone, body language, learner reactions, or pronunciation quality from plain text.

### Run backend locally (optional)

```bash
cd backend
cp .env.example .env
# Edit .env locally and set GROQ_API_KEY; never commit it.
npm install
npm start
```

Then set the app backend URL to `http://YOUR-COMPUTER-LAN-IP:8080` when testing from a phone on the same Wi-Fi. `localhost` on the phone means the phone itself, not your computer.

## Offline Vosk speech recognition (Android)

The Android GitHub Actions workflow now downloads and bundles the Vosk `vosk-model-small-en-us-0.15` English model into the APK at build time and compiles a native Vosk plugin. The model is copied to app-private storage on first use. Speech recognition runs locally on the device after installation; the app does not need an internet connection to use the bundled small model.

During a practice session, Android uses the native Vosk recognizer first. If the native plugin/model cannot start, the app attempts the existing Android speech-recognition service as a fallback. Browser builds retain their existing browser speech recognition behavior.

### Optional larger model

On Android, the session screen offers an optional download of `vosk-model-en-us-0.22` (roughly 1.8 GB, depending on the source archive). Use Wi-Fi and ensure at least 3 GB of free storage. The download is extracted into app-private storage, and the larger model is selected the next time recognition starts. If download or extraction fails, the bundled small model remains available. The large model is not included in the APK.

### Build the APK from GitHub using your phone

1. Upload the contents of this ZIP to your GitHub repository (the `.github` folder is required; `native` is optional).
2. Open the repository's **Actions** tab and choose **Build Teaching Coach AI Android APK**.
3. Tap **Run workflow** and wait for the workflow to finish.
4. Open the completed run and download the `Teaching-Coach-AI-offline-vosk-debug-apk` artifact. GitHub provides it as a ZIP containing the APK.

The first build downloads the small Vosk model, so it may take longer than a normal web-only build. This workflow creates a debug-signed APK for testing; a Play Store release should be built and signed separately with a protected release keystore.

**Notes:** Vosk's standard large English model is a substantial download and requires enough RAM/storage for your phone. Speech recognition is English (`en-US`) in this implementation. The coaching feedback remains a local transcript-based practice aid, not a validated assessment of teaching quality.

## Groq natural voice (optional, online)
The lesson plan has a **Read aloud** control. *Offline device voice* uses Android's built-in text-to-speech. *Groq natural voice* sends short parts of the lesson to your backend (`/api/speech`), which calls Groq's Orpheus voice model. Before first use, open the Groq console Playground, choose the model `canopylabs/orpheus-v1-english` and accept its terms once, otherwise Groq returns an error. Long lessons can hit Groq's per-minute limit; the app waits and retries automatically. Redeploy the Render backend after updating so `/api/speech` is available.


## Groq Whisper Large v3 transcription

The live session attempts to capture an audio recording alongside the existing on-device speech recognition. When you finish a session, the app sends that recording to the backend `/api/transcribe` endpoint, which uses Groq's `whisper-large-v3` model. If recording or transcription is unavailable, the app falls back to the live device transcript.

Configure `GROQ_API_KEY` in the backend host (for example, Render). Keep `GROQ_MODEL=openai/gpt-oss-120b` for lesson generation and coaching feedback; Whisper is configured independently. The transcription endpoint accepts multipart form data with an `audio` file field and an optional two-letter `language` field. Audio uploads are limited to 25 MB.


## Whisper Large v3 long-session handling

The app records audio into standalone segments of approximately three minutes and uploads them sequentially to the backend `/api/transcribe` endpoint. This keeps individual uploads comfortably below Groq's documented 25 MB file limit in typical conditions. The backend enforces a 24 MiB upload cap to leave a safety margin. Transcriptions are joined in recording order. If a segment upload or transcription fails, the app keeps the live device transcript as its fallback. Long sessions can take longer to transcribe because each segment is processed separately.

## Whisper recording notes
- Online speech-to-text is optional (the switch beside the microphone). When it is on, recording starts first and the on-device recognizer second, so Android shows only one microphone permission prompt at a time.
- If the Whisper text is much shorter than the live transcript (for example, silence), or recording began partway through the lesson, the app keeps the live transcript.
- Recording stops automatically if you leave the session screen without finishing.
- Redeploy the Render backend after updating so `/api/transcribe` is available.
