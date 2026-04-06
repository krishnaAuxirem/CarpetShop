import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface QAAnswer {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  userRole: "customer" | "seller" | "admin";
  text: string;
  createdAt: string;
  helpfulVotes: string[]; // user IDs who voted
  isSellerReply: boolean;
}

export interface QAQuestion {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  answers: QAAnswer[];
  helpfulVotes: string[]; // user IDs
  isAnswered: boolean;
}

interface QAStore {
  questions: QAQuestion[];
  addQuestion: (q: Omit<QAQuestion, "id" | "answers" | "helpfulVotes" | "isAnswered" | "createdAt">) => void;
  addAnswer: (questionId: string, a: Omit<QAAnswer, "id" | "questionId" | "helpfulVotes" | "createdAt">) => void;
  voteQuestion: (questionId: string, userId: string) => void;
  voteAnswer: (questionId: string, answerId: string, userId: string) => void;
  getByProduct: (productId: string) => QAQuestion[];
}

const SEED_QUESTIONS: QAQuestion[] = [
  {
    id: "q1",
    productId: "p1",
    userId: "u1",
    userName: "Priya Sharma",
    text: "Is this carpet suitable for high-traffic areas like the living room entrance?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    helpfulVotes: ["u2", "u3"],
    isAnswered: true,
    answers: [
      {
        id: "a1",
        questionId: "q1",
        userId: "seller1",
        userName: "Heritage Carpets Co.",
        userRole: "seller",
        text: "Yes, absolutely! This carpet is made from high-density wool that withstands heavy foot traffic. We recommend using a rug pad beneath it for extra protection and to prevent slipping. Regular vacuuming will keep it looking pristine for years.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        helpfulVotes: ["u1", "u2"],
        isSellerReply: true,
      },
    ],
  },
  {
    id: "q2",
    productId: "p1",
    userId: "u2",
    userName: "Arjun Mehta",
    text: "Can this be washed at home or does it need professional cleaning?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    helpfulVotes: ["u1"],
    isAnswered: true,
    answers: [
      {
        id: "a2",
        questionId: "q2",
        userId: "seller1",
        userName: "Heritage Carpets Co.",
        userRole: "seller",
        text: "We recommend professional dry cleaning every 2–3 years. For day-to-day maintenance, vacuum gently without a beater bar. Spot-clean small stains with cold water and mild soap. Avoid machine washing as it can damage the fibers and distort the weave.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
        helpfulVotes: ["u2", "u3"],
        isSellerReply: true,
      },
      {
        id: "a3",
        questionId: "q2",
        userId: "u3",
        userName: "Sneha Patel",
        userRole: "customer",
        text: "I bought this 6 months ago and I've been having it professionally cleaned once. It still looks brand new!",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
        helpfulVotes: ["u1"],
        isSellerReply: false,
      },
    ],
  },
];

export const useQAStore = create<QAStore>()(
  persist(
    (set, get) => ({
      questions: SEED_QUESTIONS,

      addQuestion: (q) => {
        const newQ: QAQuestion = {
          ...q,
          id: `q_${Date.now()}`,
          answers: [],
          helpfulVotes: [],
          isAnswered: false,
          createdAt: new Date().toISOString(),
        };
        set(s => ({ questions: [newQ, ...s.questions] }));
      },

      addAnswer: (questionId, a) => {
        const newA: QAAnswer = {
          ...a,
          id: `a_${Date.now()}`,
          questionId,
          helpfulVotes: [],
          createdAt: new Date().toISOString(),
        };
        set(s => ({
          questions: s.questions.map(q =>
            q.id === questionId
              ? { ...q, answers: [...q.answers, newA], isAnswered: true }
              : q
          ),
        }));
      },

      voteQuestion: (questionId, userId) => {
        set(s => ({
          questions: s.questions.map(q =>
            q.id === questionId
              ? {
                  ...q,
                  helpfulVotes: q.helpfulVotes.includes(userId)
                    ? q.helpfulVotes.filter(id => id !== userId)
                    : [...q.helpfulVotes, userId],
                }
              : q
          ),
        }));
      },

      voteAnswer: (questionId, answerId, userId) => {
        set(s => ({
          questions: s.questions.map(q =>
            q.id === questionId
              ? {
                  ...q,
                  answers: q.answers.map(a =>
                    a.id === answerId
                      ? {
                          ...a,
                          helpfulVotes: a.helpfulVotes.includes(userId)
                            ? a.helpfulVotes.filter(id => id !== userId)
                            : [...a.helpfulVotes, userId],
                        }
                      : a
                  ),
                }
              : q
          ),
        }));
      },

      getByProduct: (productId) =>
        get().questions.filter(q => q.productId === productId),
    }),
    { name: "carpet-qa" }
  )
);
