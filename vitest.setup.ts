
import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

expect.extend(matchers);

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/',
    query: {}
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

