import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { Star, Calendar, Filter, Quote, ArrowUpRight } from "lucide-react";

const API = "http://localhost:8000/performance-reviews/";
const PROJECTS_API = "http://localhost:8000/projects/";

export default function PublicReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("relevant");
  const [displayedReviews, setDisplayedReviews] = useState(6);
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const initialReviewsCount = 6;

  /* ================= FETCH REVIEWS ================= */
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(API);
        // Enhance reviews with project titles
        const enhancedReviews = await Promise.all(
          res.data.map(async (review) => {
            if (review.project) {
              try {
                const projectRes = await axios.get(`${PROJECTS_API}${review.project}/`);
                return {
                  ...review,
                  project_title: projectRes.data.title || `Project #${review.project}`
                };
              } catch (err) {
                return {
                  ...review,
                  project_title: `Project #${review.project}`
                };
              }
            }
            return review;
          })
        );
        setReviews(enhancedReviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  /* Reset displayed reviews when filter changes */
  useEffect(() => {
    setDisplayedReviews(initialReviewsCount);
  }, [activeFilter]);

  /* ================= SORTING ================= */
  const sortedReviews = useMemo(() => {
    const arr = [...reviews];

    switch (activeFilter) {
      case "newest":
        return arr.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      case "highest":
        return arr.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return arr.sort((a, b) => a.rating - b.rating);
      default:
        return arr.sort((a, b) => {
          if (b.rating !== a.rating) return b.rating - a.rating;
          return new Date(b.created_at) - new Date(a.created_at);
        });
    }
  }, [reviews, activeFilter]);

  /* ================= LOAD MORE FUNCTIONALITY ================= */
  const currentReviews = sortedReviews.slice(0, displayedReviews);
  const hasMoreReviews = sortedReviews.length > displayedReviews;

  const handleLoadMore = () => {
    setDisplayedReviews(prev => Math.min(prev + initialReviewsCount, sortedReviews.length));
  };

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const isReviewLong = (text) => {
    return text.length > 150;
  };

  const renderStars = (count) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < count
            ? 'text-yellow-500 fill-yellow-500'
            : 'text-zinc-600'
            }`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
            <div className="mx-auto flex max-w-4xl items-center justify-center gap-4 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200/30 border-t-white" />
              <p className="text-lg text-blue-100">Loading client reviews...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const average =
    reviews.length > 0
      ? (
        reviews.reduce((sum, r) => sum + r.rating, 0) /
        reviews.length
      ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              Client Reviews
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-blue-100 md:text-2xl">
              See what our clients say about working with us and the products we build together.
            </p>
            <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
              <div className="flex items-center gap-3 text-lg text-blue-100">
                <Star className="h-6 w-6 fill-yellow-300 text-yellow-300" />
                <span>{average} Average Rating</span>
              </div>
              <div className="hidden h-6 w-px bg-blue-300/50 sm:block" />
              <div className="text-lg text-blue-100">
                {reviews.length} {reviews.length === 1 ? 'Published Review' : 'Published Reviews'}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">What Our Clients Say</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Explore feedback from the teams and people who trusted us with their ideas.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-3"
        >
          <div className="mr-1 flex items-center gap-2 text-sm font-medium text-gray-600">
            <Filter className="h-4 w-4 text-blue-600" />
            Sort by
          </div>
          {[
            ["relevant", "Most Relevant"],
            ["newest", "Newest First"],
            ["highest", "Highest Rated"],
            ["lowest", "Lowest Rated"],
          ].map(([key, label]) => (
            <motion.button
              key={key}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveFilter(key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeFilter === key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 shadow-sm hover:bg-blue-50 hover:text-blue-700"
                }`}
            >
              {label}
            </motion.button>
          ))}
        </motion.div>

        {/* Reviews Grid */}
        {sortedReviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-gray-200 bg-white py-20 text-center shadow-sm"
          >
            <Quote className="mx-auto mb-4 h-8 w-8 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No Reviews Yet</h3>
            <p className="text-sm text-gray-600">Be the first to share your experience.</p>
          </motion.div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {currentReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className={`group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md ${index === 0 ? 'md:col-span-2' : ''}`}
              >
                {/* Card Content */}
                <div className="relative flex h-full flex-col">
                  {/* Rating Badge */}
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-xs font-semibold text-gray-700">
                        {review.rating}.0
                      </span>
                    </div>
                    {review.review_period && (
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        {review.review_period}
                      </div>
                    )}
                  </div>

                  {/* Reviewer Info */}
                  <div className="mb-5">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                        <span className="text-lg font-semibold text-blue-600">
                          {review.reviewer_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold leading-tight text-gray-900">
                          {review.reviewer_name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="mb-6 flex-grow overflow-hidden">
                    <div className="flex gap-4">
                      {index === 0 && <Quote className="mt-1 hidden h-8 w-8 shrink-0 text-blue-200 sm:block" />}
                      <p className={`${index === 0 ? 'text-xl leading-8 sm:max-w-3xl' : 'text-sm leading-7'} text-gray-600`}>
                        {isReviewLong(review.feedback) ? (
                          <>
                            {expandedReviews.has(review.id)
                              ? review.feedback
                              : `${review.feedback.substring(0, 150)}...`
                            }
                            <motion.button
                              onClick={() => toggleReviewExpansion(review.id)}
                              className="ml-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {expandedReviews.has(review.id) ? 'Read Less' : 'Read More'}
                            </motion.button>
                          </>
                        ) : (
                          review.feedback
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <span className="text-xs text-gray-500">Project:</span>
                      <span className="truncate text-xs font-medium text-gray-700" title={review.project_title}>
                        {review.project_title}
                      </span>
                      <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-blue-600" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMoreReviews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoadMore}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Load More Reviews
            </motion.button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
