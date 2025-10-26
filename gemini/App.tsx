
import React, { useState, useCallback } from 'react';
import { PlanItem } from './types';
import { generatePlan } from './services/geminiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import PlanDisplay from './components/PlanDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = useCallback(async (userInput: string, specifications: string, tone: string) => {
    if (!userInput.trim()) {
      setError('Please enter your tasks or syllabus.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setPlan([]);

    try {
      const generatedPlan = await generatePlan(userInput, specifications, tone);
      setPlan(generatedPlan);
    } catch (err) {
      console.error(err);
      setError('Sorry, I had trouble creating your plan. Please check your input or try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-serif text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-700 mb-2">What's on your plate today?</h2>
            <p className="text-slate-500 mb-6">
              Paste your syllabus, to-do list, or study goals below. Add any specifications and choose a notification tone to get a truly personalized plan MOM will create a balanced schedule to help you stay productive and feel your best.
            </p>
            <InputForm onGenerate={handleGeneratePlan} isLoading={isLoading} />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
              <strong className="font-bold">Oops! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <LoadingSpinner />
            </div>
          ) : (
            <PlanDisplay plan={plan} />
          )}
        </div>
      </main>
      <footer className="text-center py-4 text-slate-400 text-sm">
        <p>Built with ❤️ for your well-being.</p>
      </footer>
    </div>
  );
};

export default App;
