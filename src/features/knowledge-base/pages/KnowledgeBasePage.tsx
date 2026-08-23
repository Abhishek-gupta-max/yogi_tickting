import type { FC } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Folder, FileText, ChevronRight, HelpCircle, ThumbsUp,
  Plus, Eye, Clock, Tag, X, Sparkles, Send, CheckCircle2, Bookmark,
  Share2, MessageSquare, ArrowRight, Shield, Zap, Flame, User,
} from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

interface Article {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  excerpt: string;
  content: string;
  reads: string;
  helpful: number;
  author: { name: string; avatar: string; role: string };
  updatedAt: string;
  tags: string[];
  isPopular?: boolean;
  isRecent?: boolean;
}

const CATEGORIES = [
  { id: 'cat-1', name: 'Getting Started', count: 12, description: 'Account setup, team onboarding, and first steps', icon: Zap, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { id: 'cat-2', name: 'Authentication & SSO', count: 8, description: 'SAML 2.0, Okta, Azure AD, 2FA, and password policies', icon: Shield, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
  { id: 'cat-3', name: 'SLA Engine & Workflows', count: 15, description: 'Configuring escalation rules, timers, and automation', icon: Clock, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'cat-4', name: 'Integrations & API', count: 20, description: 'Webhooks, REST APIs, WhatsApp, and Slack connectors', icon: Sparkles, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
];

const MOCK_ARTICLES: Article[] = [
  {
    id: 'art-1',
    categoryId: 'cat-2',
    categoryName: 'Authentication & SSO',
    title: 'Configuring Okta SAML 2.0 Single Sign-On for TicketFlow',
    excerpt: 'Step-by-step guide to bind your Okta Identity Provider with TicketFlow Enterprise SAML 2.0 endpoint.',
    content: `### Overview
Okta SAML 2.0 integration allows your enterprise users to seamlessly authenticate into TicketFlow using single sign-on.

### Step 1: Obtain Metadata from TicketFlow
1. Navigate to **Settings → Security & SSO**.
2. Copy the **Entity ID** and **ACS URL** (Assertion Consumer Service).

### Step 2: Configure Okta App Integration
1. Log into your Okta Admin Console.
2. Go to **Applications → Create App Integration**.
3. Select **SAML 2.0** and click **Next**.
4. Paste the ACS URL into **Single Sign-On URL**.
5. Set Audience URI to the Entity ID.

### Step 3: Map User Attributes
Map the following Okta SAML attributes:
- \`email\` → \`user.email\`
- \`firstName\` → \`user.firstName\`
- \`lastName\` → \`user.lastName\`

### Step 4: Verification
Test sign-in via the **Continue with SSO** button on the TicketFlow login screen.`,
    reads: '4.2k',
    helpful: 142,
    author: { name: 'Sophia Martinez', avatar: 'SM', role: 'Security Architect' },
    updatedAt: '2 days ago',
    tags: ['sso', 'okta', 'saml', 'security'],
    isPopular: true,
  },
  {
    id: 'art-2',
    categoryId: 'cat-3',
    categoryName: 'SLA Engine & Workflows',
    title: 'Setting up Automated Ticket Escalation & SLA Timers',
    excerpt: 'Learn how to define tiered SLA policies with automatic notifications and tier-2 escalation rules.',
    content: `### SLA Policy Configuration Guide

TicketFlow SLA Engine enables real-time tracking of First Response and Resolution time targets.

#### 1. SLA Targets by Priority
- **Critical**: 15m Response, 30m Resolution
- **High**: 1h Response, 4h Resolution
- **Medium**: 4h Response, 24h Resolution
- **Low**: 12h Response, 48h Resolution

#### 2. Automatic Escalation Rules
When a ticket reaches 80% of its SLA timer without an initial agent reply:
1. System triggers a **High Priority Slack Alert** to the team channel.
2. Ticket status updates to **Escalated**.
3. Manager receives automated email notification.`,
    reads: '3.1k',
    helpful: 98,
    author: { name: 'Marcus Brody', avatar: 'MB', role: 'Lead DevOps Manager' },
    updatedAt: 'Yesterday',
    tags: ['sla', 'automation', 'escalation'],
    isPopular: true,
    isRecent: true,
  },
  {
    id: 'art-3',
    categoryId: 'cat-1',
    categoryName: 'Getting Started',
    title: 'Inviting Team Members & Configuring Role Permissions',
    excerpt: 'Complete guide on assigning Super Admin, Manager, Agent, and Customer roles to your workspace users.',
    content: `### Managing Workspace Roles

TicketFlow uses fine-grained Role-Based Access Control (RBAC).

#### Available Roles:
- **Super Admin**: Full tenant access, billing, audit logs, and system config.
- **Company Admin**: Manage team members, departments, SLA policies, and integrations.
- **Manager**: Oversee queue routing, agent workloads, and performance reports.
- **Support Agent**: Handle tickets, reply to customers, add internal notes.
- **Customer**: Submit tickets via Customer Portal, view knowledge base.`,
    reads: '5.8k',
    helpful: 210,
    author: { name: 'Eleanor Vance', avatar: 'EV', role: 'Product Operations' },
    updatedAt: '3 days ago',
    tags: ['onboarding', 'roles', 'rbac', 'users'],
    isPopular: true,
  },
  {
    id: 'art-4',
    categoryId: 'cat-4',
    categoryName: 'Integrations & API',
    title: 'REST API v1 Authentication & Webhook Event Payload Guide',
    excerpt: 'Technical API documentation for programmatically creating tickets and listening for state changes via webhooks.',
    content: `### TicketFlow REST API v1

All API requests must include your API token in the Authorization header:
\`\`\`bash
Authorization: Bearer tf_live_99a8b7c6d5e4
\`\`\`

#### Base URL:
\`https://api.ticketflow.io/v1\`

#### Create Ticket Endpoint:
\`POST /tickets\`

Payload:
\`\`\`json
{
  "subject": "System Outage",
  "description": "Database latency spike",
  "priority": "critical",
  "departmentId": "dept-it"
}
\`\`\``,
    reads: '2.9k',
    helpful: 84,
    author: { name: 'Sophia Martinez', avatar: 'SM', role: 'Security Architect' },
    updatedAt: '5 days ago',
    tags: ['api', 'rest', 'webhooks', 'developer'],
    isRecent: true,
  },
];

export const KnowledgeBasePage: FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'recent'>('all');
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>(['art-1']);
  const [votedHelpful, setVotedHelpful] = useState<Record<string, boolean>>({});

  // New Article Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('cat-1');
  const [newContent, setNewContent] = useState('');

  const filteredArticles = MOCK_ARTICLES.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = !selectedCategory || a.categoryId === selectedCategory;
    const matchTab =
      activeTab === 'all' ||
      (activeTab === 'popular' && a.isPopular) ||
      (activeTab === 'recent' && a.isRecent);
    return matchSearch && matchCat && matchTab;
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
    toast.success(bookmarks.includes(id) ? 'Removed from bookmarks' : 'Saved to bookmarks');
  };

  const handleVoteHelpful = (id: string) => {
    if (votedHelpful[id]) return;
    setVotedHelpful((prev) => ({ ...prev, [id]: true }));
    toast.success('Thanks for your feedback!');
  };

  const handleCreateArticle = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error('Please enter a title and content');
      return;
    }
    toast.success('Article submitted for review!');
    setShowCreateModal(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* ─── Hero Search Banner ────────────────────────────────── */}
      <div className="surface-card-premium p-8 lg:p-10 text-center relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-blue-500/10 rounded-full translate-y-1/2 blur-3xl" />
        </div>

        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> Documentation & Knowledge Hub
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
            Search our curated guides, API specifications, and troubleshooting articles for instant answers.
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles, guides, SAML SSO, API docs..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm bg-[var(--surface-card)] border border-[var(--surface-border)] shadow-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-secondary)]">Popular searches:</span>
            {['Okta SAML', 'SLA Escalation', 'API Tokens', 'RBAC Roles'].map((term) => (
              <button
                key={term}
                onClick={() => setSearch(term)}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface-bg)] hover:bg-[var(--surface-hover)] border border-[var(--surface-border)] text-[var(--text-primary)] transition-colors text-[11px] font-medium"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Categories Grid ─────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Folder className="w-4 h-4 text-indigo-500" /> Browse by Topic
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 flex items-center gap-1"
            >
              Show All Categories <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.div
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                whileHover={{ y: -2 }}
                className={clsx(
                  'surface-card p-5 cursor-pointer transition-all border-2 group flex flex-col justify-between',
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5'
                    : 'border-[var(--surface-border)] hover:border-indigo-500/40'
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center border', cat.color)}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[10px] font-extrabold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                      {cat.count} articles
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-indigo-500 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-indigo-500 mt-4 pt-3 border-t border-[var(--surface-border)]">
                  <span>Explore topic</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ─── Articles Section ─────────────────────────────────── */}
      <div className="surface-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--surface-border)] pb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold text-[var(--text-primary)]">Knowledge Base Articles</h2>
            <span className="text-xs text-[var(--text-muted)]">({filteredArticles.length})</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex items-center p-1 bg-[var(--surface-bg)] border border-[var(--surface-border)] rounded-xl text-xs font-semibold">
              {[
                { id: 'all', label: 'All Articles' },
                { id: 'popular', label: 'Popular 🔥' },
                { id: 'recent', label: 'Recent ⚡' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={clsx(
                    'px-3 py-1 rounded-lg transition-colors',
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Create Article */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Write Article
            </motion.button>
          </div>
        </div>

        {/* Article Cards List */}
        <div className="divide-y divide-[var(--surface-border)]">
          {filteredArticles.length === 0 ? (
            <div className="py-12 text-center">
              <BookOpen className="w-10 h-10 text-[var(--text-muted)] opacity-30 mx-auto mb-2" />
              <p className="text-sm font-bold text-[var(--text-primary)]">No articles found</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Try broadening your search or selecting a different category.</p>
            </div>
          ) : (
            filteredArticles.map((art) => {
              const isBookmarked = bookmarks.includes(art.id);
              return (
                <div
                  key={art.id}
                  onClick={() => setReadingArticle(art)}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--surface-hover)] px-4 rounded-xl transition-all cursor-pointer group"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                        {art.categoryName}
                      </span>
                      {art.isPopular && (
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 flex items-center gap-1">
                          <Flame className="w-3 h-3" /> Popular
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-indigo-500 transition-colors leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1 leading-relaxed">
                      {art.excerpt}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)] pt-1">
                      <span>by <strong className="text-[var(--text-primary)]">{art.author.name}</strong></span>
                      <span>•</span>
                      <span>Updated {art.updatedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs flex-shrink-0 sm:self-center">
                    <span className="flex items-center gap-1 text-[var(--text-muted)]">
                      <Eye className="w-3.5 h-3.5 text-indigo-400" /> {art.reads}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                      <ThumbsUp className="w-3.5 h-3.5" /> {art.helpful}
                    </span>
                    <button
                      onClick={(e) => toggleBookmark(art.id, e)}
                      className={clsx(
                        'p-1.5 rounded-lg transition-colors',
                        isBookmarked ? 'text-amber-500 bg-amber-500/10' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-bg)]'
                      )}
                      title={isBookmarked ? 'Bookmarked' : 'Bookmark article'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ─── Article Reader Drawer ───────────────────────────────── */}
      <AnimatePresence>
        {readingArticle && (
          <div className="drawer-overlay" onClick={() => setReadingArticle(null)}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="drawer-panel w-full max-w-2xl p-6 sm:p-8 space-y-6"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                    {readingArticle.categoryName}
                  </span>
                </div>
                <button
                  onClick={() => setReadingArticle(null)}
                  className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-3">
                <h1 className="text-2xl font-extrabold text-[var(--text-primary)] leading-tight">
                  {readingArticle.title}
                </h1>

                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--surface-border)]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                      {readingArticle.author.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">{readingArticle.author.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{readingArticle.author.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span>{readingArticle.reads} views</span>
                    <span>•</span>
                    <span>Updated {readingArticle.updatedAt}</span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-5 rounded-2xl bg-[var(--surface-bg)] border border-[var(--surface-border)] text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line font-sans space-y-4">
                {readingArticle.content}
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {readingArticle.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Feedback Footer */}
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">Was this article helpful?</div>
                  <div className="text-[10px] text-[var(--text-muted)]">{readingArticle.helpful} users found this helpful</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVoteHelpful(readingArticle.id)}
                    disabled={votedHelpful[readingArticle.id]}
                    className={clsx(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                      votedHelpful[readingArticle.id]
                        ? 'bg-emerald-500 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    )}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {votedHelpful[readingArticle.id] ? 'Voted Thanks!' : 'Yes, Helpful'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Create Article Modal ───────────────────────────────── */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="drawer-overlay" onClick={() => setShowCreateModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <div className="w-full max-w-xl surface-card p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3">
                  <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-500" /> Create Knowledge Base Article
                  </h2>
                  <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-hover)]">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Article Title *</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. How to configure SSO with Azure AD"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Category *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Content (Markdown Supported) *</label>
                    <textarea
                      rows={6}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Write your article content using markdown headers, lists, code blocks..."
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm font-sans bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-y"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-[var(--surface-border)]">
                  <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-[var(--surface-border)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)]">
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateArticle}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-md shadow-indigo-500/20"
                  >
                    Publish Article
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
