(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/ai ml projects/viralytiq/frontend/src/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ai ml projects/viralytiq/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ai ml projects/viralytiq/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ai ml projects/viralytiq/frontend/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('glass-surface rounded-xl text-slate-100 p-5', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/components/ui/card.tsx",
        lineNumber: 8,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Card;
Card.displayName = 'Card';
var _c, _c1;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ai ml projects/viralytiq/frontend/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "brainstormIdeas",
    ()=>brainstormIdeas,
    "createVoiceDocument",
    ()=>createVoiceDocument,
    "deleteVoiceDocument",
    ()=>deleteVoiceDocument,
    "fetchPosts",
    ()=>fetchPosts,
    "fetchVoiceDocuments",
    ()=>fetchVoiceDocuments,
    "generateStrategy",
    ()=>generateStrategy,
    "loadLastTraces",
    ()=>loadLastTraces,
    "loadLocalPosts",
    ()=>loadLocalPosts,
    "saveLastTraces",
    ()=>saveLastTraces,
    "saveLocalPost",
    ()=>saveLocalPost,
    "searchVoiceMemory",
    ()=>searchVoiceMemory
]);
const STORAGE_POSTS = 'viralytiq_local_posts_v1';
const STORAGE_TRACES = 'viralytiq_last_traces_v1';
function saveLocalPost(post) {
    try {
        const prev = JSON.parse(localStorage.getItem(STORAGE_POSTS) || '[]');
        const list = Array.isArray(prev) ? prev : [];
        list.unshift({
            ...post,
            savedAt: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_POSTS, JSON.stringify(list.slice(0, 50)));
    } catch (e) {
    /* ignore */ }
}
function loadLocalPosts() {
    try {
        const prev = JSON.parse(localStorage.getItem(STORAGE_POSTS) || '[]');
        return Array.isArray(prev) ? prev : [];
    } catch (e) {
        return [];
    }
}
function saveLastTraces(traces) {
    try {
        localStorage.setItem(STORAGE_TRACES, JSON.stringify({
            at: new Date().toISOString(),
            traces
        }));
    } catch (e) {
    /* ignore */ }
}
function loadLastTraces() {
    try {
        const raw = localStorage.getItem(STORAGE_TRACES);
        if (!raw) return null;
        const data = JSON.parse(raw);
        return {
            at: data.at,
            traces: Array.isArray(data.traces) ? data.traces : []
        };
    } catch (e) {
        return null;
    }
}
async function brainstormIdeas(payload) {
    var _payload_audience, _payload_count;
    const res = await fetch('/api/v1/strategist/brainstorm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            topic: payload.topic,
            audience: (_payload_audience = payload.audience) !== null && _payload_audience !== void 0 ? _payload_audience : 'Seed-Series B SaaS Founders & Staff Engineers',
            count: (_payload_count = payload.count) !== null && _payload_count !== void 0 ? _payload_count : 8
        })
    });
    if (!res.ok) {
        throw new Error("Brainstorm failed: ".concat(res.status));
    }
    return res.json();
}
async function generateStrategy(payload) {
    const res = await fetch('/api/v1/strategist/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pillar: 'Technical Deep-Dive',
            format: 'Text + Hook',
            tone: 'Direct & Analytical',
            targetAudience: 'Seed-Series B SaaS Founders & Staff Engineers',
            useVoiceRag: true,
            ...payload
        })
    });
    if (!res.ok) {
        throw new Error("FastAPI strategist error: ".concat(res.status));
    }
    return res.json();
}
async function fetchVoiceDocuments() {
    const res = await fetch('/api/v1/rag/documents', {
        cache: 'no-store'
    });
    if (!res.ok) {
        throw new Error("Failed to fetch RAG documents: ".concat(res.status));
    }
    return res.json();
}
async function createVoiceDocument(payload) {
    const res = await fetch('/api/v1/rag/documents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        throw new Error("Failed to create document: ".concat(res.status));
    }
    return res.json();
}
async function deleteVoiceDocument(id) {
    const res = await fetch("/api/v1/rag/documents/".concat(id), {
        method: 'DELETE'
    });
    if (!res.ok) {
        throw new Error("Failed to delete document: ".concat(res.status));
    }
    return res.json();
}
async function searchVoiceMemory(query) {
    const res = await fetch("/api/v1/rag/search?q=".concat(encodeURIComponent(query), "&top_k=3"), {
        cache: 'no-store'
    });
    if (!res.ok) {
        throw new Error("Semantic search failed: ".concat(res.status));
    }
    return res.json();
}
async function fetchPosts() {
    const res = await fetch('/api/v1/posts', {
        cache: 'no-store'
    });
    if (!res.ok) {
        throw new Error("Failed to fetch posts: ".concat(res.status));
    }
    return res.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AnalyticsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ai ml projects/viralytiq/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ai ml projects/viralytiq/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ai ml projects/viralytiq/frontend/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ai ml projects/viralytiq/frontend/src/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function AnalyticsPage() {
    _s();
    const [posts, setPosts] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const [sourceNote, setSourceNote] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "AnalyticsPage.useEffect": ()=>{
            let cancelled = false;
            ({
                "AnalyticsPage.useEffect": async ()=>{
                    const local = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadLocalPosts"])().map({
                        "AnalyticsPage.useEffect.local": (p)=>({
                                title: String(p.title || p.hook || 'Untitled').slice(0, 120),
                                viralityScore: Number(p.viralityScore) || undefined,
                                status: String(p.status || 'Draft'),
                                hook: p.hook ? String(p.hook) : undefined,
                                impressions: typeof p.impressions === 'number' ? p.impressions : undefined,
                                source: 'local'
                            })
                    }["AnalyticsPage.useEffect.local"]);
                    try {
                        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchPosts"])();
                        if (cancelled) return;
                        const apiPosts = (Array.isArray(data) ? data : []).map({
                            "AnalyticsPage.useEffect.apiPosts": (p)=>({
                                    title: String(p.title || 'Untitled'),
                                    viralityScore: typeof p.viralityScore === 'number' ? p.viralityScore : undefined,
                                    engagementRate: typeof p.engagementRate === 'number' ? p.engagementRate : undefined,
                                    impressions: typeof p.impressions === 'number' ? p.impressions : undefined,
                                    status: String(p.status || 'Draft'),
                                    hook: p.hook ? String(p.hook) : undefined,
                                    source: 'api'
                                })
                        }["AnalyticsPage.useEffect.apiPosts"]);
                        const titles = new Set(apiPosts.map({
                            "AnalyticsPage.useEffect": (p)=>p.title
                        }["AnalyticsPage.useEffect"]));
                        const merged = [
                            ...apiPosts,
                            ...local.filter({
                                "AnalyticsPage.useEffect": (p)=>p.title && !titles.has(p.title)
                            }["AnalyticsPage.useEffect"])
                        ];
                        setPosts(merged);
                        setSourceNote(apiPosts.length ? "Loaded ".concat(apiPosts.length, " post(s) from API") + (local.length ? " + ".concat(local.length, " local draft(s)") : '') : local.length ? "API returned 0 posts — showing ".concat(local.length, " local draft(s) from this browser") : 'No posts yet. Generate from Overview or Content Studio.');
                    } catch (e) {
                        if (cancelled) return;
                        setPosts(local);
                        setSourceNote(local.length ? "Could not reach /api/v1/posts — showing ".concat(local.length, " local draft(s) stored in this browser") : 'Could not load posts from API and no local drafts found. Generate content first, or start the backend.');
                    }
                }
            })["AnalyticsPage.useEffect"]();
            return ({
                "AnalyticsPage.useEffect": ()=>{
                    cancelled = true;
                }
            })["AnalyticsPage.useEffect"];
        }
    }["AnalyticsPage.useEffect"], []);
    const scored = posts.filter((p)=>typeof p.viralityScore === 'number');
    const avgVirality = scored.length > 0 ? Math.round(scored.reduce((s, p)=>s + (p.viralityScore || 0), 0) / scored.length) : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold md:text-4xl",
                        children: "Analytics"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-slate-400",
                        children: "Drafts saved by the strategist (database) plus local session drafts."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            sourceNote && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-slate-400",
                children: sourceNote
            }, void 0, false, {
                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                lineNumber: 96,
                columnNumber: 22
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-4 md:grid-cols-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-400",
                                children: "Tracked drafts"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "mt-1 text-4xl font-bold",
                                children: posts.length
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-400",
                                children: "Avg virality score"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "mt-1 text-4xl font-bold text-indigo-300",
                                children: avgVirality !== null && avgVirality !== void 0 ? avgVirality : '—'
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-400",
                                children: "From API"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "mt-1 text-4xl font-bold",
                                children: posts.filter((p)=>p.source === 'api').length
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-400",
                                children: "Local only"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "mt-1 text-4xl font-bold",
                                children: posts.filter((p)=>p.source === 'local').length
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                                lineNumber: 117,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-4 text-xl font-semibold",
                        children: "Recent drafts"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this),
                    posts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-400",
                        children: "No drafts yet. Use Overview brainstorm or Content Studio — successful API generates are written to Postgres; all generates also stash a copy in localStorage for this view."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "divide-y divide-white/10",
                        children: posts.slice(0, 20).map((p, i)=>{
                            var _p_title, _p_status;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-center justify-between gap-4 py-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "truncate font-medium",
                                                children: (_p_title = p.title) !== null && _p_title !== void 0 ? _p_title : 'Untitled'
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                                                lineNumber: 136,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-500",
                                                children: [
                                                    (_p_status = p.status) !== null && _p_status !== void 0 ? _p_status : 'Draft',
                                                    p.source ? " · ".concat(p.source) : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                                                lineNumber: 137,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                                        lineNumber: 135,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "shrink-0 text-right text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-indigo-300",
                                                children: p.viralityScore != null ? "".concat(p.viralityScore, " viral") : '—'
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                                                lineNumber: 143,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-slate-500",
                                                children: p.impressions != null ? "".concat(p.impressions.toLocaleString(), " imp") : 'draft'
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                                                lineNumber: 146,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                                        lineNumber: 142,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                                lineNumber: 134,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                        lineNumber: 132,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/analytics/page.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
_s(AnalyticsPage, "CBQ17mGXqttF1XD8SVWMWxxicB8=");
_c = AnalyticsPage;
var _c;
__turbopack_context__.k.register(_c, "AnalyticsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_ai%20ml%20projects_viralytiq_frontend_src_7f9adff6._.js.map