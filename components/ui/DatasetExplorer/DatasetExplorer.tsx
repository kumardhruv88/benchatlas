'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Database } from 'lucide-react';
import styles from './DatasetExplorer.module.css';
import type { ExampleQuestion } from '@/lib/types/benchmark';

interface DatasetExplorerProps {
  questions: ExampleQuestion[];
  benchmarkName: string;
}

export function DatasetExplorer({ questions, benchmarkName }: DatasetExplorerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  if (!questions || questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedChoice !== null;
  const isCorrect = isAnswered && selectedChoice === currentQuestion.answer;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedChoice(null);
    }
  };

  const handleChoiceClick = (choice: string) => {
    if (!isAnswered) {
      setSelectedChoice(choice);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Database size={18} />
          Interactive Dataset Explorer
        </div>
        <div className={styles.controls}>
          <button 
            className={styles.btn_nav} 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            aria-label="Previous question"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            className={styles.btn_nav} 
            onClick={handleNext} 
            disabled={currentIndex === questions.length - 1}
            aria-label="Next question"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div>
        {currentQuestion.subject && (
          <div className={styles.subject_badge}>{currentQuestion.subject}</div>
        )}
        <div className={styles.question}>{currentQuestion.question}</div>
        
        {currentQuestion.choices && (
          <div className={styles.choices}>
            {currentQuestion.choices.map((choice, idx) => {
              const letter = String.fromCharCode(65 + idx);
              let btnClass = styles.choice_btn;
              
              if (isAnswered) {
                if (choice === currentQuestion.answer) {
                  btnClass += ` ${styles.correct}`;
                } else if (choice === selectedChoice) {
                  btnClass += ` ${styles.incorrect}`;
                }
              }

              return (
                <button
                  key={idx}
                  className={btnClass}
                  onClick={() => handleChoiceClick(choice)}
                  disabled={isAnswered}
                >
                  <span className={styles.choice_letter}>{letter}.</span>
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>
        )}

        {isAnswered && (
          <div className={`${styles.result_box} ${isCorrect ? styles.success : styles.error}`}>
            {isCorrect ? (
              <>
                <CheckCircle2 size={16} />
                <span>Correct! You matched the expected output for {benchmarkName}.</span>
              </>
            ) : (
              <>
                <XCircle size={16} />
                <span>Incorrect. The correct answer was: <strong>{currentQuestion.answer}</strong></span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
