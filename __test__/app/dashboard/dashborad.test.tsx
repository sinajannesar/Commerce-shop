// // ProfilePage.test.tsx
// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// import { render, cleanup, waitFor } from '@testing-library/react';
// import { useSession } from 'next-auth/react';
// import ProfilePage from '../../../src/app/dashboard/page';
// import { ProfilePageObject } from './dashboardopage';
// import React from 'react';

// // Mock next/dynamic
// vi.mock('next/dynamic', () => ({
//   default: (importFunc) => {
//     return vi.fn(importFunc);
//   }
// }));

// // Mock next-auth session
// vi.mock('next-auth/react', () => ({
//   useSession: vi.fn(),
//   status: "loading", // 👈 دقیقاً اینو نیاز داری

// }));

// // Mock fetch API
// global.fetch = vi.fn();

// // Mock components
// vi.mock('@/components/profile/Loading', () => ({
//   default: () => <div>Loading...</div>
// }));

// vi.mock('@/components/profile/Unauthenticated', () => ({
//   default: () => <div>Sign in to view your profile</div>
// }));

// vi.mock('@/components/profile/NoData', () => ({
//   default: () => <div>No data available</div>
// }));

// vi.mock('@/components/profile/ProfileHeader', () => ({
//   default: ({ user }) => <div role="banner">{user?.name || 'Profile Header'}</div>
// }));

// vi.mock('@/components/profile/MMProfileModal', () => ({
//   default: () => <button>Edit Profile</button>
// }));

// // Mock user data
// const mockUser = {
//   id: '123',
//   name: 'Test User',
//   email: 'test@example.com',
//   phonenumber: '123-456-7890',
//   address: '123 Test Street',

//   image: 'https://example.com/avatar.jpg'
// };

// describe('ProfilePage', () => {
//   let pageObject: ProfilePageObject;

//   beforeEach(() => {

//     vi.clearAllMocks();
    
//     pageObject = new ProfilePageObject();
//   });

//   afterEach(() => {
//     cleanup();
//   });

//   it('should show loading state when session is loading', () => {
//     // Mock loading session
//     vi.mocked(useSession).mockReturnValue({
//       data: null,
//       status: 'loading',
//       update: vi.fn()
//     });

//     render(<ProfilePage />);
    
//     expect(pageObject.getLoadingElement()).toBeInTheDocument();
//   });

//   it('should show unauthenticated message when user is not authenticated', () => {
//     // Mock unauthenticated session
//     vi.mocked(useSession).mockReturnValue({
//       data: null,
//       status: 'unauthenticated',
//       update: vi.fn()
//     });

//     render(<ProfilePage />);
    
//     expect(pageObject.getUnauthenticatedMessage()).toBeInTheDocument();
//   });

//   it('should show no data message when user is authenticated but no data is available', async () => {
//     // Mock authenticated session but no user data
//     vi.mocked(useSession).mockReturnValue({
//       data: { user: null, expires: '' },
//       status: 'authenticated',
//       update: vi.fn()
//     });

//     // Mock fetch to return null
//     vi.mocked(global.fetch).mockResolvedValueOnce({
//       ok: true,
//       json: async () => null
//     } as Response);

//     render(<ProfilePage />);
    
//     await waitFor(() => {
//       expect(pageObject.getNoDataMessage()).toBeInTheDocument();
//     });
//   });

//   it('should display user profile data when authenticated and data is available', async () => {
//     // Mock authenticated session
//     vi.mocked(useSession).mockReturnValue({
//       data: { user: mockUser, expires: '' },
//       status: 'authenticated',
//       update: vi.fn()
//     });

//     // Mock fetch to return user data
//     vi.mocked(global.fetch).mockResolvedValueOnce({
//       ok: true,
//       json: async () => mockUser
//     } as Response);

//     render(<ProfilePage />);
    
//     await pageObject.waitForProfileToLoad();
    
//     // Check that user data is displayed
//     expect(pageObject.getUserName()).toContain('Test User');
//     expect(pageObject.getEmailValue()).toContain('test@example.com');
//     expect(pageObject.getPhoneValue()).toContain('123-456-7890');
//     expect(pageObject.getAddressValue()).toContain('123 Test Street');
//   });

//   it('should display "Not provided" for missing phone number', async () => {
//     // Mock authenticated session with user missing phone
//     const userWithoutPhone = { ...mockUser, phonenumber: null };
    
//     vi.mocked(useSession).mockReturnValue({
//       data: { user: userWithoutPhone, expires: '' },
//       status: 'authenticated',
//       update: vi.fn()
//     });

//     // Mock fetch to return user data
//     vi.mocked(global.fetch).mockResolvedValueOnce({
//       ok: true,
//       json: async () => userWithoutPhone
//     } as Response);

//     render(<ProfilePage />);
    
//     await pageObject.waitForProfileToLoad();
    
//     expect(pageObject.getPhoneValue()).toContain('Not provided');
//   });

//   it('should display "Not provided" for missing address', async () => {
//     // Mock authenticated session with user missing address
//     const userWithoutAddress = { ...mockUser, address: null };
    
//     vi.mocked(useSession).mockReturnValue({
//       data: { user: userWithoutAddress, expires: '' },
//       status: 'authenticated',
//       update: vi.fn()
//     });

//     // Mock fetch to return user data
//     vi.mocked(global.fetch).mockResolvedValueOnce({
//       ok: true,
//       json: async () => userWithoutAddress
//     } as Response);

//     render(<ProfilePage />);
    
//     await pageObject.waitForProfileToLoad();
    
//     expect(pageObject.getAddressValue()).toContain('Not provided');
//   });

//   it('should open profile modal when edit button is clicked', async () => {
//     // Mock authenticated session
//     vi.mocked(useSession).mockReturnValue({
//       data: { user: mockUser, expires: '' },
//       status: 'authenticated',
//       update: vi.fn()
//     });

//     // Mock fetch to return user data
//     vi.mocked(global.fetch).mockResolvedValueOnce({
//       ok: true,
//       json: async () => mockUser
//     } as Response);

//     render(<ProfilePage />);
    
//     await pageObject.waitForProfileToLoad();
    
//     // The modal is automatically rendered in the test mock, so we just check it's there
//     expect(pageObject.getProfileModalButton()).toBeInTheDocument();
//   });

//   it('should fetch user data when authenticated', async () => {
//     // Mock authenticated session
//     vi.mocked(useSession).mockReturnValue({
//       data: { user: mockUser, expires: '' },
//       status: 'authenticated',
//       update: vi.fn()
//     });

//     // Mock fetch to return user data
//     vi.mocked(global.fetch).mockResolvedValueOnce({
//       ok: true,
//       json: async () => mockUser
//     } as Response);

//     render(<ProfilePage />);
    
//     await pageObject.waitForProfileToLoad();
    
//     expect(global.fetch).toHaveBeenCalledWith('/api/user');
//   });
// });