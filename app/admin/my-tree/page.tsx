import { getAllLinkForUser, getPreviewData } from "@/modules/links/actions";
import LinkForm from "@/modules/links/components/link-form";
import PreviewFrame from "@/modules/links/components/preview-frame";
import ShareMenu from "@/modules/links/components/share-menu";
import { getCurrentUsername } from "@/modules/profile/actions";
import { DesignModal } from "@/components/design-modal";

const Page = async () => {
  const profile = await getCurrentUsername();
  const links = await getAllLinkForUser();
  const previewData = await getPreviewData();

  return (
    <section className="flex flex-col gap-6 px-4 sm:px-6 py-6 ">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-0">
        <div className="flex flex-row justify-start items-center gap-3">
          <DesignModal />
          <ShareMenu username={profile?.username || ''} />
        </div>
      </div>

      {/* Main Content - Form and Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start py-14">
        <div className="order-2 lg:order-1 border-r">
          <LinkForm
            username={profile?.username || ''}
            bio={profile?.bio || ''}
            link={(links.data || []).map((link: any) => ({
              ...link,
              description: link.description || ''
            }))}
            socialLinks={(profile?.socialLinks || []).map((social: any) => ({
              ...social,
              platform: social.platform || 'instagram' // Default platform fallback
            }))}
          />
        </div>
        <div className="order-1 lg:order-2 lg:sticky lg:top-6">
          <PreviewFrame
            links={previewData.data.map((link: any) => ({
              ...link,
              description:
                link.description === null ? undefined : link.description,
              user: {
                ...link.user,
                firstName: link.user.firstName === null ? undefined : link.user.firstName,
                lastName: link.user.lastName === null ? undefined : link.user.lastName,
                imageUrl: link.user.imageUrl === null ? undefined : link.user.imageUrl,
                username: link.user.username === null ? undefined : link.user.username,
                bio: link.user.bio === null ? undefined : link.user.bio,
              },
            }))}
          />
        </div>
      </div>
    </section>
  );
};

export default Page;
