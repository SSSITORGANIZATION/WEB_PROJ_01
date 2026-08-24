import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Code2, Rocket, User } from 'lucide-react';
import { motion } from 'motion/react';
import '../styles/components/DeveloperCard.css';

export const DeveloperCard = ({ developer }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="developer-card group"
    >
      <div className="developer-card-container">
        <div className="developer-card-image-wrapper">
          <img
            src={developer.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${developer.name}`}
            alt={developer.name}
            className="developer-card-image"
            referrerPolicy="no-referrer"
          />
        </div>
        {developer.is_active && (
          <div className="developer-card-star-badge">
            <Star className="developer-card-star-icon" />
          </div>
        )}
      </div>

      <div className="developer-card-content">
        <span className="developer-card-role">{developer.title}</span>
        <h3 className="developer-card-name">{developer.name}</h3>

        <p className="developer-card-description">
          {developer.bio}
        </p>

        <div className="developer-card-stats">
          <div className="developer-card-stat">
            <p className="developer-card-stat-value">{developer.skills?.split(',').length || 0}</p>
            <p className="developer-card-stat-label">Skills</p>
          </div>
          <div className="developer-card-stat">
            <p className="developer-card-stat-value">{developer.experience_years || 0}</p>
            <p className="developer-card-stat-label">Years</p>
          </div>
          <div className="developer-card-stat">
            <p className="developer-card-stat-value">4.9</p>
            <p className="developer-card-stat-label">Rating</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
