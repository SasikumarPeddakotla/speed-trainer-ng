export interface ReviewItem<T> {
  questionId: string;
  questionData: T;
  delay: number;
  stage: number;
}
