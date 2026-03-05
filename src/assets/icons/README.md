# CodeNest Studio - Language Icons

## Overview

This directory contains locally-stored, open-source language icons used throughout CodeNest Studio. These icons are designed to be legally safe for commercial use.

## Icon Files

| File | Language | Extensions |
|------|----------|------------|
| `language-c.svg` | C | `.c`, `.h` |
| `language-python.svg` | Python | `.py`, `.pyw` |
| `language-java.svg` | Java | `.java` |
| `language-cpp.svg` | C++ | `.cpp`, `.cxx`, `.cc`, `.hpp`, `.hxx` |
| `language-javascript.svg` | JavaScript | `.js`, `.mjs`, `.jsx` |

## License & Attribution

All icons in this directory are:

- ✅ **Locally stored** - No CDN dependencies
- ✅ **Open-source licensed** - Based on [Devicon](https://devicon.dev/) (MIT License)
- ✅ **Dark theme compatible** - Original colors preserved, slight desaturation for harmony
- ✅ **Optimized SVG format** - No gradients or animations

### Devicon License (MIT)

```
MIT License

Copyright (c) 2023 Devicon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## Usage

### In React Components

```tsx
// Import icons directly
import cIcon from "@/assets/icons/language-c.svg";
import pythonIcon from "@/assets/icons/language-python.svg";

// Use in JSX
<img src={pythonIcon} alt="Python icon" className="h-6 w-6" />
```

### Using LanguageIcon Component

```tsx
import LanguageIcon from "@/components/ui/language-icon";

// By file extension
<LanguageIcon extension=".py" size="md" />

// By language name
<LanguageIcon language="python" size="lg" />
```

## Debranding Compliance

These icons comply with the CodeNest Studio debranding requirements:

- ❌ No "VS Code style icons"
- ❌ No references to other IDEs
- ❌ No copied UI assets
- ❌ No CDN icon usage
- ✅ Fully owned local assets
- ✅ Clean attribution in docs

## Adding New Icons

When adding new language icons:

1. Source from [Devicon](https://devicon.dev/) or create original SVGs
2. Ensure MIT or compatible license
3. Store as optimized SVG (no raster images)
4. Add to this README
5. Update `src/components/ui/language-icon.tsx` mappings
