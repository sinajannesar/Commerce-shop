// __test__/pageObjects/ProfilePageObject.ts
import { screen } from '@testing-library/react';

export class ProfilePageObject {
  getLoading() {
    return screen.queryByText(/loading/i); // اگر تو کامپوننت Loading متن خاصی هست جایگزین کن
  }

  getUnauthenticatedComponent() {
    return screen.queryByText(/you are not logged in/i); // متن داخل Unauthenticated
  }

  getNoDataComponent() {
    return screen.queryByText(/no user data/i); // متن داخل NoData
  }

  getEmailField() {
    return screen.queryByText(/email/i);
  }

  getPhoneField() {
    return screen.queryByText(/phone/i);
  }

  getAddressField() {
    return screen.queryByText(/address/i);
  }
}
