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
"[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TracesPage
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
function TracesPage() {
    _s();
    const [at, setAt] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [traces, setTraces] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "TracesPage.useEffect": ()=>{
            var _data_traces;
            const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadLastTraces"])();
            if (data === null || data === void 0 ? void 0 : (_data_traces = data.traces) === null || _data_traces === void 0 ? void 0 : _data_traces.length) {
                setTraces(data.traces);
                setAt(data.at || null);
            }
        }
    }["TracesPage.useEffect"], []);
    const refresh = ()=>{
        var _data_traces;
        const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadLastTraces"])();
        if (data === null || data === void 0 ? void 0 : (_data_traces = data.traces) === null || _data_traces === void 0 ? void 0 : _data_traces.length) {
            setTraces(data.traces);
            setAt(data.at || null);
        } else {
            setTraces([]);
            setAt(null);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-end justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold md:text-4xl",
                                children: "Agent Traces"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-slate-400",
                                children: "Live LangGraph node timeline from your last generate / expand run in this browser (saved when Overview or Content Studio completes a strategist call)."
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: refresh,
                        className: "rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10",
                        children: "Refresh"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            at && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-slate-500",
                children: [
                    "Last run: ",
                    new Date(at).toLocaleString()
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                children: traces.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2 text-slate-400",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "No live traces yet."
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                            lineNumber: 68,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm",
                            children: [
                                "Run ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "text-slate-200",
                                    children: "Generate 8 ideas → expand"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                                    lineNumber: 70,
                                    columnNumber: 19
                                }, this),
                                " on Overview, or ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "text-slate-200",
                                    children: "Generate draft"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                                    lineNumber: 71,
                                    columnNumber: 28
                                }, this),
                                " in Content Studio. Node timings from the API response will appear here."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                            lineNumber: 69,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                    lineNumber: 67,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: traces.map((step, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-1 rounded-xl bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium text-white",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "mr-2 text-slate-500",
                                                    children: [
                                                        String(i + 1).padStart(2, '0'),
                                                        "."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                                                    lineNumber: 84,
                                                    columnNumber: 21
                                                }, this),
                                                step.label || step.nodeName || 'Node'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                                            lineNumber: 83,
                                            columnNumber: 19
                                        }, this),
                                        step.nodeName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-mono text-xs text-slate-500",
                                            children: step.nodeName
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                                            lineNumber: 90,
                                            columnNumber: 21
                                        }, this),
                                        step.model && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-slate-500",
                                            children: step.model
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                                            lineNumber: 93,
                                            columnNumber: 21
                                        }, this),
                                        step.summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-slate-400",
                                            children: step.summary
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                                            lineNumber: 96,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                                    lineNumber: 82,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "shrink-0 text-green-400",
                                    children: [
                                        step.status === 'completed' || !step.status ? '✅' : '…',
                                        ' ',
                                        typeof step.durationMs === 'number' ? "".concat((step.durationMs / 1000).toFixed(1), "s") : '—'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                                    lineNumber: 99,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, step.id || step.nodeName || i, true, {
                            fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                            lineNumber: 78,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                    lineNumber: 76,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-2 text-lg font-semibold",
                        children: "Pipeline (reference)"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ai__ml__projects$2f$viralytiq$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-slate-400",
                        children: "research_trends → retrieve_voice_rag → draft_linkedin_post → critique_and_refine. With Langfuse keys on the backend, each generate also emits a cloud trace id."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/ai ml projects/viralytiq/frontend/src/app/traces/page.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(TracesPage, "f8QPTZrXigMrmowg0/oOJI5o6M0=");
_c = TracesPage;
var _c;
__turbopack_context__.k.register(_c, "TracesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_ai%20ml%20projects_viralytiq_frontend_src_5583c61e._.js.map