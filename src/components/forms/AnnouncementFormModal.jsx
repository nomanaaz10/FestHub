import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createAnnouncement, updateAnnouncement } from '../../services/announcementService';

export function AnnouncementFormModal({ isOpen, onClose, initialData = null, onSuccess }) {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0],
    important: false,
    category: 'General Notice'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        important: Boolean(initialData.important),
        category: initialData.category || 'General Notice'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        date: new Date().toISOString().split('T')[0],
        important: false,
        category: 'General Notice'
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      showError("Please fill title and description");
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await updateAnnouncement(initialData.id, formData);
        showSuccess("Announcement updated!");
      } else {
        await createAnnouncement(formData, currentUser);
        showSuccess("Announcement posted!");
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      showError("Failed to save announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Announcement" : "Post New Announcement"}
      subtitle="Publish important student updates, circulars, or schedule changes"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Announcement Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Physics Paper Rescheduled to 30 Jan"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            >
              <option value="Academics">Academics</option>
              <option value="Events">Events</option>
              <option value="Campus Notice">Campus Notice</option>
              <option value="Volunteering">Volunteering</option>
              <option value="General Notice">General Notice</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Notice Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Banner / Attachment Image URL (Optional)
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Announcement Content *
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Type notice details here..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none resize-none"
          />
        </div>

        {/* Important Toggle */}
        <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.important}
            onChange={(e) => setFormData({ ...formData, important: e.target.checked })}
            className="w-4 h-4 text-amber-500 rounded bg-slate-800 border-slate-700 focus:ring-amber-500"
          />
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-white">Mark as High Priority / Urgent Notice</span>
          </div>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : initialData ? "Update Notice" : "Post Notice"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
