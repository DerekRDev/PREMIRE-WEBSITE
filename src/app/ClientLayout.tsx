'use client';

import React from 'react';
import { ThemeProvider } from '@/ui/providers';
import { AIAssistantProvider } from '@/ui/providers/ai-assistant/AIAssistantProvider';
import { ToastProvider } from '@/ui/design-system/components/Toast';
import { Header, Footer, Breadcrumbs } from '@/ui/components/common';
import { AIAssistantButton } from '@/ui/components/ai-assistant/AIAssistantButton';
import { AIAssistantContainer } from '@/ui/components/ai-assistant/AIAssistantContainer';
import { allWorkflows } from '@/core/ai/workflows';

// Debug the available workflows
console.log('Workflows available:', allWorkflows);
console.log('Number of workflows:', allWorkflows.length);
allWorkflows.forEach(workflow => {
  console.log(`Workflow: ${workflow.id}, Steps: ${workflow.steps.length}`);
});

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider position="top-right">
        <AIAssistantProvider workflows={allWorkflows} audioBasePath="/audio">
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