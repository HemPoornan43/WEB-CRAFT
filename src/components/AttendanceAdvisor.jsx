import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { calculateLeaveImpact, simulateLeaveAttendance } from '../utils/leaveCalculator.js';

// ─── Build the system prompt with full dashboard context ───
function buildSystemPrompt(section, evaluation, distribution, asOfDate, futureDate) {
  const sub = distribution.subjectStats.map(s =>
    `  • ${s.name} (${s.code}): ${s.pastClasses} conducted, ${s.remainingClasses} remaining, ${s.totalClasses} total`
  ).join('\n');

  return `You are the "Attendance Advisor" — a smart assistant embedded in a college attendance prediction dashboard.

=== STUDENT CONTEXT ===
Section: ${section.name} — ${section.fullName}
Department: ${section.department}
Semester: ${section.semester}
Today (As-Of): ${asOfDate}
Planning Target Date: ${futureDate}
Semester: Aug 29, 2026 → Nov 29, 2026

=== OVERALL ATTENDANCE ===
Current Attendance: ${evaluation.currentPercentage.toFixed(1)}%
Classes Conducted So Far: ${evaluation.pastClasses}
Classes Attended So Far: ${evaluation.attendedPast}
Classes Missed So Far: ${evaluation.missedPast}
Remaining Classes (to ${futureDate}): ${evaluation.remainingClasses}
Total Semester Classes: ${evaluation.totalClasses}
Status: ${evaluation.status.replace(/_/g,' ')}
Status Message: ${evaluation.statusMessage}

=== THRESHOLDS ===
75% Safe Zone: Needs ${evaluation.requiredClasses75} more of ${evaluation.remainingClasses} remaining → ${evaluation.is75Achievable ? 'ACHIEVABLE' : 'NOT ACHIEVABLE'}
90% Distinction: Needs ${evaluation.requiredClasses90} more → ${evaluation.is90Achievable ? 'ACHIEVABLE' : 'NOT ACHIEVABLE'}
Safe Bunks (stay ≥ 75%): ${evaluation.safeBunks75} classes
Max Achievable %: ${evaluation.maxAchievablePercentage.toFixed(1)}%
Min Possible %: ${evaluation.minAchievablePercentage.toFixed(1)}%

=== SUBJECTS ===
${sub}

=== YOUR ROLE ===
Answer the student's attendance-related questions. Be concise (max 3–4 short paragraphs), personal, and precise. Use the exact numbers above. When asked about leaves, sick days, or OD — calculate the impact (which days have classes, which subjects are affected, new attendance %). Give actionable advice. Use emojis sparingly. Do NOT make up data.`;
}

// ─── Rule-based fallback (no API key needed) ───
function ruleBasedAnswer(message, section, evaluation, distribution, asOfDate) {
  const msg = message.toLowerCase();

  // Helper
  const pct = evaluation.currentPercentage.toFixed(1);
  const remaining = evaluation.remainingClasses;
  const safeBunks = evaluation.safeBunks75;

  if (msg.includes('bunk') || msg.includes('skip') || msg.includes('miss') || msg.includes('absent')) {
    if (safeBunks > 0) {
      return `📊 With your current attendance of **${pct}%**, you can safely skip up to **${safeBunks} more classes** (out of the ${remaining} remaining) and still stay above the 75% detention threshold.\n\nHowever, to stay safe, try not to bunk consecutive days — spread them out. And remember, crossing below 75% overall means detention risk!`;
    } else {
      return `⚠️ **You cannot safely bunk any more classes right now.** Your current attendance is ${pct}%, and you still need to attend **${evaluation.requiredClasses75} of the ${remaining} remaining classes** just to reach 75% safe zone.\n\nEvery class you miss right now pushes you closer to detention. Please attend all remaining lectures.`;
    }
  }

  if (msg.includes('75') || msg.includes('safe') || msg.includes('detention')) {
    if (evaluation.is75Achievable) {
      return `🛡️ Good news — 75% is **still achievable!** You need to attend at least **${evaluation.requiredClasses75}** of the ${remaining} remaining classes.\n\nYour current standing is **${pct}%**. ${safeBunks > 0 ? `You have a buffer of ${safeBunks} safe bunks.` : 'But you have no bunk buffer — attend all remaining classes.'}`;
    } else {
      return `🚨 **CRITICAL:** Even if you attend 100% of all remaining ${remaining} classes, your maximum achievable attendance is **${evaluation.maxAchievablePercentage.toFixed(1)}%** — which is BELOW the 75% requirement. Detention cannot be avoided. Please speak with your class coordinator immediately.`;
    }
  }

  if (msg.includes('90') || msg.includes('distinction') || msg.includes('honor')) {
    if (evaluation.is90Achievable) {
      return `🌟 90% distinction is achievable! You need **${evaluation.requiredClasses90}** more of the ${remaining} remaining classes. ${evaluation.safeBunks90 > 0 ? `You also have a ${evaluation.safeBunks90}-class buffer above 90%.` : 'There is no buffer — attend everything for distinction.'}`;
    } else {
      return `📉 90% distinction is no longer reachable from your current position of **${pct}%**. The highest you can go is **${evaluation.maxAchievablePercentage.toFixed(1)}%**. Focus on securing 75% first!`;
    }
  }

  if (msg.includes('how many classes') || msg.includes('need to attend') || msg.includes('how much')) {
    return `📋 Here's your requirement breakdown:\n- **For 75% (safe zone):** Attend ${evaluation.requiredClasses75} of ${remaining} remaining\n- **For 90% (distinction):** Attend ${evaluation.requiredClasses90} of ${remaining} remaining\n- **Safe bunks available (stay ≥ 75%):** ${safeBunks} classes\n\nYour current: **${pct}%** (attended ${evaluation.attendedPast} of ${evaluation.pastClasses} past classes)`;
  }

  if (msg.includes('subject') || msg.includes('chemistry') || msg.includes('maths') || msg.includes('math') || msg.includes('physics') || msg.includes('programming')) {
    const subjects = distribution.subjectStats;
    const list = subjects.map(s => `• **${s.name}**: ${s.pastClasses} conducted, ${s.remainingClasses} remaining`).join('\n');
    return `📚 Here's the class distribution for your subjects in **${section.name}**:\n\n${list}\n\nNote: Per-subject attendance % requires individual tracking. Use the "By Subject" mode in the Control Hub to set individual percentages.`;
  }

  if (msg.includes('leave') || msg.includes('sick') || msg.includes('od') || msg.includes('medical') || msg.includes('holiday')) {
    return `🏥 To simulate a leave, use the **OD / Leave Simulator tab** above! It lets you:\n- Pick leave type (OD, Medical, Casual)\n- Select date range\n- Choose specific subjects affected\n\nIt will instantly show how many classes you'll miss and whether any subject drops below 75%. 📋`;
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return `👋 Hey! I'm your **Attendance Advisor**. I know your full attendance data for **${section.name}**.\n\nYou can ask me things like:\n- "Can I bunk 3 classes this week?"\n- "If I take 2 days of medical leave, will I get detained?"\n- "How many classes do I need for distinction?"\n- "Am I safe from detention?"\n\nWhat would you like to know?`;
  }

  return `📊 Based on your current data:\n- Section: **${section.name}**\n- Attendance: **${pct}%** (${evaluation.status.replace(/_/g, ' ')})\n- Safe Bunks Left: **${safeBunks}**\n- Remaining Classes: **${remaining}**\n\n${evaluation.statusMessage}\n\nAsk me anything about your attendance — I'm here to help!`;
}

// ─── Message Bubble ───
function Bubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`chat-bubble-row ${isUser ? 'user' : 'bot'}`}>
      {!isUser && <div className="chat-avatar">🤖</div>}
      <div className={`chat-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
        {msg.text.split('\n').map((line, i) => {
          // Simple bold markdown
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={i} style={{ margin: '2px 0' }}>
              {parts.map((part, j) =>
                j % 2 === 1 ? <strong key={j}>{part}</strong> : part
              )}
            </p>
          );
        })}
        <div className="chat-ts">{msg.time}</div>
      </div>
      {isUser && <div className="chat-avatar user-av">👤</div>}
    </div>
  );
}

const QUICK_CHIPS = [
  'Am I safe from detention?',
  'How many classes can I bunk?',
  'What do I need for 90% distinction?',
  'Show me my class requirements',
];

export default function AttendanceAdvisor({ section, evaluation, distribution, asOfDate, futureDate }) {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([{
    role: 'bot',
    text: `👋 Hi! I'm your **Attendance Advisor**. I have full access to your dashboard data for **${section.name}**.\n\nAsk me anything about your attendance, leaves, or how to reach your goals!`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [apiKey, setApiKey]     = useState(() => sessionStorage.getItem('gemini_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const saveApiKey = (key) => {
    sessionStorage.setItem('gemini_key', key);
    setApiKey(key);
    setShowKeyInput(false);
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput('');

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages = [...messages, { role: 'user', text: userText, time }];
    setMessages(newMessages);
    setLoading(true);

    let botText = '';

    if (apiKey) {
      // ─── Gemini API path ───
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const systemPrompt = buildSystemPrompt(section, evaluation, distribution, asOfDate, futureDate);
        const chat = model.startChat({
          systemInstruction: systemPrompt,
          history: newMessages.slice(1, -1).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }))
        });
        const result = await chat.sendMessage(userText);
        botText = result.response.text();
      } catch (e) {
        console.error('Gemini error:', e);
        if (e.message?.includes('API_KEY') || e.message?.includes('401')) {
          botText = `❌ Invalid API key. Click the ⚙️ button to update it.\n\nFalling back to local advisor:\n\n${ruleBasedAnswer(userText, section, evaluation, distribution, asOfDate)}`;
        } else {
          botText = ruleBasedAnswer(userText, section, evaluation, distribution, asOfDate);
        }
      }
    } else {
      // ─── Local rule-based path ───
      await new Promise(r => setTimeout(r, 600)); // Simulate thinking
      botText = ruleBasedAnswer(userText, section, evaluation, distribution, asOfDate);
    }

    setMessages(prev => [...prev, {
      role: 'bot',
      text: botText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className={`chat-fab ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Open Attendance Advisor"
        id="chat-fab-btn"
      >
        {open ? '✕' : '🤖'}
        {!open && <span className="chat-fab-label">Advisor</span>}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Attendance Advisor Chat">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-header-icon">🎓</div>
              <div>
                <div className="chat-header-title">Attendance Advisor</div>
                <div className="chat-header-sub">
                  {apiKey ? '✨ Powered by Gemini AI' : '🧮 Smart Rule-Based Engine'}
                  {' · '}{section.name}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className="chat-icon-btn"
                title={apiKey ? 'Change Gemini API Key' : 'Add Gemini API Key for AI'}
                onClick={() => setShowKeyInput(v => !v)}
              >⚙️</button>
              <button className="chat-icon-btn" onClick={() => setOpen(false)}>✕</button>
            </div>
          </div>

          {/* API Key Input */}
          {showKeyInput && (
            <div className="chat-api-key-box">
              <div style={{ fontSize: '0.8rem', marginBottom: '8px', color: '#94a3b8' }}>
                Enter your <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
                  style={{ color: '#3b82f6' }}>Gemini API key</a> (free) for AI-powered responses:
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="password"
                  className="control-input"
                  placeholder="AIzaSy..."
                  defaultValue={apiKey}
                  style={{ flex: 1, fontSize: '0.85rem' }}
                  onKeyDown={e => e.key === 'Enter' && saveApiKey(e.target.value)}
                  id="gemini-api-key-input"
                />
                <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                  onClick={e => saveApiKey(e.target.previousSibling.value)}>
                  Save
                </button>
                {apiKey && (
                  <button className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                    onClick={() => { sessionStorage.removeItem('gemini_key'); setApiKey(''); setShowKeyInput(false); }}>
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((m, i) => <Bubble key={i} msg={m} />)}
            {loading && (
              <div className="chat-bubble-row bot">
                <div className="chat-avatar">🤖</div>
                <div className="chat-bubble bot-bubble chat-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick chips */}
          <div className="chat-chips">
            {QUICK_CHIPS.map(chip => (
              <button key={chip} className="chat-chip" onClick={() => sendMessage(chip)}>
                {chip}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="chat-input-row">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Ask about leaves, bunks, subjects…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              id="chat-message-input"
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
