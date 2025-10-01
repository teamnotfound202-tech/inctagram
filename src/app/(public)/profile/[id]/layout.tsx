// app/profile/[id]/layout.tsx


import {PostSsr} from "@/features/postView/ui/PostSSR/PostSSR";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ProfileLayout({
                                              children,
                                              params,
                                            }: Props) {
  return (
      <>
        {children}
        {/* Модалка рендерится рядом с основным контентом */}
        <PostSsr params={params} searchParams={Promise.resolve({})} />
      </>
  );
}