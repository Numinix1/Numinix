import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChapterDiagnosticTest } from './ChapterDiagnosticTest';
import { EnhancedMathMap } from './EnhancedMathMap';
import { ProgressTrackingService, ChapterDiagnostic } from '../../services/progressTrackingService';
import chaptersData from '../../data/chapters.json';

interface MathMapProps {
  setShowNavigation: (show: boolean) => void;
}

export function MathMap({ setShowNavigation }: MathMapProps) {
  const { userProfile } = useAuth();
  const [chapterDiagnostics, setChapterDiagnostics] = useState<{ [key: string]: ChapterDiagnostic }>({});
  const [showChapterDiagnostic, setShowChapterDiagnostic] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);

  useEffect(() => {
    if (userProfile) {
      loadChapterDiagnostics();
    }
  }, [userProfile]);

  const loadChapterDiagnostics = async () => {
    if (!userProfile) return;

    const userChapters = chaptersData.filter(ch => ch.class_level === userProfile.class_level);
    const diagnostics: { [key: string]: ChapterDiagnostic } = {};

    for (const chapter of userChapters) {
      const diagnostic = await ProgressTrackingService.getChapterDiagnostic(userProfile.id, chapter.id);
      if (diagnostic) {
        diagnostics[chapter.id] = diagnostic;
      }
    }

    setChapterDiagnostics(diagnostics);
  };

  const handleChapterClick = async (chapter: any) => {
    if (!userProfile) return;

    // Check if user has taken diagnostic for this chapter
    const hasDiagnostic = await ProgressTrackingService.hasUserTakenDiagnostic(userProfile.id, chapter.id);
    
    if (!hasDiagnostic) {
      setSelectedChapter(chapter);
      setShowChapterDiagnostic(chapter.id);
    } else {
      // Navigate to chapter content or show chapter details
      console.log('Navigate to chapter:', chapter.chapter);
    }
  };

  const handleDiagnosticComplete = async (diagnostic: ChapterDiagnostic) => {
    setChapterDiagnostics(prev => ({
      ...prev,
      [diagnostic.chapter_id]: diagnostic
    }));
    setShowChapterDiagnostic(null);
    setSelectedChapter(null);
  };

  const handleSkipDiagnostic = () => {
    setShowChapterDiagnostic(null);
    setSelectedChapter(null);
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="text-3xl mb-4">Please log in to access your Math Map</div>
        </div>
      </div>
    );
  }

  if (showChapterDiagnostic && selectedChapter) {
    return (
      <ChapterDiagnosticTest
        chapterId={selectedChapter.id}
        chapterName={selectedChapter.chapter}
        onComplete={handleDiagnosticComplete}
        onSkip={handleSkipDiagnostic}
      />
    );
  }

  return (
    <EnhancedMathMap 
      chapterDiagnostics={chapterDiagnostics}
      onChapterClick={handleChapterClick}
      setShowNavigation={setShowNavigation}
    />
  );
}