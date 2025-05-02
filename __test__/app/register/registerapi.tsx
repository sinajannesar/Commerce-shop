// import { screen, fireEvent } from "@testing-library/react";


// export class RegisterPage {
//     getEmailInput() {
//         return screen.getByLabelText(/email address/i);
//     }
//     getPasswordInput() {
//         return screen.getByLabelText(/password/i);
//     }
    
//     getFirstnameInput() {
//         return screen.getByLabelText(/first name/i);
//     }
//     getLastnameInput() {
//         return screen.getByLabelText(/last name/i);
//     }
//     getPhoneInput() {
//         return screen.getByLabelText(/phone number/i);
//     }
//     getSubmitButton() {
//         return screen.getByRole("button", { name: /sign up/i });
//     }
//     getErrorMessage() {
//         return screen.queryByText(/invalid credentials/i);
//     }

//     async fillForm(email: string, password: string, firstname: string, lastname: string, phone: string) {
//         fireEvent.change(this.getEmailInput(), { target: { value: email } });
//         fireEvent.change(this.getPasswordInput(), { target: { value: password } });
//         fireEvent.change(this.getFirstnameInput(), { target: { value: firstname } });
//         fireEvent.change(this.getLastnameInput(), { target: { value: lastname } });
//         fireEvent.change(this.getPhoneInput(), { target: { value: phone } });
//     }
//     async submitForm() {
//         fireEvent.click(this.getSubmitButton());
//     }
// }