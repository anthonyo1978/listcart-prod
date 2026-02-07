id: TICKET-0025
status: ready_for_dev

## Goal
Fix the server error occurring on mobile devices when clicking the "My ListCarts" section.

## Description
Users experience an "Application error: a server-side exception has occurred" with a digest code 1131819632 upon accessing "My ListCarts" on mobile. The issue prevents access to carts and impacts user experience.

## Requirements
- Investigate server-side logs corresponding to the error digest 1131819632.
- Identify and fix the root cause of the server-side exception affecting mobile access.
- Test on various mobile devices and browsers to ensure the section loads correctly.
- Verify that desktop access remains unaffected.

## Acceptance Criteria
- [ ] No server-side exceptions occur when accessing "My ListCarts" on mobile.
- [ ] "My ListCarts" loads successfully and shows user data on mobile and desktop.
- [ ] Issue is reproducible and test results are documented.
