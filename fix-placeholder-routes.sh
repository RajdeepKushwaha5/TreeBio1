#!/bin/bash

# Fix placeholder API routes
echo "Fixing placeholder API routes..."

placeholder_routes=(
  "/workspaces/TreeBio1/app/api/settings/sessions/route.ts"
  "/workspaces/TreeBio1/app/api/settings/route.ts"
  "/workspaces/TreeBio1/app/api/settings/update/route.ts"
  "/workspaces/TreeBio1/app/api/archive/route.ts"
  "/workspaces/TreeBio1/app/api/archive/update/route.ts"
  "/workspaces/TreeBio1/app/api/dashboard/route.ts"
  "/workspaces/TreeBio1/app/api/dashboard/realtime/route.ts"
  "/workspaces/TreeBio1/app/api/links/update/route.ts"
)

for route in "${placeholder_routes[@]}"; do
  if [ -f "$route" ] && grep -q "placeholder" "$route"; then
    echo "Fixing placeholder route: $route"
    
    # Get the route name from path for the response
    route_name=$(echo "$route" | sed 's|.*/api/||' | sed 's|/route.ts||')
    
    cat > "$route" << EOF
import { NextResponse } from 'next/server';

// TODO: Implement actual functionality for $route_name
export async function GET() {
  return NextResponse.json({
    message: "API endpoint not implemented yet",
    endpoint: "$route_name",
    status: "placeholder"
  }, { status: 501 });
}

export const dynamic = 'force-dynamic';
EOF
  fi
done

echo "All placeholder routes fixed!"
