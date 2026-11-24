import * as React from 'react';
import { ArrowRight, Check, Copy, Flame } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { evaluateHookText } from '../../lib/viralytiq-engine';

interface HookLabViewProps {
  onSendHookToStrategist: (hookText: string) => void;
}

export function HookLabView({ onSendHookToStrategist }: HookLabViewProps) {
  const [hookInput, setHookInput] = React.useState(
    'Everyone talks about LLM reasoning.\nAlmost nobody measures retrieval tail latency.'
  );
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const result = React.useMemo(() => evaluateHookText(hookInput), [hookInput]);

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1600);
    } catch {
      setCopiedIdx(null);
    }
  };

  const dimensions = [
    { label: 'Scroll-Stop Power', score: result.scrollStopPower },
    { label: 'Curiosity Gap', score: result.curiosityGap },
    { label: 'Specificity & Proof', score: result.specificity },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">
      <Card className="xl:col-span-6">
        <CardHeader className="border-b border-white/[0.06] pb-4">
          <CardTitle>Hook Diagnostic & Fold Analyzer</CardTitle>
          <CardDescription>
            Test your opening 2 lines against LinkedIn mobile fold limits (~210 chars)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5 space-y-5">
          <div className="space-y-2">
            <label htmlFor="hook-lab-input" className="text-xs font-medium text-slate-300">
              Opening Hook Text
            </label>
            <Textarea
              id="hook-lab-input"
              rows={4}
              value={hookInput}
              onChange={(e) => setHookInput(e.target.value)}
              placeholder="Paste your LinkedIn post opening lines..."
            />
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono tabular-nums">
              <span>{result.charCount} characters · {result.lineBreakCount} line breaks</span>
              <span className={result.mobileFoldFit ? 'text-emerald-300' : 'text-amber-300'}>
                {result.mobileFoldFit ? 'Passes mobile fold' : 'Exceeds fold limit'}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-slate-400">Composite Hook Rating</span>
              <span className="font-mono text-2xl font-bold text-white tabular-nums">
                {result.overallScore}/100
              </span>
            </div>

            <div className="space-y-3">
              {dimensions.map((d) => (
                <div key={d.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{d.label}</span>
                    <span className="font-mono text-indigo-300 tabular-nums">{d.score}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/[0.07] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-300"
                      style={{ width: `${d.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-xs font-medium text-slate-400">Diagnostic Recommendations</p>
              <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                {result.feedback.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-0.5">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-6">
        <CardHeader className="border-b border-white/[0.06] pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle>High-Retention Hook Rewrites</CardTitle>
            <CardDescription>
              Four proven LinkedIn opening archetypes derived from your topic
            </CardDescription>
          </div>
          <Flame className="h-4 w-4 text-indigo-400" />
        </CardHeader>
        <CardContent className="divide-y divide-white/[0.06] p-0">
          {result.rewrites.map((rw, idx) => (
            <div key={rw.angle} className="p-5 space-y-3 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-indigo-300">{rw.angle} Angle</span>
                <span className="font-mono text-sky-300 tabular-nums">{rw.predictedLift}</span>
              </div>
              <p className="text-sm text-slate-100 whitespace-pre-line leading-relaxed">
                {rw.text}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  variant="glass"
                  size="sm"
                  onClick={() => handleCopy(rw.text, idx)}
                >
                  {copiedIdx === idx ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copiedIdx === idx ? 'Copied' : 'Copy'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onSendHookToStrategist(rw.text)}
                >
                  Use in Strategist <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
