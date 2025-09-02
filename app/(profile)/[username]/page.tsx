import { logProfileVist } from '@/modules/analytics/actions';
import { getUserByUsername } from '@/modules/profile/actions';
import TreeBioProfile from '@/modules/profile/components/treebio-profile';

import { redirect } from 'next/navigation';
import React from 'react';
import type { Link as DBLink, SocialLink as DBSocialLink } from '@prisma/client';

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const profileData = await getUserByUsername(username);

  if (!profileData || profileData.username !== username) {
    return redirect("/")
  }

  logProfileVist(profileData.id).catch((err) => {
    console.error("Error logging profile visit:", err);
  });

  // Ensure username is not null before passing to component
  const safeProfileData = {
    ...profileData,
    username: profileData.username || username,
    bio: profileData.bio || '',
    firstName: profileData.firstName || '',
    lastName: profileData.lastName || '',
    imageUrl: profileData.imageUrl || '',
    createdAt: profileData.createdAt.toISOString(),
    updatedAt: profileData.updatedAt.toISOString(),
    links: profileData.links.map((link: DBLink) => ({
      ...link,
      description: link.description === null ? undefined : link.description,
      createdAt: link.createdAt.toISOString(),
      updatedAt: link.updatedAt.toISOString(),
      startDate: link.startDate?.toISOString(),
      endDate: link.endDate?.toISOString()
    })),
    socialLinks: profileData.socialLinks.map((social: DBSocialLink) => ({
      ...social,
      createdAt: social.createdAt.toISOString(),
      updatedAt: social.updatedAt.toISOString()
    }))
  };

  return (
    <TreeBioProfile profileData={safeProfileData} />
  )
}

export default Page