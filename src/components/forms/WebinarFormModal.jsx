import React, { useState, useEffect } from 'react';
import { Video, Calendar, User, Link as LinkIcon } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createWebinar, updateWebinar } from '../../services/webinarService';

export function WebinarFormModal({ isOpen, onClose, initialData = null, onSuccess }) {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    speaker: '',
    speakerDesignation: '',
    speakerPhoto: '',
    date: '',
    time: '4:00 PM – 5:30 PM IST',
    venue: 'Main Auditorium & Zoom',
    meetingLink: '',
    bannerImage: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        description: initialData.description || '',
        speaker: initialData.speaker || '',
        speakerDesignation: initialData.speakerDesignation || '',
        speakerPhoto: initialData.speakerPhoto || '',
        date: initialData.date || '',
        time: initialData.time || '4:00 PM – 5:30 PM IST',
        venue: initialData.venue || 'Main Auditorium & Zoom',
        meetingLink: initialData.meetingLink || '',
        bannerImage: initialData.bannerImage || ''
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        speaker: '',
        speakerDesignation: '',
        speakerPhoto: '',
        date: '',
        time: '4:00 PM – 5:30 PM IST',
        venue: 'Main Auditorium & Zoom',
        meetingLink: '',
        bannerImage: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.speaker || !formData.date) {
      showError("Please fill required fields (title, speaker, date)");
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await updateWebinar(initialData.id, formData);
        showSuccess("Webinar updated!");
      } else {
        await createWebinar(formData, currentUser);
        showSuccess("Webinar scheduled!");
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      showError("Failed to save webinar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Webinar" : "Schedule Guest Lecture / Webinar"}
      subtitle="Invite speakers, set dates, meeting links, and agendas"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Webinar Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. AI in Modern Science & Engineering"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Subtitle / Theme
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="e.g. Exploring Large Foundation Models & Real-World Robotics"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Speaker Name *
            </label>
            <input
              type="text"
              required
              value={formData.speaker}
              onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
              placeholder="e.g. Dr. Aarav Mehta"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Speaker Designation / Bio
            </label>
            <input
              type="text"
              value={formData.speakerDesignation}
              onChange={(e) => setFormData({ ...formData, speakerDesignation: e.target.value })}
              placeholder="e.g. Chief AI Researcher at DeepTech"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Time
            </label>
            <input
              type="text"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="e.g. 4:00 PM – 5:30 PM IST"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Meeting Link (Google Meet / Zoom)
            </label>
            <input
              type="url"
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              placeholder="https://meet.google.com/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Venue
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="e.g. Main Auditorium & Zoom"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Speaker Photo URL
            </label>
            <input
              type="url"
              value={formData.speakerPhoto}
              onChange={(e) => setFormData({ ...formData, speakerPhoto: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Banner Image URL
            </label>
            <input
              type="url"
              value={formData.bannerImage}
              onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Description & Agenda
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed overview of the topic and speaker credentials..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none resize-none"
          />
        </div>

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
            {isSubmitting ? "Saving..." : initialData ? "Update Webinar" : "Schedule Webinar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
