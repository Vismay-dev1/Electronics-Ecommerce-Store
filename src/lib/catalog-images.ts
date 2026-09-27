// Locally bundled concept imagery: independent of third-party image availability.
export function productImage(name: string): string {
  const n = name.toLowerCase();
  const image =
    n.includes("halo") || n.includes("headset")
      ? "headphones"
      : n.includes("buds")
        ? "earbuds"
        : n.includes("vinyl")
          ? "turntable"
          : n.includes("boombox") || n.includes("nest")
            ? "speaker"
            : n.includes("soundbar")
              ? "soundbar"
              : n.includes("beam")
                ? "projector"
                : n.includes("vista") ||
                    n.includes("frame") ||
                    n.includes("arc")
                  ? "tv"
                  : n.includes("book")
                    ? "laptop"
                    : n.includes("slate") || n.includes("reader")
                      ? "tablet"
                      : n.includes("type")
                        ? "keyboard"
                        : n.includes("glide")
                          ? "mouse"
                          : n.includes("band")
                            ? "band"
                            : n.includes("watch") || n.includes("tag")
                              ? "watch"
                              : n.includes("sky")
                                ? "drone"
                                : n.includes("controller")
                                  ? "controller"
                                  : "camera";
  return `/images/${image}.webp`;
}
export const categoryImage: Record<string, string> = {
  audio: "/images/headphones.webp",
  compute: "/images/laptop.webp",
  wearables: "/images/watch.webp",
  play: "/images/controller.webp",
  vision: "/images/tv.webp",
  create: "/images/camera.webp",
};
