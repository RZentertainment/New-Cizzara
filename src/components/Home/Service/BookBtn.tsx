import React from 'react';

interface BookBtnProps {
  className?: string;
}

export default function BookBtn({ className = '' }: BookBtnProps) {
  return (
    <>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSc-ZnrC6ZnNE-ZjijZ4EQVcu5AFt9vtprAGZyLZrdpAaMnf4w/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className={`cizzara-book-btn ${className}`}
      >
        <span className="btn-text">Book Online</span>
      </a>

      {/* Scoped CSS for the unique button styling */}
      <style>{`
        .cizzara-book-btn {
          position: relative;
          font-size: 1.2em;
          padding: 0.7em 1.4em;
          background-color: #BF0426;
          text-decoration: none;
          border: none;
          border-radius: 0.5em;
          color: #DEDEDE;
          box-shadow: 0.5em 0.5em 0.5em rgba(0, 0, 0, 0.3);
          display: inline-block;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          overflow: hidden;
          z-index: 1;
        }

        /* The moving border effect */
        .cizzara-book-btn::before {
          content: '';
          position: absolute;
          inset: -3px; /* Thickness of the border */
          border-radius: 0.6em;
          background: conic-gradient(
            from 0deg,
            #FFD700,
            #FF4500,
            #BF0426,
            #FFD700
          );
          z-index: -2;
          animation: spin-border 3s linear infinite;
        }

        /* The inner mask to hide the gradient except the border */
        .cizzara-book-btn::after {
          content: '';
          position: absolute;
          inset: 2px; /* Slightly smaller than ::before */
          border-radius: 0.4em;
          background: #BF0426;
          z-index: -1;
        }

        /* Keep text above the layers */
        .btn-text {
          position: relative;
          z-index: 2;
        }

        /* Hover effects */
        .cizzara-book-btn:hover {
          color: #ffffff;
          box-shadow: 0.5em 0.5em 0.5em rgba(0, 0, 0, 0.5);
        }

        .cizzara-book-btn:active {
          box-shadow: 0.2em 0.2em 0.3em rgba(0, 0, 0, 0.3);
          transform: translate(0.1em, 0.1em);
        }

        /* Moving border animation */
        @keyframes spin-border {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}