# Tory Lysik Portfolio

A professional portfolio website built with SvelteKit, inspired by modern data journalism portfolios.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Navigate to the project directory:
```bash
cd portfolio-site
```

2. The dependencies are already installed, but if you need to reinstall:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 📝 Customizing Your Portfolio

### Adding Your Projects

Edit `src/routes/+page.server.ts` to add your real projects:

```typescript
const projects = [
  {
    slug: 'your-project-slug',           // URL-friendly name
    outlet: 'Publication Name',          // Where it was published
    title: 'Your Project Title',         // Main title
    description: 'Brief description',    // One-line summary
    thumbnail: '/images/project.jpg',    // Image path
    link: 'https://...'                  // Optional external link
  },
  // Add more projects...
];
```

Also update the same array in `src/routes/work/[slug]/+page.server.ts` to keep them in sync.

### Adding Project Images

1. Add your images to the `static` folder:
   - Create `static/images/` directory
   - Add project thumbnails there
   - Reference them as `/images/your-image.jpg`

2. Or use external URLs (as placeholders are currently used)

### Customizing Project Pages

Edit `src/routes/work/[slug]/+page.svelte` to:
- Add more sections
- Change the layout
- Include interactive visualizations
- Embed external content

### Changing Colors and Fonts

The main styles are in `src/routes/+page.svelte`. Key variables:

```css
/* Colors */
background: #fff;
color: #1a1a1a;
color: #666;  /* Secondary text */

/* Fonts */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...
```

### Adding More Pages

To add an About page:

1. Create `src/routes/about/+page.svelte`
2. Add navigation links in your layout

## 🏗️ Project Structure

```
portfolio-site/
├── src/
│   ├── routes/
│   │   ├── +page.svelte              # Homepage with project grid
│   │   ├── +page.server.ts           # Project data
│   │   └── work/
│   │       └── [slug]/
│   │           ├── +page.svelte      # Individual project page
│   │           └── +page.server.ts   # Project loading logic
│   ├── lib/                          # Reusable components (add as needed)
│   └── app.html                      # HTML template
├── static/                           # Static assets (images, fonts, etc.)
└── package.json
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect SvelteKit and configure everything

### Deploy to Netlify

1. Build the site:
```bash
npm run build
```

2. Install the adapter:
```bash
npm install -D @sveltejs/adapter-netlify
```

3. Update `svelte.config.js`:
```javascript
import adapter from '@sveltejs/adapter-netlify';
```

4. Deploy to Netlify via their CLI or drag-and-drop

### Deploy to GitHub Pages

1. Install the static adapter:
```bash
npm install -D @sveltejs/adapter-static
```

2. Update `svelte.config.js`:
```javascript
import adapter from '@sveltejs/adapter-static';
```

3. Build and deploy to GitHub Pages

## 🎨 Design Philosophy

This portfolio follows these principles from professional data journalism portfolios:

- **Visual-first**: Large, high-quality project images
- **Clean typography**: Clear hierarchy with readable fonts
- **Whitespace**: Generous spacing for breathing room
- **Subtle interactions**: Gentle hover effects, no distractions
- **Mobile-responsive**: Works beautifully on all devices
- **Fast loading**: Optimized images and minimal dependencies

## 📚 Learning Resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte Tutorial](https://svelte.dev/tutorial)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🔧 Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Type-check your code
```

## 📄 License

MIT - feel free to use this as a template for your own portfolio!

## ✨ Next Steps

1. Replace placeholder images with real project screenshots
2. Write detailed project case studies
3. Add an About page with your bio
4. Set up analytics (optional)
5. Add a contact form or email link
6. Optimize images for web
7. Deploy to production!

---

Built with ❤️ using SvelteKit
