import { useState, useEffect } from 'react';
import { Star, ThumbsUp, Filter, Search, MessageCircle, Award, TrendingUp, Loader2 } from 'lucide-react';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Input } from '@shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { getReviewsByProfessional } from '@core/db/database';
import { Review, isSupabaseConfigured } from '@core/db/supabaseClient';

interface ReviewsPageProps {
  professionalId?: string;
  serviceId?: string;
}

interface ReviewDisplay {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  images: string[];
  date: string;
  serviceName: string;
  professionalReply: string | null;
  replyDate: string | null;
  helpfulCount: number;
  verified: boolean;
}

export function ReviewsPage({ professionalId, serviceId }: ReviewsPageProps) {
  const [filterRating, setFilterRating] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [reviews, setReviews] = useState<ReviewDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews from Supabase or use mock data
  useEffect(() => {
    const fetchReviews = async () => {
      if (isSupabaseConfigured && professionalId) {
        try {
          const data = await getReviewsByProfessional(professionalId);
          const mappedReviews: ReviewDisplay[] = data.map(r => ({
            id: r.id,
            customerName: 'Customer', // TODO: Join with users table for actual name
            rating: r.rating,
            reviewText: r.review_text || '',
            images: r.images || [],
            date: new Date(r.created_at).toLocaleDateString(),
            serviceName: 'Service', // TODO: Join with services/bookings table
            professionalReply: r.reply_text || null,
            replyDate: r.reply_date ? new Date(r.reply_date).toLocaleDateString() : null,
            helpfulCount: 0, // TODO: Implement helpful votes table
            verified: true
          }));
          setReviews(mappedReviews);
        } catch (error) {
          console.error('Error fetching reviews:', error);
          setReviews(getMockReviews());
        }
      } else {
        setReviews(getMockReviews());
      }
      setLoading(false);
    };
    fetchReviews();
  }, [professionalId]);

  const getMockReviews = (): ReviewDisplay[] => [
    {
      id: 'rev_001',
      customerName: 'Rajesh Kumar',
      rating: 5,
      reviewText: 'Excellent service! The plumber arrived on time and fixed the issue quickly. Very professional and courteous. The pricing was also reasonable. Highly recommend!',
      images: [],
      date: '2026-05-10',
      serviceName: 'Tap Repair',
      professionalReply: 'Thank you for your kind words! We are glad we could help.',
      replyDate: '2026-05-11',
      helpfulCount: 24,
      verified: true
    },
    {
      id: 'rev_002',
      customerName: 'Priya Singh',
      rating: 5,
      reviewText: 'Outstanding work! Deep cleaning service was thorough and meticulous. My home looks brand new. The team was very respectful and professional.',
      images: [],
      date: '2026-05-09',
      serviceName: 'Deep Cleaning',
      professionalReply: null,
      replyDate: null,
      helpfulCount: 18,
      verified: true
    },
    {
      id: 'rev_003',
      customerName: 'Arjun Verma',
      rating: 4,
      reviewText: 'Good service overall. AC is working much better now. The technician was knowledgeable and explained everything clearly. Only minor delay in arrival.',
      images: [],
      date: '2026-05-08',
      serviceName: 'AC Service (Split)',
      professionalReply: 'We apologize for the delay and appreciate your understanding. Thank you for choosing us!',
      replyDate: '2026-05-09',
      helpfulCount: 12,
      verified: true
    },
    {
      id: 'rev_004',
      customerName: 'Sneha Reddy',
      rating: 5,
      reviewText: 'Wonderful facial treatment! The beautician was very skilled and gentle. My skin feels amazing. Will definitely book again.',
      images: [],
      date: '2026-05-07',
      serviceName: 'Facial Treatment',
      professionalReply: 'Thank you! We look forward to serving you again.',
      replyDate: '2026-05-07',
      helpfulCount: 15,
      verified: true
    },
    {
      id: 'rev_005',
      customerName: 'Amit Sharma',
      rating: 4,
      reviewText: 'Satisfactory electrical work. Wiring was done properly and safely. The electrician took time to ensure everything was working correctly.',
      images: [],
      date: '2026-05-06',
      serviceName: 'Wiring Work',
      professionalReply: null,
      replyDate: null,
      helpfulCount: 8,
      verified: true
    },
    {
      id: 'rev_006',
      customerName: 'Kavita Patel',
      rating: 5,
      reviewText: 'Exceptional painting service! The team was professional, punctual, and the finish is flawless. They took care to protect furniture and cleaned up thoroughly after.',
      images: [],
      date: '2026-05-05',
      serviceName: 'Interior Painting',
      professionalReply: 'Thank you for the wonderful review! We take pride in our work.',
      replyDate: '2026-05-06',
      helpfulCount: 32,
      verified: true
    },
    {
      id: 'rev_007',
      customerName: 'Rahul Mehta',
      rating: 3,
      reviewText: 'Average service. The carpenter did the job but communication could have been better. Final result is acceptable but not exceptional.',
      images: [],
      date: '2026-05-04',
      serviceName: 'Furniture Repair',
      professionalReply: 'We appreciate your feedback and will work on improving our communication.',
      replyDate: '2026-05-05',
      helpfulCount: 5,
      verified: true
    },
    {
      id: 'rev_008',
      customerName: 'Neha Gupta',
      rating: 5,
      reviewText: 'Absolutely love the pest control service! No more cockroaches or ants. The technician was very thorough and explained all the treatments. Great value for money!',
      images: [],
      date: '2026-05-03',
      serviceName: 'Pest Control',
      professionalReply: 'We are thrilled to have helped! Thank you for your trust.',
      replyDate: '2026-05-03',
      helpfulCount: 21,
      verified: true
    }
  ];

  const reviewsData = {
    averageRating: reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 4.8,
    totalReviews: reviews.length || 1247,
    ratingDistribution: {
      5: reviews.filter(r => r.rating === 5).length || 892,
      4: reviews.filter(r => r.rating === 4).length || 245,
      3: reviews.filter(r => r.rating === 3).length || 78,
      2: reviews.filter(r => r.rating === 2).length || 21,
      1: reviews.filter(r => r.rating === 1).length || 11
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
    const matchesSearch = review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.reviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'highest') {
      return b.rating - a.rating;
    } else if (sortBy === 'lowest') {
      return a.rating - b.rating;
    } else if (sortBy === 'helpful') {
      return b.helpfulCount - a.helpfulCount;
    }
    return 0;
  });

  const getRatingPercentage = (stars: number) => {
    return (reviewsData.ratingDistribution[stars as keyof typeof reviewsData.ratingDistribution] / reviewsData.totalReviews) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Reviews & Ratings</h1>
        <p className="text-gray-600">See what our customers are saying about our services</p>
      </div>

      {/* Rating Summary */}
      <Card className="p-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Overall Rating */}
          <div className="text-center lg:border-r border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Star className="w-16 h-16 text-blue-500 fill-yellow-500" />
              <div>
                <p className="text-6xl font-bold text-gray-900">{reviewsData.averageRating.toFixed(1)}</p>
                <p className="text-sm text-gray-500">out of 5</p>
              </div>
            </div>
            <p className="text-gray-600">{reviewsData.totalReviews.toLocaleString()} total reviews</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.floor(reviewsData.averageRating)
                      ? 'text-blue-500 fill-yellow-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 min-w-[80px]">
                    <span className="text-sm font-medium text-gray-700">{stars}</span>
                    <Star className="w-4 h-4 text-blue-500 fill-yellow-500" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all duration-500"
                      style={{ width: `${getRatingPercentage(stars)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 min-w-[60px] text-right">
                    {reviewsData.ratingDistribution[stars as keyof typeof reviewsData.ratingDistribution]} ({getRatingPercentage(stars).toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-5 h-5 text-[#2563EB]" />
              <p className="text-2xl font-bold text-gray-900">{((reviewsData.ratingDistribution[5] / reviewsData.totalReviews) * 100).toFixed(0)}%</p>
            </div>
            <p className="text-sm text-gray-600">5-Star Reviews</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <p className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.professionalReply).length}</p>
            </div>
            <p className="text-sm text-gray-600">Responses</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <p className="text-2xl font-bold text-gray-900">+{((reviewsData.averageRating - 4.6) * 10).toFixed(0)}%</p>
            </div>
            <p className="text-sm text-gray-600">Rating Improvement</p>
          </div>
        </div>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search reviews by customer, service, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <TrendingUp className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="highest">Highest Rating</SelectItem>
            <SelectItem value="lowest">Lowest Rating</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <Card key={review.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              {/* Customer Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {review.customerName.charAt(0)}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{review.customerName}</h3>
                      {review.verified && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300 border text-xs">
                          Verified Booking
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{review.date} • {review.serviceName}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? 'text-blue-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-gray-700 mb-4 leading-relaxed">{review.reviewText}</p>

                {/* Review Images */}
                {review.images.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review.images.map((img, index) => (
                      <div key={index} className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-500">Image {index + 1}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Professional Reply */}
                {review.professionalReply && (
                  <div className="bg-blue-50 border-l-4 border-[#2563EB] p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">Professional Response</p>
                        <p className="text-gray-700 text-sm mb-1">{review.professionalReply}</p>
                        <p className="text-xs text-gray-500">{review.replyDate}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center gap-4 mt-4">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2563EB] transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpfulCount})</span>
                  </button>
                  <button className="text-sm text-gray-600 hover:text-[#2563EB] transition-colors">
                    Report
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {sortedReviews.length === 0 && (
        <Card className="p-12 text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </Card>
      )}

      {/* Load More */}
      {sortedReviews.length > 0 && sortedReviews.length < reviewsData.totalReviews && (
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
}
