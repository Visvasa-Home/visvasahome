import { useState } from 'react';
import { ArrowLeft, Search, Star, Trash2, ShieldAlert, CheckCircle, Filter, MessageCircle } from 'lucide-react';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Input } from '@shared/ui/input';

interface AdminReviewsPageProps {
  onBack: () => void;
}

interface UserReview {
  id: string;
  customerName: string;
  providerName: string;
  serviceCategory: string;
  rating: number;
  comment: string;
  date: string;
  status: 'approved' | 'flagged' | 'pending';
  isVerifiedBooking: boolean;
}

export function AdminReviewsPage({ onBack }: AdminReviewsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock Reviews Database with localStorage persistence
  const [reviews, setReviews] = useState<UserReview[]>(() => {
    const saved = localStorage.getItem('visvasahome_reviews');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'REV-001', customerName: 'Rajesh Kumar', providerName: 'Amit Sharma', serviceCategory: 'Plumbing', rating: 5, comment: 'Amit was extremely quick and professional. Fixed our tap leakage in just 10 minutes. Fully recommended!', date: '2026-05-12', status: 'approved', isVerifiedBooking: true },
      { id: 'REV-002', customerName: 'Priya Singh', providerName: 'Meera Patel', serviceCategory: 'Cleaning', rating: 4, comment: 'Cleaned the kitchen thoroughly. The only issue was she arrived about 15 minutes late, otherwise great job.', date: '2026-05-12', status: 'approved', isVerifiedBooking: true },
      { id: 'REV-003', customerName: 'Arjun Verma', providerName: 'Ravi Kumar', serviceCategory: 'AC Service', rating: 5, comment: 'Serviced my split AC. The cooling is much better now and he did not overcharge. Good service.', date: '2026-05-10', status: 'approved', isVerifiedBooking: true },
      { id: 'REV-004', customerName: 'Sanjay Dutt', providerName: 'Karan Singh', serviceCategory: 'Painting', rating: 1, comment: 'VERY BAD! He spilled paint all over my wooden floor and refused to clean it. Please block this worker!', date: '2026-05-09', status: 'flagged', isVerifiedBooking: true },
      { id: 'REV-005', customerName: 'Unknown User', providerName: 'Amit Sharma', serviceCategory: 'Plumbing', rating: 1, comment: 'Scam platform scam services! They copy data, do not book anything. Check other websites!', date: '2026-05-08', status: 'flagged', isVerifiedBooking: false },
      { id: 'REV-006', customerName: 'Kirti Sen', providerName: 'Suresh Yadav', serviceCategory: 'Electrical', rating: 3, comment: 'Average service. Fixed the switch but was charging more than the card rate card pricing.', date: '2026-05-07', status: 'pending', isVerifiedBooking: true },
    ];
  });

  const saveReviews = (updated: UserReview[]) => {
    localStorage.setItem('visvasahome_reviews', JSON.stringify(updated));
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this review? This action is irreversible.')) {
      const updated = reviews.filter(r => r.id !== id);
      setReviews(updated);
      saveReviews(updated);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: UserReview['status']) => {
    const updated = reviews.map(r => (r.id === id ? { ...r, status: newStatus } : r));
    setReviews(updated);
    saveReviews(updated);
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === 'all' || r.rating === ratingFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesRating && matchesStatus;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Reviews & Ratings Moderation</h1>
            <p className="text-sm text-gray-500">Monitor customer feedback, check verification badges, and remove fake reviews</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search comments, customers, workers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <div className="flex items-center gap-1.5 border-r border-gray-200 pr-3 mr-1">
              <span className="text-xs font-semibold text-gray-500">Stars:</span>
              {['all', 5, 4, 3, 2, 1].map(star => (
                <Button
                  key={star}
                  onClick={() => setRatingFilter(star as any)}
                  variant={ratingFilter === star ? 'default' : 'outline'}
                  className="w-8 h-8 p-0 rounded-lg text-xs"
                >
                  {star === 'all' ? 'All' : star}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-500">Status:</span>
              {['all', 'approved', 'flagged', 'pending'].map(status => (
                <Button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  className="capitalize text-xs h-8 px-2.5 rounded-lg"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.length === 0 ? (
            <Card className="col-span-2 p-12 text-center text-gray-500">
              <MessageCircle className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <p className="font-medium">No reviews found matching selection criteria.</p>
            </Card>
          ) : (
            filteredReviews.map(r => (
              <Card key={r.id} className={`p-5 relative border transition-all ${r.status === 'flagged' ? 'border-red-200 bg-red-50/10' : 'border-gray-200'}`}>
                {/* Review Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-base">{r.customerName}</span>
                      {r.isVerifiedBooking ? (
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] py-0 px-1.5">
                          Verified Booking
                        </Badge>
                      ) : (
                        <Badge className="bg-red-50 text-red-700 border-red-200 text-[10px] py-0 px-1.5">
                          Unverified/Guest
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Service: <strong>{r.serviceCategory}</strong></span>
                      <span>&bull;</span>
                      <span>Worker: <strong>{r.providerName}</strong></span>
                    </div>
                  </div>
                  <div className="text-right">
                    {renderStars(r.rating)}
                    <span className="text-[10px] text-gray-400 block mt-1">{r.date}</span>
                  </div>
                </div>

                {/* Content Comment */}
                <p className="text-gray-700 text-sm bg-gray-50/50 p-3 rounded-xl border border-gray-100/50 italic mb-4 min-h-[60px]">
                  "{r.comment}"
                </p>

                {/* Moderation Controls */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Status:</span>
                    {r.status === 'approved' && (
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    )}
                    {r.status === 'flagged' && (
                      <Badge className="bg-red-100 text-red-800 flex items-center gap-0.5"><ShieldAlert className="w-3 h-3" /> Flagged (Spam)</Badge>
                    )}
                    {r.status === 'pending' && (
                      <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {r.status !== 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(r.id, 'approved')}
                        className="h-8 text-xs border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </Button>
                    )}
                    {r.status !== 'flagged' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(r.id, 'flagged')}
                        className="h-8 text-xs border-amber-300 text-amber-700 hover:bg-amber-50 flex items-center gap-1"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" /> Flag Spam
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteReview(r.id)}
                      className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
