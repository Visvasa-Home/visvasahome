import { useState } from 'react';
import { X, MessageSquare, Star, Send, AlertCircle, ThumbsUp } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Card } from '@shared/ui/card';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    category: 'general' as 'general' | 'feature' | 'improvement' | 'complaint' | 'appreciation',
    message: '',
    url: window.location.href,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const feedback = {
        ...formData,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
          setFormData({
            name: '',
            email: '',
            rating: 0,
            category: 'general',
            message: '',
            url: window.location.href,
          });
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Feedback submission failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryIcons = {
    general: '💬',
    feature: '✨',
    improvement: '🚀',
    complaint: '⚠️',
    appreciation: '💙',
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2563EB] to-purple-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Share Your Feedback</h2>
                <p className="text-blue-100 text-sm">We value your opinion!</p>
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
              <ThumbsUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Feedback Received!</h4>
                <p className="text-sm text-green-700">Thank you for helping us improve VisvasaHome.</p>
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

          {/* Rating */}
          <div>
            <Label className="text-gray-900 font-semibold mb-3 block">
              How would you rate your experience? *
            </Label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= formData.rating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {formData.rating > 0 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                {formData.rating === 5 && '⭐ Excellent!'}
                {formData.rating === 4 && '😊 Great!'}
                {formData.rating === 3 && '👍 Good'}
                {formData.rating === 2 && '😐 Okay'}
                {formData.rating === 1 && '😞 Poor'}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-gray-900 font-semibold mb-2 block">
              What is this feedback about? *
            </Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              required
            >
              <option value="general">{categoryIcons.general} General Feedback</option>
              <option value="feature">{categoryIcons.feature} Feature Request</option>
              <option value="improvement">{categoryIcons.improvement} Improvement Suggestion</option>
              <option value="complaint">{categoryIcons.complaint} Complaint</option>
              <option value="appreciation">{categoryIcons.appreciation} Appreciation</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message" className="text-gray-900 font-semibold mb-2 block">
              Your Feedback *
            </Label>
            <textarea
              id="message"
              placeholder="Tell us what you think..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
            />
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-gray-900 font-semibold mb-2 block">
              Your Name (optional)
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full"
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
            <p className="text-xs text-gray-500 mt-1">We'll reach out if we need more information</p>
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
              className="flex-1 bg-[#2563EB] hover:bg-[#2563EB]"
              disabled={isSubmitting || formData.rating === 0}
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
