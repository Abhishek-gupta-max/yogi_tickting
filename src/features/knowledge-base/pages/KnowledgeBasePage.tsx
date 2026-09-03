import type { FC } from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen, Search, Folder, FileText, ChevronRight, ThumbsUp,
  Plus, Eye, Clock, Tag, X, Sparkles, Bookmark,
  ArrowRight, Shield, Zap, Flame,
} from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

interface Article {
  id: string; categoryId: string; categoryName: string; title: string;
  excerpt: string; content: string; reads: string; helpful: number;
  author: { name: string; avatar: string; role: string }; updatedAt: string;
  tags: string[]; isPopular?: boolean; isRecent?: boolean;
}

const CATEGORIES = [
  { id: 'cat-1', name: 'Getting Started', count: 12, description: 'Account setup, onboarding, and first steps', icon: Zap, color: 'text-amber-600 bg-amber-500/10' },
  { id: 'cat-2', name: 'Authentication & SSO', count: 8, description: 'SAML 2.0, Okta, Azure AD, 2FA, password policies', icon: Shield, color: 'text-[var(--color-primary)] bg-[var(--color-primary-muted)]' },
  { id: 'cat-3', name: 'SLA Engine & Workflows', count: 15, description: 'Configuring escalation rules, timers, and automation', icon: Clock, color: 'text-emerald-600 bg-emerald-500/10' },
  { id: 'cat-4', name: 'Integrations & API', count: 20, description: 'Webhooks, REST APIs, WhatsApp, and Slack connectors', icon: Sparkles, color: 'text-purple-600 bg-purple-500/10' },
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
1. Navigate to Settings → Security & SSO.
2. Copy the Entity ID and ACS URL.

### Step 2: Configure Okta App Integration
1. Log into your Okta Admin Console.
2. Go to Applications → Create App Integration.
3. Select SAML 2.0 and click Next.`,
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

#### Priorities:
- Critical: 15m Response, 30m Resolution
- High: 1h Response, 4h Resolution`,
    reads: '3.1k',
    helpful: 98,
    author: { name: 'Marcus Brody', avatar: 'MB', role: 'Lead DevOps Manager' },
    updatedAt: 'Yesterday',
    tags: ['sla', 'automation', 'escalation'],
    isPopular: true,
    isRecent: true,
  },
];

export const KnowledgeBasePage: FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>(['art-1']);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('cat-1');
  const [newContent, setNewContent] = useState('');

  const filteredArticles = MOCK_ARTICLES.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCategory || a.categoryId === selectedCategory;
    return matchSearch && matchCat;
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks((prev) => prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]);
    toast.success(bookmarks.includes(id) ? 'Removed bookmark' : 'Saved bookmark');
  };

  const handleCreateArticle = () => {
    if (!newTitle.trim() || !newContent.trim()) { toast.error('Please enter a title and content'); return; }
    toast.success('Article published!');
    setShowCreateModal(false); setNewTitle(''); setNewContent('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Search Header */}
      <div className="surface-card p-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[var(--color-primary-muted)] text-[var(--color-primary)] text-[11px] font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" /> Help Center & Knowledge Base
        </div>
        <h1 className="text-page-title text-[var(--text-primary)]">Knowledge Base & Documentation</h1>
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles, SAML SSO, API docs, workflows…"
            className="field-input pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
              className={clsx(
                'surface-card p-4 cursor-pointer transition-all border group',
                isSelected ? 'border-[var(--color-primary)] bg-[var(--color-primary-muted)]' : 'hover:border-[var(--color-primary)]'
              )}
            >
              <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center mb-3', cat.color)}>
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-[14px] text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{cat.name}</h3>
              <p className="text-caption text-[var(--text-muted)] mt-1 line-clamp-2">{cat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Articles */}
      <div className="surface-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3">
          <h2 className="text-card-title text-[var(--text-primary)]">Articles ({filteredArticles.length})</h2>
          <button onClick={() => setShowCreateModal(true)} className="btn-enterprise btn-enterprise-primary btn-sm">
            <Plus className="w-3.5 h-3.5" /> Write Article
          </button>
        </div>

        <div className="divide-y divide-[var(--surface-border)]">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => setReadingArticle(art)}
              className="py-3 flex items-center justify-between gap-4 hover:bg-[var(--surface-hover)] px-3 rounded-lg transition-colors cursor-pointer group"
            >
              <div>
                <div className="text-[11px] font-semibold text-[var(--color-primary)]">{art.categoryName}</div>
                <h3 className="text-[14px] font-medium text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{art.title}</h3>
                <p className="text-caption text-[var(--text-muted)] line-clamp-1 mt-0.5">{art.excerpt}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={(e) => toggleBookmark(art.id, e)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  <Bookmark className={clsx('w-4 h-4', bookmarks.includes(art.id) && 'fill-current text-amber-500')} />
                </button>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--color-primary)]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Reader Drawer */}
      <AnimatePresence>
        {readingArticle && (
          <div className="drawer-overlay" onClick={() => setReadingArticle(null)}>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} onClick={(e) => e.stopPropagation()} className="drawer-panel w-full max-w-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3">
                <span className="badge bg-[var(--color-primary-muted)] text-[var(--color-primary)]">{readingArticle.categoryName}</span>
                <button onClick={() => setReadingArticle(null)} className="p-1 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"><X className="w-4 h-4" /></button>
              </div>
              <h1 className="text-page-title text-[var(--text-primary)]">{readingArticle.title}</h1>
              <div className="p-4 rounded-lg bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[13px] leading-relaxed whitespace-pre-line text-[var(--text-primary)]">
                {readingArticle.content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Write Article Modal */}
      {showCreateModal && (
        <div className="drawer-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50" onClick={(e) => e.stopPropagation()}>
            <div className="w-full max-w-lg bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl p-6 space-y-4 shadow-xl animate-scale-in">
              <div className="flex items-center justify-between">
                <h2 className="text-section-head text-[var(--text-primary)]">Publish Article</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleCreateArticle(); }} className="space-y-4">
                <div className="form-field">
                  <label className="form-label">Title *</label>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="field-input" required />
                </div>
                <div className="form-field">
                  <label className="form-label">Category</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="field-input">
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Content *</label>
                  <textarea rows={5} value={newContent} onChange={(e) => setNewContent(e.target.value)} className="field-input py-2 h-auto" required />
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-[var(--surface-border)]">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 btn-enterprise btn-enterprise-secondary">Cancel</button>
                  <button type="submit" className="flex-1 btn-enterprise btn-enterprise-primary">Publish</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
