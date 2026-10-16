import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  Building,
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSubmitStatus('');

    try {
      const response = await fetch(
        'http://localhost:8000/contact-messages/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setSubmitStatus(
          "Thank you for your message! We'll get back to you within 24 hours."
        );

        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        let errorData = {};

        try {
          errorData = await response.json();
        } catch {
          // Keep the default error message if the response is not JSON.
        }

        setError(
          errorData.detail ||
            'Failed to send message. Please try again.'
        );
      }
    } catch (err) {
      setError(
        'Network error. Please check your connection and try again.'
      );
      console.error('Error submitting contact form:', err);
    } finally {
      setIsSubmitting(false);

      setTimeout(() => {
        setSubmitStatus('');
        setError('');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative mx-auto w-[90%] max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">
              Let's Build Together
            </h1>

            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-blue-100 md:text-base">
              Have an idea, a project, or a business challenge?
              Tell us about it and let's explore how SA can help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-12">
        <div className="mx-auto w-[90%] max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>

              <h3 className="mb-2 text-base font-semibold text-gray-900">
                Email Us
              </h3>

              <p className="mb-3 text-sm text-gray-600">
                Let's talk about your idea.
              </p>

              <a
                href="mailto:saisoftwaresolutions99@gmail.com"
                className="break-all text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
              >
                saisoftwaresolutions99@gmail.com
              </a>
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-green-100">
                <Phone className="h-5 w-5 text-green-600" />
              </div>

              <h3 className="mb-2 text-base font-semibold text-gray-900">
                Call Us
              </h3>

              <p className="mb-3 text-sm text-gray-600">
                Have a project to discuss?
              </p>

              <a
                href="tel:+917032703253"
                className="text-sm font-medium text-green-600 transition-colors hover:text-green-700"
              >
                +91 70327 03253
              </a>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-purple-100">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>

              <h3 className="mb-2 text-base font-semibold text-gray-900">
                Visit Us
              </h3>

              <p className="mb-3 text-sm text-gray-600">
                Come say hello at our office.
              </p>

              <p className="text-sm font-medium leading-relaxed text-purple-600">
                Hyderabad, Telangana,
                <br />
                India
              </p>
            </motion.div>
          </div>

          {/* Contact Form and Additional Information */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-md"
            >
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Tell Us About Your Idea
              </h2>

              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                Tell us a little about what you're looking to build.
                Whether you have a clear plan or just an idea, we'll
                be happy to hear from you.
              </p>

              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {submitStatus && (
                <div
                  role="status"
                  className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
                >
                  {submitStatus}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1 block text-xs font-medium text-gray-700"
                    >
                      Your Name *
                    </label>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition-all placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-xs font-medium text-gray-700"
                    >
                      Your Email *
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition-all placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1 block text-xs font-medium text-gray-700"
                  >
                    Subject *
                  </label>

                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition-all placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1 block text-xs font-medium text-gray-700"
                  >
                    Message *
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition-all placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Office Hours and Other Ways to Connect */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6"
            >
            
              {/* Other Ways to Connect */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                    <MessageSquare className="h-5 w-5 text-indigo-600" />
                  </div>

                  <h3 className="text-base font-semibold text-gray-900">
                    Other Ways to Connect
                  </h3>
                </div>

                <div className="space-y-4">
                  <a
                    href="mailto:saisoftwaresolutions99@gmail.com"
                    className="flex items-center gap-3 text-sm text-gray-600 transition-colors hover:text-blue-600"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email our support team</span>
                  </a>

                  <Link
                    to="/book-demo"
                    className="flex items-center gap-3 text-sm text-gray-600 transition-colors hover:text-blue-600"
                  >
                    <Building className="h-4 w-4" />
                    <span>Schedule a Meeting</span>
                  </Link>
                </div>
              </div>

              {/* Map Link */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Hyderabad%2C+Telangana%2C+India"
                target="_blank"
                rel="noopener noreferrer"
                className="block h-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-xl"
                aria-label="Open Hyderabad, Telangana in Google Maps"
              >
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-3 h-10 w-10 text-purple-500" />
                    <p className="text-sm font-medium text-gray-700">
                      View Our Location
                    </p>
                    <p className="text-xs text-gray-500">
                      Hyderabad, Telangana, India
                    </p>
                  </div>
                </div>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-white py-12">
        <div className="mx-auto w-[90%] max-w-7xl px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-10 text-center"
          >
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>

            <p className="text-sm text-gray-600">
              Quick answers to common questions.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="rounded-xl border border-gray-200 bg-gray-50 p-6"
            >
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                What are your business hours?
              </h3>

              <p className="text-sm leading-relaxed text-gray-600">
                We're open Monday through Friday from 9 AM to 6 PM,
                and Saturday from 10 AM to 4 PM. We're closed on Sundays.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="rounded-xl border border-gray-200 bg-gray-50 p-6"
            >
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                How quickly will you respond?
              </h3>

              <p className="text-sm leading-relaxed text-gray-600">
                We typically respond to all inquiries within 24 hours
                during business days. For urgent matters, please call us
                directly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="rounded-xl border border-gray-200 bg-gray-50 p-6"
            >
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                Do you offer consultations?
              </h3>

              <p className="text-sm leading-relaxed text-gray-600">
                Yes! We offer free 30-minute consultations for new clients.
                Use the form to schedule a time that works for you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="rounded-xl border border-gray-200 bg-gray-50 p-6"
            >
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                What services do you offer?
              </h3>

              <p className="text-sm leading-relaxed text-gray-600">
                We offer comprehensive software development services,
                including custom web applications, enterprise software
                solutions, cloud services, mobile apps, and maintenance
                support.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
