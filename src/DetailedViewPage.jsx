import React, { useState } from 'react';
import { ChevronDown, Star, ClipboardCheck, Trophy, ExclamationCircle, BarChart } from 'react-bootstrap-icons';

const DetailedViewPage = () => {
  if (!selectedCandidate) return null;

  // State for accordion items
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Toggle accordion item
  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  // Function to determine badge color based on score percentage
  const getBadgeClass = (percentage) => {
    if (percentage >= 80) return 'badge-green';
    if (percentage >= 60) return 'badge-amber';
    return 'badge-rose';
  };

  // Function to determine progress bar color
  const getProgressBarClass = (percentage) => {
    if (percentage >= 80) return 'progress-bar-green';
    if (percentage >= 60) return 'progress-bar-amber';
    return 'progress-bar-rose';
  };

  // Extract data function placeholder
  const extractData = () => {
    // This would extract data from the report
    console.log("Extracting data...");
  };

  return (
    <div className="main-container show">
      <style jsx>{`
        /* Main Container */
        .main-container {
          margin: 0 auto;
          display: none;
          position: relative;
          z-index: 1;
        }

        .main-container.show {
          display: block;
          animation: fadeInUp 0.6s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-main {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          border: none;
          background: white;
        }

        .header-gradient {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          padding: 1rem;
          border-end-end-radius: 5px;
          border-end-start-radius: 5px;
          position: relative;
          overflow: hidden;
        }

        .header-gradient h1 {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        /* Score Card */
        .score-card {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 2rem;
          text-align: center;
          border: 2px solid #bae6fd;
          box-shadow: 0 4px 14px rgba(56, 189, 248, 0.15);
          position: relative;
          overflow: hidden;
        }

        .score-card::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(56, 189, 248, 0.1) 0%,
            transparent 70%
          );
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .score-number {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          position: relative;
          z-index: 1;
        }

        .score-label {
          color: #0369a1;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          position: relative;
          z-index: 1;
        }

        /* Assessment Cards */
        .assessment-card {
          background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
          padding: 2rem;
          border: 2px solid #fde047;
          height: 100%;
          box-shadow: 0 4px 14px rgba(250, 204, 21, 0.15);
        }

        .strength-card {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          padding: 2rem;
          border: 2px solid #86efac;
          height: 100%;
          box-shadow: 0 4px 14px rgba(34, 197, 94, 0.15);
        }

        .gap-card {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          padding: 2rem;
          border: 2px solid #fecaca;
          height: 100%;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.15);
        }

        .card-title-custom {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }

        .assessment-card .card-title-custom {
          color: #854d0e;
        }
        .strength-card .card-title-custom {
          color: #14532d;
        }
        .gap-card .card-title-custom {
          color: #7f1d1d;
        }

        .assessment-card .card-title-custom i {
          color: #ca8a04;
        }
        .strength-card .card-title-custom i {
          color: #16a34a;
        }
        .gap-card .card-title-custom i {
          color: #dc2626;
        }

        /* List Items */
        .list-item {
          display: flex;
          align-items: start;
          font-size: 0.9375rem;
          color: #374151;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.6);
          transition: all 0.2s ease;
        }

        .list-item:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateX(4px);
        }

        .list-item:last-child {
          margin-bottom: 0;
        }

        .check-icon {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          margin-right: 0.875rem;
          flex-shrink: 0;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .cross-icon {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          margin-right: 0.875rem;
          flex-shrink: 0;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        /* Section Title */
        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
        }

        .section-title i {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-right: 0.75rem;
          font-size: 1.75rem;
        }

        /* Accordion */
        .accordion-item {
          border: 2px solid #f3f4f6;
          overflow: hidden;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .accordion-item:hover {
          border-color: #e5e7eb;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .accordion-button {
          background: #fafafa !important;
          color: #1f2937;
          font-weight: 600;
          padding: 1.5rem;
          border: none;
          font-size: 1rem;
          transition: all 0.3s ease;
          width: 100%;
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .accordion-button:not(.collapsed) {
          background: linear-gradient(
            135deg,
            #f9fafb 0%,
            #f3f4f6 100%
          ) !important;
          color: #1f2937;
          box-shadow: none;
        }

        .accordion-button:focus {
          box-shadow: none;
        }

        .accordion-button::after {
          background-image: none;
          content: "\\F282";
          font-family: "bootstrap-icons";
          color: #9ca3af;
          font-size: 1.25rem;
          transition: transform 0.3s ease;
        }

        .accordion-button:not(.collapsed)::after {
          transform: rotate(180deg);
          color: #3b82f6;
        }

        .accordion-body {
          padding: 0 1.5rem 1.5rem;
          background: white;
        }

        /* Badges */
        .badge-score {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          border-radius: 20px;
        }

        .badge-green {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
          border: 2px solid #6ee7b7;
        }

        .badge-amber {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
          border: 2px solid #fcd34d;
        }

        .badge-rose {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
          border: 2px solid #fca5a5;
        }

        /* Progress Bar */
        .progress {
          height: 10px;
          background: #f3f4f6;
          margin-bottom: 1.25rem;
          overflow: hidden;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
          border-radius: 5px;
        }

        .progress-bar-green {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
        }
        .progress-bar-amber {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
        }
        .progress-bar-rose {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
        }

        .eval-text {
          font-size: 0.9375rem;
          color: #4b5563;
          line-height: 1.7;
          padding: 1rem;
          background: #f9fafb;
          border-left: 4px solid #3b82f6;
        }

        /* Back button */
        .back-button {
          margin-bottom: 1.5rem;
          color: #3b82f6;
          font-weight: 600;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .back-button:hover {
          color: #2563eb;
        }
      `}</style>

      <div className="card card-main">
        <div className="header-gradient">
          <h1>
            <Star className="bi bi-star-fill me-2" />
            Candidate Evaluation Report
          </h1>
        </div>
        <div className="card-body content-area">
          <div className="back-button" onClick={() => setCurrentPage('list')}>
            ← Back to List
          </div>
          
          <div className="row g-4 mb-4">
            <div className="col-lg-4">
              <div className="score-card rounded-3">
                <div className="score-number">{selectedCandidate.overallScore}/{selectedCandidate.maxScore}</div>
                <div className="score-label">Overall Score</div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="assessment-card rounded-3">
                <h5 className="card-title-custom">
                  <ClipboardCheck className="bi bi-clipboard-check me-2" />
                  Overall Assessment
                </h5>
                <p>{selectedCandidate.assessment}</p>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-lg-6">
              <div className="strength-card rounded-3">
                <h5 className="card-title-custom">
                  <Trophy className="bi bi-trophy-fill me-2" />
                  Key Strengths
                </h5>
                <div id="strengthsList">
                  {selectedCandidate.strengths.map((strength, idx) => (
                    <div key={idx} className="list-item">
                      <div className="check-icon">✓</div>
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="gap-card rounded-3">
                <h5 className="card-title-custom">
                  <ExclamationCircle className="bi bi-exclamation-circle-fill me-2" />
                  Areas for Improvement
                </h5>
                <div id="gapsList">
                  {selectedCandidate.gaps.map((gap, idx) => (
                    <div key={idx} className="list-item">
                      <div className="cross-icon">✕</div>
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <h4 className="section-title">
            <BarChart className="bi bi-bar-chart-fill" />
            Detailed Evaluation
          </h4>

          <div className="accordion" id="evaluationAccordion">
            {Object.entries(selectedCandidate.details).map(([key, data]) => {
              const percentage = Math.round((data.score / data.max) * 100);
              const isActive = activeAccordion === key;
              
              return (
                <div key={key} className="accordion-item">
                  <button 
                    className={`accordion-button ${isActive ? '' : 'collapsed'}`}
                    onClick={() => toggleAccordion(key)}
                  >
                    <span>{data.title || key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <ChevronDown className={`ms-2 ${isActive ? 'rotate-180' : ''}`} />
                  </button>
                  {isActive && (
                    <div className="accordion-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted">Score: {data.score}/{data.max}</span>
                        <span className={`badge-score ${getBadgeClass(percentage)}`}>
                          {percentage}%
                        </span>
                      </div>
                      <div className="progress">
                        <div 
                          className={`progress-bar ${getProgressBarClass(percentage)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="eval-text">
                        {data.description}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="extract-data mb-5" id="extractData">
            <button
              className="btn btn-primary w-100 p-3 rounded-3 text-uppercase"
              onClick={extractData}
            >
              Extract Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedViewPage;