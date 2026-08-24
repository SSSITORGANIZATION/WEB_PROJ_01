import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, User, Calendar, Quote } from 'lucide-react';
import { apiService } from '../services/api';

const ScrollingReviews = ({ limit = 6 }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 2) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await apiService.getPerformanceReviews();
      const data = response.data;
      const reviewsData = Array.isArray(data) ? data : (data.results || data);

      // Filter only approved reviews for public display
      // The PerformanceReview model doesn't have a status field, so all reviews are shown
      const approvedReviews = reviewsData;

      // Find the highest rating first
      const highestRating = approvedReviews.length > 0 
        ? Math.max(...approvedReviews.map(review => review.rating))
        : 0;

      // Filter only reviews with the highest rating
      const highestRatedReviews = approvedReviews.filter(review => review.rating === highestRating);

      let finalReviews = [];

      // If highest rated reviews are less than 3, include 4 and 5 star reviews
      if (highestRatedReviews.length < 3 && highestRating >= 4) {
        // Include both 4 and 5 star reviews
        const topRatedReviews = approvedReviews.filter(review => review.rating >= 4);
        // Sort by rating first, then by date
        finalReviews = topRatedReviews.sort((a, b) => {
          if (b.rating !== a.rating) return b.rating - a.rating;
          return new Date(b.created_at) - new Date(a.created_at);
        });
      } else {
        // Sort highest rated reviews by date (newest first)
        finalReviews = highestRatedReviews.sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        );
      }

      // Always take only the first 6 reviews (latest highest-rated)
      setReviews(finalReviews.slice(0, 6));
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
            className={`w-3 h-3 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'}`}
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

  const getVisibleReviews = () => {
    if (reviews.length === 0) return [];
    if (reviews.length === 1) return [reviews[0]];
    
    const visible = [];
    for (let i = 0; i < 2; i++) {
      const index = (currentIndex + i) % reviews.length;
      visible.push(reviews[index]);
    }
    return visible;
  };

  if (loading) {
    return (
      <div className={`grid ${reviews.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
        {[...Array(reviews.length === 1 ? 1 : 2)].map((_, i) => (
          <div key={i} className="glass-card border-white/5 p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800" />
              <div className="flex-1 space-y-3">
                <div className="h-3 bg-zinc-800 rounded w-1/3" />
                <div className="h-2 bg-zinc-800 rounded w-1/2" />
                <div className="h-12 bg-zinc-800 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <Quote className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <p className="text-zinc-400">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  const visibleReviews = getVisibleReviews();

  return (
    <div className="relative">
      {/* Scrolling Reviews Container */}
      <div className={`grid ${visibleReviews.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
        {visibleReviews.map((review, index) => (
          <motion.div
            key={`${review.id}-${currentIndex}`}
            initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card border-white/5 p-6 hover:border-white/10 transition-all relative overflow-hidden"
          >
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 text-blue-500/20">
              <Quote className="w-8 h-8" />
            </div>

            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-white font-bold text-sm serif">
                      {review.reviewer_name || 'Anonymous Client'}
                    </h4>
                    {review.project_title && (
                      <p className="text-zinc-500 text-xs">
                        {review.project_title}
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
                <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3">
                  {review.feedback}
                </p>

                {/* Review Period */}
                {review.review_period && (
                  <div className="flex items-center gap-2 text-zinc-500 text-xs mt-3">
                    <Calendar className="w-3 h-3" />
                    <span>{review.review_period}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Indicators */}
      {reviews.length > 2 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {[...Array(Math.ceil(reviews.length / 2))].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i * 2)}
              className={`w-2 h-2 rounded-full transition-all ${
                Math.floor(currentIndex / 2) === i
                  ? 'bg-blue-500 w-6'
                  : 'bg-zinc-700 hover:bg-zinc-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScrollingReviews;
