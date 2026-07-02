import { useState } from 'react';
import { X, Bug, Camera, Send, AlertCircle } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Card } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BugReportModal({ isOpen, onClose }: BugReportModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    email: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: 'bug' as 'bug' | 'ui' | 'performance' | 'security' | 'other',
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  });
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const captureScreenshot = async () => {
    try {
      // Use html2canvas if available, otherwise prompt user
      if (typeof window !== 'undefined' && (window as any).html2canvas) {
        const canvas = await (window as any).html2canvas(document.body);
        setScreenshot(canvas.toDataURL());
      } else {
        alert('Screenshot capture requires additional setup. Please describe the issue in detail.');
      }
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      alert('Screenshot capture failed. Please describe the issue in detail.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bugReport = {
        ...formData,
        screenshot,
        timestamp: new Date().toISOString(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      };

      // Send to API endpoint
      const response = await fetch('/api/submit-bug-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bugReport),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
          setFormData({
            title: '',
            description: '',
            email: '',
            priority: 'medium',
            category: 'bug',
            url: window.location.href,
            userAgent: navigator.userAgent,
          });
          setScreenshot(null);
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Bug report submission failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-blue-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bug className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Report a Bug</h2>
                <p className="text-red-100 text-sm">Help us improve VisvasaHome</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Bug Report Submitted!</h4>
                <p className="text-sm text-green-700">Thank you for helping us improve. We'll investigate this issue.</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Submission Failed</h4>
                <p className="text-sm text-red-700">Please try again or email us at support@visvasahome.com</p>
              </div>
            </div>
          )}

          {/* Bug Title */}
          <div>
            <Label htmlFor="bug-title" className="text-gray-900 font-semibold mb-2 block">
              Bug Title *
            </Label>
            <Input
              id="bug-title"
              type="text"
              placeholder="Brief description of the issue"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-gray-900 font-semibold mb-2 block">
                Category *
              </Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="bug">🐛 Bug / Error</option>
                <option value="ui">🎨 UI / Design Issue</option>
                <option value="performance">⚡ Performance</option>
                <option value="security">🔒 Security Concern</option>
                <option value="other">📝 Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="priority" className="text-gray-900 font-semibold mb-2 block">
                Priority *
              </Label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High - Critical</option>
              </select>
              <Badge className={`mt-2 ${getPriorityColor(formData.priority)}`}>
                {formData.priority.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-gray-900 font-semibold mb-2 block">
              Detailed Description *
            </Label>
            <textarea
              id="description"
              placeholder="Please describe what happened, what you expected, and steps to reproduce..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-gray-900 font-semibold mb-2 block">
              Your Email (optional)
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">We'll update you on the fix progress</p>
          </div>

          {/* Screenshot */}
          <div>
            <Label className="text-gray-900 font-semibold mb-2 block">
              Screenshot (optional)
            </Label>
            {!screenshot ? (
              <Button
                type="button"
                variant="outline"
                onClick={captureScreenshot}
                className="w-full border-dashed border-2"
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture Screenshot
              </Button>
            ) : (
              <div className="relative">
                <img src={screenshot} alt="Screenshot" className="w-full rounded-lg border border-gray-300" />
                <button
                  type="button"
                  onClick={() => setScreenshot(null)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* System Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-700">System Information (auto-captured)</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <span className="font-semibold">URL:</span> {formData.url}
              </div>
              <div>
                <span className="font-semibold">Browser:</span> {typeof navigator !== 'undefined' ? navigator.userAgent.split(' ').pop() : ''}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Bug Report
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
