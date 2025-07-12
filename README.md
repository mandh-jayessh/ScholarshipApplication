#  Scholarship Application E2E

This Playwright-based test suite automates the complete scholarship application process for the **SDET Scholarship Program**.

It covers the full user journey—from landing on the application page to final submission—verifying both UI elements and data persistence at each stage.

##  Key Features

- Structured using the **Page Object Model (POM)** for maintainability and clarity.
- Validates field requirements, conditional elements, and form transitions.
- Ensures post-submission state locks editing and allows only view access.
- Uses `test steps` extensively for clear reporting and debugging.

##  Design Highlights

- **Test Flow** is self-contained and resilient to state changes, ensuring clean runs.
- **Conditional Essay Logic** validates checkbox-driven dynamic input rendering.
- **Assertions** are embedded across pages to confirm correct UI content and user data.
- **Generic Assertions** are used in select cases for flexible validation across components.
- **Submission Verification** ensures the review and final state match the inputs.
