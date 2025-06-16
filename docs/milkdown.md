# **Building a Notion-like Markdown Editor with Milkdown Crepe: A Condensed Guide**

## **1\. Introduction to Building a Notion-like Editor with Milkdown Crepe**

Milkdown emerges as a powerful, plugin-driven, and headless What You See Is What You Get (WYSIWYG) Markdown editor framework.1 Its architecture is rooted in the robust capabilities of Prosemirror, which provides the foundation for rich-text editing, and Remark, which ensures accurate and reliable Markdown parsing and serialization.5 The core philosophy of Milkdown centers on its extensible plugin system. This modularity stands as a significant advantage, empowering developers to tailor and augment the editor's functionality comprehensively by incorporating or authoring plugins for diverse aspects such as syntax extensions, theming, user interface components, or bespoke features.1 As an open-source project distributed under the MIT license, Milkdown encourages community involvement and permits free utilization in various projects.5  
Within the Milkdown ecosystem, Milkdown Crepe (available as the @milkdown/crepe package) is positioned as the "ready to use" 6 or "out-of-the-box" 3 editor solution. It is built directly upon the Milkdown framework, designed to offer a fully-featured Markdown editing environment with minimal setup requirements. This makes Crepe an exceptionally suitable choice for developers aiming to integrate a sophisticated editor into their applications rapidly.6 Crepe achieves this ease of use by bundling a thoughtfully curated selection of common Milkdown plugins and UI components, thereby abstracting away much of the underlying complexity of the Milkdown core.3 Consequently, features such as interactive toolbars, intuitive slash commands, and various Markdown syntax extensions are readily available with little to no initial configuration effort.  
The characteristics of a "Notion-like" editor typically include a fluid, block-based editing paradigm, support for embedding rich content types (such as images, tables, and code blocks), intuitive slash commands for rapid content insertion, and often, capabilities for collaborative editing.9 Milkdown Crepe aligns well with these requirements. Its built-in features, such as BlockEdit for drag-and-drop block management and slash commands, ImageBlock for comprehensive image handling, Table support for structured data, and an interactive Toolbar for text formatting, directly address the functional expectations of a Notion-like interface.8 Furthermore, Crepe is designed with a "beautiful UI" and "modern design with multiple theme options," contributing to a polished user experience that mirrors the aesthetic standards of contemporary editors like Notion.8  
This guide provides a condensed pathway for developers, focusing on the practical application of Milkdown Crepe. It will cover the installation and initial setup, demonstrate how to leverage Crepe's built-in features, explain methods for customizing its appearance through theming, detail content management techniques, and finally, illuminate the avenues for extending its capabilities by tapping into Milkdown's broader plugin ecosystem. This approach aims to enable the creation of advanced, Notion-like functionalities while maintaining a focus on simple and easy development.  
The architectural design of Milkdown, featuring distinct layers from Core to Plugins, Components, and finally to encompassing Editors like Crepe 2, provides a flexible adoption curve for developers. Crepe, residing at the "Editors" layer, offers a high-level abstraction that simplifies initial development. Should the project's requirements evolve beyond Crepe's immediate offerings, developers can progressively engage with the lower, more granular layers (Components, Plugins, Core) for deeper customization and control. This inherent structure ensures that choosing Crepe for its initial convenience does not preclude future enhancements or highly specific feature implementations.  
Developers approaching Milkdown are often faced with a choice between @milkdown/kit for building an editor from the ground up, and @milkdown/crepe for a ready-to-use solution.6 While @milkdown/kit offers complete control and is suited for highly custom editor builds, @milkdown/crepe accelerates development for feature-rich applications like a Notion-style editor by pre-bundling many necessary functionalities. This guide focuses on Crepe, acknowledging that the underlying @milkdown/kit and core Milkdown system provide the foundation for its extensibility.

## **2\. Setting Up Your Milkdown Crepe Editor**

The setup process for Milkdown Crepe is designed to be straightforward, enabling developers to quickly integrate a feature-rich Markdown editor.

### **2.1. Installation**

The primary step involves installing the @milkdown/crepe package. This can be accomplished using a package manager like npm or yarn:

Bash

npm install @milkdown/crepe

or

Bash

yarn add @milkdown/crepe

.3 The @milkdown/crepe package conveniently bundles many essential Milkdown core plugins and UI components, which significantly simplifies the initial dependency management compared to constructing a Milkdown editor from its foundational parts using @milkdown/kit.8

### **2.2. Basic Instantiation (Example from `MilkdownEditor.tsx`)**

Once installed, the Crepe class needs to be imported. In a React environment like the one used in `MilkdownEditor.tsx`, this is often done within a component that utilizes Milkdown's React bindings (`@milkdown/react`).

TypeScript

// Simplified example based on MilkdownEditor.tsx
import { Crepe } from "@milkdown/crepe";
import { useEditor, MilkdownProvider } from '@milkdown/react';
import { listener, listenerCtx } from '@milkdown/plugin-listener';

// ... inside a React component
// const { loading } = useEditor((root) => {
//   const crepe = new Crepe({
//     root, // The root DOM element for the editor
//     defaultValue: "Initial Markdown content...",
//     features: { /* ... feature flags ... */ },
//     featureConfigs: { /* ... feature configurations ... */ },
//   });
//   // ... further setup like listeners ...
//   return crepe; // Important: useEditor expects the Crepe instance
// });

The constructor requires a root DOM element where the editor will be rendered. It also accepts an initial `defaultValue` for the editor's content (as a Markdown string) and `features` / `featureConfigs` objects to customize behavior.

### **2.3. Importing and Applying a Crepe Theme (Example from `MilkdownEditor.tsx`)**

Milkdown Crepe provides several pre-designed themes. The `MilkdownEditor.tsx` component specifically uses the "frame" theme. To apply a theme, import the necessary CSS files:

1.  **Common Base Styles:** Required for all Crepe themes.
    TypeScript
    import "@milkdown/crepe/theme/common/style.css";
2.  **Specific Theme Styles:** For the "frame" theme.
    TypeScript
    import "@milkdown/crepe/theme/frame.css";

These imports are typically placed at a high level, such as the component where the editor is initialized. The project also implements dynamic theme switching (light/dark) by adding/removing a `.dark` class on a wrapper element, which the theme CSS and custom CSS respond to.

### **2.4. Initializing and Destroying the Editor**

In a React context with `@milkdown/react`, the `useEditor` hook handles much of the creation and setup. The `Crepe` instance is returned by the `useEditor` callback. Milkdown's React components (`<Milkdown />` within `<MilkdownProvider />`) manage the rendering.

Destruction is also typically managed by the `useEditor` hook's lifecycle. If managing Crepe manually, the `destroy` method is crucial for cleanup.

## **3\. Leveraging Crepe's Built-in Features for a Notion-like UI/UX**

Milkdown Crepe comes "batteries-included." These features are primarily managed through the `features` and `featureConfigs` options in the Crepe constructor.8

### **3.1. Understanding `features` and `featureConfigs`**

*   **`features`**: Enables/disables built-in Crepe modules (e.g., `Crepe.Feature.CodeMirror: true`).
*   **`featureConfigs`**: Provides detailed configuration for enabled features.

**Features Enabled in `MilkdownEditor.tsx`:**

The `MilkdownEditor.tsx` component enables the following Crepe features:
*   `[Crepe.Feature.CodeMirror]: true`
*   `[Crepe.Feature.ListItem]: true`
*   `[Crepe.Feature.LinkTooltip]: true`
*   `[Crepe.Feature.ImageBlock]: true`
*   `[Crepe.Feature.BlockEdit]: true` (Enables slash commands and drag-and-drop)
*   `[Crepe.Feature.Table]: true`
*   `[Crepe.Feature.Toolbar]: true`
*   `[Crepe.Feature.Cursor]: true`
*   `[Crepe.Feature.Placeholder]: true`
*   `[Crepe.Feature.Latex]: true`

**Feature Configurations in `MilkdownEditor.tsx`:**

*   **Placeholder Text**:
    TypeScript
    featureConfigs: {
      [Crepe.Feature.Placeholder]: {
        text: 'Type / for commands, or start writing...', // Customizable placeholder
      },
      // ... other configs
    }
*   **Link Tooltip Placeholder**:
    TypeScript
    [Crepe.Feature.LinkTooltip]: {
      inputPlaceholder: 'Enter URL...',
    },
*   **Image Block Upload (Placeholder Implementation)**:
    TypeScript
    [Crepe.Feature.ImageBlock]: {
      onUpload: async (file: File) => {
        // NOTE: This is a placeholder implementation.
        // In a real application, upload the file to a server and return the URL.
        console.log("Uploading file:", file.name);
        return URL.createObjectURL(file); // Returns a local blob URL
      },
    },

The extensive example in the original version of this document for `CodeMirror` `featureConfigs` (like `languages` and `extensions`) is not explicitly used in `MilkdownEditor.tsx`; the component relies on the default CodeMirror setup provided by Crepe when the feature is enabled.

### **3.2. Block-Based Interactions (BlockEdit - `Crepe.Feature.BlockEdit`)**

Enabled in `MilkdownEditor.tsx`, this provides:
*   Drag-and-drop block management.
*   Slash commands (typing `/`).

### **3.3. Rich Content Elements & Formatting**

Most rich content elements are enabled by default when their respective `Crepe.Feature` flags are true.

*   **Text Formatting & Toolbar (`Crepe.Feature.Toolbar`)**: A floating toolbar for common formatting.
*   **List Management (`Crepe.Feature.ListItem`)**: Unordered, ordered, and task lists.
*   **Code Blocks (`Crepe.Feature.CodeMirror`)**: Uses CodeMirror for code editing. Specific language loading beyond Crepe's defaults is not configured in `MilkdownEditor.tsx`.
*   **Image Handling (`Crepe.Feature.ImageBlock`)**: Manages block images. The `MilkdownEditor.tsx` uses a basic `onUpload` handler that creates a local blob URL. For persistent storage, this uploader function would need to be replaced with actual server upload logic.
*   **Table Support (`Crepe.Feature.Table`)**: Full-featured table editing.
*   **Link Management (`Crepe.Feature.LinkTooltip`)**: Tooltip for creating/editing links. `MilkdownEditor.tsx` customizes the `inputPlaceholder`.
*   **Mathematical Expressions (`Crepe.Feature.Latex`)**: Supports LaTeX rendering (enabled in the primary `MilkdownEditor.tsx` component).
*   **Placeholders (`Crepe.Feature.Placeholder`)**: `MilkdownEditor.tsx` sets custom placeholder text.

The following table summarizes key features enabled in `MilkdownEditor.tsx`:

| Crepe.Feature Key | Enabled in `MilkdownEditor.tsx` | Custom Config in `MilkdownEditor.tsx` | Notes |
| :---- | :---- | :---- | :---- |
| CodeMirror | Yes | No specific language loading; uses Crepe defaults. | Essential for code blocks. |
| ListItem | Yes | None | For bullet, ordered, task lists. |
| LinkTooltip | Yes | `inputPlaceholder: 'Enter URL...'` | Enhances link editing. |
| ImageBlock | Yes | Basic `onUpload` returning local blob URL. | Needs real uploader for persistence. |
| BlockEdit | Yes | None | For slash commands and drag-and-drop. |
| Table | Yes | None | For structured data. |
| Toolbar | Yes | None | Floating text formatting toolbar. |
| Cursor | Yes | None | Enhanced drop/gap cursor. |
| Placeholder | Yes | `text: 'Type / for commands, or start writing...'` | Guides users. |
| Latex | Yes | None | For mathematical formulas. |

## **4\. Theming and Styling Your Crepe Editor**

Milkdown Crepe offers a flexible theming system. `MilkdownEditor.tsx` uses Crepe's "frame" theme and applies custom styling for a unique look and feel.

### **4.1. Using Pre-built Crepe Themes (as in `MilkdownEditor.tsx`)**

`MilkdownEditor.tsx` imports:
1.  `@milkdown/crepe/theme/common/style.css` (Base styles)
2.  `@milkdown/crepe/theme/frame.css` (Frame theme styles)

It also supports dynamic light/dark mode by toggling a `.dark` class on a wrapper element, which both Crepe's theme and the custom CSS can adapt to.

### **4.2. Customizing with CSS Variables and Project-Specific Styles (`milkdown-custom.css`)**

This project utilizes a dedicated stylesheet, `components/styles/milkdown-custom.css`, for significant theme customization and specific styling of editor elements. This file works in conjunction with the imported Crepe theme.

**Key aspects of `milkdown-custom.css`:**

*   **CSS Variable Overrides**:
    *   It redefines Crepe's CSS variables (e.g., `--crepe-color-primary`, `--crepe-font-default`) for both light and dark themes (`.crepe.milkdown` and `.crepe.milkdown.dark` scopes). This tailors the color scheme, typography (using 'Inter' and 'JetBrains Mono'), spacing, and shadows to the project's design.
*   **Editor Layout and Container Styling**:
    *   Custom styles are applied to `.milkdown-wrapper` (full height, flex layout) and `.milkdown` (max-width, padding, overflow).
*   **ProseMirror Element Styling**:
    *   Detailed styling for headings (`h1`, `h2`, `h3`), lists (`ul`, `ol`, `li`, task-list-item), code blocks (`pre`, `code`), blockquotes, tables, links, images, and horizontal rules. These ensure consistent typography, margins, padding, and borders.
*   **Custom Styling for Crepe UI Components**:
    *   The floating toolbar (`.crepe-toolbar`), slash command menu (`.crepe-slash-menu`), link tooltip (`.crepe-link-tooltip`), and block drag handle (`.crepe-block-handle`) receive custom styling to match the application's aesthetic.
*   **Specific Feature Styling**:
    *   Styles for LaTeX/math elements (`.math-inline`, `.math-block`).
    *   Custom selection color.
    *   Loading indicator (`.editor-loading`).
*   **Responsive Design**: Includes `@media (max-width: 768px)` rules for better display on smaller screens.
*   **Print Styles**: Defines `@media print` rules to optimize the editor content for printing by hiding UI elements.

This approach of using a base Crepe theme and then layering project-specific customizations via `milkdown-custom.css` allows for both leveraging Crepe's structured styling and achieving a unique brand identity.

### **4.3. Basic Milkdown Styling (Beyond Crepe Variables)**

As demonstrated in `milkdown-custom.css`, if Crepe's CSS variables don't offer enough control, developers can directly target Milkdown's structural classes (e.g., `.milkdown`, `.editor`) and the classes applied to specific Prosemirror nodes and marks (e.g., `.paragraph`, `.heading-1`, `.code-fence`).

### **4.4. Best Practices for Styling**

*   **Leverage CSS Variables**: Use Crepe's variables and override them as done in `milkdown-custom.css`.
*   **Responsive Design**: Implemented in `milkdown-custom.css`.
*   **Dark Mode Support**: Implemented via `.dark` class and specific CSS variable overrides in `milkdown-custom.css`.
*   **Accessibility (A11y)**: Maintain good contrast and readable fonts.
*   **Performance**: Keep selectors efficient.

## **5\. Core Configuration and Content Management**

This section covers how `MilkdownEditor.tsx` manages content and core editor behaviors.

### **5.1. Setting Initial Editor Content**

`MilkdownEditor.tsx` uses the `defaultValue` option in the `Crepe` constructor, passing its `initialMarkdown` prop:
TypeScript
const crepe = new Crepe({
  // ...
  defaultValue: initialMarkdown,
});

### **5.2. Getting Editor Content**

While not explicitly exposed as a prop, Crepe instances (like the one referenced internally in `MilkdownEditor.tsx`) have a `getMarkdown()` method.

### **5.3. Setting Editor Content Programmatically (After Initialization)**

`MilkdownEditor.tsx` handles changes to its `initialMarkdown` prop (after the initial mount) by using Milkdown's `replaceAll` command to update the editor content if it differs from the new prop value.
TypeScript
// Simplified logic from MilkdownEditor.tsx
// crepeInstance.editor.action((ctx) => {
//   const replaceCommand = replaceAll(newInitialMarkdown);
//   replaceCommand(ctx);
// });

### **5.4. Event Handling: Listening to Content Changes**

`MilkdownEditor.tsx` uses the `@milkdown/plugin-listener` to react to content changes. The `markdownUpdated` event is used to call the `onMarkdownChange` prop.
TypeScript
// Simplified from MilkdownEditor.tsx
// crepe.editor.use(listener);
// crepe.editor.config((ctx) => {
//   const listenerCtxInstance = ctx.get(listenerCtx);
//   listenerCtxInstance.markdownUpdated((_, markdown, prevMarkdown) => {
//     if (markdown !== prevMarkdown) {
//       onMarkdownChange(markdown); // Call the prop
//     }
//   });
// });

### **5.5. Read-Only Mode**

`MilkdownEditor.tsx` accepts a `readOnly` prop and uses `crepeInstance.setReadonly(readOnly)` to toggle editability.

### **5.6. Configuring Editor View Attributes (e.g., spellcheck)**

While powerful, `MilkdownEditor.tsx` does not currently use `editorViewOptionsCtx` for further low-level Prosemirror view configurations like custom spellcheck attributes. This remains a general Milkdown capability that could be added if needed.

## **6\. Extending Crepe: Pathways to Advanced Functionality**

While Milkdown Crepe (as used in `MilkdownEditor.tsx`) provides a rich set of features, its true potential for building a highly customized, Notion-like editor is unlocked by leveraging the underlying Milkdown core and its extensive plugin ecosystem. Crepe serves as an excellent starting point, and its `editor` property is the gateway to this deeper level of customization.8

### **6.1. Accessing the Underlying Milkdown Instance**
TypeScript
const editor = crepe.editor; // 'crepe' being the Crepe instance

Developers can use `editor.use(plugin)` or `editor.config(ctx => ...)` for advanced configurations not exposed by Crepe's constructor.

### **6.2. Integrating Additional Milkdown Plugins**

Milkdown has a rich ecosystem. The following are relevant for Notion-like features (some of these functionalities are already part of Crepe's bundled features):

| Plugin Name | NPM Package | Primary Purpose | Relevance/Relation to `MilkdownEditor.tsx` |
| :---- | :---- | :---- | :---- |
| GFM Preset | @milkdown/preset-gfm | Adds GitHub Flavored Markdown. | Crepe's `Table`, `ListItem` (task lists), etc., provide much of GFM. Direct use of GFM preset might be for ensuring full compatibility or specific GFM features not covered by Crepe features. |
| Slash Commands | @milkdown/plugin-slash | Highly customizable slash commands. | Crepe's `BlockEdit` feature provides slash commands. This plugin would be for *deeper customization* beyond Crepe's defaults. |
| Upload | @milkdown/plugin-upload | Advanced file/image uploads. | Crepe's `ImageBlock` has an `onUpload`. This plugin offers more control if the built-in one is insufficient. |
| Collaborative Editing | @milkdown/plugin-collab | Real-time collaborative editing via Y.js. | Not used in `MilkdownEditor.tsx` but a key advanced feature. |
| History | @milkdown/plugin-history | Undo/redo. | Crepe includes history functionality. |
| Clipboard | @milkdown/plugin-clipboard | Markdown copy/paste. | Crepe includes clipboard functionality. |

The other subsections (6.2.1 - Advanced Slash Commands, 6.2.2 - Custom File/Image Uploads, 6.2.3 - GFM, 6.2.4 - Collaborative Editing), 6.3 (Custom Syntax/Nodes), and 6.4 (Advanced Theming Beyond Crepe) from the original document remain valid as general guidance for extending Milkdown, even if not all are currently implemented in `MilkdownEditor.tsx`. They describe how one *could* extend the editor further.

## **7\. Conclusion and Next Steps**

Milkdown Crepe, as implemented in `MilkdownEditor.tsx`, offers an efficient way to build a feature-rich Markdown editor. The project successfully leverages Crepe's bundled functionalities, its "frame" theme, and then applies significant project-specific styling via `milkdown-custom.css` to achieve a unique and polished user interface.

The current implementation in `MilkdownEditor.tsx` provides a solid foundation. For future enhancements, such as a more robust image uploading mechanism or even collaborative editing, developers can utilize Milkdown's core plugin system as detailed in Section 6.

### **7.1. Pointers to Further Resources**

To continue your development journey with Milkdown and Crepe, the following resources are invaluable:

* **Official Milkdown Documentation (milkdown.dev)**: The primary source for guides, API references, and detailed information on core concepts, plugins, and theming.5  
* **Milkdown GitHub Repository**: For accessing the source code, reporting issues, participating in discussions, and observing the project's development.5  
* **Milkdown Examples Repository**: Contains practical code examples for various frameworks (including React and Vue integrations with Crepe) and plugin usages, offering concrete implementations to learn from.6  
* **Awesome Milkdown**: A curated list of community-developed plugins, tools, and other resources related to Milkdown, excellent for discovering additional functionalities and integrations.41

By combining the ease of use of Milkdown Crepe with the extensibility of the core Milkdown framework, developers are well-equipped to build powerful, modern, and highly customized Markdown editing experiences.

#### **Works cited**
(Citations from original document retained for reference)
1. Milkdown, accessed May 31, 2025, [https://milkdown.dev/](https://milkdown.dev/)  
2. Architecture Overview | Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/guide/architecture-overview](https://milkdown.dev/docs/guide/architecture-overview)  
3. Playground \- Milkdown, accessed May 31, 2025, [https://milkdown.dev/playground](https://milkdown.dev/playground)  
4. Playground \- Milkdown, accessed May 31, 2025, [https://milkdown.vercel.app/playground](https://milkdown.vercel.app/playground)  
5. Milkdown/milkdown: Plugin driven WYSIWYG markdown editor framework. \- GitHub, accessed May 31, 2025, [https://github.com/Milkdown/milkdown](https://github.com/Milkdown/milkdown)  
6. Getting Started \- Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/guide/getting-started](https://milkdown.dev/docs/guide/getting-started)  
7. @milkdown/core \- npm, accessed May 31, 2025, [https://www.npmjs.com/package/@milkdown/core](https://www.npmjs.com/package/@milkdown/core)  
8. Using Crepe Editor \- Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/guide/using-crepe](https://milkdown.dev/docs/guide/using-crepe)  
9. Liveblocks Notion-like AI Editor \- Vercel, accessed May 31, 2025, [https://vercel.com/templates/next.js/liveblocks-notion-like-ai-editor](https://vercel.com/templates/next.js/liveblocks-notion-like-ai-editor)  
10. Explore Our Notion-like Text Editor Feature \- SEOmatic, accessed May 31, 2025, [https://seomatic.ai/features/notion-like-text-editor](https://seomatic.ai/features/notion-like-text-editor)  
11. Svelte Milkdown, accessed May 31, 2025, [https://sveltethemes.dev/semanticdata/svelte-milkdown](https://sveltethemes.dev/semanticdata/svelte-milkdown)  
12. Plugin Slash \- Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/api/plugin-slash](https://milkdown.dev/docs/api/plugin-slash)  
13. Styling \- Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/guide/styling](https://milkdown.dev/docs/guide/styling)  
14. \[Bug\] Explicit language list for @milkdown/kit/component/code-block ..., accessed May 31, 2025, [https://github.com/Milkdown/milkdown/issues/1547](https://github.com/Milkdown/milkdown/issues/1547)  
15. ng-milkdown/README.md at main \- GitHub, accessed May 31, 2025, [https://github.com/ousc/ng-milkdown/blob/main/README.md](https://github.com/ousc/ng-milkdown/blob/main/README.md)  
16. How to use crepe editor with react · Milkdown · Discussion \#1498 \- GitHub, accessed May 31, 2025, [https://github.com/orgs/Milkdown/discussions/1498](https://github.com/orgs/Milkdown/discussions/1498)  
17. Code Block Component \- Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/api/component-code-block](https://milkdown.dev/docs/api/component-code-block)  
18. Total Studio – Serverless CRDT-Based Markdown Editor, accessed May 31, 2025, [https://blog.mi.hdm-stuttgart.de/index.php/2024/08/31/total-studio-serverless-crdt-based-markdown-editor/](https://blog.mi.hdm-stuttgart.de/index.php/2024/08/31/total-studio-serverless-crdt-based-markdown-editor/)  
19. What's new \- TagSpaces, accessed May 31, 2025, [https://www.tagspaces.org/whatsnew/](https://www.tagspaces.org/whatsnew/)  
20. Plugin Tooltip \- Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/api/plugin-tooltip](https://milkdown.dev/docs/api/plugin-tooltip)  
21. nanote/components/MilkdownEditor.vue at master \- GitHub, accessed May 31, 2025, [https://github.com/omarmir/nanote/blob/master/components/MilkdownEditor.vue](https://github.com/omarmir/nanote/blob/master/components/MilkdownEditor.vue)  
22. View npm: @toast-ui/editor-plugin-color-syntax | OpenText Core SCA \- Debricked, accessed May 31, 2025, [https://debricked.com/select/package/npm-@toast-ui/editor-plugin-color-syntax](https://debricked.com/select/package/npm-@toast-ui/editor-plugin-color-syntax)  
23. Toolbar | MDXEditor, accessed May 31, 2025, [https://mdxeditor.dev/editor/docs/customizing-toolbar](https://mdxeditor.dev/editor/docs/customizing-toolbar)  
24. Milkdown | Yjs Docs, accessed May 31, 2025, [https://beta.yjs.dev/docs/ecosystem/editor-bindings/milkdown/](https://beta.yjs.dev/docs/ecosystem/editor-bindings/milkdown/)  
25. Markdown as first class citizen \- Feature Discussion \- Vikunja Community, accessed May 31, 2025, [https://community.vikunja.io/t/markdown-as-first-class-citizen/2975](https://community.vikunja.io/t/markdown-as-first-class-citizen/2975)  
26. feat: add selectUpload config option to ImageBlock by geertplaisier ..., accessed May 31, 2025, [https://github.com/Milkdown/milkdown/pull/1559](https://github.com/Milkdown/milkdown/pull/1559)  
27. Issues · Milkdown/milkdown \- GitHub, accessed May 31, 2025, [https://github.com/Milkdown/milkdown/issues](https://github.com/Milkdown/milkdown/issues)  
28. massifrg/prosemirror-tables-sections: prosemirror-tables ... \- GitHub, accessed May 31, 2025, [https://github.com/massifrg/prosemirror-tables-sections](https://github.com/massifrg/prosemirror-tables-sections)  
29. Milkdown \- Examples \- StackBlitz, accessed May 31, 2025, [https://stackblitz.com/github/Milkdown/examples/tree/main/react-commonmark](https://stackblitz.com/github/Milkdown/examples/tree/main/react-commonmark)  
30. Preset GFM \- Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/api/preset-gfm](https://milkdown.dev/docs/api/preset-gfm)  
31. How to use Crepe with NextJS? · Milkdown · Discussion \#1670 \- GitHub, accessed May 31, 2025, [https://github.com/orgs/Milkdown/discussions/1670](https://github.com/orgs/Milkdown/discussions/1670)  
32. Theme Nord | Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/api/theme-nord](https://milkdown.dev/docs/api/theme-nord)  
33. FAQ \- Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/guide/faq](https://milkdown.dev/docs/guide/faq)  
34. Collaborative Editing \- Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/guide/collaborative-editing](https://milkdown.dev/docs/guide/collaborative-editing)  
35. Commands \- Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/guide/commands](https://milkdown.dev/docs/guide/commands)  
36. Macros \- Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/guide/macros](https://milkdown.dev/docs/guide/macros)  
37. React \- Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/recipes/react](https://milkdown.dev/docs/recipes/react)  
38. Setting the spellcheck language with lang attribute \- discuss.ProseMirror, accessed May 31, 2025, [https://discuss.prosemirror.net/t/setting-the-spellcheck-language-with-lang-attribute/1672](https://discuss.prosemirror.net/t/setting-the-spellcheck-language-with-lang-attribute/1672)  
39. How to add extra plugins to the crepe editor? · Milkdown ... \- GitHub, accessed May 31, 2025, [https://github.com/orgs/Milkdown/discussions/1432](https://github.com/orgs/Milkdown/discussions/1432)  
40. Using Plugins \- Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/plugin/using-plugins](https://milkdown.dev/docs/plugin/using-plugins)  
41. Milkdown/awesome: A curated list of awesome things ... \- GitHub, accessed May 31, 2025, [https://github.com/Milkdown/awesome](https://github.com/Milkdown/awesome)  
42. LittleSound/milkdown-plugin-image-picker \- GitHub, accessed May 31, 2025, [https://github.com/LittleSound/milkdown-plugin-image-picker](https://github.com/LittleSound/milkdown-plugin-image-picker)  
43. milkdown/plugin-upload \- NPM, accessed May 31, 2025, [https://www.npmjs.com/package/@milkdown/plugin-upload?activeTab=versions](https://www.npmjs.com/package/@milkdown/plugin-upload?activeTab=versions)  
44. @milkdown/plugin-upload \- npm, accessed May 31, 2025, [https://www.npmjs.com/package/@milkdown/plugin-upload](https://www.npmjs.com/package/@milkdown/plugin-upload)  
45. milkdown/preset-commonmark, accessed May 31, 2025, [https://milkdown.dev/docs/api/preset-commonmark](https://milkdown.dev/docs/api/preset-commonmark)  
46. Comparing Milkdown with other WYSIWYG editors \- LogRocket Blog, accessed May 31, 2025, [https://blog.logrocket.com/comparing-milkdown-other-wysiwyg-editors/](https://blog.logrocket.com/comparing-milkdown-other-wysiwyg-editors/)  
47. milkdown/plugin-collab, accessed May 31, 2025, [https://milkdown.dev/docs/api/plugin-collab](https://milkdown.dev/docs/api/plugin-collab)  
48. Why is my setup for 'Collaborative Editing' for milkdown plain working and not for Crepe (Vue 3)? \- Stack Overflow, accessed May 31, 2025, [https://stackoverflow.com/questions/79566451/why-is-my-setup-for-collaborative-editing-for-milkdown-plain-working-and-not-f](https://stackoverflow.com/questions/79566451/why-is-my-setup-for-collaborative-editing-for-milkdown-plain-working-and-not-f)  
49. Example Iframe Plugin | Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/plugin/example-iframe-plugin](https://milkdown.dev/docs/plugin/example-iframe-plugin)  
50. milkdown/transformer, accessed May 31, 2025, [https://milkdown.dev/docs/api/transformer](https://milkdown.dev/docs/api/transformer)  
51. How to create custom commands · Milkdown · Discussion \#331 \- GitHub, accessed May 31, 2025, [https://github.com/Milkdown/milkdown/discussions/331%E8%BF%99%E4%B8%AA%E9%93%BE%E6%8E%A5%E4%B8%AD%E7%9A%84thematicBreak%E8%BF%99%E4%B8%AA%E4%BB%A3%E8%A1%A8%E4%BB%80%E4%B9%88%E6%84%8F%E6%80%9D%E5%91%A2](https://github.com/Milkdown/milkdown/discussions/331%E8%BF%99%E4%B8%AA%E9%93%BE%E6%8E%A5%E4%B8%AD%E7%9A%84thematicBreak%E8%BF%99%E4%B8%AA%E4%BB%A3%E8%A1%A8%E4%BB%80%E4%B9%88%E6%84%8F%E6%80%9D%E5%91%A2)  
52. How to write a custom preset for milkdown \#878 \- GitHub, accessed May 31, 2025, [https://github.com/orgs/Milkdown/discussions/878](https://github.com/orgs/Milkdown/discussions/878)  
53. The power of Remark \- DEV Community, accessed May 31, 2025, [https://dev.to/ritek/the-power-of-remark-6h](https://dev.to/ritek/the-power-of-remark-6h)  
54. Callout Blocks \- Quarto, accessed May 31, 2025, [https://quarto.org/docs/authoring/callouts.html](https://quarto.org/docs/authoring/callouts.html)  
55. Admonitions | Docusaurus, accessed May 31, 2025, [https://docusaurus.io/docs/markdown-features/admonitions](https://docusaurus.io/docs/markdown-features/admonitions)  
56. Admonitions \- Material for MkDocs, accessed May 31, 2025, [https://squidfunk.github.io/mkdocs-material/reference/admonitions/](https://squidfunk.github.io/mkdocs-material/reference/admonitions/)  
57. Plugins 101 \- Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/plugin/plugins-101](https://milkdown.dev/docs/plugin/plugins-101)  
58. The official documentation website for milkdown. \- GitHub, accessed May 31, 2025, [https://github.com/Milkdown/website](https://github.com/Milkdown/website)  
59. @milkdown/crepe CDN by jsDelivr \- A CDN for npm and GitHub, accessed May 31, 2025, [https://www.jsdelivr.com/package/npm/@milkdown/crepe](https://www.jsdelivr.com/package/npm/@milkdown/crepe)  
60. Milkdown \- GitHub, accessed May 31, 2025, [https://github.com/Milkdown](https://github.com/Milkdown)  
61. milkdown/README.md at main \- GitHub, accessed May 31, 2025, [https://github.com/Milkdown/milkdown/blob/main/README.md](https://github.com/Milkdown/milkdown/blob/main/README.md)  
62. A list of examples to play with milkdown. \- GitHub, accessed May 31, 2025, [https://github.com/Milkdown/examples](https://github.com/Milkdown/examples)  
63. Milkdown \- Examples \- StackBlitz, accessed May 31, 2025, [https://stackblitz.com/edit/github-w8pjcn?file=README.md](https://stackblitz.com/edit/github-w8pjcn?file=README.md)  
64. Milkdown \- Examples \- StackBlitz, accessed May 31, 2025, [https://stackblitz.com/edit/github-m6dbwfwt](https://stackblitz.com/edit/github-m6dbwfwt)  
65. natsuki-engr/milkdown-examples \- GitHub, accessed May 31, 2025, [https://github.com/natsuki-engr/milkdown-examples](https://github.com/natsuki-engr/milkdown-examples)  
66. accessed December 31, 1969, [https://github.com/Milkdown/examples/tree/main/react-crepe](https://github.com/Milkdown/examples/tree/main/react-crepe)  
67. Plugin Prism \- Milkdown, accessed May 31, 2025, [https://milkdown.dev/docs/api/plugin-prism](https://milkdown.dev/docs/api/plugin-prism)  
68. Creating and highlighting code blocks \- GitHub Docs, accessed May 31, 2025, [https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks)  
69. How to enable syntax highlighting with markdown code \- Kong Support, accessed May 31, 2025, [https://support.konghq.com/support/s/article/how-to-enable-syntax-highlighting](https://support.konghq.com/support/s/article/how-to-enable-syntax-highlighting)  
70. CodeMirror Configuration Example, accessed May 31, 2025, [https://codemirror.net/examples/config/](https://codemirror.net/examples/config/)