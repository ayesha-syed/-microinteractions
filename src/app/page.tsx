import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import ComponentShowcase from "@/components/showcase/ComponentShowcase";
import { components } from "@/lib/components-data";

import ProfileDropdown from "@/components/demos/ProfileDropdown";
import SettingsPopover from "@/components/demos/SettingsPopover";
import ExpandableActionCard from "@/components/demos/ExpandableActionCard";
import FeedbackPopover from "@/components/demos/FeedbackPopover";
import CommandMenu from "@/components/demos/CommandMenu";
import {
  profileDropdownTsx,
  profileDropdownHtml,
} from "@/lib/code-snippets/profile-dropdown";
import {
  settingsPopoverTsx,
  settingsPopoverHtml,
} from "@/lib/code-snippets/settings-popover";
import {
  expandableActionCardTsx,
  expandableActionCardHtml,
} from "@/lib/code-snippets/expandable-action-card";
import {
  feedbackPopoverTsx,
  feedbackPopoverHtml,
} from "@/lib/code-snippets/feedback-popover";
import {
  commandMenuTsx,
  commandMenuHtml,
} from "@/lib/code-snippets/command-menu";

const registry: Record<
  string,
  { demo: React.ReactNode; code: { tsx: string; html: string } }
> = {
  "profile-dropdown": {
    demo: <ProfileDropdown />,
    code: { tsx: profileDropdownTsx, html: profileDropdownHtml },
  },
  "settings-popover": {
    demo: <SettingsPopover />,
    code: { tsx: settingsPopoverTsx, html: settingsPopoverHtml },
  },
  "expandable-card": {
    demo: <ExpandableActionCard />,
    code: { tsx: expandableActionCardTsx, html: expandableActionCardHtml },
  },
  "feedback-popover": {
    demo: <FeedbackPopover />,
    code: { tsx: feedbackPopoverTsx, html: feedbackPopoverHtml },
  },
  "command-menu": {
    demo: <CommandMenu />,
    code: { tsx: commandMenuTsx, html: commandMenuHtml },
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />

        <div className="mx-auto max-w-6xl divide-y divide-border/60 px-6">
          {components.map((component) => {
            const entry = registry[component.id];
            if (!entry) return null;
            return (
              <ComponentShowcase
                key={component.id}
                id={component.id}
                title={component.title}
                description={component.description}
                demo={entry.demo}
                code={entry.code}
              />
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
