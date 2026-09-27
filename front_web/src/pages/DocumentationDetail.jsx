import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, Calendar, Clock, Tag,
  ArrowRight, BookOpen, FileText,
  Lightbulb, Shield, X
} from 'lucide-react';

const DocumentationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [relatedDocs, setRelatedDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bookmarkedDocs') || '[]').includes(id);
    } catch {
      return false;
    }
  });
  const [statusMessage, setStatusMessage] = useState('');

  // Mock documentation data (same as Documentation page)
  const mockDocs = [
    {
      id: '1',
      title: 'Getting Started with DevHub',
      content: 'Learn the basics of DevHub platform, including setup, configuration, and your first project. This comprehensive guide covers everything from account creation to deploying your first application.',
      category: 'Getting Started',
      fullContent: `# Getting Started with DevHub

Welcome to DevHub! This guide will help you get started with our platform.

## Account Setup

1. Create your account by clicking the "Sign Up" button
2. Verify your email address
3. Complete your profile setup

## First Project

After logging in, you can create your first project:

1. Navigate to the Projects section
2. Click "Create New Project"
3. Fill in the project details
4. Invite team members if needed

## Configuration

Configure your project settings:
- Set up build scripts
- Configure environment variables
- Set up deployment pipelines

## Next Steps

- Explore our API documentation
- Check out integration guides
- Join our community forum`
    },
    {
      id: '2',
      title: 'API Reference Overview',
      content: 'Complete API documentation including endpoints, authentication, request/response formats, rate limiting, and best practices for integration with external services.',
      category: 'API Reference',
      fullContent: `# API Reference Overview

Our API provides comprehensive access to DevHub platform features.

## Authentication

All API requests require authentication using your API key.

\`\`\`bash
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Base URL

\`\`\`
https://api.devhub.com/v1
\`\`\`

## Rate Limiting

- Free tier: 100 requests/minute
- Pro tier: 1000 requests/minute
- Enterprise: Custom limits

## Common Endpoints

### Projects
- \`GET /projects\` - List all projects
- \`POST /projects\` - Create new project
- \`GET /projects/:id\` - Get project details
- \`PUT /projects/:id\` - Update project
- \`DELETE /projects/:id\` - Delete project

### Resources
- \`GET /resources\` - List resources
- \`POST /resources\` - Create resource
- \`GET /resources/:id\` - Get resource details

## Error Handling

All errors return a standard format:

\`\`\`json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
\`\`\``
    },
    {
      id: '3',
      title: 'Frontend Development Guidelines',
      content: 'Standards and best practices for frontend development including React patterns, styling guidelines, component architecture, and performance optimization techniques.',
      category: 'Frontend',
      fullContent: `# Frontend Development Guidelines

Follow these guidelines for consistent, high-quality frontend development.

## Code Standards

### React Best Practices
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for type safety
- Follow the official React documentation

### Styling
- Use Tailwind CSS for styling
- Follow the design system
- Ensure responsive design
- Test on multiple devices

## Component Architecture

### Structure
\`\`\`
src/
  components/
    common/
    layout/
  pages/
  services/
  utils/
\`\`\`

### Naming Conventions
- Components: PascalCase
- Files: kebab-case
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE

## Performance

### Optimization Tips
- Code splitting with React.lazy
- Memoization with React.memo
- Virtual scrolling for long lists
- Image optimization
- Bundle size optimization

## Testing

- Unit tests with Jest
- Integration tests with React Testing Library
- E2E tests with Cypress`
    },
    {
      id: '4',
      title: 'Backend Architecture',
      content: 'Understanding the backend architecture including microservices, database design, API gateway patterns, and scalability considerations for enterprise applications.',
      category: 'Backend',
      fullContent: `# Backend Architecture

Our backend follows a microservices architecture for scalability and maintainability.

## Architecture Overview

### Components
- API Gateway
- Microservices
- Database Layer
- Cache Layer
- Message Queue

### Technology Stack
- Language: Python/Django
- Database: PostgreSQL
- Cache: Redis
- Queue: Celery/RabbitMQ

## Database Design

### Schema Design
- Normalized tables
- Proper indexing
- Foreign key relationships
- Data integrity constraints

### Performance
- Query optimization
- Connection pooling
- Read replicas
- Database sharding

## API Design

### RESTful Principles
- Proper HTTP methods
- Resource-based URLs
- Status codes
- Versioning

### Security
- Authentication
- Authorization
- Rate limiting
- Input validation
- SQL injection prevention

## Scalability

### Horizontal Scaling
- Load balancing
- Auto-scaling
- Container orchestration
- Service discovery

### Vertical Scaling
- Resource optimization
- Caching strategies
- Database tuning`
    },
    {
      id: '5',
      title: 'Deployment Strategies',
      content: 'Learn about different deployment strategies including CI/CD pipelines, container orchestration, blue-green deployments, and monitoring best practices.',
      category: 'Deployment',
      fullContent: `# Deployment Strategies

Choose the right deployment strategy for your application.

## CI/CD Pipeline

### Stages
1. Code Analysis
2. Build
3. Test
4. Deploy

### Tools
- GitHub Actions
- GitLab CI
- Jenkins
- CircleCI

## Deployment Methods

### Blue-Green Deployment
- Zero downtime
- Easy rollback
- Resource intensive

### Canary Deployment
- Gradual rollout
- Risk mitigation
- Complex setup

### Rolling Deployment
- Resource efficient
- Simple setup
- Potential issues during rollout

## Container Orchestration

### Docker
- Containerize applications
- Consistent environments
- Easy scaling

### Kubernetes
- Container orchestration
- Auto-scaling
- Service discovery
- Load balancing

## Monitoring

### Metrics
- Application performance
- Resource usage
- Error rates
- User behavior

### Tools
- Prometheus
- Grafana
- ELK Stack
- DataDog`
    },
    {
      id: '6',
      title: 'Security Best Practices',
      content: 'Comprehensive security guide covering authentication, authorization, data encryption, vulnerability scanning, and compliance requirements for modern applications.',
      category: 'Security',
      fullContent: `# Security Best Practices

Protect your application with these security measures.

## Authentication

### Methods
- JWT tokens
- OAuth 2.0
- Multi-factor authentication
- Session management

### Best Practices
- Use strong passwords
- Implement rate limiting
- Secure token storage
- Regular token rotation

## Authorization

### Access Control
- Role-based access control (RBAC)
- Attribute-based access control (ABAC)
- Principle of least privilege
- Regular access reviews

## Data Protection

### Encryption
- Data at rest encryption
- Data in transit encryption
- Key management
- Secure key storage

### Data Privacy
- GDPR compliance
- Data minimization
- User consent
- Right to be forgotten

## Vulnerability Management

### Scanning
- Regular security scans
- Dependency vulnerability checks
- Code analysis
- Penetration testing

### Patching
- Regular updates
- Security patches
- Incident response
- Vulnerability disclosure

## Compliance

### Standards
- SOC 2
- ISO 27001
- PCI DSS
- HIPAA

### Audits
- Regular security audits
- Compliance assessments
- Documentation
- Training`
    }
  ];

  useEffect(() => {
    const fetchDocData = async () => {
      if (!id) {
        return;
      }
      try {
        const foundDoc = mockDocs.find(d => d.id === id);

        if (foundDoc) {
          setDoc(foundDoc);
          setSaved(() => {
            try {
              return JSON.parse(localStorage.getItem('bookmarkedDocs') || '[]').includes(id);
            } catch {
              return false;
            }
          });

          const related = mockDocs
            .filter(d => d.category === foundDoc.category && d.id !== id)
            .slice(0, 3);
          setRelatedDocs(related);
        } else {
          navigate('/documentation');
        }
      } catch (error) {
        console.error('Error fetching documentation:', error);
        navigate('/documentation');
      } finally {
        setLoading(false);
      }
    };

    fetchDocData();
  }, [id, navigate]);

  const toggleBookmark = () => {
    try {
      const current = JSON.parse(localStorage.getItem('bookmarkedDocs') || '[]');
      const next = current.includes(id)
        ? current.filter((docId) => docId !== id)
        : [...current, id];

      localStorage.setItem('bookmarkedDocs', JSON.stringify(next));
      setSaved(current.includes(id) ? false : true);
      setStatusMessage(current.includes(id) ? 'Bookmark removed.' : 'Documentation saved.');
    } catch (error) {
      console.error('Bookmark update failed:', error);
      setStatusMessage('Unable to save this guide right now.');
    }
  };

  const shareDoc = async () => {
    if (!doc) return;

    const shareUrl = `${window.location.origin}/documentation/${doc.id}`;
    const shareText = `Check out "${doc.title}" in DevForge documentation.`;

    try {
      if (navigator.share) {
        await navigator.share({ title: doc.title, text: shareText, url: shareUrl });
        setStatusMessage('Share sheet opened.');
        return;
      }

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      } else {
        const tempInput = document.createElement('textarea');
        tempInput.value = `${shareText} ${shareUrl}`;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      setStatusMessage('Link copied to clipboard.');
    } catch (error) {
      console.error('Share failed:', error);
      setStatusMessage('Unable to share this guide right now.');
    }
  };

  const printDoc = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Documentation not found</h2>
          <Link to="/documentation" className="text-blue-600 hover:text-blue-700">
            Back to Documentation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link
            to="/documentation"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Documentation</span>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
              {doc.category}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{doc.title}</h1>
          <p className="text-blue-100">{doc.content}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <div className="prose prose-blue max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                  {doc.fullContent || doc.content}
                </pre>
              </div>

              {/* Metadata */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: 2 days ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={toggleBookmark}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${saved ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <BookOpen className="w-4 h-4" />
                  {saved ? 'Saved to bookmarks' : 'Bookmark this guide'}
                </button>
                <button
                  type="button"
                  onClick={shareDoc}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  Share with team
                </button>
                <button
                  type="button"
                  onClick={printDoc}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Tag className="w-4 h-4" />
                  Print version
                </button>
              </div>
              {statusMessage && (
                <p className="mt-3 text-xs text-blue-600">{statusMessage}</p>
              )}
            </div>

            {/* Related Documentation */}
            {relatedDocs.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Related Guides</h3>
                <div className="space-y-3">
                  {relatedDocs.map((relatedDoc) => (
                    <Link
                      key={relatedDoc.id}
                      to={`/documentation/${relatedDoc.id}`}
                      className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {relatedDoc.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{relatedDoc.category}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Need Help */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
              <Shield className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our engineering team is available 24/7 for enterprise support.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Contact Support <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationDetail;