'use client';

import React from 'react';
import { ThemeProvider } from '@/ui/providers';
import { AIAssistantProvider } from '@/ui/providers/ai-assistant/AIAssistantProvider';
import { ToastProvider } from '@/ui/design-system/components/Toast';
import { Header, Footer, Breadcrumbs } from '@/ui/components/common';
import { NavbarAIButton } from '@/ui/components/ai-assistant';
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
            {/* Mobile floating AI button */}
            <div className="md:hidden fixed bottom-4 right-4 z-50">
              <NavbarAIButton />
            </div>
            <AIAssistantContainer />
          </div>
        </AIAssistantProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}