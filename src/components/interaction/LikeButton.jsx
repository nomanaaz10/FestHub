import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { toggleFestLike, checkUserLikedFest } from '../../services/festService';
import { toggleCompetitionLike, checkUserLikedCompetition } from '../../services/competitionService';

export function LikeButton({ targetId, targetType = "competition", initialLikes = 0, size = "md" }) {
  const { currentUser } = useAuth();
  const { showInfo, showError } = useToast();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  useEffect(() => {
    let isMounted = true;
    if (currentUser?.uid && targetId) {
      const checkLike = targetType === 'fest' ? checkUserLikedFest : checkUserLikedCompetition;
      checkLike(targetId, currentUser.uid).then((liked) => {
        if (isMounted) setIsLiked(liked);
      }).catch(() => {});
    }
    return () => { isMounted = false; };
  }, [targetId, targetType, currentUser]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      showInfo("Please sign in to like this event!");
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    // Optimistic UI update
    const previousLiked = isLiked;
    const previousCount = likes;
    setIsLiked(!previousLiked);
    setLikes(previousLiked ? Math.max(0, previousCount - 1) : previousCount + 1);

    try {
      const toggleFn = targetType === 'fest' ? toggleFestLike : toggleCompetitionLike;
      const result = await toggleFn(targetId, currentUser.uid);
      setIsLiked(result);
    } catch (err) {
      // Rollback on error
      setIsLiked(previousLiked);
      setLikes(previousCount);
      showError("Could not update like. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3.5 py-1.5 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5"
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isProcessing}
      className={`inline-flex items-center rounded-xl font-semibold transition-all duration-200 border ${sizeClasses[size]} ${
        isLiked
          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20'
          : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-rose-300 border-slate-700/80 hover:border-rose-500/30'
      }`}
    >
      <Heart 
        className={`${iconSizes[size]} transition-transform active:scale-125 ${
          isLiked ? 'fill-rose-500 text-rose-500' : 'text-current'
        }`} 
      />
      <span>{likes}</span>
    </button>
  );
}
