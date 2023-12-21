import { toast } from "react-toastify";

export const shareRoom = async (id: string) => {
  const shareData: ShareData = {
    title: "Brush!",
    text: "Come play brush with me!",
    url: `${window.location.origin}?roomId=${id}`,
  };

  try {
    if (navigator?.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${window.location.origin}?roomId=${id}`);
      toast.success("Link copied to clipboard!");
    }
  } catch (error) {
    toast.error("Failed to share room");
  }
};
