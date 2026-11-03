import React, { useState, useEffect } from "react";
import { User, Profile, CommunityPost, CommunityComment } from "../types";
import { 
  MessageSquare, 
  Heart, 
  Sparkles, 
  Send, 
  Tag, 
  Search, 
  Plus, 
  Filter, 
  Users, 
  ShieldCheck, 
  Compass, 
  Brain, 
  Flame, 
  CheckCircle2, 
  AlertCircle,
  Bell,
  UserPlus,
  UserCheck,
  Smile,
  X,
  Check
} from "lucide-react";

interface CommunityTabProps {
  token: string;
  user: User;
  profile: Profile;
}

interface CommunityNotification {
  id: string;
  userId: string;
  actorName: string;
  type: "comment" | "reaction" | "friend";
  postId?: string;
  postTitle?: string;
  text: string;
  read: boolean;
  createdAt: string;
}

const COMMON_EMOJIS = ["✨", "💫", "🙏", "💎", "🔥", "💜", "🧘", "🌿", "🪐", "👁️", "💡", "❤️", "🌸", "👑"];

export default function CommunityTab({ token, user, profile }: CommunityTabProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [circleFilter, setCircleFilter] = useState<"all" | "circle">("all");

  // Notifications State
  const [notifications, setNotifications] = useState<CommunityNotification[]>([]);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  // Friends / Cosmic Circle State
  const [friends, setFriends] = useState<string[]>([]);
  const [friendsModalOpen, setFriendsModalOpen] = useState(false);
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  // New Post Modal State
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState<"blueprints" | "psychometrics" | "synastry" | "deconditioning" | "general">("deconditioning");
  const [postTags, setPostTags] = useState("");
  const [submittingPost, setSubmittingPost] = useState(false);
  const [postError, setPostError] = useState("");

  // Active expanded comments
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({});

  // Fetch Community Posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/community/posts");
      const data = await res.json();
      if (res.ok && data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error("Failed to load community posts", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Notifications
  const fetchNotifications = async () => {
    if (!token) return;
    setLoadingNotifs(true);
    try {
      const res = await fetch("/api/community/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  // Fetch Friends
  const fetchFriends = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/community/friends", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.friends) {
        setFriends(data.friends);
      }
    } catch (err) {
      console.error("Failed to load friends", err);
    }
  };

  // Fetch candidates for friend search
  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    try {
      const res = await fetch("/api/profiles/compare-candidates");
      const data = await res.json();
      if (res.ok && data.candidates) {
        setAllCandidates(data.candidates);
      }
    } catch (err) {
      console.error("Failed to load friend candidates", err);
    } finally {
      setLoadingCandidates(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchNotifications();
    fetchFriends();
    fetchCandidates();
  }, [token]);

  // Handle Mark Notifications Read
  const handleMarkNotifsRead = async () => {
    try {
      await fetch("/api/community/notifications/mark-read", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark notifications read", err);
    }
  };

  // Handle Toggle Friend Connection
  const handleToggleFriend = async (targetId: string) => {
    try {
      const res = await fetch(`/api/community/friends/${targetId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.friends) {
        setFriends(data.friends);
      }
    } catch (err) {
      console.error("Failed to toggle friend", err);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/community/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(posts.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              likes: data.likes,
              likedBy: data.hasLiked ? [...(p.likedBy || []), user.id] : (p.likedBy || []).filter((id) => id !== user.id)
            };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error("Error liking post", err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      setPostError("Title and content are required.");
      return;
    }

    setSubmittingPost(true);
    setPostError("");

    try {
      const tagsArray = postTags
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean);

      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: postTitle.trim(),
          content: postContent.trim(),
          category: postCategory,
          tags: tagsArray
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create discussion post.");
      }

      setPosts([data.post, ...posts]);
      setNewPostModalOpen(false);
      setPostTitle("");
      setPostContent("");
      setPostTags("");
    } catch (err: any) {
      setPostError(err.message || "Failed to submit post");
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    setSubmittingComment({ ...submittingComment, [postId]: true });

    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: text.trim() })
      });

      const data = await res.json();
      if (res.ok && data.comment) {
        setPosts(posts.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              comments: [...(p.comments || []), data.comment]
            };
          }
          return p;
        }));
        setCommentInputs({ ...commentInputs, [postId]: "" });
      }
    } catch (err) {
      console.error("Error adding comment", err);
    } finally {
      setSubmittingComment({ ...submittingComment, [postId]: false });
    }
  };

  const handleInsertEmojiIntoComment = (postId: string, emoji: string) => {
    const cur = commentInputs[postId] || "";
    setCommentInputs({ ...commentInputs, [postId]: cur + emoji });
  };

  const handleInsertEmojiIntoPost = (emoji: string) => {
    setPostContent((prev) => prev + emoji);
  };

  const unreadNotifs = notifications.filter((n) => !n.read);

  // Filter posts by category, search, and cosmic circle
  const filteredPosts = posts.filter((p) => {
    const matchesCat = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCircle = circleFilter === "all" || (friends.includes(p.authorId) || p.authorId === user.id);

    return matchesCat && matchesSearch && matchesCircle;
  });

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto animate-fade-in" id="community-sanctuary-container">
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-indigo-950/40 border border-teal-500/20 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-teal-400 font-mono text-xs uppercase tracking-wider font-bold">
              <Users className="w-4 h-4 text-teal-400" />
              <span>Sovereign Seeker Sanctuary &amp; Forum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              Community Deliberation &amp; Wisdom Exchange
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Connect with fellow seekers, discuss your Human Design experiments, analyze MBTI &amp; psychometric findings, and share sovereign insights on relationship synastry and self-growth.
            </p>
          </div>

          {/* Action buttons (Notification Bell, Cosmic Circle Friends, New Post) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Notification Bell */}
            <button
              onClick={() => {
                setShowNotifModal(true);
                handleMarkNotifsRead();
              }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-teal-500/30 text-teal-300 hover:text-white transition-all relative shadow-sm"
              title="Community Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full text-[10px] font-bold font-mono px-1.5 py-0.2 shadow-md animate-pulse">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Cosmic Circle (Friends) Modal Trigger */}
            <button
              onClick={() => setFriendsModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/35 text-purple-200 hover:text-white text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-sm"
              title="Manage Friends & Cosmic Circle"
            >
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Cosmic Circle ({friends.length})</span>
            </button>

            {/* Create Post Button */}
            <button
              onClick={() => setNewPostModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs font-mono transition-all flex items-center gap-1.5 shadow-lg shadow-teal-500/20 shrink-0"
              id="new-post-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Share Reflection</span>
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH, CATEGORY, & CIRCLE FILTER TABS */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Cosmic Circle Filter Toggle */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 shadow-inner">
            <button
              onClick={() => setCircleFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all font-mono ${
                circleFilter === "all"
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/35"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Collective Posts
            </button>
            <button
              onClick={() => setCircleFilter("circle")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all font-mono flex items-center gap-1 ${
                circleFilter === "circle"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/35"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-3 h-3 text-purple-400" />
              <span>My Cosmic Circle ({friends.length})</span>
            </button>
          </div>

          {/* Search Field */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions, tags, authors..."
              className="cosmic-input text-xs w-full pl-8 py-2 border-slate-800 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {[
            { id: "all", label: "All Topics" },
            { id: "blueprints", label: "Cosmic Blueprints" },
            { id: "psychometrics", label: "AMBI & Scales" },
            { id: "synastry", label: "Synastry & Relationships" },
            { id: "deconditioning", label: "Deconditioning & Somatics" },
            { id: "general", label: "General Sanctuary" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeCategory === cat.id
                  ? "bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* POSTS LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Sparkles className="w-6 h-6 text-teal-400 animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-400">Loading sanctuary discussions...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No reflections found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {circleFilter === "circle" 
                ? "No posts from your friends yet. Click 'Cosmic Circle' above to add friends from your community." 
                : "Be the first to share an inquiry or contemplation with the collective."}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const hasLiked = (post.likedBy || []).includes(user.id);
            const isCommentsExpanded = expandedPostId === post.id;
            const isAuthorFriend = friends.includes(post.authorId);

            return (
              <div 
                key={post.id} 
                className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-xl space-y-4 hover:border-slate-700/80 transition-all"
              >
                {/* Post Top Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500/20 to-purple-500/20 border border-teal-500/30 flex items-center justify-center font-bold text-teal-300 font-mono text-xs shrink-0">
                      {post.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-xs sm:text-sm">{post.authorName}</span>
                        {isAuthorFriend && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Friend
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono">
                          • {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-[10px] text-teal-400 font-mono block">
                        {post.authorSignature || "Sovereign Seeker"}
                      </span>
                    </div>
                  </div>

                  {/* Connect with Author Button */}
                  {post.authorId !== user.id && (
                    <button
                      onClick={() => handleToggleFriend(post.authorId)}
                      className={`text-[10px] font-mono px-2 py-1 rounded-lg border transition-all flex items-center gap-1 shrink-0 ${
                        isAuthorFriend
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      {isAuthorFriend ? <UserCheck className="w-3 h-3 text-purple-400" /> : <UserPlus className="w-3 h-3" />}
                      <span>{isAuthorFriend ? "In Circle" : "+ Add Friend"}</span>
                    </button>
                  )}
                </div>

                {/* Post Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-serif text-slate-100">{post.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                    {post.content}
                  </p>
                </div>

                {/* Post Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((t) => (
                      <span key={t} className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Reaction Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    {/* Resonance Heart Like */}
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                        hasLiked 
                          ? "bg-rose-500/15 border-rose-500/40 text-rose-300 font-semibold" 
                          : "bg-slate-900 border-slate-800 hover:text-white"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasLiked ? "text-rose-400 fill-rose-400" : ""}`} />
                      <span>{post.likes || 0}</span>
                    </button>

                    {/* Expand Comments */}
                    <button
                      onClick={() => setExpandedPostId(isCommentsExpanded ? null : post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:text-white transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                      <span>{(post.comments || []).length} Replies</span>
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    Category: {post.category}
                  </span>
                </div>

                {/* COMMENTS EXPANDED DRAWER */}
                {isCommentsExpanded && (
                  <div className="pt-4 border-t border-slate-800/80 space-y-4 animate-fade-in">
                    {/* Existing Comments */}
                    {(post.comments || []).length > 0 ? (
                      <div className="space-y-2.5">
                        {post.comments.map((comm) => (
                          <div key={comm.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-200 text-xs">{comm.authorName}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {new Date(comm.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="text-[9.5px] text-teal-400/80 font-mono block">
                              {comm.authorSignature}
                            </span>
                            <p className="text-xs text-slate-300 pt-1 leading-relaxed whitespace-pre-line">
                              {comm.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No replies yet. Begin the wisdom exchange below.</p>
                    )}

                    {/* Add Comment Input with Emoji Quick Bar */}
                    <div className="space-y-2 pt-2">
                      {/* Emoji Quick Picker for Comment */}
                      <div className="flex flex-wrap items-center gap-1 text-sm bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-mono text-slate-400 px-1 uppercase">Emojis:</span>
                        {COMMON_EMOJIS.map((em) => (
                          <button
                            key={em}
                            type="button"
                            onClick={() => handleInsertEmojiIntoComment(post.id, em)}
                            className="p-1 hover:scale-125 transition-transform"
                            title={`Insert ${em}`}
                          >
                            {em}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ""}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          placeholder="Contribute your insight or reflection (emojis supported)..."
                          className="cosmic-input text-xs flex-1 py-2"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment(post.id);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={submittingComment[post.id] || !(commentInputs[post.id] || "").trim()}
                          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs font-mono transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* NOTIFICATIONS MODAL */}
      {showNotifModal && (
        <div 
          onClick={() => setShowNotifModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-2 border-teal-500/35 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative text-slate-100 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-400" />
                <h3 className="text-xl font-bold font-serif text-white">Community Notifications</h3>
              </div>
              <button
                onClick={() => setShowNotifModal(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingNotifs ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">You are completely up to date. No new feed notifications.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-3.5 rounded-2xl border transition-all text-xs space-y-1 ${
                      notif.read ? "bg-slate-950/60 border-slate-800 text-slate-300" : "bg-teal-950/30 border-teal-500/40 text-teal-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-300 font-mono text-[10px] uppercase">
                        {notif.type === "comment" ? "💬 New Comment" : notif.type === "reaction" ? "✨ Resonance" : "🤝 Cosmic Circle"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="leading-relaxed">{notif.text}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowNotifModal(false)}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COSMIC CIRCLE (FRIENDS SEARCH & ADD) MODAL */}
      {friendsModalOpen && (
        <div 
          onClick={() => setFriendsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-2 border-purple-500/35 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative text-slate-100 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-bold font-serif text-white">My Cosmic Circle (Friends)</h3>
              </div>
              <button
                onClick={() => setFriendsModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Seekers Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={friendSearchQuery}
                onChange={(e) => setFriendSearchQuery(e.target.value)}
                placeholder="Search community by name or username..."
                className="cosmic-input text-xs w-full pl-9 py-2.5 border-purple-500/40 focus:border-purple-400"
              />
            </div>

            {/* Candidates List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {loadingCandidates ? (
                <p className="text-xs text-slate-400 py-4 text-center">Loading seekers...</p>
              ) : (
                allCandidates
                  .filter((c) => {
                    if (!friendSearchQuery.trim()) return true;
                    const q = friendSearchQuery.toLowerCase();
                    return c.name.toLowerCase().includes(q) || (c.username && c.username.toLowerCase().includes(q));
                  })
                  .map((cand) => {
                    const isFriend = friends.includes(cand.id);
                    return (
                      <div 
                        key={cand.id} 
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{cand.name}</span>
                            {cand.username && (
                              <span className="text-[10px] font-mono text-purple-300 bg-purple-500/15 px-1.5 py-0.2 rounded border border-purple-500/30">
                                @{cand.username}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            DOB: {cand.dateOfBirth} • {cand.profile?.computed?.humanDesign?.type || "Seeker"}
                          </span>
                        </div>

                        <button
                          onClick={() => handleToggleFriend(cand.id)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                            isFriend 
                              ? "bg-purple-500/20 text-purple-300 border-purple-500/40" 
                              : "bg-slate-900 text-slate-300 border-slate-700 hover:border-purple-500/40"
                          }`}
                        >
                          {isFriend ? <UserCheck className="w-3.5 h-3.5 text-purple-400" /> : <UserPlus className="w-3.5 h-3.5" />}
                          <span>{isFriend ? "Connected" : "+ Add Friend"}</span>
                        </button>
                      </div>
                    );
                  })
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setFriendsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW POST MODAL */}
      {newPostModalOpen && (
        <div 
          onClick={() => setNewPostModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-2 border-teal-500/35 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl relative text-slate-100"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <h3 className="text-xl font-bold font-serif text-white">Share a Sanctuary Reflection</h3>
              </div>
              <button
                onClick={() => setNewPostModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {postError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{postError}</span>
              </div>
            )}

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Category</label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value as any)}
                  className="cosmic-input text-xs w-full"
                >
                  <option value="deconditioning">Deconditioning &amp; Somatics</option>
                  <option value="blueprints">Cosmic Blueprints &amp; Astrological Placements</option>
                  <option value="psychometrics">AMBI Psychometrics &amp; MBTI Scales</option>
                  <option value="synastry">Relationship Synastry &amp; Energetic Synergy</option>
                  <option value="general">General Seeker Sanctuary</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Title</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Navigating undefined Solar Plexus in romantic partnerships"
                  className="cosmic-input text-xs w-full"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-300">Discussion Content</label>
                  <span className="text-[10px] font-mono text-teal-400">Click to insert emoji:</span>
                </div>

                {/* Emoji Bar for Post Content */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  {COMMON_EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => handleInsertEmojiIntoPost(em)}
                      className="text-base p-1 hover:scale-125 transition-transform"
                    >
                      {em}
                    </button>
                  ))}
                </div>

                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share your contemplation, inquiry, or breakthrough..."
                  rows={5}
                  className="cosmic-input text-xs w-full font-sans"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Tags (comma separated)</label>
                <input
                  type="text"
                  value={postTags}
                  onChange={(e) => setPostTags(e.target.value)}
                  placeholder="e.g. HumanDesign, SolarPlexus, Deconditioning"
                  className="cosmic-input text-xs w-full font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setNewPostModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPost}
                  className="py-2.5 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs font-mono transition-all disabled:opacity-50"
                >
                  {submittingPost ? "Publishing..." : "Publish Discussion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
