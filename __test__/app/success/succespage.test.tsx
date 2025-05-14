
import React from 'react'; 
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import SuccessPage from '../../../src/app/success/page'; // Adjust if path is different
import { SuccessPageObject } from './succespageobject';
import * as useCartStore from '../../../src/lib/store/useCartStore';

// Mock useCartStore
vi.mock('@/lib/store/useCartStore', () => ({
  useCartStore: vi.fn(),
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe('SuccessPage', () => {
  let pageObject: SuccessPageObject;
  let mockClearCart: () => void;

  beforeEach(() => {
    mockClearCart = vi.fn();
    vi.mocked(useCartStore.useCartStore).mockReturnValue({
      clearCart: mockClearCart,
    });

    render(<SuccessPage />);
    pageObject = new SuccessPageObject();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders the success page correctly', async () => {
    await pageObject.assertPageRendered();
  });

  it('calls clearCart on mount', () => {
    expect(mockClearCart).toHaveBeenCalledTimes(1);
  });

  it('has a Continue Shopping link with correct href', () => {
    pageObject.assertLinkHref();
  });

  it('applies correct styles to the container', () => {
    const container = screen.getByText(/payment successful/i).closest('div');
    expect(container).toHaveClass('bg-[#1A223C]', 'rounded-xl', 'border', 'border-[#2A3454]', 'shadow-lg');
  });

  it('displays success icon with correct styles', () => {
    const iconContainer = pageObject.getSuccessIcon().closest('div');
    expect(iconContainer).toHaveClass('bg-green-500', 'rounded-full');
  });

  it('navigates to home when Continue Shopping is clicked', () => {
    const link = pageObject.getContinueShoppingLink();
    expect(link).toHaveAttribute('href', '/');
  });
});