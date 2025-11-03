#!/bin/bash
set -e

echo "🚀 Starting deployment process..."

# 1. Build the Next.js application
echo "📦 Building Next.js app..."
cd next-app
pnpm build
cd ..

# 2. Clean up old files in the root directory
echo "🧹 Cleaning up old files..."
rm -rf index.html js fonts discography

# 3. Copy the build output to the root directory
echo "🚚 Copying new files to root..."
cp -r next-app/out/* .

# 4. Create .nojekyll file for GitHub Pages
echo "📄 Creating .nojekyll file..."
touch .nojekyll

echo "✅ Deployment script finished successfully!"
echo "👉 Please commit and push the changes to deploy to GitHub Pages."
