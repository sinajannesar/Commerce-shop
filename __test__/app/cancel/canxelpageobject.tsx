import { screen, fireEvent } from "@testing-library/react";
import "@testing-library/react";
import { expect } from "vitest";

export class CancelPageObject {

    getCancelIcon() {
        return screen.getByRole('img', { hidden: true });
    }

    getHeading() {
        return screen.getByRole('heading', { name: /Payment Cancelled/i });
    }

    getMessage() {
        return screen.getByText(/Your payment process was cancelled./i);
    }

    getBackToHomeLink() {
        return screen.getByRole('link', { name: /Back to Home/i });
    }

    getTryAgainButton() {
        return screen.getByRole('button', { name: /Try Again/i });
    }

    // Actions
    clickBackToHomeLink() {
        fireEvent.click(this.getBackToHomeLink());
    }

    clickTryAgainButton() {
        fireEvent.click(this.getTryAgainButton());
    }

    // Assertions
    assertPageRendered() {
        expect(this.getCancelIcon()).toBeInTheDocument();
        expect(this.getHeading()).toBeInTheDocument();
        expect(this.getMessage()).toBeInTheDocument();
        expect(this.getBackToHomeLink()).toBeInTheDocument();
        expect(this.getTryAgainButton()).toBeInTheDocument();
    }

    assertBackToHomeLinkHref() {
        expect(this.getBackToHomeLink()).toHaveAttribute('href', '/');
    }

   


    
}