'use client';

import React from 'react';
import { ThemeProvider } from '@/ui/providers';
import { AIAssistantProvider } from '@/ui/providers/ai-assistant/AIAssistantProvider';
import { ToastProvider } from '@/ui/design-system/components/Toast';
import { Header, Footer, Breadcrumbs } from '@/ui/components/common';
import { AIAssistantButton } from '@/ui/components/ai-assistant/AIAssistantButton';
import { AIAssistantContainer } from '@/ui/components/ai-assistant/AIAssistantContainer';
import { sampleWorkflows } from '@/core/ai/workflows/sampleWorkflows';

// Debug the sample workflows
console.log('Sample workflows available:', sampleWorkflows);
console.log('Number of workflows:', sampleWorkflows.length);
sampleWorkflows.forEach(workflow => {
  console.log(`Workflow: ${workflow.id}, Steps: ${workflow.steps.length}`);
});

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider position="top-right">
        <AIAssistantProvider workflows={sampleWorkflows} audioBasePath="/audio">
          <div className="flex flex-col min-h-screen">
            <Header />
            <Breadcrumbs />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            
            {/* AI Assistant Components */}
            <AIAssistantButton />
            <AIAssistantContainer />
          </div>
        </AIAssistantProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}