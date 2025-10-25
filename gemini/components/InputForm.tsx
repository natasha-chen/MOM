import React, { useState, useRef } from 'react';

// Make TypeScript aware of the pdfjsLib loaded from the script tag
declare const pdfjsLib: any;

interface InputFormProps {
  onGenerate: (userInput: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
  const [userInput, setUserInput] = useState<string>('');
  const [isParsingPdf, setIsParsingPdf] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(userInput);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsingPdf(true);
    setUserInput(`Parsing ${file.name}...`);

    try {
      // Set worker source for pdf.js
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
          }
          setUserInput(fullText);
        } catch (error) {
           console.error('Error parsing PDF content:', error);
           setUserInput(`Sorry, there was an error reading the PDF file. Please copy and paste the text instead.`);
        } finally {
            setIsParsingPdf(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error setting up PDF reader:', error);
      setUserInput(`Sorry, there was an error reading the PDF file. Please copy and paste the text instead.`);
      setIsParsingPdf(false);
    } finally {
       // Reset file input value to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const isDisabled = isLoading || isParsingPdf;

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-shadow duration-200 resize-none placeholder-slate-400"
        placeholder="e.g., Finish Math assignment Chapter 3... or upload your syllabus PDF."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        disabled={isDisabled}
      />
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
         <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={handleFileSelect}
          disabled={isDisabled}
          className="w-full sm:w-auto px-6 py-2 border-2 border-sky-500 text-sky-600 font-bold rounded-lg hover:bg-sky-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          {isParsingPdf ? 'Processing PDF...' : 'Upload Syllabus (PDF)'}
        </button>
        <button
          type="submit"
          disabled={isDisabled || !userInput.trim()}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating your plan...
            </>
          ) : (
            "Ask MOM for a Plan"
          )}
        </button>
      </div>
    </form>
  );
};

export default InputForm;
