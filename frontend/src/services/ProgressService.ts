import api from './api';
import { Progress, CourseProgress, LessonProgress } from '@/types';

export const ProgressService = {
  /**
   * Get course progress for current user
   */
  async getCourseProgress(courseId: string): Promise<CourseProgress> {
    return api.get(`/progress/course/${courseId}`);
  },

  /**
   * Get lesson progress for current user
   */
  async getLessonProgress(lessonId: string): Promise<LessonProgress> {
    return api.get(`/progress/lesson/${lessonId}`);
  },

  /**
   * Mark lesson as complete
   */
  async completeLesson(lessonId: string): Promise<Progress> {
    return api.post<Progress>(`/progress/lesson/${lessonId}/complete`);
  },

  /**
   * Update lesson progress (for video tracking)
   */
  async updateLessonProgress(
    lessonId: string, 
    data: { 
      currentTime: number; 
      totalTime: number; 
      eventType: 'play' | 'pause' | 'seek' | 'complete' 
    }
  ): Promise<void> {
    return api.post(`/progress/lesson/${lessonId}/watch`, data);
  },

  /**
   * Get overall student analytics
   */
  async getStudentAnalytics(): Promise<unknown> {
    return api.get('/progress/analytics');
  },

  /**
   * Get instructor progress report for a course
   */
  async getInstructorProgressReport(courseId: string): Promise<unknown> {
    return api.get(`/instructor/courses/${courseId}/progress`);
  },
};

export default ProgressService;
