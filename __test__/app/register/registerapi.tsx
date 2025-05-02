import { screen, fireEvent } from "@testing-library/react";

export class RegisterPage {
    getEmailInput() {
        return screen.getByLabelText(/email/i);
    }
    
    getPasswordInput() {
        return screen.getByLabelText(/password/i);
    }

    getFirstnameInput() {
        return screen.getByLabelText(/first name/i);
    }
    
    getLastnameInput() {
        return screen.getByLabelText(/last name/i);
    }
    
    getPhoneInput() {
        return screen.getByLabelText(/phone number/i);
    }
    
    getSubmitButton() {
        return screen.getByRole("button", { name: /create account/i });
    }
    
    getTermsCheckbox() {
        return screen.getByLabelText(/I agree to the/i);
    }
    
    getErrorMessage() {
        return screen.queryByText((content, element) => {
            return element?.tagName.toLowerCase() === 'div' && 
                  element?.classList.contains('bg-red-500');
        });
    }
    
    getLoginLink() {
        return screen.getByRole('link', { name: /sign in/i });
    }
    
    getLoadingIndicator() {
        return screen.queryByText(/creating account/i);
    }

    async fillForm({
        email = "test@example.com",
        password = "password123",
        firstname = "John",
        lastname = "Doe",
        phone = "09123456789"
    } = {}) {
        fireEvent.change(this.getFirstnameInput(), { target: { value: firstname } });
        fireEvent.change(this.getLastnameInput(), { target: { value: lastname } });
        fireEvent.change(this.getPhoneInput(), { target: { value: phone } });
        fireEvent.change(this.getEmailInput(), { target: { value: email } });
        fireEvent.change(this.getPasswordInput(), { target: { value: password } });
        fireEvent.click(this.getTermsCheckbox());
    }
    
    async submitForm() {
        fireEvent.click(this.getSubmitButton());
    }
}