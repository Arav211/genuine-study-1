import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export function TermsAndConditions({ onBack }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-white dark:bg-slate-950 p-6 md:p-12 overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold uppercase tracking-widest text-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1>Terms and Conditions</h1>
          <p>Last updated: May 16, 2026</p>
          
          <h2>1. Introduction</h2>
          <p>Welcome to Genuine Study. These Terms and Conditions govern your use of our application and services. By accessing or using Genuine Study, you agree to be bound by these terms.</p>

          <h2>2. Use of Service</h2>
          <p>Genuine Study is a platform designed to assist in learning and study organization. You agree to use the service only for lawful purposes and in a way that does not infringe the rights of others.</p>

          <h2>3. User Accounts</h2>
          <p>To use certain features, you must sign in via Google. You are responsible for maintaining the security of your account and for all activities that occur under your account.</p>

          <h2>4. AI Features Disclaimer</h2>
          <p>Genuine Study uses artificial intelligence to provide features like AI Organize, AI, and Flashcard generation. While we strive for accuracy, AI-generated content may sometimes be incorrect, incomplete, or biased. Users should verify important information independently.</p>

          <h2>5. User Content</h2>
          <p>You retain ownership of the notes, flashcards, and maps you create. However, by using the service, you grant us the right to process this data to provide and improve our AI features.</p>

          <h2>6. Limitation of Liability</h2>
          <p>Genuine Study is provided "as is" without any warranties. We shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our service.</p>

          <h2>7. Termination</h2>
          <p>We reserve the right to terminate or suspend your access to the service at our sole discretion, without notice, for conduct that we believe violates these Terms.</p>

          <h2>8. Changes to Terms</h2>
          <p>We may update these terms from time to time. Your continued use of the service after such changes constitutes acceptance of the new terms.</p>

          <h2>9. Contact</h2>
          <p>If you have any questions about these Terms, please contact us at arav26412@gmail.com.</p>
        </div>
      </div>
    </motion.div>
  );
}
