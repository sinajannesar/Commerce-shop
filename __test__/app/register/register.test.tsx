import React from 'react'; 
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from "@testing-library/react";
import { RegisterPage } from "./registerapi";
import '@testing-library/jest-dom';

vi.mock("../../../schemas/registerschemas", () => ({
  formDataSchema: {
    safeParse: vi.fn().mockImplementation((data) => {
      if (data.email && !data.email.includes('@')) {
        return {
          success: false,
          error: {
            errors: [{ path: ['email'], message: 'Invalid email format' }]
          }
        };
      }
      if (data.password && data.password.length < 8) {
        return {
          success: false,
          error: {
            errors: [{ path: ['password'], message: 'Password too short' }]
          }
        };
      }
      if (data.phonenumber && data.phonenumber.length < 10) {
        return {
          success: false,
          error: {
            errors: [{ path: ['phonenumber'], message: 'Phone number too short' }]
          }
        };
      }
      return {
        success: true,
        data
      };
    })
  }
}));

// Import RegisterForm *after* mocking the schemas
import RegisterForm from "../../../src/components/vorodi/registerform/registerform"; 

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    route: '/',
    pathname: '',
    query: {},
    asPath: ''
  })
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn()
}));

vi.mock("next/head", () => ({
  default: ({ children }) => <>{children}</>
}));

global.fetch = vi.fn();

window.alert = vi.fn();

describe("RegisterForm", () => {
  let page: RegisterPage;
  
  beforeEach(() => {
      global.fetch = vi.fn();
      vi.resetAllMocks();
    render(<RegisterForm />);
    page = new RegisterPage();
  });

  it("renders registration form correctly", () => {
    expect(page.getFirstnameInput()).toBeDefined();
    expect(page.getLastnameInput()).toBeDefined();
    expect(page.getPhoneInput()).toBeDefined();
    expect(page.getEmailInput()).toBeDefined();
    expect(page.getPasswordInput()).toBeDefined();
    expect(page.getTermsCheckbox()).toBeDefined();
    expect(page.getSubmitButton()).toBeDefined();
    expect(page.getLoginLink()).toBeDefined();
  });

  it("allows users to fill out the form", async () => {
    await page.fillForm({
      email: "test@example.com",
      password: "securePassword123",
      firstname: "Jane",
      lastname: "Smith",
      phone: "09876543210"
    });

    expect(page.getFirstnameInput()).toHaveValue("Jane");
    expect(page.getLastnameInput()).toHaveValue("Smith");
    expect(page.getPhoneInput()).toHaveValue("09876543210");
    expect(page.getEmailInput()).toHaveValue("test@example.com");
    expect(page.getPasswordInput()).toHaveValue("securePassword123");
    expect(page.getTermsCheckbox()).toBeChecked();
  });

  it("shows loading state when form is submitted", async () => {

    (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(() => new Promise(resolve => setTimeout(() => {
      resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
    }, 100)));
    
    await page.fillForm();
    await page.submitForm();
    
    expect(page.getLoadingIndicator()).toBeDefined();
  });

  it("handles successful registration and redirects to dashboard", async () => {
    const { signIn } = await import('next-auth/react');
    
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
    
    await page.fillForm();
    await page.submitForm();
    
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith(
        'credentials',
        expect.objectContaining({
          email: "test@example.com",
          password: "password123",
          callbackUrl: '/dashboard'
        })
      );
    });
  });

  it("displays error message on registration failure", async () => {
    const errorMessage = "Email already exists";
    
    // Mock failed API response
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: errorMessage })
    });
    
    await page.fillForm();
    await page.submitForm();
    
    // The alert is mocked and should be called with the error message
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
  });

  it("validates form input before submission", async () => {
    // Fill form with invalid email and submit
    await page.fillForm({ email: "invalid-email" });
    await page.submitForm();
    
    // Form validation should prevent the fetch call
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("validates password length requirement", async () => {
    // Fill form with short password and submit
    await page.fillForm({ password: "short" });
    await page.submitForm();
    
    // Form validation should prevent the fetch call
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("validates phone number format", async () => {
    // Fill form with invalid phone number and submit
    await page.fillForm({ phone: "123" });
    await page.submitForm();
    
    // Form validation should prevent the fetch call
    expect(global.fetch).not.toHaveBeenCalled();
  });
});