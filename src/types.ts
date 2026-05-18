export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  createdAt: number;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}
