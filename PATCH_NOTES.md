# Patch Notes

## Version 2

Version 2 is a global update focused on usability, responsive layout, typing flow, saved results, and visual design.

## Redesign

- Added a cleaner app layout with a centered shell.
- Added a redesigned test panel.
- Improved the typing text block with stronger contrast and better spacing.
- Updated buttons with clearer states, hover behavior, and disabled styling.
- Restyled the input area on desktop and tablet screens.
- Added JetBrains Mono as the global font for better readability.
- Improved spacing between text, counters, controls, and input.

## Typing Test

- Added random text selection on test start.
- Added more typing texts.
- Added correct and incorrect character highlighting.
- Added automatic scrolling inside the text block while typing.
- Added automatic input focus after starting a test.
- Added automatic test completion when the full text is typed.
- Prevented typing past the length of the original text.
- Disabled restart while a test is active.
- Made `Stop` visible only during an active test.
- Made `Restart` available after stopping or finishing a test.

## Statistics

- Added live typing time.
- Added characters per minute tracking.
- Added a smoother progress bar.
- Changed progress display to show decimal values, for example `23.23%`.
- Added a text character count for wider screens.

## Results

- Added a `Results` page.
- Added result saving in browser storage with `localStorage`.
- Saved result data includes typing time and characters per minute.
- Added a list of recent typing results.
- Added empty state for the results page.

## Navigation

- Added routing between `Speed Test` and `Results`.
- Added top navigation buttons.
- Kept routing lightweight without adding a new router dependency.

## Mobile And Responsive Updates

- Added responsive layout for large screens, laptops, tablets, and phones.
- Added compact styling for very narrow screens.
- Fixed layout overflow on `320px` screens.
- Improved navigation buttons on small screens.
- Improved counters so they stay inside the test panel.
- Hid the visual input on small phones while keeping typing available through focus.
- Kept input visible on tablet-sized screens.
- Reduced spacing and control sizes on very small screens.
- Removed unwanted vertical scrolling on wide screens.

## Logic Fixes

- Fixed `Stop` so it actually stops the test state.
- Fixed timer behavior after test completion.
- Fixed CPR so it does not keep dropping after the test ends.
- Fixed progress calculation so it updates from the current typed value.
- Fixed restart state reset.
- Made result saving safer so browser storage errors do not break test completion.
