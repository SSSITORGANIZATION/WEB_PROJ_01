import{d as N,u as D,r,j as e,F as x,L as c,S as y,B as k,A as P}from"./index-BXjZe_Cc.js";import{A}from"./arrow-left-CYHojvBr.js";import{C as R}from"./clock-gOMqfqZC.js";import{L as E}from"./lightbulb-Cg0_FOqS.js";import{T as I}from"./tag-D3kePJ1u.js";const U=()=>{const{id:i}=N(),l=D(),[n,b]=r.useState(null),[d,f]=r.useState([]),[v,j]=r.useState(!0),[u,m]=r.useState(()=>{try{return JSON.parse(localStorage.getItem("bookmarkedDocs")||"[]").includes(i)}catch{return!1}}),[g,o]=r.useState(""),p=[{id:"1",title:"Getting Started with DevHub",content:"Learn the basics of DevHub platform, including setup, configuration, and your first project. This comprehensive guide covers everything from account creation to deploying your first application.",category:"Getting Started",fullContent:`# Getting Started with DevHub

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
- Join our community forum`},{id:"2",title:"API Reference Overview",content:"Complete API documentation including endpoints, authentication, request/response formats, rate limiting, and best practices for integration with external services.",category:"API Reference",fullContent:`# API Reference Overview

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
\`\`\``},{id:"3",title:"Frontend Development Guidelines",content:"Standards and best practices for frontend development including React patterns, styling guidelines, component architecture, and performance optimization techniques.",category:"Frontend",fullContent:`# Frontend Development Guidelines

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
- E2E tests with Cypress`},{id:"4",title:"Backend Architecture",content:"Understanding the backend architecture including microservices, database design, API gateway patterns, and scalability considerations for enterprise applications.",category:"Backend",fullContent:`# Backend Architecture

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
- Database tuning`},{id:"5",title:"Deployment Strategies",content:"Learn about different deployment strategies including CI/CD pipelines, container orchestration, blue-green deployments, and monitoring best practices.",category:"Deployment",fullContent:`# Deployment Strategies

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
- DataDog`},{id:"6",title:"Security Best Practices",content:"Comprehensive security guide covering authentication, authorization, data encryption, vulnerability scanning, and compliance requirements for modern applications.",category:"Security",fullContent:`# Security Best Practices

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
- Training`}];r.useEffect(()=>{(async()=>{if(i)try{const a=p.find(s=>s.id===i);if(a){b(a),m(()=>{try{return JSON.parse(localStorage.getItem("bookmarkedDocs")||"[]").includes(i)}catch{return!1}});const s=p.filter(h=>h.category===a.category&&h.id!==i).slice(0,3);f(s)}else l("/documentation")}catch(a){console.error("Error fetching documentation:",a),l("/documentation")}finally{j(!1)}})()},[i,l]);const C=()=>{try{const t=JSON.parse(localStorage.getItem("bookmarkedDocs")||"[]"),a=t.includes(i)?t.filter(s=>s!==i):[...t,i];localStorage.setItem("bookmarkedDocs",JSON.stringify(a)),m(!t.includes(i)),o(t.includes(i)?"Bookmark removed.":"Documentation saved.")}catch(t){console.error("Bookmark update failed:",t),o("Unable to save this guide right now.")}},S=async()=>{if(!n)return;const t=`${window.location.origin}/documentation/${n.id}`,a=`Check out "${n.title}" in DevForge documentation.`;try{if(navigator.share){await navigator.share({title:n.title,text:a,url:t}),o("Share sheet opened.");return}if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(`${a} ${t}`);else{const s=document.createElement("textarea");s.value=`${a} ${t}`,document.body.appendChild(s),s.select(),document.execCommand("copy"),document.body.removeChild(s)}o("Link copied to clipboard.")}catch(s){console.error("Share failed:",s),o("Unable to share this guide right now.")}},w=()=>{window.print()};return v?e.jsx("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:e.jsx("div",{className:"w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"})}):n?e.jsxs("div",{className:"min-h-screen bg-gray-50",children:[e.jsx("div",{className:"bg-gradient-to-r from-blue-600 to-indigo-700 text-white",children:e.jsxs("div",{className:"max-w-7xl mx-auto px-6 py-8",children:[e.jsxs(c,{to:"/documentation",className:"inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-6",children:[e.jsx(A,{className:"w-4 h-4"}),e.jsx("span",{className:"text-sm",children:"Back to Documentation"})]}),e.jsx("div",{className:"flex items-center gap-3 mb-2",children:e.jsx("span",{className:"px-3 py-1 bg-white/20 rounded-full text-xs font-medium",children:n.category})}),e.jsx("h1",{className:"text-3xl font-bold mb-2",children:n.title}),e.jsx("p",{className:"text-blue-100",children:n.content})]})}),e.jsx("div",{className:"max-w-7xl mx-auto px-6 py-12",children:e.jsxs("div",{className:"grid lg:grid-cols-3 gap-8",children:[e.jsx("div",{className:"lg:col-span-2",children:e.jsxs("div",{className:"bg-white rounded-xl border border-gray-200 p-8 shadow-sm",children:[e.jsx("div",{className:"prose prose-blue max-w-none",children:e.jsx("pre",{className:"whitespace-pre-wrap font-sans text-gray-700 leading-relaxed",children:n.fullContent||n.content})}),e.jsx("div",{className:"mt-8 pt-6 border-t border-gray-200",children:e.jsxs("div",{className:"flex items-center gap-6 text-sm text-gray-600",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(R,{className:"w-4 h-4"}),e.jsx("span",{children:"Last updated: 2 days ago"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(y,{className:"w-4 h-4"}),e.jsx("span",{children:"Verified"})]})]})})]})}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-xl border border-gray-200 p-6 shadow-sm",children:[e.jsx("h3",{className:"font-semibold text-gray-900 mb-4",children:"Quick Actions"}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("button",{type:"button",onClick:C,className:`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${u?"bg-blue-50 text-blue-700":"text-gray-700 hover:bg-gray-50"}`,children:[e.jsx(k,{className:"w-4 h-4"}),u?"Saved to bookmarks":"Bookmark this guide"]}),e.jsxs("button",{type:"button",onClick:S,className:"w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors",children:[e.jsx(E,{className:"w-4 h-4"}),"Share with team"]}),e.jsxs("button",{type:"button",onClick:w,className:"w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors",children:[e.jsx(I,{className:"w-4 h-4"}),"Print version"]})]}),g&&e.jsx("p",{className:"mt-3 text-xs text-blue-600",children:g})]}),d.length>0&&e.jsxs("div",{className:"bg-white rounded-xl border border-gray-200 p-6 shadow-sm",children:[e.jsx("h3",{className:"font-semibold text-gray-900 mb-4",children:"Related Guides"}),e.jsx("div",{className:"space-y-3",children:d.map(t=>e.jsx(c,{to:`/documentation/${t.id}`,className:"block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(x,{className:"w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors",children:t.title}),e.jsx("p",{className:"text-xs text-gray-500 mt-1",children:t.category})]})]})},t.id))})]}),e.jsxs("div",{className:"bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6",children:[e.jsx(y,{className:"w-8 h-8 text-blue-600 mb-3"}),e.jsx("h3",{className:"font-semibold text-gray-900 mb-2",children:"Need Help?"}),e.jsx("p",{className:"text-sm text-gray-600 mb-4",children:"Our engineering team is available 24/7 for enterprise support."}),e.jsxs(c,{to:"/contact",className:"inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700",children:["Contact Support ",e.jsx(P,{className:"w-4 h-4"})]})]})]})]})})]}):e.jsx("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx(x,{className:"w-16 h-16 text-gray-400 mx-auto mb-4"}),e.jsx("h2",{className:"text-xl font-semibold text-gray-900 mb-2",children:"Documentation not found"}),e.jsx(c,{to:"/documentation",className:"text-blue-600 hover:text-blue-700",children:"Back to Documentation"})]})})};export{U as default};
