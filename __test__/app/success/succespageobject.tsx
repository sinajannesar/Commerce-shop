import { screen, fireEvent } from "@testing-library/react";
import "@testing-library/react";
import { expect } from "vitest";

export class SuccessPageObject {
    getSuccessIcon() {
        return screen.getByRole('img', { hidden: true });
    }

    getHeading() {
        return screen.getByRole('heading', { name: /Payment Successful!/i });
    }

    getMessage() {
        return screen.getByText(/Thank you for your purchase./i);
    }

    getContinueShoppingLink() {
        return screen.getByRole("link", { name: /Continue Shopping/i });
    }

    clickContinueShoppingLink() {
        fireEvent.click(this.getContinueShoppingLink());
    }

    async assertPageRendered() {
        expect(this.getSuccessIcon()).toBeInTheDocument();
        expect(this.getHeading()).toBeInTheDocument();
        expect(this.getMessage()).toBeInTheDocument();
        expect(this.getContinueShoppingLink()).toBeInTheDocument();
    }

    assertLinkHref() {
        expect(this.getContinueShoppingLink()).toHaveAttribute('href', '/');
    }
}