export interface ComponentMeta {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export const components: ComponentMeta[] = [
  {
    id: "profile-dropdown",
    title: "Profile Dropdown Menu",
    description:
      "Click the avatar to open a menu that slides and fades in. Hover between items to see the highlight glide, flip the theme toggle, or open the nested submenu.",
    tags: ["Dropdown", "Hover highlight", "Toggle", "Submenu"],
  },
  {
    id: "settings-popover",
    title: "Settings Popover",
    description:
      "A floating settings panel with a draggable slider, toggle switches, and a color picker that confirms your choice with an animated checkmark.",
    tags: ["Popover", "Drag", "Toggle", "Selection"],
  },
  {
    id: "expandable-card",
    title: "Expandable Action Card",
    description:
      "Click the card to expand it and reveal a row of action buttons that stagger into view, each with its own hover and tap feedback.",
    tags: ["Layout animation", "Stagger", "Hover feedback"],
  },
  {
    id: "feedback-popover",
    title: "Two-Step Feedback Popover",
    description:
      "Open the feedback popover, rate your experience and leave a note, then watch it morph into an animated success state.",
    tags: ["Popover", "Multi-step", "Success animation"],
  },
  {
    id: "command-menu",
    title: "Command Menu",
    description:
      "Open a command palette, search to filter the list in real time, navigate with arrow keys, and select with a satisfying checkmark.",
    tags: ["Modal", "Keyboard nav", "Filtering", "Selection"],
  },
];
