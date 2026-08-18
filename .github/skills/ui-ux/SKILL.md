UI/UX Skill — Booking App

Purpose
- Provide UI/UX guidance, patterns, accessibility checks, component suggestions, and design-system improvements for the Booking App frontends.

When to invoke
- Ask the agent to: "improve UI/UX", "review front-end components", "generate accessible form", "create responsive layout", or "design consistent component".

What this skill does
- Reviews UI components and markup for accessibility and responsiveness.
- Produces component templates, CSS/Tailwind patterns, and design tokens.
- Generates improvement tickets and a prioritized checklist.

Input
- A short description of the screen or component, plus links to relevant files (component path, templates, screenshots).

Output
- A set of recommended changes, a patch recommendation, accessibility report, and a checklist artifact (docs/skills/ui-ux-checklist.md).

Examples
- "Make the login form accessible and mobile-friendly using Tailwind in apps/admin/src/components/Login.vue"
- "Suggest a consistent header/nav pattern for apps/web/src"

Quality constraints
- Prefer minimal, backward-compatible changes.
- Prefer Tailwind classes when project uses Tailwind.

Usage
- Place this skill in the repository and invoke via Copilot/agent workflows or use as guidance for PR descriptions.
---
name: ui-ux
description: >
  Production-grade UI/UX design and implementation skill for the EZBook
  booking platform. Use this skill whenever creating, redesigning, refactoring,
  reviewing, or improving React/Tailwind interfaces, pages, components,
  booking flows, dashboards, forms, navigation, responsive layouts,
  accessibility, loading states, empty states, error states, animations,
  or overall visual polish.
---

# EZBook UI/UX Engineering Skill

## 1. Mission

Build interfaces for EZBook that feel like a polished, modern, trustworthy
booking product rather than a generic AI-generated dashboard.

Every UI change must optimize for:

1. Clarity
2. Usability
3. Visual hierarchy
4. Mobile responsiveness
5. Accessibility
6. Consistency
7. Performance
8. Conversion and task completion
9. Maintainability
10. Perceived quality

The interface should make the user's next action obvious.

Do not optimize for visual novelty at the expense of usability.

---

# 2. Project Context

EZBook is a service-booking platform.

Typical users include:

- Customers searching for services
- Customers discovering businesses
- Customers selecting services
- Customers selecting dates and times
- Customers making bookings
- Businesses managing services
- Businesses managing bookings
- Businesses managing availability
- Administrators managing the platform

Typical services may include:

- Hair salons
- Barbers
- Beauty salons
- Cosmetology
- Nail services
- Massage
- Wellness
- Personal care
- Other appointment-based services

The frontend uses:

- React
- Tailwind CSS
- REST APIs
- Responsive web design
- Component-based architecture

Before modifying UI, inspect the existing repository and identify:

- Existing components
- Existing layout components
- Existing design tokens
- Existing Tailwind configuration
- Existing typography
- Existing colors
- Existing icon library
- Existing form components
- Existing buttons
- Existing modals
- Existing tables
- Existing cards
- Existing loading components
- Existing notification/toast system
- Existing responsive breakpoints

Reuse existing components and conventions whenever possible.

Do not introduce a second design system unnecessarily.

---

# 3. Core Design Principle

Every screen must answer these questions immediately:

- Where am I?
- What can I do here?
- What is the most important action?
- What information matters most?
- What happens after I click?
- What happens if something fails?
- What happens if there is no data?

If the answer is not obvious, improve the hierarchy.

---

# 4. Never Produce Generic AI UI

Avoid the common "AI-generated SaaS dashboard" appearance.

Do NOT blindly use:

- Excessive rounded cards
- Excessive glassmorphism
- Huge gradients
- Random purple/blue gradients
- Excessive shadows
- Excessive pill-shaped controls
- Decorative blobs
- Unnecessary floating elements
- Giant hero sections
- Excessive whitespace
- Repetitive cards
- Arbitrary icons
- Random emojis
- Excessive animations
- Low-contrast gray text
- Five different button styles
- Five different border radiuses
- Inconsistent spacing

Do not add visual effects simply because they look impressive.

Every visual element must have a purpose.

---

# 5. Design System First

Before implementing a significant UI, inspect the existing design system.

Prefer existing:

- Colors
- Typography
- Spacing
- Border radius
- Shadows
- Buttons
- Inputs
- Selects
- Dialogs
- Dropdowns
- Tabs
- Cards
- Tables
- Toasts
- Icons

If design tokens do not exist, establish a small coherent system rather than
creating values independently in every component.

Use semantic concepts such as:

- primary
- secondary
- success
- warning
- danger
- info
- background
- surface
- foreground
- muted
- border

Do not scatter arbitrary hexadecimal colors throughout components.

---

# 6. Color

Use color to communicate hierarchy and meaning.

Primary color:
- Main brand actions
- Primary CTA
- Important interactive states

Success:
- Successful booking
- Confirmed status
- Completed actions

Warning:
- Pending states
- Attention required
- Availability concerns

Danger:
- Destructive actions
- Failed operations
- Cancellation consequences

Muted:
- Secondary information
- Metadata
- Supporting descriptions

Rules:

- Maintain sufficient contrast.
- Do not rely on color alone to communicate state.
- Status indicators should include text, icons, or other visual cues.
- Avoid using many saturated colors simultaneously.
- Preserve the brand identity throughout the application.

---

# 7. Typography

Typography must establish a clear hierarchy.

Typical hierarchy:

- Page title
- Section title
- Card title
- Body
- Supporting text
- Metadata
- Labels
- Helper/error text

Rules:

- Do not use many font sizes unnecessarily.
- Do not make every heading bold.
- Avoid long paragraphs with excessive line length.
- Use appropriate line height.
- Keep labels visually associated with their controls.
- Important values should be visually distinguishable.

For dashboards, prioritize scanability.

For customer-facing booking pages, prioritize readability and confidence.

---

# 8. Spacing

Use a consistent spacing scale.

Avoid arbitrary values unless there is a strong reason.

Prefer consistent relationships between:

- Page sections
- Cards
- Form fields
- Labels
- Buttons
- Icons
- Tables
- Navigation items

Whitespace should group related information and separate unrelated information.

Do not add whitespace merely to make a page look empty.

---

# 9. Responsive Design

All interfaces must be responsive.

Design mobile-first where practical.

Consider at minimum:

- Mobile
- Tablet
- Desktop
- Large desktop

Never assume desktop width.

Check:

- Navigation
- Tables
- Forms
- Dialogs
- Cards
- Date/time selectors
- Search
- Filters
- Buttons
- Pagination
- Sidebars

### Mobile rules

On small screens:

- Avoid horizontal overflow.
- Avoid tiny click targets.
- Stack complex forms when necessary.
- Convert dense tables into cards or horizontally scrollable regions where appropriate.
- Keep primary actions easy to reach.
- Avoid forcing users to zoom.
- Keep booking information readable.
- Preserve clear visual hierarchy.

Do not simply shrink the desktop UI.

Reconsider the layout for mobile.

---

# 10. Accessibility

Follow WCAG-oriented accessibility practices.

Every interactive element must be usable with:

- Keyboard
- Screen readers where appropriate
- Touch
- Different viewport sizes

Always consider:

- Semantic HTML
- Labels
- Accessible names
- Focus states
- Keyboard navigation
- Color contrast
- Error messages
- Form descriptions
- Disabled states
- Loading states
- Dialog focus management

Never use:

```text
<div onClick={...}>
```

when a semantic button or link is appropriate.

Prefer:

```text
<button>
<a>
<nav>
<main>
<section>
<header>
<footer>
<form>
<label>
```

Do not remove focus outlines without providing an equivalent accessible focus
indicator.

---

# 11. Buttons

Buttons must clearly communicate hierarchy.

Use a consistent hierarchy such as:

### Primary

For the most important action:

- Book appointment
- Save
- Confirm booking
- Create service
- Continue

### Secondary

For supporting actions:

- Cancel
- Edit
- View details
- Back

### Destructive

For dangerous actions:

- Delete
- Cancel booking
- Remove service

Rules:

- Button labels should describe the action.
- Prefer "Confirm booking" over "Submit".
- Prefer "Delete service" over "Yes".
- Do not use multiple primary buttons competing for attention.
- Disable buttons only when there is a clear reason.
- Show loading state during asynchronous actions.

---

# 12. Forms

Forms must be easy to complete.

Every form should consider:

- Label
- Input
- Placeholder
- Helper text
- Validation
- Error state
- Loading state
- Success state

Never use placeholders as the only labels.

Validation should be:

- Specific
- Human-readable
- Close to the problematic field
- Actionable

Bad:

> Invalid input.

Good:

> Enter a valid phone number, for example +998 90 123 45 67.

Avoid validating aggressively while the user is still typing unless there is a
clear UX benefit.

---

# 13. Booking UX

Booking is the core EZBook experience.

The booking flow should minimize cognitive load.

A typical booking flow should make these steps clear:

1. Select business
2. Select service
3. Select employee/provider if applicable
4. Select date
5. Select available time
6. Review booking
7. Confirm
8. Show confirmation

The user should always understand:

- What they selected
- Price
- Duration
- Date
- Time
- Provider
- Business
- Cancellation information when relevant

Never hide important booking information behind unnecessary interactions.

### Time selection

Available times should be visually obvious.

Unavailable times should:

- Look unavailable
- Not be clickable
- Have appropriate accessibility semantics

Selected time should have a strong visual state.

If there are no available slots, explain why and provide a useful next action.

Example:

> No appointments are available on this day. Try another date.

Avoid:

> No data found.

---

# 14. Booking Confirmation

Confirmation screens should provide confidence.

Clearly display:

- Booking status
- Business
- Service
- Date
- Time
- Provider
- Price
- Booking/reference identifier when appropriate

Provide useful next actions:

- View booking
- Add to calendar
- Contact business
- Return home
- Browse more services

Avoid celebration animations that delay the user.

---

# 15. Search and Discovery

Search should help users find services quickly.

Consider:

- Search
- Category
- Location
- Price
- Availability
- Rating
- Distance
- Service type

Do not expose every possible filter immediately.

Use progressive disclosure for advanced filters.

Search results should prioritize:

1. Relevance
2. Availability
3. Service/business information
4. Important metadata
5. Primary action

---

# 16. Cards

Cards should represent meaningful groups of information.

Do not put every element inside a card.

A card should have:

- Clear purpose
- Strong hierarchy
- Predictable interaction
- Appropriate padding
- Consistent radius
- Appropriate border/shadow

Avoid nested cards inside cards unless necessary.

---

# 17. Tables

Tables are appropriate for administrative workflows.

Use them for:

- Bookings
- Users
- Businesses
- Services
- Payments
- Reports
- Management data

Tables should provide:

- Clear column headings
- Appropriate alignment
- Status indicators
- Pagination when needed
- Sorting when useful
- Filtering when useful
- Empty state
- Loading state
- Error state

Do not put huge amounts of information into a single table row.

On mobile, prefer:

- Responsive transformation
- Horizontal scrolling when necessary
- Compact card representation

---

# 18. Dashboard UX

Admin/business dashboards should prioritize operational information.

The user should quickly understand:

- What needs attention
- Today's bookings
- Upcoming bookings
- Revenue or business metrics where applicable
- Pending actions
- Important alerts

Do not create ten KPI cards just because there is space.

Only show metrics that help the user make decisions.

Prioritize information by importance.

---

# 19. Navigation

Navigation should be predictable.

For admin interfaces, group related functionality.

Example:

- Overview
- Bookings
- Services
- Employees
- Availability
- Customers
- Payments
- Reports
- Settings

Do not create unnecessarily deep navigation.

Users should always know their current location.

Use:

- Active navigation state
- Breadcrumbs where useful
- Clear page titles
- Consistent navigation placement

---

# 20. Loading States

Never leave users staring at a blank page during asynchronous operations.

Use:

- Skeletons for content-heavy loading
- Spinners for short actions
- Button loading states for submissions
- Progress indicators for multi-step processes

Do not use a full-page spinner for every API request.

Prefer showing the structure of the page while content loads.

---

# 21. Empty States

Empty states are part of the product experience.

Never simply display:

> No data.

Instead explain:

1. What is empty
2. Why it may be empty
3. What the user can do next

Example:

> You don't have any bookings yet.
> Browse available services to make your first appointment.

Provide a relevant CTA when appropriate.

---

# 22. Error States

Errors must help users recover.

Never expose raw:

- Stack traces
- Axios errors
- Java exceptions
- HTTP implementation details
- Database errors

Instead translate technical errors into useful user-facing messages.

Bad:

> AxiosError: Request failed with status code 500

Good:

> We couldn't load your bookings. Please try again.

If retry is possible, provide:

> Try again

If user action is required, explain the action.

---

# 23. Notifications and Toasts

Use notifications intentionally.

Good use cases:

- Booking successfully created
- Service successfully updated
- Profile successfully saved
- Something failed
- Session expired

Avoid showing notifications for every tiny interaction.

Notifications should:

- Be readable
- Have appropriate severity
- Not block important content
- Not disappear too quickly
- Be accessible

---

# 24. Dialogs and Modals

Use dialogs only when the interaction benefits from temporary focus.

Good use cases:

- Confirmation
- Editing
- Destructive actions
- Focused forms

Avoid using dialogs for entire workflows that would be easier on a page.

Destructive confirmation should clearly explain consequences.

Example:

> Delete "Haircut"?
>
> This service will no longer be available for new bookings.

Actions:

- Cancel
- Delete service

Never make destructive actions ambiguous.

---

# 25. Icons

Use the project's existing icon library.

Do not introduce a new icon library without a reason.

Icons should support understanding, not replace meaningful labels.

Do not use icons purely as decoration everywhere.

For icon-only buttons:

- Provide an accessible label.
- Provide tooltip/help text where appropriate.
- Ensure adequate click/touch area.

---

# 26. Images

Use images where they improve:

- Business discovery
- Service discovery
- Trust
- Brand identity

Images should:

- Have appropriate aspect ratios
- Avoid layout shifts
- Have useful alt text when meaningful
- Use lazy loading where appropriate
- Provide fallback states

Do not use decorative stock imagery simply to fill empty space.

---

# 27. Animation and Micro-interactions

Animations should communicate state or improve perceived responsiveness.

Good uses:

- Hover states
- Focus transitions
- Modal transitions
- Expand/collapse
- Toast appearance
- Skeleton loading
- Booking step transitions

Avoid:

- Constant movement
- Excessive bouncing
- Long transitions
- Distracting page animations
- Animations that delay user actions

Keep transitions subtle and fast.

Respect reduced-motion preferences where appropriate.

---

# 28. Interaction States

Every interactive component should consider:

- Default
- Hover
- Focus
- Active
- Selected
- Disabled
- Loading
- Success
- Error

Do not implement only the default state.

---

# 29. API and Async UX

UI must reflect the actual API lifecycle.

For asynchronous operations, consider:

```text
idle
loading
success
error
empty
```

Never assume an API call always succeeds.

Prevent accidental duplicate submissions when necessary.

For booking creation and other important operations:

- Show progress
- Disable duplicate submission appropriately
- Handle failures
- Preserve user input when possible
- Confirm success explicitly

---

# 30. Performance

Do not sacrifice performance for visual effects.

Consider:

- Lazy loading
- Image optimization
- Component splitting
- Avoiding unnecessary renders
- Efficient lists
- Pagination
- Debounced search
- Avoiding excessive animation
- Avoiding unnecessary dependencies

Do not introduce a library for a problem that can be solved with the existing
stack.

---

# 31. Component Architecture

Prefer reusable components.

Good candidates include:

- Button
- Input
- Select
- DatePicker
- TimeSlot
- BookingCard
- ServiceCard
- BusinessCard
- StatusBadge
- Modal
- Drawer
- Toast
- EmptyState
- ErrorState
- LoadingSkeleton
- Pagination
- Table
- SearchBar
- FilterPanel

Avoid premature abstraction.

A component should be reusable when there is a real repeated pattern.

Do not create a generic component with dozens of props simply to avoid two
similar components.

---

# 32. Tailwind CSS Rules

Use Tailwind consistently with the project's existing configuration.

Prefer:

- Existing utility patterns
- Existing theme values
- Responsive utilities
- State variants
- Semantic component classes when already established

Avoid:

- Excessive arbitrary values
- Large repeated class strings
- Random colors
- Random spacing
- Random radius values
- Inline styles unless justified

If the same Tailwind pattern appears repeatedly, consider extracting a
component or shared class pattern.

---

# 33. Don't Break Existing Functionality

UI improvements must preserve:

- API behavior
- Authentication
- Authorization
- Routing
- Existing state management
- Form submission
- Booking logic
- Existing validation
- Existing business rules

Do not rewrite working business logic merely to change the UI.

Separate visual improvements from behavioral changes unless the task explicitly
requires both.

---

# 34. Before Changing Existing UI

First inspect:

1. The target component
2. Parent component
3. Related components
4. Routes
5. API/service layer
6. State management
7. Tailwind configuration
8. Existing reusable UI components
9. Related pages
10. Responsive behavior

Understand the existing implementation before modifying it.

Do not blindly replace the entire page.

---

# 35. UI Improvement Workflow

When asked to improve a UI, follow this process.

## Step 1 — Inspect

Understand the existing implementation.

## Step 2 — Identify UX problems

Look for:

- Poor hierarchy
- Confusing navigation
- Weak CTA
- Inconsistent spacing
- Poor mobile behavior
- Missing states
- Accessibility problems
- Excessive visual noise
- Poor form usability
- Weak error handling

## Step 3 — Plan

Define the improvements before making large changes.

## Step 4 — Reuse

Reuse existing components and design tokens.

## Step 5 — Implement

Make the smallest coherent set of changes.

## Step 6 — Validate

Check:

- Desktop
- Tablet
- Mobile
- Keyboard navigation
- Loading
- Empty
- Error
- Success
- Disabled
- Long text
- Long lists
- API failures

## Step 7 — Polish

Improve:

- Spacing
- Alignment
- Typography
- Interactive states
- Visual hierarchy
- Accessibility

## Step 8 — Verify

Run the project's appropriate:

- Build
- Type checking
- Linting
- Tests

Do not claim validation was performed if it was not.

---

# 36. UX Review Checklist

Before considering a UI task complete, verify:

### Visual

- [ ] Clear visual hierarchy
- [ ] Consistent spacing
- [ ] Consistent typography
- [ ] Consistent colors
- [ ] Consistent radius
- [ ] Consistent shadows
- [ ] No unnecessary decoration
- [ ] CTA is visually obvious

### UX

- [ ] User's next action is obvious
- [ ] Navigation is understandable
- [ ] Important information is easy to scan
- [ ] Forms are understandable
- [ ] Errors are actionable
- [ ] Empty states are useful
- [ ] Loading states exist
- [ ] Success states exist
- [ ] Destructive actions are clear

### Responsive

- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] No horizontal overflow
- [ ] Buttons are usable on touch
- [ ] Forms remain readable
- [ ] Tables have an appropriate mobile strategy

### Accessibility

- [ ] Semantic HTML
- [ ] Labels exist
- [ ] Keyboard navigation works
- [ ] Focus states exist
- [ ] Accessible names exist
- [ ] Color is not the only state indicator
- [ ] Contrast is sufficient
- [ ] Dialogs are accessible

### Engineering

- [ ] Existing components were reused
- [ ] Existing design tokens were reused
- [ ] No unnecessary dependency was introduced
- [ ] Existing functionality was preserved
- [ ] API behavior was preserved
- [ ] No obvious performance regression
- [ ] Build/lint/tests were checked when applicable

---

# 37. Decision Rules

When choosing between two UI implementations:

### Prefer the one that:

1. Requires fewer user actions
2. Makes the next action clearer
3. Works better on mobile
4. Has better accessibility
5. Uses existing components
6. Has fewer dependencies
7. Is easier to maintain
8. Communicates state more clearly
9. Has fewer unnecessary visual elements

Do not choose an implementation merely because it looks more sophisticated.

---

# 38. User-Centered Heuristics

Evaluate important screens using these questions:

### Visibility

Can users immediately see what is happening?

### Match

Does the interface use language users understand?

### Control

Can users easily undo, cancel, or go back?

### Consistency

Does the same action behave the same way everywhere?

### Prevention

Does the UI prevent avoidable mistakes?

### Recognition

Does the UI reduce the need to remember information?

### Recovery

Can users recover from errors easily?

### Efficiency

Can frequent users complete tasks quickly?

### Minimalism

Does every visible element justify its existence?

---

# 39. Booking-Specific UX Quality Bar

For any booking-related UI, the user should be able to answer:

> What am I booking?

> Where am I booking?

> With whom?

> When?

> How long?

> How much?

> What happens next?

If any of these are unclear, improve the interface.

---

# 40. Output Expectations When Working as an Agent

When implementing a UI task:

1. Inspect the existing code before modifying it.
2. Explain significant UX decisions briefly.
3. Make production-quality changes rather than mockups.
4. Preserve existing functionality.
5. Prefer reusable components.
6. Consider responsive behavior before finishing.
7. Implement all important UI states.
8. Avoid unnecessary dependencies.
9. Validate the implementation when tools are available.
10. Do not stop at making the page "work"; polish it until it feels coherent.

When asked to "make it beautiful", do not interpret that as permission to add
random gradients, animations, glassmorphism, or excessive decoration.

"Beautiful" means:

- Clear
- Balanced
- Consistent
- Modern
- Trustworthy
- Accessible
- Responsive
- Fast
- Easy to use

---

# 41. Explicit Invocation

This skill can be explicitly requested with:

```text
/ui-ux
```

Examples:

```text
/ui-ux Improve the booking page UX.
```

```text
/ui-ux Redesign the business dashboard for mobile.
```

```text
/ui-ux Review this page and identify UX problems before changing it.
```

```text
/ui-ux Make the booking flow feel more premium without changing business logic.
```

When explicitly invoked, follow this entire skill even if the task appears
small.