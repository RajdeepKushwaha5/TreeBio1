import { BUILT_IN_TEMPLATES } from "@/lib/bio-templates";
import { TemplatePreview } from "@/components/template-preview";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette } from "lucide-react";

// Sample user data for template showcase
const sampleUserData = {
  name: "Alex Johnson",
  bio: "Digital creator, photographer, and coffee enthusiast. Sharing my journey through pixels and perspectives.",
  avatar: "",
  links: [
    {
      id: "1",
      title: "Photography Portfolio",
      url: "#",
      description: "View my latest work and projects",
    },
    {
      id: "2",
      title: "Creative Blog",
      url: "#",
      description: "Stories behind the shots",
    },
    {
      id: "3",
      title: "Coffee Reviews",
      url: "#",
      description: "Discovering the perfect brew",
    },
    {
      id: "4",
      title: "Contact & Booking",
      url: "#",
      description: "Let's work together",
    },
  ],
  socialLinks: [
    { platform: "github", url: "#" },
    { platform: "twitter", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "linkedin", url: "#" },
  ],
};

export default function TemplatesShowcasePage() {
  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Palette className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">TreeBio Templates</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose from our collection of professionally designed bio page
          templates. Each template is fully responsive and customizable to match
          your brand.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <Badge variant="secondary" className="text-sm">
            ✨ {BUILT_IN_TEMPLATES.length} Templates Available
          </Badge>
          <Badge variant="secondary" className="text-sm">
            📱 Mobile First Design
          </Badge>
          <Badge variant="secondary" className="text-sm">
            🎨 Fully Customizable
          </Badge>
          <Badge variant="secondary" className="text-sm">
            ⚡ Easy Template Switching
          </Badge>
        </div>
      </div>

      {/* Template Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BUILT_IN_TEMPLATES.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <Badge
                  variant="outline"
                  className={
                    template.category === "minimalist"
                      ? "bg-slate-100 text-slate-800"
                      : template.category === "vibrant"
                      ? "bg-pink-100 text-pink-800"
                      : template.category === "professional"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }
                >
                  {template.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </CardHeader>

            {/* Template Preview */}
            <div className="px-6 pb-6">
              <div className="relative bg-muted/30 rounded-lg p-4 overflow-hidden">
                <TemplatePreview
                  template={template}
                  userData={sampleUserData}
                  className="scale-75 origin-top w-[133%] -mx-[16.67%]"
                />
              </div>
            </div>

            {/* Template Features */}
            <div className="px-6 pb-6 pt-0">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {template.styles.fontFamily.split(",")[0]}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {template.styles.layout} layout
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {template.styles.buttonStyle} buttons
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {template.styles.shadowStyle} shadow
                  </Badge>
                </div>

                <div className="flex gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full border border-border"
                      style={{ backgroundColor: template.styles.primaryColor }}
                    />
                    <span className="text-muted-foreground">Primary</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full border border-border"
                      style={{ backgroundColor: template.styles.accentColor }}
                    />
                    <span className="text-muted-foreground">Accent</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="bg-muted/50 rounded-2xl p-8 mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Template System Features
          </h2>
          <p className="text-muted-foreground">
            Our template system is designed for flexibility and ease of use
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">Quick Switching</h3>
            <p className="text-sm text-muted-foreground">
              Change templates instantly without losing your content or
              customizations
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-xl">📱</span>
            </div>
            <h3 className="font-medium">Mobile First</h3>
            <p className="text-sm text-muted-foreground">
              All templates are designed mobile-first and look perfect on any
              device
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-xl">🎨</span>
            </div>
            <h3 className="font-medium">Customizable</h3>
            <p className="text-sm text-muted-foreground">
              Modify colors, fonts, layouts, and more to match your personal
              brand
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-xl">⚡</span>
            </div>
            <h3 className="font-medium">Performance</h3>
            <p className="text-sm text-muted-foreground">
              Lightweight and optimized for fast loading and smooth interactions
            </p>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="text-center space-y-8">
        <h2 className="text-2xl font-semibold">How Template Selection Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              1
            </div>
            <h3 className="font-medium">Choose Template</h3>
            <p className="text-sm text-muted-foreground">
              Browse our collection and select a template that matches your
              style and brand
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              2
            </div>
            <h3 className="font-medium">Preview & Customize</h3>
            <p className="text-sm text-muted-foreground">
              See how it looks with your content and customize colors, fonts,
              and layouts
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              3
            </div>
            <h3 className="font-medium">Go Live</h3>
            <p className="text-sm text-muted-foreground">
              Apply your template and share your beautiful bio page with the
              world
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
