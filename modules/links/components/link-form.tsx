"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Plus,
  Instagram,
  Youtube,
  Mail,
  Archive,
  FolderPlus,
  Camera,
  Edit3,
  X,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { createUserProfile } from "@/modules/profile/actions";
import { LinkCard, LinkFormWithPreview } from "./link-card";
import { SortableLinksList } from "./sortable-links-list";
import { SocialLinkModal, SocialLinkFormData } from "./social-link-modal"; // Import the modal
import { useRealtime } from "@/components/smart-realtime-provider";

// Zod schemas
const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .max(50, "Last name must be less than 50 characters")
    .optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  imageUrl: z.string().url("Please enter a valid image URL").optional(),
});

const linkSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  url: z.string().url("Please enter a valid URL").min(1, "URL is required"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
});

const socialLinkSchema = z.object({
  platform: z.enum(["instagram", "youtube", "email"]),
  url: z.string().url("Please enter a valid URL"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type LinkFormData = z.infer<typeof linkSchema>;

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  clickCount: number;
}

interface Profile {
  firstName: string;
  lastName: string;
  username: string;
  bio?: string;
  imageUrl?: string;
}

interface SocialLink {
  id: string;
  platform: "instagram" | "youtube" | "email";
  url: string;
}

interface Props {
  username: string;
  bio: string;
  link: {
    id: string;
    title: string;
    description: string;
    url: string;
    clickCount: number;
    createdAt: Date;
  }[];
  socialLinks?: SocialLink[]; // Add social links prop
}

const LinkForm = ({ username, bio, link, socialLinks: initialSocialLinks = [] }: Props) => {
  const currentUser = useUser();
  const router = useRouter();
  
  // Use real-time context for data and operations
  const {
    isConnected,
    profileData,
    links: realtimeLinks,
    socialLinks: realtimeSocialLinks,
    updateProfile,
    addLink,
    updateLink,
    deleteLink,
    archiveLink,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
  } = useRealtime();

  const [isAddingLink, setIsAddingLink] = React.useState(false);
  const [editingProfile, setEditingProfile] = React.useState(false);
  // Use real-time data when available, fallback to props
  const [links, setLinks] = React.useState<Link[]>(realtimeLinks?.length ? realtimeLinks : link || []);
  const [userSocialLinks, setUserSocialLinks] = React.useState<SocialLink[]>(
    realtimeSocialLinks?.length ? realtimeSocialLinks : initialSocialLinks
  );
  const [isSocialModalOpen, setIsSocialModalOpen] = React.useState(false);
  const [editingSocialLink, setEditingSocialLink] = React.useState<SocialLink | null>(null);
  
  const [profile, setProfile] = React.useState<Profile>({
    firstName: profileData?.firstName || currentUser.user?.firstName || "",
    lastName: profileData?.lastName || currentUser.user?.lastName || "",
    username: profileData?.username || username || "",
    bio: profileData?.bio || bio || "",
    imageUrl:
      profileData?.avatar || 
      currentUser.user?.imageUrl ||
      `https://avatar.iran.liara.run/username?username=[${currentUser.user?.firstName}+${currentUser.user?.lastName}]`,
  });
  const [editingLinkId, setEditingLinkId] = React.useState<string | null>(null);

  // Update local state when real-time data changes
  React.useEffect(() => {
    if (realtimeLinks !== undefined) {
      setLinks(realtimeLinks);
    }
  }, [realtimeLinks]);

  React.useEffect(() => {
    if (realtimeSocialLinks !== undefined) {
      setUserSocialLinks(realtimeSocialLinks);
    }
  }, [realtimeSocialLinks]);

  React.useEffect(() => {
    if (profileData) {
      setProfile({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        username: profileData.username || "",
        bio: profileData.bio || "",
        imageUrl: profileData.avatar || profileData.imageUrl || "",
      });
    }
  }, [profileData]);

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      username: profile.username,
      bio: profile.bio || "",
    },
  });

  // Link form
  const linkForm = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
    },
  });

  // Profile submit handler
  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      // Use real-time update function
      await updateProfile(data);
      console.log("Updated Profile:", data);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      profileForm.reset();
      setEditingProfile(false);
    }
  };

  // Link submit handler
  const onLinkSubmit = async (data: LinkFormData) => {
    try {
      await addLink(data);
      console.log("Created Link:", data);
    } catch (error) {
      console.error("Something Went wrong", error);
    } finally {
      linkForm.reset();
      setIsAddingLink(false);
    }
  };

  // Social link submit handler
  const onSocialLinkSubmit = async (data: SocialLinkFormData) => {
    try {
      if (editingSocialLink) {
        // Use real-time update function
        await updateSocialLink({ ...editingSocialLink, ...data });
        console.log("Updated social link:", data);
      } else {
        // Use real-time add function
        await addSocialLink(data);
        console.log("Added social link:", data);
      }
    } catch (error) {
      console.error("Error saving social link:", error);
      toast.error("Failed to save social link.");
    } finally {
      setEditingSocialLink(null);
    }
  };

  // Delete link handler
  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteLink(linkId);
      console.log("Deleted link:", linkId);
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  // Archive link handler
  const handleArchiveLink = async (linkId: string) => {
    try {
      await archiveLink(linkId);
      console.log("Archived link:", linkId);
    } catch (error) {
      console.error("Error archiving link:", error);
    }
  };  // Edit link handler
  const handleEditLink = (linkId: string) => {
    console.log("Editing link with ID:", linkId);
    console.log("Available links:", links);
    
    const linkToEdit = links.find((l) => l.id === linkId);
    console.log("Found link to edit:", linkToEdit);
    
    if (linkToEdit) {
      setEditingLinkId(linkId);
      setIsAddingLink(true);
      
      // Pre-populate the form with the link data
      linkForm.reset({
        title: linkToEdit.title,
        url: linkToEdit.url,
        description: linkToEdit.description || "",
      });
      
      console.log("Set editing state - linkId:", linkId, "isAddingLink:", true);
    } else {
      console.error("Link not found for editing:", linkId);
      toast.error("Link not found for editing");
    }
  };

  const onEditLinkSubmit = async (data: LinkFormData) => {
    if (!editingLinkId) return;
    try {
      await updateLink({ ...data, id: editingLinkId });
      console.log("Updated link:", data);
    } catch (error) {
      console.error("Error editing link:", error);
    } finally {
      setIsAddingLink(false);
      setEditingLinkId(null);
      linkForm.reset();
    }
  };

  // Social link handlers
  const handleAddSocialLink = () => {
    setEditingSocialLink(null);
    setIsSocialModalOpen(true);
  };

  const handleEditSocialLink = (socialLink: SocialLink) => {
    setEditingSocialLink(socialLink);
    setIsSocialModalOpen(true);
  };

  const handleDeleteSocialLink = async (socialLinkId: string) => {
    try {
      // Use real-time delete function
      await deleteSocialLink(socialLinkId);
      console.log("Deleted social link:", socialLinkId);
    } catch (error) {
      console.error("Error deleting social link:", error);
      toast.error("Failed to delete social link.");
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return Instagram;
      case "youtube":
        return Youtube;
      case "email":
        return Mail;
      default:
        return Mail;
    }
  };

  const socialLinks = [
    { platform: "instagram" as const, icon: Instagram },
    { platform: "youtube" as const, icon: Youtube },
    { platform: "email" as const, icon: Mail },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 px-4 sm:px-0">
      {/* Real-time Status Indicator */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm text-gray-600">
            Real-time updates active
          </span>
        </div>
      </div>

      {/* Profile Section */}
      <Card className="border-2 border-dashed border-gray-200 hover:border-green-400 transition-colors">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative group">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-white shadow-lg">
                <AvatarImage
                  src={profile.imageUrl || "/placeholder.svg"}
                  alt={profile.username}
                />
                <AvatarFallback className="text-sm sm:text-lg font-semibold bg-gray-100 text-gray-600">
                  {profile.username.slice(0, 2).toUpperCase() || "UN"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 h-6 w-6 sm:h-8 sm:w-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera size={12} className="sm:size-[14px]" />
              </Button>
            </div>

            <div className="flex-1 w-full sm:w-auto space-y-2">
              {editingProfile ? (
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-2"
                >
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      {...profileForm.register("firstName")}
                      placeholder="First Name"
                      className="flex-1"
                    />
                    <Input
                      {...profileForm.register("lastName")}
                      placeholder="Last Name"
                      className="flex-1"
                    />
                  </div>
                  <div>
                    <Input
                      {...profileForm.register("username")}
                      placeholder="Username"
                      className="font-semibold cursor-not-allowed"
                      readOnly
                      disabled
                    />
                    {profileForm.formState.errors.username && (
                      <p className="text-sm text-red-500 mt-1">
                        {profileForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Textarea
                      {...profileForm.register("bio")}
                      placeholder="Add bio..."
                      className="resize-none"
                      rows={2}
                    />
                    {profileForm.formState.errors.bio && (
                      <p className="text-sm text-red-500 mt-1">
                        {profileForm.formState.errors.bio.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      type="submit"
                      disabled={profileForm.formState.isSubmitting}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => setEditingProfile(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">
                      {profile.username || "Add username..."}
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => setEditingProfile(true)}
                    >
                      <Edit3 size={12} />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {profile.bio || "Add bio..."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-4 flex gap-2 flex-wrap">
            {/* Display existing social links */}
            {userSocialLinks.map((socialLink) => {
              const Icon = getSocialIcon(socialLink.platform);
              return (
                <div key={socialLink.id} className="relative group">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 bg-transparent"
                    onClick={() => typeof window !== 'undefined' && window.open(socialLink.url, '_blank')}
                  >
                    <Icon size={16} />
                  </Button>
                  {/* Delete button on hover */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteSocialLink(socialLink.id)}
                  >
                    <X size={10} />
                  </Button>
                  {/* Edit on click (optional - you can add this functionality) */}
                </div>
              );
            })}
            
            {/* Add new social link button */}
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 border-dashed bg-transparent"
              onClick={handleAddSocialLink}
            >
              <Plus size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Links Section */}
      <div className="space-y-3">
        <SortableLinksList
          links={links}
          onEdit={handleEditLink}
          onArchive={handleArchiveLink}
          onDelete={handleDeleteLink}
        />

        {/* Add New Link */}
        {isAddingLink ? (
          <LinkFormWithPreview
            onCancel={() => {
              setIsAddingLink(false);
              setEditingLinkId(null);
            }}
            onSubmit={editingLinkId ? onEditLinkSubmit : onLinkSubmit}
            defaultValues={
              editingLinkId
                ? links.find((l) => l.id === editingLinkId) || {
                    title: "",
                    url: "",
                    description: "",
                  }
                : { title: "", url: "", description: "" }
            }
          />
        ) : (
          <Button
            onClick={() => setIsAddingLink(true)}
            className="w-full h-12 border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 dark:text-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            variant="outline"
          >
            <Plus size={20} className="mr-2" />
            Add Link
          </Button>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/collections/add')}
          className="flex items-center gap-2 bg-transparent cursor-pointer"
        >
          <FolderPlus size={16} />
          Add Collection
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2 bg-transparent cursor-pointer"
          onClick={() => router.push('/admin/archive')}
        >
          <Archive size={16} />
          View Archive
        </Button>
      </div>

      {/* Social Link Modal */}
      <SocialLinkModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        onSubmit={onSocialLinkSubmit}
        defaultValues={editingSocialLink ? {
          platform: editingSocialLink.platform,
          url: editingSocialLink.url
        } : undefined}
      />
    </div>
  );
};

export default LinkForm;