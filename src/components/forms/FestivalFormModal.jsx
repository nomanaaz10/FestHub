import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createFest, updateFest } from '../../services/festService';

export function FestivalFormModal({ isOpen, onClose, initialData = null, onSuccess }) {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    bannerImage: '',
    startDate: '',
    endDate: '',
    venue: 'College Campus',
    category: 'National & Cultural',
    galleryImages: ['']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        description: initialData.description || '',
        bannerImage: initialData.bannerImage || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        venue: initialData.venue || 'College Campus',
        category: initialData.category || 'National & Cultural',
        galleryImages: initialData.galleryImages?.length ? initialData.galleryImages : ['']
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        bannerImage: '',
        startDate: '',
        endDate: '',
        venue: 'College Campus',
        category: 'National & Cultural',
        galleryImages: ['']
      });
    }
  }, [initialData, isOpen]);

  const handleGalleryChange = (index, value) => {
    const updated = [...formData.galleryImages];
    updated[index] = value;
    setFormData({ ...formData, galleryImages: updated });
  };

  const addGalleryField = () => {
    setFormData({ ...formData, galleryImages: [...formData.galleryImages, ''] });
  };

  const removeGalleryField = (index) => {
    const updated = formData.galleryImages.filter((_, i) => i !== index);
    setFormData({ ...formData, galleryImages: updated.length ? updated : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.endDate) {
      showError("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanedData = {
        ...formData,
        galleryImages: formData.galleryImages.filter(url => Boolean(url.trim()))
      };

      if (initialData?.id) {
        await updateFest(initialData.id, cleanedData);
        showSuccess("Festival updated successfully!");
      } else {
        await createFest(cleanedData, currentUser);
        showSuccess("Festival created successfully!");
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      showError("Failed to save festival: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Festival" : "Create New Festival"}
      subtitle="Publish a major college festival with dates, banner, and photo gallery"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Festival Headline *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Republic Day Fest 2027"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Sub-headline / Tagline
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="e.g. Celebrating Unity, Culture & Innovation"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>

        {/* Category & Venue */}
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
              <option value="National & Cultural">National & Cultural</option>
              <option value="Cultural & Arts">Cultural & Arts</option>
              <option value="Technical & Coding">Technical & Coding</option>
              <option value="Sports & Athletics">Sports & Athletics</option>
              <option value="Management & Commerce">Management & Commerce</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Venue
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="e.g. Main Campus Grounds"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Start Date *
            </label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              End Date *
            </label>
            <input
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Banner Image URL */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Banner Image URL
          </label>
          <input
            type="url"
            value={formData.bannerImage}
            onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Detailed Description *
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Provide all details about the fest highlights, themes, and activities..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none resize-none"
          />
        </div>

        {/* Photo Gallery URLs */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Photo Gallery Image URLs
            </label>
            <button
              type="button"
              onClick={addGalleryField}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Image URL
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {formData.galleryImages.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleGalleryChange(idx, e.target.value)}
                  placeholder={`Gallery Image URL #${idx + 1}`}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                />
                {formData.galleryImages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGalleryField(idx)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : initialData ? "Update Festival" : "Publish Festival"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
