import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfilePage from '@/app/dashboard/page';
import { ProfilePageObject } from './dashboardoage';

vi.mock('next/dynamic', async () => {
  const actual = await vi.importActual('next/dynamic');
  return {
    ...actual,
    default: (fn: any) => fn,
  };
});

// در اینجا mock رو global انجام نمی‌دیم، توی هر تست شرایط متفاوت داریم
vi.mock('next-auth/react');

const mockedUseSession = vi.fn();
import { useSession } from 'next-auth/react';
(useSession as unknown as typeof mockedUseSession).mockImplementation(mockedUseSession);

describe('ProfilePage - Integration (Advanced)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays Unauthenticated component when session is unauthenticated', () => {
    mockedUseSession.mockReturnValue({ status: 'unauthenticated', data: null });

    render(<ProfilePage />);
    expect(screen.getByText(/you are not logged in/i)).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/email/i)).not.toBeInTheDocument();
  });

  it('shows Loading component when status is loading', () => {
    mockedUseSession.mockReturnValue({ status: 'loading', data: null });

    render(<ProfilePage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText(/you are not logged in/i)).not.toBeInTheDocument();
  });

  it('displays NoData if session is authenticated but fetch returns no user', async () => {
    mockedUseSession.mockReturnValue({ status: 'authenticated', data: {} });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => null,
    });

    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByText(/no user data/i)).toBeInTheDocument();
    });
  });

  it('renders full profile with correct user data', async () => {
    mockedUseSession.mockReturnValue({ status: 'authenticated', data: { user: { name: 'Ali' } } });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        email: 'ali@example.com',
        phonenumber: '09121234567',
        address: 'Tehran',
      }),
    });

    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByText(/email/i)).toBeInTheDocument();
      expect(screen.getByText('ali@example.com')).toBeInTheDocument();
      expect(screen.getByText('09121234567')).toBeInTheDocument();
      expect(screen.getByText('Tehran')).toBeInTheDocument();
    });

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/you are not logged in/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/no user data/i)).not.toBeInTheDocument();
  });
});
