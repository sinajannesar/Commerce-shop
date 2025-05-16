
// import { screen, waitFor, within } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';

// import { expect } from 'vitest';

// export class ProfilePageObject {

//   // Get main container elements
//   getProfileContainer = () => screen.getByRole('main', { name: /profile/i }) ||
//     screen.getByText(/profile/i).closest('div');

//   getLoadingElement = () =>
//     screen.queryByRole('status') ||
//     screen.queryByLabelText(/loading/i) ||
//     screen.queryByText(/loading/i);

    
//   getUnauthenticatedMessage = () => screen.queryByText(/sign in to view your profile/i);


//   getNoDataMessage = () => screen.queryByText(/no data available/i);

//   // Profile data sections
//   getProfileHeader = () => screen.queryByRole('banner') ||
//     screen.queryByText(/.+/i, { selector: 'h1,h2,h3' })?.closest('div');

//   getEmailSection = () => {
//     const emailLabel = screen.queryByText(/email/i);
//     return emailLabel?.closest('div');
//   };

//   getPhoneSection = () => {
//     const phoneLabel = screen.queryByText(/phone/i);
//     return phoneLabel?.closest('div');
//   };

//   getAddressSection = () => {
//     const addressLabel = screen.queryByText(/address/i);
//     return addressLabel?.closest('div');
//   };

//   // Get data values
//   getUserName = () => {
//     const header = this.getProfileHeader();
//     return header ? within(header).queryByText(/.+/i, { selector: 'h1,h2,h3' })?.textContent : null;
//   };

//   getEmailValue = () => {
//     const section = this.getEmailSection();
//     // Find the text that's not the label "Email"
//     return section ?
//       within(section).queryAllByText(/.+/i).find(el => el.textContent !== 'Email')?.textContent
//       : null;
//   };

//   getPhoneValue = () => {
//     const section = this.getPhoneSection();
//     return section ?
//       within(section).queryAllByText(/.+/i).find(el => el.textContent !== 'Phone')?.textContent
//       : null;
//   };

//   getAddressValue = () => {
//     const section = this.getAddressSection();
//     return section ?
//       within(section).queryAllByText(/.+/i).find(el => el.textContent !== 'Address')?.textContent
//       : null;
//   };

//   // Profile modal interactions
//   getProfileModalButton = () => screen.queryByRole('button', { name: /edit profile/i }) ||
//     screen.queryByText(/edit/i, { selector: 'button' });

//   openProfileModal = async () => {
//     const button = this.getProfileModalButton();
//     if (button) {
//       await userEvent.click(button);
//     }
//     return this.getProfileModal();
//   };

//   getProfileModal = () => screen.queryByRole('dialog');

//   // Wait for profile to load
//   waitForProfileToLoad = async () => {
//     await waitFor(() => {
//       expect(this.getLoadingElement()).not.toBeInTheDocument();
//     });
//   };
// }