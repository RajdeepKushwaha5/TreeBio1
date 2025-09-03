"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brush, Palette, Wand2, Eye, RefreshCw, XIcon, Share2 } from "lucide-react";
import { ThemeCustomizer } from "@/components/theme/theme-customizer";
import { TemplateSelector } from "@/components/template-selector";
import { TemplatePreview } from "@/components/template-preview";
import { useTemplateManager } from "@/hooks/useTemplateManager";
import { TemplateConfig } from "@/lib/bio-templates";
import { ContentEditor } from "@/components/content-editor";
import { ShareProfile } from "@/components/share-profile";

interface DesignModalProps {
  children?: React.ReactNode;
  userData?: {
    name: string;
    bio: string;
    avatar: string;
    links: Array<{
      id: string;
      title: string;
      url: string;
      description?: string;
      isVisible?: boolean;
      order?: number;
    }>;
    socialLinks: Array<{
      id?: string;
      platform: string;
      url: string;
    }>;
  };
}

export function DesignModal({ children, userData: initialUserData }: DesignModalProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateConfig | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  
  // Enhanced user data state with proper defaults
  const [userData, setUserData] = useState(() => {
    if (initialUserData) {
      return {
        ...initialUserData,
        links: initialUserData.links.map((link, index) => ({
          ...link,
          isVisible: link.isVisible ?? true,
          order: link.order ?? index,
          id: link.id || `link-${Date.now()}-${index}`
        })),
        socialLinks: initialUserData.socialLinks.map((social, index) => ({
          ...social,
          id: social.id || `social-${Date.now()}-${index}`
        }))
      };
    }
    
    // Default data when no user data is provided
    return {
      name: "Your Name",
      bio: "Your bio description goes here. Share what you do and what you're passionate about.",
      avatar: "",
      links: [
        { 
          id: "default-1", 
          title: "My Portfolio", 
          url: "#", 
          description: "Check out my work",
          isVisible: true,
          order: 0
        },
        { 
          id: "default-2", 
          title: "Contact Me", 
          url: "#", 
          description: "Get in touch",
          isVisible: true,
          order: 1
        }
      ],
      socialLinks: [
        { id: "social-default-1", platform: "github", url: "#" },
        { id: "social-default-2", platform: "twitter", url: "#" },
        { id: "social-default-3", platform: "linkedin", url: "#" }
      ]
    };
  });

  const {
    currentTemplate,
    selectTemplate,
    previewTemplate: previewTemplateTemp,
    resetTemplate,
    isLoading
  } = useTemplateManager();

  const handleTemplateSelect = async (template: TemplateConfig) => {
    await selectTemplate(template);
    setActiveTab("customize"); // Switch to customization after selecting
  };

  const handlePreview = (template: TemplateConfig) => {
    setPreviewTemplate(template);
    previewTemplateTemp(template);

    // Clear preview after 3 seconds
    setTimeout(() => {
      setPreviewTemplate(null);
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="default"
            className="gap-2 bg-transparent text-xs sm:text-sm"
          >
            <Brush size={16} />
            <span className="hidden sm:inline">Design</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent 
        className="!max-w-[95vw] sm:!max-w-[98vw] !w-[95vw] sm:!w-[98vw] !h-[90vh] sm:!h-[95vh] !m-0 !p-0 !gap-0 !grid-cols-1 !grid-rows-[auto_1fr] rounded-lg overflow-hidden border shadow-lg flex flex-col bg-background"
        style={{
          maxWidth: '95vw',
          width: '95vw',
          height: '90vh',
          margin: 0,
          padding: 0,
          gap: 0,
          gridTemplateColumns: '1fr',
          gridTemplateRows: 'auto 1fr'
        }}
        showCloseButton={false}
      >
        <DialogHeader className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 pb-2 sm:pb-3 border-b bg-background flex-shrink-0 text-center relative">
          {/* Custom Close Button */}
          <DialogClose className="absolute top-2 sm:top-4 right-2 sm:right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <XIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          <DialogTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl lg:text-2xl xl:text-3xl">
            <Brush size={20} className="text-primary sm:w-6 sm:h-6" />
            Design Your TreeBio
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm lg:text-base xl:text-lg text-muted-foreground px-2">
            Choose templates, customize colors and layouts with live preview - Enhanced for spacious customization
          </DialogDescription>
        </DialogHeader>

        {/* Main Content Area - Fully Responsive Layout */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-background">
          
          {/* Design Options Panel - Responsive Width Distribution */}
          <div className="flex-1 lg:w-[60%] lg:flex-none flex flex-col bg-background lg:border-r border-border/30">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
              {/* Enhanced Tab Navigation - Fully Responsive */}
              <div className="border-b bg-gradient-to-r from-muted/10 via-muted/5 to-muted/10 px-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-12 py-2 sm:py-3 lg:py-4 xl:py-5 flex-shrink-0">
                <TabsList className="grid w-full max-w-full mx-auto grid-cols-4 h-10 sm:h-12 lg:h-14 xl:h-16 2xl:h-18 bg-background/60 backdrop-blur-sm border shadow-sm">
                  <TabsTrigger value="templates" className="gap-1 sm:gap-2 lg:gap-3 text-xs sm:text-sm lg:text-base xl:text-lg font-medium px-1 sm:px-2 lg:px-4 xl:px-6 transition-all hover:bg-primary/5">
                    <Wand2 className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6" />
                    <span className="hidden sm:inline">Templates</span>
                    <span className="sm:hidden">Tmpl</span>
                  </TabsTrigger>
                  <TabsTrigger value="customize" className="gap-1 sm:gap-2 lg:gap-3 text-xs sm:text-sm lg:text-base xl:text-lg font-medium px-1 sm:px-2 lg:px-4 xl:px-6 transition-all hover:bg-primary/5">
                    <Palette className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6" />
                    <span className="hidden sm:inline">Customize</span>
                    <span className="sm:hidden">Edit</span>
                  </TabsTrigger>
                  <TabsTrigger value="share" className="gap-1 sm:gap-2 lg:gap-3 text-xs sm:text-sm lg:text-base xl:text-lg font-medium px-1 sm:px-2 lg:px-4 xl:px-6 transition-all hover:bg-primary/5">
                    <Share2 className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6" />
                    <span className="hidden sm:inline">Share</span>
                    <span className="sm:hidden">Shr</span>
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="gap-1 sm:gap-2 lg:gap-3 text-xs sm:text-sm lg:text-base xl:text-lg font-medium px-1 sm:px-2 lg:px-4 xl:px-6 transition-all hover:bg-primary/5">
                    <Brush className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6" />
                    <span className="hidden sm:inline">Advanced</span>
                    <span className="sm:hidden">Adv</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Mobile Preview Toggle - Visible only on smaller screens */}
              <div className="lg:hidden border-b bg-background px-3 sm:px-4 py-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobilePreview(!showMobilePreview)}
                  className="w-full flex items-center gap-2 text-xs sm:text-sm"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  {showMobilePreview ? 'Hide Preview' : 'Show Preview'}
                  {(currentTemplate || previewTemplate) && (
                    <span className="text-primary">
                      ({previewTemplate?.name || currentTemplate?.name})
                    </span>
                  )}
                </Button>
              </div>

              {/* Tab Content - Fully Responsive */}
              <div className="flex-1 overflow-hidden">
                <TabsContent value="templates" className="mt-0 h-full overflow-y-auto">
                  <div className="p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12">
                    <TemplateSelector
                      currentTemplate={currentTemplate?.id}
                      onTemplateSelect={handleTemplateSelect}
                      onPreview={handlePreview}
                    />
                    
                    {/* Mobile Preview Section */}
                    {showMobilePreview && (currentTemplate || previewTemplate) && (
                      <div className="lg:hidden mt-6 pt-6 border-t bg-gradient-to-br from-muted/5 via-muted/10 to-muted/20 rounded-lg p-4">
                        <h4 className="text-center font-bold text-base mb-4">
                          Preview: {previewTemplate?.name || currentTemplate?.name}
                        </h4>
                        <div className="max-w-xs mx-auto">
                          <TemplatePreview
                            template={previewTemplate || currentTemplate!}
                            userData={userData}
                            className="scale-90 origin-center"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="customize" className="mt-0 h-full overflow-y-auto">
                  <div className="p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12">
                    <div className="text-center space-y-2 sm:space-y-3 lg:space-y-4 xl:space-y-5">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight">Customize Your Template</h3>
                      <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
                        {currentTemplate
                          ? `Fine-tune your ${currentTemplate.name} template with colors, fonts, layouts and more styling options`
                          : "Select a template first to unlock powerful customization features"
                        }
                      </p>
                    </div>

                    {currentTemplate ? (
                      <div className="max-w-6xl mx-auto space-y-8 lg:space-y-10">
                        {/* Content Editor Section */}
                        <div className="space-y-4">
                          <div className="text-center">
                            <h4 className="text-lg lg:text-xl xl:text-2xl font-bold text-primary">Edit Your Content</h4>
                            <p className="text-sm lg:text-base text-muted-foreground">Update your name, bio, links, and social media - changes appear instantly in the preview</p>
                          </div>
                          <ContentEditor
                            userData={userData}
                            onUserDataChange={setUserData}
                            className="bg-gradient-to-br from-background/50 to-muted/10 p-6 rounded-2xl border border-border/20"
                          />
                        </div>

                        {/* Theme Customizer Section */}
                        <div className="space-y-4">
                          <div className="text-center">
                            <h4 className="text-lg lg:text-xl xl:text-2xl font-bold text-primary">Customize Design</h4>
                            <p className="text-sm lg:text-base text-muted-foreground">Fine-tune colors, fonts, and layout to match your personal brand</p>
                          </div>
                          <div className="bg-gradient-to-br from-background/50 to-muted/10 p-6 rounded-2xl border border-border/20">
                            <ThemeCustomizer />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16 lg:py-24 xl:py-32 text-muted-foreground">
                        <div className="w-24 lg:w-32 xl:w-36 h-24 lg:h-32 xl:h-36 bg-gradient-to-br from-muted/20 to-muted/40 rounded-3xl lg:rounded-4xl mx-auto mb-8 lg:mb-12 xl:mb-16 flex items-center justify-center shadow-sm border border-border/20">
                          <Palette className="h-12 lg:h-16 xl:h-20 w-12 lg:w-16 xl:w-20 opacity-40" />
                        </div>
                        <h4 className="text-xl lg:text-2xl xl:text-3xl font-bold mb-3 lg:mb-4 xl:mb-6 text-foreground">No Template Selected</h4>
                        <p className="text-base lg:text-lg xl:text-xl text-muted-foreground max-w-xl mx-auto mb-8 lg:mb-12 xl:mb-16 leading-relaxed px-4">
                          Choose a template from the Templates tab to unlock comprehensive customization options with content editing, enhanced color pickers, typography controls, and layout settings
                        </p>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setActiveTab("templates")}
                          className="gap-3 px-8 lg:px-10 xl:px-12 py-3 lg:py-4 text-base lg:text-lg xl:text-xl font-medium shadow-sm hover:shadow-md transition-all"
                        >
                          <Wand2 className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7" />
                          Browse Templates
                        </Button>
                      </div>
                    )}

                    {/* Mobile Preview Toggle for Customize Tab - Enhanced */}
                    <div className="lg:hidden border-t border-border/20 pt-6 mt-8">
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowMobilePreview(!showMobilePreview)}
                          className="flex-1 gap-3 h-12 text-base font-medium shadow-sm hover:shadow-md transition-all bg-background/60 backdrop-blur-sm"
                          disabled={!currentTemplate && !previewTemplate}
                        >
                          <Eye className="h-5 w-5" />
                          {showMobilePreview ? 'Hide Preview' : 'Show Preview'}
                        </Button>
                        {(currentTemplate || previewTemplate) && (
                          <Button
                            variant="secondary" 
                            onClick={() => setShowMobilePreview(true)}
                            className="gap-2 h-12 px-4 text-sm font-medium"
                          >
                            {currentTemplate?.name || previewTemplate?.name}
                          </Button>
                        )}
                      </div>
                      
                      {/* Mobile Preview Panel for Customize */}
                      {showMobilePreview && (currentTemplate || previewTemplate) && (
                        <div className="mt-4 p-4 bg-gradient-to-br from-muted/5 via-muted/10 to-muted/20 rounded-xl border border-border/30">
                          <div className="text-center mb-3">
                            <h4 className="font-bold text-lg">Customization Preview</h4>
                            {previewTemplate && (
                              <p className="text-sm text-muted-foreground">
                                Previewing: <span className="font-bold text-primary">{previewTemplate.name}</span>
                              </p>
                            )}
                            {currentTemplate && !previewTemplate && (
                              <p className="text-sm text-muted-foreground">
                                Current: <span className="font-bold text-primary">{currentTemplate.name}</span>
                              </p>
                            )}
                          </div>
                          <div className="max-w-xs mx-auto">
                            <div className="bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-border/20">
                              <TemplatePreview
                                template={previewTemplate || currentTemplate!}
                                userData={userData}
                                className="rounded-lg overflow-hidden"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="mt-0 h-full overflow-y-auto">
                  <div className="p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12">
                    <div className="text-center space-y-3 lg:space-y-4 xl:space-y-5">
                      <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight">Advanced Settings</h3>
                      <p className="text-base lg:text-lg xl:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Reset templates, import/export configurations, and manage advanced design options with enhanced controls
                      </p>
                    </div>

                    <div className="max-w-6xl mx-auto space-y-8 lg:space-y-10 xl:space-y-12">
                      {/* Template Management Card - Enhanced */}
                      <div className="p-6 lg:p-8 xl:p-10 border-2 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-card via-card/95 to-card/90 shadow-sm hover:shadow-md transition-all duration-300 space-y-6 lg:space-y-8">
                        <div className="flex items-center gap-4 lg:gap-6">
                          <div className="w-12 lg:w-16 xl:w-18 h-12 lg:h-16 xl:h-18 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center shadow-sm border border-primary/10">
                            <Brush className="h-6 lg:h-8 xl:h-9 w-6 lg:w-8 xl:w-9 text-primary" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-lg lg:text-xl xl:text-2xl font-bold">Template Management</h4>
                            <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">
                              Current: <span className="font-semibold text-foreground bg-muted/50 px-2 lg:px-3 py-1 rounded-md">{currentTemplate?.name || "Default Template"}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 lg:gap-6">
                          <Button
                            variant="outline"
                            onClick={resetTemplate}
                            disabled={!currentTemplate}
                            className="gap-2 lg:gap-3 px-6 lg:px-8 xl:px-10 py-2 lg:py-3 text-base lg:text-lg font-medium shadow-sm hover:shadow-md transition-all"
                          >
                            <Wand2 className="h-5 w-5 lg:h-6 lg:w-6" />
                            Reset to Default
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setActiveTab("templates")}
                            className="gap-2 lg:gap-3 px-6 lg:px-8 xl:px-10 py-2 lg:py-3 text-base lg:text-lg font-medium shadow-sm hover:shadow-md transition-all"
                          >
                            <Palette className="h-5 w-5 lg:h-6 lg:w-6" />
                            Change Template
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              // Reset layout to default view
                              setActiveTab("templates");
                              setPreviewTemplate(null);
                            }}
                            className="gap-2 lg:gap-3 px-6 lg:px-8 xl:px-10 py-2 lg:py-3 text-base lg:text-lg font-medium shadow-sm hover:shadow-md transition-all"
                          >
                            <RefreshCw className="h-5 w-5 lg:h-6 lg:w-6" />
                            Reset Layout View
                          </Button>
                        </div>
                      </div>

                      {/* Import/Export Settings Card - Enhanced */}
                      <div className="p-6 lg:p-8 xl:p-10 border-2 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-card/50 via-card/40 to-card/30 space-y-6 lg:space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-muted/10 to-transparent rounded-bl-3xl"></div>
                        <div className="flex items-center gap-4 lg:gap-6 relative">
                          <div className="w-12 lg:w-16 xl:w-18 h-12 lg:h-16 xl:h-18 bg-gradient-to-br from-muted/20 to-muted/40 rounded-2xl flex items-center justify-center shadow-sm border border-muted/20">
                            <Brush className="h-6 lg:h-8 xl:h-9 w-6 lg:w-8 xl:w-9 text-muted-foreground" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-lg lg:text-xl xl:text-2xl font-bold text-muted-foreground">Import/Export Settings</h4>
                            <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">
                              Save or load custom template configurations <span className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 px-2 lg:px-3 py-1 rounded-md text-xs lg:text-sm font-medium">(Coming Soon)</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 lg:gap-6 relative">
                          <Button variant="outline" disabled className="gap-2 lg:gap-3 px-6 lg:px-8 xl:px-10 py-2 lg:py-3 text-base lg:text-lg font-medium">
                            Export Settings
                          </Button>
                          <Button variant="outline" disabled className="gap-2 lg:gap-3 px-6 lg:px-8 xl:px-10 py-2 lg:py-3 text-base lg:text-lg font-medium">
                            Import Settings
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Preview Toggle for Advanced Tab - Enhanced */}
                    <div className="lg:hidden border-t border-border/20 pt-6 mt-8">
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowMobilePreview(!showMobilePreview)}
                          className="flex-1 gap-3 h-12 text-base font-medium shadow-sm hover:shadow-md transition-all bg-background/60 backdrop-blur-sm"
                          disabled={!currentTemplate && !previewTemplate}
                        >
                          <Eye className="h-5 w-5" />
                          {showMobilePreview ? 'Hide Preview' : 'Show Preview'}
                        </Button>
                        {(currentTemplate || previewTemplate) && (
                          <Button
                            variant="secondary" 
                            onClick={() => setShowMobilePreview(true)}
                            className="gap-2 h-12 px-4 text-sm font-medium"
                          >
                            {currentTemplate?.name || previewTemplate?.name}
                          </Button>
                        )}
                      </div>
                      
                      {/* Mobile Preview Panel for Advanced */}
                      {showMobilePreview && (currentTemplate || previewTemplate) && (
                        <div className="mt-4 p-4 bg-gradient-to-br from-muted/5 via-muted/10 to-muted/20 rounded-xl border border-border/30">
                          <div className="text-center mb-3">
                            <h4 className="font-bold text-lg">Advanced Settings Preview</h4>
                            {previewTemplate && (
                              <p className="text-sm text-muted-foreground">
                                Previewing: <span className="font-bold text-primary">{previewTemplate.name}</span>
                              </p>
                            )}
                            {currentTemplate && !previewTemplate && (
                              <p className="text-sm text-muted-foreground">
                                Current: <span className="font-bold text-primary">{currentTemplate.name}</span>
                              </p>
                            )}
                          </div>
                          <div className="max-w-xs mx-auto">
                            <div className="bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-border/20">
                              <TemplatePreview
                                template={previewTemplate || currentTemplate!}
                                userData={userData}
                                className="rounded-lg overflow-hidden"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="share" className="mt-0 h-full overflow-y-auto">
                  <div className="p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12">
                    <div className="text-center space-y-3 lg:space-y-4 xl:space-y-5">
                      <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight">Share Your Profile</h3>
                      <p className="text-base lg:text-lg xl:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Share your TreeBio profile with the world and track engagement
                      </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                      <ShareProfile
                        username={userData.username || "your-username"}
                        userData={{
                          name: userData.name || "Your Name",
                          bio: userData.bio || "",
                          avatar: userData.avatar || ""
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Live Preview Panel - Responsive Design */}
          <div className="hidden lg:flex lg:w-[40%] lg:flex-none bg-gradient-to-br from-muted/5 via-muted/10 to-muted/20 flex-col border-l border-border/20">
            {/* Preview Header - Responsive */}
            <div className="border-b bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-sm p-3 sm:p-4 lg:p-5 flex-shrink-0 shadow-sm">
              <div className="text-center space-y-1 sm:space-y-2">
                <h3 className="font-bold text-lg sm:text-xl lg:text-2xl tracking-tight">Live Preview</h3>
                {previewTemplate && (
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                    Previewing: <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{previewTemplate.name}</span>
                  </p>
                )}
                {currentTemplate && !previewTemplate && (
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                    Current: <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{currentTemplate.name}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Preview Content - Responsive */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center overflow-y-auto">
              {(currentTemplate || previewTemplate) ? (
                <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl transition-all duration-500 ease-out">
                  <div className="bg-background/95 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl border-2 border-border/30 hover:shadow-3xl hover:border-border/50 hover:scale-[1.02] transition-all duration-700 ease-out">
                    <TemplatePreview
                      template={previewTemplate || currentTemplate!}
                      userData={userData}
                      className="rounded-lg lg:rounded-xl overflow-hidden"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 lg:py-16 xl:py-20 text-muted-foreground max-w-sm xl:max-w-md">
                  <div className="w-20 lg:w-24 xl:w-28 h-20 lg:h-24 xl:h-28 bg-gradient-to-br from-background/80 to-background/60 rounded-3xl mx-auto mb-6 lg:mb-8 xl:mb-10 flex items-center justify-center shadow-lg border border-border/20">
                    <Palette className="h-10 lg:h-12 xl:h-14 w-10 lg:w-12 xl:w-14 opacity-40" />
                  </div>
                  <h4 className="text-xl lg:text-2xl xl:text-3xl font-bold mb-3 lg:mb-4 xl:mb-6 text-foreground">Choose Your Style</h4>
                  <p className="text-sm lg:text-base xl:text-lg text-muted-foreground leading-relaxed px-2">
                    Select a template to see how your TreeBio will look with live updates as you customize.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile/Tablet Preview Toggle - Enhanced with Better UX */}
          <div className="xl:hidden border-t bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20 p-4 lg:p-6 flex-shrink-0">
            <div className="flex gap-3 lg:gap-4">
              <Button
                variant="outline"
                onClick={() => setShowMobilePreview(!showMobilePreview)}
                className="flex-1 gap-3 h-14 lg:h-16 text-base lg:text-lg xl:text-xl font-medium shadow-sm hover:shadow-md transition-all bg-background/60 backdrop-blur-sm"
                disabled={!currentTemplate && !previewTemplate}
              >
                <Eye className="h-5 w-5 lg:h-6 lg:w-6" />
                {showMobilePreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
              {(currentTemplate || previewTemplate) && (
                <Button
                  variant="secondary" 
                  onClick={() => setShowMobilePreview(true)}
                  className="gap-2 h-14 lg:h-16 px-6 text-base font-medium"
                >
                  {currentTemplate?.name || previewTemplate?.name}
                </Button>
              )}
            </div>
            
            {/* Mobile Preview Panel */}
            {showMobilePreview && (currentTemplate || previewTemplate) && (
              <div className="mt-6 p-4 lg:p-6 bg-gradient-to-br from-muted/5 via-muted/10 to-muted/20 rounded-xl border border-border/30">
                <div className="text-center mb-4">
                  <h4 className="font-bold text-lg lg:text-xl">Mobile Preview</h4>
                  {previewTemplate && (
                    <p className="text-sm lg:text-base text-muted-foreground">
                      Previewing: <span className="font-bold text-primary">{previewTemplate.name}</span>
                    </p>
                  )}
                  {currentTemplate && !previewTemplate && (
                    <p className="text-sm lg:text-base text-muted-foreground">
                      Current: <span className="font-bold text-primary">{currentTemplate.name}</span>
                    </p>
                  )}
                </div>
                <div className="max-w-xs mx-auto">
                  <div className="bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-border/20">
                    <TemplatePreview
                      template={previewTemplate || currentTemplate!}
                      userData={userData}
                      className="rounded-lg overflow-hidden"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Applying template...</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
