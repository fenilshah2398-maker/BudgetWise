import { ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';

export default function NavigationButtons({ onPrev, onNext, isFirst, isLast, onFinish }) {
  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/50">
      {!isFirst ? (
        <button onClick={onPrev} className="btn-ghost">
          <ChevronLeft size={14} />
          Back
        </button>
      ) : (
        <div />
      )}

      {isLast ? (
        <button onClick={onFinish} className="btn-success">
          <BarChart3 size={14} />
          View Dashboard
        </button>
      ) : (
        <button onClick={onNext} className="btn-primary">
          Next
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
