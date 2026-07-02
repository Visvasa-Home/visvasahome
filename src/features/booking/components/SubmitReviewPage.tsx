import { useState, useEffect } from 'react';
import { Star, Upload, X, CheckCircle, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { BookingService } from '@booking/services/bookingService';

interface SubmitReviewPageProps {
  bookingId: string;
  serviceName: string;
  professionalName: string;
  onBack: () => void;
  onSubmit?: (reviewData: ReviewFormData) => void;
}

interface ReviewFormData {
  rating: number;
  reviewText: string;
  images: File[];
}

export function SubmitReviewPage({
  bookingId,
  serviceName,
  professionalName,
  onBack,
  onSubmit
}: SubmitReviewPageProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    if (bookingId && bookingId !== 'VH-UNKNOWN') {
      const booking = BookingService.getBookingById(bookingId);
      const loggedInPhone = localStorage.getItem('visvasahome_user_phone');
      if (booking && loggedInPhone) {
        const cleanBookingPhone = booking.userPhone.replace(/[^\d+]/g, '');
        const cleanUserPhone = loggedInPhone.replace(/[^\d+]/g, '');
        if (cleanBookingPhone !== cleanUserPhone) {
          setIsAuthorized(false);
        }
      }
    }
  }, [bookingId]);

  const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - images.length);
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const reviewData: ReviewFormData = {
      rating,
      reviewText,
      images
    };

    onSubmit?.(reviewData);

    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your review has been submitted successfully. It will be published after verification.
          </p>
          <Button onClick={onBack} className="w-full">
            Back to Bookings
          </Button>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <Card className="p-8 max-w-sm w-full shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            You do not have permission to review this booking.
          </p>
          <Button
            onClick={onBack}
            className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md"
          >
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate Your Experience</h1>
          <p className="text-gray-600">Help others by sharing your feedback</p>
        </div>

        {/* Booking Info */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Booking ID</p>
              <p className="font-semibold text-gray-900 mb-3">{bookingId}</p>
              <p className="text-sm text-gray-500 mb-1">Service</p>
              <p className="font-semibold text-gray-900 mb-3">{serviceName}</p>
              <p className="text-sm text-gray-500 mb-1">Professional</p>
              <p className="font-semibold text-gray-900">{professionalName}</p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300 border">
              Completed
            </Badge>
          </div>
        </Card>

        {/* Review Form */}
        <form onSubmit={handleSubmit}>
          <Card className="p-6 mb-6">
            {/* Rating Section */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                How would you rate this service?
              </label>
              <div className="flex items-center justify-center gap-4 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-12 h-12 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-lg font-medium text-gray-900">
                  {ratingLabels[rating - 1]}
                </p>
              )}
            </div>

            {/* Review Text */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                Share your experience
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Tell us what you liked or what could be improved
              </p>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                {reviewText.length} / 500 characters
              </p>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                Add Photos (Optional)
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Upload up to 5 images to showcase the work done
              </p>

              {/* Uploaded Images */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              {images.length < 5 && (
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#2563EB] hover:bg-blue-50 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload images
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 10MB ({5 - images.length} remaining)
                    </p>
                  </div>
                </label>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Your review will be publicly visible and may help other
                customers make informed decisions. Reviews are moderated to ensure quality and
                authenticity.
              </p>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#2563EB] hover:bg-[#2563EB]"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>

        {/* Guidelines */}
        <Card className="p-6 mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Review Guidelines</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-[#2563EB] mt-0.5">•</span>
              <span>Be honest and objective about your experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2563EB] mt-0.5">•</span>
              <span>Focus on the service quality, professionalism, and overall satisfaction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2563EB] mt-0.5">•</span>
              <span>Avoid offensive language or personal attacks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2563EB] mt-0.5">•</span>
              <span>Include specific details that might help other customers</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
