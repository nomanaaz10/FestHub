import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Award } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createCompetition, updateCompetition } from '../../services/competitionService';
import { getAllFests } from '../../services/festService';

export function CompetitionFormModal({ isOpen, onClose, initialData = null, defaultFestId = '', onSuccess }) {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [fests, setFests] = useState([]);
  const [formData, setFormData] = useState({
    festId: defaultFestId || '',
    festTitle: '',
    title: '',
    subtitle: '',
    description: '',
    bannerImage: '',
    category: 'Academic',
    competitionDate: '',
    registrationDeadline: '',
    venue: 'College Campus',
    prizePool: '',
    rules: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAllFests().then(setFests).catch(console.error);
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        festId: initialData.festId || defaultFestId || '',
        festTitle: initialData.festTitle || '',
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        description: initialData.description || '',
        bannerImage: initialData.bannerImage || '',
        category: initialData.category || 'Academic',
        competitionDate: initialData.competitionDate || '',
        registrationDeadline: initialData.registrationDeadline || '',
        venue: initialData.venue || 'College Campus',
        prizePool: initialData.prizePool || '',
        rules: initialData.rules || ''
      });
    } else {
      setFormData({
        festId: defaultFestId || (fests[0]?.id || ''),
        festTitle: fests.find(f => f.id === defaultFestId)?.title || fests[0]?.title || '',
        title: '',
        subtitle: '',
        description: '',
        bannerImage: '',
        category: 'Academic',
        competitionDate: '',
        registrationDeadline: '',
        venue: 'College Campus',
        prizePool: 'Cash Prizes + Certificates',
        rules: '1. Standard college rules apply.\n2. Participants must carry ID cards.'
      });
    }
  }, [initialData, defaultFestId, isOpen, fests]);

  const handleFestChange = (festId) => {
    const selected = fests.find(f => f.id === festId);
    setFormData({
      ...formData,
      festId,
      festTitle: selected ? selected.title : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.competitionDate || !formData.festId) {
      showError("Please select a fest and fill required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await updateCompetition(initialData.id, formData);
        showSuccess("Competition updated!");
      } else {
        await createCompetition(formData, currentUser);
        showSuccess("Competition created!");
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      showError("Failed to save competition: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Competition" : "Create Competition"}
      subtitle="Add a competition inside a college festival"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Parent Festival Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Associated Festival *
          </label>
          <select
            required
            value={formData.festId}
            onChange={(e) => handleFestChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
          >
            <option value="">Select a festival</option>
            {fests.map(fest => (
              <option key={fest.id} value={fest.id}>
                {fest.title}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Competition Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Inter-College Grand Quiz 2027"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Tagline / Subheading
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="e.g. Test your wits across History, Science & Pop Culture"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>

        {/* Category & Prize Pool */}
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
              <option value="Academic">Academic</option>
              <option value="Fine Arts">Fine Arts</option>
              <option value="Music">Music</option>
              <option value="Literary">Literary</option>
              <option value="Photography">Photography</option>
              <option value="Film & Media">Film & Media</option>
              <option value="Dance">Dance</option>
              <option value="Gaming & Esports">Gaming & Esports</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Prize Pool
            </label>
            <input
              type="text"
              value={formData.prizePool}
              onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
              placeholder="e.g. ₹25,000 Cash + Trophies"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Event Date *
            </label>
            <input
              type="date"
              required
              value={formData.competitionDate}
              onChange={(e) => setFormData({ ...formData, competitionDate: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Registration Deadline
            </label>
            <input
              type="date"
              value={formData.registrationDeadline}
              onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Banner URL & Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Venue
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="e.g. Main Seminar Hall A"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Details about competition rounds, judging criteria..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none resize-none"
          />
        </div>

        {/* Rules */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Rules & Guidelines
          </label>
          <textarea
            rows={3}
            value={formData.rules}
            onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
            placeholder="1. Team size limit...\n2. Equipment required..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : initialData ? "Update Competition" : "Create Competition"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
