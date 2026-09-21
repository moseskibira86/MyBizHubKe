import React, { useState } from 'react';
import {
  Newspaper,
  GraduationCap,
  Calendar,
  Clock,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  X,
  Play,
  Share2,
} from 'lucide-react';
import { BusinessNewsItem, TrainingCourse } from '../../types';

interface NewsAcademyViewProps {
  news: BusinessNewsItem[];
  courses: TrainingCourse[];
  defaultTab?: 'news' | 'training';
}

export const NewsAcademyView: React.FC<NewsAcademyViewProps> = ({
  news,
  courses,
  defaultTab = 'news',
}) => {
  const [activeTab, setActiveTab] = useState<'news' | 'training'>(defaultTab);
  const [selectedNews, setSelectedNews] = useState<BusinessNewsItem | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const [newsCategory, setNewsCategory] = useState<string>('All');

  const filteredNews = news.filter(
    (n) => newsCategory === 'All' || n.category === newsCategory
  );

  return (
    <div className="space-y-6">
      {/* Tab Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            {activeTab === 'news' ? (
              <>
                <Newspaper className="w-6 h-6 text-[#0F7A4C]" /> Kenya SME News & Regulatory Updates
              </>
            ) : (
              <>
                <GraduationCap className="w-6 h-6 text-[#F5B400]" /> BizHub Academy & Practical Guides
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Stay ahead of regulatory changes, market trends, and practical management tactics.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'news'
                ? 'bg-white text-slate-900 shadow font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Newspaper className="w-4 h-4" /> Business News
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'training'
                ? 'bg-white text-slate-900 shadow font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> BizHub Academy
          </button>
        </div>
      </div>

      {/* Tab 1: Business News (§22) */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          {/* News Category Filter */}
          <div className="flex gap-2 text-xs overflow-x-auto pb-1">
            {['All', 'Tax & Regulation', 'Finance & Credit', 'Markets', 'SME Stories'].map((c) => (
              <button
                key={c}
                onClick={() => setNewsCategory(c)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  newsCategory === c
                    ? 'bg-[#0F7A4C] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#0F7A4C] transition-all cursor-pointer flex flex-col justify-between group space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0F7A4C] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Source: {item.source}</span>
                  <span className="text-[#0F7A4C] font-bold group-hover:underline flex items-center gap-1">
                    Read Update →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: BizHub Academy (§23) */}
      {activeTab === 'training' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#F5B400] transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                      {course.level}
                    </span>
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {course.duration}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{course.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{course.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {course.lessonsCount} Interactive Modules
                  </span>
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-[#F5B400] hover:bg-[#d99f00] flex items-center gap-1.5 shadow"
                  >
                    <BookOpen className="w-4 h-4" /> Start Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* News Article Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-4 my-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
                {selectedNews.category}
              </span>
              <button
                onClick={() => setSelectedNews(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              {selectedNews.title}
            </h2>

            <div className="text-xs text-slate-400 flex items-center gap-3">
              <span>Published: {selectedNews.date}</span>
              <span>•</span>
              <span>Source: {selectedNews.source}</span>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-100 space-y-3">
              <p>{selectedNews.summary}</p>
              <p>
                SME owners are encouraged to keep digital records to easily reconcile their returns and leverage deductions under the revised guidelines. BizHubKE automatically generates compatible reports for quick filing.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                {selectedCourse.level} • {selectedCourse.duration}
              </span>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-xl font-black text-slate-900">{selectedCourse.title}</h2>
            <p className="text-xs text-slate-600">{selectedCourse.description}</p>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <h4 className="font-bold text-slate-800">Module Outline:</h4>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0F7A4C]" />
                  <span>Module 1: Statutory Framework & Definitions</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0F7A4C]" />
                  <span>Module 2: Practical Setup & System Integration</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0F7A4C]" />
                  <span>Module 3: Daily Routine Checklist for Cashiers</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F7A4C] hover:bg-[#0b5e3a]"
              >
                Complete Module & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
