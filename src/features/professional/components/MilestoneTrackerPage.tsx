import { useState } from 'react';
import {
  ChevronLeft, CheckCircle2, Clock, Camera, FileText, Lock, Shield,
  ChevronRight, AlertCircle, Upload, IndianRupee, CircleDot, Unlock
} from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Alert, AlertDescription } from '@shared/ui/alert';
import { Textarea } from '@shared/ui/textarea';

interface MilestoneTrackerPageProps {
  projectId: string;
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: 'locked' | 'in-progress' | 'review' | 'completed';
  completedDate?: string;
  photos: string[];
  remarks?: string;
  escrowReleased: boolean;
}

const MOCK_PROJECT = {
  id: 'REQ001',
  title: 'Full Kitchen Renovation',
  address: 'Flat 4B, Sunrise Apartments, Jaipur',
  contractorName: 'Mehta Build & Design',
  contractorPhone: '+91 94130 22456',
  totalAmount: 280000,
  escrowHeld: 196000,
  releasedAmount: 84000,
  startDate: '2026-05-01',
  estimatedEndDate: '2026-08-15',
  progress: 45,
};

const MOCK_MILESTONES: Milestone[] = [
  {
    id: 'M1',
    title: 'Site Preparation & Demolition',
    description: 'Remove old cabinets, countertops, and flooring. Clear the site for new work.',
    amount: 42000,
    status: 'completed',
    completedDate: '2026-05-18',
    photos: ['photo1.jpg', 'photo2.jpg'],
    remarks: 'Old cabinets removed. New concrete slab poured for countertop base.',
    escrowReleased: true,
  },
  {
    id: 'M2',
    title: 'Plumbing & Electrical Rough-in',
    description: 'Install new plumbing lines, electrical wiring, and concealed conduits.',
    amount: 42000,
    status: 'completed',
    completedDate: '2026-06-05',
    photos: ['photo3.jpg'],
    remarks: 'All plumbing and electrical rough-in complete. City inspection passed.',
    escrowReleased: true,
  },
  {
    id: 'M3',
    title: 'Cabinet Installation',
    description: 'Install modular kitchen cabinets (upper and lower units) as per approved design.',
    amount: 70000,
    status: 'review',
    completedDate: undefined,
    photos: ['cabinet1.jpg', 'cabinet2.jpg', 'cabinet3.jpg'],
    remarks: 'Cabinets installed. Awaiting customer approval for escrow release.',
    escrowReleased: false,
  },
  {
    id: 'M4',
    title: 'Countertop & Backsplash',
    description: 'Install granite countertop and ceramic backsplash tiles.',
    amount: 56000,
    status: 'in-progress',
    photos: [],
    remarks: undefined,
    escrowReleased: false,
  },
  {
    id: 'M5',
    title: 'Final Finishing & Handover',
    description: 'Paint touch-ups, fixtures, hardware installation, deep cleaning, and official project handover.',
    amount: 70000,
    status: 'locked',
    photos: [],
    remarks: undefined,
    escrowReleased: false,
  },
];

const statusConfig: Record<Milestone['status'], { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  locked: {
    label: 'Locked',
    color: 'text-gray-500',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: <Lock className="w-4 h-4 text-gray-400" />,
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <CircleDot className="w-4 h-4 text-blue-500 animate-pulse" />,
  },
  review: {
    label: 'Awaiting Approval',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: <Clock className="w-4 h-4 text-amber-500" />,
  },
  completed: {
    label: 'Completed',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  },
};

export const MilestoneTrackerPage = ({ projectId, onBack, onNavigate }: MilestoneTrackerPageProps) => {
  const [milestones, setMilestones] = useState<Milestone[]>(MOCK_MILESTONES);
  const [expandedId, setExpandedId] = useState<string | null>('M3'); // auto-expand the review one
  const [disputeText, setDisputeText] = useState('');
  const [actionFeedback, setActionFeedback] = useState<{ id: string; type: 'success' | 'error'; message: string } | null>(null);

  const project = MOCK_PROJECT;

  const handleApproveRelease = (milestoneId: string) => {
    setMilestones(prev =>
      prev.map(m =>
        m.id === milestoneId ? { ...m, status: 'completed', escrowReleased: true, completedDate: new Date().toISOString().split('T')[0] } : m
      )
    );
    setActionFeedback({ id: milestoneId, type: 'success', message: `₹${milestones.find(m => m.id === milestoneId)?.amount?.toLocaleString('en-IN')} escrow released to contractor successfully.` });
    setTimeout(() => setActionFeedback(null), 5000);
    setExpandedId(null);
  };

  const handleDispute = (milestoneId: string) => {
    if (!disputeText.trim()) return;
    setActionFeedback({ id: milestoneId, type: 'error', message: `Dispute raised. Our team will mediate within 24 hours. Your payment is protected.` });
    setDisputeText('');
    setTimeout(() => setActionFeedback(null), 6000);
  };

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));

  const completedAmount = milestones.filter(m => m.escrowReleased).reduce((sum, m) => sum + m.amount, 0);
  const heldAmount = milestones.filter(m => !m.escrowReleased).reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-blue-200 hover:text-white text-sm font-bold mb-5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Projects
          </button>

          <div className="flex items-start gap-3 mb-5">
            <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">{project.title}</h1>
              <p className="text-blue-200 text-xs font-semibold mt-0.5">{project.address}</p>
              <p className="text-blue-300 text-xs font-bold mt-0.5">
                Contractor: {project.contractorName}
              </p>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs font-extrabold mb-1.5 text-blue-100">
              <span>Overall Progress</span>
              <span className="text-white">{project.progress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Escrow Summary Boxes */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-white/10 rounded-2xl p-3 text-center">
              <p className="text-base font-black">₹{(project.totalAmount / 1000).toFixed(0)}K</p>
              <p className="text-[9px] text-blue-200 font-extrabold uppercase tracking-wider mt-0.5">Total Contract</p>
            </div>
            <div className="bg-emerald-500/20 border border-emerald-400/20 rounded-2xl p-3 text-center">
              <p className="text-base font-black text-emerald-300">₹{(completedAmount / 1000).toFixed(0)}K</p>
              <p className="text-[9px] text-emerald-200 font-extrabold uppercase tracking-wider mt-0.5">Released</p>
            </div>
            <div className="bg-amber-500/20 border border-amber-400/20 rounded-2xl p-3 text-center">
              <p className="text-base font-black text-amber-300">₹{(heldAmount / 1000).toFixed(0)}K</p>
              <p className="text-[9px] text-amber-200 font-extrabold uppercase tracking-wider mt-0.5">In Escrow</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Escrow Protection Notice */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-extrabold text-blue-900">Escrow-Protected Payments</p>
            <p className="text-xs text-blue-700 leading-relaxed font-semibold mt-0.5">
              Your money is held securely in escrow and only released after you approve each milestone. You are fully protected at every stage.
            </p>
          </div>
        </div>

        {/* Global Action Feedback */}
        {actionFeedback && (
          <Alert
            variant={actionFeedback.type === 'error' ? 'destructive' : 'default'}
            className={`rounded-2xl ${actionFeedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : ''}`}
          >
            {actionFeedback.type === 'success'
              ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              : <AlertCircle className="w-4 h-4" />
            }
            <AlertDescription className="font-semibold text-sm">{actionFeedback.message}</AlertDescription>
          </Alert>
        )}

        {/* Milestones */}
        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Milestone Tracker ({milestones.length} stages)</p>
        <div className="space-y-3">
          {milestones.map((milestone, idx) => {
            const cfg = statusConfig[milestone.status];
            const isExpanded = expandedId === milestone.id;

            return (
              <Card
                key={milestone.id}
                className={`rounded-3xl overflow-hidden border transition-all duration-300 shadow-sm ${cfg.border} ${cfg.bg}`}
              >
                {/* Milestone Header (always visible) */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : milestone.id)}
                  className="w-full text-left p-5 flex items-start gap-4"
                >
                  {/* Step indicator */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.status === 'completed' ? 'bg-emerald-500 text-white' :
                      milestone.status === 'review' ? 'bg-amber-500 text-white' :
                      milestone.status === 'in-progress' ? 'bg-blue-600 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {milestone.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                       milestone.status === 'locked' ? <Lock className="w-4 h-4" /> :
                       <span className="text-xs font-black">{idx + 1}</span>}
                    </div>
                    {idx < milestones.length - 1 && (
                      <div className={`w-0.5 h-4 rounded-full ${milestone.status === 'completed' ? 'bg-emerald-300' : 'bg-gray-200'}`}></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          {cfg.icon}
                          <span className={`text-[9px] font-extrabold uppercase tracking-widest ${cfg.color}`}>{cfg.label}</span>
                        </div>
                        <p className="font-extrabold text-gray-900 text-sm leading-snug">{milestone.title}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-sm text-gray-900">₹{milestone.amount.toLocaleString('en-IN')}</p>
                        {milestone.escrowReleased && (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[9px] mt-1 font-extrabold flex items-center gap-0.5 px-1.5 py-0.5">
                            <Unlock className="w-2.5 h-2.5" /> Released
                          </Badge>
                        )}
                      </div>
                    </div>
                    {milestone.completedDate && (
                      <p className="text-[10px] text-gray-400 font-bold mt-1">Completed: {formatDate(milestone.completedDate)}</p>
                    )}
                  </div>

                  <ChevronRight className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-2 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-white/60 pt-4 space-y-4">
                    <p className="text-sm text-gray-600 font-semibold leading-relaxed">{milestone.description}</p>

                    {/* Photos */}
                    {milestone.photos.length > 0 && (
                      <div>
                        <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5" /> Progress Photos ({milestone.photos.length})
                        </p>
                        <div className="flex gap-2">
                          {milestone.photos.map((photo, i) => (
                            <div
                              key={i}
                              className="w-20 h-20 bg-slate-200 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400"
                            >
                              <Camera className="w-5 h-5" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contractor Remarks */}
                    {milestone.remarks && (
                      <div className="bg-white rounded-2xl p-3 border border-white/80">
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Contractor Notes</p>
                        <p className="text-xs text-gray-700 font-semibold leading-relaxed">{milestone.remarks}</p>
                      </div>
                    )}

                    {/* Actions for Review status */}
                    {milestone.status === 'review' && !milestone.escrowReleased && (
                      <div className="space-y-3 pt-2 border-t border-white/60">
                        <p className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">
                          Review & Release Escrow Payment
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => handleApproveRelease(milestone.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl py-3 flex items-center justify-center gap-1.5"
                          >
                            <Unlock className="w-3.5 h-3.5" /> Approve & Release ₹{milestone.amount.toLocaleString('en-IN')}
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 font-extrabold text-xs rounded-xl py-3 flex items-center justify-center gap-1.5"
                            onClick={() => {}}
                          >
                            <AlertCircle className="w-3.5 h-3.5" /> Raise Dispute
                          </Button>
                        </div>

                        <Textarea
                          placeholder="Describe the issue (optional if approving, required if raising dispute)..."
                          value={disputeText}
                          onChange={e => setDisputeText(e.target.value)}
                          rows={2}
                          className="rounded-xl border-gray-200 text-xs font-semibold"
                        />
                        {disputeText && (
                          <Button
                            onClick={() => handleDispute(milestone.id)}
                            variant="destructive"
                            size="sm"
                            className="w-full font-extrabold text-xs rounded-xl"
                          >
                            Submit Dispute
                          </Button>
                        )}
                      </div>
                    )}

                    {milestone.status === 'in-progress' && (
                      <div className="flex items-center gap-2 text-xs text-blue-700 font-bold bg-blue-50 border border-blue-100 rounded-2xl px-3 py-2.5">
                        <CircleDot className="w-3.5 h-3.5 animate-pulse" />
                        Contractor is actively working on this milestone.
                      </div>
                    )}

                    {milestone.status === 'locked' && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-bold bg-gray-50 border border-gray-100 rounded-2xl px-3 py-2.5">
                        <Lock className="w-3.5 h-3.5" />
                        This milestone will unlock once the previous stage is approved.
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Contact Contractor */}
        <Card className="rounded-3xl border-gray-100 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="font-extrabold text-gray-900 text-sm">{project.contractorName}</p>
              <p className="text-xs text-gray-500 font-semibold">{project.contractorPhone}</p>
            </div>
            <a
              href={`tel:${project.contractorPhone.replace(/\s/g, '')}`}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              Contact Contractor
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
