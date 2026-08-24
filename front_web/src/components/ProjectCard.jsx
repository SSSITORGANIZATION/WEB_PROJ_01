import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Database, Terminal } from 'lucide-react';
import { Project } from '../types';
import { motion } from 'motion/react';
import '../styles/components/ProjectCard.css';

export const ProjectCard = ({ project }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="project-card group"
    >
      <div className="project-card-image-container">
        <img
          src={project.image}
          alt={project.title}
          className="project-card-image"
          referrerPolicy="no-referrer"
        />
        <div className="project-card-image-overlay" />
      </div>

      <div className="project-card-content">
        <div className="project-card-header">
          <div className="project-card-title-section">
            <span className="project-card-category">{project.category}</span>
            <h3 className="project-card-title">{project.title}</h3>
          </div>
          <div className="project-card-arrow-button">
            <ArrowRight className="project-card-arrow-icon" />
          </div>
        </div>

        <p className="project-card-description">
          {project.description}
        </p>

        <div className="project-card-tags">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="project-card-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
