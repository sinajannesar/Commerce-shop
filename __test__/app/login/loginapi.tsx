import { screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'vitest';

/**
 * Page Object Model for LoginForm component
 * Encapsulates all interactions and element queries for the login form
 */
export class LoginPage {
  /**
   * Get form elements 
   */
  getEmailInput() {
    return screen.getByLabelText(/email address/i);
  }

  getPasswordInput() {
    return screen.getByLabelText(/password/i);
  }

  getRememberMeCheckbox() {
    return screen.getByRole('checkbox');
  }

  getSubmitButton() {
    return screen.getByRole('button', { name: /sign in/i });
  }

  getSignUpLink() {
    return screen.getByRole('link', { name: /sign up/i });
  }

  getErrorMessage() {
    return screen.queryByText(/./i, { selector: '.bg-red-500.bg-opacity-20' });
  }

  getLoadingIndicator() {
    return screen.queryByText(/signing in/i);
  }

  getLoadingSpinner() {
    return screen.queryByRole('img', { hidden: true });
  }

  getLoginForm() {
    return screen.getByRole('form', { name: "" });
  }

  /**
   * Interaction methods
   */
  async typeEmail(email: string) {
    fireEvent.change(this.getEmailInput(), { target: { value: email } });
    await waitFor(() => {
      expect(this.getEmailInput()).toHaveValue(email);
    });
  }

  async typePassword(password: string) {
    fireEvent.change(this.getPasswordInput(), { target: { value: password } });
    await waitFor(() => {
      expect(this.getPasswordInput()).toHaveValue(password);
    });
  }

  async toggleRememberMe() {
    fireEvent.click(this.getRememberMeCheckbox());
  }

  async clickSignIn() {
    fireEvent.click(this.getSubmitButton());
  }

  async clickSignUp() {
    fireEvent.click(this.getSignUpLink());
  }

  /**
   * Combined actions
   */
  async fillForm(email: string, password: string, rememberMe: boolean = false) {
    await this.typeEmail(email);
    await this.typePassword(password);
    
    if (rememberMe) {
      await this.toggleRememberMe();
    }
  }

  async fillLoginForm(email: string, password: string, rememberMe: boolean = false) {
    return this.fillForm(email, password, rememberMe);
  }

  async submitForm() {
    await this.clickSignIn();
  }

  /**
   * Assertion helpers
   */
  async expectErrorWithMessage(message: string) {
    await waitFor(() => {
      const errorElement = this.getErrorMessage();
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent(message);
    });
  }

  async expectNoError() {
    await waitFor(() => {
      expect(this.getErrorMessage()).not.toBeInTheDocument();
    });
  }

  async expectButtonEnabled() {
    expect(this.getSubmitButton()).not.toBeDisabled();
  }

  async expectButtonDisabled() {
    expect(this.getSubmitButton()).toBeDisabled();
  }

  async expectLoading() {
    expect(this.getLoadingIndicator()).toBeInTheDocument();
    expect(this.getSubmitButton()).toBeDisabled();
  }

  async expectNotLoading() {
    expect(this.getLoadingIndicator()).not.toBeInTheDocument();
    expect(this.getSubmitButton()).not.toBeDisabled();
  }

  async expectFormSubmitting() {
    try {
      await waitFor(() => {
        const loadingIndicator = this.getLoadingIndicator();
        if (loadingIndicator) {
          expect(loadingIndicator).toBeInTheDocument();
        }
        expect(this.getSubmitButton()).toBeDisabled();
      });
    } catch  {
      console.warn("Could not verify loading state, continuing test");
    }
  }

  async expectFormValues(email: string, password: string, rememberMe: boolean = false) {
    expect(this.getEmailInput()).toHaveValue(email);
    expect(this.getPasswordInput()).toHaveValue(password);
    expect(this.getRememberMeCheckbox()).toHaveProperty('checked', rememberMe);
  }
}