import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import CancelPage from '../../../src/app/cancel/page'; // مسیر را بر اساس ساختار پروژه خود تنظیم کنید
import { CancelPageObject } from './canxelpageobject';

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

// Mock Buttoncancel component
vi.mock('../../../src/app/cancel/buttoncancel', () => ({
  default: () => (
    <button 
      onClick={() => window.history.back()}
      className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl"
    >
      Try Again
    </button>
  )
}));

describe('CancelPage', () => {
  let pageObject: CancelPageObject;
  let historyBackSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    historyBackSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});
    
    render(<CancelPage />);
    pageObject = new CancelPageObject();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders the cancel page correctly', () => {
    pageObject.assertPageRendered();
  });

  it('has a Back to Home link with correct href', () => {
    pageObject.assertBackToHomeLinkHref();
  });

  



  it('calls window.history.back when Try Again button is clicked', () => {
    pageObject.clickTryAgainButton();
    expect(historyBackSpy).toHaveBeenCalledTimes(1);
  });

  it('has proper responsive layout with flex classes', () => {
    const buttonsContainer = pageObject.getTryAgainButton().closest('div');
    expect(buttonsContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row');
  });

  
});