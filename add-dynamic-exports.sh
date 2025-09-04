#!/bin/bash

# Add dynamic export to API routes that don't have it
echo "Adding dynamic exports to API routes..."

routes=(
  "/workspaces/TreeBio1/app/api/settings/sessions/route.ts"
  "/workspaces/TreeBio1/app/api/settings/route.ts"
  "/workspaces/TreeBio1/app/api/settings/update/route.ts"
  "/workspaces/TreeBio1/app/api/profile/route.ts"
  "/workspaces/TreeBio1/app/api/health/route.ts"
  "/workspaces/TreeBio1/app/api/shortener/route.ts"
  "/workspaces/TreeBio1/app/api/shortener/[shortCode]/route.ts"
  "/workspaces/TreeBio1/app/api/shortener/[shortCode]/stats/route.ts"
  "/workspaces/TreeBio1/app/api/archive/route.ts"
  "/workspaces/TreeBio1/app/api/archive/update/route.ts"
  "/workspaces/TreeBio1/app/api/social-links/route.ts"
  "/workspaces/TreeBio1/app/api/dashboard/route.ts"
  "/workspaces/TreeBio1/app/api/dashboard/realtime/route.ts"
  "/workspaces/TreeBio1/app/api/og-data/route.ts"
  "/workspaces/TreeBio1/app/api/debug/onboarding/route.ts"
  "/workspaces/TreeBio1/app/api/debug/env/route.ts"
  "/workspaces/TreeBio1/app/api/links/route.ts"
  "/workspaces/TreeBio1/app/api/links/update/route.ts"
)

for route in "${routes[@]}"; do
  if [ -f "$route" ]; then
    # Check if the file already has dynamic export
    if ! grep -q "export const dynamic.*force-dynamic" "$route"; then
      echo "Adding dynamic export to: $route"
      echo "" >> "$route"
      echo "export const dynamic = 'force-dynamic';" >> "$route"
    else
      echo "Already has dynamic export: $route"
    fi
  else
    echo "File not found: $route"
  fi
done

echo "Done!"
