import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowLeft, BookOpen, Check, ChevronDown, ClipboardCheck, Clock3, FileText, GraduationCap, HelpCircle, History, Home, Mic, MicOff, Pause, Play, Plus, RotateCcw, Settings2, Sparkles, Square, Target, Trash2, TrendingUp, Volume2, X, Zap, ClipboardList, Lightbulb, Sun, Moon
} from 'lucide-react';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { SpeechRecognition as NativeSR } from '@capacitor-community/speech-recognition';
const VoskSpeech = registerPlugin('VoskSpeech');
import './style.css';

const FRAMEWORKS = {
  PPP: {
    name: 'Presentation · Practice · Production',
    stages: [
      { title: 'Lead-in & context', hint: 'Set a meaningful situation and activate prior knowledge.', keys: ['today', 'yesterday', 'imagine', 'story', 'picture', 'experience', 'context', 'remember'] },
      { title: 'Meaning & use', hint: 'Explain what the target language means and when it is used.', keys: ['means', 'used to', 'use it', 'meaning', 'because', 'finished time', 'experience', 'function'] },
      { title: 'Form analysis', hint: 'Model the structure, positive/negative forms and questions.', keys: ['subject', 'verb', 'structure', 'form', 'have', 'has', 'past participle', 'negative', 'question', 'auxiliary'] },
      { title: 'Pronunciation', hint: 'Model stress, connected speech, contractions or difficult sounds.', keys: ['pronounce', 'pronunciation', 'stress', 'sound', 'listen', 'repeat', 'contraction', 'intonation'] },
      { title: 'Guided practice', hint: 'Give learners controlled practice and clear instructions.', keys: ['complete', 'choose', 'fill in', 'work in pairs', 'practice', 'exercise', 'instructions', 'example'] },
      { title: 'Production', hint: 'Let learners use the target language more freely.', keys: ['your own', 'discuss', 'tell me', 'write about', 'make a sentence', 'role-play', 'create', 'talk about'] },
      { title: 'Concept checking', hint: 'Ask focused questions that test meaning, not just confidence.', keys: ['is it', 'do we', 'when', 'which', 'ccq', 'can you', 'does it mean', 'specific time', 'understand?'] }
    ]
  },
  TTT: {
    name: 'Test · Teach · Test',
    stages: [
      { title: 'Diagnostic first test', hint: 'Find out what learners can already do.', keys: ['try', 'before we learn', 'first task', 'what do you know', 'answer', 'diagnostic'] },
      { title: 'Identify learning gaps', hint: 'Use learner responses to pinpoint what needs teaching.', keys: ['mistake', 'notice', 'problem', 'gap', 'you said', 'many of you', 'difficult'] },
      { title: 'Targeted teaching', hint: 'Explain only the language or skill learners need.', keys: ['means', 'used to', 'subject', 'verb', 'rule', 'example', 'form', 'because'] },
      { title: 'Check understanding', hint: 'Check meaning and clarify confusing points.', keys: ['is it', 'do we', 'when', 'which', 'does it mean', 'why', 'check'] },
      { title: 'Second test', hint: 'Give a fresh task to see what improved.', keys: ['again', 'now try', 'second task', 'another example', 'test', 'without help'] },
      { title: 'Feedback & next step', hint: 'Respond to evidence and set a useful next step.', keys: ['feedback', 'improved', 'next time', 'well done', 'review', 'because'] }
    ]
  },
  ESA: {
    name: 'Engage · Study · Activate',
    stages: [
      { title: 'Engage', hint: 'Spark interest with a relevant question, story, image or situation.', keys: ['what do you think', 'imagine', 'story', 'picture', 'interesting', 'tell me about', 'experience'] },
      { title: 'Study meaning', hint: 'Focus learners on meaning, form or pronunciation.', keys: ['means', 'meaning', 'rule', 'subject', 'verb', 'pronunciation', 'form', 'example'] },
      { title: 'Clarify & check', hint: 'Clarify the language and check concepts with targeted questions.', keys: ['is it', 'do we', 'when', 'which', 'does it mean', 'why', 'ccq'] },
      { title: 'Controlled practice', hint: 'Give focused practice with appropriate support.', keys: ['complete', 'choose', 'fill in', 'repeat', 'practice', 'exercise', 'pairs'] },
      { title: 'Activate', hint: 'Set up a communicative task where learners use the language freely.', keys: ['discuss', 'your own', 'role-play', 'tell your partner', 'create', 'talk about', 'write about'] },
      { title: 'Feedback', hint: 'Review examples, praise effective use and address errors.', keys: ['feedback', 'good example', 'mistake', 'next time', 'review', 'what did you notice'] }
    ]
  }
};

const TOPIC_GROUPS = [
  { label: 'Beginner foundations (A1)', topics: [
    'Be: am / is / are', 'Subject pronouns and possessive adjectives', 'Articles: a / an / the',
    'Singular and plural nouns', 'This / that / these / those', 'There is / there are',
    'Have got / has got', 'Possessive ’s and whose', 'Imperatives and classroom instructions',
    'Can / can’t for ability and permission', 'Present simple: affirmative, negative and questions',
    'Adverbs of frequency', 'Present continuous: actions happening now', 'Present simple vs present continuous',
    'Countable and uncountable nouns', 'Some / any / no', 'Much / many / a lot of',
    'How much / how many', 'Basic prepositions of place', 'Prepositions of time: in / on / at',
    'Object pronouns', 'Like / love / hate + -ing', 'Would like', 'Basic question words',
    'And / but / because / so'
  ]},
  { label: 'Elementary grammar (A2)', topics: [
    'Past simple: regular and irregular verbs', 'Past simple: negatives and questions',
    'Past continuous', 'Past simple vs past continuous', 'Used to: past habits and states',
    'Future with going to', 'Will / won’t for predictions and decisions', 'Present continuous for future arrangements',
    'Future forms: will vs going to vs present continuous', 'Comparatives', 'Superlatives',
    'As … as / not as … as', 'Too / enough', 'Should / shouldn’t for advice',
    'Must / mustn’t and have to / don’t have to', 'May / might for possibility',
    'Adverbs of manner', 'Adjective order', 'Infinitive of purpose', 'Gerunds after common verbs',
    'Verb patterns: verb + -ing or to-infinitive', 'Zero conditional', 'First conditional',
    'When / before / after / as soon as for future time', 'Relative clauses: who / which / that',
    'Defining relative clauses', 'Indefinite pronouns: someone / anything / nowhere',
    'Quantifiers: a few / few / a little / little', 'Too much / too many / enough',
    'Prepositions of movement', 'Common adjective + preposition combinations',
    'Question forms and word order', 'Indirect questions: Could you tell me …?',
    'So / neither / too / either', 'Conjunctions: although / however / while'
  ]},
  { label: 'Intermediate grammar (B1)', topics: [
    'Present perfect: life experiences', 'Present perfect: unfinished time and recent events',
    'Present perfect vs past simple', 'Present perfect continuous',
    'Present perfect simple vs continuous', 'Past perfect', 'Past perfect vs past simple',
    'Narrative tenses', 'Second conditional', 'First vs second conditional',
    'Third conditional', 'Mixed conditionals', 'Unless / provided that / as long as',
    'Passive voice: present and past', 'Passive voice: all common tenses',
    'Active vs passive voice', 'Reported speech: statements', 'Reported speech: questions and commands',
    'Reported speech: tense and pronoun changes', 'Say vs tell', 'Modals of obligation and prohibition',
    'Modals of deduction: must / might / can’t', 'Could have / should have / must have',
    'Ability: can / could / be able to', 'Permission and requests',
    'Defining vs non-defining relative clauses', 'Relative pronouns and prepositions',
    'Gerunds and infinitives: meaning changes', 'Verb patterns after remember / stop / try',
    'Articles: a / an / the / zero article', 'Determiners: each / every / all / both / either / neither',
    'Reflexive pronouns and each other', 'Question tags', 'Negative questions',
    'Indirect speech and reporting verbs', 'Linkers for contrast, reason and result',
    'So / such / too / enough', 'Wish + past simple', 'Would for past habits',
    'Phrasal verbs: separable and inseparable', 'Prepositions after verbs and adjectives',
    'Relative clauses with whose / where / when'
  ]},
  { label: 'Upper-intermediate grammar (B2)', topics: [
    'Future continuous', 'Future perfect', 'Future perfect continuous', 'Future in the past',
    'Advanced passive structures', 'Have / get something done (causative)',
    'Passive reporting structures: is said to / is believed to',
    'Reported speech with reporting verbs', 'Advanced modal verbs of speculation',
    'Past modals: might have / should have / needn’t have',
    'Third conditional and alternatives', 'Mixed conditionals in context',
    'Inversion in conditionals: Had I known …', 'Wish / if only for regrets',
    'Would rather / had better / it’s time', 'Participle clauses',
    'Reduced relative clauses', 'Cleft sentences: what I need is …',
    'Emphasis with do / does / did', 'Inversion after negative adverbials',
    'Ellipsis and substitution: so do I / neither have I', 'Complex noun phrases',
    'Nominalisation', 'Advanced articles and generic reference',
    'Countable and uncountable meaning changes', 'Advanced quantifiers and determiners',
    'Concession: despite / in spite of / although', 'Purpose: so that / in order to / so as to',
    'Advanced linking devices for academic writing', 'Substitution and reference in discourse',
    'Preposition + relative pronoun clauses', 'Complex gerund and infinitive patterns',
    'Verb complementation and meaning', 'Advanced phrasal and prepositional verbs'
  ]},
  { label: 'Advanced grammar (C1–C2)', topics: [
    'Subjunctive: It is essential that …', 'Mandative subjunctive and should',
    'Advanced inversion and fronting', 'Negative and restrictive inversion',
    'Advanced cleft and pseudo-cleft sentences', 'Discourse markers and stance adverbials',
    'Hedging and cautious language', 'Formal vs informal grammar choices',
    'Advanced ellipsis and substitution', 'Advanced participle clauses and absolute constructions',
    'Complex conditional patterns', 'Implied conditionals', 'Advanced tense and aspect choices',
    'Future perfect vs future continuous nuances', 'Modal perfects and degrees of certainty',
    'Advanced passive and impersonal reporting', 'Complex noun phrases and post-modification',
    'Nominalisation in academic English', 'Information structure: given and new information',
    'Cohesion: reference, substitution and ellipsis', 'Advanced relative clauses and non-finite relatives',
    'Advanced determiners and quantification', 'Genitive forms and complex possession',
    'Prepositions in formal and academic English', 'Pragmatic uses of tense and modality',
    'Register, politeness and indirectness', 'Grammar for academic argumentation',
    'Punctuation and sentence boundaries', 'Run-on sentences and comma splices',
    'Parallel structure and coordination', 'Complex coordination and subordination'
  ]},
  { label: 'Grammar for specific purposes', topics: [
    'Grammar for storytelling and narratives', 'Grammar for describing trends and data',
    'Grammar for giving advice', 'Grammar for making requests and offers',
    'Grammar for opinions and agreeing / disagreeing', 'Grammar for rules and regulations',
    'Grammar for plans, intentions and arrangements', 'Grammar for predictions and probability',
    'Grammar for comparisons and evaluations', 'Grammar for academic essays',
    'Grammar for emails and formal letters', 'Grammar for spoken fluency',
    'Grammar for job interviews', 'Grammar for travel situations',
    'Grammar for exam preparation (B1 Preliminary)', 'Grammar for exam preparation (B2 First)',
    'Grammar for exam preparation (C1 Advanced)', 'Custom grammar lesson'
  ]}
];
const TOPICS = TOPIC_GROUPS.flatMap(group => group.topics);

// Keep the Grammar focus list aligned with the selected learner level.
const LEVEL_GROUPS = {
  Beginner: ['Beginner foundations (A1)'],
  Elementary: ['Elementary grammar (A2)'],
  Intermediate: ['Intermediate grammar (B1)'],
  Advanced: ['Upper-intermediate grammar (B2)', 'Advanced grammar (C1–C2)']
};
const getTopicGroupsForLevel = learnerLevel => TOPIC_GROUPS
  .filter(group => LEVEL_GROUPS[learnerLevel]?.includes(group.label) || group.label === 'Grammar for specific purposes')
  .map(group => group.label === 'Grammar for specific purposes'
    ? { ...group, topics: group.topics.filter(t => t === 'Custom grammar lesson') }
    : group);


const words = s => (s.trim().match(/\b[\w’'-]+\b/g) || []);
const readReports = () => { try { return JSON.parse(localStorage.getItem('tcai-reports') || '[]'); } catch { return []; } };

function evaluateLesson({ transcript, framework, topic, duration }) {
  const text = transcript.toLowerCase();
  const stages = FRAMEWORKS[framework].stages;
  const checks = stages.map((s, i) => {
    const hits = s.keys.filter(k => text.includes(k));
    const present = hits.length > 0;
    return { ...s, present, hits: hits.slice(0, 4), index: i };
  });
  const ccq = /\b(is it|do we|does it|when|which|why|can you|what happens|specific time|finished time)\b/i.test(text)
    && !/\b(do you understand|is that clear)\b/i.test(text);
  const weakCCQ = /\b(do you understand|is that clear|understand\?)\b/i.test(text);
  const instruction = /\b(please|work in pairs|in groups|first|then|you have \d+|complete|choose|write|discuss)\b/i.test(text);
  const examples = /\b(for example|such as|e\.g\.|example|for instance)\b/i.test(text);
  const correction = /\b(not|incorrect|instead|rather than|however|but)\b/i.test(text);
  const wc = words(transcript).length;
  const mins = Math.max(1, duration / 60);
  const wpm = duration > 20 ? Math.round(wc / mins) : null;
  const presentCount = checks.filter(s => s.present).length;
  const stageScore = Math.round(presentCount / Math.max(1, checks.length) * 60);
  const extraScore = (ccq ? 12 : weakCCQ ? 4 : 0) + (instruction ? 8 : 0) + (examples ? 8 : 0) + (correction ? 6 : 0) + (wc > 80 ? 6 : 2);
  const score = Math.min(100, Math.max(15, stageScore + extraScore));
  const strengths = [];
  if (examples) strengths.push('You appear to use examples to make the target language more concrete.');
  if (ccq) strengths.push('Your transcript contains focused question patterns that may check meaning.');
  if (instruction) strengths.push('There is evidence of task instructions or guided learner activity.');
  if (presentCount >= Math.ceil(checks.length * .65)) strengths.push('Several framework checkpoints appear in the transcript.');
  if (wc > 120) strengths.push('There is enough transcript evidence to review several aspects of the lesson.');
  if (!strengths.length) strengths.push('You captured a starting point for reflection. Add more transcript detail for a more useful review.');
  const actions = [];
  checks.filter(s => !s.present).slice(0, 3).forEach(s => actions.push(`Review “${s.title}”: ${s.hint}`));
  if (weakCCQ && !ccq) actions.push('Replace “Do you understand?” with concept questions whose answers reveal whether learners understand the meaning.');
  else if (!ccq) actions.push('Add 2–3 concept-checking questions. For example: “Is the time finished?” or “Do we know exactly when it happened?”');
  if (!instruction) actions.push('Make the learner task explicit: what to do, with whom, how long, and one model answer.');
  if (!examples) actions.push('Include a clear example and invite learners to explain what it shows.');
  if (wpm && wpm > 165) actions.push(`Your estimated speaking rate is ${wpm} words/min. Pause after key explanations and check learner responses.`);
  if (wpm && wpm < 70 && wc > 20) actions.push(`Your estimated speaking rate is ${wpm} words/min. Check whether the transcript captured the full lesson.`);
  if (!actions.length) actions.push('Use a fresh learner task to check transfer, then record what learners did successfully and what needs reteaching.');
  return {
    id: Date.now(), topic, framework, score, wc, wpm, duration, createdAt: new Date().toISOString(),
    checks, strengths: strengths.slice(0, 4), actions: actions.slice(0, 5),
    summary: `${presentCount} of ${checks.length} framework checkpoints had keyword evidence in the transcript.`,
    transcript
  };
}

function App() {
  const [page, setPage] = useState('home');
  const [topic, setTopic] = useState(() => getTopicGroupsForLevel('Intermediate').flatMap(g => g.topics)[0] || TOPICS[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [framework, setFramework] = useState('PPP');
  const [level, setLevel] = useState('Intermediate');
  const visibleTopicGroups = getTopicGroupsForLevel(level);
  const changeLevel = nextLevel => {
    setLevel(nextLevel);
    const availableTopics = getTopicGroupsForLevel(nextLevel).flatMap(group => group.topics);
    if (!availableTopics.includes(topic)) setTopic(availableTopics[0] || 'Custom grammar lesson');
  };
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [fullModelReady, setFullModelReady] = useState(false);
  const [modelBusy, setModelBusy] = useState(false);
  const [modelProgress, setModelProgress] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState(readReports);
  const [manualOpen, setManualOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('tcai-theme') || 'night');
  const [speechMode, setSpeechMode] = useState(() => localStorage.getItem('tcai-speech-mode') || 'offline');
  const [speechBusy, setSpeechBusy] = useState(false);
  const [speechStatus, setSpeechStatus] = useState('');
  const speechAudioRef = useRef(null);
  const speechStopRef = useRef(false);
  const [coachEndpoint, setCoachEndpoint] = useState(() => (localStorage.getItem('tcai-coach-endpoint') || '').trim() || 'https://teaching-coach-ai-backend.onrender.com');
  const [coachBusy, setCoachBusy] = useState(false);
  const [lessonPlan, setLessonPlan] = useState(null);
  const [lessonBusy, setLessonBusy] = useState(false);
  const [lessonError, setLessonError] = useState('');
  const [lessonMinutes, setLessonMinutes] = useState('45');
  const [lessonAim, setLessonAim] = useState('');
  const [coachStatus, setCoachStatus] = useState('');
  const [onlineSpeechToText, setOnlineSpeechToText] = useState(() => localStorage.getItem('tcai-online-stt') === 'true');
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const startedAtRef = useRef(null);
  const wantListenRef = useRef(false);
  const baseRef = useRef('');
  const nativeHandles = useRef([]);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioSegmentsRef = useRef([]);
  const audioRotationTimerRef = useRef(null);
  const audioRotationPromiseRef = useRef(Promise.resolve());
  const endingAudioCaptureRef = useRef(false);
  const audioCaptureAvailableRef = useRef(false);
  const audioCaptureStartedAtRef = useRef(0);

  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('tcai-theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('tcai-speech-mode', speechMode); }, [speechMode]);
  useEffect(() => { localStorage.setItem('tcai-reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => {
    if (sessionStarted && listening) {
      timerRef.current = setInterval(() => {
        if (startedAtRef.current) setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }, 500);
      return () => clearInterval(timerRef.current);
    }
    clearInterval(timerRef.current);
  }, [sessionStarted, listening]);

  const finalTopic = topic === 'Custom grammar lesson' ? (customTopic.trim() || 'Custom grammar lesson') : topic;
  const isNative = Capacitor.isNativePlatform();
  const supported = isNative || (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window));

  function createAudioRecorderSegment(stream) {
    const preferred = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(t => MediaRecorder.isTypeSupported?.(t));
    const recorder = preferred ? new MediaRecorder(stream, { mimeType: preferred }) : new MediaRecorder(stream);
    audioChunksRef.current = [];
    recorder.ondataavailable = event => { if (event.data?.size) audioChunksRef.current.push(event.data); };
    mediaRecorderRef.current = recorder;
    recorder.start(1000);
  }
  async function stopAndSaveCurrentSegment() {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    const stopped = new Promise(resolve => {
      if (recorder.state === 'inactive') return resolve();
      recorder.addEventListener('stop', resolve, { once: true });
      try { recorder.stop(); } catch { resolve(); }
    });
    await stopped;
    const mimeType = recorder.mimeType || 'audio/webm';
    const blob = audioChunksRef.current.length ? new Blob(audioChunksRef.current, { type: mimeType }) : null;
    if (blob?.size) audioSegmentsRef.current.push(blob);
    audioChunksRef.current = [];
    if (mediaRecorderRef.current === recorder) mediaRecorderRef.current = null;
  }
  async function rotateAudioCaptureSegment() {
    if (endingAudioCaptureRef.current || !audioCaptureAvailableRef.current || !mediaStreamRef.current) return;
    audioRotationPromiseRef.current = audioRotationPromiseRef.current.then(async () => {
      if (endingAudioCaptureRef.current || !mediaStreamRef.current) return;
      await stopAndSaveCurrentSegment();
      if (!endingAudioCaptureRef.current && mediaStreamRef.current) createAudioRecorderSegment(mediaStreamRef.current);
    }).catch(error => console.warn('Audio segment rotation failed:', error?.message || error));
    return audioRotationPromiseRef.current;
  }
  async function beginAudioCapture() {
    audioCaptureAvailableRef.current = false;
    endingAudioCaptureRef.current = false;
    audioChunksRef.current = [];
    audioSegmentsRef.current = [];
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      createAudioRecorderSegment(stream);
      audioCaptureAvailableRef.current = true;
      audioCaptureStartedAtRef.current = Date.now();
      // Each segment is a standalone media file. Three-minute segments stay comfortably
      // below Groq's per-file upload limit even at relatively high audio bitrates.
      audioRotationTimerRef.current = setInterval(() => { void rotateAudioCaptureSegment(); }, 3 * 60 * 1000);
    } catch (error) {
      console.warn('Whisper audio capture unavailable; continuing with device recognition.', error?.message || error);
      audioCaptureAvailableRef.current = false;
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  }
  async function endAudioCapture() {
    endingAudioCaptureRef.current = true;
    clearInterval(audioRotationTimerRef.current);
    audioRotationTimerRef.current = null;
    await audioRotationPromiseRef.current;
    await stopAndSaveCurrentSegment();
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    const segments = audioSegmentsRef.current;
    audioSegmentsRef.current = [];
    return segments;
  }
  async function transcribeWithWhisper(segments) {
    if (!Array.isArray(segments) || !segments.length || !coachEndpoint.trim()) return '';
    const base = coachEndpoint.trim().replace(/\/$/, '');
    const transcripts = [];
    for (let i = 0; i < segments.length; i++) {
      const blob = segments[i];
      if (!blob || !blob.size) continue;
      if (blob.size >= 24 * 1024 * 1024) throw new Error(`Audio segment ${i + 1} is too large to upload safely. Please record a shorter session.`);
      const form = new FormData();
      const extension = blob.type.includes('mp4') ? 'm4a' : blob.type.includes('wav') ? 'wav' : 'webm';
      form.append('audio', blob, `lesson-recording-part-${i + 1}.${extension}`);
      form.append('language', 'en');
      const response = await fetch(`${base}/api/transcribe`, { method: 'POST', body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || `Whisper transcription failed on segment ${i + 1} (${response.status})`);
      if (data.text?.trim()) transcripts.push(data.text.trim());
      setCoachStatus(`Transcribing with Whisper Large v3… (${i + 1}/${segments.length} parts)`);
    }
    return transcripts.join(' ').replace(/\s+/g, ' ').trim();
  }

  // Stop any stray recording if the person leaves the session screen without finishing.
  useEffect(() => {
    if (page !== 'session' && (mediaStreamRef.current || audioCaptureAvailableRef.current)) {
      endAudioCapture().catch(() => {});
      audioCaptureAvailableRef.current = false;
    }
  }, [page]);

  async function toggleOnlineSpeechToText(enabled) {
    setOnlineSpeechToText(enabled);
    localStorage.setItem('tcai-online-stt', String(enabled));
    if (!sessionStarted || page !== 'session') return;
    if (enabled) {
      setCoachStatus('Online transcription enabled. Audio will be sent to Whisper when you finish.');
      await beginAudioCapture();
    } else {
      await endAudioCapture().catch(() => {});
      audioCaptureAvailableRef.current = false;
      audioSegmentsRef.current = [];
      setCoachStatus('Online transcription disabled. Your live device transcript will be used.');
    }
  }

  async function startSession() {
    setTranscript(''); transcriptRef.current = ''; setElapsed(0); setReport(null);
    startedAtRef.current = Date.now(); setSessionStarted(true); setPage('session');
    // Ask for the microphone once, in order, so Android never sees two permission prompts at the same time.
    if (onlineSpeechToText) await Promise.race([beginAudioCapture(), new Promise(resolve => setTimeout(resolve, 8000))]);
    beginRecognition();
  }
  async function beginNative() {
    try {
      // Prefer Vosk: it runs fully on-device and does not depend on Android's online speech service.
      await clearNativeListeners();
      const status = await VoskSpeech.modelStatus();
      setFullModelReady(!!status.fullReady);
      const handle = await VoskSpeech.addListener('result', d => {
        const heard = (d.text || '').trim(); if (!heard) return;
        if (d.isFinal) {
          const base = baseRef.current;
          const next = base + (base && !base.endsWith(' ') ? ' ' : '') + heard;
          baseRef.current = next; transcriptRef.current = next; setTranscript(next);
        } else {
          const base = baseRef.current; const next = base + (base && !base.endsWith(' ') ? ' ' : '') + heard;
          transcriptRef.current = next; setTranscript(next);
        }
      });
      nativeHandles.current = [handle];
      baseRef.current = transcriptRef.current;
      await VoskSpeech.start();
      setListening(true);
    } catch (voskError) {
      await clearNativeListeners();
      // Keep the existing Android speech service as a fallback if the native model/plugin is unavailable.
      try {
        const { available } = await NativeSR.available();
        if (!available) { setListening(false); setManualOpen(true); return; }
        let perm = await NativeSR.checkPermissions();
        if (perm.speechRecognition !== 'granted') perm = await NativeSR.requestPermissions();
        if (perm.speechRecognition !== 'granted') { setListening(false); setManualOpen(true); return; }
        wantListenRef.current = true;
        const h1 = await NativeSR.addListener('partialResults', d => {
          const m = (d.matches && d.matches[0]) || ''; const base = baseRef.current;
          const full = base + (base && m && !base.endsWith(' ') ? ' ' : '') + m; transcriptRef.current = full; setTranscript(full);
        });
        const h2 = await NativeSR.addListener('listeningState', async d => {
          if (d.status === 'stopped') { baseRef.current = transcriptRef.current; if (wantListenRef.current) { try { await NativeSR.start({ language: 'en-US', partialResults: true, popup: false }); } catch { wantListenRef.current = false; setListening(false); } } else setListening(false); }
        });
        nativeHandles.current = [h1, h2]; baseRef.current = transcriptRef.current;
        await NativeSR.start({ language: 'en-US', partialResults: true, popup: false }); setListening(true);
      } catch { wantListenRef.current = false; setListening(false); setManualOpen(true); }
    }
  }
  async function clearNativeListeners() {
    for (const h of nativeHandles.current) { try { await h.remove(); } catch {} }
    nativeHandles.current = [];
  }
  function beginRecognition() {
    if (isNative) { beginNative(); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setListening(false); setManualOpen(true); return; }
    try {
      const rec = new SR();
      rec.continuous = true; rec.interimResults = true; rec.lang = 'en-US';
      rec.onresult = e => {
        let interim = '';
        let final = transcriptRef.current;
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const part = e.results[i][0].transcript;
          if (e.results[i].isFinal) final += (final && !final.endsWith(' ') ? ' ' : '') + part;
          else interim += part;
        }
        transcriptRef.current = final;
        setTranscript(final + (interim ? (final ? ' ' : '') + interim : ''));
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      recognitionRef.current = rec; rec.start(); setListening(true);
    } catch { setListening(false); setManualOpen(true); }
  }
  function stopRecognition() {
    if (isNative) {
      wantListenRef.current = false;
      VoskSpeech.stop().catch(() => {});
      NativeSR.stop().catch(() => {});
      clearNativeListeners();
    } else {
      try { recognitionRef.current?.stop(); } catch {}
      recognitionRef.current = null;
    }
    setListening(false);
    if (startedAtRef.current) setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
  }
  async function downloadFullModel() {
    if (modelBusy) return;
    const ok = window.confirm('Download the larger English speech model (about 1.8 GB). Use Wi-Fi and make sure you have at least 3 GB of free storage. The app will keep working offline with the small model while downloading is unavailable. Continue?');
    if (!ok) return;
    setModelBusy(true); setModelProgress('Preparing download…');
    let progressHandle;
    try {
      progressHandle = await VoskSpeech.addListener('downloadProgress', d => {
        if (d.total > 0) setModelProgress(`Downloading larger model: ${Math.round(d.downloaded / d.total * 100)}%`);
        else setModelProgress(`Downloaded ${(d.downloaded / (1024*1024)).toFixed(0)} MB`);
      });
      await VoskSpeech.downloadFullModel(); setFullModelReady(true); setModelProgress('Larger model installed. It will be used the next time you start listening.');
    } catch (e) { setModelProgress(e?.message || 'Download failed. The small offline model remains available.'); }
    finally { setModelBusy(false); if (progressHandle) await progressHandle.remove(); }
  }
  function toggleRecognition() {
    if (listening) stopRecognition();
    else beginRecognition();
  }
  async function finishSession() {
    stopRecognition();
    let whisperText = '';
    if (onlineSpeechToText && audioCaptureAvailableRef.current) {
      setCoachBusy(true);
      setCoachStatus('Preparing audio segments for Whisper Large v3…');
      try {
        const audioBlob = await endAudioCapture();
        whisperText = await transcribeWithWhisper(audioBlob);
        const liveWords = transcriptRef.current.trim().split(/\s+/).filter(Boolean).length;
        const whisperWords = whisperText.split(/\s+/).filter(Boolean).length;
        const looksIncomplete = liveWords >= 25 && whisperWords < liveWords * 0.4;
        // If online transcription was switched on partway through, the recording does not cover the whole lesson.
        const coversWholeSession = audioCaptureStartedAtRef.current - (startedAtRef.current || 0) < 10000;
        if (whisperText && coversWholeSession && !looksIncomplete) {
          transcriptRef.current = whisperText;
          setTranscript(whisperText);
          baseRef.current = whisperText;
        } else if (whisperText) {
          setCoachStatus(coversWholeSession ? 'Whisper result looked incomplete, so the live transcript was used.' : 'Online recording started partway through, so the live transcript was used.');
        }
      } catch (error) {
        setCoachStatus(`Whisper transcription unavailable; using live transcript. ${error?.message || ''}`);
        await endAudioCapture().catch(() => {});
      } finally {
        audioCaptureAvailableRef.current = false;
        setCoachBusy(false);
      }
    } else {
      await endAudioCapture().catch(() => {});
    }
    const duration = startedAtRef.current ? Math.floor((Date.now() - startedAtRef.current) / 1000) : elapsed;
    const clean = (transcriptRef.current.trim() || transcript.trim()).trim();
    const localReport = evaluateLesson({ transcript: clean, framework, topic: finalTopic, duration });
    let r = localReport;
    if (coachEndpoint.trim() && clean) {
      setCoachBusy(true); setCoachStatus('Asking the online coach to review your transcript…');
      try {
        const base = coachEndpoint.trim().replace(/\/$/, '');
        const response = await fetch(`${base}/api/evaluate`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: clean, framework, topic: finalTopic, level, duration })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || `Online coach error (${response.status})`);
        r = { ...localReport, aiReview: data.review, aiModel: data.model || 'Groq', reviewMode: 'Hybrid: local + Groq AI' };
        setCoachStatus('Online AI review added.');
      } catch (e) {
        r = { ...localReport, reviewMode: 'Offline/local review', aiError: e?.message || 'Online review failed' };
        setCoachStatus(`Online review unavailable; showing local feedback. ${e?.message || ''}`);
      } finally { setCoachBusy(false); }
    } else { r = { ...localReport, reviewMode: 'Offline/local review' }; }
    setReport(r); setReports(prev => [r, ...prev].slice(0, 50)); setPage('report');
  }
  async function generateLessonPlan() {
    if (!coachEndpoint.trim()) {
      setLessonError('Add your backend URL in Settings before generating an AI lesson plan.');
      return;
    }
    setLessonBusy(true); setLessonError(''); setLessonPlan(null);
    try {
      const base = coachEndpoint.trim().replace(/\/$/, '');
      const response = await fetch(`${base}/api/generate-lesson`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: finalTopic, level, framework, durationMinutes: Number(lessonMinutes), learnerNeeds: lessonAim.trim() })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || `Lesson generator error (${response.status})`);
      if (!data.lessonPlan || !Array.isArray(data.lessonPlan.stages)) throw new Error('The AI returned an incomplete lesson plan. Please try again.');
      setLessonPlan(data.lessonPlan);
    } catch (e) {
      setLessonError(`${e?.message || 'Could not generate a lesson plan.'} Your existing practice and local feedback are still available.`);
    } finally { setLessonBusy(false); }
  }
  function lessonSpeechText() {
    if (!lessonPlan) return '';
    return [lessonPlan.title, lessonPlan.rationale, 'Learning objectives.', ...(lessonPlan.objectives || []), ...(lessonPlan.stages || []).flatMap(st => [st.title, st.aim, ...(st.teacherSteps || []), st.studentTask, ...(st.examples || []), ...(st.ccqs || []), ...(st.icqs || []), st.feedbackFocus]), 'Assessment.', lessonPlan.assessment, 'Answer key.', lessonPlan.answerKey].filter(Boolean).join('. ').replace(/\s+/g, ' ').trim();
  }
  function stopLessonSpeech() {
    speechStopRef.current = true;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const a = speechAudioRef.current; speechAudioRef.current = null;
    if (a) { a.pause(); a.dispatchEvent(new Event('ended')); } // resolves the waiting playback promise
    setSpeechBusy(false);
    setSpeechStatus('Speech stopped.');
  }
  function splitSpeechText(text, max = 180) {
    const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
    const chunks = []; let current = '';
    for (const raw of sentences) {
      const sentence = raw.trim(); if (!sentence) continue;
      if (sentence.length > max) {
        if (current) { chunks.push(current); current = ''; }
        for (let i = 0; i < sentence.length; i += max) chunks.push(sentence.slice(i, i + max));
      } else if ((current + ' ' + sentence).trim().length <= max) current = (current + ' ' + sentence).trim();
      else { if (current) chunks.push(current); current = sentence; }
    }
    if (current) chunks.push(current);
    return chunks;
  }
  const sleepMs = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function fetchSpeechUrl(chunk) {
    const endpoint = coachEndpoint.trim().replace(/\/$/, '');
    for (let attempt = 0; attempt < 4; attempt++) {
      if (speechStopRef.current) return null;
      const response = await fetch(`${endpoint}/api/speech`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: chunk }) });
      if (response.ok) return URL.createObjectURL(await response.blob());
      const data = await response.json().catch(() => ({}));
      if (response.status === 429 && attempt < 3) {
        const wait = Math.min(Math.max(Number(response.headers.get('Retry-After')) || 12, 3), 30);
        setSpeechStatus(`Groq is limiting voice requests. Retrying in ${wait}s…`);
        await sleepMs(wait * 1000);
        continue;
      }
      throw new Error(data.error || `Groq voice failed (${response.status})`);
    }
    return null;
  }
  async function playLessonSpeech() {
    const text = lessonSpeechText();
    if (!text) return;
    speechStopRef.current = false;
    setSpeechBusy(true);
    setSpeechStatus(speechMode === 'groq' ? 'Generating Groq voice…' : 'Playing device voice…');
    if (speechMode === 'offline') {
      if (!(('speechSynthesis' in window) && ('SpeechSynthesisUtterance' in window))) {
        setSpeechBusy(false); setSpeechStatus('Offline speech is not supported on this device. Choose Groq online voice.'); return;
      }
      window.speechSynthesis.cancel();
      const parts = splitSpeechText(text, 220);
      parts.forEach((part, i) => {
        const utterance = new SpeechSynthesisUtterance(part); utterance.lang = 'en-US'; utterance.rate = 0.92;
        if (i === parts.length - 1) utterance.onend = () => { if (!speechStopRef.current) { setSpeechBusy(false); setSpeechStatus('Finished reading the lesson.'); } };
        utterance.onerror = e => {
          if (speechStopRef.current || e?.error === 'canceled' || e?.error === 'interrupted') return;
          window.speechSynthesis.cancel(); setSpeechBusy(false); setSpeechStatus('Device speech failed. Try Groq online voice.');
        };
        window.speechSynthesis.speak(utterance);
      });
      return;
    }
    try {
      if (!coachEndpoint.trim()) throw new Error('Add your deployed backend URL in Settings first.');
      const chunks = splitSpeechText(text);
      let next = fetchSpeechUrl(chunks[0]);
      for (let i = 0; i < chunks.length; i++) {
        if (speechStopRef.current) break;
        setSpeechStatus(`Groq voice: part ${i + 1} of ${chunks.length}…`);
        const url = await next;
        if (!url || speechStopRef.current) { if (url) URL.revokeObjectURL(url); break; }
        next = i + 1 < chunks.length ? fetchSpeechUrl(chunks[i + 1]) : null; // prefetch the next part while this one plays
        if (next) next.catch(() => {});
        await new Promise((resolve, reject) => {
          const audio = new Audio(url); speechAudioRef.current = audio;
          audio.onended = () => { URL.revokeObjectURL(url); if (speechAudioRef.current === audio) speechAudioRef.current = null; resolve(); };
          audio.onerror = () => { URL.revokeObjectURL(url); speechAudioRef.current = null; reject(new Error('Could not play the generated audio.')); };
          audio.play().catch(reject);
        });
      }
      if (!speechStopRef.current) setSpeechStatus('Finished reading the lesson with Groq.');
    } catch (e) { setSpeechStatus(e?.message || 'Could not play speech.'); }
    finally { setSpeechBusy(false); }
  }
  function openPlanner() { setLessonError(''); setPage('planner'); }
  function saveCoachEndpoint() {
    const clean = coachEndpoint.trim().replace(/\/$/, '');
    setCoachEndpoint(clean); localStorage.setItem('tcai-coach-endpoint', clean);
    setShowSettings(false); setCoachStatus(clean ? 'Online coach endpoint saved on this device.' : 'Online coach disabled. Local feedback will continue to work.');
  }
  function openReport(r) { setReport(r); setPage('report'); }
  function resetSession() { stopRecognition(); setSessionStarted(false); setElapsed(0); setTranscript(''); setPage('home'); }
  const time = n => `${String(Math.floor(n / 60)).padStart(2,'0')}:${String(n % 60).padStart(2,'0')}`;
  const currentChecks = report?.checks || [];

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-mark"><GraduationCap size={22}/></div>
      <div className="brand-text"><strong>Teaching Coach</strong><span>AI · PRACTICE LAB</span></div>
      <button className="icon-btn" aria-label={theme === 'night' ? 'Switch to day mode' : 'Switch to night mode'} onClick={() => setTheme(theme === 'night' ? 'day' : 'night')}><>{theme === 'night' ? <Sun size={19}/> : <Moon size={19}/>}</></button><button className="icon-btn" aria-label="AI settings" onClick={() => setShowSettings(true)}><Settings2 size={20}/></button><button className="icon-btn" aria-label="Help" onClick={() => setShowGuide(true)}><HelpCircle size={20}/></button>
    </header>

    {page === 'home' && <main className="screen">
      <section className="hero">
        <div className="eyebrow"><span className="pulse-dot"/> YOUR PERSONAL TEACHING PRACTICE</div>
        <h1>Teach with<br/><em>intention.</em></h1>
        <p>Practise a lesson, capture your explanation, and reflect on the teaching moves you used.</p>
        <div className="hero-stats">
          <div><strong>{reports.length ? reports.length : '—'}</strong><span>SESSIONS</span></div>
          <div><strong>{reports.length ? Math.round(reports.reduce((a,r)=>a+r.score,0)/reports.length) : '—'}</strong><span>AVG. SCORE</span></div>
          <div><strong>3</strong><span>FRAMEWORKS</span></div>
        </div>
      </section>

      <section className="section-heading"><div><span className="section-kicker">01 / PREPARE</span><h2>Set up your lesson</h2></div><BookOpen size={21}/></section>
      <div className="form-card">
        <label>Grammar focus</label>
        <div className="select-wrap"><select value={topic} onChange={e=>setTopic(e.target.value)}>{visibleTopicGroups.map(group=><optgroup key={group.label} label={group.label}>{group.topics.map(t=><option key={t} value={t}>{t}</option>)}</optgroup>)}</select><ChevronDown size={18}/></div>
        {topic === 'Custom grammar lesson' && <input className="text-input" value={customTopic} onChange={e=>setCustomTopic(e.target.value)} placeholder="Enter your lesson topic"/>}
        <label>Learner level</label>
        <div className="level-row">{['Beginner','Elementary','Intermediate','Advanced'].map(l=><button key={l} className={`level-chip ${level===l?'active':''}`} onClick={()=>changeLevel(l)}>{l}</button>)}</div>
        <label>Teaching framework</label>
        <div className="framework-list">
          {Object.entries(FRAMEWORKS).map(([key, f])=><button key={key} className={`framework-option ${framework===key?'selected':''}`} onClick={()=>setFramework(key)}>
            <span className="framework-code">{key}</span><span className="framework-copy"><strong>{f.name}</strong><small>{key==='PPP'?'Build from clear input to freer use':key==='TTT'?'Diagnose, teach, then measure progress':'Spark interest, focus, then activate'}</small></span>
            <span className="radio">{framework===key&&<Check size={13}/>}</span>
          </button>)}
        </div>
        <button className="primary-btn" onClick={startSession}><Mic size={19}/> Start practice session <span>→</span></button>
        <p className="privacy-note"><span className="privacy-dot"/> Your lesson notes stay on this device.</p>
      </div>

      <button className="planner-promo" onClick={openPlanner}><span className="planner-promo-icon"><Sparkles size={21}/></span><span><strong>Generate a complete grammar lesson</strong><small>Objectives, lead-in, explanations, CCQs, practice and answer key</small></span><span className="planner-arrow">→</span></button>
      <section className="section-heading spaced"><div><span className="section-kicker">02 / REFLECT</span><h2>Recent sessions</h2></div><History size={21}/></section>
      {reports.length ? <div className="report-list">{reports.slice(0,4).map(r=><button className="report-row" key={r.id} onClick={()=>openReport(r)}><div className="report-icon"><FileText size={19}/></div><div className="report-row-copy"><strong>{r.topic}</strong><span>{r.framework} · {new Date(r.createdAt).toLocaleDateString()}</span></div><span className="mini-score">{r.score}</span></button>)}</div> : <div className="empty-state"><div className="empty-icon"><ClipboardCheck size={24}/></div><strong>Your reflections will live here</strong><p>Complete your first practice session to get a review of your teaching checkpoints.</p></div>}
      <div className="disclaimer">Practice feedback is a guide for reflection, not a formal teaching assessment.</div>
    </main>}

    {page === 'planner' && <main className="screen">
      <button className="back-link" onClick={()=>setPage('home')}><ArrowLeft size={17}/> Dashboard</button>
      <div className="session-title"><span className="section-kicker">AI LESSON STUDIO</span><h1>Plan a lesson<br/><em>that teaches.</em></h1><p>Generate a practical, classroom-ready grammar lesson, then adapt it to your learners.</p></div>
      <div className="form-card planner-form">
        <label>Grammar focus</label>
        <div className="select-wrap"><select value={topic} onChange={e=>setTopic(e.target.value)}>{visibleTopicGroups.map(group=><optgroup key={group.label} label={group.label}>{group.topics.map(t=><option key={t} value={t}>{t}</option>)}</optgroup>)}</select><ChevronDown size={18}/></div>
        {topic === 'Custom grammar lesson' && <input className="text-input" value={customTopic} onChange={e=>setCustomTopic(e.target.value)} placeholder="Enter your grammar topic"/>}
        <label>Learner level</label><div className="level-row">{['Beginner','Elementary','Intermediate','Advanced'].map(l=><button key={l} className={`level-chip ${level===l?'active':''}`} onClick={()=>changeLevel(l)}>{l}</button>)}</div>
        <label>Lesson framework</label><div className="framework-list">{Object.entries(FRAMEWORKS).map(([key, f])=><button key={key} className={`framework-option ${framework===key?'selected':''}`} onClick={()=>setFramework(key)}><span className="framework-code">{key}</span><span className="framework-copy"><strong>{f.name}</strong><small>{key==='PPP'?'Clear input, guided practice, freer use':key==='TTT'?'Diagnose, teach, then measure progress':'Engage, study, activate'}</small></span><span className="radio">{framework===key&&<Check size={13}/>}</span></button>)}</div>
        <label>Lesson length</label><div className="select-wrap"><select value={lessonMinutes} onChange={e=>setLessonMinutes(e.target.value)}><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option><option value="90">90 minutes</option></select><ChevronDown size={18}/></div>
        <label>Class context or learner needs (optional)</label><textarea className="planner-context" value={lessonAim} onChange={e=>setLessonAim(e.target.value)} placeholder="e.g. 16 adult learners, mixed ability; they know past simple but confuse it with present perfect." />
        <button className="primary-btn" onClick={generateLessonPlan} disabled={lessonBusy}><Sparkles size={18}/>{lessonBusy?'Generating your lesson…':'Generate complete lesson plan'}<span>→</span></button>
        <p className="privacy-note">Your topic, level and class context are sent to your private backend and Groq to generate the plan. Do not include identifiable pupil information.</p>
        {lessonError && <div className="notice"><HelpCircle size={18}/><p>{lessonError}</p></div>}
      </div>
      {lessonPlan && <section className="generated-plan">
        <div className="plan-title-row"><div><span className="section-kicker">YOUR GENERATED LESSON</span><h2>{lessonPlan.title || finalTopic}</h2><p>{lessonPlan.level || level} · {lessonPlan.durationMinutes || lessonMinutes} minutes · {framework}</p></div><button className="icon-btn" onClick={()=>{const text=[lessonPlan.title, lessonPlan.objectives?.join('\n'), ...(lessonPlan.stages||[]).flatMap(st=>[st.title,`${st.minutes||''} min`,st.teacherSteps?.join('\n'),st.studentTask,st.ccqs?.join('\n')]), lessonPlan.answerKey].filter(Boolean).join('\n\n'); if(navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(()=>setCoachStatus('Lesson plan copied.')).catch(()=>setCoachStatus('Select and copy the lesson plan manually.')); else setCoachStatus('Copy is not available in this browser.');}} aria-label="Copy lesson plan"><ClipboardList size={19}/></button></div>
        <div className="speech-controls"><label htmlFor="speech-mode">Read lesson aloud</label><div className="speech-actions"><select id="speech-mode" value={speechMode} onChange={e=>setSpeechMode(e.target.value)} disabled={speechBusy}><option value="offline">Offline device voice</option><option value="groq">Groq natural voice (online)</option></select>{speechBusy ? <button className="secondary-btn speech-btn" onClick={stopLessonSpeech}><Square size={16}/> Stop</button> : <button className="primary-btn speech-btn" onClick={playLessonSpeech}><Volume2 size={17}/> Read aloud</button>}</div>{speechStatus && <p className="speech-status" aria-live="polite">{speechStatus}</p>}<p className="privacy-note">Offline mode uses your device's speech engine. Groq mode needs internet and your configured backend; lesson text is sent in short parts to generate audio.</p></div>
        {lessonPlan.rationale && <p className="plan-rationale">{lessonPlan.rationale}</p>}
        <div className="plan-info-grid"><div><strong>Learning objectives</strong><ul>{(lessonPlan.objectives||[]).map((x,i)=><li key={i}>{x}</li>)}</ul></div><div><strong>Materials</strong><ul>{(lessonPlan.materials||[]).map((x,i)=><li key={i}>{x}</li>)}</ul></div></div>
        <div className="plan-stage-list">{lessonPlan.stages.map((st,i)=><article className="plan-stage" key={i}><div className="plan-stage-head"><span>{String(i+1).padStart(2,'0')}</span><div><h3>{st.title}</h3><small>{st.minutes || '—'} minutes {st.stage ? `· ${st.stage}` : ''}</small></div></div>{st.aim && <p className="stage-aim"><strong>Aim:</strong> {st.aim}</p>}{st.teacherSteps?.length>0 && <><strong>Teacher steps</strong><ol>{st.teacherSteps.map((x,j)=><li key={j}>{x}</li>)}</ol></>}{st.studentTask && <p><strong>Learner task:</strong> {st.studentTask}</p>}{st.examples?.length>0 && <div className="plan-examples"><strong>Examples / board plan</strong><ul>{st.examples.map((x,j)=><li key={j}>{x}</li>)}</ul></div>}{st.ccqs?.length>0 && <div className="plan-ccq"><strong>Concept-checking questions (CCQs)</strong><ul>{st.ccqs.map((x,j)=><li key={j}>{x}</li>)}</ul>{st.ccqAnswers?.length>0 && <p><strong>Suggested answers:</strong> {st.ccqAnswers.join(' · ')}</p>}</div>}{st.icqs?.length>0 && <div className="plan-ccq"><strong>Instruction-checking questions (ICQs)</strong><ul>{st.icqs.map((x,j)=><li key={j}>{x}</li>)}</ul></div>}{st.feedbackFocus && <p><strong>Feedback focus:</strong> {st.feedbackFocus}</p>}</article>)}</div>
        <div className="plan-info-grid"><div><strong>Anticipated problems & solutions</strong><ul>{(lessonPlan.anticipatedProblems||[]).map((x,i)=><li key={i}>{x}</li>)}</ul></div><div><strong>Differentiation</strong><ul>{(lessonPlan.differentiation||[]).map((x,i)=><li key={i}>{x}</li>)}</ul></div></div>
        {lessonPlan.assessment && <div className="plan-assessment"><Lightbulb size={19}/><div><strong>Assessment / exit ticket</strong><p>{lessonPlan.assessment}</p></div></div>}
        {lessonPlan.answerKey && <details className="answer-key"><summary>Show answer key / suggested responses</summary><p>{lessonPlan.answerKey}</p></details>}
        <button className="primary-btn" onClick={()=>{setPage('home');setSessionStarted(false);setTimeout(()=>startSession(),0)}}><Mic size={18}/> Practise teaching this lesson</button>
        <p className="disclaimer">AI-generated draft: check grammar accuracy, timing, cultural fit and learner appropriacy before teaching.</p>
      </section>}
    </main>}

    {page === 'session' && <main className="screen">
      <button className="back-link" onClick={resetSession}><ArrowLeft size={17}/> Back to setup</button>
      <div className="session-title"><span className="section-kicker">LIVE PRACTICE / {framework}</span><h1>You're in the<br/><em>teaching moment.</em></h1><p>{finalTopic} · {level}</p></div>
      <div className="live-card">
        <div className="live-top"><span className={`live-status ${listening?'is-live':''}`}><i/>{listening?'LISTENING':'SESSION READY'}</span><span className="timer"><Clock3 size={16}/>{time(elapsed)}</span></div>
        <div className={`mic-orb ${listening?'active':''}`}><div className="orb-ring ring-one"/><div className="orb-ring ring-two"/>{listening?<Volume2 size={33}/>:<Mic size={33}/>}</div>
        <label className="online-stt-toggle">
          <input type="checkbox" checked={onlineSpeechToText} onChange={e => { void toggleOnlineSpeechToText(e.target.checked); }} />
          <span className="online-stt-toggle-copy"><strong>Online speech-to-text</strong><small>{onlineSpeechToText ? 'Whisper Large v3 · slower, online' : 'Off · fast device/offline recognition'}</small></span>
          <span className="online-stt-switch" aria-hidden="true" />
        </label>
        <h2>{listening?'Speak naturally':'Start capturing your lesson'}</h2>
        <p>{supported ? 'Explain the lesson as you would to your learners. Pause when needed.' : 'Speech recognition is not available in this browser. Add your transcript manually instead.'}</p>
        <div className="waveform">{Array.from({length:29},(_,i)=><span key={i} style={{'--h':`${8+((i*17+5)%25)}px`}} className={listening?'wave-on':''}/>)}</div>
        <button className={listening?'stop-btn':'primary-btn'} onClick={toggleRecognition}>{listening?<><Pause size={18}/> Pause listening</>:<><Play size={18}/> {transcript?'Resume listening':'Start listening'}</>}</button>
        <button className="text-btn" onClick={()=>setManualOpen(true)}><FileText size={16}/> Add transcript manually</button>
        {isNative && <div className="offline-model-tools"><span className="model-status">{fullModelReady ? 'Larger English model installed' : 'Small offline English model'}</span><button className="text-btn" disabled={modelBusy || listening} onClick={downloadFullModel}>{modelBusy ? 'Downloading model…' : fullModelReady ? 'Re-download larger model' : 'Download higher-accuracy model (≈1.8 GB)'}</button>{modelProgress && <small>{modelProgress}</small>}</div>}
      </div>
      <section className="section-heading transcript-head"><div><span className="section-kicker">LIVE TRANSCRIPT</span><h2>Your words</h2></div><span className="word-count">{words(transcript).length} words</span></section>
      <div className="transcript-box">{transcript ? <p>{transcript}</p> : <div className="transcript-placeholder"><Mic size={19}/><span>Your speech will appear here.<br/>You can also add text manually.</span></div>}</div>
      <div className="session-tip"><Sparkles size={18}/><p><strong>Coach's reminder</strong><br/>Make your thinking visible: model an example, check meaning with a focused question, then give learners time to try.</p></div>
      <button className="primary-btn finish-btn" onClick={finishSession} disabled={coachBusy}><Square size={16} fill="currentColor"/> {coachBusy ? 'AI is reviewing…' : 'Finish & review lesson'}</button>
      <p className="disclaimer">Offline Vosk recognition runs on this device. The larger model is optional; transcript review works locally.</p>
    </main>}

    {page === 'report' && report && <main className="screen">
      <button className="back-link" onClick={()=>setPage('home')}><ArrowLeft size={17}/> Dashboard</button>
      <div className="report-hero"><span className="section-kicker">SESSION REFLECTION / {report.framework}</span><h1>Review your<br/><em>teaching practice.</em></h1><p>{report.topic}</p>
        <div className="score-panel"><div className="score-ring" style={{'--score':`${report.score*3.6}deg`}}><div><strong>{report.score}</strong><span>/100</span></div></div><div className="score-copy"><span className="score-label">PRACTICE INDICATOR</span><h2>{report.score>=80?'Strong evidence':report.score>=60?'Building evidence':'Room to explore'}</h2><p>{report.summary}</p></div></div>
        <div className="report-metrics"><div><FileText size={17}/><strong>{report.wc}</strong><span>WORDS</span></div><div><Clock3 size={17}/><strong>{time(report.duration)}</strong><span>DURATION</span></div><div><Activity size={17}/><strong>{report.wpm ?? '—'}</strong><span>WORDS/MIN</span></div></div>
      </div>
      <section className="section-heading"><div><span className="section-kicker">01 / EVIDENCE</span><h2>Framework checkpoints</h2></div><Target size={21}/></section>
      <p className="section-intro">These are keyword signals in your transcript, not proof that a step was taught effectively. Review each one against what happened in the room. <strong>{report.reviewMode || 'Local review'}</strong></p>
      {report.aiReview && <section className="insight-card ai-review-card"><div className="section-kicker">GROQ AI COACH REVIEW</div><h2>{report.aiReview.overallAssessment}</h2><p>{report.aiReview.rationale}</p><div className="ai-review-grid">{(report.aiReview.criteria || []).map((c,i)=><div className="ai-criterion" key={i}><strong>{c.name}</strong><span>{c.rating}</span><p>{c.evidence}</p><small>Next: {c.suggestion}</small></div>)}</div>{report.aiReview.priorityActions?.length > 0 && <><h3>Priority actions</h3><ol>{report.aiReview.priorityActions.map((a,i)=><li key={i}>{a}</li>)}</ol></>}<p className="disclaimer">AI feedback is generated from the transcript only; it cannot reliably infer tone, learner reactions, or events that were not transcribed.</p></section>}
      {report.aiError && <div className="notice"><HelpCircle size={18}/><p>Online AI review was unavailable: {report.aiError}. Your local review is still saved. Check Settings to verify the backend URL.</p></div>}
      <div className="checkpoint-list">{currentChecks.map((c,i)=><div className={`checkpoint ${c.present?'done':'missing'}`} key={c.title}><div className="checkpoint-mark">{c.present?<Check size={16}/>:<X size={16}/>}</div><div className="checkpoint-copy"><strong>{c.title}</strong><p>{c.present?`Possible evidence: ${c.hits.join(', ')}.`:c.hint}</p></div><span className="checkpoint-status">{c.present?'SIGNAL FOUND':'REVIEW'}</span></div>)}</div>
      <section className="section-heading spaced"><div><span className="section-kicker">02 / WHAT WENT WELL</span><h2>Potential strengths</h2></div><Zap size={21}/></section>
      <div className="insight-card strength-card">{report.strengths.map((s,i)=><div className="insight-line" key={i}><span className="insight-check"><Check size={15}/></span><p>{s}</p></div>)}</div>
      <section className="section-heading spaced"><div><span className="section-kicker">03 / NEXT TIME</span><h2>Actionable next steps</h2></div><TrendingUp size={21}/></section>
      <div className="insight-card action-card">{report.actions.map((s,i)=><div className="action-line" key={i}><span>{String(i+1).padStart(2,'0')}</span><p>{s}</p></div>)}</div>
      <section className="section-heading spaced"><div><span className="section-kicker">YOUR RECORD</span><h2>Transcript</h2></div><FileText size={21}/></section>
      <div className="transcript-box report-transcript">{report.transcript || 'No speech transcript was captured. Add a transcript next time for more useful reflection.'}</div>
      <button className="primary-btn" onClick={()=>{setPage('home');setSessionStarted(false)}}><Home size={18}/> Back to dashboard</button>
      <button className="secondary-btn" onClick={()=>{setPage('home');setSessionStarted(false);setTimeout(()=>startSession(),0)}}><RotateCcw size={17}/> Practise another lesson</button>
      <p className="disclaimer">The local indicator uses keyword heuristics. Optional Groq feedback reviews the transcript, but neither can reliably infer classroom interaction or assess teaching from audio alone.</p>
    </main>}

    <nav className="bottom-nav">
      <button className={page==='home'?'nav-active':''} onClick={()=>setPage('home')}><Home size={20}/><span>Home</span></button>
      <button className={page==='session'?'nav-active':''} onClick={()=>{if(sessionStarted)setPage('session');else setPage('home')}}><Mic size={20}/><span>Practice</span></button>
      <button className={page==='planner'?'nav-active':''} onClick={openPlanner}><BookOpen size={20}/><span>Plan</span></button>
      <button className={page==='report'?'nav-active':''} onClick={()=>reports.length?openReport(reports[0]):setShowGuide(true)}><ClipboardCheck size={20}/><span>Reviews</span></button>
    </nav>

    {showSettings && <div className="modal-backdrop" onClick={() => setShowSettings(false)}><div className="modal-sheet" onClick={e => e.stopPropagation()}><div className="sheet-handle"/><div className="modal-heading"><div><span className="section-kicker">HYBRID AI COACH</span><h2>Online review settings</h2></div><button className="icon-btn" onClick={() => setShowSettings(false)}><X size={20}/></button></div><p>The app always keeps its local feedback. To add Groq AI feedback, enter the URL of your deployed Teaching Coach backend. Do not enter your Groq API key here.</p><label>Backend URL</label><input className="text-input" value={coachEndpoint} onChange={e => setCoachEndpoint(e.target.value)} placeholder="https://your-backend.example.com" autoCapitalize="none" autoCorrect="off"/><p className="privacy-note">When enabled, the lesson transcript and topic are sent to your backend for AI review. Your API key stays on the backend.</p><button className="primary-btn" onClick={saveCoachEndpoint}><Check size={18}/> Save settings</button><button className="secondary-btn" onClick={() => {setCoachEndpoint('');localStorage.removeItem('tcai-coach-endpoint');setCoachStatus('Online coach disabled.');setShowSettings(false)}}>Use offline feedback only</button>{coachStatus && <p className="disclaimer">{coachStatus}</p>}</div></div>}

    {manualOpen && <div className="modal-backdrop" onClick={()=>setManualOpen(false)}><div className="modal-sheet" onClick={e=>e.stopPropagation()}><div className="sheet-handle"/><div className="modal-heading"><div><span className="section-kicker">TRANSCRIPT EDITOR</span><h2>Add or edit speech</h2></div><button className="icon-btn" onClick={()=>setManualOpen(false)}><X size={20}/></button></div><p>Paste or type what you said during the lesson. More detail makes the reflection more useful.</p><textarea value={transcript} onChange={e=>{setTranscript(e.target.value);transcriptRef.current=e.target.value}} placeholder="For example: Today we're going to talk about the present perfect. We use have or has plus the past participle..."/><button className="primary-btn" onClick={()=>setManualOpen(false)}><Check size={18}/> Save transcript</button></div></div>}

    {showGuide && <div className="modal-backdrop" onClick={()=>setShowGuide(false)}><div className="modal-sheet guide-sheet" onClick={e=>e.stopPropagation()}><div className="sheet-handle"/><div className="modal-heading"><div><span className="section-kicker">QUICK GUIDE</span><h2>How coaching works</h2></div><button className="icon-btn" onClick={()=>setShowGuide(false)}><X size={20}/></button></div><div className="guide-item"><span>01</span><div><strong>Prepare</strong><p>Choose a grammar focus and PPP, TTT, or ESA framework.</p></div></div><div className="guide-item"><span>02</span><div><strong>Practise</strong><p>Teach aloud. Use speech recognition when supported or enter the transcript manually.</p></div></div><div className="guide-item"><span>03</span><div><strong>Reflect</strong><p>Review possible checkpoint signals, strengths, and next steps. Confirm them against your actual lesson.</p></div></div><div className="notice"><HelpCircle size={18}/><p><strong>Know the limits</strong><br/>The score is a practice indicator based on transcript keywords. It is not a validated assessment, and speech recognition may rely on your device's configured service.</p></div><button className="primary-btn" onClick={()=>setShowGuide(false)}>Got it</button></div></div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
