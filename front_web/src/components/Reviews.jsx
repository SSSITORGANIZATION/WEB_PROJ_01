import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, MessageSquare, Calendar, User, ThumbsUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api';
import ReviewForm from './ReviewForm';

const Reviews = ({ projectId = null, showForm = true, limit = null }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const reviewsPerPage = 6;

  useEffect(() => {
    fetchReviews();
  }, [projectId, currentPage]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await apiService.getPerformanceReviews(projectId);
      const data = response.data;
      const reviewsData = Array.isArray(data) ? data : (data.results || data);

      // Filter only approved reviews for public display
      // The PerformanceReview model doesn't have a status field, so all reviews are shown
      const approvedReviews = reviewsData;

      // Sort by most recent
      const sortedReviews = approvedReviews.sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      );

      if (limit) {
        setReviews(sortedReviews.slice(0, limit));
        setTotalPages(1);
      } else {
        const startIndex = (currentPage - 1) * reviewsPerPage;
        const endIndex = startIndex + reviewsPerPage;
        setReviews(sortedReviews.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(sortedReviews.length / reviewsPerPage));
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'
              }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card border-white/5 p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-zinc-800 rounded w-1/3" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
                <div className="h-16 bg-zinc-800 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white serif mb-2">
          Client <span className="italic text-blue-500">Reviews</span>
        </h2>
        <p className="text-zinc-400">
          See what our clients say about our work
        </p>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card border-white/5 p-6 hover:border-white/10 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-bold serif">
                        {review.reviewer_name || 'Anonymous Client'}
                      </h4>
                      {review.project_title && (
                        <p className="text-zinc-500 text-sm">
                          Reviewed: {review.project_title}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {renderStars(review.rating)}
                      <p className="text-zinc-500 text-xs mt-1">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-zinc-300 leading-relaxed mb-4">
                    {review.feedback}
                  </p>

                  {/* Review Period */}
                  {review.review_period && (
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Period: {review.review_period}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!limit && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add Review Button */}
      {showForm && (
        <div className="text-center">
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-all transform hover:scale-105"
          >
            Leave a Review
          </button>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          projectId={projectId}
          onClose={() => setShowReviewForm(false)}
          onSubmit={fetchReviews}
        />
      )}
    </div>
  );
};

export default Reviews;
