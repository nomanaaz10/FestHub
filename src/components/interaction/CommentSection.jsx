import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { VerifiedBadge, RoleBadge } from '../common/Badge';
import { getCompetitionComments, addCompetitionComment, deleteCompetitionComment } from '../../services/competitionService';

export function CommentSection({ competitionId }) {
  const { currentUser, userProfile, isSubAdmin, isSuperAdmin } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const data = await getCompetitionComments(competitionId);
      setComments(data);
    } catch (err) {
      console.warn("Could not load comments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [competitionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      showInfo("Please sign in to join the discussion!");
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await addCompetitionComment(competitionId, newComment, currentUser, userProfile);
      setComments((prev) => [...prev, created]);
      setNewComment('');
      showSuccess("Comment posted!");
    } catch (err) {
      showError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteCompetitionComment(commentId);
      setComments((prev) => prev.filter(c => c.id !== commentId));
      showSuccess("Comment deleted");
    } catch (err) {
      showError("Failed to delete comment");
    }
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Just now';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xl font-bold text-white tracking-tight">Community Discussion</h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </span>
      </div>

      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={currentUser ? "Ask a question, find team members, or share your thoughts..." : "Please log in to leave a comment..."}
            disabled={!currentUser || isSubmitting}
            rows={3}
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 resize-none transition-all outline-none disabled:opacity-60"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {currentUser ? `Posting as ${userProfile?.displayName || currentUser.email}` : "Sign in to participate"}
          </span>
          <button
            type="submit"
            disabled={!currentUser || !newComment.trim() || isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="flex flex-col gap-4 mt-2">
        {isLoading ? (
          <div className="py-8 text-center text-slate-500 text-sm">Loading discussion...</div>
        ) : comments.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center text-slate-500">
            <MessageSquare className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm font-medium">No comments yet.</p>
            <p className="text-xs text-slate-600 mt-1">Be the first to start the conversation!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const canDelete = currentUser && (
              currentUser.uid === comment.userId || 
              isSuperAdmin || 
              isSubAdmin
            );

            return (
              <div 
                key={comment.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/60 transition-colors flex gap-3.5"
              >
                <img
                  src={comment.userPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${comment.userId || 'guest'}`}
                  alt={comment.userName}
                  className="w-10 h-10 rounded-full bg-slate-800 shrink-0 border border-slate-700 object-cover"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-slate-200">{comment.userName}</span>
                      <VerifiedBadge isVerified={comment.emailVerified} />
                      {comment.role && comment.role !== 'student' && (
                        <RoleBadge role={comment.role} />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors rounded"
                          title="Delete Comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 mt-1.5 leading-relaxed break-words whitespace-pre-line">
                    {comment.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
